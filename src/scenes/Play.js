class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('ammo', './assets/Ammo.png');
        this.load.image('player', './assets/Player.png');
        this.load.image('hitbox', './assets/PlayerHitbox.png');
        this.load.image('scout', './assets/Scout.png');
        this.load.image('gun', './assets/GunIdle.png');
        this.load.image('swordBeam', './assets/TempSwordBeam.png');
        this.load.image('tracer', './assets/Tracer.png');
        this.load.image('basicBullet', './assets/EnemyBullet.png');
        this.load.plugin('rexbulletplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbulletplugin.min.js', true);
        this.load.plugin('rexmovetoplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmovetoplugin.min.js', true);//for move to
        this.load.atlas('swordTexture', './assets/swordTexture.png', './assets/swordTexture.json');
        this.load.image('crosshair', './assets/Crosshair.png');

        //SFX load
        this.load.audio('swordBeamFire', ['assets/placeholderSwordShot.wav']);
        this.load.audio('gunShot', ['assets/placeholderGunShot.wav']);
        this.load.audio('explosionSfx', ['assets/placeholderExplosion.wav']);
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');

        //Game Audio
        this.swordBeamFire = this.sound.add('swordBeamFire');
        this.gunShot = this.sound.add('gunShot');
        this.explosionSfx = this.sound.add('explosionSfx');

        // player 
        this.player = this.physics.add.sprite(520, 650, 'player');
        this.player.setCollideWorldBounds(true);
        this.damageable = true;
        this.actionable = true;
        this.pingPong = 0; // logic for flickering sprite
        this.player.body.setSize(54, 54, true);

        this.lives = lives;
        this.ammo = baseAmmo;
        this.maxAmmo = baseAmmo;
        this.swung = false;

        // gun
        this.gun = this.physics.add.sprite(this.player.x - 40, this.player.y - 50, 'gun');
        this.gun.targetX = this.player.x - 40;
        this.gun.targetY = this.player.y - 50;
        this.enableMoveTo(this.gun, this.gun.targetX, this.gun.targetY, gunFollowSpeed, false);
        // make gun floaty, switch to over side if player is on edge, accelerate based on distance

        // hitbox
        this.hitbox = this.physics.add.sprite(520, 650, 'hitbox');

        // keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.focusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.gunKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.focus = 1;

        // Enemy groups
        this.scoutGroup = new ScoutGroup(this);
        this.basicBulletGroup = new BasicBulletGroup(this);

        // Pickups
        this.ammoGroup = new AmmoGroup(this);

        // Sword pool
        this.swordGroup = new SwordGroup(this);

        // Sword animations
        this.anims.create({ 
            key: 'slashAnim', 
            frames: this.anims.generateFrameNames('swordTexture', {
                start: 1,
                end: 3,
                zeroPad: 1,
                prefix: 'slash',
                suffix: '.gif'
            }),
            frameRate: 18, 
            repeat: 0
        });

        this.anims.create({ 
            key: 'powerSlashAnim', 
            frames: this.anims.generateFrameNames('swordTexture', {
                start: 1,
                end: 3,
                zeroPad: 1,
                prefix: 'powerSlash',
                suffix: '.png'
            }),
            frameRate: 18, 
            repeat: -1
        });

        this.sword = this.physics.add.sprite(this.player.x, this.player.y - 75, 'slash');
        this.sword.setSize(50, 40);
        this.sword.setOffset(15, 35);
        this.sword.anims.play('slashAnim');
        this.sword.anims.pause();
        this.sword.reverse = false;

        this.sword.targetX = this.player.x;
        this.sword.targetY = this.player.y - 75;
        this.enableMoveTo(this.sword, this.sword.targetX, this.sword.targetY, 1000, false);


        // player bullet
        this.tracerGroup = new TracerGroup(this);
        this.closestEnemy = null;

        // crosshair
        this.crosshair = this.add.sprite(200, 200, 'crosshair');
        this.crosshair.alpha = 0;

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
            var tempDamage = swordBeam.getDamage();
            if(swordBeam.active && swordBeam.hit(scout)) {
                scout.hit(tempDamage);
            }
        });
        this.physics.add.overlap(this.scoutGroup, this.tracerGroup, function (scout, tracer)
        {
            tracer.hit();
            scout.hit(tracer.getDamage());
        });
        this.physics.add.overlap(this.scoutGroup, this.hitbox, this.playerHurt, null, this);
        this.physics.add.overlap(this.hitbox, this.basicBulletGroup, this.playerHurt, null, this);

        this.physics.add.overlap(this.player, this.ammoGroup, function (player, ammoGroup)
        {
            ammoGroup.hit();
        })

        // Spawning
        this.spawnTrack = 1;
        this.spawnWave();
    }

    update(time, delta) {
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
    
            // attack
            if (this.shootKey.isDown && !this.swung) {
                if (this.sword.reverse) {
                    this.sword.anims.playReverse('slashAnim');
                    this.sword.reverse = false;
                } else {
                    this.sword.anims.play('slashAnim');
                    this.sword.reverse = true;
                }
                this.swung = true;
                this.recover = this.time.delayedCall(swingSpeed, () => {
                    this.swung = false;
                }, null, this);
                this.swordBeamFire.play();//Fire sfx
                this.swordGroup.shootBeam(this.player.x, this.player.y - 60);
            }

            // awful naming conventions...
            // shoot
            if (this.focusKey.isDown) {
                this.closestEnemy = null;
                this.closestGroup(this.scoutGroup); //updates closestEnemy to the closest active enemy in the group
                if (this.closestEnemy != null) {
                    var closeAngle = Phaser.Math.Angle.BetweenPoints({x: this.gun.x, y: this.gun.y}, {x: this.closestEnemy.x, y: this.closestEnemy.y});
                    closeAngle = Phaser.Math.RadToDeg(closeAngle);
                    this.gun.angle = closeAngle + 90;
                    this.crosshair.setPosition(this.closestEnemy.x, this.closestEnemy.y);
                    this.crosshair.angle += 5 * delta / 60;
                    this.crosshair.alpha += 0.35 * delta /60;
                } else {
                    this.gun.angle = 0;
                    this.crosshair.alpha = 0;
                }
            }

            if (Phaser.Input.Keyboard.JustDown(this.gunKey) && this.ammo > 0) {
                this.gunShot.play();//Gunshot sfx
                var convertedAngle = Phaser.Math.DegToRad(this.gun.angle-90);
                var gunOffset = 70;
                this.tracerGroup.shootTracer(this.gun.x + gunOffset * Math.cos(convertedAngle), this.gun.y + gunOffset * Math.sin(convertedAngle), this, this.gun.angle-90);
                this.ammo--;
                console.log(this.ammo);
            }

            // gun focus
            if (Phaser.Input.Keyboard.JustDown(this.focusKey)) {
                this.focus = focusModifier;
                this.gun.moveTo.speed = gunFocusSpeed;
                this.sword.moveTo.speed = 1000;
            }
            if (Phaser.Input.Keyboard.JustUp(this.focusKey)) {
                this.focus = 1;
                this.gun.moveTo.speed = gunFollowSpeed;
                this.gun.angle = 0;
                this.sword.moveTo.speed = 1000;
                this.crosshair.alpha = 0;
            }
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

        // gun and sword follow player
        this.gun.targetX = this.player.x - 40;
        this.gun.targetY = this.player.y - 50;
        this.gun.moveTo.moveTo(this.gun.targetX, this.gun.targetY);
        this.sword.targetX = this.player.x;
        this.sword.targetY = this.player.y - 75;
        this.sword.moveTo.moveTo(this.sword.targetX, this.sword.targetY);
    }

    enableBullet(obj, moveSpeed) {
        obj.bullet = this.plugins.get('rexbulletplugin').add(obj, {
            speed: moveSpeed
        });
    }

    enableMoveTo(obj, xPos, yPos, moveSpeed, rotate) {
        obj.moveTo = this.plugins.get('rexmovetoplugin').add(obj, {
            speed: moveSpeed,
            rotateToTarget: rotate
        });
        obj.moveTo.moveTo(xPos, yPos);
    }

    spawnWave() {
        switch(this.spawnTrack) {
            case 1 : 
                this.scoutGroup.spawn(520, -50, this, 50);
                this.scoutGroup.spawn(320, -50, this, 50);
                this.scoutGroup.spawn(720, -50, this, 50);
                this.spawnTrack++;
                break;

            case 2 :
                this.scoutGroup.spawn(370, -50, this, 50);
                this.scoutGroup.spawn(670, -50, this, 50);
                this.spawnTrack--;
                break;

            default :
                console.log("spawn error");
        }

        // repeat the wave for testing
        this.spawn = this.time.delayedCall(2000, this.spawnWave, null, this);
        
    }

    angToPlayer(x, y) {
        var ang = Phaser.Math.Angle.BetweenPoints({x: x, y: y}, {x: this.player.x, y: this.player.y});
        ang = Phaser.Math.RadToDeg(ang);
        return ang;
    }

    spawnBasic(x, y, scene, angle) {
        if (angle == null) {
            this.basicBulletGroup.shootBullet(x, y, scene, this.angToPlayer(x, y));
        } else {
            this.basicBulletGroup.shootBullet(x, y, scene, angle);
        }
    }

    spawnAmmo(x, y, chance) {
        if(this.ammo < this.maxAmmo) {
            if (Phaser.Math.Between(0, 1) <= chance) {
                this.ammoGroup.spawn(x, y);
            }
        } else {
            //give power
        }
    }

    playerHurt() {
        if (this.damageable) {
            this.actionable = false;
            this.damageable = false;
            this.player.alpha = 0;
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(0);

            if (this.lives <= 0) {
                //game over stuff
                console.log("game over");
                this.registry.destroy();
                this.events.off();
                this.scene.restart();   
                //this.scene.start("menuScene");  
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
            this.lives--;
        }
    }

    closestGroup(group) {
        var active = group.getMatching('active', true)
        for (var i = 0; i < active.length; ++i) {
            this.closestChild(active[i]);
        }
    }

    closestChild(obj) {
        if (this.closestEnemy == null) {
            this.closestEnemy = obj;
        } else {
            if (Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y) <
            Phaser.Math.Distance.Between(this.player.x, this.player.y, this.closestEnemy.x, this.closestEnemy.y)) {
                this.closestEnemy = obj;    
            }
        }
    }
}