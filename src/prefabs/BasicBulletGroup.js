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

    shootBullet(x, y, scene, angle, pattern) {
        this.runChildUpdate = true;
        var bullet = this.getFirstDead(false);
        var tempSpeed = bbSpeed;
        if (pattern == 3) {
            tempSpeed = 0;
        }
        if (bullet) {
            bullet.shoot(x, y, angle, pattern);
            if (bullet.bullet == null) {
                //bullet.setOrigin(0.5, 0.5);
                //bullet.setSize(50, 50, true);
                bullet.body.setCircle(7, bullet.height/2 - 7, bullet.width/2 - 7);
                //tracer.setOffset(tracer, 0);
                scene.enableBullet(bullet, tempSpeed);
            } else {
                bullet.bullet.setSpeed(tempSpeed);
            }
        }
    }
}