import json
import os
from sqlmodel import Session, SQLModel, create_engine, select
from models import Usuario, Modulo, Trilha, Atividade, ItemLoja, Missao, ProgressoMissao, Questao
from passlib.hash import argon2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sementis.db")
sqlite_url = f"sqlite:///{DB_PATH}"
engine = create_engine(sqlite_url, echo=False)
PEPPER = "Sementis_nao_esta_com_nada_go_Gratia!"

def semear_banco():
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        if session.exec(select(Usuario)).first():
            print("🌱 O banco já possui dados. Sementeira cancelada para evitar duplicatas.")
            print("⚠️ DICA: Apague o arquivo 'sementis.db' e rode o seeds.py novamente.")
            return

        print("🚜 Plantando o currículo educacional completo do Sementis...")
        
        # Hashes de senha
        senha_padrao = argon2.using(memory_cost=65536, rounds=4, parallelism=4).hash("123456" + PEPPER)
        senha_pedro = argon2.using(memory_cost=65536, rounds=4, parallelism=4).hash("1073@Pedro" + PEPPER)

        # ====================================================================
        # 1. RANKING E USUÁRIOS
        # ====================================================================
        usuarios = [
            # Seu usuário de teste blindado
            Usuario(nome="Pedro Henrique Santos da Silva", email="pedroteste@gmail.com", idade=19, senha=senha_pedro, tipo_usuario="aluno", xp=3200, moedas=500, xp_semanal=950, liga_id=1),
            
            # Restante dos usuários
            Usuario(nome="Lucas", email="lucas@ifsp.edu.br", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=28588880, moedas=300, xp_semanal=820, liga_id=1),
            Usuario(nome="Vini", email="vini@ifsp.edu.br", idade=20, senha=senha_padrao, tipo_usuario="aluno", xp=2900000, moedas=350, xp_semanal=700, liga_id=1),
            Usuario(nome="Ster Leite", email="ster@leite.com", idade=22, senha=senha_padrao, tipo_usuario="aluno", xp=0, moedas=100, xp_semanal=0, liga_id=1),
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
            
            Usuario(nome="Foltest", email="well@ifsp.edu.br", idade=67, senha=senha_padrao, tipo_usuario="aluno", xp=67, moedas=67, xp_semanal=1500, liga_id=2),
            Usuario(nome="Osorio", email="osorio@quebrada.com", idade=21, senha=senha_padrao, tipo_usuario="aluno", xp=2750, moedas=100, xp_semanal=1450, liga_id=2),
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
            Usuario(nome="Kauan", email="kauan@teste.com", idade=18, senha=senha_padrao, tipo_usuario="aluno", xp=500, moedas=50, xp_semanal=550, liga_id=2),

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

        # ====================================================================
        # 2. LOJA E MISSÕES DE TESTE (Escadinha de Fases)
        # ====================================================================
        session.add_all([
            ItemLoja(nome="Avatar Semente", descricao="Um avatar especial de semente brotando.", preco=100, tipo="avatar", imagem="assets/loja/avatar_semente.png"),
            ItemLoja(nome="Proteção de Ofensiva", descricao="Congela sua ofensiva por 1 dia se você não jogar.", preco=250, tipo="poder", imagem="assets/loja/escudo_ofensiva.png"),
            ItemLoja(nome="Coração Extra", descricao="Recupera 1 vida instantaneamente.", preco=50, tipo="consumivel", imagem="assets/loja/coracao.png")
        ])

        session.add_all([
            Missao(titulo="Aqueça os Motores", meta=1, xp_recompensa=50, moedas_recompensa=10, tipo_acao="concluir_fase"),
            Missao(titulo="Passos Firmes", meta=2, xp_recompensa=100, moedas_recompensa=20, tipo_acao="concluir_fase"),
            Missao(titulo="Realizar 3 Atividades", meta=3, xp_recompensa=150, moedas_recompensa=30, tipo_acao="concluir_fase"),
            Missao(titulo="Foco no Objetivo", meta=4, xp_recompensa=200, moedas_recompensa=40, tipo_acao="concluir_fase"),
            Missao(titulo="Maratona de Aprendizado", meta=5, xp_recompensa=300, moedas_recompensa=60, tipo_acao="concluir_fase"),
            Missao(titulo="Mestre das Lições", meta=10, xp_recompensa=800, moedas_recompensa=150, tipo_acao="concluir_fase")
        ])

        # ====================================================================
        # 3. O NOVO MOTOR DE INSERÇÃO (Lendo do JSON)
        # ====================================================================
        try:
            with open(os.path.join(BASE_DIR, 'questoes.json'), 'r', encoding='utf-8') as file:
                conteudo_educacional = json.load(file)
        except Exception as e:
            print(f"❌ Erro ao ler o arquivo 'questoes.json'. Certifique-se de que ele está na mesma pasta. Erro: {e}")
            return

        for dados_modulo in conteudo_educacional:
            # Cria Módulo
            modulo = Modulo(
                nome=dados_modulo["modulo"]["nome"], 
                descricao=dados_modulo["modulo"]["descricao"], 
                ordem=dados_modulo["modulo"]["ordem"]
            )
            session.add(modulo)
            session.commit()

            # Cria Trilha
            trilha = Trilha(nome=dados_modulo["trilha"], ordem=1, modulo_id=modulo.id)
            session.add(trilha)
            session.commit()

            # Cria as Atividades (Quizzes)
            ordem_fase = 1
            for dados_atividade in dados_modulo["atividades"]:
                atv = Atividade(
                    nome=dados_atividade["nome"], 
                    tipo=dados_atividade["tipo"], 
                    ordem=ordem_fase, 
                    xp_recompensa=100, 
                    moedas_recompensa=25, 
                    trilha_id=trilha.id
                )
                session.add(atv)
                session.commit()

                # Cria as Questões
                questoes_db = []
                for q_info in dados_atividade["questoes"]:
                    conteudo = {
                        "pergunta": q_info["pergunta"],
                        "opcoes": q_info["opcoes"]
                    }
                    if "imagem_url" in q_info:
                        conteudo["imagem_url"] = q_info["imagem_url"]
                    if "curiosidade" in q_info:
                        conteudo["curiosidade"] = q_info["curiosidade"]

                    questoes_db.append(Questao(
                        atividade_id=atv.id,
                        tipo_layout=q_info["tipo"],
                        conteudo=conteudo
                    ))
                session.add_all(questoes_db)
                ordem_fase += 1

            # Cria a Fase 5 (Minigame de Chefe) no final de cada módulo
            minigame = Atividade(
                nome="Desafio Final", 
                tipo="minigame", 
                ordem=5, 
                xp_recompensa=300, 
                moedas_recompensa=100, 
                trilha_id=trilha.id
            )
            session.add(minigame)
            session.commit()

        print("✅ Sucesso Absoluto! Banco de dados educacional populado usando JSON!")

if __name__ == "__main__":
    semear_banco()