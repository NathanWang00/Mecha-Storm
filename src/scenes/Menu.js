class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    create() {
        this.scene.start('playScene');  
    }
}