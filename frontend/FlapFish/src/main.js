import { Preloader } from './scenes/Preloader.js';
import { Menu } from './scenes/Menu.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    title: 'Flap Fish',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#0a1628',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },  // gravidade por sprite, não global
            debug: false
        }
    },
    scene: [Preloader, Menu, Game, GameOver],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
