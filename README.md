# Sementis 🌱 ![License: All Rights Reserved](https://img.shields.io/badge/License-All_Rights_Reserved-blue.svg)

Plataforma educacional gamificada desenvolvida como projeto acadêmico no IFSP Pirituba. O Sementis ensina sustentabilidade com trilhas, quizzes, missões, avatares, ligas e atividades para turmas.

## Organização

| Diretório/entrada | Responsabilidade | Contexto |
| --- | --- | --- |
| `backend/` | Flask, modelos SQLModel, regras de negócio, IA e Arena | [backend/CONTEXT.md](backend/CONTEXT.md) |
| `backend/dados/` | Currículo e perguntas em JSON | [backend/dados/CONTEXT.md](backend/dados/CONTEXT.md) |
| `frontend/` | HTML, CSS, JavaScript, assets, PWA e FlapFish | [frontend/CONTEXT.md](frontend/CONTEXT.md) |
| `tests/` | Testes unitários, integração e scripts manuais | [tests/CONTEXT.md](tests/CONTEXT.md) |
| `docs/` | Wiki e referências de manutenção | [docs/CONTEXT.md](docs/CONTEXT.md) |
| `app.py`, `seeds.py` | Entradas de execução compatíveis na raiz | [CONTEXT.md](CONTEXT.md) |
| `.github/`, `.agents/` | Perfis, skills e instruções existentes | [.github/CONTEXT.md](.github/CONTEXT.md) |

O banco `sementis.db` e o arquivo `.env` continuam na raiz e são ignorados pelo Git. Os caminhos são definidos em `backend/caminhos.py`. Veja o [registro da reorganização](docs/reestruturacao.md) para imports, hospedagem e contratos preservados.

## Contexto para agentes

Comece pelo [AGENTS.md](AGENTS.md) e siga os `CONTEXT.md` das áreas envolvidas. A [metodologia adotada](docs/metodologia-contexto.md) explica os perfis opcionais e os caminhos de leitura. Consulte os [fluxos do back-end](docs/referencias/fluxos-backend.md) e a [validação por escopo](docs/referencias/validacao.md) conforme a tarefa.

## Tecnologias

Python 3.10+, Flask, SQLModel/SQLAlchemy, SQLite, JWT e Argon2 no back-end. HTML5, CSS3 e JavaScript Vanilla na interface, com Phaser no FlapFish. A API e o front-end podem ser servidos separadamente.

## Execução local

Na raiz do repositório, crie e ative o ambiente virtual. No Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

No Linux/macOS, ative com `source venv/bin/activate`. Para configuração de IA, copie `.env.example` para `.env` e use suas próprias configurações. Para trabalhar sem chamadas externas, defina `SEMEIA_ADAPTADOR=mock` no ambiente.

Em um banco de desenvolvimento novo, o povoamento inicial continua disponível:

```powershell
python seeds.py
```

Se já houver usuário, o povoamento inicial é interrompido. Leia o [contrato de conteúdo](backend/dados/CONTEXT.md) antes de usar `--atualizar-conteudo` em um banco existente.

Inicie a API e a interface juntas:

```powershell
python app.py
```

Abra `http://127.0.0.1:5000/`. O comando `flask run` também continua disponível na raiz.

Para servir somente a interface em outro terminal, mantendo a API na porta 5000:

```powershell
python -m http.server 3000 --directory frontend
```

Abra `http://localhost:3000/`. No Live Server, use `frontend/` como raiz pública e uma origem permitida pelo CORS. `frontend/js/api-config.js` escolhe a URL da API; as URLs públicas de páginas e assets continuam sem o prefixo `/frontend`.

## Testes

```powershell
python -m pip install pytest
python -m pytest --tb=short -v
```

A suíte usa bancos isolados e inclui modelos, regras, inventário, fluxos HTTP e arquivos públicos. Scripts históricos em `tests/manuais/` não são executados automaticamente; veja [Validação](docs/referencias/validacao.md) antes de usá-los.

## Hospedagem

`vercel.json` configura a publicação estática de `frontend/` a partir da raiz do repositório. A API continua podendo ser hospedada no PythonAnywhere com `from app import app as application` no WSGI. Os detalhes e limites de validação estão no [registro da reorganização](docs/reestruturacao.md).

## 👥 Integrantes e Contribuições

- **[Pedro Henrique Santos da Silva](https://www.linkedin.com/in/pedro-henrique-santos-da-silva-40b521349/)** — **Líder Técnico & Desenvolvedor Backend:** Responsável pela coordenação geral do projeto e pela arquitetura da API.

- **[Lucas Peres Gomes](https://www.linkedin.com/in/lucas-peres-gomes-747318276/)** — **Desenvolvedor Backend:** Responsável pela estruturação do servidor, configuração da aplicação (`app.py`, `backend/crud.py`, `backend/models.py`), além da implementação de regras de negócio e lógica da API.

- **[Vinícius Ruza Magalhães](https://www.linkedin.com/in/vinicius-ruza-magalhães-394104353/)** — **Desenvolvedor de Integração:** Responsável por conectar o frontend ao backend utilizando JavaScript assíncrono e APIs, garantindo a comunicação eficiente entre as camadas do sistema.

- **[Wellington Mendes](https://www.linkedin.com/in/wmendesc/)** — **Desenvolvedor Frontend:** Responsável pela criação da interface, estilização visual (UI/UX) e garantia da responsividade da aplicação.

## 📄 Licença

Todos os Direitos Reservados (All Rights Reserved)  
Este repositório e seu código-fonte são de propriedade exclusiva da equipe criadora.
