from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
#Pedro -> Adicionei a nova função de ranking por liga, a outra não existe mais
from crud import (engine, criar_tabelas, inserir_usuario, buscar_usuario_por_email,
    registrar_conclusao_atividade, listar_modulos, listar_trilhas_do_modulo,
    listar_atividades_da_trilha, buscar_ranking_por_liga, atualizar_progresso_missao,
    sortear_missoes_diarias, calcular_nivel, buscar_questoes_por_atividade,
    listar_progresso_geral_modulos, atualizar_ofensiva,
    criar_turma, listar_turmas_do_professor, listar_alunos_da_turma, entrar_na_turma) 
from passlib.hash import argon2
from functools import wraps
import os
from datetime import datetime, timezone, timedelta
import jwt
from sqlmodel import Session, select, create_engine, func
from models import Usuario, Modulo, Trilha, Atividade, ProgressoUsuario, Missao, Turma, TurmaAluno, AvisoTurma

app = Flask(__name__)

# Caminho absoluto da pasta do projeto — resolve o problema do PythonAnywhere
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

SECRET_KEY = "chave_super_secreta_2026_GRATIA!"

# =====================================================================
# --- ALTERAÇÃO FEITA POR PEDRO SANTOS ---
# Ativação do CORS (Cross-Origin Resource Sharing). 
# Sem isso, o navegador do Vini bloqueava a requisição de cadastro
# achando que era um ataque, impedindo o Front de falar com a API.
CORS(app)
# =====================================================================

# PEPPER: Uma chave secreta que só nós sabemos. 
# Ela NÃO fica no banco de dados. Isso impede que hackers quebrem as senhas
# mesmo que eles consigam roubar o arquivo sementis.db.
PEPPER = "Sementis_nao_esta_com_nada_go_Gratia!"

# Config do argon2id 
# m=65536: Usa 64MB de RAM (Memory Hard) para travar placas de vídeo
# t=4: Faz o processo 4 vezes para cansar o processador (CPU Hard)
# p=4: Divide o trabalho em 4 núcleos (Paralelismo)
config_argon2 = argon2.using(
    memory_cost=65536, 
    rounds=4, 
    parallelism=4
)

# Garante que as tabelas do banco de dados sejam criadas ao iniciar o app
criar_tabelas()
# =====================================================================
#                           --- Tokens ---
# =====================================================================
#Função criada para não repetir o mesmo codigo em cada rota
def token_obrigatorio(f):
    """Decorador que protege rotas - só acessa com token válido"""
    @wraps(f)
    def decorador(*args, **kwargs):
        token = None
        
        # Pega o token do cabeçalho Authorization ou query parameter
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace('Bearer ', '')
        elif 'token' in request.args:
            token = request.args.get('token')
        
        if not token:
            return jsonify({"erro": "Token não fornecido!"}), 401
        
        try:
            dados_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.usuario_id = dados_token['usuario_id']
            request.usuario_nome = dados_token['nome']
            request.usuario_tipo = dados_token['tipo']
        except jwt.ExpiredSignatureError:
            return jsonify({"erro": "Token expirado! Faça login novamente."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"erro": "Token inválido!"}), 401
        
        return f(*args, **kwargs)
    return decorador

# =====================================================================
# --- ROTAS PARA SERVIR ARQUIVOS ESTÁTICOS (CSS, JS, IMAGENS) ---
# =====================================================================

@app.route('/')
def index():
    """Serve a página inicial"""
    return send_from_directory(BASE_DIR, 'index.html')

# Rota para servir qualquer arquivo estático
@app.route('/<path:filename>')
def serve_static(filename):
    """Serve arquivos CSS, JS, imagens, etc."""
    caminho_completo = os.path.join(BASE_DIR, filename)
    if os.path.exists(caminho_completo):
        return send_from_directory(BASE_DIR, filename)
    else:
        return f"Arquivo não encontrado: {filename}", 404

# Rota específica para a página de trilhas
@app.route('/trilhas.html')
def trilha():
    """Serve a página de trilhas"""
    return send_from_directory(BASE_DIR, 'trilhas.html')

# =====================================================================
# --- ROTAS DE API ---
# =====================================================================

# --- Rota de Cadastro ---
@app.route('/cadastro', methods=['POST'])
def cadastro():
    # Pega os dados enviados pelo Vini (ou pelo Front-end)
    dados = request.get_json()
    
    if not dados:
        return jsonify({"erro": "Nenhum dado recebido"}), 400

    # Pega a senha que o cliente digitou
    senha_limpa = dados.get('senha')

    # --- Criptografia ---
    # 1. Misturamos a senha do cliente com a nossa Pepper
    senha_com_pimenta = senha_limpa + PEPPER
    
    # 2. Transformamos a senha em um "Hash" (oh meu Deus, o que eu fiz?)
    # O Argon2id vai usar as configurações pesadas que definimos acima
    senha_segura = config_argon2.hash(senha_com_pimenta)

    try:
        # Enviamos os dados para a função do crud.py salvar no banco
        novo_user = inserir_usuario(
            nome=dados.get('nome'),
            email=dados.get('email'),
            data_nascimento=dados.get('data_nascimento'),
            senha=senha_segura, 
            tipo_usuario=dados.get('tipo_usuario')
        )

        # Se chegou aqui, deu tudo certo! Gratia!
        return jsonify({
            "mensagem": "Usuário cadastrado com sucesso no Sementis!",
            "id": novo_user.id
        }), 201

    except Exception as e:
        # Se o e-mail já existir ou der erro no banco, cai aqui no limbo
        return jsonify({"erro": f"Erro ao cadastrar: {str(e)}"}), 500

# --- Rota de Login ---
@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Dados não enviados"}), 400

    email_digitado = dados.get('email')
    senha_digitada = dados.get('senha')

    # 1. Busca o usuário no banco (usando sua função do crud.py)
    usuario = buscar_usuario_por_email(email_digitado)

    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    # 2. Prepara a senha digitada com a mesma Pimenta para confirmar
    senha_com_pimenta = senha_digitada + PEPPER

    try:
        # 3. O Argon2 verifica se a senha bate com o Hash do banco
        if config_argon2.verify(senha_com_pimenta, usuario.senha):
             # Cria o token JWT que dura 7 dias
            expiracao = datetime.now(timezone.utc) + timedelta(days=7)
            payload = {
                'usuario_id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email,
                'tipo': usuario.tipo_usuario,
                'exp': expiracao,
                'iat': datetime.now(timezone.utc)
            }
            
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

            # Login Sucesso! Retornamos os dados para o PWA salvar
            return jsonify({
                "mensagem": "Login realizado com sucesso!",
                "token": token,
                "usuario": {
                    "id": usuario.id,
                    "nome": usuario.nome,
                    "xp": usuario.xp,
                    "moedas": usuario.moedas,
                    "tipo": usuario.tipo_usuario,
                    "ofensiva": usuario.ofensiva,
                    "vidas": usuario.vidas,
                    "liga_id": usuario.liga_id
                }
            }), 200
        else:
            return jsonify({"erro": "Senha incorreta"}), 401
            
    except Exception:
        # Caso o hash esteja corrompido ou algo mude na config
        return jsonify({"erro": "Erro ao verificar credenciais"}), 500
    
#Validação do token
@app.route('/validar-token', methods=['POST'])
def validar_token():
    """Rota para verificar se um token ainda é válido"""
    token = None
    
    if 'Authorization' in request.headers:
        token = request.headers['Authorization'].replace('Bearer ', '')
    
    if not token:
        return jsonify({"valido": False, "erro": "Token não fornecido"}), 401
    
    try:
        dados_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({
            "valido": True,
            "usuario": {
                "id": dados_token['usuario_id'],
                "nome": dados_token['nome']
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"valido": False, "erro": "Token expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"valido": False, "erro": "Token inválido"}), 401

@app.route('/completar_atividade', methods=['POST'])
@token_obrigatorio
def completar_atividade():
    id_usuario = request.usuario_id 
    
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Corpo da requisição vazio"}), 400
        
    id_atv = dados.get('atividade_id')
    erros = dados.get('erros', 0)  # Quantidade de erros cometidos no quiz
    concluida_com_sucesso = dados.get('concluida_com_sucesso', False)  # Venceu ou deu Game Over

    if not id_atv:
        return jsonify({"erro": "ID da atividade não fornecido"}), 400

    with Session(engine) as session:
        # 1. Puxar o Usuário do banco para atualizar as vidas
        usuario = session.get(Usuario, id_usuario)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado"}), 404

        # 2. Subtrair os erros das vidas do jogador (Garantindo que não fique negativo)
        novas_vidas = usuario.vidas - erros
        usuario.vidas = max(0, novas_vidas)
        session.add(usuario)
        session.commit()  # Salva o desconto de vidas imediatamente

        # 3. IF principal: Se a fase NÃO foi concluída com sucesso (Game Over)
        if not concluida_com_sucesso:
            return jsonify({
                "status": "game_over",
                "mensagem": "O aluno perdeu todas as vidas ou não terminou o quiz.",
                "vidas_atuais": usuario.vidas
            }), 200

        # 4. Caso tenha vencido com sucesso, roda o bloco de recompensas
        resultado = registrar_conclusao_atividade(session, id_usuario, id_atv)
        
        if resultado.get("status") == "sucesso":
            # Atualiza o progresso das missões diárias/semanais (tipo 'concluir_fase')
            missoes_concluidas = atualizar_progresso_missao(session, id_usuario, 'concluir_fase')
            
            # Atualiza o objeto de retorno para o front-end com as novas informações
            resultado["missoes_completadas_agora"] = missoes_concluidas
            resultado["vidas_atuais"] = usuario.vidas
            
            return jsonify(resultado), 200
        else:
            return jsonify({"erro": resultado.get("mensagem")}), 400

#Rankings - Deve retornar o Json contendo id, nome, xp, nivel e o tipo do usuario
@app.route('/ranking/<int:liga_id>', methods=['GET'])
def ranking(liga_id):
    with Session(engine) as session:
        # Busca os usuários da liga específica usando sua função do crud.py
        usuarios = buscar_ranking_por_liga(session, liga_id)
        
        lista_ranking = []
        for user in usuarios:
            lista_ranking.append({
                "id": user.id,
                "nome": user.nome,
                "xp": user.xp_semanal 
            })
        
        return jsonify(lista_ranking), 200

# --- Rota de Missões Diárias ---
@app.route('/missoes', methods=['GET']) # Pedro: Mudei um pouco pq tava dando um erro na hora de pegar a API
@token_obrigatorio
def missoes():
    id_usuario = request.usuario_id
    
    with Session(engine) as session:
        missoes_do_dia = sortear_missoes_diarias(session, id_usuario)
        
        #Empacotar os dados exatamente como o JS do Vini espera
        lista_missoes = []
        for progresso in missoes_do_dia:
            # Busca os detalhes (título, meta, xp) lá do catálogo principal de missões
            missao_catalogo = session.get(Missao, progresso.missao_id)
            
            lista_missoes.append({
                "id": progresso.id,
                "nome": missao_catalogo.titulo,         # O JS do Vini pede 'nome'
                "progresso": progresso.progresso_atual,
                "meta": missao_catalogo.meta,
                "xp": missao_catalogo.xp_recompensa
            })
            
        return jsonify(lista_missoes), 200
    

@app.route('/api/modulos/<int:modulo_id>/trilhas', methods=['GET'])
@token_obrigatorio
def obter_mapa_modulo(modulo_id):
    id_usuario = request.usuario_id
    
    with Session(engine) as session:
        # 1. Busca as trilhas do módulo usando a função do seu crud.py
        trilhas = listar_trilhas_do_modulo(session, modulo_id)
        if not trilhas:
            return jsonify({"erro": "Nenhuma trilha encontrada para este módulo"}), 404
            
        # 2. Busca eficientemente as atividades que o usuário já concluiu neste módulo
        ids_trilhas = [t.id for t in trilhas]
        instrucao_progresso = (
            select(ProgressoUsuario.atividade_id)
            .join(Atividade)
            .where(
                ProgressoUsuario.usuario_id == id_usuario,
                Atividade.trilha_id.in_(ids_trilhas)
            )
        )
        # Salvamos em um set para buscas instantâneas por ID
        atividades_concluidas_ids = set(session.exec(instrucao_progresso).all())

        resposta_mapa = []
        
        # Variável para controlar se a primeira fase livre já foi liberada
        primeira_fase_nao_concluida_encontrada = False

        for trilha in trilhas:
            # Busca as atividades específicas desta trilha usando a função do seu crud.py
            atividades = listar_atividades_da_trilha(session, trilha.id)
            
            lista_atividades_formatadas = []
            for atv in atividades:
                # Regra de negócio para definir o status da "bolinha" no mapa do Vini
                if atv.id in atividades_concluidas_ids:
                    status = "concluida"
                elif not primeira_fase_nao_concluida_encontrada:
                    status = "liberada"
                    primeira_fase_nao_concluida_encontrada = True
                else:
                    status = "bloqueada"
                
                lista_atividades_formatadas.append({
                    "id": atv.id,
                    "nome": atv.nome,
                    "tipo": atv.tipo,
                    "ordem": atv.ordem,
                    "status": status,
                    "xp_recompensa": atv.xp_recompensa,
                    "moedas_recompensa": atv.moedas_recompensa
                })
            
            resposta_mapa.append({
                "trilha_id": trilha.id,
                "trilha_nome": trilha.nome,
                "trilha_ordem": trilha.ordem,
                "atividades": lista_atividades_formatadas
            })

        return jsonify(resposta_mapa), 200

@app.route("/api/atividades/<int:atividade_id>/questoes", methods=["GET"])
@token_obrigatorio  # Mantendo a segurança para garantir que apenas alunos logados acessem as questões
def obter_questoes_da_atividade(atividade_id):
    with Session(engine) as session:
        # 1. Chama a função do CRUD que criamos, que já limpa o JSON nativo do campo 'conteudo'
        lista_questoes = buscar_questoes_por_atividade(session, atividade_id)
        
        # 2. Se a atividade não tiver nenhuma questão cadastrada no banco
        if not lista_questoes:
            return jsonify({"erro": "Nenhuma questão encontrada para esta atividade"}), 404
            
        # 3. Retorna o array de questões completo para o Vini salvar no storage do front-end
        return jsonify(lista_questoes), 200
    


# --- Rota de Progresso dos Módulos ---
@app.route('/api/modulos/progresso', methods=['GET'])
@token_obrigatorio
def obter_progresso_modulos():
    id_usuario = request.usuario_id
    with Session(engine) as session:
        progresso = listar_progresso_geral_modulos(session, id_usuario)
        return jsonify(progresso), 200

# --- Rota Universal: Serve arquivos estáticos de pastas específicas ---

@app.route('/<pasta>/<path:filename>')
def serve_estaticos(pasta, filename):
    # Se a pasta for uma das pastas de assets ou a do minigame, serve o arquivo direto
    if pasta in ['css', 'js', 'assets', 'pwa', 'FlapFish']:
        return send_from_directory(os.path.join(BASE_DIR, pasta), filename)
    return "Pasta não encontrada", 404

# --- Rota Universal: Serve todas as páginas HTML ---
@app.route('/<path:filename>')
def serve_html(filename):
    # Se o nome não tiver .html, adiciona
    if not filename.endswith('.html'):
        filename += '.html'
    
    # Verifica se o arquivo existe na raiz do projeto
    caminho_completo = os.path.join(BASE_DIR, filename)
    if os.path.exists(caminho_completo):
        return send_from_directory(BASE_DIR, filename)
    
    return f"Página não encontrada: {filename}", 404

@app.route('/api/perfil', methods=['GET'])
@token_obrigatorio
def obter_perfil():
    id_usuario = request.usuario_id
    with Session(engine) as session:
        # === A MÁGICA ACONTECE AQUI ===
        # Executa a regra de negócio do Pedro para atualizar/zerar a ofensiva
        # ANTES de carregar o perfil para a tela.
        atualizar_ofensiva(session, id_usuario) 

        usuario = session.get(Usuario, id_usuario)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado"}), 404

        info_nivel = calcular_nivel(usuario.xp)
        return jsonify({
            "nome": usuario.nome,
            "ofensiva": usuario.ofensiva,
            "moedas": usuario.moedas,     
            "vidas": usuario.vidas,        # <-- ADICIONE ISSO
            "xp_total": usuario.xp,
            "liga_id": usuario.liga_id,
            "progresso_nivel": {
                "nivel_atual": info_nivel["nivel"],
                "xp_no_nivel": info_nivel["xp_atual_no_nivel"],
                "xp_proximo_nivel": info_nivel["xp_necessario_proximo"],
                "porcentagem_barra": info_nivel["porcentagem"]
            }
        }), 200


# =====================================================================
# --- ROTAS DE PROFESSOR ---
# =====================================================================

@app.route('/api/professor/turmas', methods=['GET'])
@token_obrigatorio
def listar_turmas():
    """Retorna todas as turmas do professor logado."""
    if request.usuario_tipo != 'professor':
        return jsonify({"erro": "Acesso negado. Apenas professores."}), 403

    with Session(engine) as session:
        turmas = listar_turmas_do_professor(session, request.usuario_id)
        # listar_turmas pode retornar dict de erro
        if isinstance(turmas, dict):
            return jsonify(turmas), 400

        resultado = []
        for turma in turmas:
            # Conta quantos alunos estão na turma
            from models import TurmaAluno
            from sqlmodel import select, func
            qtd = session.exec(
                select(func.count(TurmaAluno.id)).where(TurmaAluno.turma_id == turma.id)
            ).one()
            resultado.append({
                "id": turma.id,
                "nome": turma.nome,
                "codigo_convite": turma.codigo_convite,
                "data_criacao": turma.data_criacao.strftime("%d/%m/%Y"),
                "total_alunos": qtd
            })
        return jsonify(resultado), 200


@app.route('/api/professor/turmas', methods=['POST'])
@token_obrigatorio
def criar_nova_turma():
    """Cria uma nova turma para o professor logado."""
    if request.usuario_tipo != 'professor':
        return jsonify({"erro": "Acesso negado. Apenas professores."}), 403

    dados = request.get_json()
    if not dados or not dados.get('nome'):
        return jsonify({"erro": "Nome da turma é obrigatório."}), 400

    nome_turma = dados['nome'].strip()
    if len(nome_turma) < 2:
        return jsonify({"erro": "Nome da turma muito curto."}), 400

    with Session(engine) as session:
        resultado = criar_turma(session, nome_turma, request.usuario_id)

        if isinstance(resultado, dict):
            return jsonify(resultado), 400

        return jsonify({
            "id": resultado.id,
            "nome": resultado.nome,
            "codigo_convite": resultado.codigo_convite,
            "data_criacao": resultado.data_criacao.strftime("%d/%m/%Y"),
            "total_alunos": 0
        }), 201


@app.route('/api/professor/turmas/<int:turma_id>/alunos', methods=['GET'])
@token_obrigatorio
def ranking_turma(turma_id):
    """Retorna o ranking de alunos de uma turma específica."""
    if request.usuario_tipo != 'professor':
        return jsonify({"erro": "Acesso negado. Apenas professores."}), 403

    with Session(engine) as session:
        # Verifica se a turma pertence ao professor
        from models import Turma
        turma = session.get(Turma, turma_id)
        if not turma or turma.professor_id != request.usuario_id:
            return jsonify({"erro": "Turma não encontrada ou sem permissão."}), 404

        alunos = listar_alunos_da_turma(session, turma_id)
        if isinstance(alunos, dict):
            return jsonify(alunos), 400

        lista_alunos = []
        for pos, aluno in enumerate(alunos, start=1):
            info_nivel = calcular_nivel(aluno.xp)
            lista_alunos.append({
                "posicao": pos,
                "id": aluno.id,
                "nome": aluno.nome,
                "xp_semanal": aluno.xp_semanal,
                "xp_total": aluno.xp,
                "ofensiva": aluno.ofensiva,
                "nivel": info_nivel["nivel"],
                "liga_id": aluno.liga_id
            })

        return jsonify({
            "turma_nome": turma.nome,
            "alunos": lista_alunos
        }), 200


def buscar_turma_do_professor(session, turma_id, professor_id):
    """Retorna a turma somente quando ela pertence ao professor autenticado."""
    turma = session.get(Turma, turma_id)
    if not turma or turma.professor_id != professor_id:
        return None
    return turma


@app.route('/api/professor/turmas/<int:turma_id>/visao-geral', methods=['GET'])
@token_obrigatorio
def visao_geral_turma(turma_id):
    """Painel de dados da turma, preparado para receber métricas mais detalhadas futuramente."""
    if request.usuario_tipo != 'professor':
        return jsonify({"erro": "Acesso negado. Apenas professores."}), 403

    with Session(engine) as session:
        turma = buscar_turma_do_professor(session, turma_id, request.usuario_id)
        if not turma:
            return jsonify({"erro": "Turma não encontrada ou sem permissão."}), 404

        alunos = listar_alunos_da_turma(session, turma_id)
        if isinstance(alunos, dict):
            return jsonify(alunos), 400

        total_atividades = session.exec(select(func.count(Atividade.id))).one() or 0
        alunos_formatados = []
        for aluno in alunos:
            concluidas = session.exec(
                select(func.count(ProgressoUsuario.id))
                .where(ProgressoUsuario.usuario_id == aluno.id)
            ).one() or 0
            progresso = round((concluidas / total_atividades) * 100) if total_atividades else 0
            alunos_formatados.append({
                "id": aluno.id,
                "nome": aluno.nome,
                "xp_total": aluno.xp,
                "xp_semanal": aluno.xp_semanal,
                "ofensiva": aluno.ofensiva,
                "progresso": progresso,
                "nivel": calcular_nivel(aluno.xp)["nivel"],
            })

        alunos_ativos = sum(1 for aluno in alunos_formatados if aluno["xp_semanal"] > 0)
        media_xp = round(sum(aluno["xp_semanal"] for aluno in alunos_formatados) / len(alunos_formatados)) if alunos_formatados else 0
        media_progresso = round(sum(aluno["progresso"] for aluno in alunos_formatados) / len(alunos_formatados)) if alunos_formatados else 0
        distribuicao = {
            "em_dia": sum(1 for aluno in alunos_formatados if aluno["progresso"] >= 70),
            "atencao": sum(1 for aluno in alunos_formatados if 30 <= aluno["progresso"] < 70),
            "inicio": sum(1 for aluno in alunos_formatados if aluno["progresso"] < 30),
        }

        avisos = session.exec(
            select(AvisoTurma)
            .where(AvisoTurma.turma_id == turma.id)
            .order_by(AvisoTurma.data_publicacao.desc())
        ).all()

        return jsonify({
            "turma": {
                "id": turma.id,
                "nome": turma.nome,
                "codigo_convite": turma.codigo_convite,
                "data_criacao": turma.data_criacao.strftime("%d/%m/%Y"),
            },
            "kpis": {
                "total_alunos": len(alunos_formatados),
                "alunos_ativos": alunos_ativos,
                "media_xp_semanal": media_xp,
                "media_progresso": media_progresso,
            },
            "distribuicao_progresso": distribuicao,
            "alunos": alunos_formatados,
            "avisos": [{
                "id": aviso.id,
                "titulo": aviso.titulo,
                "mensagem": aviso.mensagem,
                "data_publicacao": aviso.data_publicacao.strftime("%d/%m às %H:%M"),
            } for aviso in avisos],
        }), 200


@app.route('/api/professor/turmas/<int:turma_id>/avisos', methods=['POST'])
@token_obrigatorio
def publicar_aviso_turma(turma_id):
    if request.usuario_tipo != 'professor':
        return jsonify({"erro": "Acesso negado. Apenas professores."}), 403

    dados = request.get_json() or {}
    titulo = (dados.get("titulo") or "").strip()
    mensagem = (dados.get("mensagem") or "").strip()
    if not titulo or not mensagem:
        return jsonify({"erro": "Título e mensagem são obrigatórios."}), 400
    if len(titulo) > 90 or len(mensagem) > 700:
        return jsonify({"erro": "O aviso excede o tamanho permitido."}), 400

    with Session(engine) as session:
        turma = buscar_turma_do_professor(session, turma_id, request.usuario_id)
        if not turma:
            return jsonify({"erro": "Turma não encontrada ou sem permissão."}), 404

        aviso = AvisoTurma(
            turma_id=turma.id,
            professor_id=request.usuario_id,
            titulo=titulo,
            mensagem=mensagem,
        )
        session.add(aviso)
        session.commit()
        session.refresh(aviso)
        return jsonify({
            "id": aviso.id,
            "titulo": aviso.titulo,
            "mensagem": aviso.mensagem,
            "data_publicacao": aviso.data_publicacao.strftime("%d/%m às %H:%M"),
        }), 201


# =====================================================================
# --- ROTA DO ALUNO: ENTRAR EM TURMA ---
# =====================================================================

@app.route('/api/aluno/entrar-turma', methods=['POST'])
@token_obrigatorio
def aluno_entrar_turma():
    """Permite que um aluno entre em uma turma pelo código de convite."""
    if request.usuario_tipo != 'aluno':
        return jsonify({"erro": "Acesso negado. Apenas alunos podem entrar em turmas."}), 403

    dados = request.get_json()
    if not dados or not dados.get('codigo'):
        return jsonify({"erro": "Código de convite é obrigatório."}), 400

    codigo = dados['codigo'].strip()

    with Session(engine) as session:
        resultado = entrar_na_turma(session, request.usuario_id, codigo)

        if isinstance(resultado, dict):
            return jsonify(resultado), 400

        # Busca o nome da turma para retornar ao front
        from models import Turma
        turma = session.get(Turma, resultado.turma_id)
        return jsonify({
            "mensagem": f"Você entrou na turma '{turma.nome}' com sucesso! 🎉",
            "turma_nome": turma.nome
        }), 200


# =====================================================================
# --- ROTAS DO SEMENTIS LIVE (MODO KAHOOT MULTIPLAYER EM TEMPO REAL) ---
# =====================================================================
from live_game import live_manager

@app.route('/arena')
@app.route('/arena.html')
def servir_arena():
    """Serve a tela do jogador/aluno do Sementis Live"""
    return send_from_directory(BASE_DIR, 'arena.html')

@app.route('/live-host')
@app.route('/live-host.html')
def servir_live_host():
    """Serve a tela de apresentação / telão do professor"""
    return send_from_directory(BASE_DIR, 'live-host.html')

@app.route('/api/live/topicos', methods=['GET'])
def live_topicos():
    """Lista tópicos de sustentabilidade disponíveis para a sala ao vivo."""
    return jsonify(live_manager.listar_topicos()), 200

@app.route('/api/live/criar-sala', methods=['POST'])
@token_obrigatorio
def live_criar_sala():
    """Cria uma sala temporária estilo Kahoot no Sementis Live."""
    if request.usuario_tipo != 'professor':
        return jsonify({"erro": "Apenas professores podem criar salas ao vivo."}), 403

    dados = request.get_json() or {}
    nome_sala = dados.get("nome", "").strip() or f"Arena Sustentável — Prof. {request.usuario_nome}"
    topico = dados.get("topico", "todos")
    qtd_perguntas = int(dados.get("qtd_perguntas", 5))
    tempo_por_pergunta = int(dados.get("tempo_por_pergunta", 20))

    sala = live_manager.criar_sala(
        professor_id=request.usuario_id,
        professor_nome=request.usuario_nome,
        nome_sala=nome_sala,
        topico=topico,
        qtd_perguntas=qtd_perguntas,
        tempo_por_pergunta=tempo_por_pergunta
    )
    return jsonify(sala), 201

@app.route('/api/live/entrar', methods=['POST'])
def live_entrar():
    """Permite que um aluno entre na sala pelo PIN de 6 dígitos."""
    dados = request.get_json() or {}
    pin = str(dados.get("pin", "")).strip().replace(" ", "").replace("-", "")
    nome = dados.get("nome", "").strip()
    usuario_id = dados.get("usuario_id")
    avatar_id = dados.get("avatar_id")

    if not pin:
        return jsonify({"erro": "Código PIN é obrigatório."}), 400
    if not nome:
        return jsonify({"erro": "Digite um apelido ou nome para jogar."}), 400

    resultado = live_manager.entrar_sala(
        pin=pin,
        nome=nome,
        usuario_id=usuario_id,
        avatar_id=avatar_id
    )

    if not resultado:
        return jsonify({"erro": "Sala não encontrada! Verifique o PIN digitado."}), 404

    return jsonify(resultado), 200

@app.route('/api/live/sala/<pin>/estado', methods=['GET'])
def live_estado_sala(pin):
    """Consulta o estado atual da sala (usado pelo Telão e pelos Alunos)."""
    pin = str(pin).strip().replace(" ", "").replace("-", "")
    is_host = request.args.get('is_host') == '1'
    jogador_id = request.args.get('jogador_id')

    # Se pedir visão de host, verifica se o usuário autenticado é o dono da sala
    if is_host:
        token = request.headers.get('Authorization', '').replace('Bearer ', '') or request.args.get('token')
        if token:
            try:
                dados_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                # Validação de professor
                if dados_token.get('tipo') == 'professor':
                    is_host = True
            except Exception:
                is_host = False

    estado = live_manager.obter_estado(pin=pin, is_host=is_host, jogador_id=jogador_id)
    if not estado:
        return jsonify({"erro": "Sala não encontrada ou encerrada."}), 404

    return jsonify(estado), 200

@app.route('/api/live/sala/<pin>/iniciar', methods=['POST'])
@token_obrigatorio
def live_iniciar_jogo(pin):
    """Professor inicia o jogo da sala."""
    pin = str(pin).strip()
    sucesso = live_manager.iniciar_jogo(pin=pin, professor_id=request.usuario_id)
    if not sucesso:
        return jsonify({"erro": "Não foi possível iniciar o jogo. Verifique suas permissões."}), 400
    return jsonify({"sucesso": True, "status": "pergunta"}), 200

@app.route('/api/live/sala/<pin>/responder', methods=['POST'])
def live_responder(pin):
    """Aluno envia sua resposta para a questão atual."""
    pin = str(pin).strip()
    dados = request.get_json() or {}
    jogador_id = dados.get("jogador_id")
    opcao = dados.get("opcao")
    tempo_ms = int(dados.get("tempo_ms", 5000))

    if not jogador_id or opcao is None:
        return jsonify({"erro": "Jogador e opção são obrigatórios."}), 400

    resultado = live_manager.responder(
        pin=pin,
        jogador_id=jogador_id,
        opcao=int(opcao),
        tempo_ms=tempo_ms
    )

    if not resultado:
        return jsonify({"erro": "Sala não encontrada."}), 404
    if "erro" in resultado:
        return jsonify(resultado), 400

    return jsonify(resultado), 200

@app.route('/api/live/sala/<pin>/revelar', methods=['POST'])
@token_obrigatorio
def live_revelar_resultado(pin):
    """Professor encerra a contagem da pergunta e exibe o gabarito."""
    pin = str(pin).strip()
    sucesso = live_manager.revelar_resultado(pin=pin, professor_id=request.usuario_id)
    if not sucesso:
        return jsonify({"erro": "Não foi possível revelar a resposta."}), 400
    return jsonify({"sucesso": True, "status": "resultado"}), 200

@app.route('/api/live/sala/<pin>/ranking', methods=['POST'])
@token_obrigatorio
def live_mostrar_ranking(pin):
    """Professor avança para a tela de ranking/leaderboard da rodada."""
    pin = str(pin).strip()
    sucesso = live_manager.mostrar_ranking(pin=pin, professor_id=request.usuario_id)
    if not sucesso:
        return jsonify({"erro": "Não foi possível exibir o ranking."}), 400
    return jsonify({"sucesso": True, "status": "ranking"}), 200

@app.route('/api/live/sala/<pin>/proxima', methods=['POST'])
@token_obrigatorio
def live_proxima_pergunta(pin):
    """Professor avança para a próxima pergunta ou encerra no Pódio Final."""
    pin = str(pin).strip()
    resultado = live_manager.proxima_pergunta(pin=pin, professor_id=request.usuario_id)
    if "erro" in resultado:
        return jsonify(resultado), 400
    return jsonify(resultado), 200

@app.route('/api/live/sala/<pin>/adicionar-bot', methods=['POST'])
def live_adicionar_bot(pin):
    """Adiciona um participante simulado para testes rápidos."""
    pin = str(pin).strip()
    res = live_manager.adicionar_bot_simulado(pin)
    if not res:
        return jsonify({"erro": "Não foi possível adicionar bot."}), 400
    return jsonify(res), 200

@app.route('/api/live/sala/<pin>/simular-respostas', methods=['POST'])
def live_simular_respostas(pin):
    """Faz os bots responderem a pergunta atual."""
    pin = str(pin).strip()
    live_manager.simular_respostas_bots(pin)
    return jsonify({"sucesso": True}), 200

@app.route('/api/live/minhas-salas', methods=['GET'])
@token_obrigatorio
def live_minhas_salas():
    """Retorna as salas ativas criadas pelo professor."""
    salas = live_manager.listar_salas_professor(request.usuario_id)
    return jsonify(salas), 200


if __name__ == '__main__':
    # Roda o servidor no modo Debug (reinicia sozinho quando você salva o código)
    app.run(debug=True)

