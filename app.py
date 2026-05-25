from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
#Pedro -> Adicionei a nova função de ranking por liga, a outra não existe mais
from crud import (engine, criar_tabelas, inserir_usuario, buscar_usuario_por_email,
    registrar_conclusao_atividade, listar_modulos, listar_trilhas_do_modulo,
    listar_atividades_da_trilha, buscar_ranking_por_liga, atualizar_progresso_missao,
    sortear_missoes_diarias, calcular_nivel, buscar_questoes_por_atividade) 
from passlib.hash import argon2
from functools import wraps
import os
from datetime import datetime, timezone, timedelta
import jwt
from sqlmodel import Session, select, create_engine
from models import Usuario, Modulo, Trilha, Atividade, ProgressoUsuario, Missao

app = Flask(__name__)

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
    #Copia a documentação e outras propriedades da função original
    @wraps(f)
    #Função que substitui a função original
    #*args e **kwargs vão capturar todos os argumentos que a função original receberia
    def decorador(*args, **kwargs):
        #Cria o token vazio
        token = None
        
        # Pega o token do cabeçalho Authorization
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace('Bearer ', '')
        
        #Caso não, da erro, o que significa que o usuario nunca enviou token
        if not token:
            return jsonify({"erro": "Token não fornecido!"}), 401
        
        try:
            # Tenta decodificar o token
            dados_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            # Guarda os dados do usuário na requisição
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
    return send_from_directory('.', 'index.html')

# Rota para servir qualquer arquivo estático
@app.route('/<path:filename>')
def serve_static(filename):
    """Serve arquivos CSS, JS, imagens, etc."""
    # Verifica se o arquivo existe
    if os.path.exists(filename):
        return send_from_directory('.', filename)
    else:
        return f"Arquivo não encontrado: {filename}", 404

# Rota específica para a página de trilhas
@app.route('/trilhas.html')
def trilha():
    """Serve a página de trilhas"""
    return send_from_directory('.', 'trilhas.html')

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
            idade=dados.get('idade'),
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
    
@app.route('/api/perfil', methods=['GET'])
@token_obrigatorio
def obter_perfil():
    id_usuario = request.usuario_id
    with Session(engine) as session:
        usuario = session.get(Usuario, id_usuario)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado"}), 404
        
        info_nivel = calcular_nivel(usuario.xp)
        return jsonify({
            "nome": usuario.nome,
            "ofensiva": usuario.ofensiva,
            "xp_total": usuario.xp,
            "liga_id": usuario.liga_id,
            "progresso_nivel": {
                "nivel_atual": info_nivel["nivel"],
                "xp_no_nivel": info_nivel["xp_atual_no_nivel"],
                "xp_proximo_nivel": info_nivel["xp_necessario_proximo"],
                "porcentagem_barra": info_nivel["porcentagem"]
            }
        }), 200

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
    
# --- Rota Universal: Serve arquivos estáticos de pastas específicas ---
@app.route('/<pasta>/<path:filename>')
def serve_estaticos(pasta, filename):
    # Se a pasta for uma das pastas de assets, serve o arquivo direto
    if pasta in ['css', 'js', 'assets', 'pwa']:
        return send_from_directory(pasta, filename)
    return "Pasta não encontrada", 404

# --- Rota Universal: Serve todas as páginas HTML ---
@app.route('/<path:filename>')
def serve_html(filename):
    # Se o nome não tiver .html, adiciona
    if not filename.endswith('.html'):
        filename += '.html'
    
    # Verifica se o arquivo existe na raiz
    if os.path.exists(filename):
        return send_from_directory('.', filename)
    
    return f"Página não encontrada: {filename}", 404


if __name__ == '__main__':
    # Roda o servidor no modo Debug (reinicia sozinho quando você salva o código)
    app.run(debug=True)