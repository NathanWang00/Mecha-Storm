class Scout extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'scout');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
    }

    spawn(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(90);
    }
}