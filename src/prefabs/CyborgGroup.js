class CyborgGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Cyborg,
            frameQuantity: 1,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'cyborg'
        })
    }

    spawn(x, y, scene) {
        this.runChildUpdate = true;
        var cyborg = this.getFirstDead(false);
        if (cyborg) {
            scene.enableMoveTo(cyborg, x, y, cyborgSpeed, false);
            cyborg.spawn(x, y);
        }
    }
}