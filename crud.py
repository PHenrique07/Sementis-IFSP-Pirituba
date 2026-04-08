from sqlmodel import SQLModel, create_engine, Session, func, select
from datetime import date
# Importando todas as tabelas do models.py
from models import Usuario, Modulo, Trilha, Atividade, ProgressoUsuario, Missao, ProgressoMissao

# 1. Sqlite local
sqlite_url = "sqlite:///sementis.db"
engine = create_engine(sqlite_url, echo=True) 

# 2. Função para criar as tabelas no banco
def criar_tabelas():
    # Vai ler todas as classes que foram importadas e criar no banco
    SQLModel.metadata.create_all(engine)

# ==========================================
# FUNÇÕES DE USUÁRIO E AUTENTICAÇÃO
# ==========================================

# 3. Função para inserir um usuário
def inserir_usuario(nome: str, email: str, idade: int, senha: str, tipo_usuario: str):
    with Session(engine) as session:
        novo_usuario = Usuario(
            nome=nome, 
            email=email, 
            idade=idade, 
            senha=senha,
            tipo_usuario=tipo_usuario
        )
        session.add(novo_usuario)
        session.commit()
        session.refresh(novo_usuario) # Puxa o ID que o banco gerou
        return novo_usuario

# 4. Função para buscar um usuário por e-mail
def buscar_usuario_por_email(email_digitado: str):
    with Session(engine) as session:
        instrucao = select(Usuario).where(Usuario.email == email_digitado)
        usuario_encontrado = session.exec(instrucao).first()
        return usuario_encontrado

# 5. Função para contar total de usuários
def contar_total_usuarios():
    with Session(engine) as session:
        total = session.exec(select(func.count(Usuario.id))).one()
        return total    

# ==========================================
# FUNÇÕES DE GAMIFICAÇÃO E PROGRESSO (CARDS)
# ==========================================

# 6. Função para adicionar XP e moedas ao usuário
def adicionar_pontuacao(session: Session, id_usuario: int, xp: int, moedas: int):
    # Busca o usuário no banco
    usuario = session.get(Usuario, id_usuario)
    
    if usuario:
        # Soma os novos valores aos atuais
        usuario.xp += xp
        usuario.moedas += moedas
        
        # Salva a alteração
        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return usuario
    return None

# 7. Registrar a conclusão de uma atividade (a bolinha)
def registrar_conclusao_atividade(session: Session, id_usuario: int, id_atividade: int):
    # Busca a atividade e o usuário primeiro
    atividade = session.get(Atividade, id_atividade)
    usuario = session.get(Usuario, id_usuario)
    
    if not atividade or not usuario:
        return {"status": "erro", "mensagem": "Usuário ou Atividade não encontrados"}

    # 1. Verifica se já existe esse progresso no banco
    ja_concluiu = session.exec(
        select(ProgressoUsuario).where(
            ProgressoUsuario.usuario_id == id_usuario, 
            ProgressoUsuario.atividade_id == id_atividade
        )
    ).first()
    
    try:
        if ja_concluiu:
            # === REFAZENDO A FASE (REPLAY) ===
            # Ganha só 20% do XP e nenhuma moeda extra. Não cria progresso novo.
            xp_reduzido = int(atividade.xp_recompensa * 0.2)
            usuario.xp += xp_reduzido
            mensagem = f"Fase refeita! Você ganhou {xp_reduzido} XP."
            
        else:
            # === PRIMEIRA VEZ JOGANDO ===
            # Dá a recompensa total e registra que ele passou de fase
            usuario.xp += atividade.xp_recompensa
            usuario.moedas += atividade.moedas_recompensa
            
            novo_progresso = ProgressoUsuario(usuario_id=id_usuario, atividade_id=id_atividade)
            session.add(novo_progresso)
            
            mensagem = f"Fase concluída! Você ganhou {atividade.xp_recompensa} XP."
            
            # TODO: Lógica para desbloquear a PRÓXIMA atividade entra aqui no futuro

        # Salva tudo de uma vez só no banco de dados (Atomicidade)
        session.add(usuario)
        session.commit()
        
        return {
            "status": "sucesso", 
            "mensagem": mensagem, 
            "xp_atual": usuario.xp, 
            "moedas_atuais": usuario.moedas
        }

    except Exception as e:
        # Se der qualquer erro no processo, cancela tudo para não bugar o XP
        session.rollback()
        return {"status": "erro", "mensagem": f"Erro interno: {str(e)}"}

def buscar_ranking_geral(session: Session, limite: int = 10):
    """Retorna o top X usuários com mais XP"""
    # select(Usuario) vai pegar a tabelaa de usuarios
    # order_by(Usuario.xp.desc()) pega o maior XP para o menor
    # limit(limite) pega so o top 10, definido no int ali encima
    instrucao = select(Usuario).order_by(Usuario.xp.desc()).limit(limite)
    return session.exec(instrucao).all()

# ==========================================
# FUNÇÕES DE LEITURA PARA O FRONT-END
# ==========================================

# 8. Listar os Módulos (Nível 1)
def listar_modulos(session: Session):
    instrucao = select(Modulo).order_by(Modulo.ordem)
    return session.exec(instrucao).all()

# 9. Listar as Trilhas de um Módulo (Nível 2)
def listar_trilhas_do_modulo(session: Session, id_modulo: int):
    instrucao = select(Trilha).where(Trilha.modulo_id == id_modulo).order_by(Trilha.ordem)
    return session.exec(instrucao).all()

# 10. Listar as Atividades/Bolinhas de uma Trilha (Nível 3)
def listar_atividades_da_trilha(session: Session, id_trilha: int):
    instrucao = select(Atividade).where(Atividade.trilha_id == id_trilha).order_by(Atividade.ordem)
    return session.exec(instrucao).all()



# 11. Sortear missões diárias para um usuário
def sortear_missoes_diarias(session: Session, id_usuario: int, qtd_missoes: int = 3):
    """
    Busca as missões do dia para o usuário. Se ele não tiver, sorteia novas.
    O parâmetro qtd_missoes permite mudar a quantidade no futuro 
    """
    hoje = date.today()
    
    # 1. Verifica se o usuário já tem missões salvas com a data de HOJE
    instrucao_hoje = select(ProgressoMissao).where(
        ProgressoMissao.usuario_id == id_usuario,
        ProgressoMissao.data_missao == hoje
    )
    progresso_hoje = session.exec(instrucao_hoje).all()
    
    # Se já tem
    if progresso_hoje:
        return progresso_hoje

    # 2. Se não tem, sortear missões
    # O func.random() faz o banco embaralhar as linhas antes de pegar
    instrucao_sorteio = select(Missao).order_by(func.random()).limit(qtd_missoes)
    novas_missoes = session.exec(instrucao_sorteio).all()
    
    # Se o banco de dados estiver vazio (sem missões cadastradas), evita dar erro
    if not novas_missoes:
        return []

    # 3. Cria o "Save" (ProgressoMissao) de cada missão sorteada para o usuário
    lista_progresso = []
    for missao in novas_missoes:
        novo_progresso = ProgressoMissao(
            usuario_id=id_usuario,
            missao_id=missao.id,
            data_missao=hoje, # Trava na data de hoje
            progresso_atual=0,
            concluida=False
        )
        session.add(novo_progresso)
        lista_progresso.append(novo_progresso)
        
    # Salva tudo no banco de uma vez só
    session.commit()
    
    # Retorna a lista nova que acabou de ser criada
    return lista_progresso


# 12. Atualizar progressao de missão REVISAR DEPOIS

def atualizar_progresso_missao(session: Session, id_usuario: int, tipo_acao_realizada: str):
    """
    Sobe o progresso de uma missão. 
    Ex: Se o aluno passou de fase, chama atualizar_progresso_missao(session, id, 'concluir_fase')
    """
    hoje = date.today()
    
    # 1. Busca as missões de HOJE, do ALUNO, que NÃO estão concluídas
    instrucao = select(ProgressoMissao).where(
        ProgressoMissao.usuario_id == id_usuario,
        ProgressoMissao.data_missao == hoje,
        ProgressoMissao.concluida == False
    )
    missoes_de_hoje = session.exec(instrucao).all()
    
    missoes_concluidas_agora = [] 
    
    # 2. Varre as missões para ver se alguma precisa da ação que ele acabou de fazer
    for progresso in missoes_de_hoje:
        missao_catalogo = session.get(Missao, progresso.missao_id)
        
        if missao_catalogo.tipo_acao == tipo_acao_realizada:
            # 3. Sobe o progresso (ex: de 0/2 vai pra 1/2)
            progresso.progresso_atual += 1
            
            # 4. Verifica se bateu a meta (ex: chegou em 2/2)
            if progresso.progresso_atual >= missao_catalogo.meta:
                progresso.concluida = True
                
                # 5. resgate automatico da recompensa (XP e Moedas)
                usuario = session.get(Usuario, id_usuario)
                usuario.xp += missao_catalogo.xp_recompensa
                usuario.moedas += missao_catalogo.moedas_recompensa
                session.add(usuario)
                
                # Guarda o nome pra devolver pro Front-end
                missoes_concluidas_agora.append({
                    "titulo": missao_catalogo.titulo,
                    "xp_ganho": missao_catalogo.xp_recompensa
                })
            
            session.add(progresso)
            
    # Salva tudo de uma vez
    session.commit()
    
    # Retorna o que ele terminou pra tela dar algum retorno visual
    return missoes_concluidas_agora