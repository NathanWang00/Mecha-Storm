class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    create() {

        this.cursors = this.input.keyboard.createCursorKeys();

        // font config
        
        let menuConfig = {

            fontFamily: 'pixelfont',
            fontSize: '36px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'

        }

        // ui
    
        menuConfig.fontSize = '24px';
        this.add.text(1080 / 2, 720 / 2 - 100, 'ARROW KEYS TO MOVE', menuConfig).setOrigin(0.5);
        this.add.text(1080 / 2, 720 / 2 - 75, 'Z TO SLASH', menuConfig).setOrigin(0.5);
        this.add.text(1080 / 2, 720 / 2 - 50, 'X TO SHOOT', menuConfig).setOrigin(0.5);
        this.add.text(1080 / 2, 720 / 2 - 25, 'SHIFT TO FOCUS', menuConfig).setOrigin(0.5);

        menuConfig.fontSize = '36px';
        this.add.text(1080 / 2, 720 / 2 + 50, 'PRESS SPACE TO CONTINUE', menuConfig).setOrigin(0.5);

    }

    update() {

        if (this.cursors.space.isDown) {

            this.scene.start("playScene");  
  
        }

    }

}