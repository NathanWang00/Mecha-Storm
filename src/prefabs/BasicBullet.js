class BasicBullet extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'basicBullet');
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
            if (this.bullet.speed + bbAccel * delta / 60 > bbMin) {
                this.bullet.setSpeed(this.bullet.speed + bbAccel * delta / 60);
            } else if (bbAccel < 0) {
                this.bullet.setSpeed(bbMin);
            }
        }
        if (this.y > this.height + game.config.height || this.y < -400 || this.x > 1000 || this.x < 100) {
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