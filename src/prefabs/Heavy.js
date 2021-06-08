class Heavy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'heavy');
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
        this.phase = 0;
    }

    spawn(x, y, accel, ang, angAccel, power, bullet) {
        this.depth = 1;
        this.body.enable = true;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(90 + ang);
        this.health = heavyHealth;
        this.accel = accel;
        this.angAccel = angAccel;
        this.power = power;
        this.bulletDrop = bullet;
        this.phase = 0;

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
                if (this.bullet.speed > 10 -this.accel * delta / 60) {
                    this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
                } else {
                    this.bullet.setSpeed(0);
                    this.phase = 1;
                    this.accel = 5;
                    this.shootDelay = 0;
                    this.phaseSwitch = this.scene.time.delayedCall(8500, () => {
                        this.phase = 2;
                        this.accel = 10;
                    }, null, this.scene);
                }
            }

            if (this.phase == 1) {
                if (this.shootDelay > 0) {
                    this.shootDelay -= delta / 60;
                } else {
                    this.shootDelay = heavyShootDelay;
                    var shootOffsetY = this.y + 50;
                    var angToPlayer = this.scene.angToPlayer(this.x, shootOffsetY);
                    this.scene.spawnFast(this.x, shootOffsetY, this.scene, angToPlayer - 30);
                    this.scene.spawnFast(this.x, shootOffsetY, this.scene, angToPlayer + 30);
                    this.shoot = this.scene.time.delayedCall(250, () => {
                        this.scene.spawnFast(this.x, shootOffsetY, this.scene, angToPlayer - 22);
                        this.scene.spawnFast(this.x, shootOffsetY, this.scene, angToPlayer + 22);
                    }, null, this.scene);
                    this.shoot = this.scene.time.delayedCall(500, () => {
                        this.scene.spawnFast(this.x, shootOffsetY, this.scene, angToPlayer - 14);
                        this.scene.spawnFast(this.x, shootOffsetY, this.scene, angToPlayer + 14);
                    }, null, this.scene);
                    this.shoot = this.scene.time.delayedCall(750, () => {
                        this.scene.spawnFast(this.x, shootOffsetY, this.scene, angToPlayer - 5);
                        this.scene.spawnFast(this.x, shootOffsetY, this.scene, angToPlayer + 5);
                    }, null, this.scene);
                    this.shoot = this.scene.time.delayedCall(1000, () => {
                        this.scene.spawnHeavy(this.x, shootOffsetY, this.scene);
                    }, null, this.scene);
                }
            }

            if (this.phase == 2) {
                this.bullet.setSpeed(this.bullet.speed - this.accel * delta / 60);
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

            if (this.health <= 0) {
                // update score
                this.scene.score += heavyPoints;
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
        this.scene.time.removeEvent(this.shoot);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}