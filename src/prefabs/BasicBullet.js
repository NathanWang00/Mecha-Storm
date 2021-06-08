class BasicBullet extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'basicBullet');
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
        this.accel = bbAccel;
        if (pattern == null) {
            this.pattern = 1;
        } else {
            this.pattern = pattern;
        }
        if (pattern == 2) {
            this.kids = this.scene.time.addEvent({
                delay: 450,
                callback: this.scene.spawnHeavyKids,
                args: [this, this.scene],
                callbackScope: this.scene,
                loop: true
            })
        }
        if (pattern == 3) {
            this.accel = 0;
            this.timer = this.scene.time.delayedCall(500, () => {
                this.accel = 5;
                this.bullet.setSpeed(10);
            }, null, this.scene);
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.bullet.enable) {
            if (this.accel < 0) {
                if (this.bullet.speed + this.accel * delta / 60 > bbMin) {
                    this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
                } else if (this.accel < 0) {
                    this.bullet.setSpeed(bbMin);
                }
            } else {
                this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
            }
            /*
            this.scene.tweens.addCounter({
                from: 0,
                to: 1,
                duration: 1,
                ease: Phaser.Math.Easing.Linear,
                loop: 0,
                onUpdate: tween => {
                    this.transitionValue = tween.getValue();
                    this.alpha = this.transitionValue;
                }
            });*/
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