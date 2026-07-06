# Sementis 🌱

Plataforma educacional gamificada desenvolvida como projeto acadêmico no IFSP Pirituba. O Sementis utiliza mecânicas de jogos para engajar os usuários no aprendizado através de trilhas de conhecimento, quizzes dinâmicos, missões diárias, uma loja de avatares virtuais e um sistema competitivo de ligas e rankings.

## 🛠 Tecnologias

**Backend:**
- Python 3
- Flask (API e Rotas)
- SQLModel / SQLAlchemy (ORM)
- SQLite (Banco de Dados)

**Frontend:**
- HTML5 / CSS3
- Vanilla JavaScript (Integração assíncrona via Fetch API / JSON)
- PWA (Progressive Web App - Manifest e Service Workers)

## 📁 Estrutura do projeto

```text
Sementis-IFSP-Pirituba/
├── assets/           ← Imagens, ícones, avatares e recursos visuais
├── css/              ← Folhas de estilo da aplicação
├── js/               ← Lógica de frontend e consumo da API
├── pwa/              ← Configurações para instalação como app mobile/desktop
├── app.py            ← Inicialização do servidor Flask e endpoints
├── crud.py           ← Operações de banco de dados e regras de negócio
├── models.py         ← Esquemas e tabelas do banco (Usuários, Ligas, Loja, etc.)
├── seeds.py          ← Script para popular o banco com dados iniciais para testes
├── sementis.db       ← Arquivo do banco de dados local
└── requirements.txt  ← Dependências do projeto Python

⚙️ Como rodar localmente
Pré-requisitos

    Python 3.10+ instalado na máquina.

    Git instalado.

Passo a passo

    Clone o repositório:
    Bash

    git clone [https://github.com/PHenrique07/Sementis-IFSP-Pirituba.git](https://github.com/PHenrique07/Sementis-IFSP-Pirituba.git)

    Entre na pasta do projeto e crie um ambiente virtual (recomendado):
    Bash

    cd Sementis-IFSP-Pirituba
    python -m venv venv

    Ative o ambiente virtual:

        Windows: venv\Scripts\activate

        Linux/macOS: source venv/bin/activate

    Instale as dependências do projeto:
    Bash

    pip install -r requirements.txt

    Popule o banco de dados com os usuários e itens de teste:
    Bash

    python seeds.py

    Inicie o servidor local:
    Bash

    flask run
    # ou
    python app.py

    Acesse o sistema pelo navegador acessando o endereço retornado pelo terminal (geralmente http://127.0.0.1:5000/).

👥 Integrantes e Contribuições

    Pedro Henrique Santos da Silva — Líder Técnico & Desenvolvedor Backend: Responsável pela coordenação geral do desenvolvimento, arquitetura do banco de dados (Models), implementação do CRUD e rotinas de povoamento (Seeds).

    Lucas Peres Gomes — Desenvolvedor Backend: Responsável pela estruturação do servidor, configuração da aplicação (app.py) e desenvolvimento das rotas da API.

    Vinícius Ruza Magalhães — Desenvolvedor de Integração: Responsável por conectar o frontend ao backend utilizando JavaScript assíncrono e manipulação de arquivos JSON.

    Wellington Mendes — Desenvolvedor Frontend: Responsável pela criação da interface, estilização visual (UI/UX) e garantia da responsividade da aplicação.
