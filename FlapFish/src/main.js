import { Preloader } from './scenes/Preloader.js';
import {Menu} from './scenes/Menu.js';
import  {Game}  from './scenes/Game.js';
import {GameOver} from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    title: 'Flap Fish',
    description: '',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: { // O correto dentro de physics é abrir um novo objeto arcade para a gravidade
            gravity: { y: 300 },
            debug: false
        }
    }, // <--- ESSA VÍRGULA ESTAVA FALTANDO AQUI
    scene: [
        Preloader,
        Menu,
        Game,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}; // Fechamento correto do objeto

new Phaser.Game(config);