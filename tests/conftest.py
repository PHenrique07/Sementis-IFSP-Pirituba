import importlib

import pytest
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, create_engine

from backend import crud


@pytest.fixture
def banco_isolado(monkeypatch):
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    monkeypatch.setattr(crud, "engine", engine)
    SQLModel.metadata.create_all(engine)
    yield engine
    engine.dispose()


@pytest.fixture
def cliente(banco_isolado, monkeypatch):
    # O engine é substituído antes de importar a API, que inicializa as tabelas.
    monkeypatch.setenv("SEMEIA_ADAPTADOR", "mock")
    modulo_app = importlib.import_module("backend.app")
    monkeypatch.setattr(modulo_app, "engine", banco_isolado)
    monkeypatch.setitem(modulo_app.app.config, "TESTING", True)
    monkeypatch.setattr(modulo_app.live_manager, "salas", {})
    with modulo_app.app.test_client() as cliente_teste:
        yield cliente_teste
