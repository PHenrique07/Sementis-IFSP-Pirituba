import jwt
from sqlmodel import Session

from backend.models import Usuario, Modulo, Trilha, Atividade, Questao


def cabecalho_usuario(usuario):
    from backend.app import SECRET_KEY

    token = jwt.encode({
        "usuario_id": usuario.id,
        "nome": usuario.nome,
        "tipo": usuario.tipo_usuario,
    }, SECRET_KEY, algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}


def test_cadastro_login_e_perfil(cliente):
    resposta = cliente.post("/cadastro", json={
        "nome": "Aluna Teste", "email": "aluna@teste.com", "senha": "senha-teste",
        "data_nascimento": "2000-01-01", "tipo_usuario": "aluno",
    })
    assert resposta.status_code == 201

    login = cliente.post("/login", json={"email": "aluna@teste.com", "senha": "senha-teste"})
    assert login.status_code == 200
    assert login.json["usuario"]["tipo"] == "aluno"

    perfil = cliente.get("/api/perfil", headers={"Authorization": f"Bearer {login.json['token']}"})
    assert perfil.status_code == 200
    assert perfil.json["nome"] == "Aluna Teste"
    assert perfil.json["xp_total"] == 0
    assert perfil.json["progresso_nivel"]["nivel_atual"] == 1
    assert cliente.get("/api/perfil").status_code == 401


def test_trilha_quiz_conclusao_e_bau(cliente, banco_isolado):
    with Session(banco_isolado) as sessao:
        aluno = Usuario(nome="Aluno", email="aluno@teste.com", senha="hash", tipo_usuario="aluno")
        modulo = Modulo(nome="Agua", descricao="Teste", ordem=1)
        sessao.add_all([aluno, modulo])
        sessao.commit()
        trilha = Trilha(nome="Ciclo da agua", ordem=1, modulo_id=modulo.id)
        sessao.add(trilha)
        sessao.commit()
        atividades = [Atividade(nome=f"A{i}", tipo="quiz", ordem=i, trilha_id=trilha.id) for i in range(1, 7)]
        sessao.add_all(atividades)
        sessao.commit()
        sessao.add(Questao(atividade_id=atividades[0].id, tipo_layout="quiz", conteudo={"pergunta": "Teste?"}))
        sessao.commit()
        cabecalho = cabecalho_usuario(aluno)
        trilha_id = trilha.id
        atividade_ids = [atividade.id for atividade in atividades]

    mapa = cliente.get(f"/api/trilhas/{trilha_id}", headers=cabecalho)
    assert mapa.status_code == 200
    assert mapa.json[0]["atividades"][0]["status"] == "liberada"
    assert mapa.json[0]["baus"][0]["status"] == "bloqueado"

    questoes = cliente.get(f"/api/atividades/{atividade_ids[0]}/questoes", headers=cabecalho)
    assert questoes.status_code == 200
    assert questoes.json[0]["conteudo"]["pergunta"] == "Teste?"

    for atividade_id in atividade_ids[:3]:
        conclusao = cliente.post("/completar_atividade", headers=cabecalho, json={
            "atividade_id": atividade_id, "erros": 0, "concluida_com_sucesso": True,
        })
        assert conclusao.status_code == 200
        assert conclusao.json["primeira_vez"] is True

    url_bau = f"/api/trilhas/{trilha_id}/baus/3/abrir"
    bau = cliente.post(url_bau, headers=cabecalho)
    assert bau.status_code == 200
    assert len(bau.json["evolucao"]) == 3
    assert cliente.post(url_bau, headers=cabecalho).status_code == 409


def test_criar_turma_e_matricular_aluno(cliente, banco_isolado):
    with Session(banco_isolado) as sessao:
        professor = Usuario(nome="Professor", email="prof@teste.com", senha="hash", tipo_usuario="professor")
        aluno = Usuario(nome="Aluno", email="aluno@teste.com", senha="hash", tipo_usuario="aluno")
        sessao.add_all([professor, aluno])
        sessao.commit()
        cabecalho_professor = cabecalho_usuario(professor)
        cabecalho_aluno = cabecalho_usuario(aluno)

    turma = cliente.post("/api/professor/turmas", headers=cabecalho_professor, json={"nome": "Turma Verde"})
    assert turma.status_code == 201
    assert cliente.post("/api/turmas", headers=cabecalho_aluno, json={"nome": "Outra"}).status_code == 403

    entrada = cliente.post("/api/aluno/entrar-turma", headers=cabecalho_aluno, json={"codigo": turma.json["codigo_convite"]})
    assert entrada.status_code == 200
    turmas = cliente.get("/api/aluno/minhas-turmas", headers=cabecalho_aluno)
    assert turmas.status_code == 200
    assert turmas.json["turmas"][0]["id"] == turma.json["id"]


def test_partida_live_completa(cliente):
    from backend.live_game import live_manager

    professor = Usuario(id=1, nome="Professor", email="prof@teste.com", senha="hash", tipo_usuario="professor")
    cabecalho = cabecalho_usuario(professor)
    assert cliente.get("/api/live/topicos").status_code == 200
    sala = cliente.post("/api/live/criar-sala", headers=cabecalho, json={
        "nome": "Teste", "topico": "agua", "qtd_perguntas": 3, "tempo_por_pergunta": 20,
    })
    assert sala.status_code == 201
    pin = sala.json["pin"]
    jogador = cliente.post("/api/live/entrar", json={"pin": pin, "nome": "Aluno", "avatar_id": "broto"})
    assert jogador.status_code == 200
    assert cliente.post(f"/api/live/sala/{pin}/iniciar", headers=cabecalho).status_code == 200

    for indice in range(sala.json["total_perguntas"]):
        resposta = cliente.post(f"/api/live/sala/{pin}/responder", json={
            "jogador_id": jogador.json["jogador_id"],
            "opcao": live_manager.salas[pin]["questoes"][indice]["resposta_correta"], "tempo_ms": 1000,
        })
        assert resposta.status_code == 200
        assert resposta.json["sucesso"] is True
        for acao in ("revelar", "ranking"):
            assert cliente.post(f"/api/live/sala/{pin}/{acao}", headers=cabecalho).status_code == 200
        final = cliente.post(f"/api/live/sala/{pin}/proxima", headers=cabecalho)
        assert final.status_code == 200
    assert final.json["status"] == "finalizado"
