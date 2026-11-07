# Reorganização do Sementis

## Estrutura de trabalho

```text
Sementis-2/
├── app.py                     # Entrada Flask/WSGI compatível
├── seeds.py                   # Entrada da sementeira compatível
├── backend/
│   ├── CONTEXT.md
│   ├── app.py                 # Rotas, autenticação e respostas HTTP
│   ├── models.py              # Mesmo esquema SQLModel
│   ├── crud.py                # Mesmas regras de negócio
│   ├── semeia.py              # Geração pedagógica
│   ├── live_game.py           # Salas Live em memória
│   ├── seeds.py               # Povoamento/sincronização
│   ├── caminhos.py            # Resolução única dos caminhos locais
│   └── dados/
│       ├── CONTEXT.md
│       └── questoes.json
├── frontend/
│   ├── CONTEXT.md
│   ├── *.html
│   ├── js/                    # CONTEXT.md e scripts existentes
│   ├── css/                   # CONTEXT.md e estilos existentes
│   ├── assets/
│   ├── pwa/                   # Manifest, registro e contexto
│   ├── FlapFish/              # Árvore existente e contextos do jogo
│   └── sw.js
├── tests/
│   ├── CONTEXT.md
│   ├── conftest.py            # Banco e cliente HTTP isolados
│   ├── unit/
│   ├── integration/
│   └── manuais/
├── docs/
├── .github/                   # Perfis, skills e CI preservados
├── .agents/                   # Integrações existentes preservadas
├── pytest.ini
├── vercel.json
├── sementis.db                # Continua na raiz, ignorado pelo Git
└── .env                       # Continua na raiz, ignorado pelo Git
```

## Contratos preservados

- As rotas e métodos da API continuam em `backend/app.py`; o lançador `app.py` exporta a mesma aplicação Flask e `SECRET_KEY` para consumidores existentes.
- `python app.py`, `flask run`, `python seeds.py` e `python seeds.py --atualizar-conteudo` continuam sendo executados na raiz. A sementeira não foi executada como parte da movimentação.
- `backend/caminhos.py` ancora o banco e `.env` na raiz do projeto, independentemente do diretório atual. O arquivo de banco existente não foi movido, recriado ou usado para os testes da reorganização.
- Os modelos SQLModel e os dados de `questoes.json` foram apenas movidos. Não houve mudança de esquema ou de regras de recompensa.
- O front-end inteiro foi movido junto, mantendo os caminhos entre HTML, scripts, estilos e imagens. As URLs `/home.html`, `/js/...`, `/assets/...`, `/FlapFish/...`, `/pwa/...` e `/sw.js` continuam iguais. Não acrescente `/frontend` às URLs.
- A duplicação de FlapFish e o registro de PWA comentado permanecem como estavam; seus contextos registram essas limitações.

## Execução e hospedagem

Para abrir a API e interface juntas, execute `python app.py` e acesse `http://127.0.0.1:5000/`. Para servir somente a interface, execute `python -m http.server 3000 --directory frontend` em outro terminal e acesse `http://localhost:3000/`.

No Live Server, selecione `frontend/` como raiz pública. Abrir essa pasta como workspace funciona para servir a interface; para manutenção do projeto completo, mantenha o workspace na raiz e configure a raiz pública da extensão para `frontend/`.

O projeto Vercel deve manter Root Directory na raiz do repositório. [vercel.json](../vercel.json) seleciona o preset estático, pula instalação/build e publica somente `frontend/`, com aliases para `/arena` e `/live-host`. A configuração usa as propriedades da [documentação oficial da Vercel](https://vercel.com/docs/project-configuration/vercel-json). Se o projeto remoto tiver outro Root Directory, confira essa configuração antes de publicar.

No PythonAnywhere, mantenha a raiz do projeto no caminho de imports. O WSGI existente pode continuar usando `from app import app as application`; a implementação fica em `backend.app`. A reorganização local não altera configurações de serviços remotos nem publica um deploy.

## Imports e testes

Consumidores Python internos usam `from backend.models import ...` e `from backend.crud import ...`; os módulos do pacote usam imports relativos. `models.py`/`crud.py` deixam de existir na raiz, evitando duas implementações ou dois registros dos mesmos modelos.

Execute `python -m pytest --tb=short -v` para a suíte automatizada. O inventário passou a usar o banco em memória da fixture, permitindo rodar a suíte completa sem tocar no banco local. Os scripts manuais ficam fora da descoberta padrão e usam `python -m tests.manuais.teste_live`, por exemplo.

As verificações da reorganização incluem os testes existentes, caminhos de dados/entradas de execução, arquivos públicos e aliases, cadastro/login/perfil, turma/matrícula, quiz/conclusão/baú e partida Live. A comparação de integridade com a estrutura anterior confere conteúdo dos arquivos públicos, currículo, modelos, banco e decoradores de rotas.

Veja [referencias/validacao.md](referencias/validacao.md) para limites da cobertura. Testes HTTP locais não substituem inspeção visual nem validação em um deploy de preview.

## Resultado da verificação local

- Suíte automatizada: `python -m pytest --tb=short -q` — 253 testes passaram.
- Os 217 arquivos públicos mantiveram o conteúdo byte a byte e foram entregues pelas URLs anteriores nos testes HTTP.
- Banco existente, modelos SQLModel e currículo mantiveram seus hashes; os 54 decoradores de rota mantiveram métodos e caminhos.
- Links locais, frontmatter dos perfis, workflow e arquivos de configuração foram conferidos.
- Nenhum deploy foi publicado; a configuração remota de Vercel/PythonAnywhere e a renderização visual completa ainda precisam ser exercitadas no ambiente de destino.
