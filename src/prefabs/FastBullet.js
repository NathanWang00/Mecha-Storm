class FastBullet extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'fastBullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.stop();
        this.accel = 0;
    }

    shoot(x, y, angle) {
        this.angle = angle;
        this.start();
        this.body.reset(x, y);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.bullet.enable) {
            if (this.bullet.speed + fbAccel * delta / 60 < fbSpeed) {
                this.bullet.setSpeed(this.bullet.speed + fbAccel * delta / 60);
            } else if (fbAccel < 0) {
                this.bullet.setSpeed(fbMin);
            }
        }
        if (this.y < -this.height || this.y > this.height + game.config.height) {
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