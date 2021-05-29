class Tracer extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'tracer');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.damage = tracerDamage;
        this.scene = scene;
        this.hitArray = [];
        this.piercing = false;

        this.stop();
    }

    shoot(x, y, angle) {
        var tempDamage = tracerDamage;
        this.piercing = false;
        if (this.scene.powerMode) {
            tempDamage = pTracerDamage;
            this.piercing = true;
        }
        this.damage = tempDamage;
        this.angle = angle;
        this.start();
        this.body.reset(x, y);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y < -this.height - 200 || this.y > 200 || this.x > game.config.width + 200 || this.x < -200) {
            //this.stop();
        }
    }

    hit(obj) {
        if (this.piercing) {
            if (!this.hitArray.includes(obj)) {
                this.hitArray.push(obj);
                return true;
            } else {
                return false;
            }
        } else {
            this.body.reset(0,0);
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