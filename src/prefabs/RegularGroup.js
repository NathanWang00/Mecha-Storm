class RegularGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Regular,
            frameQuantity: 15,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'regular'
        })
    }

    spawn(x, y, scene, speed, accel, ang, angAccel, power, bullet) {
        this.runChildUpdate = true;
        var regular = this.getFirstDead(false);
        if (regular) {
            scene.enableBullet(regular, speed);
            regular.spawn(x, y, accel, ang, angAccel, power, bullet);
        }
    }
}