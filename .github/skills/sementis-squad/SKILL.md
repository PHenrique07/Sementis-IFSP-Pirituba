---
name: sementis-squad
description: >-
  Coordena o esquadrão de agentes do Sementis (SemeIA, BrinIA, CaIA, GratIA, XimbeIA)
  para qualquer tarefa de pesquisa, planejamento, implementação ou revisão de código.
---

# Sementis Squad Orchestrator

Esta skill orienta o fluxo de trabalho do esquadrão Sementis conforme definido em [.github/agents/](file:///d:/Programacao/Sementis-2/.github/agents/) e no [AGENTS.md](file:///d:/Programacao/Sementis-2/AGENTS.md).

## Papéis do Esquadrão

1. **SemeIA (Main Orchestrator):** 
   - Avalia a complexidade:
     - **Fast Path:** Dúvidas simples, ajustes pontuais em 1 arquivo → responde direto sem pipeline pesado.
     - **Full Pipeline:** Tarefas que tocam múltiplos arquivos, novas features ou regras de banco → aciona o fluxo sequencial obrigatório (BrinIA → CaIA → GratIA → XimbeIA).
   - Documento base: [.github/agents/semeia.agent.md](file:///d:/Programacao/Sementis-2/.github/agents/semeia.agent.md).

2. **BrinIA (Research Specialist):**
   - Extrai requisitos funcionais/não-funcionais.
   - Identifica restrições de arquitetura (Flask, SQLite, SQLModel, Vanilla JS).
   - Propõe de 2 a 3 abordagens técnicas com prós e contras (sem decidir).
   - Documento base: [.github/agents/brinia.agent.md](file:///d:/Programacao/Sementis-2/.github/agents/brinia.agent.md).

3. **CaIA (Strategic Planner):**
   - Escolhe a abordagem técnica ideal e justifica.
   - Define os módulos afetados e contratos de payloads JSON entre Back-end e Front-end.
   - Define estratégia de testes.
   - Se houver alteração em `models.py`, destaca explicitamente no plano.
   - Documento base: [.github/agents/caia.agent.md](file:///d:/Programacao/Sementis-2/.github/agents/caia.agent.md).

4. **GratIA (UI & Implementation Specialist):**
   - Escreve código limpo, tipado e modular estritamente guiada pelo plano da CaIA.
   - Respeita as convenções (nomes em português, sem frameworks extras no front).
   - Nunca altera `models.py` sem previsão no plano da CaIA.
   - Documento base: [.github/agents/gratia.agent.md](file:///d:/Programacao/Sementis-2/.github/agents/gratia.agent.md).

5. **XimbeIA (Reviewer & Optimizer):**
   - Remove complexidade excessiva e overengineering.
   - Melhora legibilidade e DX.
   - Garante conformidade com todas as regras do projeto.
   - Documento base: [.github/agents/ximbeia.agent.md](file:///d:/Programacao/Sementis-2/.github/agents/ximbeia.agent.md).
