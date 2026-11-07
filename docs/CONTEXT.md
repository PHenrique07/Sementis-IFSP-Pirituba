# Contexto da documentação

**Escopo:** documentação humana, referências para manutenção e orientação de agentes. O código continua sendo a evidência para descrever o comportamento atual.

## Entradas e roteamento

| Pedido | Destino |
| --- | --- |
| Página de onboarding, arquitetura ou contribuição na Wiki | [wiki/CONTEXT.md](wiki/CONTEXT.md) |
| Contratos e fluxos Python compartilhados | [referencias/fluxos-backend.md](referencias/fluxos-backend.md) |
| Comandos, cobertura e efeitos dos testes | [referencias/validacao.md](referencias/validacao.md) |
| Como manter o contexto de agentes | [metodologia-contexto.md](metodologia-contexto.md) |
| Estrutura física, lançadores e hospedagem | [reestruturacao.md](reestruturacao.md) |
| Perfis de agentes e adaptadores dos editores | [.github/CONTEXT.md](../.github/CONTEXT.md) |

## Processo

1. Identifique se o pedido muda uma regra local, uma referência compartilhada ou uma página da Wiki; edite sua fonte responsável.
2. Confirme nomes de rotas, modelos, configurações e comandos nos arquivos reais. A Wiki contém exemplos históricos; não use um exemplo antigo para inventar um endpoint.
3. Use português e links relativos portáveis nos documentos consultados no repositório. Contextos apontam para referências, em vez de copiá-las.
4. Preserve o procedimento de publicação da Wiki em [README.md](README.md). Arquivos `CONTEXT.md` orientam manutenção no repositório e não são páginas para publicar.

## Saídas e invariantes

- Documentação descreve o estado implementado ou identifica explicitamente uma proposta/limitação.
- Links locais levam a arquivos existentes; títulos e caminhos de páginas publicáveis continuam coerentes.
- Uma mudança de contrato atualiza sua referência e os contextos que deixariam de orientar corretamente, sem duplicar a mesma regra em todas as pastas.

Para documentação, valide links e diff; executar API ou sementes não é necessário. Consulte [Validação](referencias/validacao.md).
