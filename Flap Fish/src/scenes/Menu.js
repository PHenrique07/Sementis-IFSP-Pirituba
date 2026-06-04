export class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        // Background
        let bg = this.add.image(400, 300, 'background');
        bg.setScale(0.55,0.3);

        // Peixe e Algas
        this.add.image(400, 300, 'peixe').setScale(0.1);
        this.add.image(550, 430, 'alga').setScale(0.18);
        this.add.image(250, 430, 'alga').setScale(0.18);

        // Botão (Selo)
        let playButton = this.add.image(400, 500, 'play');
        playButton.setScale(0.7);
        playButton.setInteractive({ cursor: 'pointer' });

        playButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Título
        this.add.text(400, 100, 'Flap Fish', { 
            fontSize: '32px', 
            fill: '#fff' 
        }).setOrigin(0.5);
    }
}