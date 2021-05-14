class TracerGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Tracer,
            frameQuantity: 10,
            active: false,
            visible: false,
            runChildUpdate: true,
            key: 'tracer'
        })
    }

    shootTracer(x, y, scene, angle) {
        this.runChildUpdate = true;
        var tracer = this.getFirstDead(false);
        if (tracer) {
            tracer.shoot(x, y, angle);
            if (tracer.bullet == null) {
                tracer.setOrigin(0.5, 0.5);
                tracer.setSize(50, 50);
                //tracer.setOffset(tracer, 0);
                scene.enableBullet(tracer, tracerSpeed);
            }
            
        }
    }
}