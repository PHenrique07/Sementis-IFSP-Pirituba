from sqlmodel import Session, select
from models import Modulo, Trilha, Atividade, Usuario, Missao
# Imports Pedro:
from crud import (engine, registrar_conclusao_atividade, buscar_usuario_por_email, 
                  inserir_usuario, criar_tabelas, sortear_missoes_diarias, atualizar_progresso_missao)

# ==========================================
# 1. Código Lucas (Progresso por Atividade)
# ==========================================
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

def testar_progresso(id_user, id_atv):
    with Session(engine) as session:
        print(f"\n--- Iniciando Teste de Conclusão (Lucas) ---")
        
        # Tenta concluir a atividade
        resultado = registrar_conclusao_atividade(session, id_user, id_atv)
        print(f"Resultado do CRUD: {resultado}")
        
        # Verifica se o XP subiu no banco
        usuario_pos_teste = session.get(Usuario, id_user)
        print(f"XP atual do usuário: {usuario_pos_teste.xp}")
        print(f"Moedas atuais do usuário: {usuario_pos_teste.moedas}")

# ==========================================
# 2. Código Pedro (Missões Diárias)
# ==========================================
def testar_missoes(id_user):
    with Session(engine) as session:
        print(f"\n--- Iniciando Teste de Missões (Pedro) ---")
        
        # 1. Testa se o sorteio pega 3 missões
        print("🎲 Sorteando 3 missões pro aluno...")
        missoes = sortear_missoes_diarias(session, id_user)
        
        # 2. Testa o Atualizador: Finge que o aluno acabou de passar de fase!
        print("🚀 Simulando que o aluno acabou de passar de fase...")
        recompensas_ganhas = atualizar_progresso_missao(session, id_user, "concluir_fase")
        
        # 3. Puxa as missões de novo para ver se a barrinha andou
        print("\n📊 STATUS DAS MISSÕES AGORA:")
        missoes_atualizadas = sortear_missoes_diarias(session, id_user)
        for progresso in missoes_atualizadas:
            missao = session.get(Missao, progresso.missao_id)
            status = "✅ CONCLUÍDA" if progresso.concluida else "⏳ PENDENTE"
            print(f"- {missao.titulo} | Progresso: {progresso.progresso_atual}/{missao.meta} | Status: {status}")

        if recompensas_ganhas:
            print(f"\n🎉 Ganhou XP extra das missões: {recompensas_ganhas}")
            usuario_final = session.get(Usuario, id_user)
            print(f"XP Total Pós-Missão: {usuario_final.xp}")

# ==========================================
# 3. Executar tudo junto
# ==========================================
if __name__ == "__main__":
    # Prepara o banco e pega os IDs
    id_usuario_teste, id_atividade_teste = preparar_ambiente()
    
    # Roda o teste do Lucas
    testar_progresso(id_usuario_teste, id_atividade_teste)
    
    # Roda teste Pedro
    testar_missoes(id_usuario_teste)