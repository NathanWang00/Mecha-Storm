class Cyborg extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        super(scene, 0, 0, 'cyborg');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //initial variables
        this.health = cyborgHealth;

        //this.setSize(50, 50);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.scene = scene;
        this.accel = cyborgAccel;
        this.phase = cyborgPoints;
        this.shootDelay = cyborgShootDelay;
        this.power = 15;
        this.bulletDrop = 1;
    }

    spawn(x, y) {
        this.body.enable = true;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(90);
        this.health = cyborgHealth;
        this.shootDelay = cyborgShootDelay;
        this.phase = 0;
        this.moveTo.moveTo(this.x, this.y + 200);
        this.moveTo.on('complete', function(gameObject){
            if (gameObject.phase == 0) {
                gameObject.phase = 1;
            }
            //gameObject.moveTo.moveTo(this.x, this.y - 100);
            gameObject.moveTo.setSpeed(0);
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.moveTo.enable) {
            if (this.phase == 1) {
                if (this.shootDelay > 0) {
                    this.shootDelay -= delta / 60;
                } else {
                    this.shootDelay = regularShootDelay;
                    this.scene.spawnEgg(this.x, this.y, this.scene);
                }
                //this.moveTo.moveTo(this.x + 100, this.y);
            }

            if (this.moveTo.speed < cyborgSpeed + this.accel * delta / 60) {
                this.moveTo.setSpeed(this.moveTo.speed + this.accel * delta / 60);
            } else {
                this.moveTo.setSpeed(cyborgSpeed);
                
            }
            
            if (this.y > this.height + game.config.height || this.y < -400 || this.x > game.config.width + 400 || this.x < -400) {
                this.death();
            }
        }
    }

    hit(damage) {
        if (this.active) {
            this.health -= damage;

            // damage tween

            if (this.health > 0) {
 
                this.noColor = Phaser.Display.Color.ValueToColor(0xFFFFFF);
                this.damageColor = Phaser.Display.Color.ValueToColor(0xFF0000);
                this.scene.tweens.addCounter({

                    from: 0,
                    to: 100,
                    duration: 200,
                    ease: Phaser.Math.Easing.Sine.In,
                    loop: 0,
                    onUpdate: tween => {

                        this.value = tween.getValue();
                        this.colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(this.damageColor, this.noColor, 100, this.value);
                        this.color = Phaser.Display.Color.GetColor(this.colorObject.r, this.colorObject.g, this.colorObject.b);
                        this.setTint(this.color);
                    }
                });

            }

            if (this.health <= 0) {
                // update score
                this.scene.score += heavyPoints;
                this.scene.scoreText.text = this.scene.score;
                this.scene.scoreTextShadow.text = this.scene.score;

                //this.scene.spawnCircle(this.x, this.y, this.scene, 8, null);
                this.scene.spawnPickup(this.x, this.y, this.power, this.bulletDrop);
                this.death();
                this.scene.botHurtSfx.play();
            }
        }
    }

    death() {
        this.body.reset(0, 0);
        this.scene.time.removeEvent(this.shoot);
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}