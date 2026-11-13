import pytest
from sqlmodel import Session, select

from backend.models import Usuario, ResgateRecompensa
from tests.integration.test_fluxos_api import cabecalho_usuario


def criar_jogador(engine, moedas=1000):
    with Session(engine) as session:
        usuario = Usuario(nome="Gacha", email="gacha@teste.com", senha="hash", tipo_usuario="aluno", moedas=moedas)
        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return usuario


@pytest.mark.parametrize("sorteio,raridade,quantidade", [(0, "comum", 50), (55, "raro", 150), (85, "epico", 300), (97, "lendario", 777)])
@pytest.mark.parametrize("tipo", ["moedas", "xp"])
def test_gacha_sorteia_sem_catalogo_e_persiste(cliente, banco_isolado, monkeypatch, sorteio, raridade, quantidade, tipo):
    usuario = criar_jogador(banco_isolado)
    monkeypatch.setattr("backend.crud.secrets.randbelow", lambda _: sorteio)
    monkeypatch.setattr("backend.crud.secrets.choice", lambda _: tipo)
    headers = {**cabecalho_usuario(usuario), "Idempotency-Key": "rodada-1"}
    resposta = cliente.post("/api/loja/gacha", headers=headers, json={"custo": 0, "usuario_id": 999})
    assert resposta.status_code == 200
    dados = resposta.json
    assert dados["premio"]["raridade"] == raridade
    assert dados["premio"]["quantidade"] == quantidade
    assert dados["premio"]["tipo"] == ("coins" if tipo == "moedas" else "xp")
    assert dados["saldo"] == 900 + (quantidade if tipo == "moedas" else 0)
    assert dados["perfil"]["xp"] == (quantidade if tipo == "xp" else 0)
    repetida = cliente.post("/api/loja/gacha", headers=headers, json={})
    assert repetida.status_code == 200
    assert repetida.json == dados
    with Session(banco_isolado) as session:
        salvo = session.get(Usuario, usuario.id)
        assert salvo.moedas == dados["saldo"]
        assert salvo.xp == dados["perfil"]["xp"]
        assert salvo.xp_semanal == salvo.xp
        assert len(session.exec(select(ResgateRecompensa)).all()) == 1


def test_gacha_valida_saldo_chave_e_token(cliente, banco_isolado):
    usuario = criar_jogador(banco_isolado, moedas=99)
    assert cliente.post("/api/loja/gacha", json={}).status_code == 401
    headers = cabecalho_usuario(usuario)
    for corpo in ({}, [], {"idempotency_key": 123}, {"idempotency_key": " "}):
        assert cliente.post("/api/loja/gacha", headers=headers, json=corpo).status_code == 400
    resposta = cliente.post("/api/loja/gacha", headers=headers, json={"idempotency_key": "sem-saldo"})
    assert resposta.status_code == 400
    with Session(banco_isolado) as session:
        assert session.get(Usuario, usuario.id).moedas == 99
        assert not session.exec(select(ResgateRecompensa)).all()
