# Sementis - Guia de Agentes e Comportamento (AGENTS.md)

## Visão Geral do Ecossistema
Este repositório utiliza uma arquitetura de múltiplos agentes para resolver tarefas complexas com isolamento de contexto. 

## Regras Absolutas (Boundaries)
* **DO:** Sempre chame o SemeIA (`@semeia`) primeiro para tarefas que envolvam mais de um arquivo.
* **DO:** Mantenha as respostas curtas e foque em código funcional.
* **DON'T:** Nunca altere o `models.py` sem passar pela CaIA (Planner) primeiro.
* **DON'T:** Não gere código de front-end sem injetar as rotas corretas da API.

## O Esquadrão Sementis
Nossos especialistas. Invoque-os no chat usando seus nomes:

1. **SemeIA (Main Orchestrator):** O ponto de entrada. Lê o contexto, decide se a tarefa é simples ou complexa, e delega para os outros agentes.
2. **BrinIA (Research Specialist):** Lê o codebase, extrai requisitos e propõe abordagens.
3. **CaIA (Strategic Planner):** Pega a pesquisa, define módulos, contratos de dados e arquitetura.
4. **GratIA (UI & Implementation):** Recebe o plano e gera o código, com foco especial na interface e integração.
5. **XimbeIA (Review & Optimizer):** Revisa o código, remove complexidade e melhora a legibilidade.