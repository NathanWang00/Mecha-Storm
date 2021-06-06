class EggBullet extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'eggBullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.stop();
        this.accel = 0;
        this.pattern = 1;
        this.scene = scene;
    }

    shoot(x, y, angle, pattern) {
        this.angle = angle;
        this.start();
        this.body.reset(x, y);
        this.accel = ebAccel;
        this.minSpeed = ebMin;
        if (pattern == null) {
            this.pattern = 1;
        } else {
            this.pattern = pattern;
        }
        if (pattern == 1) {
            this.timer = this.scene.time.delayedCall(2000, () => {
                this.scene.spawnCircle(this.x, this.y, this.scene, 12);
                this.scene.efSfx1.play();
                this.stop();
            }, null, this.scene);
        }
        if (pattern == 2) {
            this.timer = this.scene.time.delayedCall(500, () => {
                this.angle = this.scene.angToPlayer(this);
                this.speed = ebSpeed;
            }, null, this.scene);
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.bullet.enable) {
            if (this.accel < 0) {
                if (this.bullet.speed + this.accel * delta / 60 > this.minSpeed) {
                    this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
                } else if (this.accel < 0) {
                    this.bullet.setSpeed(this.minSpeed);
                }
            } else {
                this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
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
        if (this.timer != null) {
            this.timer.remove();
        }
        this.scene.time.removeEvent(this.kids);
    }
}