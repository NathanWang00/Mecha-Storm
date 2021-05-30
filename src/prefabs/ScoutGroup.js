class ScoutGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Scout,
            frameQuantity: 30,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'scout'
        })
    }

    spawn(x, y, scene, speed, accel, ang, angAccel, power, bullet, pattern) {
        this.runChildUpdate = true;
        var scout = this.getFirstDead(false);
        if (scout) {
            scene.enableBullet(scout, speed);
            scout.spawn(x, y, accel, ang, angAccel, power, bullet, pattern);
        }
    }
}