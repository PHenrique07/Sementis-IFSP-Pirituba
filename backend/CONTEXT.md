# Contexto do back-end

Este contrato orienta API, persistência e serviços do pacote `backend`. As regras globais estão em [AGENTS.md](../AGENTS.md); entradas de execução e caminhos compartilhados seguem [o contexto da raiz](../CONTEXT.md).

## Responsabilidades e próximos caminhos

| Pedido | Arquivos de trabalho | Contexto complementar |
| --- | --- | --- |
| Rotas, autenticação, relatórios e permissões | `app.py` | [Fluxos do back-end](../docs/referencias/fluxos-backend.md) |
| Persistência, XP, ofensiva, inventário e baús | `models.py`, `crud.py` | [Fluxos do back-end](../docs/referencias/fluxos-backend.md) |
| Currículo e povoamento | `dados/questoes.json`, `seeds.py` | [dados/CONTEXT.md](dados/CONTEXT.md) |
| Geração pedagógica com IA | `semeia.py`, `app.py`, `crud.py`, `models.py` | Seção de IA abaixo |
| Arena ao vivo | `live_game.py`, rotas `/api/live/*` em `app.py` | Seção de Arena abaixo e [JavaScript](../frontend/js/CONTEXT.md) |
| Banco, configuração e diretório público | `caminhos.py` | [Contexto da raiz](../CONTEXT.md) |
| Testes Python | `../tests/` | [tests/CONTEXT.md](../tests/CONTEXT.md) |

## Back-end e dados

**Entradas:** ação solicitada, rota consumidora, usuário autenticado, classes envolvidas e testes próximos.

**Processo:**

1. Localize a rota em `app.py` e os consumidores antes de alterar o payload. Há rotas com e sem prefixo `/api`; preserve os nomes e aliases existentes.
2. Use `app.py` para HTTP, autenticação, autorização e montagem da resposta; concentre as regras reutilizáveis em `crud.py` e declare tabelas em `models.py`.
3. As funções de negócio normalmente recebem `Session`. Verifique quem faz `commit`, `refresh` e `rollback` antes de compor operações; algumas funções confirmam a transação internamente.
4. Antes de mudar um modelo, registre campos, defaults, vínculos e impacto nos dados existentes. `criar_tabelas()` chama `migrar_colunas_ausentes()` e `create_all`; isso não constitui um sistema completo de migrações. Consulte a referência de back-end para seus limites.

Os imports internos são relativos ao pacote; consumidores externos usam `backend.models`, `backend.crud` etc. `caminhos.py` mantém `sementis.db` e `.env` na raiz e fornece os caminhos de `frontend/` e `dados/questoes.json`. Não derive o banco da nova pasta de `crud.py`.

**Saídas:** contrato preservado ou consumidores atualizados, alterações restritas aos módulos necessários e resultado dos testes pertinentes.

**Invariantes:** a identidade vem do JWT nas rotas protegidas; permissões de professor e propriedade da turma/trilha precisam ser verificadas no servidor; dados de usuários existentes devem ser preservados em mudanças de esquema.

## Conteúdo educacional

`GET /api/modulos/progresso` inclui `em_destaque` em cada módulo: indica o módulo da conclusão mais recente do usuário autenticado (data e ID como desempate). Sem histórico, destaca o primeiro módulo com atividades, na ordem do currículo. É uma seleção de apresentação, sem alterar XP, desbloqueios ou esquema do banco.

Leia [dados/CONTEXT.md](dados/CONTEXT.md) para hierarquia, contratos de questão e efeitos do povoamento. Os comandos `python seeds.py` e `python seeds.py --atualizar-conteudo` continuam na raiz, com implementação em `backend/seeds.py`.

## Geração de trilhas com IA

`semeia.py` é um serviço do produto; não é o perfil de desenvolvimento [SemeIA](../.github/agents/semeia.agent.md).

**Entradas:** upload PDF e campos de formulário na rota `POST /api/professor/gerar-trilha`; prompts, limites e adaptadores em `semeia.py`.

**Processo:** siga PDF → extração → moderação → geração YAML → validação → persistência → consumo de cota → conclusão do job. O adaptador padrão no código é `openrouter`; `SEMEIA_ADAPTADOR=mock` permite trabalhar sem chamada externa. Use [.env.example](../.env.example) para os nomes das configurações, sem copiar chaves reais.

**Saídas:** `202` com `job_id`/`status` ao iniciar; polling em `/api/professor/trilha-status/<int:job_id>` retorna estado e eventual trilha ou erro. Os estados persistidos são `processando`, `concluido` e `erro`.

**Invariantes:** cota é consumida após persistência bem-sucedida; reprovação e falha não devem consumi-la. A thread captura o ID do professor antes de iniciar e abre sua própria sessão; não acessa `request` em background. A cota gratuita tem sua fonte em `COTA_MENSAL_GRATUITA`, importada pelo CRUD.

## Arena ao vivo

**Entradas:** `dados/questoes.json`, PIN, jogador, ação do host e rotas `/api/live/*`.

**Processo:** `LiveGameManager` em `live_game.py` mantém salas em memória no singleton `live_manager`. Preserve os estados `lobby`, `pergunta`, `resultado`, `ranking`, `finalizado` e a compatibilidade com `js/arena.js` e `js/live-host.js`, que consultam estado por polling.

**Saídas:** estado específico para host/jogador, respostas, pontuação e ranking.

**Invariantes:** uma resposta por jogador/pergunta; o gabarito só aparece nos estados de revelação. Pontuação e transições são decididas no servidor. As salas não sobrevivem a reinícios e não são compartilhadas automaticamente entre processos; considere essa limitação ao mudar execução ou deploy.

## Passe e drone

- Contrato e compatibilidade: [refatoração do passe](../docs/refatoracao-passe.md). `ResgateRecompensa` registra valores concedidos e chave única por usuário, criada por `create_all` sem alterar saldos antigos. `crud.py` concentra catálogo, elegibilidade e transações.
- `GET /api/passe` retorna 60 níveis, `perfil`, XP de progresso e estados `bloqueada`, `disponivel` e `coletada`. `POST /api/passe/<nivel>/resgatar` retorna `recompensa`, `perfil` e `passe`. Nível 1 é inicial; cada avanço requer 500 XP; XP concedido pelo próprio passe não libera níveis. Jornada `raizes-1` permanente, sem plano pago ativo.
- `GET /api/drone` retorna disponibilidade diária e 67 moedas; `POST /api/drone/resgatar` usa a data do servidor, seguindo o calendário diário das missões. Todas essas rotas usam a identidade do JWT. Valores do cliente são ignorados; chave única e atualização de saldo são atômicas. Repetição retorna 409, nível bloqueado 403 e nível inexistente 404.

## Verificação final

Escolha a verificação em [Validação](../docs/referencias/validacao.md). Se mudar um contrato ou uma limitação descrita aqui, atualize o contexto ou a referência correspondente no mesmo trabalho.
