"""Caminhos absolutos compartilhados, independentes do diretório de execução."""

import os


RAIZ_PROJETO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIRETORIO_FRONTEND = os.path.join(RAIZ_PROJETO, "frontend")
CAMINHO_BANCO = os.path.join(RAIZ_PROJETO, "sementis.db")
CAMINHO_ENV = os.path.join(RAIZ_PROJETO, ".env")
CAMINHO_QUESTOES = os.path.join(RAIZ_PROJETO, "backend", "dados", "questoes.json")
