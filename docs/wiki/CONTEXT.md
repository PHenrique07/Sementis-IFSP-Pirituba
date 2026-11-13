# Contrato das páginas da Wiki

Siga primeiro o [contexto de documentação](../CONTEXT.md). Esta pasta reúne páginas destinadas à Wiki do GitHub.

## Entradas

- Página solicitada, índice em [../README.md](../README.md) e navegação em [_Sidebar.md](_Sidebar.md).
- Para fatos técnicos, leia o módulo real e a referência indicada em [../CONTEXT.md](../CONTEXT.md).

## Processo

Atualize a página do assunto: arquitetura em `02`, Python em `03`, interface em `04`, jogos em `05`, contribuição em `06`. Preserve nomes usados pela Wiki e links entre páginas no formato já empregado por `_Sidebar.md` (sem extensão).

As referências de `03-backend.md` a Gemini e a alguns endpoints são históricas: confira `backend/semeia.py`/`backend/app.py` antes de reutilizar esses exemplos. O mapa de pastas acompanha `backend/`, `frontend/` e `tests/`; a raiz mantém os lançadores de execução. Em `07-guia-de-skills`, preserve o nome atual sem extensão ao referenciá-lo.

## Saídas, invariantes e validação

Página coerente com a implementação e navegação atualizada quando necessário. Para links a arquivos que não serão publicados na Wiki, use o destino correspondente no repositório; um caminho relativo válido aqui pode deixar de existir após a cópia para a Wiki.

Não inclua este `CONTEXT.md` na publicação. Valide caminhos locais e os títulos usados pela navegação; publicar remotamente só faz parte da tarefa quando solicitado.
