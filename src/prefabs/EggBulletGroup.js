class EggBulletGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: EggBullet,
            frameQuantity: 15,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'eggBullet'
        })
    }

    shootBullet(x, y, scene, angle, pattern) {
        this.runChildUpdate = true;
        var bullet = this.getFirstDead(false);
        var tempSpeed = ebSpeed;
        if (bullet) {
            bullet.shoot(x, y, angle, pattern);
            if (bullet.bullet == null) {
                //bullet.setOrigin(0.5, 0.5);
                //bullet.setSize(50, 50, true);
                bullet.body.setCircle(14, bullet.height/2 - 7, bullet.width/2 - 7);
                //tracer.setOffset(tracer, 0);
                scene.enableBullet(bullet, tempSpeed);
            } else {
                bullet.bullet.setSpeed(tempSpeed);
            }
        }
    }
}