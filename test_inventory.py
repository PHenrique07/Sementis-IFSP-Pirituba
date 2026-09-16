from sqlmodel import Session, select
from models import Usuario, ItemLoja, InventarioUsuario
from crud import rolar_gacha, equipar_item, obter_loja_diaria, engine

with Session(engine) as session:
    usuario = session.exec(select(Usuario).where(Usuario.nome=="Pedro Henrique Santos da Silva")).first()
    print("Moedas antes:", usuario.moedas)
    
    loja = obter_loja_diaria(session)
    print("Loja de hoje:", [item['nome'] for item in loja])
    
    # Adicionar moedas para garantir o gacha
    usuario.moedas += 1000
    session.add(usuario)
    session.commit()
    
    gacha = rolar_gacha(session, usuario.id)
    print("Gacha:", gacha)
    print("Moedas depois:", session.get(Usuario, usuario.id).moedas)
    
    equipar = equipar_item(session, usuario.id, gacha['item_id'])
    print("Equipar:", equipar)
