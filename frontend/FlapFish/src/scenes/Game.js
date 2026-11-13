import { tocarSom } from '../audio.js';

const VELOCIDADE_INICIAL = 220;
const VELOCIDADE_MAX = 420;
const INCREMENTO_VELOCIDADE = 15;   // +velocidade a cada 10 pts
const GAP_ALGAS = 190;              // abertura entre alga de cima e de baixo
const LARGURA_ALGA = 72;
const TAMANHO_OXIGENIO = 48;
const FLAP_FORCE = -360;            // impulso para cima
const GRAVIDADE = 720;
const MARGEM_CHAO = 8;

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // ── Estado ──────────────────────────────────────────────
        this.vidas = 3;
        this.score = 0;
        this.combo = 0;
        this.maiorCombo = 0;
        this.velocidade = VELOCIDADE_INICIAL;
        this.vivo = true;
        this.invulneravel = false;

        // ── Background ──────────────────────────────────────────
        this.bg = this.add.image(W / 2, H / 2, 'background');
        this.bg.setDisplaySize(W, H);

        // ── Peixe ───────────────────────────────────────────────
        this.player = this.physics.add.sprite(130, H / 2, 'peixe');
        this.player.setDisplaySize(64, 38);
        this._ajustarHitbox(this.player, 48, 28);
        this.player.setCollideWorldBounds(false);
        this.player.setGravityY(GRAVIDADE);
        this.player.setDepth(5);

        // ── Grupos de algas (obstáculos) ─────────────────────────
        this.algas = this.physics.add.group();

        // Spawna a primeira alga um pouco depois do início
        this.time.delayedCall(1200, () => this._iniciarSpawnAlgas());

        // ── Oxigênio (coletáveis) ────────────────────────────────
        this.oxigenios = this.physics.add.group();
        this.time.addEvent({
            delay: 2200,
            callback: this._spawnOxigenio,
            callbackScope: this,
            loop: true
        });

        // ── Colisões e overlaps ──────────────────────────────────
        this.physics.add.overlap(this.player, this.oxigenios, this._coletarOxigenio, null, this);
        this.physics.add.overlap(this.player, this.algas, this._tomarDano, null, this);

        // ── Controles ────────────────────────────────────────────
        this.input.on('pointerdown', this._flap, this);
        this.input.keyboard.on('keydown-SPACE', this._flap, this);

        // ── HUD ──────────────────────────────────────────────────
        this._criarHUD();

        // ── Fade in ──────────────────────────────────────────────
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    // ── HUD ─────────────────────────────────────────────────────
    _criarHUD() {
        const W = this.scale.width;

        // Fundo semitransparente do HUD
        this.hudBg = this.add.rectangle(W / 2, 30, W, 60, 0x001d2a, 0.78).setDepth(10);
        this.hudBg.setStrokeStyle(1, 0x4dd7c0, 0.35);

        // Score
        this.scoreLabel = this.add.text(20, 10, 'PONTOS', {
            fontFamily: 'Arial',
            fontSize: '11px',
            color: '#7fcfff'
        }).setDepth(10);

        this.scoreText = this.add.text(20, 24, '0', {
            fontFamily: 'Arial Black, Arial',
            fontSize: '22px',
            color: '#ffffff'
        }).setDepth(10);

        // Combo
        this.comboContainer = this.add.container(W / 2, 8).setDepth(10);
        this.comboBg = this.add.rectangle(0, 17, 150, 42, 0x003322, 0.75).setStrokeStyle(1, 0x00e5a0, 0.35);
        this.comboLabel = this.add.text(0, 5, 'COMBO', {
            fontFamily: 'Arial',
            fontSize: '11px',
            color: '#00e5a0',
            align: 'center'
        }).setOrigin(0.5, 0);
        this.comboValor = this.add.text(0, 22, 'x1', {
            fontFamily: 'Arial Black, Arial',
            fontSize: '18px',
            color: '#00e5a0',
            align: 'center'
        }).setOrigin(0.5, 0);
        this.comboContainer.add([this.comboBg, this.comboLabel, this.comboValor]);
        this.comboContainer.setVisible(false);

        // Vidas (corações)
        this.coracoes = [];
        for (let i = 0; i < 3; i++) {
            const c = this.add.text(W - 26 - i * 24, 18, '●', {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#ffce5c'
            }).setDepth(10);
            this.coracoes.push(c);
        }
    }

    _atualizarHUD() {
        this.scoreText.setText(String(this.score));

        const mult = this.combo >= 5 ? Math.floor(this.combo / 5) + 1 : 1;
        if (this.combo >= 3) {
            this.comboContainer.setVisible(true);
            this.comboValor.setText(`x${mult}  🔥 ${this.combo}`);
        } else {
            this.comboContainer.setVisible(false);
        }

        // Atualiza corações
        for (let i = 0; i < 3; i++) {
            this.coracoes[i].setText(i < this.vidas ? '●' : '○');
            this.coracoes[i].setColor(i < this.vidas ? '#ffce5c' : '#56717b');
        }
    }

    // ── Flap ────────────────────────────────────────────────────
    _flap() {
        if (!this.vivo) return;
        this.player.setVelocityY(FLAP_FORCE);
        tocarSom('flap');

        this.player.angle = -18;
    }

    // ── Spawn Algas ─────────────────────────────────────────────
    _iniciarSpawnAlgas() {
        this.algaTimer = this.time.addEvent({
            delay: 1800,
            callback: this._spawnParAlgas,
            callbackScope: this,
            loop: true
        });
        this._spawnParAlgas(); // primeira imediata
    }

    _spawnParAlgas() {
        if (!this.vivo) return;

        const H = this.scale.height;
        const W = this.scale.width;

        // Posição vertical aleatória do gap
        const centroGap = Phaser.Math.Between(130, H - 130);
        const topoBaixo = centroGap - GAP_ALGAS / 2;   // fundo da alga de cima
        const topoAlgaBaixo = centroGap + GAP_ALGAS / 2; // topo da alga de baixo

        this._criarAlga(W + 40, topoBaixo / 2, LARGURA_ALGA, topoBaixo, true);
        this._criarAlga(
            W + 40,
            topoAlgaBaixo + (H - topoAlgaBaixo) / 2,
            LARGURA_ALGA,
            H - topoAlgaBaixo,
            false
        );
    }

    _criarAlga(x, y, largura, altura, invertida) {
        const alga = this.algas.create(x, y, 'alga');
        alga.setDisplaySize(largura, altura);
        alga.setFlipY(invertida);
        alga.setDepth(3);

        alga.body.allowGravity = false;
        alga.body.setVelocityX(-this.velocidade);
        this._ajustarHitbox(alga, largura - 10, altura);
    }

    _ajustarHitbox(objeto, largura, altura) {
        objeto.body.setSize(largura, altura, true);
    }

    // ── Spawn Oxigênio ──────────────────────────────────────────
    _spawnOxigenio() {
        if (!this.vivo) return;
        const H = this.scale.height;
        const W = this.scale.width;

        const ox = this.oxigenios.create(W + 20, Phaser.Math.Between(60, H - 60), 'oxigenio');
        ox.setDisplaySize(TAMANHO_OXIGENIO, TAMANHO_OXIGENIO);
        this._ajustarHitbox(ox, 44, 44);
        ox.body.allowGravity = false;
        ox.body.immovable = true;
        ox.setVelocityX(-this.velocidade * 0.8);
        ox.setDepth(4);

    }

    // ── Coletar Oxigênio ─────────────────────────────────────────
    _coletarOxigenio(player, ox) {
        if (!ox || !ox.active || ox.coletado) return;
        ox.coletado = true;
        ox.destroy();
        tocarSom('coletar');

        const mult = this.combo >= 5 ? Math.floor(this.combo / 5) + 1 : 1;
        this.score += 1 * mult;
        this.combo += 1;
        if (this.combo > this.maiorCombo) this.maiorCombo = this.combo;

        // Dificuldade progressiva
        const nivel = Math.floor(this.score / 10);
        this.velocidade = Math.min(VELOCIDADE_INICIAL + nivel * INCREMENTO_VELOCIDADE, VELOCIDADE_MAX);

        // Texto flutuante de ponto
        const pts = this.add.text(player.x + 20, player.y - 20, `+${mult}`, {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            color: '#00e5a0',
            stroke: '#003322',
            strokeThickness: 3
        }).setDepth(10);
        this.tweens.add({
            targets: pts,
            y: pts.y - 40,
            alpha: 0,
            duration: 700,
            onComplete: () => pts.destroy()
        });

        this._atualizarHUD();
    }

    _verificarColetaOxigenio() {
        if (!this.player?.active) return;

        this.oxigenios.children.iterate(ox => {
            if (!ox || !ox.active || ox.coletado) return;

            const distancia = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                ox.x,
                ox.y
            );

            if (distancia <= 42) {
                this._coletarOxigenio(this.player, ox);
            }
        });
    }

    // ── Tomar Dano ───────────────────────────────────────────────
    _tomarDano(player, _alga) {
        if (this.invulneravel || !this.vivo) return;

        this.vidas -= 1;
        tocarSom('batida');
        this.combo = 0;
        this._atualizarHUD();

        if (this.vidas <= 0) {
            this._morrer();
            return;
        }

        // Período de invulnerabilidade
        this.invulneravel = true;
        this.player.setTint(0xff4444);

        // Pisca o peixe
        const pisca = this.time.addEvent({
            delay: 120,
            callback: () => {
                this.player.setVisible(!this.player.visible);
            },
            repeat: 7
        });

        this.time.delayedCall(1000, () => {
            this.invulneravel = false;
            this.player.clearTint();
            this.player.setVisible(true);
        });
    }

    _morrer() {
        this.vivo = false;
        tocarSom('fim');
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.setAngle(90);

        this.cameras.main.shake(300, 0.015);

        this.time.delayedCall(1200, () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('GameOver', {
                    pontuacao: this.score,
                    comboF: this.maiorCombo
                });
            });
        });
    }

    // ── Update ───────────────────────────────────────────────────
    update() {
        if (!this.vivo) return;

        if (this.player.body.bottom >= this.scale.height - MARGEM_CHAO) {
            this._morrer();
            return;
        }

        this._verificarColetaOxigenio();

        // Remove algas que saíram da tela
        this.algas.children.iterate(alga => {
            if (alga && alga.active && alga.x < -100) {
                alga.destroy();
            }
        });

        // Remove oxigênios fora da tela (combo quebrado)
        this.oxigenios.children.iterate(ox => {
            if (ox && ox.active && ox.x < -60) {
                ox.destroy();
                this.combo = 0;
                this._atualizarHUD();
            }
        });

        // Rotação natural de queda
        const anguloAlvo = Phaser.Math.Clamp(this.player.body.velocity.y * 0.055, -20, 52);
        this.player.angle = Phaser.Math.Linear(this.player.angle, anguloAlvo, 0.18);
    }
}
