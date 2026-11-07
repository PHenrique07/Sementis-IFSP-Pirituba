from pathlib import Path
import runpy
import sys

import pytest

from backend import crud, seeds
from backend.caminhos import CAMINHO_BANCO, CAMINHO_ENV, CAMINHO_QUESTOES, RAIZ_PROJETO
from backend.live_game import live_manager


def test_dados_e_banco_independem_do_diretorio_atual(tmp_path, monkeypatch):
    raiz = Path(__file__).resolve().parents[2]
    monkeypatch.chdir(tmp_path)

    assert Path(RAIZ_PROJETO) == raiz
    assert Path(CAMINHO_BANCO) == raiz / "sementis.db"
    assert Path(CAMINHO_ENV) == raiz / ".env"
    assert crud.DB_PATH == seeds.DB_PATH == CAMINHO_BANCO
    assert Path(CAMINHO_QUESTOES) == raiz / "backend/dados/questoes.json"
    assert seeds.carregar_conteudo_educacional()
    assert live_manager.questoes_por_modulo["todos"]


@pytest.mark.parametrize("argumentos, funcao", [
    ([], "semear_banco"),
    (["--atualizar-conteudo"], "sincronizar_conteudo_educacional"),
])
def test_entrada_seeds_preserva_os_comandos(argumentos, funcao, monkeypatch):
    chamadas = []
    monkeypatch.setattr(seeds, funcao, lambda: chamadas.append(funcao))
    monkeypatch.setattr(sys, "argv", ["seeds.py", *argumentos])

    runpy.run_path(str(Path(RAIZ_PROJETO) / "seeds.py"), run_name="__main__")

    assert chamadas == [funcao]
