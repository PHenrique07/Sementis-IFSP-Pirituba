# Sementis - Guia de Agentes, Arquitetura e Comportamento (AGENTS.md)

Este arquivo unifica as diretrizes de desenvolvimento e o ecossistema de agentes para assistentes de IA (Antigravity e GitHub Copilot), mantendo total compatibilidade com as definições em `.github/agents/`.

---

## 1. Visão Geral do Repositório
O **Sementis** é uma aplicação web acadêmica e gamificada voltada para o ensino de sustentabilidade.
A arquitetura é dividida em um back-end leve em Python servindo APIs e um front-end dinâmico em HTML/CSS/JS puro (Vanilla).

---

## 2. Stack Tecnológica
* **Back-end:** Python, Flask (Rotas/API).
* **Banco de Dados:** SQLite, gerenciado exclusivamente via SQLModel e SQLAlchemy (não usar scripts SQL puros ou MySQL).
* **Front-end:** HTML5, CSS3, Vanilla JavaScript.
* **Segurança/Autenticação:** JWT (PyJWT) e Argon2 para hash de senhas.

---

## 3. Convenções e Regras Inegociáveis (Boundaries)
1. **Mimetismo de Código (NÃO INVENTE):** Siga estritamente o padrão de código, formatação e arquitetura já estabelecidos nos outros arquivos do projeto. Se o projeto usa uma abordagem específica para rotas, banco de dados ou manipulação de DOM, replique-a. Não introduza novas bibliotecas, frameworks ou padrões de design que não existam atualmente no repositório.
2. **Modelagem de Dados:** Todo e qualquer acesso ou alteração estrutural no banco de dados DEVE ser feito através das classes do `models.py`.
3. **Separação de Responsabilidades:** O Front-end NUNCA deve calcular regras de negócio pesadas (como dias de ofensiva ou nível de XP). O back-end calcula, envia no payload JSON, e o front-end apenas exibe.
4. **Idioma e Nomenclatura:** Código fonte com variáveis, funções e comentários escritos prioritariamente em Português (ex: `atualizar_ofensiva` ao invés de `updateStreak`).
5. **Respostas Diretas:** Mantenha as respostas curtas, objetivas e focadas em código funcional.

---

## 4. O Esquadrão Sementis (Pipeline de Agentes)

As definições detalhadas de cada agente estão preservadas em [`.github/agents/`](./.github/agents/):

1. **SemeIA (Main Orchestrator - `semeia.agent.md`):**
   * Ponto de entrada. Avalia se a tarefa é *Fast Path* (simples/1 arquivo) ou *Full Pipeline* (complexa/múltiplos módulos).
2. **BrinIA (Research Specialist - `brinia.agent.md`):**
   * Pesquisa o problema, extrai requisitos funcionais/não-funcionais, identifica restrições e propõe 2 a 3 abordagens técnicas com trade-offs. Nunca altera arquivos.
3. **CaIA (Strategic Planner - `caia.agent.md`):**
   * Escolhe a abordagem técnica, define contratos de dados (payloads), estratégia de testes e arquitetura de módulos antes do código.
4. **GratIA (UI & Implementation - `gratia.agent.md`):**
   * Escreve o código funcional (Flask + SQLModel + Vanilla JS) respeitando estritamente o plano da CaIA e as convenções do Sementis.
5. **XimbeIA (Review & Optimizer - `ximbeia.agent.md`):**
   * Revisa o código gerado, remove overengineering, melhora a legibilidade e garante que nenhuma convenção foi quebrada.
