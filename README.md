Markdown

# Sementis 🌱 ![License: All Rights Reserved](https://img.shields.io/badge/License-All_Rights_Reserved-blue.svg)

Plataforma educacional gamificada desenvolvida como projeto acadêmico no IFSP Pirituba. O Sementis utiliza mecânicas de jogos para engajar os usuários no aprendizado através de trilhas de conhecimento, quizzes dinâmicos, missões diárias, uma loja de avatares virtuais e um sistema competitivo de ligas e rankings.

## 🏗️ Arquitetura do Projeto

O Sementis utiliza uma arquitetura **desacoplada**:
- **Front-end (Client):** Progressive Web App (PWA) construído com HTML/CSS/JS puro (Vanilla). Hospedado na **Vercel** (`sementis.com.br`).
- **Back-end (API):** Servidor construído em Python com **Flask**, responsável pelas regras de negócio e banco de dados. Hospedado no **PythonAnywhere**.
- O sistema possui configuração de ambiente dinâmica (`js/api-config.js`) que direciona as requisições (Fetch API) automaticamente para a API correta (Localhost ou Produção).

## 🛠 Tecnologias

**Backend:**
- Python 3.10+
- Flask (Rotas e API Rest)
- Flask-CORS (Comunicação Cross-Origin com credenciais)
- SQLite (Banco de Dados)

**Frontend:**
- HTML5 / CSS3
- Vanilla JavaScript
- PWA (Manifest e Service Workers)

## ⚙️ Como rodar localmente

Como o projeto é desacoplado, você precisa rodar a API (Back-end) e abrir o Front-end simultaneamente.

### 1. Rodando a API (Back-end)
1. Clone o repositório e entre na pasta:
   ```bash
   git clone [https://github.com/PHenrique07/Sementis-IFSP-Pirituba.git](https://github.com/PHenrique07/Sementis-IFSP-Pirituba.git)
   cd Sementis-IFSP-Pirituba

    Crie e ative o ambiente virtual:

        Windows: python -m venv venv e depois venv\Scripts\activate

        Linux/macOS: python3 -m venv venv e depois source venv/bin/activate

    Instale as dependências e inicie o banco de testes:
    Bash

    pip install -r requirements.txt
    python seeds.py

    Inicie o servidor Flask:
    Bash

    flask run

    A API estará rodando em http://127.0.0.1:5000.

2. Rodando o Site (Front-end)

    Com a API rodando no terminal, abra o código do Sementis no VS Code.

    Utilize a extensão Live Server para abrir o arquivo index.html.

    O script api-config.js detectará que você está no localhost e fará com que o site se conecte automaticamente à sua API local da porta 5000.

👥 Integrantes e Contribuições


- **[Pedro Henrique Santos da Silva](https://www.linkedin.com/in/pedro-henrique-santos-da-silva-40b521349/)** — **Líder Técnico & Desenvolvedor Backend:** Responsável pela coordenação geral do desenvolvimento, arquitetura do banco de dados (Models), implementação do CRUD e povoamento do banco(Seeds).

- **[Lucas Peres Gomes](https://www.linkedin.com/in/lucas-peres-gomes-747318276/)** — **Desenvolvedor Backend:** Responsável pela estruturação do servidor, configuração da aplicação (`app.py`) e desenvolvimento das rotas da API.

- **[Vinícius Ruza Magalhães](https://www.linkedin.com/in/vinicius-ruza-magalhães-394104353/)** — **Desenvolvedor de Integração:** Responsável por conectar o frontend ao backend utilizando JavaScript assíncrono e manipulação de arquivos JSON.

- **[Wellington Mendes](https://www.linkedin.com/in/wmendesc/)** — **Desenvolvedor Frontend:** Responsável pela criação da interface, estilização visual (UI/UX) e garantia da responsividade da aplicação.

📄 Licença

Todos os Direitos Reservados (All Rights Reserved)
Este repositório e seu código-fonte são de propriedade exclusiva da equipe criadora.