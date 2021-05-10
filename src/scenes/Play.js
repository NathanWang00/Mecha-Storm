class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('player', './assets/TempPlayer.png');
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
        this.player = this.physics.add.sprite(520, 650, 'player');
        //this.player = this.add.rectangle(520, 650, 64, 64, 0xAAAAAA);
        //this.physics.add.existing(this.player, true);
        this.player.setCollideWorldBounds(true);

        // keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();


    }

    update() {
        let horz = 0;
        let vert = 0;
        let tempSpeed = playerSpeed;

        // player movement
        if (this.cursors.up.isDown) {
            vert = -1;
        } else {
            if (this.cursors.down.isDown) {
                vert = 1;
            }
        }
        if (this.cursors.left.isDown) {
            horz = -1;
        } else {
            if (this.cursors.right.isDown) {
                horz = 1;
            }
        }
        if (horz != 0 && vert != 0) {
            tempSpeed = 0.709 * playerSpeed;//for diagonal movement
        }
        this.player.setVelocityX(horz * tempSpeed);
        this.player.setVelocityY(vert * tempSpeed);
    }
}