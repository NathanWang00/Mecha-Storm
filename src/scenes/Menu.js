class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

        this.load.image('instructions', './assets/MainMenu.png');
        this.load.image('credits', './assets/Credits.png');
        this.load.image('tower', './assets/TowerMenu.png');
        this.load.audio('button', ['assets/placeholderSwordShot.wav']);

    }

    create() {

        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.creditsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.buttonSound = this.sound.add('button', {volume: 0.4});

        // ui
    
        this.homeScreen = this.add.image(0, 0, 'instructions').setOrigin(0,0);
        this.creditsScreen = this.add.image(0, 0, 'credits').setOrigin(0,0);
        this.creditsScreen.alpha = 0;
        this.towerScroll = this.add.tileSprite(850, 360, 0, 0, 'tower').setOrigin(0.5,0.5);

        this.transition = this.add.rectangle(0, 0, 1080, 720, 0x000000).setOrigin(0, 0);
        this.transition.alpha = 0;

    }

    update(delta) {

        this.universalScroll = 1;
        this.towerScroll.tilePositionY -= 0.25;

        if (Phaser.Input.Keyboard.JustDown(this.startKey)) {

            this.buttonSound.play();

            this.tweens.addCounter({

                from: 0,
                to: 1,
                duration: 100,
                ease: Phaser.Math.Easing.Linear,
                loop: 0,
                onUpdate: tween => {

                    this.transitionValue = tween.getValue();
                    this.transition.alpha = this.transitionValue;
                        
                },
                onComplete: tween => {

                    this.scene.start("playScene");

                }

            }); 
  
        }

        if (Phaser.Input.Keyboard.JustDown(this.creditsKey)) {

            this.buttonSound.play();

            if (this.creditsScreen.alpha == 0) {

                this.creditsScreen.alpha = 1;
                this.homeScreen.alpha = 0;

            } else if (this.creditsScreen.alpha == 1) {

                this.creditsScreen.alpha = 0;
                this.homeScreen.alpha = 1;

            }
  
        }

    }

}