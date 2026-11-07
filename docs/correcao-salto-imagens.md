# Corrigir saltos e palavras no lugar de imagens

Registro de manutenção: 02/11/2026. Diagnóstico e validação realizados no Firefox 159, com a aplicação local e dados de teste isolados.

## Sintomas

Ao navegar para Trilhas (`home.html`), os itens da barra mudavam de posição por um instante. Antes de os desenhos aparecerem, os módulos mostravam “Básico”, “Água” e “Clima”; a barra também mostrava nomes truncados no espaço dos ícones.

Esses ícones são imagens PNG. As palavras eram seus atributos `alt`, exibidos visualmente pelo navegador enquanto as imagens estavam pendentes. Não eram nomes de uma fonte de ícones.

## Causa confirmada

O logo da barra lateral tinha `width: 100%` e `height: auto`, mas não reservava sua proporção antes de carregar. Sua altura inicial era zero. Quando o navegador descobria as dimensões do PNG, a altura aumentava e empurrava todos os links abaixo dele.

O arquivo `assets/brand/logo_sementis_branco.png` mede **1707 × 420 px**. No teste desktop de 1366 × 900 px:

| Medida | Antes de carregar o PNG, sem correção | Depois de carregar |
| --- | --- | --- |
| Altura do logo da sidebar | 0 px | 49,45 px |
| Posição vertical do texto “Trilhas” | 86,20 px | 135,65 px |

Os módulos e os ícones da barra já tinham caixas dimensionadas em CSS. Neles, o problema reproduzido era o texto alternativo visível no lugar do desenho, não a falta de tamanho da caixa.

## Correção aplicada

### Reservar a proporção dos logos

Em [`../css/shared-navbar.css`](../css/shared-navbar.css), acrescentamos a proporção real ao logo desktop, mantendo as outras regras:

```css
.sidebar-logo img {
  width: 100%;
  height: auto;
  aspect-ratio: 1707 / 420;
  display: block;
}
```

Essa regra permanece dentro do media query desktop existente. O logo passa a ocupar a mesma altura antes e depois do download.

Em [`../css/home.css`](../css/home.css), aplicamos a mesma proporção ao logo do cabeçalho:

```css
.header-logo {
    height: 40px;
    width: auto;
    aspect-ratio: 1707 / 420;
}
```

A regra mobile existente continua definindo altura de 32 px. A proporção permite reservar a largura correspondente quando a largura é automática, respeitando o layout flex existente.

### Evitar o texto visual temporário sem apagar os `alt`

Em `css/shared-navbar.css`:

```css
.sidebar-logo img,
.nav-item img,
.more-menu-item img {
  font-size: 0;
  color: transparent;
}
```

Em `css/home.css`:

```css
.home-header img,
.module-icon {
    font-size: 0;
    color: transparent;
}
```

Essas propriedades suprimem o texto visual de fallback nas imagens selecionadas. Os atributos `alt` continuam no HTML para a acessibilidade. Não aplicar a regra aos links, títulos ou containers: seus textos precisam continuar visíveis.

O download e a decodificação ainda acontecem normalmente. Uma imagem pendente pode deixar sua área vazia até carregar; esta correção não acelera a rede nem conserta uma URL quebrada.

## Como diagnosticar se voltar

1. Identifique a página real pelo endereço. O link “Trilhas” da navbar compartilhada aponta para `home.html`; `trilhas.html` é outra tela.
2. Abra a página em um perfil de teste do Firefox, com cache desabilitado e rede lenta nas ferramentas de desenvolvimento. Confira se o recurso realmente veio da rede: cache do navegador e service worker podem esconder o atraso.
3. Observe a tela enquanto os PNGs ainda estão pendentes e depois de carregados. Compare também com uma navegação de cache aquecido.
4. Procure o texto observado nos atributos `alt` do HTML ou de [`../js/shared-navbar.js`](../js/shared-navbar.js). Se coincidir, investigue imagens antes de alterar fontes ou animações.
5. Confira status HTTP, caminho, tamanho e dimensões reais dos arquivos. Se houver erro de carregamento, corrija sua causa; ocultar o fallback não resolve esse erro.
6. Compare as caixas do logo e dos rótulos antes/depois. No console, use o trecho abaixo enquanto as imagens ainda estão pendentes e repita quando terminarem:

```js
console.table(
  ['.sidebar-logo img', '.nav-item span', '.header-logo', '.module-icon']
    .map(seletor => {
      const elemento = document.querySelector(seletor);
      if (!elemento) return { seletor, ausente: true };
      const caixa = elemento.getBoundingClientRect();
      return {
        seletor,
        y: caixa.y,
        largura: caixa.width,
        altura: caixa.height,
        carregada: elemento instanceof HTMLImageElement
          ? elemento.complete && elemento.naturalWidth > 0
          : null
      };
    })
);
```

`complete` sozinho não comprova sucesso: também pode ser verdadeiro em uma imagem com falha. Por isso a checagem inclui `naturalWidth`.

## Como replicar em outra imagem

- Se apenas um eixo tiver tamanho definido e o outro for automático, reserve a proporção real com `aspect-ratio`. Use as dimensões do arquivo correto; **1707 / 420 é específico deste logo**.
- Se ambos os eixos já estiverem definidos, preserve essas medidas. Os módulos atuais usam wrappers de 120/140 px; os ícones da barra têm medidas próprias, inclusive exceções para Turmas.
- Aplique o tratamento do texto de fallback somente às imagens que precisam dele, conservando nomes acessíveis. Não esconda a página até um evento `load`, nem use uma regra global para todas as imagens.
- Se o elemento ainda mudar de posição com todas as imagens carregadas, investigue separadamente a troca da Poppins, quebra de linhas, atualizações da API e animações. A fonte remota com `display=swap` não foi alterada por este patch; não foi a causa do salto de 49,45 px reproduzido.

## Validação e limites

- No Firefox, com os PNGs bloqueados temporariamente, o logo corrigido já reservou 49,45 px no desktop. O texto “Trilhas” permaneceu em **135,65 px antes e depois** do carregamento.
- As capturas com imagens pendentes deixaram de mostrar os nomes no lugar dos ícones e desenhos. A captura carregada manteve as artes e o layout final.
- Em 768 px, o logo do cabeçalho manteve aproximadamente 130,05 × 32 px e o rótulo da navbar manteve a mesma posição antes/depois do carregamento.
- Conferimos dimensões em 320, 768, 1024 e 1440 px. Isso não substitui um teste de toque em aparelho físico.
- Os `alt` permaneceram intactos. Cores, hover verde, filtros, estados bloqueados e regras responsivas não foram alterados neste patch.
- A revisão XimbeIA e `git diff --check` passaram.

Esta correção acrescentou somente regras em `css/home.css` e `css/shared-navbar.css`. As remoções de animações de entrada e as otimizações do passe de batalha presentes no mesmo conjunto de alterações locais pertencem a correções anteriores.
