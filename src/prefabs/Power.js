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
        this.setVelocityY(this.scene.powerSpeed);
        this.body.setMaxSpeed(250);
        this.depth = -1;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > this.height + game.config.height) {
            this.stop();
        }
        /*if (this.body.velocity > 100) {
            this.setGravityY(0);
            console.log("test");
        }*/
    }

    hit() {
        this.body.reset(0, 0);//for debug
        this.scene.upgradeSfx.play();
        if (this.scene.power == 1) {
            if (!this.scene.victory) {
                this.scene.score += 50;
                this.scene.scoreText.text = this.scene.score;
                this.scene.scoreTextShadow.text = this.scene.score;
            }
        } else {
            if (!this.scene.victory) {
                this.scene.score += 5;
                this.scene.scoreText.text = this.scene.score;
                this.scene.scoreTextShadow.text = this.scene.score;
            }
            if (this.scene.power < 0.95 - powerIncrease) {
                this.scene.power += powerIncrease;
            } else {
                this.scene.power = 1;
            }
        }
        this.stop();
    }

    start() {
        this.body.enable = true;
        this.setActive(true);
        this.setVisible(true);
        this.setGravityY(200);
    }

    stop() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.setGravityY(0);
    }
}