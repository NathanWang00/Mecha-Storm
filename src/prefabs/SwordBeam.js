class SwordBeam extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'swordBeam');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.damage = baseDamage;
        this.piercing = true;
        this.lastHit = null; //for piercing
        this.hitArray = [];

        this.stop();
    }

    shoot(x, y) {
        this.start();
        this.body.reset(x, y);
        this.setVelocityY(-swordSpeed);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y < -this.height) {
            this.stop();
        }
    }

    hit(obj) {
        if (this.piercing) {
            if (!this.hitArray.includes(obj)) {
                console.log(this.hitArray);
                this.hitArray.push(obj)
                this.lastHit = obj;
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