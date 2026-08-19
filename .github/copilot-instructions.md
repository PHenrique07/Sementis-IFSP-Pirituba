# Sementis - Copilot Instructions

## Visão Geral do Repositório
O Sementis é uma aplicação web acadêmica e gamificada voltada para o ensino de sustentabilidade. A arquitetura é dividida em um back-end leve em Python servindo APIs e um front-end dinâmico em HTML/CSS/JS puro (Vanilla).

## Stack Tecnológica
*   **Back-end:** Python, Flask (Rotas/API).
*   **Banco de Dados:** SQLite, gerenciado exclusivamente via SQLModel e SQLAlchemy (não usamos scripts SQL puros ou MySQL).
*   **Front-end:** HTML5, CSS3, Vanilla JavaScript.
*   **Segurança/Autenticação:** JWT (PyJWT) e Argon2 para hash de senhas.

## Divisão do Time (Para contexto de tarefas)
*   **Banco de Dados & Regras de Negócio:** Responsável pelos arquivos `models.py` e `crud.py`.
*   **API & Backend:** Responsável por gerenciar o `app.py` e proteger as rotas com decoradores.
*   **Front-end (Lógica):** Responsável pelos arquivos `.js` que consomem a API e manipulam o DOM.
*   **Front-end (UI/UX):** Responsável pelos arquivos `.html` e `.css`.

## Convenções e Regras Inegociáveis
*   **Mimetismo de Código (NÃO INVENTE):** Siga estritamente o padrão de código, formatação e arquitetura já estabelecidos nos outros arquivos do projeto. Se o projeto usa uma abordagem específica para rotas, banco de dados ou manipulação de DOM, replique-a. Não introduza novas bibliotecas, frameworks ou padrões de design que não existam atualmente no repositório.
*   **Modelagem de Dados:** Todo e qualquer acesso ou alteração estrutural no banco de dados DEVE ser feito através das classes do `models.py`.
*   **Separação de Responsabilidades:** O Front-end NUNCA deve calcular regras de negócio pesadas (como dias de ofensiva ou nível de XP). O back-end calcula, envia no payload JSON, e o front-end apenas exibe.
*   **Idioma e Nomenclatura:** Código fonte com variáveis, funções e comentários escritos prioritariamente em Português (ex: `atualizar_ofensiva` ao invés de `updateStreak`).