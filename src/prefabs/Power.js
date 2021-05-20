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
        } else {
            this.scene.power = 1;
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