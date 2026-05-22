from sqlmodel import Session, SQLModel, create_engine
from models import Usuario, Modulo, Trilha, Atividade, ItemLoja, Missao, ProgressoMissao, Questao
from passlib.hash import argon2

# Configuração igual a do app.py
sqlite_url = "sqlite:///sementis.db"
engine = create_engine(sqlite_url, echo=False)
PEPPER = "Sementis_nao_esta_com_nada_go_Gratia!"

def semear_banco():
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Verifica se já tem usuários para não duplicar toda vez que rodar
        #usuario_existente = session.query(Usuario).first()
        #if usuario_existente:
        #    print("🌱 O banco já possui dados. Sementeira cancelada para evitar duplicatas.")
        #    print("⚠️ DICA: Apague o arquivo 'sementis.db' e rode o seeds.py novamente.")
        #    return

        print("🚜 Preparando a terra e plantando 45 usuários, missões e questões de teste...")

        senha_padrao = argon2.using(memory_cost=65536, rounds=4, parallelism=4).hash("123456" + PEPPER)

        # 1. Criando Usuários para o Ranking (15 por Liga)
        usuarios = [
            # === LIGA 1: BRONZE (liga_id = 1) ===
            Usuario(nome="Pedro Santos", email="pedro@ifsp.edu.br", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=3200, moedas=500, xp_semanal=950, liga_id=1),
            Usuario(nome="Lucas", email="lucas@ifsp.edu.br", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=28588880, moedas=300, xp_semanal=820, liga_id=1),
            Usuario(nome="Vini", email="vini@ifsp.edu.br", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=2900000, moedas=350, xp_semanal=700, liga_id=1),
            Usuario(nome="Novato", email="novato@ifsp.edu.br", idade=18, senha=senha_padrao, tipo_usuario="aluno", xp=150, moedas=20, xp_semanal=300, liga_id=1),
            Usuario(nome="Ana", email="ana@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=280, liga_id=1),
            Usuario(nome="Bia", email="bia@teste.com", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=260, liga_id=1),
            Usuario(nome="Caio", email="caio@teste.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=240, liga_id=1),
            Usuario(nome="Dani", email="dani@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=220, liga_id=1),
            Usuario(nome="Edu", email="edu@teste.com", idade=22, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=200, liga_id=1),
            Usuario(nome="Fabi", email="fabi@teste.com", idade=18, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=180, liga_id=1),
            Usuario(nome="Gabi", email="gabi@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=160, liga_id=1),
            Usuario(nome="Hugo", email="hugo@teste.com", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=140, liga_id=1),
            Usuario(nome="Igor", email="igor@teste.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=120, liga_id=1),
            Usuario(nome="João", email="joao@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=100, liga_id=1),
            Usuario(nome="Kauan", email="kauan@teste.com", idade=18, senha=senha_padrao, tipo_usuario="aluno", xp=100, moedas=10, xp_semanal=80, liga_id=1),
            
            # === LIGA 2: PRATA (liga_id = 2) ===
            Usuario(nome="Foltest", email="well@ifsp.edu.br", idade=67, senha=senha_padrao, tipo_usuario="aluno", xp=67, moedas=67, xp_semanal=1500, liga_id=2),
            Usuario(nome="Osorio", email="osorio@quebrada.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=2750, moedas=100, xp_semanal=1450, liga_id=2),
            Usuario(nome="Ster Leite", email="ster@leite.com", idade=22, senha=senha_padrao, tipo_usuario="aluno", xp=2600, moedas=120, xp_semanal=1300, liga_id=2),
            Usuario(nome="Gozatti", email="gozatti@bostec.edu.br", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=150, moedas=20, xp_semanal=1200, liga_id=2),
            Usuario(nome="Leo", email="leo@teste.com", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=1100, liga_id=2),
            Usuario(nome="Manu", email="manu@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=1050, liga_id=2),
            Usuario(nome="Nando", email="nando@teste.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=1000, liga_id=2),
            Usuario(nome="Otavio", email="otavio@teste.com", idade=22, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=950, liga_id=2),
            Usuario(nome="Paula", email="paula@teste.com", idade=18, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=900, liga_id=2),
            Usuario(nome="Quico", email="quico@teste.com", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=850, liga_id=2),
            Usuario(nome="Rafa", email="rafa@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=800, liga_id=2),
            Usuario(nome="Sara", email="sara@teste.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=750, liga_id=2),
            Usuario(nome="Tiago", email="tiago@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=700, liga_id=2),
            Usuario(nome="Uriel", email="uriel@teste.com", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=650, liga_id=2),
            Usuario(nome="Vera", email="vera@teste.com", idade=22, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=600, liga_id=2),

            # === LIGA 3: OURO (liga_id = 3) ===
            Usuario(nome="Walter White", email="heisenberg@lospollos.com", idade=50, senha=senha_padrao, tipo_usuario="aluno", xp=10000, moedas=5000, xp_semanal=3500, liga_id=3),
            Usuario(nome="Vibecoder 3000", email="vibe@coder.com", idade=99, senha=senha_padrao, tipo_usuario="aluno", xp=3500, moedas=800, xp_semanal=3200, liga_id=3),
            Usuario(nome="Skaisaici", email="admin@ifsp.edu.br", idade=40, senha=senha_padrao, tipo_usuario="professor", xp=9999, moedas=9999, xp_semanal=3100, liga_id=3),
            Usuario(nome="Professor_Admin", email="admin2@ifsp.edu.br", idade=40, senha=senha_padrao, tipo_usuario="professor", xp=9999, moedas=9999, xp_semanal=3000, liga_id=3),
            Usuario(nome="Xavier", email="xavier@teste.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2800, liga_id=3),
            Usuario(nome="Yuri", email="yuri@teste.com", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2700, liga_id=3),
            Usuario(nome="Zeca", email="zeca@teste.com", idade=22, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2600, liga_id=3),
            Usuario(nome="Alice", email="alice@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2500, liga_id=3),
            Usuario(nome="Beto", email="beto@teste.com", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2400, liga_id=3),
            Usuario(nome="Carol", email="carol@teste.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2300, liga_id=3),
            Usuario(nome="Denis", email="denis@teste.com", idade=18, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2200, liga_id=3),
            Usuario(nome="Eva", email="eva@teste.com", idade=19, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2100, liga_id=3),
            Usuario(nome="Fred", email="fred@teste.com", idade=22, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=2000, liga_id=3),
            Usuario(nome="Gina", email="gina@teste.com", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=1900, liga_id=3),
            Usuario(nome="Humberto", email="humberto@teste.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=2000, moedas=200, xp_semanal=1800, liga_id=3)
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

        # ====================================================================
        # 5. CATÁLOGO DE MISSÕES DIÁRIAS (COM TODAS AS DIFICULDADES)
        # ====================================================================
        missoes_catalogo = [
            # === MISSÕES BRONZE (Abaixo de 100 XP) ===
            Missao(titulo="Faça seu login diário", meta=1, xp_recompensa=20, moedas_recompensa=5, tipo_acao="login"),
            Missao(titulo="Complete sua próxima lição", meta=2, xp_recompensa=50, moedas_recompensa=10, tipo_acao="concluir_fase"),
            Missao(titulo="Assista a 1 vídeo educativo", meta=1, xp_recompensa=80, moedas_recompensa=15, tipo_acao="video"),

            # === MISSÕES PRATA (De 100 a 249 XP) ===
            Missao(titulo="Revise 2 tópicos anteriores", meta=2, xp_recompensa=100, moedas_recompensa=30, tipo_acao="revisao"),
            Missao(titulo="Estude por 10 minutos seguidos", meta=10, xp_recompensa=150, moedas_recompensa=40, tipo_acao="tempo_estudo"),

            # === MISSÕES OURO (De 250 a 499 XP) ===
            Missao(titulo="Acerte 5 questões seguidas", meta=5, xp_recompensa=250, moedas_recompensa=60, tipo_acao="acertos_seguidos"),
            Missao(titulo="Ajude 3 amigos com energias", meta=3, xp_recompensa=300, moedas_recompensa=80, tipo_acao="social"),

            # === MISSÕES DIAMANTE (Acima de 500 XP) ===
            Missao(titulo="Realize 5 lições perfeitas", meta=5, xp_recompensa=500, moedas_recompensa=100, tipo_acao="licao_perfeita"),
            Missao(titulo="Gabarite o teste final do módulo", meta=1, xp_recompensa=1000, moedas_recompensa=250, tipo_acao="teste_final")
        ]
        session.add_all(missoes_catalogo)
        
        # ====================================================================
        # 6. CRIANDO QUESTÕES DE TESTE (AQUÁRIO E EUTROFIZAÇÃO)
        # ====================================================================
        # Usando a atividade_id=1 que é "A Gota d'Água"
        
        questao_aquario = Questao(
            atividade_id=1,
            tipo_layout="simples",
            conteudo={
                "pergunta": "Como é chamado o fenômeno da imagem?",
                "imagem_url": "/assets/img/quizzes/aquario.png",
                "opcoes": [
                    {"texto": "Eutrofização", "correta": True},
                    {"texto": "Bioacumulação", "correta": False},
                    {"texto": "Proliferação de Algas", "correta": False},
                    {"texto": "Acidificação Oceânica", "correta": False}
                ]
            }
        )

        questao_grid = Questao(
            atividade_id=1, 
            tipo_layout="grid_multiplo",
            conteudo={
                "pergunta": "Selecione os efeitos que a Eutrofização causa no meio ambiente",
                "opcoes": [
                    {"texto": "PROLIFERAÇÃO DE ALGAS", "icone": "algas.png", "cor": "#8BC34A", "correta": True},
                    {"texto": "REDUÇÃO DE OXIGÊNIO", "icone": "peixe.png", "cor": "#03A9F4", "correta": True},
                    {"texto": "MORTE DE PEIXES", "icone": "esqueleto.png", "cor": "#9C27B0", "correta": True},
                    {"texto": "ÁGUA TURVA", "icone": "onda.png", "cor": "#FFEB3B", "correta": True},
                    {"texto": "DIFICULTA TRATAMENTO", "icone": "torneira.png", "cor": "#795548", "correta": False}
                ]
            }
        )

        session.add(questao_aquario)
        session.add(questao_grid)

        session.commit()
        print("Sucesso! Banco de dados populado com usuários, catálogo de missões e questões de teste.")

if __name__ == "__main__":
    semear_banco()