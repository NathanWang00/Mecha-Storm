class Scout extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'scout');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //initial variables
        this.health = scoutHealth;

        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.scene = scene;
    }

    spawn(x, y) {
        this.body.enable = true;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(90);
        this.health = scoutHealth;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > this.height + game.config.height) {
            this.death();
        }
        //this.bullet.speed += 100 * delta / 60;
    }

    hit(damage) {
        if (this.active) {
            this.health -= damage;
            if (this.health <= 0) {
                this.scene.spawnBasic(this.x, this.y, this.scene, null);
                this.death();
                this.scene.explosionSfx.play();
            }
            console.log(damage);
        }
    }

    death() {
        this.body.reset(0, 0);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}