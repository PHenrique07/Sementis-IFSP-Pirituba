# Travamento ao rolar o passe de batalha

Registro de manutenção: 02/11/2026. Complementa a correção anterior dos brilhos com a tela parada; aquela mudança não tinha demonstrado melhora consistente durante a rolagem.

## Diagnóstico e resultado

O gargalo reproduzido no Firefox estava na pintura das sombras dos cards e nas animações decorativas que continuavam ativas fora da tela ou no modal de XP fechado. Não havia reconstrução da lista em cada scroll nem handler pesado de rolagem no passe.

Comparamos três percursos de rolagem nativa no Firefox 159 headless, viewport 1366 × 900, mesma sessão e dados locais de teste. Cada percurso usou 12 eventos wheel de 333 px, duração de 100 ms cada, com amostragem de `requestAnimationFrame` durante dois segundos. O cursor ficou fora dos cards para controlar o hover.

| Medida | Antes deste patch | Versão final revisada |
| --- | --- | --- |
| Quadros amostrados nas três execuções | 49 / 54 / 52 | 75 / 72 / 72 |
| Intervalos entre quadros acima de 50 ms | 19 / 19 / 17 | 2 / 1 / 2 |
| Percentil 95 do intervalo entre quadros | 83 / 83 / 67 ms | 50 / 50 / 50 ms |

Esses números demonstram redução dos engasgos nesse teste, não 60 FPS constantes nem equivalência a um aparelho físico. A duração total de captura inclui o fim do movimento. Medir somente a tela parada não valida esta correção.

Remover apenas o blur, os filtros das imagens ou os vídeos não explicou a melhora. Testes de containment, camadas forçadas e suspensão de efeitos de linhas distantes também não justificaram alterações permanentes. O blur original foi preservado.

## Implementação

- [`../css/missions.css`](../css/missions.css): as sombras em repouso usam dois PNGs transparentes em 2×, recortados em nove partes por `border-image` no `::after` dos cards. As bordas, fundos, blur e hover continuam definidos em CSS. No hover, a camada rasterizada desaparece em 180 ms e a sombra CSS original é usada.
- [`../assets/ui/passe/sombra-gratis.png`](../assets/ui/passe/sombra-gratis.png) e [`../assets/ui/passe/sombra-premium.png`](../assets/ui/passe/sombra-premium.png): sombras geradas pelo próprio renderizador CSS, sem redesenhar as artes.
- [`../js/passe-batalha.js`](../js/passe-batalha.js): carrega ambos os PNGs e só adiciona `pass-sombras-prontas` ao body quando os dois terminam com sucesso. Enquanto carregam, ou se qualquer um falhar, permanecem as sombras CSS originais. A abertura não espera esses recursos.
- O wrapper `.pv-cell-inner` conserva o recorte e o padding originais do conteúdo. A célula externa permite desenhar a sombra fora dela. `min-width: 0` mantém as larguras flex originais no celular.
- Um `IntersectionObserver`, com margem de 100 px, acompanha a barra superior, o cabeçalho e as linhas. A classe `pass-animacao-pausada` suspende animações fora da região próxima da tela. Linhas antigas são desregistradas na reconstrução; reabrir reaproveita as observações. A aba oculta pausa a decoração por `missoes-aba-oculta`.
- [`../js/missoes.js`](../js/missoes.js): vídeos decorativos de autoplay pausam quando invisíveis, fora da viewport, com modal fechado ou aba oculta. O vídeo do título é desregistrado e registrado novamente quando a lista é recriada. Somente a classe do modal é acompanhada por `MutationObserver`.
- O modal de XP usa `visibility: hidden` após os 300 ms do fade de fechamento; ao abrir fica visível imediatamente. Sua decoração permanece pausada quando fechado.

Nenhum endpoint, regra de XP/recompensa, payload, chave de armazenamento ou arquivo de backend foi alterado por esta correção.

## Armadilhas para não reintroduzir

1. Não trocar `overflow: hidden` por `visible` sozinho: isso muda o tamanho mínimo automático dos itens flex e pode alargar o premium no celular. Também libera o brilho dos botões para fora do recorte. O wrapper e `min-width: 0` fazem parte da correção.
2. Não desligar as sombras CSS antes de ambos os PNGs carregarem. Testar falha de um dos arquivos e rede lenta faz parte do aceite.
3. Não observar apenas `.pass-inpage-header-card`: o ponto piscante da temporada fica em `.pass-inpage-top-bar`, fora desse card.
4. Não manter animações rodando apenas porque o ancestral está com `opacity: 0`; o modal fechado era um desses casos.
5. Não chamar `play()`/`pause()` via WAAPI no teste de pausa CSS: o controle imperativo pode sobrepor o estado declarativo e invalidar a comparação. Recarregar a página entre experimentos com WAAPI e testes da implementação.
6. Após aplicar CSS de teste, aguardar a pintura e pelo menos os 180 ms das transições antes de capturar. Uma captura imediata pode registrar o quadro anterior e sugerir equivalência visual falsa.

## Regenerar os PNGs no Firefox

As imagens têm 320 × 320 pixels, mas representam uma área CSS de 160 × 160: card de 80 × 80 posicionado em 40 × 40, com borda transparente de 1 px. Essa borda é necessária para posicionar os realces internos como nos cards reais. O CSS usa cortes de 120 pixels, largura de 60 px e extensão externa de 40 px.

Executar este trecho no console de uma página local de teste no Firefox cria links de download. Substituir os arquivos em `assets/ui/passe/` e repetir as comparações; não executar na página publicada com dados reais.

```js
(async () => {
  const modelos = [
    {
      nome: 'sombra-gratis.png',
      raio: '20px 8px 8px 20px',
      sombra: '0 4px 14px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.1), inset 0 -1px 0 rgba(0,0,0,.2)'
    },
    {
      nome: 'sombra-premium.png',
      raio: '8px 20px 20px 8px',
      sombra: '0 4px 18px rgba(0,0,0,.45), 0 0 20px rgba(251,191,36,.08), inset 0 1px 0 rgba(255,255,255,.12), inset 0 -1px 0 rgba(0,0,0,.2)'
    }
  ];
  for (const modelo of modelos) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 160 160">
      <foreignObject width="160" height="160">
        <div xmlns="http://www.w3.org/1999/xhtml" style="position:absolute;left:40px;top:40px;width:80px;height:80px;box-sizing:border-box;border:1px solid transparent;border-radius:${modelo.raio};box-shadow:${modelo.sombra}"></div>
      </foreignObject>
    </svg>`;
    const imagem = new Image();
    const carregamento = new Promise((resolve, reject) => {
      imagem.onload = resolve;
      imagem.onerror = reject;
    });
    imagem.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await carregamento;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 320;
    canvas.getContext('2d').drawImage(imagem, 0, 0, 320, 320);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = modelo.nome;
    link.textContent = 'Baixar ' + modelo.nome;
    link.style.display = 'block';
    document.body.appendChild(link);
  }
})();
```

## Revalidar se voltar a travar

- Confirmar no Network que os dois PNGs carregam e que o body recebe `pass-sombras-prontas`. Se não receber, o fallback é funcional, mas mais caro.
- Repetir três percursos com mesma distância, duração, viewport, cursor e dados. Comparar cache frio/aquecido separadamente. Registrar intervalos acima de 50 ms e p95 durante o movimento.
- No meio da lista, conferir `document.getAnimations()`: as animações do cabeçalho, linha atual distante e modal fechado devem estar pausadas. Voltar ao topo deve retomar a decoração visível.
- Conferir 60 linhas, 120 células e altura desktop de 7072 px no cenário testado. Validar 320, 390, 680, 768, 1024 e 1440 px sem deformar os cards.
- Comparar capturas estáveis de repouso e hover, com animações congeladas no mesmo instante, inclusive DPR 2. O teste final de recorte em 320 px não apresentou deslocamentos; a diferença máxima de cor foi 8/255.
- Testar coleta grátis/premium, reabertura, “Meu nível”, modal XP rápido, aba oculta/restaurada, recriação do título pela API e PNG com erro.
- Executar `node --check js/passe-batalha.js`, `node --check js/missoes.js` e `git diff --check`.

Revisão estática realizada por XimbeIA. Testes locais em navegador automatizado; toque em celular físico e comportamento no site publicado ainda dependem de validação nesses ambientes.
