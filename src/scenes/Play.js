class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');

        // temp UI border
        this.rect1 = this.add.rectangle(0, 0, 180, 720, 0x000000).setOrigin(0, 0);
        this.rect2 = this.add.rectangle(900, 0, 180, 720, 0x000000).setOrigin(0, 0);

        this.physics.add.existing(this.rect1, true);
        this.rect1.body.immovable = true;
        this.physics.add.existing(this.rect2, true);
        this.rect2.body.immovable = true;

        // player 
        this.player = this.add.rectangle(520, 650, 64, 64, 0xAAAAAA);
        this.player.setCollideWorldBounds(true);
    }
}