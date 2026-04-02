from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from crud import (engine, criar_tabelas, inserir_usuario, buscar_usuario_por_email,
    registrar_conclusao_atividade, listar_modulos, listar_trilhas_do_modulo,
    listar_atividades_da_trilha)
from passlib.hash import argon2
from functools import wraps
import os
from datetime import datetime, timezone, timedelta
import jwt
from sqlmodel import Session, select, create_engine
from models import Usuario, Modulo, Trilha, Atividade, ProgressoUsuario

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
                    "vidas": usuario.vidas
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

@app.route('/perfil', methods=['GET'])
@token_obrigatorio
def perfil():
    """Exemplo de rota protegida que precisa de token"""
    return jsonify({
        "mensagem": f"Bem-vindo ao seu perfil, {request.usuario_nome}!",
        "usuario_id": request.usuario_id,
        "tipo": request.usuario_tipo
    }), 200

@app.route('/completar_atividade', methods=['POST'])
@token_obrigatorio
def completar_atividade(usuario_atual):
    dados = request.get_json()
    id_atv = dados.get('atividade_id')

    with Session(engine) as session:
        # Usando a sua função número 7 do crud.py!
        sucesso = registrar_conclusao_atividade(session, usuario_atual.id, id_atv)
        
        if sucesso:
            return jsonify({"mensagem": "Atividade concluída e recompensas entregues!"}), 200
        else:
            return jsonify({"erro": "Atividade não encontrada"}), 404

if __name__ == '__main__':
    # Roda o servidor no modo Debug (reinicia sozinho quando você salva o código)
    app.run(debug=True)