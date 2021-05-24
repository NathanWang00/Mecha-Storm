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
    }

    spawn(x, y, accel, ang, angAccel, power, bullet) {
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

        this.shoot = this.scene.time.delayedCall(1000, () => {
            this.scene.spawnBasic(this.x, this.y, this.scene);
            this.scene.spawnBasic(this.x, this.y, this.scene, this.scene.angToPlayer(this.x, this.y) + 30);
            this.scene.spawnBasic(this.x, this.y, this.scene, this.scene.angToPlayer(this.x, this.y) - 30);
        }, null, this.scene);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.bullet.enable) {
            this.setAngle(this.angle + this.angAccel * delta / 60);
            if (this.bullet.speed < maxScoutSpeed - this.accel * delta / 60) {
                this.bullet.setSpeed(this.bullet.speed + this.accel * delta / 60);
            } else {
                this.bullet.setSpeed(maxScoutSpeed);
            }
            
            if (this.y > this.height + game.config.height || this.y < -400 || this.x > game.config.width + 400 || this.x < -400) {
                this.death();
            }
        }
        //this.bullet.speed += 100 * delta / 60;
    }

    hit(damage) {
        if (this.active) {
            this.health -= damage;
            if (this.health <= 0) {
                this.scene.spawnCircle(this.x, this.y, this.scene, 8, null);
                this.scene.spawnPickup(this.x, this.y, this.power, this.bulletDrop);
                this.death();
                this.scene.explosionSfx.play();
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