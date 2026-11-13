from datetime import date, timedelta
from concurrent.futures import ThreadPoolExecutor
from threading import Barrier

from sqlmodel import Session, SQLModel, create_engine, select

from backend.models import Usuario, ResgateRecompensa
from tests.integration.test_fluxos_api import cabecalho_usuario


def criar_aluno(engine, xp=0, email="recompensa@teste.com"):
    with Session(engine) as sessao:
        aluno = Usuario(nome="Aluno", email=email, senha="hash", tipo_usuario="aluno", xp=xp)
        sessao.add(aluno)
        sessao.commit()
        sessao.refresh(aluno)
        return aluno


def test_drone_persiste_uma_entrega_por_dia(cliente, banco_isolado):
    aluno = criar_aluno(banco_isolado)
    cabecalho = cabecalho_usuario(aluno)
    assert cliente.get("/api/drone", headers=cabecalho).json["disponivel"] is True
    resposta = cliente.post("/api/drone/resgatar", headers=cabecalho, json={"moedas": 99999})
    assert resposta.status_code == 200
    assert resposta.json["recompensa"]["moedas"] == 67
    assert resposta.json["perfil"]["moedas"] == 67
    assert cliente.post("/api/drone/resgatar", headers=cabecalho).status_code == 409
    assert cliente.get("/api/drone", headers=cabecalho).json["disponivel"] is False
    with Session(banco_isolado) as sessao:
        assert sessao.get(Usuario, aluno.id).moedas == 67
        assert len(sessao.exec(select(ResgateRecompensa)).all()) == 1


def test_drone_disponivel_outro_dia_e_outro_usuario(cliente, banco_isolado):
    aluno = criar_aluno(banco_isolado)
    outro = criar_aluno(banco_isolado, email="outro@teste.com")
    with Session(banco_isolado) as sessao:
        sessao.add(ResgateRecompensa(usuario_id=aluno.id, chave=f"drone:{date.today() - timedelta(days=1)}", moedas=67))
        sessao.commit()
    for usuario in (aluno, outro):
        assert cliente.post("/api/drone/resgatar", headers=cabecalho_usuario(usuario)).status_code == 200


def test_passe_bloqueio_coleta_e_xp_sem_autodesbloqueio(cliente, banco_isolado):
    aluno = criar_aluno(banco_isolado, xp=450)
    cabecalho = cabecalho_usuario(aluno)
    passe = cliente.get("/api/passe", headers=cabecalho).json
    assert passe["nivel_atual"] == 1
    assert {r["tipo"] for r in passe["recompensas"]} == {"moedas", "xp", "vidas"}
    assert passe["pro_disponivel"] is False
    assert cliente.post("/api/passe/2/resgatar", headers=cabecalho).status_code == 403
    assert cliente.post("/api/passe/1/resgatar", headers=cabecalho).status_code == 200
    assert cliente.post("/api/passe/1/resgatar", headers=cabecalho).status_code == 409
    with Session(banco_isolado) as sessao:
        usuario = sessao.get(Usuario, aluno.id)
        usuario.xp = 500
        sessao.add(usuario)
        sessao.commit()
    resposta = cliente.post("/api/passe/2/resgatar", headers=cabecalho)
    assert resposta.status_code == 200
    assert resposta.json["perfil"]["xp"] > 500
    assert resposta.json["perfil"]["xp_semanal"] == resposta.json["recompensa"]["xp"]
    assert resposta.json["passe"]["xp_progresso"] == 500
    assert resposta.json["passe"]["nivel_atual"] == 2
    assert cliente.post("/api/passe/3/resgatar", headers=cabecalho).status_code == 403


def test_passe_entrega_vidas_e_isola_coletas(cliente, banco_isolado):
    aluno = criar_aluno(banco_isolado, xp=1000)
    outro = criar_aluno(banco_isolado, xp=1000, email="outro@teste.com")
    for usuario in (aluno, outro):
        resposta = cliente.post("/api/passe/3/resgatar", headers=cabecalho_usuario(usuario))
        assert resposta.status_code == 200
        assert resposta.json["perfil"]["vidas"] == 6
    cabecalho = cabecalho_usuario(aluno)
    assert cliente.post("/api/passe/61/resgatar", headers=cabecalho).status_code == 404
    assert cliente.post("/api/passe/0/resgatar", headers=cabecalho).status_code == 404


def test_recompensas_exigem_autenticacao(cliente):
    for rota in ("/api/drone/resgatar", "/api/passe/1/resgatar"):
        assert cliente.post(rota).status_code in (401, 403)
    for rota in ("/api/drone", "/api/passe"):
        assert cliente.get(rota).status_code in (401, 403)


def test_resgates_simultaneos_nao_duplicam_saldo(tmp_path):
    from backend.crud import registrar_resgate

    engine = create_engine(f"sqlite:///{(tmp_path / 'resgates.db').as_posix()}",
                           connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    aluno = criar_aluno(engine)
    barreira = Barrier(2)

    def resgatar():
        with Session(engine) as sessao:
            barreira.wait(timeout=5)
            return registrar_resgate(sessao, aluno.id, "drone:teste-concorrente", {"moedas": 67})[1]

    try:
        with ThreadPoolExecutor(max_workers=2) as executor:
            resultados = list(executor.map(lambda _: resgatar(), range(2)))
        assert sorted(resultados) == [200, 409]
        with Session(engine) as sessao:
            assert sessao.get(Usuario, aluno.id).moedas == 67
            assert len(sessao.exec(select(ResgateRecompensa)).all()) == 1
    finally:
        engine.dispose()
