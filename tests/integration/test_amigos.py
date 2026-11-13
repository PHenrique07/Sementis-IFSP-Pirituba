import pytest
from sqlmodel import Session, select

from backend.models import Usuario, Amizade, Modulo, Trilha, Atividade, ProgressoUsuario
from tests.integration.test_fluxos_api import cabecalho_usuario


@pytest.fixture
def colegas(banco_isolado):
    with Session(banco_isolado) as sessao:
        usuarios = [Usuario(id=i, nome=f"Aluno {i}", email=f"aluno{i}@teste.com", senha="hash",
                            tipo_usuario="aluno") for i in (1, 2, 3)]
        sessao.add_all(usuarios)
        sessao.commit()
        for usuario in usuarios:
            sessao.refresh(usuario)
        return usuarios


def test_enviar_aceitar_e_listar_amigos(cliente, banco_isolado, colegas):
    remetente, destinatario, terceiro = map(cabecalho_usuario, colegas)
    resposta = cliente.post('/api/amigos/adicionar', headers=remetente, json={'email': ' ALUNO2@TESTE.COM '})
    assert resposta.status_code == 201
    amizade_id = resposta.json['amizade_id']
    pedidos = cliente.get('/api/amigos/pedidos', headers=destinatario).json
    assert pedidos[0]['amizade_id'] == amizade_id
    assert pedidos[0]['remetente_id'] == 1
    assert cliente.get('/api/amigos/pedidos', headers=terceiro).json == []
    assert cliente.get('/api/amigos', headers=remetente).json == []
    assert cliente.post('/api/amigos/aceitar', headers=terceiro, json={'amizade_id': amizade_id}).status_code == 403
    assert cliente.post('/api/amigos/aceitar', headers=destinatario, json={'amizade_id': amizade_id}).status_code == 200
    for cabecalho, esperado in ((remetente, 2), (destinatario, 1)):
        amigos = cliente.get('/api/amigos', headers=cabecalho).json
        assert [a['id'] for a in amigos] == [esperado]
        assert isinstance(amigos[0]['nivel'], int)
        assert 'senha' not in amigos[0]
    assert cliente.get('/api/amigos/pedidos', headers=destinatario).json == []
    assert cliente.post('/api/amigos/rejeitar', headers=destinatario, json={'amizade_id': amizade_id}).status_code == 409


def test_convite_por_id_identidade_do_token_e_repeticao(cliente, banco_isolado, colegas):
    cabecalho = cabecalho_usuario(colegas[0])
    resposta = cliente.post('/api/amigos/adicionar', headers=cabecalho, json={'id': 2, 'usuario_id': 3})
    assert resposta.status_code == 201
    assert cliente.post('/api/amigos/adicionar', headers=cabecalho, json={'id': 2}).status_code == 409
    assert cliente.post('/api/amigos/adicionar', headers=cabecalho_usuario(colegas[1]), json={'id': 1}).status_code == 409
    with Session(banco_isolado) as sessao:
        amizade = sessao.exec(select(Amizade)).one()
        assert (amizade.usuario_id_1, amizade.usuario_id_2) == (1, 2)
    amizade_id = resposta.json['amizade_id']
    assert cliente.post('/api/amigos/rejeitar', headers=cabecalho, json={'amizade_id': amizade_id}).status_code == 403
    assert cliente.post('/api/amigos/rejeitar', headers=cabecalho_usuario(colegas[1]), json={'amizade_id': amizade_id}).status_code == 200
    assert cliente.post('/api/amigos/adicionar', headers=cabecalho, json={'id': 2}).status_code == 201


@pytest.mark.parametrize('payload, status', [
    ({'id': 1}, 400), ({'id': 999}, 404), ({'email': 'ausente@teste.com'}, 404),
    ({'id': True}, 400), ({'id': 2.5}, 400), ({'id': '2'}, 400),
    ({'email': []}, 400), ({'email': ''}, 400), ({}, 400), ([], 400),
])
def test_convites_invalidos(cliente, colegas, payload, status):
    resposta = cliente.post('/api/amigos/adicionar', headers=cabecalho_usuario(colegas[0]), json=payload)
    assert resposta.status_code == status
    assert resposta.json['status'] == 'erro'


def test_amigos_exigem_token(cliente):
    for rota in ('/api/amigos', '/api/amigos/pedidos'):
        assert cliente.get(rota).status_code in (401, 403)
    for rota in ('/api/amigos/adicionar', '/api/amigos/aceitar', '/api/amigos/rejeitar'):
        assert cliente.post(rota, json={'id': 2}).status_code in (401, 403)


def test_progresso_clima_reflete_apenas_licoes_do_usuario(cliente, banco_isolado, colegas):
    with Session(banco_isolado) as sessao:
        sessao.add(Modulo(id=3, nome='Mudanças Climáticas', descricao='Clima', ordem=3))
        sessao.add(Trilha(id=3, modulo_id=3, nome='Clima', ordem=1))
        sessao.add_all([Atividade(id=i, trilha_id=3, nome=f'Lição {i}', tipo='quiz', ordem=i) for i in range(1, 5)])
        sessao.commit()
    cabecalho = cabecalho_usuario(colegas[0])
    modulo = cliente.get('/api/modulos/progresso', headers=cabecalho).json[0]
    assert (modulo['atividades_concluidas'], modulo['total_atividades']) == (0, 4)
    with Session(banco_isolado) as sessao:
        sessao.add_all([ProgressoUsuario(usuario_id=1, atividade_id=1), ProgressoUsuario(usuario_id=1, atividade_id=2),
                       ProgressoUsuario(usuario_id=2, atividade_id=3)])
        sessao.commit()
    modulo = cliente.get('/api/modulos/progresso', headers=cabecalho).json[0]
    assert (modulo['atividades_concluidas'], modulo['total_atividades'], modulo['porcentagem']) == (2, 4, 50)
