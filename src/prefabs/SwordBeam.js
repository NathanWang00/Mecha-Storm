class SwordBeam extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'swordBeam');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.damage = baseDamage;
        this.baseDamage = this.baseDamage;
        this.piercing = true;
        this.lastHit = null; //for piercing
        this.hitArray = [];
        this.scene = scene;

        this.stop();
    }

    shoot(x, y) {
        var tempSpeed = swordSpeed;
        this.baseDamage = baseDamage;

        if (this.scene.powerMode) {
            this.baseDamage = pSwordDamage;
            tempSpeed = pSwordSpeed;
        }
        this.damage = this.baseDamage;
        this.start();
        this.body.reset(x, y);

        this.setVelocityY(-tempSpeed);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y < -this.height) {
            this.stop();
        }
        if (this.active) {
            this.damage -= swordDecay * delta / 60;
            //console.log(this.body.velocity.y);
            this.setVelocityY(this.body.velocity.y + 45 * delta / 60);
            this.alpha = (this.damage / this.baseDamage) + 0.05;
            if(this.damage <= 0) {
                this.body.reset(0, 0);//for debug
                this.stop();
            }
        }
    }

    hit(obj) {
        if (this.piercing) {
            if (!this.hitArray.includes(obj)) {
                this.hitArray.push(obj)
                this.lastHit = obj;
                this.damage = this.damage - obj.health;
                return true;
            } else {
                return false;
            }
        } else {
            this.body.reset(0, 0);//for debug
            this.stop();
            return true;
        }
    }

    getDamage() {
        return this.damage;
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
        this.hitArray = [];
    }
}