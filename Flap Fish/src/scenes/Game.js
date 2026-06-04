export class Game extends Phaser.Scene{
    constructor() {
        super({key:'Game'});
    }
    create (){
        //Cena de Fundo
        let bg = this.add.image(400, 300, 'background');
        bg.setScale(0.55,0.3);
        //Adição do player e de bareiras invisíveis 
        this.gravidadeInvertida = false;
        this.player=this.physics.add.sprite(275, 300, 'peixe');
        this.player.setScale(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setDragY(100);
        //Controles(ir para cima ou para baixo)
        const inverterGravidade = () => {
            this.gravidadeInvertida = !this.gravidadeInvertida;

            if (this.gravidadeInvertida) {
            this.player.setGravityY(-600); 
            } 
            else {
        // Volta para a gravidade normal
            this.player.setGravityY(0);
            }
        };
        this.input.on('pointerdown', inverterGravidade);
        this.input.on('keydown-SPACE', inverterGravidade);
        //Pontos
        this.oxigenio=this.physics.add.group();
        this.time.addEvent({
            delay: 2000,                // Intervalo em milissegundos (2 segundos)
            callback: this.spawnOxigenio, // Função que será chamada
            callbackScope: this,        // Garante que o 'this' seja a cena
            loop: true                  // Repete infinitamente
        });
        this.oxigenio.children.iterate(child=>
        {
            child.setScale(0.1);
            child.body.allowGravity=false;
            child.body.setVelocityX(-200);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(this.oxigenio);
        this.physics.add.overlap(this.player, this.oxigenio, this.collectOxigenio, null, this);
        this.score=0;
        this.combo=0;
        this.maiorCombo=0;
        this.multiplicador=1;
        this.scoreText=this.add.text(100,30, 'Score: 0', {fontSize: '32px', fill: '#00BFFF'});
        this.comboText=this.add.text(100,50, 'Combo: 0', {fontSize: '32px', fill: '#00BFFF'});
        //Obstáculos
        this.alga=this.physics.add.group();
        this.time.addEvent({
            delay: 3000,
            callback: this.spawnAlga,
            callbackScope: this,
            loop: true
        });
        this.physics.add.collider(this.player, this.alga, this.tomarDano, null, this);
        this.lixo_barril=this.physics.add.group();
        this.time.addEvent({
            delay: 7000,
            callback: this.spawnBarril,
            callbackScope: this,
            loop: true
        });
        this.physics.add.collider(this.player, this.lixo_barril, this.tomarDano, null, this);


    }
    update(){
        this.oxigenio?.children?.iterate(child => {
        // Se o oxigênio sumiu pela esquerda (x < -50)
        if (child.x < -50 && child.active) {
            child.disableBody(true, true);
            this.combo=0;
            this.comboText.setText('Combo: ' + this.combo);
            this.multiplicador=1;
        }
        });
        this.alga.children.iterate(child => {
            if (child.active && child.x < -100) {
                child.disableBody(true, true);
            }
        });

    }
    spawnOxigenio() {
        let oxigenio = this.oxigenio.get(850, Phaser.Math.Between(50, 400), 'oxigenio');

        if (oxigenio) {
            oxigenio.setActive(true);
            oxigenio.setVisible(true);
            oxigenio.setScale(0.1);
            oxigenio.body.allowGravity = false;
            oxigenio.body.setVelocityX(-200);
    }
};
    collectOxigenio(player, oxigenio){
        oxigenio.disableBody(true, true);
        this.score+=1*this.multiplicador;
        this.combo+=1;
        if(this.combo %5==0){
            this.multiplicador=(this.combo/5)+1;
        }
        if(this.combo>this.maiorCombo){
            this.maiorCombo=this.combo;
        }
        this.scoreText.setText('Score: '+this.score);
        this.comboText.setText('Combo: '+this.combo);
    }
    tomarDano(player, alga, lixo_barril){
        this.physics.pause();
        player.setTint(0xff0000);
        this.time.delayedCall(1000, ()=>{
            this.scene.start('GameOver', {pontuacao: this.score, comboF: this.maiorCombo});
        });
    }
    spawnAlga(){
        let alga = this.alga.get(850, 600, 'alga');

        if (alga) {
            alga.setActive(true);
            alga.setVisible(true);
            alga.body.enable=true;
            alga.body.reset(850, 600);
            let larguraFixa = 0.25; // Mantém a largura que você já usava
            let alturaAleatoria = Phaser.Math.FloatBetween(0.1, 0.15); // Varia apenas a altura     
            alga.setScale(larguraFixa, alturaAleatoria);
            alga.setVelocityX(-250);
            alga.body.allowGravity = false;
            alga.setOrigin(0.5, 1);
            alga.body.setSize(alga.width, alga.height);
        }
    }
    spawnBarril(){
        let barril=this.lixo_barril.get(850, 170, 'lixo_barril');
        if(barril){
            barril.setActive(true);
            barril.setVisible(true);
            barril.body.enable=true;
            barril.body.reset(850, 170);
            barril.setScale(0.15);
            barril.setVelocityX(-150);
            barril.body.allowGravity=false;
            barril.setOrigin(0.5, 1);
            barril.body.setSize(barril.width, barril.height);
        }
    }
}