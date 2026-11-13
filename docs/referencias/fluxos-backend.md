# Referência dos fluxos do back-end

Consulte esta referência ao mudar rotas, persistência ou seus consumidores. A origem dos contratos é [app.py](../../backend/app.py), [crud.py](../../backend/crud.py), [models.py](../../backend/models.py) e [semeia.py](../../backend/semeia.py). O [contexto do back-end](../../backend/CONTEXT.md) define o escopo de cada módulo.

## Autenticação e autorização

`token_obrigatorio` decodifica JWT HS256 e preenche `request.usuario_id`, `request.usuario_nome` e `request.usuario_tipo`. O fluxo usual envia `Authorization: Bearer <token>`; o decorador também aceita o parâmetro de consulta `token`, usado em integrações existentes. Não fornecido, inválido ou expirado resulta em `401`.

Autenticação não substitui autorização: conferir tipo de professor e propriedade/vínculo da turma, trilha ou job é responsabilidade das rotas correspondentes. Não aceite um ID enviado pelo cliente como substituto da identidade autenticada.

`POST /login` recebe `email` e `senha`, retornando `token` e `usuario`. A senha usa Argon2 com pepper. Ao tocar no fluxo, preserve compatibilidade entre cadastro, login e sementes; não documente valores reais de segredo.

## Rotas para localizar o contrato

Esta seleção é um mapa para leitura, não uma especificação exaustiva. Leia a função da rota para conhecer campos, permissões e erros completos. Os placeholders abaixo usam a sintaxe do Flask.

| Método | Rota existente | Consumidor/uso |
| --- | --- | --- |
| POST | `/cadastro`, `/login`, `/validar-token` | Cadastro e sessão |
| GET | `/api/perfil` | Perfil e barra de XP |
| GET | `/api/amigos`, `/api/amigos/pedidos` | Amigos aceitos e convites recebidos pelo usuário autenticado |
| POST | `/api/amigos/adicionar`, `/api/amigos/aceitar`, `/api/amigos/rejeitar` | Envio por e-mail/ID e resposta a convites próprios pendentes |
| POST | `/completar_atividade` | Conclusão/game over do quiz |
| GET | `/api/modulos/<int:modulo_id>/trilhas` | Mapa de módulo |
| GET | `/api/modulos/progresso` | Progresso da home |
| GET | `/api/passe`, `/api/drone` | Catálogo/progresso do passe e disponibilidade da entrega diária |
| POST | `/api/passe/<int:nivel>/resgatar`, `/api/drone/resgatar` | Resgates autenticados e persistidos, sem aceitar valores do cliente |
| GET | `/api/atividades/<int:atividade_id>/questoes` | Perguntas do quiz |
| GET | `/api/trilhas/<int:trilha_id>` | Mapa de trilha específica |
| POST | `/api/trilhas/<int:trilha_id>/baus/<int:posicao>/abrir` | Abertura de baú |
| GET | `/ranking/<int:liga_id>`, `/missoes` | Ligas e missões |
| GET, POST | `/api/turmas`, `/api/professor/turmas` | Aliases de gerenciamento de turmas |
| POST | `/api/turmas/entrar`, `/api/aluno/entrar-turma` | Aliases de entrada em turma |
| GET | `/api/aluno/minhas-turmas` | Turmas do aluno |
| GET | `/api/aluno/turmas/<int:turma_id>/dashboard` | Painel do aluno |
| GET | `/api/professor/turmas/<int:turma_id>/visao-geral` | Visão do professor |
| GET | `/api/professor/turmas/<int:turma_id>/relatorio/pdf` | Relatório PDF |
| GET | `/api/professor/turmas/<int:turma_id>/exportar` | Exportação de dados |
| POST | `/api/professor/gerar-trilha` | Geração assíncrona de trilha |
| GET | `/api/professor/trilha-status/<int:job_id>`, `/api/professor/cota-ia` | Estado da geração e cota |
| GET | `/api/professor/trilhas-ia` | Trilhas geradas pelo professor |

Para Arena, procure `/api/live/` em `app.py` e o contrato em [CONTEXT.md](../../backend/CONTEXT.md#arena-ao-vivo). Para loja/inventário, confirme se a operação de `crud.py` está exposta em `app.py` antes de usá-la na interface; a existência de uma função ou chamada no front-end não garante uma rota implementada.

## Atividade, perfil e baú

`POST /completar_atividade` recebe, por exemplo:

```json
{"atividade_id": 12, "erros": 1, "concluida_com_sucesso": true}
```

A rota desconta vidas no servidor. Se não houver conclusão, retorna `status: "game_over"` e `vidas_atuais`. No sucesso, o CRUD devolve `status`, `mensagem`, `xp_atual`, `moedas_atuais`, `vidas_atuais`, `ofensiva_atual` e `primeira_vez`; a rota acrescenta `missoes_completadas_agora`.

A primeira conclusão registra progresso e recompensa completa. Replay concede 20% do XP da atividade, sem novas moedas nem outro registro de progresso. Não trate essa operação como idempotente: requisições repetidas podem conceder XP de replay.

`GET /api/perfil` retorna `xp_total` e `progresso_nivel` com `nivel_atual`, `xp_no_nivel`, `xp_proximo_nivel` e `porcentagem_barra`, além de nome, ofensiva, moedas, vidas e liga. Use esse payload para exibir nível; não derive a fórmula na interface.

O mapa de trilha específica retorna uma lista de objetos com `trilha_id`, `trilha_nome`, `trilha_ordem`, `atividades` e `baus`. As atividades usam `concluida`, `liberada` ou `bloqueada`; baús usam `coletado`, `disponivel` ou `bloqueado`.

A abertura de baú verifica posição/progresso e coleta anterior; retorna `404`, `403` ou `409` nesses casos. No sucesso, `evolucao`, `raridade`, `moedas`, `xp` e `moedas_totais` descrevem o resultado calculado e salvo pelo servidor. Os três toques da UI apenas apresentam esse resultado.

## Esquema e sessões

- Entidades e vínculos: usuário; módulo → trilha → atividade → questão; progresso por usuário/atividade; inventário; missões; turma/aluno/trilha; job de geração; baú por usuário/trilha/posição.
- `Trilha.professor_id` identifica autoria de trilhas geradas; `TurmaTrilha` associa trilhas às turmas. Ao alterar exclusão/atribuição, confira vínculos e consultas existentes.
- `Questao.conteudo` e `ItemLoja.atributos_bonus` são colunas JSON. Preserve os formatos esperados pelos consumidores.
- O engine de `backend/crud.py` aponta para `sementis.db` na raiz do projeto, definido por `backend/caminhos.py`, independentemente do diretório de execução. Importar `backend.crud` cria o engine; importar `backend.app` (inclusive pela entrada `app.py`) também executa `criar_tabelas()`.
- `migrar_colunas_ausentes` inspeciona o banco com SQLAlchemy e deriva colunas da metadata do SQLModel. O `ALTER TABLE` interno existente não autoriza scripts SQL paralelos; `models.py` continua sendo a fonte do esquema.
- O helper adiciona colunas ausentes e alguns defaults, mas não renomeia/remove colunas nem migra tipos ou dados. Não presuma que `create_all` aplique qualquer mudança de modelo a um banco existente.

## Geração pedagógica

O contrato de upload/job/cota está no [contexto de IA](../../backend/CONTEXT.md#geração-de-trilhas-com-ia). `SEMEIA_ADAPTADOR` seleciona `openrouter`, `openai`, `gemini` ou `mock`. O padrão implementado é OpenRouter; referências antigas da Wiki a Gemini não definem o adaptador atual.

Leia prompts e validação de YAML antes de mudar questões geradas. A geração alimenta as mesmas entidades e layouts utilizados pelo currículo estático. Em validação local, prefira `mock` quando a tarefa não exigir um provedor real.

## Verificações

Siga [Validação](validacao.md). Os testes em memória de modelos, turmas/trilhas e baús não comprovam todas as permissões HTTP nem o processamento de IA; para uma alteração nesses contratos, verifique também sucesso, entrada inválida, ausência de token, papel/vínculo incorreto e falha do provedor quando aplicável.
