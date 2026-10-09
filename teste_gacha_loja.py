"""
Script de testes para validar o sistema de Loja, Gacha e Inventário.
"""

import jwt
from sqlmodel import Session, select
import app
from crud import engine, Usuario, ItemLoja, InventarioUsuario

def executar_testes():
    print("==================================================")
    print(">>> INICIANDO TESTE DE LOJA, GACHA E INVENTARIO")
    print("==================================================")

    # 1. Preparar itens na loja se não houver avatares ou consumíveis
    with Session(engine) as session:
        # Garante usuário de teste com moedas
        user = session.exec(select(Usuario).where(Usuario.email == "alunoloja@teste.com")).first()
        if not user:
            user = Usuario(nome="Aluno Loja", email="alunoloja@teste.com", senha="hash", tipo_usuario="estudante", moedas=1000, vidas=3, freezes=0)
            session.add(user)
        else:
            user.moedas = 1000
            user.vidas = 3
            user.freezes = 0
            session.add(user)

        # Garante avatares cadastrados no banco
        avatares = session.exec(select(ItemLoja).where(ItemLoja.tipo == "avatar")).all()
        if not avatares:
            item1 = ItemLoja(nome="Avatar Sementinha", descricao="Avatar verde fofo", preco=150, tipo="avatar", raridade="comum", imagem="/assets/avatars/avatar1.png")
            item2 = ItemLoja(nome="Avatar Carvalho", descricao="Avatar épico de carvalho", preco=500, tipo="avatar", raridade="epico", imagem="/assets/avatars/avatar2.png")
            session.add(item1)
            session.add(item2)

        # Garante consumíveis
        vida_extra = session.exec(select(ItemLoja).where(ItemLoja.nome == "Vida Extra")).first()
        if not vida_extra:
            vida_extra = ItemLoja(nome="Vida Extra", descricao="Recupera 1 vida", preco=50, tipo="poder", raridade="comum")
            session.add(vida_extra)

        session.commit()
        session.refresh(user)
        user_id = user.id
        user_nome = user.nome
        user_tipo = user.tipo_usuario

    token = jwt.encode({"usuario_id": user_id, "nome": user_nome, "tipo": user_tipo}, app.SECRET_KEY, algorithm="HS256")
    headers = {"Authorization": f"Bearer {token}"}
    client = app.app.test_client()

    # TESTE 1: GET /api/loja/diaria
    res = client.get("/api/loja/diaria")
    print(f"\n[1] GET /api/loja/diaria: Status {res.status_code}")
    assert res.status_code == 200, "Erro ao obter loja diária"
    itens_diarios = res.get_json()
    print(f"    Itens ofertados hoje: {len(itens_diarios)}")

    # TESTE 2: POST /api/loja/gacha
    res_gacha = client.post("/api/loja/gacha", headers=headers, json={"custo": 100})
    print(f"\n[2] POST /api/loja/gacha: Status {res_gacha.status_code}")
    dados_gacha = res_gacha.get_json()
    print(f"    Item sorteado: {dados_gacha.get('nome')} | Saldo restante: {dados_gacha.get('saldo')}")
    assert res_gacha.status_code == 200, "Erro ao rolar gacha"
    item_ganho_id = dados_gacha.get("item_id")

    # TESTE 3: GET /api/inventario
    res_inv = client.get("/api/inventario", headers=headers)
    print(f"\n[3] GET /api/inventario: Status {res_inv.status_code}")
    inventario = res_inv.get_json()
    print(f"    Itens no inventário: {len(inventario)}")
    assert res_inv.status_code == 200 and len(inventario) > 0, "Inventário vazio após gacha"

    # TESTE 4: POST /api/inventario/equipar
    res_equipar = client.post("/api/inventario/equipar", headers=headers, json={"item_id": item_ganho_id})
    print(f"\n[4] POST /api/inventario/equipar: Status {res_equipar.status_code}")
    print(f"    Resposta: {res_equipar.get_json()}")
    assert res_equipar.status_code == 200, "Erro ao equipar item"

    # TESTE 5: POST /api/inventario/usar
    with Session(engine) as session:
        # Dá 1 vida extra no inventário para testar o uso
        vida_item = session.exec(select(ItemLoja).where(ItemLoja.nome == "Vida Extra")).first()
        inv_item = InventarioUsuario(usuario_id=user_id, item_id=vida_item.id, quantidade=1)
        session.add(inv_item)
        session.commit()

    res_usar = client.post("/api/inventario/usar", headers=headers, json={"coracao": 1})
    print(f"\n[5] POST /api/inventario/usar: Status {res_usar.status_code}")
    dados_usar = res_usar.get_json()
    print(f"    Resposta: {dados_usar.get('mensagem')} | Vidas atualizadas: {dados_usar.get('totais', {}).get('vidas')}")
    assert res_usar.status_code == 200, "Erro ao consumir item"

    print("\n==================================================")
    print("[SUCESSO] TODOS OS TESTES DE LOJA/GACHA PASSARAM (100%)!")
    print("==================================================")

if __name__ == "__main__":
    executar_testes()
