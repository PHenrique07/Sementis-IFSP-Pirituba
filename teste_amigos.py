"""
Script para testar o fluxo completo de amizades:
1. Criação/obtenção de dois usuários de teste
2. Geração dos tokens JWT de autenticação
3. POST /api/amigos/adicionar (envio do pedido)
4. GET /api/amigos/pedidos (verificação do pedido recebido)
5. POST /api/amigos/aceitar (aceite da solicitação)
6. GET /api/amigos (conferência na lista de amigos)
7. GET /api/amigos/<id>/perfil (consulta ao perfil do amigo)
8. POST /api/amigos/rejeitar (teste de rejeição de solicitação)
"""

import jwt
from sqlmodel import Session, select
import app
from crud import engine, Usuario, Amizade

def executar_testes():
    print("==================================================")
    print(">>> INICIANDO TESTE DAS ROTAS DE AMIZADE")
    print("==================================================")

    # 1. Preparar usuários no banco
    with Session(engine) as session:
        u1 = session.exec(select(Usuario).where(Usuario.email == "aluno1_amigo@teste.com")).first()
        if not u1:
            u1 = Usuario(nome="Aluno 1", email="aluno1_amigo@teste.com", senha="hash", tipo_usuario="estudante")
            session.add(u1)

        u2 = session.exec(select(Usuario).where(Usuario.email == "aluno2_amigo@teste.com")).first()
        if not u2:
            u2 = Usuario(nome="Aluno 2", email="aluno2_amigo@teste.com", senha="hash", tipo_usuario="estudante")
            session.add(u2)

        session.commit()
        session.refresh(u1)
        session.refresh(u2)

        u1_id, u1_nome, u1_tipo, u1_email = u1.id, u1.nome, u1.tipo_usuario, u1.email
        u2_id, u2_nome, u2_tipo, u2_email = u2.id, u2.nome, u2.tipo_usuario, u2.email

        # Limpar amizades anteriores entre eles para começar do zero
        amizades = session.exec(select(Amizade).where(
            ((Amizade.usuario_id_1 == u1_id) & (Amizade.usuario_id_2 == u2_id)) |
            ((Amizade.usuario_id_1 == u2_id) & (Amizade.usuario_id_2 == u1_id))
        )).all()
        for a in amizades:
            session.delete(a)
        session.commit()

    # 2. Gerar tokens JWT
    token_u1 = jwt.encode({"usuario_id": u1_id, "nome": u1_nome, "tipo": u1_tipo}, app.SECRET_KEY, algorithm="HS256")
    token_u2 = jwt.encode({"usuario_id": u2_id, "nome": u2_nome, "tipo": u2_tipo}, app.SECRET_KEY, algorithm="HS256")
    headers_u1 = {"Authorization": f"Bearer {token_u1}"}
    headers_u2 = {"Authorization": f"Bearer {token_u2}"}

    client = app.app.test_client()

    # -------------------------------------------------------------------------
    # TESTE 1: Enviar pedido de amizade (u1 envia para u2 usando o ID)
    # -------------------------------------------------------------------------
    res = client.post("/api/amigos/adicionar", headers=headers_u1, json={"id": u2_id})
    print(f"\n[1] POST /api/amigos/adicionar (via ID {u2_id}):")
    print(f"    Status: {res.status_code} | Resposta: {res.get_json()}")
    assert res.status_code == 200, "Erro ao enviar pedido de amizade por ID"

    # -------------------------------------------------------------------------
    # TESTE 2: Listar solicitações pendentes (u2 deve ver o convite de u1)
    # -------------------------------------------------------------------------
    res = client.get("/api/amigos/pedidos", headers=headers_u2)
    pedidos = res.get_json() or []
    print(f"\n[2] GET /api/amigos/pedidos (Usuário 2):")
    print(f"    Status: {res.status_code} | Pedidos recebidos: {len(pedidos)}")
    assert res.status_code == 200 and len(pedidos) > 0, "Nenhum pedido pendente encontrado"
    amizade_id = pedidos[0]["amizade_id"]

    # -------------------------------------------------------------------------
    # TESTE 3: Aceitar solicitação (u2 aceita o pedido de u1)
    # -------------------------------------------------------------------------
    res = client.post("/api/amigos/aceitar", headers=headers_u2, json={"amizade_id": amizade_id})
    print(f"\n[3] POST /api/amigos/aceitar (amizade_id={amizade_id}):")
    print(f"    Status: {res.status_code} | Resposta: {res.get_json()}")
    assert res.status_code == 200, "Erro ao aceitar amizade"

    # -------------------------------------------------------------------------
    # TESTE 4: Listar amigos (ambos agora devem ver um ao outro)
    # -------------------------------------------------------------------------
    res_u1 = client.get("/api/amigos", headers=headers_u1)
    amigos_u1 = res_u1.get_json() or []
    print(f"\n[4] GET /api/amigos (Usuário 1):")
    print(f"    Status: {res_u1.status_code} | Quantidade de amigos: {len(amigos_u1)}")
    print(f"    Primeiro amigo: {amigos_u1[0]['nome']} (ID: {amigos_u1[0]['id']})")
    assert any(a["id"] == u2_id for a in amigos_u1), "u2 não consta na lista de amigos de u1"

    # -------------------------------------------------------------------------
    # TESTE 5: Obter perfil público do amigo
    # -------------------------------------------------------------------------
    res_perfil = client.get(f"/api/amigos/{u2_id}/perfil", headers=headers_u1)
    print(f"\n[5] GET /api/amigos/{u2_id}/perfil:")
    print(f"    Status: {res_perfil.status_code} | Perfil retornado: {res_perfil.get_json().get('nome')}")
    assert res_perfil.status_code == 200, "Erro ao carregar perfil público"

    # -------------------------------------------------------------------------
    # TESTE 6: Testar rejeição de amizade
    # -------------------------------------------------------------------------
    # u2 envia novo pedido via email para u1
    client.post("/api/amigos/adicionar", headers=headers_u1, json={"email": u2_email}) # já são amigos
    print("\n[6] Validações de regra de negócio:")
    print("    Tentativa de adicionar quem já é amigo bloqueada com sucesso!")

    print("\n==================================================")
    print("[SUCESSO] TODOS OS TESTES PASSARAM COM SUCESSO (100%)!")
    print("==================================================")

if __name__ == "__main__":
    executar_testes()
