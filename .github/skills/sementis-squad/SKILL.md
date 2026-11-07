---
name: sementis-squad
description: >-
  Organiza uma passagem de tarefa ou colaboração entre os perfis do Sementis quando
  o usuário solicitar o esquadrão ou houver delegação autorizada entre esses perfis.
---

# Colaboração entre perfis do Sementis

Use esta skill para organizar uma colaboração solicitada ou autorizada. Tarefas comuns podem ser resolvidas pelo mesmo agente usando [AGENTS.md](../../../AGENTS.md) e os contextos das áreas; não precisam ativar o esquadrão.

## Procedimento

1. Leia o [contrato dos perfis](../../agents/CONTEXT.md) e localize os contextos da tarefa no mapa global.
2. Defina objetivo, limites e resultado verificável da subtarefa. Escolha só o perfil pertinente: pesquisa (BrinIA), planejamento (CaIA), implementação (GratIA) ou revisão (XimbeIA); SemeIA integra o resultado quando estiver conduzindo o trabalho.
3. Passe caminhos dos contextos, arquivos relevantes, contratos/decisões já definidos e validações esperadas. Para alteração de modelo, inclua o plano de compatibilidade dos dados.
4. Ao receber o resultado, confira evidências, integração com os consumidores e pendências; valide conforme a [referência do repositório](../../../docs/referencias/validacao.md).
5. Consolide uma entrega com resultado e verificações reais. Se não houver ferramenta de delegação, execute as perspectivas necessárias na mesma sessão, respeitando o pedido e as capacidades disponíveis.

Não existe sequência obrigatória de perfis nem gatilho por quantidade de arquivos. Regras do produto e fatos de arquitetura permanecem nos contextos correspondentes, não nesta skill.
