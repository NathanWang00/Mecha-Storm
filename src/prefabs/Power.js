class Power extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'power');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.stop();
    }

    spawn(x, y) {
        this.start();
        this.body.reset(x, y);
        this.setVelocityY(-100);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > this.height + game.config.height) {
            this.stop();
        }
    }

    hit() {
        this.body.reset(0, 0);//for debug
        if (this.scene.power < 1 - powerIncrease) {
            this.scene.power += powerIncrease;

            // ui

            if (this.scene.power <= 0) {

                this.scene.endCap.alpha = 0;
                this.scene.powerProgress.alpha = 0;

            } else if (this.scene.power < 0.5) {

                this.scene.endCap.y = 658; 
                this.scene.endCap.height = 4;
                this.scene.endCap.alpha = 1;

            }

            if (this.scene.power > 0.02) {

                this.scene.powerProgress.y = 658 - this.scene.power * 190;
                this.scene.powerProgress.height = 0 + this.scene.power * 190;
                this.scene.powerProgress.alpha = 1;

            }

        } else {
            this.scene.power = 1;

            // ui

            this.scene.powerProgress.y = 474;
            this.scene.powerProgress.height = 184;
            this.scene.powerProgress.alpha = 1;
            this.scene.endCap.y = 471; 
            this.scene.endCap.height = 190;
            this.scene.endCap.alpha = 1;

        }
        console.log(this.scene.power);
        this.stop();
    }

    start() {
        this.body.enable = true;
        this.setActive(true);
        this.setVisible(true);
        this.setGravityY(100);
    }

    stop() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.setGravityY(0);
    }
}