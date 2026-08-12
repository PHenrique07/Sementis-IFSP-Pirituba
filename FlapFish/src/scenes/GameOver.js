export class GameOver extends Phaser.Scene{
    constructor() {
        super({key:'GameOver'});
    }
    init(data){
        this.scoreFinal=data.pontuacao;
        this.comboFinal=data.comboF;
    }
    create(){
        let bg = this.add.image(400, 300, 'background');
        bg.setScale(Math.min(0.55,0.3));
        this.add.text(400, 100, 'Game Over', { 
            fontSize: '32px', 
            fill: '#fff' 
        }).setOrigin(0.5);
        this.add.text(200, 200, `Pontos: ${this.scoreFinal}`);
        this.add.text(200, 250, `Combo: ${this.comboFinal}`);
        let playButton = this.add.image(400, 400, 'play');
        playButton.setScale(0.7);
        playButton.setInteractive({ cursor: 'pointer' });
        playButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
        // Criando um botão de voltar para a trilha
    }
}
