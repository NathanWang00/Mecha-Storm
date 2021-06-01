class Regular extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'regular');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //initial variables
        this.health = regularHealth;

        //this.setSize(50, 50);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.scene = scene;
        this.accel = 0;
        this.angAccel = 0;
        this.power = 0;
        this.bulletDrop = 0;
        this.phase = 0;//behavior settings
    }

    spawn(x, y, accel, ang, angAccel, power, bullet) {
        this.body.enable = true;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(90 + ang);
        this.health = regularHealth;
        this.accel = accel;
        this.angAccel = angAccel;
        this.power = power;
        this.bulletDrop = bullet;

        this.phase = 0;
        this.shootDelay = regularShootDelay;

        /*this.shoot = this.scene.time.delayedCall(1000, () => {
            this.scene.spawnFast(this.x, this.y, this.scene);
            //this.scene.spawnFast(this.x, this.y, this.scene, this.scene.angToPlayer(this.x, this.y) + 30);
            //this.scene.spawnFast(this.x, this.y, this.scene, this.scene.angToPlayer(this.x, this.y) - 30);
        }, null, this.scene);*/
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.bullet.enable) {
            if (this.phase == 0) {
                if (this.bullet.speed > regularMinSpeed - this.accel * delta / 60) {
                    this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
                } else {
                    this.bullet.setSpeed(regularMinSpeed);
                    this.phase = 1;
                    this.accel = 0;
                    this.shootDelay = 0;
                    this.phaseSwitch = this.scene.time.delayedCall(4000, () => {
                        this.phase = 2;
                        this.accel = 10;
                    }, null, this.scene);
                }
            }
            if (this.phase == 1) {
                if (this.shootDelay > 0) {
                    this.shootDelay -= delta / 60;
                } else {
                    this.shootDelay = regularShootDelay;
                    var playerAng = this.scene.angToPlayer(this.x, this.y);
                    this.scene.efSfx2.play();
                    for (let index = 0; index < 5; index++) {
                        this.scene.spawnBasic(this.x, this.y, this.scene, playerAng - 40 + index * 20);
                    }
                    this.secondShot = this.scene.time.delayedCall(500, () => {
                        this.scene.efSfx2.play();
                        for (let index = 0; index < 4; index++) {
                            this.scene.spawnBasic(this.x, this.y, this.scene, playerAng - 30 + index * 20);
                        }
                    }, null, this.scene);
                }
                /*if(this.shootDelay > 0) {
                    this.shootDelay -= delta / 60;
                    console.log(this.shootDelay);
                } else {
                    this.shootDelay = regularShootDelay + Phaser.Math.Between(-0.5, 0.5);
                    this.scene.spawnFast(this.x ,this.y, this.scene, this.scene.angToPlayer(this.x, this.y) + Phaser.Math.Between(-30, 30));
                }*///Gatling
            }
            if (this.phase == 2) {
                if (this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60));
            }

            this.setAngle(this.angle + this.angAccel * delta / 60);
            
            
            if (this.y > this.height + game.config.height || this.y < -400 || this.x > game.config.width + 400 || this.x < -400) {
                this.death();
            }
        }
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

            else if (this.health <= 0) {
                // update score
                this.scene.score += regularPoints;
                this.scene.scoreText.text = this.scene.score;
                this.scene.scoreTextShadow.text = this.scene.score;

                //this.scene.spawnCircle(this.x, this.y, this.scene, 8, null);
                this.scene.spawnPickup(this.x, this.y, this.power, this.bulletDrop);
                this.death();
                this.scene.botHurtSfx.play();
            }
        }
    }

    death() {
        this.body.reset(0, 0);
        this.scene.time.removeEvent(this.secondShot);
        this.scene.time.removeEvent(this.phaseSwitch);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}