class AmmoGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Ammo,
            frameQuantity: 20,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'ammo'
        })
    }

    spawn(x, y) {
        this.runChildUpdate = true;
        var ammo = this.getFirstDead(false);
        if (ammo) {
            ammo.spawn(x, y);
        }
    }
}