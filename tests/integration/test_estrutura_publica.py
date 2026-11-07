from pathlib import Path

import pytest

from backend.caminhos import DIRETORIO_FRONTEND


PASTA_FRONTEND = Path(DIRETORIO_FRONTEND)
ARQUIVOS_PUBLICOS = sorted(
    arquivo.relative_to(PASTA_FRONTEND).as_posix()
    for arquivo in PASTA_FRONTEND.rglob("*")
    if arquivo.is_file() and arquivo.suffix != ".md"
)


@pytest.mark.parametrize("caminho", ARQUIVOS_PUBLICOS)
def test_arquivos_continuam_nas_urls_publicas(cliente, caminho):
    resposta = cliente.get("/" + caminho)
    assert resposta.status_code == 200
    assert resposta.data == (PASTA_FRONTEND / caminho).read_bytes()


@pytest.mark.parametrize("url, pagina", [
    ("/", "index.html"),
    ("/arena", "arena.html"),
    ("/live-host", "live-host.html"),
])
def test_paginas_de_entrada_preservam_aliases(cliente, url, pagina):
    resposta = cliente.get(url)
    assert resposta.status_code == 200
    assert resposta.data == (PASTA_FRONTEND / pagina).read_bytes()


@pytest.mark.parametrize("url", [
    "/.env", "/sementis.db", "/backend/models.py", "/backend/dados/questoes.json",
])
def test_arquivos_privados_ficam_fora_da_pasta_publica(cliente, url):
    assert cliente.get(url).status_code == 404


def test_entrada_wsgi_exporta_a_mesma_aplicacao(cliente):
    from app import app as entrada_wsgi
    from backend.app import app

    assert entrada_wsgi is app
