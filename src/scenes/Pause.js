class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    create() {
        this.play = this.scene.get('playScene');
        this.powerKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.resetKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.powerKey)) {
            this.scene.resume('playScene');
            this.play.continue();
            this.scene.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(this.resetKey)) {
            this.scene.resume('playScene');
            this.play.reset();
            this.scene.stop();
        }
    }
}