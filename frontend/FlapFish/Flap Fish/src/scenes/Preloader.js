export class Preloader extends Phaser.Scene{
    constructor(){
        super('Preloader');
    }
    preload(){
        this.load.setPath('assets');
        this.load.image('background', 'jogo_flappy_fish_background.png');
        this.load.image('alga', 'jogo_flappy_fish_alga_1.png');
        this.load.image('lixo_barril', 'jogo_flappy_fish_lixo_1.png');
        this.load.image('lixo_alvo', 'jogo_flappy_fish_lixo_2.png');
        this.load.image('oxigenio', 'jogo_flappy_fish_oxigenio.png');
        this.load.image('peixe', 'jogo_flappy_fish_peixe.png');
        this.load.image('play', 'playFF.png');
    }
    create(){
        this.scene.start('Menu');
    }
}