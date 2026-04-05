from crud import engine, registrar_conclusao_atividade, buscar_usuario_por_email, inserir_usuario, criar_tabelas
from models import Modulo, Trilha, Atividade
from sqlmodel import Session, select

def preparar_ambiente():
    # 1. Garante que as tabelas existem
    criar_tabelas()
    
    with Session(engine) as session:
        # 2. Cria um usuário de teste se não existir
        user = buscar_usuario_por_email("teste@ifsp.com")
        if not user:
            user = inserir_usuario("Aluno IFSP", "teste@ifsp.com", 20, "senha123", "estudante")
            print(f"✅ Usuário criado: {user.nome}")
        
        # 3. Cria um Módulo/Trilha/Atividade de teste se o banco estiver zerado
        atv = session.exec(select(Atividade)).first()
        if not atv:
            mod = Modulo(nome="Meio Ambiente", descricao="Nível 1", ordem=1)
            session.add(mod)
            session.commit()
            
            tri = Trilha(nome="Ciclo da Água", modulo_id=mod.id, ordem=1)
            session.add(tri)
            session.commit()
            
            atv = Atividade(
                nome="Introdução", 
                tipo="leitura",  # ADICIONE ISSO AQUI
                trilha_id=tri.id, 
                ordem=1, 
                xp_recompensa=10, 
                moedas_recompensa=5
            )
            session.add(atv)
            session.commit()
            print("✅ Dados de trilha criados para o teste.")
        
        return user.id, atv.id

def testar_progresso():
    id_user, id_atv = preparar_ambiente()
    
    with Session(engine) as session:
        print(f"\n--- Iniciando Teste de Conclusão ---")
        
        # Tenta concluir a atividade
        resultado = registrar_conclusao_atividade(session, id_user, id_atv)
        print(f"Resultado do CRUD: {resultado}")
        
        # Verifica se o XP subiu no banco
        from models import Usuario
        usuario_pos_teste = session.get(Usuario, id_user)
        print(f"XP atual do usuário: {usuario_pos_teste.xp}")
        print(f"Moedas atuais do usuário: {usuario_pos_teste.moedas}")

if __name__ == "__main__":
    testar_progresso()