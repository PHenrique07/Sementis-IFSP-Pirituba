# Contexto dos estilos

**Escopo:** aparência e responsividade. A estrutura está nos HTMLs de `frontend/`; o comportamento segue o [contexto de JavaScript](../js/CONTEXT.md).

## Entradas

- Página solicitada e ordem dos `<link>` carregados.
- Seletores e classes de estado usados pelo HTML/JS.
- `styles.css` para variáveis globais, reset, fonte e componentes comuns; folha da página para o ajuste específico.

## Processo

1. Confira estilos inline e regras existentes antes de acrescentar um seletor; algumas telas, sobretudo `trilhas.html`, têm estilos na própria página.
2. Reutilize as variáveis existentes de cor, tipografia, sombra, raio e transição. O arquivo global usa Poppins e a paleta roxa/verde; variações de tela já existentes devem ser respeitadas.
3. Restrinja regras específicas à página/componente. Mudanças em `styles.css` e `shared-navbar.css` afetam várias telas.
4. Preserve classes de estado manipuladas pelo JS, foco, legibilidade e botões acessíveis em telas pequenas. Siga os breakpoints próximos em vez de criar uma nova convenção.

## Saídas e invariantes

- Layout validado em largura de celular e desktop, sem rolagem horizontal involuntária nem conteúdo coberto pela navegação fixa.
- Alterações globais verificadas em mais de uma página que as utiliza.
- CSS representa estados de bloqueio, erro e sucesso recebidos pela aplicação; não decide permissões nem regras de negócio.

Use a [referência de validação](../../docs/referencias/validacao.md) para registrar a checagem visual.
