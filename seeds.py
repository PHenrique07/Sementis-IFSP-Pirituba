from sqlmodel import Session, SQLModel, create_engine
from models import Usuario, Modulo, Trilha, Atividade, ItemLoja, Missao, ProgressoMissao
from passlib.hash import argon2

# Configuração igual a do app.py
sqlite_url = "sqlite:///sementis.db"
engine = create_engine(sqlite_url, echo=False)
PEPPER = "Sementis_nao_esta_com_nada_go_Gratia!"

def semear_banco():
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Verifica se já tem usuários para não duplicar toda vez que rodar
        usuario_existente = session.query(Usuario).first()
        if usuario_existente:
            print("🌱 O banco já possui dados. Sementeira cancelada para evitar duplicatas.")
            return

        print("🚜 Preparando a terra e plantando dados iniciais...")

        senha_padrao = argon2.using(memory_cost=65536, rounds=4, parallelism=4).hash("123456" + PEPPER)

        # 1. Criando Usuários para o Ranking
        usuarios = [
            Usuario(nome="Pedro", email="pedro@ifsp.edu.br", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=3200, moedas=500),
            Usuario(nome="Lucas", email="lucas@ifsp.edu.br", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=28588880, moedas=300),
            Usuario(nome="Vini", email="vini@ifsp.edu.br", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=2900000, moedas=350),
            Usuario(nome="Foltest", email="well@ifsp.edu.br", idade=67, senha=senha_padrao, tipo_usuario="aluno", xp=67, moedas=67),
            Usuario(nome="Skaisaici", email="admin@ifsp.edu.br", idade=40, senha=senha_padrao, tipo_usuario="professor", xp=9999, moedas=9999),
            Usuario(nome="Novato", email="novato@ifsp.edu.br", idade=18, senha=senha_padrao, tipo_usuario="aluno", xp=150, moedas=20),
            Usuario(nome="Osorio", email="osorio@quebrada.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=2750, moedas=100),
            Usuario(nome="Ster Leite", email="ster@leite.com", idade=22, senha=senha_padrao, tipo_usuario="aluno", xp=2600, moedas=120),
            Usuario(nome="Vibecoder 3000", email="vibe@coder.com", idade=99, senha=senha_padrao, tipo_usuario="aluno", xp=3500, moedas=800),
            Usuario(nome="Walter White", email="heisenberg@lospollos.com", idade=50, senha=senha_padrao, tipo_usuario="aluno", xp=10000, moedas=5000),
            Usuario(nome="Professor_Admin", email="admin2@ifsp.edu.br", idade=40, senha=senha_padrao, tipo_usuario="professor", xp=9999, moedas=9999),
            Usuario(nome="Gozatti", email="gozatti@bostec.edu.br", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=150, moedas=20)
            
        ]
        session.add_all(usuarios)

        # 2. Criando o Módulo 1 e Trilhas
        modulo_1 = Modulo(nome="Raízes da Sustentabilidade", descricao="Aprenda o básico sobre reciclagem e economia de água.", ordem=1)
        session.add(modulo_1)
        session.commit() # Precisa commitar para gerar o ID do módulo

        trilha_agua = Trilha(nome="Guardiões da Água", ordem=1, modulo_id=modulo_1.id)
        trilha_lixo = Trilha(nome="Mestres da Reciclagem", ordem=2, modulo_id=modulo_1.id)
        session.add_all([trilha_agua, trilha_lixo])
        session.commit()

        # 3. Criando Atividades (Bolinhas)
        atividades = [
            Atividade(nome="A Gota d'Água", tipo="leitura", ordem=1, xp_recompensa=50, moedas_recompensa=10, trilha_id=trilha_agua.id),
            Atividade(nome="Vazamento Oculto", tipo="quiz", ordem=2, xp_recompensa=100, moedas_recompensa=25, trilha_id=trilha_agua.id),
            Atividade(nome="Separando o Lixo", tipo="minigame", ordem=1, xp_recompensa=150, moedas_recompensa=30, trilha_id=trilha_lixo.id)

        ]
        session.add_all(atividades)

        # 4. Criando Itens na Loja
        itens = [
            ItemLoja(nome="Avatar Semente", descricao="Um avatar especial de semente brotando.", preco=100, tipo="avatar", imagem="assets/loja/avatar_semente.png"),
            ItemLoja(nome="Proteção de Ofensiva", descricao="Congela sua ofensiva por 1 dia se você não jogar.", preco=250, tipo="poder", imagem="assets/loja/escudo_ofensiva.png"),
            ItemLoja(nome="Coração Extra", descricao="Recupera 1 vida instantaneamente.", preco=50, tipo="consumivel", imagem="assets/loja/coracao.png")
        ]
        session.add_all(itens)

# 5. Criando Catálogo de Missões Diárias 
        missoes_catalogo = [
            Missao(titulo="Complete sua próxima lição", meta=2, xp_recompensa=50, moedas_recompensa=10, tipo_acao="concluir_fase"),
            Missao(titulo="Estude por 5 minutos seguidos", meta=5, xp_recompensa=20, moedas_recompensa=5, tipo_acao="tempo_estudo"),
            Missao(titulo="Estude por 10 minutos seguidos", meta=10, xp_recompensa=50, moedas_recompensa=15, tipo_acao="tempo_estudo"),
            Missao(titulo="Realize 3 lições perfeitas", meta=3, xp_recompensa=100, moedas_recompensa=30, tipo_acao="licao_perfeita"),
            Missao(titulo="Faça seu login diário", meta=1, xp_recompensa=10, moedas_recompensa=5, tipo_acao="login")
        ]
        session.add_all(missoes_catalogo)

        session.commit()
        print("Sucesso! Banco de dados populado com usuários, módulos e itens da loja.")

if __name__ == "__main__":
    semear_banco()