# Contexto para agentes no Sementis

Esta organização aplica a proposta apresentada por André Tayer em [Não precisamos de um exército de agentes. Precisamos de contexto.](https://building.cerc.com/blog/icm-menos-agentes-mais-contexto/), Building CERC, 13/10/2026. O artigo apresenta a Interpretable Context Methodology (ICM): instruções próximas do trabalho, descobertas conforme a tarefa.

## Organização adotada neste repositório

| Camada | Fonte no Sementis | Uso |
| --- | --- | --- |
| 0 — identidade e mapa | `AGENTS.md` | Regras comuns e escolha da área |
| 1 — área | `backend/CONTEXT.md`, `frontend/CONTEXT.md`, `tests/CONTEXT.md`, `docs/CONTEXT.md`, `.github/CONTEXT.md` | Responsabilidades e caminhos de leitura |
| 2 — contrato local | Contextos de dados, JS/CSS/PWA/FlapFish, Wiki, perfis e cenas do jogo | Particularidades da subárea |
| 3 — referências | `docs/referencias/` e páginas pertinentes da Wiki | Contratos e verificações compartilhados |
| 4 — tarefa | Código, conteúdo e testes relacionados ao pedido | Evidência e alteração concreta |
| 5 — invariantes | Seções de invariantes nos contextos e validação correspondente | Condições a conferir ao concluir |

A camada 5 segue a adaptação relatada pela CERC; o artigo não a atribui ao modelo original. Não é necessário criar todos os níveis em toda pasta nem ler todos os contextos em toda tarefa.

## Decisões específicas do Sementis

- O produto está organizado em [backend/](../backend/CONTEXT.md), [frontend/](../frontend/CONTEXT.md) e [tests/](../tests/CONTEXT.md), cada um com contrato próprio. As entradas de execução permanecem na raiz, com caminhos compatíveis conforme o [registro da reorganização](reestruturacao.md).
- Os perfis SemeIA, BrinIA, CaIA, GratIA e XimbeIA continuam disponíveis, com [contrato compartilhado](../.github/agents/CONTEXT.md). Uma sessão pode pesquisar, planejar, implementar e revisar. Delegação depende do pedido ou de autorização aplicável e de uma divisão útil do trabalho; quantidade de arquivos deixa de ser o gatilho.
- Copilot, Antigravity e `sementis-squad` apontam para o mesmo mapa. Contratos do produto ficam nas áreas correspondentes, sem serem mantidos separadamente em cada perfil.
- Particularidades atuais foram registradas nos contextos: scripts inline dos HTMLs, duas árvores de FlapFish, registro de PWA comentado, padrão OpenRouter do serviço SemeIA e isolamento dos testes automatizados em relação aos scripts manuais.

## Exemplos de leitura

| Pedido | Caminho suficiente para começar |
| --- | --- |
| Corrigir recompensa de baú | `AGENTS.md` → `backend/CONTEXT.md` → referência de back-end → `backend/crud.py`/`backend/models.py`/`tests/unit/test_baus_trilha.py`; leia a rota e `frontend/trilhas.html` se o contrato HTTP/UI mudar |
| Ajustar relatório da turma | `AGENTS.md` → `backend/CONTEXT.md` → rota em `backend/app.py`; se a interface mudar, `frontend/CONTEXT.md` → `frontend/js/CONTEXT.md` → página e script da turma |
| Atualizar contribuição na Wiki | `AGENTS.md` → `docs/CONTEXT.md` → `docs/wiki/CONTEXT.md` → `06-guia-de-contribuicao.md` |
| Corrigir reinício do FlapFish | `AGENTS.md` → `frontend/CONTEXT.md` → `frontend/FlapFish/CONTEXT.md` → `src/scenes/CONTEXT.md` → cenas afetadas |

O contexto orienta a busca; leia a implementação antes de decidir. `CONTEXT.md` é lido por navegação explícita: os adaptadores instruem isso, sem depender de descoberta automática específica de um editor.

## Manutenção

Mantenha cada fato em sua fonte responsável. Uma mudança em payload, comando, caminho ativo ou limitação deve atualizar a orientação que passaria a ficar incorreta. Regras de uma única pasta ficam nela; regras comuns a uma área ficam no contexto da área; convenções globais e roteamento ficam no `AGENTS.md`.

Um contexto útil informa responsabilidade, entradas, processo, saídas, referências e validação concreta. Não precisa repetir as regras do pai nem guardar o histórico da conversa. Quando o detalhe for compartilhado por várias tarefas, mantenha uma referência estável e faça links.

Novas pastas só precisam de um contexto próprio quando houver responsabilidade ou limitação que o contrato do pai não explica. Skills existentes continuam servindo a procedimentos recorrentes; uma dica ou um fato sobre o produto cabe no contexto da área.

Na entrega, confira as invariantes aplicáveis e as verificações em [referencias/validacao.md](referencias/validacao.md). Elas complementam os testes automatizados e tornam explícito o que ainda precisa ser verificado.
