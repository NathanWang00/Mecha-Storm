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
        this.add.text(1080 / 2, 720 / 2 - 150, 'ARROW KEYS TO MOVE', menuConfig).setOrigin(0.5);
        this.add.text(1080 / 2, 720 / 2 - 125, 'Z TO SLASH', menuConfig).setOrigin(0.5);
        this.add.text(1080 / 2, 720 / 2 - 100, 'X TO SHOOT', menuConfig).setOrigin(0.5);
        this.add.text(1080 / 2, 720 / 2 - 75, 'SHIFT OR CTRL TO AIM/MOVE SLOW', menuConfig).setOrigin(0.5);
        this.add.text(1080 / 2, 720 / 2 - 50, 'SPACE AT FULL POWER TO TRANSFORM', menuConfig).setOrigin(0.5);
        this.add.text(1080 / 2, 720 / 2 - 25, 'R TO RESTART', menuConfig).setOrigin(0.5);

        menuConfig.fontSize = '36px';
        this.add.text(1080 / 2, 720 / 2 + 50, 'PRESS SPACE TO CONTINUE', menuConfig).setOrigin(0.5);

    }

    update() {

        if (this.cursors.space.isDown) {
            this.scene.start("playScene");  
  
        }

    }

}