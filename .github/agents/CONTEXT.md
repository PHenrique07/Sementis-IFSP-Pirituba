# Contrato dos perfis de agentes

Todos os perfis usam o [mapa global](../../AGENTS.md), os contextos da área afetada e as mesmas referências. São perspectivas de trabalho que podem ser selecionadas conforme a tarefa.

## Entradas

Pedido, escopo, contexto da área, evidências do código e, quando houver trabalho anterior, os arquivos e decisões já produzidos.

## Processo

- **SemeIA:** resolve a tarefa de ponta a ponta e escolhe o contexto necessário; pode implementar diretamente.
- **BrinIA:** pesquisa requisitos, limitações e alternativas usando leitura.
- **CaIA:** planeja contratos, impacto em dados e validação usando leitura.
- **GratIA:** implementa o escopo acordado usando os contratos e padrões locais.
- **XimbeIA:** revisa comportamento, riscos e simplificações com base no diff e nos contextos.

Pesquisar, planejar, implementar e revisar podem ocorrer na mesma sessão. Usar vários arquivos não obriga chamar outros perfis. Delegue somente quando solicitado ou quando uma instrução aplicável autorizar e houver uma subtarefa independente que justifique isso.

## Saídas

Quem recebe uma tarefa precisa apenas de: objetivo, limites, caminhos dos contextos, arquivos/contratos relevantes, decisões tomadas, verificações e pendências. Evite repassar históricos inteiros ou exigir leitura de áreas sem relação com o pedido.

## Invariantes e validação

Os perfis usam os [aliases de ferramentas documentados pelo GitHub](https://docs.github.com/en/copilot/reference/custom-agents-configuration): `read`/`search` para leitura e `edit`/`execute` para implementação e validação. SemeIA também dispõe de `agent` para delegação opcional; BrinIA mantém `web/fetch` para pesquisa no ambiente que o oferece.

Preserve as capacidades de leitura dos perfis de pesquisa/planejamento e as de edição dos perfis de implementação/revisão. Antes de alterar `models.py`, deve existir um plano do impacto nos dados; ele pode ser feito pelo próprio agente responsável, sem depender de uma pessoa específica do esquadrão.

Confira o frontmatter e a coerência com os adaptadores descritos no [contexto da área](../CONTEXT.md).
