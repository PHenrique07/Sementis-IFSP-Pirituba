from flask import Flask, request, jsonify
from flask_cors import CORS  # <--- Import adicionado pelo Pedro
# Importamos as funções do arquivo crud.py que o grupo criou
from crud import inserir_usuario, criar_tabelas, buscar_usuario_por_email
# Biblioteca para o Argon2id (criptografia)
from passlib.hash import argon2

app = Flask(__name__)

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
            # Login Sucesso! Retornamos os dados para o PWA salvar
            return jsonify({
                "mensagem": "Login realizado com sucesso!",
                "usuario": {
                    "id": usuario.id,
                    "nome": usuario.nome,
                    "xp": usuario.xp,
                    "moedas": usuario.moedas,
                    "tipo": usuario.tipo_usuario
                }
            }), 200
        else:
            return jsonify({"erro": "Senha incorreta"}), 401
            
    except Exception:
        # Caso o hash esteja corrompido ou algo mude na config
        return jsonify({"erro": "Erro ao verificar credenciais"}), 500

if __name__ == '__main__':
    # Roda o servidor no modo Debug (reinicia sozinho quando você salva o código)
    app.run(debug=True)