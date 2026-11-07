# Contexto da raiz e execução

A raiz contém entradas de execução, configuração, documentação e os diretórios do produto. Consulte [AGENTS.md](AGENTS.md) para regras globais e roteamento.

## Entradas e responsabilidades

| Arquivo/área | Responsabilidade |
| --- | --- |
| [app.py](app.py) | Entrada compatível de Flask/WSGI; exporta a aplicação de `backend.app` |
| [seeds.py](seeds.py) | Entrada da sementeira e de `--atualizar-conteudo` |
| [backend/CONTEXT.md](backend/CONTEXT.md) | API, persistência, regras, geração de trilhas e Arena |
| [frontend/CONTEXT.md](frontend/CONTEXT.md) | Páginas e arquivos públicos |
| [tests/CONTEXT.md](tests/CONTEXT.md) | Testes automatizados e scripts manuais |
| [vercel.json](vercel.json) | Publicação estática de `frontend/` com as URLs existentes |
| [pytest.ini](pytest.ini) | Descoberta de testes automatizados e caminho de imports |
| `sementis.db`, `.env` | Dados e configuração locais, ignorados pelo Git e preservados na raiz |

## Processo

Execute a API pela raiz com `python app.py` ou `flask run`. Para servir somente a interface em outro terminal, use `python -m http.server 3000 --directory frontend`. O Flask também serve a interface na porta 5000.

Os módulos internos são importados como `backend.models`, `backend.crud` etc.; imports entre módulos do pacote são relativos. Não copie a implementação para os lançadores da raiz.

## Invariantes

- `backend/caminhos.py` resolve caminhos a partir de `__file__`, sem depender do diretório atual.
- O banco continua em `sementis.db` na raiz; não foi movido nem recriado pela reorganização.
- O carregamento de `.env` continua na raiz. O currículo está em `backend/dados/questoes.json`.
- `/home.html`, `/js/*`, `/css/*`, `/assets/*`, `/pwa/*`, `/FlapFish/*` e `/sw.js` mantêm os caminhos públicos. `frontend/` é o diretório físico, não um prefixo das URLs.
- Em PythonAnywhere, `from app import app as application` continua válido com a raiz no caminho de imports. Em Vercel, a configuração versionada pressupõe Root Directory na raiz do repositório.

## Saídas e validação

Ao mudar uma entrada ou caminho, confira imports, localização de dados, acesso aos arquivos públicos e testes de regressão. Veja [Validação](docs/referencias/validacao.md) e o [registro da reorganização](docs/reestruturacao.md).
