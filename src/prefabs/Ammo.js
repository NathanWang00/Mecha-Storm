class Ammo extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'ammo');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.stop();
    }

    spawn(x, y) {
        this.start();
        this.body.reset(x, y);
        this.setVelocityY(-100);
        this.body.setMaxSpeed(250);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > this.height + game.config.height) {
            this.stop();
        }
    }

    hit() {
        this.body.reset(0, 0);//for debug
        if (this.scene.ammo < this.scene.maxAmmo) {
            this.scene.ammo++;
            this.scene.ammoCount.text = this.scene.ammo + "/" + baseAmmo;
            this.scene.ammoCountShadow.text = this.scene.ammo + "/" + baseAmmo;
        } else {
            //give power
        }
        this.stop();
    }

    start() {
        this.body.enable = true;
        this.setActive(true);
        this.setVisible(true);
        this.setGravityY(200);
    }

    stop() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.setGravityY(0);
    }
}