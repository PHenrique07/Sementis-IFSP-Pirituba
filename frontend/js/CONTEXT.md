# Contexto do JavaScript da interface

**Escopo:** scripts de página e integração HTTP. Para o HTML que os carrega, consulte [o contexto do front-end](../CONTEXT.md). Para aparência, siga [CSS](../css/CONTEXT.md).

## Entradas e mapa de arquivos

Comece pela página e confira os scripts efetivamente carregados; nomes de arquivo próximos não garantem que sejam usados naquela tela.

| Fluxo | Arquivos a localizar |
| --- | --- |
| Ambiente e login | `api-config.js`, `login.js`, `cadastro.js`, `auth.js`, `../login.html` |
| Perfil e navegação comum | `main.js`, `shared-navbar.js`, `perfil.js` |
| Home e entrada em turma | `home.js`, `entrar-turma.js` |
| Mapa, quiz e baús | `quiz.js`, `sounds.js`, `loading.js`, scripts inline de `trilhas.html` |
| Professor e geração de trilhas | `painel-professor.js`, `professor.js`, scripts inline de `painel-professor.html` |
| Turmas | `turma-professor.js`, `turma-aluno.js` |
| Loja, inventário e gacha | `loja.js`, `inventário.js`, `gacha.js`, scripts inline de `loja.html` |
| Missões, ligas e amizades | `missoes.js`, `ligas.js`, `escolherRanking.js`, `listaAmigos.js` |
| Arena e host | `arena.js`, `live-host.js` e [contrato de Arena](../../backend/CONTEXT.md#arena-ao-vivo) |

## Processo

1. Localize o evento de entrada, IDs/classes do DOM, estado local e rota usada. A maioria dos scripts é carregada como script clássico, sem bundler; siga o padrão da página.
2. `api-config.js` define `API_BASE_URL` e deve preceder quem o utiliza. Ele distingue `localhost`/`127.0.0.1` de outros hosts; não espalhe URLs fixas em novos `fetch`.
3. Confira método, payload e retorno diretamente em `backend/app.py`, apoiado por [Fluxos do back-end](../../docs/referencias/fluxos-backend.md). Algumas telas e a Wiki têm referências antigas: não invente uma rota para satisfazer um nome no front-end.
4. Preserve `localStorage` com chaves `token` e `user` nos fluxos que as utilizam. Rotas protegidas recebem `Authorization: Bearer <token>`; siga o uso de `credentials` da integração existente.
5. Diferencie falha HTTP de falha de rede. Nos fluxos autenticados, preserve o tratamento de `401` e a volta ao login. Ao alterar uma tela, confira também carregamento, estado vazio e erro.
6. Use os valores de XP, nível, saldo, ofensiva, disponibilidade e raridade recebidos da API. Cálculos de animação/progresso visual pertencem à interface; concessão de recompensa pertence ao servidor.

## Saídas e invariantes

- IDs e classes usados pelo JavaScript continuam presentes no HTML; listeners compartilhados não podem quebrar páginas sem o componente.
- Alterações em formato de questão preservam o acordo entre `tipo_layout`/`conteudo`, quiz e sementes.
- Os toques animados dos baús mostram `evolucao`/`raridade` já sorteadas pelo servidor; não fazem um segundo sorteio.
- Arena e host compartilham PIN, estados e intervalo de polling; não introduza WebSocket como parte de uma correção local.
- `html2pdf.bundle.min.js` é uma biblioteca distribuída, não o lugar para implementar regras da tela.

## Validação

Siga os cenários de interface em [Validação](../../docs/referencias/validacao.md). Não há suíte automatizada de navegador configurada no repositório. Relate as telas e estados verificados e qualquer fluxo que não pôde ser exercitado.

## Fluidez e passe de batalha

- A navegação continua entre documentos por links nativos. shared-navbar.css habilita View Transitions na mesma origem e preserva visualmente o menu; navegadores sem suporte usam a navegação normal. Validar por HTTP e respeitar movimento reduzido.
- O mapa reconstrói nós somente quando a largura útil muda; pausa decoração fora da viewport. Fechar o FlapFish descarrega o iframe.
- Missões e passe (passe-batalha.js) foram integrados de origin/main (1ed20a8), adaptados à raiz pública frontend/. O passe usa assets/ui/passe/ para sombras e pausa decoração fora da tela; preserve o fallback de sombras CSS.
- A implementação importada do passe ainda usa estado local de coleta/premium e cálculo visual de níveis. Não representa concessão persistida de recompensas pelo servidor; uma integração autoritativa exige contrato de back-end próprio.
