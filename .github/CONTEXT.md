# Contexto das configurações de colaboração

**Escopo:** perfis de agentes, instruções do Copilot, skills e automação do GitHub. Regras do produto pertencem aos contextos das áreas de código.

## Entradas e roteamento

| Mudança | Destino e referência |
| --- | --- |
| Perfil ou passagem de tarefa entre agentes | [agents/CONTEXT.md](agents/CONTEXT.md) |
| Instruções carregadas pelo Copilot | [copilot-instructions.md](copilot-instructions.md), apontando para [AGENTS.md](../AGENTS.md) |
| Procedimento recorrente de uma skill | `skills/<nome>/SKILL.md`; leia apenas a skill pertinente |
| Testes em CI | [workflows/testes-backend.yml](workflows/testes-backend.yml), [tests/CONTEXT.md](../tests/CONTEXT.md) e [Validação](../docs/referencias/validacao.md) |
| Compatibilidade Antigravity | [.agents/rules/agents.md](../.agents/rules/agents.md) e `.agents/skills.json` |

## Processo

Mantenha os adaptadores dos editores curtos e apontando para as mesmas fontes. Ao mudar o fluxo dos agentes, confira também `skills/sementis-squad/SKILL.md`, o adaptador Antigravity e o guia de contribuição para evitar instruções contraditórias.

Uma skill descreve um procedimento recorrente; fatos de arquitetura e limites locais ficam nos `CONTEXT.md` ou nas referências. Não copie todas as regras globais para os perfis.

## Saídas e invariantes

- Nomes, frontmatter e ferramentas dos perfis continuam válidos para o ambiente consumidor.
- Nenhum adaptador reintroduz delegação automática por quantidade de arquivos.
- O workflow atual usa Python 3.10, instala `pytest` além de `requirements.txt` e executa `python -m pytest`. `pytest.ini` descobre `tests/unit` e `tests/integration`; as fixtures isolam o banco. Scripts manuais ficam fora dessa seleção.

Valide Markdown, referências e YAML alterado sem precisar iniciar o produto.
