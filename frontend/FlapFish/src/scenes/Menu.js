import { tocarSom } from '../audio.js';

export class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        const larguraConteudo = Math.min(410, W - 32);
        const larguraBotao = Math.min(220, W - 32);
        const tamanhoTitulo = W < 500 ? '38px' : '48px';
        const compacto = H < 620;
        const tituloY = compacto ? 48 : 100;
        const subtituloY = tituloY + 48;
        const peixeY = compacto ? H * 0.34 : H / 2 - 20;
        const instrucaoY = compacto ? H * 0.58 : H / 2 + 95;
        const botaoY = compacto ? H - 48 : H - 110;

        // Background
        const bg = this.add.image(W / 2, H / 2, 'background');
        bg.setDisplaySize(W, H);

        // Overlay escuro para legibilidade
        this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.45);

        // Título principal
        this.add.text(W / 2, 100, 'FLAP FISH', {
            fontFamily: 'Arial Black, Arial',
            fontSize: tamanhoTitulo,
            color: '#00e5a0',
            stroke: '#003322',
            strokeThickness: 6
        }).setOrigin(0.5).setY(tituloY);

        this.add.text(W / 2, subtituloY, 'O peixe das águas limpas', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#a0e8ff',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Peixe animado no centro
        const peixe = this.add.image(W / 2, peixeY, 'peixe');
        peixe.setDisplaySize(72, 43);

        // Animação de flutuação do peixe no menu
        this.tweens.add({
            targets: peixe,
            y: peixeY - 20,
            duration: 900,
            ease: 'Sine.InOut',
            yoyo: true,
            repeat: -1
        });

        // Instrução de como jogar
        const instrucaoBox = this.add.rectangle(W / 2, instrucaoY, larguraConteudo, 88, 0x001a33, 0.82);
        instrucaoBox.setStrokeStyle(1.5, 0x00e5a0, 0.6);

        this.add.text(W / 2, instrucaoY - 20, '🎮 Como jogar', {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#00e5a0',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(W / 2, instrucaoY + 5, 'Clique ou pressione ESPAÇO para\nimpulsionar o peixe e desviar das algas!', {
            fontFamily: 'Arial',
            fontSize: '13px',
            color: '#c0e8ff',
            align: 'center'
        }).setOrigin(0.5);

        // Botão jogar
        const btnBg = this.add.rectangle(W / 2, botaoY, larguraBotao, 56, 0x00e5a0);
        btnBg.setInteractive({ cursor: 'pointer' });
        btnBg.setStrokeStyle(3, 0x007755);

        const btnText = this.add.text(W / 2, botaoY, '▶  JOGAR', {
            fontFamily: 'Arial Black, Arial',
            fontSize: '22px',
            color: '#003322'
        }).setOrigin(0.5);

        // Hover no botão
        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(0x00ffb3);
            this.tweens.add({ targets: [btnBg, btnText], scaleX: 1.05, scaleY: 1.05, duration: 100 });
        });
        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(0x00e5a0);
            this.tweens.add({ targets: [btnBg, btnText], scaleX: 1, scaleY: 1, duration: 100 });
        });
        btnBg.on('pointerdown', () => {
            tocarSom('botao');
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => this.scene.start('Game'));
        });

        // Fade in da cena
        this.cameras.main.fadeIn(400, 0, 0, 0);
    }
}
