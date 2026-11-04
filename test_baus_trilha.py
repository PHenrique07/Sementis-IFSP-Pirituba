"""
test_baus_trilha.py — Testes dos baús no meio da trilha (3 toques para evoluir a raridade).
"""
import pytest
from sqlmodel import SQLModel, create_engine, Session, select
from models import Usuario, Modulo, Trilha, Atividade, ProgressoUsuario, BauColetado
from crud import (
    obter_mapa_trilha_especifica,
    abrir_bau_trilha,
    calcular_posicoes_baus,
    ORDEM_RARIDADES,
    RECOMPENSAS_BAU,
    TOQUES_BAU,
)


@pytest.fixture(name="sessao")
def fixture_sessao():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        yield s
    SQLModel.metadata.drop_all(engine)


def criar_cenario(sessao: Session, total_atividades: int = 7):
    aluno = Usuario(nome="Aluno", email="aluno@teste.com", senha="123", tipo_usuario="aluno")
    modulo = Modulo(nome="Fundamentos", descricao="Teste", ordem=1)
    sessao.add(aluno)
    sessao.add(modulo)
    sessao.commit()
    trilha = Trilha(nome="Trilha Teste", ordem=1, modulo_id=modulo.id)
    sessao.add(trilha)
    sessao.commit()
    atividades = [Atividade(nome=f"A{i}", tipo="quiz", ordem=i, trilha_id=trilha.id) for i in range(1, total_atividades + 1)]
    sessao.add_all(atividades)
    sessao.commit()
    return aluno, trilha, atividades


def concluir(sessao: Session, aluno: Usuario, atividades: list[Atividade]):
    for atv in atividades:
        sessao.add(ProgressoUsuario(usuario_id=aluno.id, atividade_id=atv.id))
    sessao.commit()


def test_posicoes_nunca_ficam_depois_da_ultima_atividade():
    assert calcular_posicoes_baus(7) == [3, 6]
    assert calcular_posicoes_baus(6) == [3]
    assert calcular_posicoes_baus(2) == []


def test_mapa_informa_status_dos_baus(sessao: Session):
    aluno, trilha, atividades = criar_cenario(sessao)
    mapa = obter_mapa_trilha_especifica(sessao, trilha.id, aluno.id)
    assert [b["status"] for b in mapa[0]["baus"]] == ["bloqueado", "bloqueado"]

    concluir(sessao, aluno, atividades[:3])
    mapa = obter_mapa_trilha_especifica(sessao, trilha.id, aluno.id)
    assert [b["status"] for b in mapa[0]["baus"]] == ["disponivel", "bloqueado"]


def test_bau_bloqueado_nao_abre(sessao: Session):
    aluno, trilha, atividades = criar_cenario(sessao)
    concluir(sessao, aluno, atividades[:2])
    resposta, status = abrir_bau_trilha(sessao, aluno.id, trilha.id, 3)
    assert status == 403


def test_posicao_invalida_retorna_404(sessao: Session):
    aluno, trilha, _ = criar_cenario(sessao)
    _, status = abrir_bau_trilha(sessao, aluno.id, trilha.id, 2)
    assert status == 404


def test_abrir_bau_entrega_recompensa_e_nao_repete(sessao: Session):
    aluno, trilha, atividades = criar_cenario(sessao)
    concluir(sessao, aluno, atividades[:3])

    resposta, status = abrir_bau_trilha(sessao, aluno.id, trilha.id, 3)
    assert status == 200
    assert len(resposta["evolucao"]) == TOQUES_BAU
    assert resposta["raridade"] == resposta["evolucao"][-1]

    # A raridade nunca regride entre um toque e outro
    indices = [ORDEM_RARIDADES.index(r) for r in resposta["evolucao"]]
    assert indices == sorted(indices)

    recompensa = RECOMPENSAS_BAU[resposta["raridade"]]
    sessao.refresh(aluno)
    assert aluno.moedas == recompensa["moedas"]
    assert aluno.xp == recompensa["xp"]

    _, status_repetido = abrir_bau_trilha(sessao, aluno.id, trilha.id, 3)
    assert status_repetido == 409
    assert len(sessao.exec(select(BauColetado)).all()) == 1

    mapa = obter_mapa_trilha_especifica(sessao, trilha.id, aluno.id)
    assert mapa[0]["baus"][0]["status"] == "coletado"
    assert mapa[0]["baus"][0]["raridade"] == resposta["raridade"]

