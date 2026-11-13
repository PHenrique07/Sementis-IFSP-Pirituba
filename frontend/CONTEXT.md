# Contexto do front-end

**Escopo:** todos os arquivos públicos do produto, mantendo HTML/CSS/JavaScript Vanilla e o minigame Phaser existente.

## Entradas e roteamento

| Pedido | Contexto/arquivos |
| --- | --- |
| Página, estrutura e scripts inline | `*.html` nesta pasta |
| Comportamento e API | [js/CONTEXT.md](js/CONTEXT.md) |
| Aparência e responsividade | [css/CONTEXT.md](css/CONTEXT.md) |
| Manifest, registro e `sw.js` | [pwa/CONTEXT.md](pwa/CONTEXT.md) |
| Minigame Phaser | [FlapFish/CONTEXT.md](FlapFish/CONTEXT.md) |
| Contrato HTTP ou regra de negócio | [../backend/CONTEXT.md](../backend/CONTEXT.md) |

## Processo

1. Abra a página solicitada e leia seus `<script>`/`<link>` antes de editar. `trilhas.html`, `loja.html` e `painel-professor.html` também contêm implementação inline.
2. Preserve IDs/classes usados por scripts, ordem de carga e caminhos relativos. A organização física é `frontend/`, mas as URLs continuam `/js/...`, `/css/...` e `/pagina.html`, sem adicionar `/frontend`.
3. Para servir estaticamente a partir da raiz do repositório, use `python -m http.server 3000 --directory frontend`. No Live Server, use esta pasta como raiz pública; servir a raiz do repositório não resolve os caminhos absolutos existentes.
4. No Flask, `backend.app.BASE_DIR` aponta para esta pasta. Na Vercel, `outputDirectory` publica `frontend/`; a API continua separada, conforme `js/api-config.js`.

## Saídas e invariantes

- A interface apresenta o estado autoritativo do back-end. Quiz visual e pontuação local do FlapFish não concedem XP/moedas persistidos.
- Os contratos entre HTML, scripts e API continuam compatíveis; preserve carregamento, vazio, sucesso e erro.
- Manifest e service worker continuam nas URLs originais; sua organização interna e o registro comentado não foram alterados pela movimentação.
- Backend, banco e `.env` ficam fora do diretório público.
- As 25 poses das trilhas usam diretamente os SVGs em `assets/personagens/vetores/`, vetorizados da prancha `assets/grade_personagens_sustentabilidade.png` (mantida como fonte dos desenhos). Os recortes PNG duplicados foram removidos; não os recrie como reserva. Preserve o `viewBox` e os limites de cada pose ao editar os SVGs. Anime somente caminhos completos de detalhes independentes; não separe cabelo, rosto ou corpo com máscaras retangulares, pois o movimento abre frestas no desenho. A vetorização suaviza os contornos, mas simplifica sombras e texturas da prancha.
- Autoria dos vetores: VTracer `1.0.0-alpha.4`, curvas `spline`, `filterSpeckle: 4`, `colorPrecision: 6`, `layerDifference: 24`, `cornerThreshold: 90`, `lengthThreshold: 3.5`, `spliceThreshold: 45`, `pathPrecision: 1`, `optimize: 2`. Os recortes seguem os limites visuais das poses, não uma grade uniforme. O conversor é ferramenta de autoria; não faz parte das dependências ou do carregamento do produto.
- Preserve os traços finos do rosto: as bocas de `curupira_plantando.svg`, `curupira_lixo.svg` e `curupira_riacho.svg` foram recuperadas da prancha com vetorização de maior detalhe (`filterSpeckle: 0`, `colorPrecision: 8`, `layerDifference: 8`, `pathPrecision: 2`, `optimize: 0`). A simplificação geral apagava esses caminhos. A pose com binóculos mantém a boca encoberta, conforme o original.

## Validação

Os testes de [estrutura pública](../tests/integration/test_estrutura_publica.py) conferem o transporte dos arquivos e aliases pelo Flask. Para alterações visuais ou de comportamento, faça também os cenários de navegador em [Validação](../docs/referencias/validacao.md).
