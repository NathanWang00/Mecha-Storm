class PowerGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Power,
            frameQuantity: 50,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'power'
        })
    }

    spawn(x, y) {
        this.runChildUpdate = true;
        var power = this.getFirstDead(false);
        if (power) {
            power.spawn(x, y);
        }
        return power;
    }
}