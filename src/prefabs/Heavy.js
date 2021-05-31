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
                if (this.bullet.speed > -this.accel * delta / 60) {
                    this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
                } else {
                    this.bullet.setSpeed(0);
                    this.phase = 2;
                    this.accel = 5;
                    this.shootDelay = 0;
                    /*this.phaseSwitch = this.scene.time.delayedCall(4000, () => {
                        this.phase = 2;
                        this.accel = 10;
                    }, null, this.scene);*/
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
        //this.scene.time.removeEvent(this.shoot);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}