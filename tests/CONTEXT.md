# Contexto dos testes

**Escopo:** `unit/` para regras/modelos/caminhos, `integration/` para API e arquivos públicos, `manuais/` para scripts executados explicitamente.

## Entradas

Comportamento alterado, contexto da área e teste próximo. A [referência de validação](../docs/referencias/validacao.md) relaciona cobertura e comandos.

## Processo

1. Execute a partir da raiz com `python -m pytest`. `pytest.ini` limita descoberta a `unit/` e `integration/`, incluindo a raiz no caminho de imports.
2. Use `from backend.models import ...` e `from backend.crud import ...`. Não recrie módulos `models.py`/`crud.py` na raiz para contornar imports.
3. Os testes unitários existentes têm fixtures de sessão em memória. Para integração, use `banco_isolado` e `cliente` de [conftest.py](conftest.py).
4. `cliente` substitui o engine antes de importar `backend.app`, porque a importação inicializa tabelas. Também isola as salas Live e seleciona o adaptador mock.
5. Para testar inventário, use a sessão de `banco_isolado`; não importe uma cópia de `crud.engine` antes da fixture e não use o banco real.

## Saídas e invariantes

- A suíte automatizada roda sem modificar `sementis.db` e sem chamadas a provedores de IA.
- Testes de caminhos protegem banco, currículo e as entradas `seeds.py`. Testes de estrutura pública protegem URLs de páginas/assets, aliases e separação entre arquivos públicos/privados.
- Os testes HTTP cobrem cadastro/login/perfil, turma/matrícula, quiz/conclusão/baú e partida Live; não substituem validação visual ou um deploy real.
- Scripts em `manuais/` continuam separados: use `python -m tests.manuais.teste_live` ou leia `teste_backend.py` antes de executá-lo. Eles não recebem automaticamente as fixtures e podem acessar o banco local.
