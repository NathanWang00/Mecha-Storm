class FastBulletGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: FastBullet,
            frameQuantity: 100,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'fastBullet'
        })
    }

    shootBullet(x, y, scene, angle) {
        this.runChildUpdate = true;
        var bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.shoot(x, y, angle);
            if (bullet.bullet == null) {
                bullet.setSize(10, 10);
                //bullet.body.setCircle(10, bullet.width/2 - 10, bullet.height/2);
                bullet.setOrigin(0.5, 0.5);
                //tracer.setOffset(tracer, 0);
                scene.enableBullet(bullet, fbMin);
            } else {
                bullet.bullet.setSpeed(fbMin);
            }
            
        }
    }
}