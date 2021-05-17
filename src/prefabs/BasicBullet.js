class BasicBullet extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'basicBullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.stop();
    }

    shoot(x, y, angle) {
        this.angle = angle;
        this.start();
        this.body.reset(x, y);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y < -this.height) {
            this.stop();
        }
    }

    hit() {
        this.body.reset(0, 0);//for debug
        this.stop();
    }

    start() {
        this.body.enable = true;
        this.setActive(true);
        this.setVisible(true);
    }

    stop() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}