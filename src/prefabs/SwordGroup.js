class SwordGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: SwordBeam,
            frameQuantity: 10,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'swordSlashLeft'
        })
    }

    shootBeam(x, y, swung) {
        this.runChildUpdate = true;
        const sword = this.getFirstDead(false);
        if (sword) {
            sword.shoot(x, y, swung);
        }
    }
}