# Documentação do Sementis para a Wiki do GitHub 📖

Este diretório contém todos os arquivos estruturados para a **Wiki oficial do Sementis no GitHub**.

---

## 📂 Arquivos Disponíveis

| Arquivo | Título na Wiki | Descrição |
| :--- | :--- | :--- |
| [`wiki/Home.md`](file:///d:/Programacao/Sementis-2/docs/wiki/Home.md) | **Home / Onboarding** | Apresentação do projeto, tom de boas-vindas, proposta de valor e papéis (Aluno vs Professor). |
| [`wiki/02-arquitetura-geral.md`](file:///d:/Programacao/Sementis-2/docs/wiki/02-arquitetura-geral.md) | **Arquitetura Geral** | Visão desacoplada, diagrama Mermaid, mapa de diretórios e segurança (JWT + Argon2id). |
| [`wiki/03-backend.md`](file:///d:/Programacao/Sementis-2/docs/wiki/03-backend.md) | **Back-end** | Flask, modelos SQLModel, regras de gamificação no `crud.py`, rotas no `app.py` e IA no `semeia.py`. |
| [`wiki/04-frontend.md`](file:///d:/Programacao/Sementis-2/docs/wiki/04-frontend.md) | **Front-end** | Arquitetura Vanilla JS, PWA, estilos CSS modulares, `main.js`, `api-config.js` e mapa de páginas. |
| [`wiki/05-games-js.md`](file:///d:/Programacao/Sementis-2/docs/wiki/05-games-js.md) | **Os Games em JS** | Quiz Engine, Sementis Live Arena (Kahoot multiplayer) e Flappy Fish em Phaser 3. |
| [`wiki/06-guia-de-contribuicao.md`](file:///d:/Programacao/Sementis-2/docs/wiki/06-guia-de-contribuicao.md) | **Guia de Contribuição** | Como rodar localmente (back + front), convenções inegociáveis e agentes de IA. |
| [`wiki/_Sidebar.md`](file:///d:/Programacao/Sementis-2/docs/wiki/_Sidebar.md) | **Barra Lateral (_Sidebar)** | Menu de navegação lateral exibido automaticamente pelo GitHub Wiki. |

---

## 🚀 Como Publicar na Wiki do GitHub

Existem duas maneiras bem simples de publicar esse conteúdo na Wiki do GitHub:

### Opção 1: Via Interface Web do GitHub (Mais Fácil)
1. Vá até a aba **Wiki** do seu repositório no GitHub: `https://github.com/PHenrique07/Sementis-IFSP-Pirituba/wiki`.
2. Clique em **Create the first page** (ou **New Page**).
3. Crie a página inicial com o nome de `Home` e cole o conteúdo de [`docs/wiki/Home.md`](file:///d:/Programacao/Sementis-2/docs/wiki/Home.md).
4. Crie as páginas adicionais com os nomes correspondentes:
   * `02-arquitetura-geral`
   * `03-backend`
   * `04-frontend`
   * `05-games-js`
   * `06-guia-de-contribuicao`
5. Crie uma página especial chamada `_Sidebar` e cole o conteúdo de [`docs/wiki/_Sidebar.md`](file:///d:/Programacao/Sementis-2/docs/wiki/_Sidebar.md). Essa página criará automaticamente o menu lateral da wiki!

### Opção 2: Via Git Clone da Wiki (Avançado)
Toda Wiki do GitHub é um repositório Git independente. Você pode cloná-lo:
```bash
git clone https://github.com/PHenrique07/Sementis-IFSP-Pirituba.wiki.git
```
Depois, copie os arquivos de `docs/wiki/*` para dentro dele, faça `git add .`, `git commit -m "docs: wiki inicial"` e `git push`!
