class BasicBulletGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: BasicBullet,
            frameQuantity: 100,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'basicBullet'
        })
    }

    shootBullet(x, y, scene, angle) {
        this.runChildUpdate = true;
        var bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.shoot(x, y, angle);
            if (bullet.bullet == null) {
                //bullet.setOrigin(0.5, 0.5);
                //bullet.setSize(50, 50, true);
                bullet.body.setCircle(10, bullet.height/2 -10, bullet.width/2 - 10);
                //tracer.setOffset(tracer, 0);
                scene.enableBullet(bullet, basicBulletSpeed);
            }
            
        }
    }
}