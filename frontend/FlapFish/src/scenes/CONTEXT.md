# Contrato das cenas

O ponto de entrada e a árvore usada pelo produto estão no [contexto do FlapFish](../../CONTEXT.md).

## Entradas

| Cena | Responsabilidade |
| --- | --- |
| `Preloader.js` | Carrega imagens de `assets` e abre `Menu` |
| `Menu.js` | Apresenta a entrada para a partida |
| `Game.js` | Controla física, colisões, pontuação e combo |
| `GameOver.js` | Recebe resultado, exibe pontos/combo e permite reiniciar |

## Processo e saídas

Preserve as chaves registradas no `Phaser.Scene` e em `src/main.js`. Ao mudar assets, atualize a chave no carregamento e nos consumidores. `Game` envia `{pontuacao, comboF}` a `GameOver`; mantenha `init(data)` compatível.

## Invariantes e validação

Reiniciar cria uma partida com pontuação/combo e objetos no estado esperado; não duplica listeners ou objetos da anterior. Exercite colisão, fim de partida e reinício no navegador conforme [Validação](../../../../docs/referencias/validacao.md).
