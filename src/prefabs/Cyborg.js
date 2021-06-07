class Cyborg extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'cyborg');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //initial variables
        this.health = cyborgHealth;

        this.setSize(80, 80, true);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.scene = scene;
        this.accel = cyborgAccel;
        this.phase = cyborgPoints;
        this.shootDelay = cyborgShootDelay;
        this.power = 15;
        this.bulletDrop = 1;
        this.pattern = 0;
    }

    spawn(x, y) {
        this.body.enable = true;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(90);
        this.health = cyborgHealth;
        this.shootDelay = 0;
        this.shootDelay2 = 0;
        this.phase = 0;
        this.moveTo.moveTo(this.x, this.y + 235);
        this.pattern = 0;
        this.angleOffset = 0;
        this.playerAng = 0;
        this.playerAng2 = 0;
        this.reverseShoot = false;
        this.moveTo.on('complete', function(gameObject){
            if (gameObject.phase == 0) {
                //gameObject.phase = 1;
                gameObject.phase = 1;
            }

            if (gameObject.phase == 2 && gameObject.pattern == 0) {
                gameObject.pattern = 1;
                gameObject.patternSwitch = gameObject.scene.time.delayedCall(1000, () => {
                    gameObject.pattern = 0;
                    gameObject.shootDelay2 = 0;
                    gameObject.moveTo.setSpeed(0);
                    if (gameObject.reverseShoot) {
                        gameObject.reverseShoot = false;
                    } else {
                        gameObject.reverseShoot = true;
                    }
                }, null, gameObject.scene);
                if (gameObject.reverseShoot) {
                    gameObject.angleOffset = -30;
                } else {
                    gameObject.angleOffset = 30;
                }
                gameObject.playerAng = gameObject.scene.angToPlayer(gameObject.x + 35, gameObject.y + 30);
            }
            //gameObject.moveTo.moveTo(this.x, this.y - 100);
            gameObject.moveTo.setSpeed(0);
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.moveTo.enable) {
            if (this.phase == 0) {
                if (this.moveTo.speed > -this.accel * delta / 60) {
                    this.moveTo.setSpeed(this.moveTo.speed + this.accel * delta / 60);
                } else {
                    this.moveTo.setSpeed(0);
                }
            }
            
            if (this.phase == 1) {
                if (this.shootDelay > 0) {
                    this.shootDelay -= delta / 60;
                } else {
                    if (this.pattern == 0 || this.pattern == 4) {
                        this.pattern = 0;
                        for (let index = 0; index < 6; index++) {
                            this.scene.spawnHeavy(this.x, this.y, this.scene, index * 360 / 6);
                        }
                        this.shootDelay = cyborgShootDelay2;
                    } else {
                        this.shootDelay = cyborgShootDelay;
                        this.scene.spawnEgg(this.x, this.y, this.scene, 225, 2);
                        this.shoot = this.scene.time.delayedCall(100, () => {
                            this.scene.spawnEgg(this.x, this.y, this.scene, 247.5, 2);
                        }, null, this.scene);
                        this.shoot = this.scene.time.delayedCall(200, () => {
                            this.scene.spawnEgg(this.x, this.y, this.scene, 270, 2);
                        }, null, this.scene);
                        this.shoot = this.scene.time.delayedCall(300, () => {
                            this.scene.spawnEgg(this.x, this.y, this.scene, 292.5, 2);
                        }, null, this.scene);
                        this.shoot = this.scene.time.delayedCall(400, () => {
                            this.scene.spawnEgg(this.x, this.y, this.scene, 315, 2);
                        }, null, this.scene);
                    }
                    this.pattern++;
                }
            }

            if (this.phase == 2) {
                this.moveTo.setSpeed(this.moveTo.speed + cyborgAccel2 * delta / 60);

                if (this.pattern == 0) {
                    if (!this.moveTo.isRunning) {
                        this.moveTo.moveTo(this.scene.player.x, this.scene.player.y);
                        this.playerAng2 = this.scene.angToPlayer(this.x, this.y);
                    }
                    if (this.shootDelay2 > 0) {
                        this.shootDelay2 -= delta / 60;
                    } else {
                        this.shootDelay2 = cyborgShootDelay4;
                        this.scene.spawnBasic(this.x, this.y, this.scene, this.playerAng2 + 180);
                        this.scene.spawnBasic(this.x, this.y, this.scene, this.playerAng2 + 150);
                        this.scene.spawnBasic(this.x, this.y, this.scene, this.playerAng2 + 210);
                    }
                }

                if (this.pattern == 1) {
                    if (this.shootDelay > 0) {
                        this.shootDelay -= delta / 60;
                    } else {
                        if (this.reverseShoot) {
                            this.angleOffset += 8;
                        } else {
                            this.angleOffset -= 8;
                        }
                        
                        this.shootDelay = cyborgShootDelay3 + Phaser.Math.Between(-0.3, 0.3);
                        this.scene.spawnFast(this.x + 35, this.y + 30, this.scene, this.playerAng + 
                            Phaser.Math.Between(-10, 10) + this.angleOffset);
                        this.scene.efSfx2.play();
                    }
                }
            }
            
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

            if (this.health <= 0) {
                if (this.phase == 1) {
                    this.phaseUp = this.scene.time.delayedCall(3000, () => {
                        this.phase = 2;
                        this.pattern = 0;
                        this.shootDelay = 0;
                    }, null, this.scene);
                    this.phase = -1;
                    this.health = cyborgHealth2;
                    this.moveTo.setSpeed(0);
                    this.scene.spawnPickup(this.x, this.y, 4, this.bulletDrop);
                    this.scene.spawnPickup(this.x, this.y, 0, this.bulletDrop);
                    this.scene.spawnPickup(this.x, this.y, 0, this.bulletDrop);
                    this.scene.botHurtSfx.play();
                } else if (this.phase == 2) {
                    // update score
                    this.scene.score += cyborgPoints;
                    this.scene.scoreText.text = this.scene.score;
                    this.scene.scoreTextShadow.text = this.scene.score;
                    this.scene.spawnPickup(this.x, this.y, this.power, this.bulletDrop);
                    this.death();
                    this.scene.botHurtSfx.play();
                }
                
            }
        }
    }

    death() {
        this.body.reset(0, 0);
        this.scene.time.removeEvent(this.shoot);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.scene.win();
    }
}