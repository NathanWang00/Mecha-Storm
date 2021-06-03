class Scout extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'scout');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //initial variables
        this.health = scoutHealth;

        this.setSize(50, 50);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.scene = scene;
        this.accel = 0;
        this.angAccel = 0;
        this.power = 0;
        this.bulletDrop = 0;
        this.pattern = 1;
        this.angleTurn = 1;
    }

    spawn(x, y, accel, ang, angAccel, power, bullet, pattern) {
        this.body.enable = true;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(90 + ang);
        this.health = scoutHealth;
        this.accel = accel;
        this.angAccel = angAccel;
        this.power = power;
        this.bulletDrop = bullet;
        this.pattern = pattern;
        this.angleTurn = 1;

        if (pattern == 1) {//basic shooters
            this.shoot = this.scene.time.delayedCall(400, () => {
                this.scene.spawnFast(this.x, this.y, this.scene);
                //this.scene.spawnFast(this.x, this.y, this.scene, this.scene.angToPlayer(this.x, this.y) + 30);
                //this.scene.spawnFast(this.x, this.y, this.scene, this.scene.angToPlayer(this.x, this.y) - 30);
            }, null, this.scene);
        }
        if (pattern == 2) {//suicide bots
            this.trail = this.scene.time.addEvent({
                delay: 600,
                callback: this.scene.spawnTrail,
                args: [this, this.scene],
                callbackScope: this.scene,
                loop: true
            })

            this.shoot = this.scene.time.delayedCall(2000, () => {
                this.scene.spawnCircle(this.x, this.y, this.scene, 8, null);
                this.scene.botHurtSfx.play();
                this.death();
            }, null, this.scene);
        }
        if (pattern == 3) {//heavy circle
            this.shoot = this.scene.time.delayedCall(2800, () => {
                this.death();
            }, null, this.scene);
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.bullet.enable) {
            if (this.pattern == 2) {//player tracking, loses turning power if angle is too big
                if (this.angle > 150 || this.angle < 30) {
                    this.angleTurn = 0.7;
                }
                var angToPlayer = this.scene.angToPlayer(this.x, this.y);
                var angleDifference = angToPlayer - this.angle;

                if (angleDifference < 0) {
                    angleDifference *= -1;
                }
                if (angleDifference > 1 && angleDifference < 180) {
                    if (angToPlayer > this.angle) {
                        this.angAccel = 5 * this.angleTurn;
                    } else {
                        this.angAccel = -5 * this.angleTurn;
                    }
                }
            }
            this.setAngle(this.angle + this.angAccel * delta / 60);
            if (this.bullet.speed < maxScoutSpeed - this.accel * delta / 60) {
                this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
            } else {
                this.bullet.setSpeed(maxScoutSpeed);
            }
            
            if (this.y > this.height + game.config.height || this.y < -400 || this.x > 1000 || this.x < 100) {
                this.death();
            }
        }
        //this.bullet.speed += 100 * delta / 60;
    }

    hit(damage) {
        if (this.active) {
            this.health -= damage;

            // damage tween

            if (this.health > 0) {
 
                this.noColor = Phaser.Display.Color.ValueToColor(0xFFFFFF);
                this.damageColor = Phaser.Display.Color.ValueToColor(0xFF0000);
                this.scene.tweens.addCounter({

                    from: 0,
                    to: 100,
                    duration: 200,
                    ease: Phaser.Math.Easing.Sine.In,
                    loop: 0,
                    onUpdate: tween => {

                        this.value = tween.getValue();
                        this.colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(this.damageColor, this.noColor, 100, this.value);
                        this.color = Phaser.Display.Color.GetColor(this.colorObject.r, this.colorObject.g, this.colorObject.b);
                        this.setTint(this.color);
                    }
                });

            }

            if (this.health <= 0) {
                // update score
                this.scene.score += scoutPoints;
                this.scene.scoreText.text = this.scene.score;
                this.scene.scoreTextShadow.text = this.scene.score;

                this.scene.spawnPickup(this.x, this.y, this.power, this.bulletDrop);

                if (this.pattern == 1) {
                    this.scene.spawnCircle(this.x, this.y, this.scene, 6, null);
                } else if (this.pattern == 2) {
                    this.scene.spawnCircle(this.x, this.y, this.scene, 8, null);
                }
                this.death();
                this.scene.botHurtSfx.play();
            }
        }
    }

    death() {
        this.body.reset(0, 0);
        if (this.shoot != null) {
            this.shoot.remove();
        }
        this.scene.time.removeEvent(this.trail);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}