# Contexto do FlapFish

**Escopo:** minigame em Phaser já existente. Essa dependência pertence ao jogo e não muda a convenção Vanilla JS das outras páginas.

## Entradas e caminho ativo

- [index.html](index.html) carrega Phaser 3.60.0 por CDN e `src/main.js` como módulo ES.
- [src/main.js](src/main.js) configura canvas, física Arcade e cenas.
- [Contexto das cenas](src/scenes/CONTEXT.md) orienta alterações de gameplay.
- `jogos.html` e `trilhas.html`, na raiz de `frontend/`, apontam para `FlapFish/index.html`.

Existe outra árvore em `FlapFish/Flap Fish/`. As páginas do produto citadas acima usam a árvore externa. Confirme referências antes de editar uma cópia; não sincronize ou remova a outra sem necessidade da tarefa. O `phaser.js` local não é o script carregado pelo HTML ativo.

## Processo

1. Localize o problema na cena responsável e confira chaves dos assets e transições.
2. Preserve o uso de módulos ES e a resolução relativa de imagens. Abra por servidor HTTP para exercitar os imports.
3. Para integração com a trilha, leia o listener de `message` e o iframe em `trilhas.html`. A presença do listener não comprova que o jogo emite o evento: confirme ambos os lados antes de prometer conclusão automática.

## Saídas e invariantes

- Menu → partida → GameOver → nova partida continuam funcionando.
- Pontuação/combo do minigame são estado local do jogo. XP, moedas e progresso persistido seguem [o contrato do back-end](../../docs/referencias/fluxos-backend.md).
- Assets e cenas carregam sem erros no console, tanto na abertura direta quanto no iframe quando a integração for afetada.

Veja [Validação](../../docs/referencias/validacao.md) para a conferência manual.
