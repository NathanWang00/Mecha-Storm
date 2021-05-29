class HeavyGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Heavy,
            frameQuantity: 5,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'heavy'
        })
    }

    spawn(x, y, scene, speed, accel, ang, angAccel, power, bullet) {
        this.runChildUpdate = true;
        var heavy = this.getFirstDead(false);
        if (heavy) {
            scene.enableBullet(heavy, speed);
            heavy.spawn(x, y, accel, ang, angAccel, power, bullet);
        }
    }
}