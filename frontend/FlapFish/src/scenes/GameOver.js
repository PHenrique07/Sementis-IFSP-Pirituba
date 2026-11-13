import { tocarSom } from '../audio.js';

export class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        this.scoreFinal = data.pontuacao ?? 0;
        this.comboFinal = data.comboF ?? 0;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        const compacto = W < 480 || H < 620;
        const larguraPainel = Math.min(500, W - 24);
        const alturaPainel = Math.min(compacto ? 500 : 520, H - 24);
        const centroPainel = H / 2;
        const topoPainel = centroPainel - alturaPainel / 2;
        const margem = Math.max(18, larguraPainel * 0.08);
        const larguraBotao = Math.min(280, larguraPainel - margem * 2);

        const bg = this.add.image(W / 2, H / 2, 'background');
        bg.setDisplaySize(W, H);
        this.add.rectangle(W / 2, H / 2, W, H, 0x00121d, 0.72);

        const painel = this.add.rectangle(W / 2, centroPainel, larguraPainel, alturaPainel, 0x071827, 0.96);
        painel.setStrokeStyle(2, 0x24d9b2, 0.9).setDepth(1);
        this.add.rectangle(W / 2, topoPainel + 3, larguraPainel, 6, 0x24d9b2).setDepth(2);

        this.add.text(W / 2, topoPainel + 34, 'PARTIDA ENCERRADA', {
            fontFamily: 'Arial',
            fontSize: compacto ? '11px' : '13px',
            color: '#67e8d0',
            fontStyle: 'bold',
            letterSpacing: 2
        }).setOrigin(0.5).setDepth(2);

        this.add.text(W / 2, topoPainel + (compacto ? 66 : 78), 'FIM DE JOGO', {
            fontFamily: 'Arial Black, Arial',
            fontSize: compacto ? '30px' : '40px',
            color: '#ffffff',
            stroke: '#0a4b52',
            strokeThickness: compacto ? 4 : 6
        }).setOrigin(0.5).setDepth(2);

        const peixe = this.add.image(W / 2, topoPainel + (compacto ? 130 : 148), 'peixe');
        peixe.setDisplaySize(compacto ? 50 : 60, compacto ? 30 : 36);
        peixe.setAngle(90).setTint(0xaaaaaa).setDepth(2);

        const estatisticasY = topoPainel + (compacto ? 188 : 224);
        const distanciaEstatisticas = Math.min(105, larguraPainel * 0.24);
        const estiloLabel = {
            fontFamily: 'Arial',
            fontSize: compacto ? '10px' : '11px',
            color: '#7fa7b4',
            fontStyle: 'bold'
        };

        this.add.text(W / 2 - distanciaEstatisticas, estatisticasY, 'PONTUAÇÃO', estiloLabel)
            .setOrigin(0.5).setDepth(2);
        this.add.text(W / 2 - distanciaEstatisticas, estatisticasY + 31, String(this.scoreFinal), {
            fontFamily: 'Arial Black, Arial',
            fontSize: compacto ? '26px' : '30px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(2);

        this.add.rectangle(W / 2, estatisticasY + 28, 1, 58, 0x2d5360, 0.8).setDepth(2);

        this.add.text(W / 2 + distanciaEstatisticas, estatisticasY, 'MAIOR COMBO', estiloLabel)
            .setOrigin(0.5).setDepth(2);
        this.add.text(W / 2 + distanciaEstatisticas, estatisticasY + 31, `x${this.comboFinal}`, {
            fontFamily: 'Arial Black, Arial',
            fontSize: compacto ? '26px' : '30px',
            color: '#ffbf69'
        }).setOrigin(0.5).setDepth(2);

        this.add.text(W / 2, topoPainel + (compacto ? 264 : 316), this._mensagem(this.scoreFinal), {
            fontFamily: 'Arial',
            fontSize: compacto ? '13px' : '15px',
            color: '#b7dbe0',
            fontStyle: 'italic',
            align: 'center',
            wordWrap: { width: larguraPainel - margem * 2 }
        }).setOrigin(0.5).setDepth(2);

        const btnY = topoPainel + (compacto ? 334 : 396);
        const btnBg = this.add.rectangle(W / 2, btnY, larguraBotao, 58, 0x0ed9ad)
            .setInteractive({ cursor: 'pointer' })
            .setStrokeStyle(2, 0x7affdf)
            .setDepth(2);
        const btnText = this.add.text(W / 2, btnY, 'JOGAR NOVAMENTE', {
            fontFamily: 'Arial Black, Arial',
            fontSize: compacto ? '15px' : '17px',
            color: '#003322'
        }).setOrigin(0.5).setDepth(2);

        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(0x46f1c8);
            btnText.setScale(1.03);
        });
        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(0x0ed9ad);
            btnText.setScale(1);
        });
        btnBg.on('pointerdown', () => {
            tocarSom('botao');
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => this.scene.start('Game'));
        });

        const menuText = this.add.text(W / 2, topoPainel + (compacto ? 393 : 464), 'VOLTAR AO MENU', {
            fontFamily: 'Arial',
            fontSize: '13px',
            color: '#8ec5ce',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setDepth(2);

        menuText.on('pointerover', () => menuText.setColor('#ffffff'));
        menuText.on('pointerout', () => menuText.setColor('#8ec5ce'));
        menuText.on('pointerdown', () => {
            tocarSom('botao');
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => this.scene.start('Menu'));
        });

        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    _mensagem(score) {
        if (score === 0) return 'Que pena! Tente de novo 🐟';
        if (score < 5) return 'Bom começo! As algas são traiçoeiras 🌿';
        if (score < 15) return 'Você está melhorando! Continue nadando 🌊';
        if (score < 30) return 'Impressionante! O oceano te chama 🌊🐟';
        return 'Mestre das águas! Você é incrível! 🏆🌊';
    }
}
