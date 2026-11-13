# Contexto do PWA

**Escopo:** [manifest.webmanifest](manifest.webmanifest), [pwa-register.js](pwa-register.js), ícones e [sw.js](../sw.js) na raiz pública `frontend/`.

## Entradas

Página e origem usadas para abrir o produto, caminhos do manifest/ícones, estratégia de cache e comportamento de atualização esperado.

## Processo

1. Verifique se o registro do service worker está ativo antes de atribuir um problema ao cache. Atualmente o corpo de `pwa-register.js` está inteiramente comentado; carregar o arquivo não registra `sw.js`.
2. `sw.js` declara `CACHE_VERSION`, caches de shell/runtime e `APP_SHELL_FILES`. Navegações tentam rede primeiro; recursos da mesma origem consultam cache primeiro. Preserve esse contrato quando a tarefa não pedir outra estratégia.
3. Ao alterar o shell/cache, revise existência e resposta de cada caminho: `cache.addAll` falha se algum recurso não puder ser carregado. Revise também versão e limpeza dos caches antigos.
4. Valide em HTTP local ou HTTPS, conferindo escopo e resolução dos caminhos a partir da página. Ativar o registro é uma mudança de comportamento própria, não uma consequência automática de editar o manifest.

## Saídas e invariantes

- Manifest e ícones carregam nos caminhos declarados.
- Se o registro for ativado/alterado, instalação, atualização e fallback de navegação são verificados no navegador.
- Disponibilidade offline da interface não significa disponibilidade offline da API, nem permite inventar saldo ou progresso.

Consulte [Validação](../../docs/referencias/validacao.md) para as verificações do navegador.
