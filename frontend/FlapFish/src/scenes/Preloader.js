export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.setPath('assets');

        // Fundo de loading
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.add.rectangle(largura / 2, altura / 2, largura, altura, 0x0a1628);

        const barBg = this.add.rectangle(largura / 2, altura / 2 + 20, 400, 16, 0x1e3a5f);
        const bar = this.add.rectangle(largura / 2 - 200, altura / 2 + 20, 0, 16, 0x00e5a0);
        bar.setOrigin(0, 0.5);

        this.add.text(largura / 2, altura / 2 - 30, 'Carregando...', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#a0cfff'
        }).setOrigin(0.5);

        this.load.on('progress', (progress) => {
            bar.width = 400 * progress;
        });

        // Assets
        this.load.image('background', 'background.png');
        this.load.image('alga', 'jogo_flappy_fish_alga_1.png');
        this.load.image('oxigenio', 'jogo_flappy_fish_oxigenio.png');
        this.load.image('peixe', 'jogo_flappy_fish_peixe.png');
    }

    create() {
        this.scene.start('Menu');
    }
}
