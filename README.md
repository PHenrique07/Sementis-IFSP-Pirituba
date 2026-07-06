# Sementis 🌱 ![License: All Rights Reserved](https://img.shields.io/badge/License-All_Rights_Reserved-blue.svg)

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
├── FlapFish/         ← Minigame interativo integrado à plataforma
├── assets/           ← Imagens, ícones, avatares e recursos visuais
├── css/              ← Folhas de estilo da aplicação
├── js/               ← Lógica de frontend e consumo da API
├── pwa/              ← Configurações e ícones para instalação mobile/desktop
├── .gitignore        ← Arquivos e pastas ignorados pelo Git (ex: venv)
├── app.py            ← Inicialização do servidor Flask e endpoints (Rotas)
├── crud.py           ← Operações de banco de dados e regras de negócio
├── models.py         ← Esquemas e tabelas do banco de dados (Usuários, Ligas, Loja, etc.)
├── seeds.py          ← Script para popular o banco com dados iniciais para testes
├── sementis.db       ← Arquivo do banco de dados local SQLite
├── requirements.txt  ← Dependências do projeto Python
├── questoes.json     ← Arquivo de dados com as perguntas e respostas do Quiz
├── sw.js             ← Service Worker principal para cache e funcionamento offline
├── teste_backend.py  ← Script de testes e validação do CRUD e rotas
├── README.md         ← Documentação principal do projeto
└── *.html            ← Páginas de interface (index, login, home, ligas, perfil, missões, trilhas)
```

## ⚙️ Como rodar localmente

### Pré-requisitos
- [Python 3.10+](https://www.python.org/downloads/) instalado na máquina.
- Git instalado.

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone [https://github.com/PHenrique07/Sementis-IFSP-Pirituba.git](https://github.com/PHenrique07/Sementis-IFSP-Pirituba.git)
   ```

2. Entre na pasta do projeto e crie um ambiente virtual (recomendado):
   ```bash
   cd Sementis-IFSP-Pirituba
   python -m venv venv
   ```

3. Ative o ambiente virtual:
   - **Windows:** `venv\Scripts\activate`
   - **Linux/macOS:** `source venv/bin/activate`

4. Instale as dependências do projeto:
   ```bash
   pip install -r requirements.txt
   ```

5. Popule o banco de dados com os usuários e itens de teste:
   ```bash
   python seeds.py
   ```

6. Inicie o servidor local:
   ```bash
   flask run
   ```
   
7. Acesse o sistema pelo navegador através do endereço retornado pelo terminal (geralmente `http://127.0.0.1:5000/`).

## 👥 Integrantes e Contribuições

- **[Pedro Henrique Santos da Silva](https://www.linkedin.com/in/pedro-henrique-santos-da-silva-40b521349/)** — **Líder Técnico & Desenvolvedor Backend:** Responsável pela coordenação geral do desenvolvimento, arquitetura do banco de dados (Models), implementação do CRUD e povoamento do banco(Seeds).

- **[Lucas Peres Gomes](https://www.linkedin.com/in/lucas-peres-gomes-747318276/)** — **Desenvolvedor Backend:** Responsável pela estruturação do servidor, configuração da aplicação (`app.py`) e desenvolvimento das rotas da API.

- **[Vinícius Ruza Magalhães](https://www.linkedin.com/in/vinicius-ruza-magalhães-394104353/)** — **Desenvolvedor de Integração:** Responsável por conectar o frontend ao backend utilizando JavaScript assíncrono e manipulação de arquivos JSON.

- **[Wellington Mendes](https://www.linkedin.com/in/wmendesc/)** — **Desenvolvedor Frontend:** Responsável pela criação da interface, estilização visual (UI/UX) e garantia da responsividade da aplicação.

## 📄 Licença

**Todos os Direitos Reservados (All Rights Reserved)**

Este repositório e seu código-fonte são de propriedade exclusiva da equipe criadora. Não é permitida a cópia, modificação, distribuição, sublicenciamento ou uso (comercial ou não comercial) de qualquer parte deste projeto sem a autorização prévia e explícita dos autores.
