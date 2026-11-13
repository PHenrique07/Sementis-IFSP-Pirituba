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
| Ilustrações vetoriais dos personagens | `personagens.js`, carregado antes do script inline de `trilhas.html` |
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

- Na home, `data-modulo-id` relaciona os cards ao payload de `/api/modulos/progresso`. O card `.active`, `aria-current="step"` e a etiqueta `.module-highlight` acompanham `em_destaque` decidido no servidor; limpe o destaque anterior ao aplicar cache ou resposta atualizada. A etiqueta mostra “Comece por aqui”, “Continue aqui” ou “Módulo concluído”, conforme as contagens do payload, com ponto `.module-pulse` discreto e estático em movimento reduzido. Cards sem módulo cadastrado não herdam o progresso de Fundamentos.

- A navegação continua entre documentos por links nativos. shared-navbar.css habilita View Transitions na mesma origem e preserva visualmente o menu; navegadores sem suporte usam a navegação normal. Validar por HTTP e respeitar movimento reduzido.
- O mapa reconstrói nós somente quando a largura útil muda; pausa decoração fora da viewport. Fechar o FlapFish descarrega o iframe.
- `personagens.js` apresenta SVGs estáticos com carregamento preguiçoso e reserva em PNG; o observador do mapa carrega a versão inline para animar detalhes independentes somente ao se aproximarem da viewport. IDs de recortes/referências são exclusivos por instância. Os detalhes animados são caminhos completos, sem máscaras que dividam a anatomia. Movimento reduzido e a pausa fora da tela/aba oculta também abrangem as partes internas.
- Ao mudar o acervo, atualize `VERSAO_VETORES_PERSONAGENS` e a versão do `<script>` em `trilhas.html`. A URL versionada invalida os arquivos antigos; o SVG inline usa `cache: 'no-cache'` para revalidar a resposta HTTP, mantendo o reaproveitamento em memória durante a página. Não use `force-cache`, pois ele pode manter desenhos com recortes já corrigidos.
- `missions.html` e `passe-batalha.js` usam `GET /api/passe` e `POST /api/passe/<nivel>/resgatar` para a jornada gratuita: somente moedas, XP e vidas. O catálogo, nível e estado de coleta são do servidor; o navegador não calcula elegibilidade nem importa `pb_coletadas`/`pb_premium_ativo` antigos. A apresentação é uma trilha vertical linear (`ol`, etapas com marcadores numerados e conectores), com 12 níveis por carregamento, confirmação após persistência e `<dialog>` acessível. Passe Pro é apenas “Em breve”. A capa reutiliza a Sementinha do acervo, sem o antigo banner ou efeitos dourados.
- Em `loja.js`, `GET /api/drone` decide a disponibilidade diária; `POST /api/drone/resgatar` concede 67 moedas. Só o botão de resgate concede; fechar a janela não consome a entrega. Falhas HTTP/rede mantêm o saldo e permitem tentar novamente. O cache local e o botão de demonstração não liberam uma segunda recompensa.
