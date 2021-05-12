class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('player', './assets/TempPlayer.png');
        this.load.image('hitbox', './assets/PlayerHitbox.png');
        this.load.image('swordBeam', './assets/TempSwordBeam.png');
        this.load.image('scout', './assets/Scout.png');
        this.load.plugin('rexbulletplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbulletplugin.min.js', true);

    }

    create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');

        // player 
        this.player = this.physics.add.sprite(520, 650, 'player');
        this.player.setCollideWorldBounds(true);
        this.damageable = true;
        this.actionable = true;
        this.pingPong = 0; // logic for flickering sprite
        this.player.body.setSize(54, 54, true);

        // hitbox
        this.hitbox = this.physics.add.sprite(520, 650, 'hitbox');

        // keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.focusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.focus = 1;

        // Enemy groups
        this.scoutGroup = new ScoutGroup(this);

        // Sword pool
        this.swordGroup = new SwordGroup(this);

        // temp UI border
        this.rect1 = this.add.rectangle(0, 0, 180, 720, 0x000000).setOrigin(0, 0);
        this.rect2 = this.add.rectangle(900, 0, 180, 720, 0x000000).setOrigin(0, 0);

        this.physics.add.existing(this.rect1, true);
        this.rect1.body.immovable = true;
        this.physics.add.existing(this.rect2, true);
        this.rect2.body.immovable = true;

        // Collisions
        this.physics.add.collider(this.player, this.rect1);
        this.physics.add.collider(this.player, this.rect2);
        this.physics.add.overlap(this.scoutGroup, this.swordGroup, function (scout, swordBeam)
        {
            swordBeam.hit();
            scout.hit(swordBeam.getDamage());
        });
        this.physics.add.overlap(this.scoutGroup, this.hitbox, this.playerHurt, null, this);

        // Spawning
        this.spawnTrack = 1;
        this.spawnWave(this.spawnTrack);
    }

    update() {
        let horz = 0;
        let vert = 0;
        let tempSpeed = playerSpeed;

        if (this.actionable) {
            // player movement
            if (this.cursors.up.isDown) {
                vert = -1;
            } else {
                if (this.cursors.down.isDown) {
                    vert = 1;
                }
            }
            if (this.cursors.left.isDown) {
                horz = -1;
            } else {
                if (this.cursors.right.isDown) {
                    horz = 1;
                }
            }
            if (horz != 0 && vert != 0) {
                tempSpeed = 0.709 * playerSpeed;//for diagonal movement
            }
            this.player.setVelocityX(horz * tempSpeed * this.focus);
            this.player.setVelocityY(vert * tempSpeed * this.focus);
    
            //attack
            if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
                this.swordGroup.shootBeam(this.player.x, this.player.y - 60);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.focusKey)) {
            this.focus = focusModifier;
        }
        if (Phaser.Input.Keyboard.JustUp(this.focusKey)) {
            this.focus = 1;
        }

        if (this.pingPong != 0) {
            this.player.alpha += 0.025 * this.pingPong;
            if (this.player.alpha >= 1) {
                this.pingPong = -1;
            } else {
                if (this.player.alpha <= 0) {
                    this.pingPong = 1;
                }
            }
        }

        // hitbox
        this.hitbox.x = this.player.x;
        this.hitbox.y = this.player.y;
    }

    enableBullet(obj, moveSpeed) {
        obj.bullet = this.plugins.get('rexbulletplugin').add(obj, {
            speed: moveSpeed
        });
    }

    spawnWave(num) {
        switch(num) {
            case 1 : 
                this.scoutGroup.spawn(520, 100, this, 50);
                break;

            default :
                console.log("spawn error");
        }
        this.spawnTrack++;
    }

    playerHurt() {
        if (this.damageable) {
            this.actionable = false;
            this.damageable = false;
            this.player.alpha = 0;
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(0);

            if (lives <= 0) {
                //game over stuff
                console.log("game over");
            } else {
                this.recover = this.time.delayedCall(450, () => {
                    this.actionable = true;
                    this.pingPong = 1;
                }, null, this);
    
                this.invincible = this.time.delayedCall(3000, () => {
                    this.damageable = true;
                    this.player.alpha = 1;
                    this.pingPong = 0;
                }, null, this);
            }
            lives--;
        }
    }
}