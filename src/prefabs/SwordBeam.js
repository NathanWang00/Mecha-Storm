class SwordBeam extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'swordBeam');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.damage = baseDamage;

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

    hit() {
        this.body.reset(0, 0);//for debug
        this.stop();
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
    }
}