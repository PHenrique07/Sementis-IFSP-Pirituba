"""
test_turmas_e_trilhas.py — Testes unitários para o fluxo de turmas do aluno e gerenciamento de trilhas pelo professor.
"""
import pytest
from datetime import datetime, timedelta
from sqlmodel import SQLModel, create_engine, Session, select
from backend.models import Usuario, Modulo, Trilha, Atividade, Turma, TurmaAluno, TurmaTrilha, ProgressoUsuario
from backend.crud import (
    sincronizar_turmas_da_trilha,
    obter_mapa_trilha_especifica,
    listar_turmas_do_aluno,
    obter_ranking_da_turma,
    listar_trilhas_do_professor,
    listar_trilhas_da_turma,
    listar_progresso_geral_modulos
)

@pytest.fixture(name="sessao")
def fixture_sessao():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False}
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        yield s
    SQLModel.metadata.drop_all(engine)


@pytest.mark.parametrize("historico, esperado", [
    ([], 1),
    ([(1, 2, 1)], 1),  # Progresso de outro aluno não muda o destaque.
    ([(1, 1, 1)], 1),
    ([(1, 1, 1), (2, 1, 2)], 2),
    ([(3, 1, 1), (1, 1, 2)], 1),  # A data prevalece sobre a ordem dos módulos.
    ([(3, 1, 1), (1, 2, 2)], 3),
])
def test_destaque_modulo_acompanha_ultima_conclusao(sessao, historico, esperado):
    sessao.add_all([
        Usuario(id=1, nome="Aluno", email="aluno@teste.com", senha="123", tipo_usuario="aluno"),
        Usuario(id=2, nome="Outro", email="outro@teste.com", senha="123", tipo_usuario="aluno"),
    ])
    for indice in range(1, 4):
        sessao.add(Modulo(id=indice, nome=f"Módulo {indice}", descricao="Teste", ordem=indice))
        sessao.add(Trilha(id=indice, nome="Trilha", modulo_id=indice, ordem=1))
        sessao.add(Atividade(id=indice, nome="Lição", trilha_id=indice, tipo="quiz", ordem=1))
    for atividade_id, usuario_id, dia in historico:
        sessao.add(ProgressoUsuario(
            atividade_id=atividade_id, usuario_id=usuario_id,
            data_conclusao=datetime(2026, 1, 1) + timedelta(days=dia)
        ))
    sessao.commit()

    modulos = listar_progresso_geral_modulos(sessao, 1)
    assert [m["modulo_id"] for m in modulos if m["em_destaque"]] == [esperado]


def test_destaque_ignora_modulo_sem_atividades(sessao):
    sessao.add_all([
        Modulo(id=1, nome="Vazio", descricao="Teste", ordem=1),
        Modulo(id=2, nome="Disponível", descricao="Teste", ordem=2),
        Trilha(id=1, nome="Trilha", modulo_id=2, ordem=1),
        Atividade(id=1, nome="Lição", trilha_id=1, tipo="quiz", ordem=1),
    ])
    sessao.commit()
    modulos = listar_progresso_geral_modulos(sessao, 1)
    assert [m["modulo_id"] for m in modulos if m["em_destaque"]] == [2]


def test_fluxo_turma_aluno_e_ranking(sessao: Session):
    # Cria professor
    prof = Usuario(nome="Prof. Silva", email="prof@teste.com", senha="123", tipo_usuario="professor")
    sessao.add(prof)
    sessao.commit()
    sessao.refresh(prof)

    # Cria turma
    turma = Turma(nome="3º Ano Informática", professor_id=prof.id, codigo_convite="INFO3A")
    sessao.add(turma)
    sessao.commit()
    sessao.refresh(turma)

    # Cria 2 alunos
    aluno1 = Usuario(nome="Carlos", email="carlos@teste.com", senha="123", tipo_usuario="aluno", xp_semanal=150, ofensiva=4)
    aluno2 = Usuario(nome="Beatriz", email="beatriz@teste.com", senha="123", tipo_usuario="aluno", xp_semanal=300, ofensiva=7)
    sessao.add(aluno1)
    sessao.add(aluno2)
    sessao.commit()
    sessao.refresh(aluno1)
    sessao.refresh(aluno2)

    # Matricula alunos na turma
    sessao.add(TurmaAluno(turma_id=turma.id, aluno_id=aluno1.id))
    sessao.add(TurmaAluno(turma_id=turma.id, aluno_id=aluno2.id))
    sessao.commit()

    # Testa listar turmas do aluno
    turmas_carlos = listar_turmas_do_aluno(sessao, aluno1.id)
    assert len(turmas_carlos) == 1
    assert turmas_carlos[0]["nome"] == "3º Ano Informática"
    assert turmas_carlos[0]["professor_nome"] == "Prof. Silva"
    assert turmas_carlos[0]["total_alunos"] == 2

    # Testa ranking da turma (Beatriz deve ser 1ª pois tem 300 xp_semanal contra 150 do Carlos)
    ranking = obter_ranking_da_turma(sessao, turma.id)
    assert len(ranking) == 2
    assert ranking[0]["nome"] == "Beatriz"
    assert ranking[0]["xp_semanal"] == 300
    assert ranking[0]["posicao"] == 1
    assert ranking[1]["nome"] == "Carlos"
    assert ranking[1]["posicao"] == 2


def test_sincronizacao_e_mapa_trilha_especifica(sessao: Session):
    prof = Usuario(nome="Prof. Lima", email="lima@teste.com", senha="123", tipo_usuario="professor")
    sessao.add(prof)
    sessao.commit()
    sessao.refresh(prof)

    turma1 = Turma(nome="Turma A", professor_id=prof.id, codigo_convite="TURMAA")
    turma2 = Turma(nome="Turma B", professor_id=prof.id, codigo_convite="TURMAB")
    sessao.add(turma1)
    sessao.add(turma2)
    sessao.commit()
    sessao.refresh(turma1)
    sessao.refresh(turma2)

    trilha = Trilha(nome="Energia Solar no Cotidiano", modulo_id=1, ordem=1, professor_id=prof.id)
    sessao.add(trilha)
    sessao.commit()
    sessao.refresh(trilha)

    # Adiciona atividades na trilha
    atv1 = Atividade(trilha_id=trilha.id, nome="Conceitos Básicos", tipo="quiz", ordem=1)
    atv2 = Atividade(trilha_id=trilha.id, nome="Painéis Fotovoltaicos", tipo="quiz", ordem=2)
    atv3 = Atividade(trilha_id=trilha.id, nome="Desafio FlapFish", tipo="minigame", ordem=3)
    sessao.add_all([atv1, atv2, atv3])
    sessao.commit()

    # Sincroniza turma 1
    sincronizar_turmas_da_trilha(sessao, trilha.id, [turma1.id])
    trilhas_prof = listar_trilhas_do_professor(sessao, prof.id)
    assert len(trilhas_prof) == 1
    assert trilhas_prof[0]["nome"] == "Energia Solar no Cotidiano"
    assert trilhas_prof[0]["turmas_atribuidas"] == 1
    assert trilhas_prof[0]["turmas"][0]["id"] == turma1.id

    # Sincroniza para turmas 1 e 2
    sincronizar_turmas_da_trilha(sessao, trilha.id, [turma1.id, turma2.id])
    trilhas_prof = listar_trilhas_do_professor(sessao, prof.id)
    assert trilhas_prof[0]["turmas_atribuidas"] == 2

    # Verifica mapa para aluno
    aluno = Usuario(nome="Joao", email="joao@teste.com", senha="123", tipo_usuario="aluno")
    sessao.add(aluno)
    sessao.commit()
    sessao.refresh(aluno)

    mapa = obter_mapa_trilha_especifica(sessao, trilha.id, aluno.id)
    assert len(mapa) == 1
    assert mapa[0]["trilha_nome"] == "Energia Solar no Cotidiano"
    assert len(mapa[0]["atividades"]) == 3
    # A primeira atividade deve estar liberada, as outras bloqueadas
    assert mapa[0]["atividades"][0]["status"] == "liberada"
    assert mapa[0]["atividades"][1]["status"] == "bloqueada"

    # Conclui a primeira atividade
    sessao.add(ProgressoUsuario(usuario_id=aluno.id, atividade_id=atv1.id, completou=True))
    sessao.commit()

    mapa_apos = obter_mapa_trilha_especifica(sessao, trilha.id, aluno.id)
    assert mapa_apos[0]["atividades"][0]["status"] == "concluida"
    assert mapa_apos[0]["atividades"][1]["status"] == "liberada"
    assert mapa_apos[0]["atividades"][2]["status"] == "bloqueada"
