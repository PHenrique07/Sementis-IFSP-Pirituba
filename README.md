# Sementis 🌱🌍

Projeto acadêmico de extensão do IFSP Pirituba, voltado para engajar usuários por meio de gamificação e educação ambiental.

## Sobre o projeto

- Plataforma educacional com trilhas, desafios e aprendizagem interativa
- Front-end em HTML, CSS e JavaScript
- Back-end em Python com Flask
- Banco de dados SQLite
- Arquitetura desacoplada entre frontend e API

## Objetivo

Promover experiências de aprendizado mais envolventes, usando mecânicas de jogo para facilitar o entendimento de temas relacionados à sustentabilidade e ao ensino.

## Como rodar localmente

### 1. API
```bash
git clone https://github.com/PHenrique07/Sementis-IFSP-Pirituba.git
cd Sementis-IFSP-Pirituba
python -m venv venv
source venv/bin/activate   # Linux/macOS
# ou venv\Scripts\activate   # Windows
pip install -r requirements.txt
python seeds.py
flask run
```

### 2. Front-end
Abra o projeto no VS Code e execute o site com Live Server (ou equivalente), mantendo a API em execução.

## Tecnologias principais

- Python
- Flask
- SQLite
- HTML/CSS/JavaScript

## Licença

Todos os direitos reservados.
