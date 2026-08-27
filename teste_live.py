import json
import jwt
import time
from app import app, SECRET_KEY

def gerar_token_professor(professor_id=1, nome="Professor Teste"):
    payload = {
        "usuario_id": professor_id,
        "nome": nome,
        "tipo": "professor"
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def testar_fluxo_completo_live():
    print("==================================================")
    print("🌱 INICIANDO TESTES DO SEMENTIS LIVE (KAHOOT)")
    print("==================================================")
    
    client = app.test_client()
    token_prof = gerar_token_professor()
    headers_prof = {"Authorization": f"Bearer {token_prof}", "Content-Type": "application/json"}

    # 1. Listar tópicos
    res_topicos = client.get("/api/live/topicos")
    assert res_topicos.status_code == 200, f"Erro ao listar topicos: {res_topicos.data}"
    topicos = res_topicos.get_json()
    print(f"✅ 1. Tópicos carregados com sucesso! Total de categorias: {len(topicos)}")
    for t in topicos:
        print(f"   - {t['icone']} {t['titulo']}: {t['total_questoes']} questões")

    # 2. Criar Sala Temporária
    payload_sala = {
        "nome": "Desafio Sustentabilidade 1º A",
        "topico": "agua",
        "qtd_perguntas": 3,
        "tempo_por_pergunta": 20
    }
    res_sala = client.post("/api/live/criar-sala", headers=headers_prof, json=payload_sala)
    assert res_sala.status_code == 201, f"Erro ao criar sala: {res_sala.data}"
    sala = res_sala.get_json()
    pin = sala["pin"]
    print(f"\n✅ 2. Sala temporária criada! PIN: {pin} | Total perguntas: {sala['total_perguntas']}")

    # 3. Alunos entram na sala
    alunos = [
        {"nome": "Lucas Verde", "avatar_id": "broto"},
        {"nome": "Beatriz Água", "avatar_id": "gota"},
        {"nome": "Gabriel Solar", "avatar_id": "sol"}
    ]
    jogadores = []
    for a in alunos:
        res_entrar = client.post("/api/live/entrar", json={"pin": pin, "nome": a["nome"], "avatar_id": a["avatar_id"]})
        assert res_entrar.status_code == 200, f"Erro ao entrar: {res_entrar.data}"
        j = res_entrar.get_json()
        jogadores.append(j)
        print(f"   - Aluno '{j['nome']}' ({j['avatar']['emoji']}) entrou na sala! ID: {j['jogador_id']}")

    # 4. Verificar Estado do Lobby
    res_estado_lobby = client.get(f"/api/live/sala/{pin}/estado?is_host=1", headers=headers_prof)
    assert res_estado_lobby.status_code == 200
    dados_lobby = res_estado_lobby.get_json()
    assert dados_lobby["status"] == "lobby"
    assert dados_lobby["total_participantes"] == 3
    print(f"\n✅ 3. Lobby validado com 3 alunos conectados!")

    # 5. Iniciar Partida (Pergunta 1)
    res_iniciar = client.post(f"/api/live/sala/{pin}/iniciar", headers=headers_prof)
    assert res_iniciar.status_code == 200
    print("\n✅ 4. Partida iniciada pelo professor! Indo para Pergunta 1...")

    # 6. Alunos respondem à Pergunta 1
    # Busca a questão interna da sala para pegar o gabarito
    from live_game import live_manager
    sala_obj = live_manager.salas[pin]
    gabarito_p1 = sala_obj["questoes"][0]["resposta_correta"]
    print(f"   - Pergunta 1: \"{sala_obj['questoes'][0]['pergunta'][:60]}...\"")
    print(f"   - Opção Correta Real: {gabarito_p1}")

    # Lucas acerta rápido (1500ms)
    res_r1 = client.post(f"/api/live/sala/{pin}/responder", json={"jogador_id": jogadores[0]["jogador_id"], "opcao": gabarito_p1, "tempo_ms": 1500})
    assert res_r1.status_code == 200, f"Erro r1: {res_r1.data}"
    assert res_r1.get_json()["sucesso"] == True

    # Beatriz acerta mais devagar (5000ms)
    res_r2 = client.post(f"/api/live/sala/{pin}/responder", json={"jogador_id": jogadores[1]["jogador_id"], "opcao": gabarito_p1, "tempo_ms": 5000})
    assert res_r2.status_code == 200

    # Gabriel erra (escolhe opção errada)
    opcao_errada = (gabarito_p1 + 1) % 4
    res_r3 = client.post(f"/api/live/sala/{pin}/responder", json={"jogador_id": jogadores[2]["jogador_id"], "opcao": opcao_errada, "tempo_ms": 3000})
    assert res_r3.status_code == 200
    print("   - Todas as 3 respostas recebidas com sucesso!")

    # 7. Revelar Resultado
    res_revelar = client.post(f"/api/live/sala/{pin}/revelar", headers=headers_prof)
    assert res_revelar.status_code == 200
    res_estado_rev = client.get(f"/api/live/sala/{pin}/estado?is_host=1", headers=headers_prof)
    dados_rev = res_estado_rev.get_json()
    print(f"\n✅ 5. Gabarito revelado! Votos por opção: {dados_rev['distribuicao_respostas']}")
    print(f"   - Curiosidade socioambiental: \"{dados_rev['questao']['curiosidade'][:70]}...\"")

    # 8. Exibir Ranking da Rodada
    res_ranking = client.post(f"/api/live/sala/{pin}/ranking", headers=headers_prof)
    assert res_ranking.status_code == 200
    res_estado_rank = client.get(f"/api/live/sala/{pin}/estado?is_host=1", headers=headers_prof)
    dados_rank = res_estado_rank.get_json()
    print("\n✅ 6. Placar da Rodada 1:")
    for pos, j in enumerate(dados_rank["ranking"], start=1):
        print(f"   #{pos} - {j['avatar']['emoji']} {j['nome']}: {j['pontos']} pts (+{j['pontos_ultima_rodada']}) | Streak: {j['streak']} | Delta: {j['delta']}")

    # 9. Avançar até o final
    print("\n✅ 7. Avançando para as próximas perguntas...")
    for q_num in range(2, dados_lobby["total_perguntas"] + 1):
        client.post(f"/api/live/sala/{pin}/proxima", headers=headers_prof)
        gab = sala_obj["questoes"][q_num - 1]["resposta_correta"]
        client.post(f"/api/live/sala/{pin}/responder", json={"jogador_id": jogadores[0]["jogador_id"], "opcao": gab, "tempo_ms": 2000})
        client.post(f"/api/live/sala/{pin}/responder", json={"jogador_id": jogadores[1]["jogador_id"], "opcao": gab, "tempo_ms": 4000})
        client.post(f"/api/live/sala/{pin}/responder", json={"jogador_id": jogadores[2]["jogador_id"], "opcao": gab, "tempo_ms": 1000})
        client.post(f"/api/live/sala/{pin}/revelar", headers=headers_prof)
        client.post(f"/api/live/sala/{pin}/ranking", headers=headers_prof)

    # 10. Encerramento e Pódio Final
    res_fim = client.post(f"/api/live/sala/{pin}/proxima", headers=headers_prof)
    assert res_fim.get_json()["status"] == "finalizado"
    res_estado_podio = client.get(f"/api/live/sala/{pin}/estado?is_host=1", headers=headers_prof)
    dados_podio = res_estado_podio.get_json()
    print("\n🏆 8. GRANDE PÓDIO FINAL SEMENTIS:")
    p1 = dados_podio["ranking"][0]
    p2 = dados_podio["ranking"][1]
    p3 = dados_podio["ranking"][2]
    print(f"   🥇 1º Lugar: {p1['nome']} ({p1['pontos']} pts)")
    print(f"   🥈 2º Lugar: {p2['nome']} ({p2['pontos']} pts)")
    print(f"   🥉 3º Lugar: {p3['nome']} ({p3['pontos']} pts)")

    print("\n🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!")
    print("==================================================")

if __name__ == "__main__":
    testar_fluxo_completo_live()
