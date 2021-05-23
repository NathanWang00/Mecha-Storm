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
        this.body.setMaxSpeed(250);
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
        if (this.scene.power < 1 - powerIncrease) {
            this.scene.power += powerIncrease;
        } else {
            this.scene.power = 1;
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