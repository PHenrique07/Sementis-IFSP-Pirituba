---
name: sementis-ui
description: Define e implementa interfaces do Sementis com identidade visual consistente, acessibilidade, responsividade e Vanilla HTML/CSS/JS.
---

# Sementis UI

## Quando usar

Use ao criar ou alterar páginas, componentes, navegação, formulários, cards, jogos, dashboards ou qualquer experiência visual do Sementis.

## Contexto obrigatório

Antes de editar:

1. Leia a página HTML e o CSS da tela relacionada.
2. Reutilize `css/styles.css` e `css/shared-navbar.css` quando aplicável.
3. Procure componentes equivalentes antes de criar classes novas.
4. Preserve HTML, CSS e JavaScript puro. Não introduza frameworks, bibliotecas ou ícones remotos sem necessidade.
5. Mantenha variáveis, funções e comentários prioritariamente em português.

## Identidade visual

A interface deve parecer parte do mesmo produto:

- Primária: `#27275e`.
- Primária escura: `#1a1a4a`.
- Primária clara: `#3a3a7a`.
- Destaque: `#a9ff71`.
- Destaque escuro: `#8ce05a`.
- Texto claro: `#ffffff`.
- Texto secundário: `#8d92bc` ou os tokens cinza existentes.
- Sucesso: `#10b981`.
- Aviso: `#f59e0b`.
- Erro: `#ef4444`.
- Fonte existente: `Poppins`, com fallback definido no projeto.

Use os tokens de `:root` em vez de repetir valores hexadecimais. Evite criar uma segunda paleta, gradientes roxos genéricos ou sombras muito intensas.

## Composição

- Comece pelo conteúdo e pela ação principal da página.
- Use uma hierarquia clara: um `h1`, depois `h2` e `h3` sem pular níveis.
- Prefira layouts de uma coluna no celular e expanda com grid ou flex em telas maiores.
- Use o container existente e a escala de espaçamento baseada em múltiplos de 4px.
- Cards servem para itens repetidos, métricas, módulos e diálogos; não transforme cada seção em um card.
- Mantenha raios consistentes: 8px para controles compactos, 12px ou 16px para superfícies maiores e `9999px` somente para pílulas ou avatares.
- O botão principal deve ser visualmente evidente, mas não competir com o conteúdo.
- Use ícones e imagens existentes em `assets/` e `pwa/icons/`; mantenha dimensões estáveis.

## Componentes

### Botões

Use `<button>` para ações e `<a>` para navegação. Siga as classes `.btn`, `.btn--primary`, `.btn--outline`, `.btn--ghost`, `.btn--large` e `.btn--full` quando forem adequadas.

Todo botão deve ter:

- Texto que descreva a ação ou `aria-label` para botão somente com ícone.
- Estado `:hover`, `:focus-visible`, `:active` e `:disabled` quando aplicável.
- Área de toque confortável, especialmente no mobile.

### Navegação

Reutilize a navegação compartilhada. No mobile, respeite `.bottom-nav`, `.nav-item`, `.mobile-only` e `.desktop-only`. A página ativa deve ser identificável por texto e por estilo, nunca somente por cor.

### Formulários

- Cada campo tem `<label>` associado por `for` e `id`.
- Use o tipo de input correto e `autocomplete` quando fizer sentido.
- Mostre erro junto ao campo, com texto e `aria-describedby`.
- Não apague o valor digitado quando uma validação falhar.
- Nunca coloque regra de negócio no frontend; o backend continua sendo a fonte de verdade.

### Estados

Toda tela que depende de dados deve prever carregamento, sucesso, vazio e erro. O estado vazio deve orientar a próxima ação. O erro deve explicar o que falhou e oferecer recuperação quando possível.

## Responsividade

Projete mobile-first e valide em 320px, 768px, 1024px e 1440px.

- Não permita que texto, botões ou cards saiam da viewport.
- Evite alturas fixas em conteúdo variável.
- Reserve espaço para a navegação inferior e para `env(safe-area-inset-bottom)`.
- Mantenha controles de toque com pelo menos 44px de altura e largura quando possível.
- Teste orientação estreita antes de ajustar telas largas.

## Acessibilidade

- Use HTML semântico (`main`, `nav`, `header`, `section`, `form`, `button`).
- Garanta contraste mínimo WCAG AA: 4.5:1 para texto normal e 3:1 para texto grande.
- Nunca comunique estado apenas por cor; associe texto, ícone ou padrão.
- Preserve foco visível com `:focus-visible`.
- Não use `<div>` clicável quando um `<button>` ou `<a>` resolver.
- Imagens informativas têm `alt`; imagens decorativas usam `alt=""`.
- Modais devem controlar foco, fechar de forma acessível e indicar `role="dialog"` quando necessário.
- Respeite `prefers-reduced-motion` para animações não essenciais.

## Movimento e acabamento

Use poucas animações com propósito: entrada de conteúdo, feedback de ação e mudança de estado. Prefira `transform` e `opacity`, com duração curta. Não use movimento contínuo que distraia ou dificulte a leitura.

## Segurança e dados

Não renderize HTML vindo da API sem sanitização. Use `textContent` para texto dinâmico. Não coloque tokens, senhas ou dados sensíveis no HTML, CSS, logs ou armazenamento local sem justificativa.

## Verificação

Antes de concluir:

- [ ] A tela usa a paleta e os tokens existentes.
- [ ] A navegação compartilhada continua funcionando.
- [ ] Não há overflow horizontal em 320px.
- [ ] Todos os controles funcionam por teclado e têm foco visível.
- [ ] Campos têm labels e mensagens de erro acessíveis.
- [ ] Estados de carregamento, vazio e erro foram tratados.
- [ ] Não há erros no console do navegador.
- [ ] Imagens e caminhos de assets carregam corretamente.
- [ ] A lógica de negócio permanece no backend.
- [ ] A página foi conferida em mobile e desktop.
