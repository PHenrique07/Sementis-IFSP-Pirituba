from sqlmodel import Session, select
from models import Usuario, ItemLoja
from crud import engine, criar_tabelas, rolar_gacha, equipar_item, obter_loja_diaria

def criar_dados_de_teste(session: Session):
    usuario = session.exec(select(Usuario).where(Usuario.email == "teste.inventory@example.com")).first()
    
    if not usuario:
        usuario = Usuario(
            nome="Pedro Henrique Santos da Silva",
            email="teste.inventory@example.com",
            senha="senha-de-teste",
            tipo_usuario="aluno",
            moedas=0
        )
        session.add(usuario)

    # Garantir que existam itens suficientes no banco para a loja diária e o gacha
    item_existente = session.exec(select(ItemLoja).where(ItemLoja.nome == "Avatar Teste 1")).first()
    if not item_existente:
        itens = [
            ItemLoja(nome="Avatar Teste 1", descricao="Teste", preco=100, tipo="avatar", imagem="t1.png", raridade="comum", trait="Nenhum"),
            ItemLoja(nome="Avatar Teste 2", descricao="Teste", preco=100, tipo="avatar", imagem="t2.png", raridade="raro", trait="Nenhum"),
            ItemLoja(nome="Avatar Teste 3", descricao="Teste", preco=100, tipo="avatar", imagem="t3.png", raridade="epico", trait="Nenhum")
        ]
        session.add_all(itens)

    session.commit()
    session.refresh(usuario)
    return usuario


def test_inventory_flow():
    # Inicializa as tabelas no banco de dados isolado do CI
    criar_tabelas()
    
    with Session(engine) as session:
        # Prepara os dados de teste (usuário e itens fictícios)
        usuario = criar_dados_de_teste(session)
        moedas_antes = usuario.moedas
        
        # Testa Loja
        loja = obter_loja_diaria(session)
        assert loja, "A loja diária não possui itens"
        
        # Adicionar moedas para garantir o gacha
        usuario.moedas += 1000
        session.add(usuario)
        session.commit()
        
        # Testa Gacha
        gacha = rolar_gacha(session, usuario.id)
        assert gacha is not None
        assert "item_id" in gacha
        
        usuario_atualizado = session.get(Usuario, usuario.id)
        assert usuario_atualizado is not None
        assert usuario_atualizado.moedas < moedas_antes + 1000
        
        # Testa Equipar Item
        resultado = equipar_item(session, usuario.id, gacha['item_id'])
        assert resultado is not None
        assert resultado["status"] == "sucesso"
