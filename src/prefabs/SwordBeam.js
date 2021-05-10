class SwordBeam extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'swordBeam');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
        this.setVelocityY(-swordSpeed);
    }

    shoot(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
		this.setVisible(true);
        this.setVelocityY(-swordSpeed);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y < -this.height) {
            this.setActive(false);
			this.setVisible(false);
        }
    }
}