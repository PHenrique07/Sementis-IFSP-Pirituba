# Documentação do Sementis

Para editar documentação, leia [CONTEXT.md](CONTEXT.md). O mapa global de agentes está em [../AGENTS.md](../AGENTS.md).

## Contexto e referências mantidos no repositório

- [Metodologia de contexto](metodologia-contexto.md): organização ICM e caminhos de leitura por tarefa.
- [Reorganização do repositório](reestruturacao.md): pastas, entradas compatíveis, caminhos de dados e hospedagem.
- [Fluxos do back-end](referencias/fluxos-backend.md): rotas atuais, payloads e limites de persistência.
- [Validação por escopo](referencias/validacao.md): testes existentes, efeitos no banco e verificação de interface.

## Páginas destinadas à Wiki

| Arquivo | Título na Wiki | Descrição |
| :--- | :--- | :--- |
| [`wiki/Home.md`](wiki/Home.md) | **Home / Onboarding** | Apresentação do projeto, tom de boas-vindas, proposta de valor e papéis (Aluno vs Professor). |
| [`wiki/02-arquitetura-geral.md`](wiki/02-arquitetura-geral.md) | **Arquitetura Geral** | Visão desacoplada, diagrama Mermaid, mapa de diretórios e segurança (JWT + Argon2id). |
| [`wiki/03-backend.md`](wiki/03-backend.md) | **Back-end** | Flask, modelos SQLModel, regras de gamificação no `backend/crud.py`, rotas no `backend/app.py` e IA no `backend/semeia.py`. |
| [`wiki/04-frontend.md`](wiki/04-frontend.md) | **Front-end** | Arquitetura Vanilla JS, PWA, estilos CSS modulares, `main.js`, `api-config.js` e mapa de páginas. |
| [`wiki/05-games-js.md`](wiki/05-games-js.md) | **Os Games em JS** | Quiz Engine, Sementis Live Arena (Kahoot multiplayer) e Flappy Fish em Phaser 3. |
| [`wiki/06-guia-de-contribuicao.md`](wiki/06-guia-de-contribuicao.md) | **Guia de Contribuição** | Como rodar localmente (back + front), convenções inegociáveis e agentes de IA. |
| [`wiki/07-guia-de-skills.md`](wiki/07-guia-de-skills.md) | **Guia de Skills & REA** | Ecossistema de Agent Skills, orquestração do Esquadrão Sementis e engenharia reversa com REA. |
| [`wiki/_Sidebar.md`](wiki/_Sidebar.md) | **Barra Lateral (_Sidebar)** | Menu de navegação lateral exibido automaticamente pelo GitHub Wiki. |

Alguns exemplos técnicos históricos da Wiki precisam ser confirmados no código antes de orientar uma implementação; consulte o [contrato da Wiki](wiki/CONTEXT.md).

## Publicação na Wiki do GitHub

### Opção 1: Via Interface Web do GitHub
1. Vá até a aba **Wiki** do seu repositório no GitHub: `https://github.com/PHenrique07/Sementis-IFSP-Pirituba/wiki`.
2. Clique em **Create the first page** (ou **New Page**).
3. Crie a página inicial com o nome de `Home` e cole o conteúdo de [`docs/wiki/Home.md`](wiki/Home.md).
4. Crie as páginas adicionais com os nomes correspondentes:
   * `02-arquitetura-geral`
   * `03-backend`
   * `04-frontend`
   * `05-games-js`
   * `06-guia-de-contribuicao`
   * `07-guia-de-skills`
5. Crie uma página especial chamada `_Sidebar` e cole o conteúdo de [`docs/wiki/_Sidebar.md`](wiki/_Sidebar.md).

### Opção 2: Via Repositório Git da Wiki
```bash
git clone https://github.com/PHenrique07/Sementis-IFSP-Pirituba.wiki.git
```

Copie somente as páginas listadas, mantendo os nomes. Na cópia para o repositório da Wiki, use `07-guia-de-skills.md`. Não copie `CONTEXT.md`, `referencias/` ou os adaptadores de agentes como páginas da Wiki.

Revise o conteúdo e os links no destino antes de fazer commit/push. A edição local da documentação não publica automaticamente a Wiki.
