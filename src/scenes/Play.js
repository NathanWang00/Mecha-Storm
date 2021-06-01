class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('ammo', './assets/Ammo.png');
        this.load.image('power', './assets/Power.png')
        this.load.image('player', './assets/Player.png');
        this.load.image('hitbox', './assets/PlayerHitbox.png');

        this.load.image('scout', './assets/Scout.png');
        this.load.image('regular', './assets/Regular.png');
        this.load.image('heavy', './assets/Heavy.png');

        this.load.image('gun', './assets/GunIdle.png');
        this.load.image('gunUpgrade', './assets/GunIdleUpgraded.png');
        this.load.image('gunShot', './assets/GunShot.png');
        this.load.image('gunShotUpgrade', './assets/GunShotUpgraded.png')
        this.load.image('swordBeam', './assets/TempSwordBeam.png');
        this.load.image('swordSlashLeft', './assets/SwordSlashLeft.png');
        this.load.image('swordSlashRight', './assets/SwordSlashRight.png');
        this.load.image('swordSlashLeftUpgraded', './assets/SwordSlashLeftUpgraded.png');
        this.load.image('swordSlashRightUpgraded', './assets/SwordSlashRightUpgraded.png');

        this.load.image('tracer', './assets/Tracer.png');
        this.load.image('basicBullet', './assets/EnemyProjectile1.png');
        this.load.image('fastBullet', './assets/EnemyProjectile2.png')

        this.load.plugin('rexbulletplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbulletplugin.min.js', true);
        this.load.plugin('rexmovetoplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmovetoplugin.min.js', true);//for move to

        this.load.atlas('swordTexture', './assets/swordTexture.png', './assets/swordTexture.json');
        this.load.image('crosshair', './assets/Crosshair.png');
        this.load.image('healthPanel', './assets/HealthPanel.png');
        this.load.image('swordPanel', './assets/SwordPanel.png');
        this.load.image('gunPanel', './assets/GunPanel.png');
        this.load.image('backgroundPanel', './assets/BackgroundPanel.png');//UI panel

        this.load.image('health', './assets/Heart.png');
        this.load.image('damage', './assets/Damaged.png');
        this.load.image('powerPanel', './assets/PowerPanel.png');
        this.load.image('sceneBackground', './assets/sceneBackground.png');//Scenery
        this.load.image('towerScroll', './assets/TowerScroll.png');
        this.load.image('gunIconRegular', './assets/GunIcon.png');
        this.load.image('gunIconUpgraded', './assets/GunIconUpgraded.png');
        this.load.image('swordIconRegular', './assets/SwordIcon.png');
        this.load.image('swordIconUpgraded', './assets/SwordIconUpgraded.png');
        this.load.image('cloudScroll', './assets/CloudScroll.png');

        //SFX load
        this.load.audio('swordBeamFire', ['assets/placeholderSwordShot.wav']);
        this.load.audio('gunShot', ['assets/placeholderGunShot.wav']);
        this.load.audio('explosionSfx', ['assets/placeholderExplosion.wav']);
        this.load.audio('botHurtSfx', ['assets/botHurt01.wav']);
        this.load.audio('ammoSfx', ['assets/ammoPickup.wav']);
        this.load.audio('upgradeSfx', ['assets/upgrade01.wav']);
        this.load.audio('playerHitSfx', ['assets/playerHit.wav']);
        this.load.audio('noAmmoSfx', ['assets/noAmmo.wav']);
    }

    create() {
        //Background Scenery
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.sceneBackground = this.add.image(540, 360, 'sceneBackground');
        this.cloudScroll = this.add.tileSprite(180, 0, 0, 0, 'cloudScroll').setOrigin(0,0);
        this.towerScroll = this.add.tileSprite(180, 0, 0, 0, 'towerScroll').setOrigin(0,0);

        //Game Audio
        this.swordBeamFire = this.sound.add('swordBeamFire', {volume: 0.8});
        this.gunShot = this.sound.add('gunShot', {volume: 0.7});
        this.explosionSfx = this.sound.add('explosionSfx');
        this.botHurtSfx = this.sound.add('botHurtSfx', {volume: 0.7});
        this.ammoSfx = this.sound.add('ammoSfx');
        this.upgradeSfx = this.sound.add('upgradeSfx', {volume: 0.5});
        this.playerHitSfx = this.sound.add('playerHitSfx');
        this.noAmmoSfx = this.sound.add('noAmmoSfx');

        // player 
        this.player = this.physics.add.sprite(520, 650, 'player');
        this.player.setCollideWorldBounds(true);
        this.damageable = true;
        this.actionable = true;
        this.pingPong = 0; // logic for flickering sprite
        this.player.body.setSize(20, 54, true);
        this.score = 0;

        this.lives = lives;
        this.ammo = baseAmmo;
        this.maxAmmo = baseAmmo;
        this.swung = false;
        this.power = 0;
        this.powerMode = false;
        this.playerSpeed = playerSpeed;

        // gun
        this.gun = this.physics.add.sprite(this.player.x - 40, this.player.y - 50, 'gun');
        this.gun.targetX = this.player.x - 40;
        this.gun.targetY = this.player.y - 50;
        this.enableMoveTo(this.gun, this.gun.targetX, this.gun.targetY, gunFollowSpeed, false);
        // make gun floaty, switch to over side if player is on edge, accelerate based on distance

        // hitbox
        this.hitbox = this.physics.add.sprite(520, 650, 'hitbox');
        this.hitbox.body.setCircle(4);
        this.hitbox.setVisible(false);
        this.hitbox.x = this.player.x;
        this.hitbox.y = this.player.y;

        // keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.focusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.gunKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.powerKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.focus = 1;

        this.debugPower = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // Enemy groups
        this.scoutGroup = new ScoutGroup(this);
        this.regularGroup = new RegularGroup(this);
        this.heavyGroup = new HeavyGroup(this);
        this.basicBulletGroup = new BasicBulletGroup(this);
        this.fastBulletGroup = new FastBulletGroup(this);

        // Pickups
        this.ammoGroup = new AmmoGroup(this);
        this.powerGroup = new PowerGroup(this);

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
            repeat: 0
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

        // ui physics
        this.rect1 = this.add.rectangle(0, 0, 180, 720, 0x000000).setOrigin(0, 0);
        this.rect2 = this.add.rectangle(900, 0, 180, 720, 0x000000).setOrigin(0, 0);
        
        this.physics.add.existing(this.rect1, true);
        this.rect1.body.immovable = true;
        this.physics.add.existing(this.rect2, true);
        this.rect2.body.immovable = true;


        // ui backgrounds

        this.backgroundPanel1 = this.add.image(90, 360, 'backgroundPanel');
        this.backgroundPanel2 = this.add.image(990, 360, 'backgroundPanel');
        this.healthPanel = this.add.image(90, 63, 'healthPanel');
        this.swordPanel = this.add.image(90, 185.5, 'swordPanel');
        this.gunPanel = this.add.image(90, 352, 'gunPanel');
        this.powerPanel = this.add.image(90, 566, 'powerPanel');
        this.scorePanel = this.add.image(990, 63, 'healthPanel');

        // health display

        let playConfig = {

            fontFamily: 'pixelfont',
            fontSize: '20px',
            color: '#FFFFFF',
            stroke: '#213136',
            strokeThickness: 2,
            align: 'center'

        }

        playConfig.color = '#213136';
        this.ammoCount = this.add.text(90 + 2, 40 + 2, "HEALTH", playConfig).setOrigin(0.5);
        playConfig.color = '#89cae0';
        this.ammoCountShadow = this.add.text(90, 40, "HEALTH", playConfig).setOrigin(0.5);

        this.livesArray = [];

        for (let i = 0; i < 3; i++) {

            let life = this.add.sprite(47 + 43 * i, 78, 'health');
            this.livesArray.push(life);

        }

        this.damagedArray = [];

        for (let i = 0; i < 3; i++) {

            let damage = this.add.sprite(47 + 43 * i, 78, 'damage');
            damage.alpha = 0;
            this.damagedArray.push(damage);

        }

        this.healthOrigins = [];
        for (let i = 0; i < 3; i++) {
            this.healthOrigins.push(this.livesArray[i].x);
        }

        // ammo counter

        playConfig.fontSize = '40px';
        playConfig.strokeThickness = 4;
        playConfig.color = '#213136';
        this.ammoCount = this.add.text(107 + 2, 409 + 2, baseAmmo + "/" + baseAmmo, playConfig).setOrigin(0.5);
        playConfig.color = '#e8b046';
        this.ammoCountShadow = this.add.text(107, 409, baseAmmo + "/" + baseAmmo, playConfig).setOrigin(0.5);

        // power display

        playConfig.fontSize = '20px';
        playConfig.strokeThickness = 2;
        playConfig.color = '#213136';
        this.powerLevel = this.add.text(92 + 2, 692 + 2, "POWER LEVEL", playConfig).setOrigin(0.5);
        playConfig.color = '#89cae0';
        this.powerLevelShadow = this.add.text(92, 692, "POWER LEVEL", playConfig).setOrigin(0.5);


        this.endCap = this.add.rectangle(82, 658, 16, 4, 0xb686ff).setOrigin(0, 0);
        this.powerProgress = this.add.rectangle(78, 658, 24, 0, 0xb686ff).setOrigin(0, 0);

        // score display

        playConfig.color = '#213136';
        this.scoreLabel = this.add.text(990 + 2, 40 + 2, "SCORE", playConfig).setOrigin(0.5);
        playConfig.color = '#89cae0';
        this.scoreLabelShadow = this.add.text(990, 40, "SCORE", playConfig).setOrigin(0.5);

        playConfig.fontSize = '40px';
        playConfig.color = '#213136';
        this.scoreText = this.add.text(990 + 2, 75 + 2, this.score, playConfig).setOrigin(0.5);
        playConfig.color = '#89cae0';
        this.scoreTextShadow = this.add.text(990, 75, this.score, playConfig).setOrigin(0.5);

        // weapon display

        this.swordIcon = this.add.sprite(57, 140, 'swordIconRegular').setOrigin(0);

        playConfig.fontSize = '20px';
        playConfig.color = '#213136';
        this.swordLabel = this.add.text(90 + 2, 220 + 2, "STANDARD", playConfig).setOrigin(0.5);
        playConfig.color = '#89cae0';
        this.swordLabelShadow = this.add.text(90, 220, "STANDARD", playConfig).setOrigin(0.5);

        this.gunIcon = this.add.sprite(58, 276, 'gunIconRegular').setOrigin(0);

        playConfig.fontSize = '20px';
        playConfig.color = '#213136';
        this.gunLabel = this.add.text(90 + 2, 364 + 2, "STANDARD", playConfig).setOrigin(0.5);
        playConfig.color = '#89cae0';
        this.gunLabelShadow = this.add.text(90, 364, "STANDARD", playConfig).setOrigin(0.5);

        // Collisions
        this.physics.add.collider(this.player, this.rect1);
        this.physics.add.collider(this.player, this.rect2);
        //in hindsight, these should have all been under 1 group, oh well
        this.physics.add.overlap(this.scoutGroup, this.swordGroup, function (scout, swordBeam)
        {
            var tempDamage = swordBeam.getDamage();
            if(swordBeam.active && swordBeam.hit(scout)) {
                scout.hit(tempDamage);
            }
        });
        this.physics.add.overlap(this.scoutGroup, this.tracerGroup, function (scout, tracer)
        {
            var tempDamage = tracer.getDamage();
            if(tracer.active && tracer.hit(scout)) {
                scout.hit(tempDamage);
            }
        });

        this.physics.add.overlap(this.regularGroup, this.swordGroup, function (regular, swordBeam)
        {
            var tempDamage = swordBeam.getDamage();
            if(swordBeam.active && swordBeam.hit(regular)) {
                regular.hit(tempDamage);
            }
        });
        this.physics.add.overlap(this.regularGroup, this.tracerGroup, function (regular, tracer)
        {
            var tempDamage = tracer.getDamage();
            if(tracer.active && tracer.hit(regular)) {
                regular.hit(tempDamage);
            }
        });

        this.physics.add.overlap(this.heavyGroup, this.swordGroup, function (heavy, swordBeam)
        {
            var tempDamage = swordBeam.getDamage();
            if(swordBeam.active && swordBeam.hit(heavy)) {
                heavy.hit(tempDamage);
            }
        });
        this.physics.add.overlap(this.heavyGroup, this.tracerGroup, function (heavy, tracer)
        {
            var tempDamage = tracer.getDamage();
            if(tracer.active && tracer.hit(heavy)) {
                heavy.hit(tempDamage);
            }
        });
        this.physics.add.overlap(this.scoutGroup, this.hitbox, this.playerHurt, null, this);
        this.physics.add.overlap(this.hitbox, this.basicBulletGroup, this.playerHurt, null, this);
        this.physics.add.overlap(this.hitbox, this.fastBulletGroup, this.playerHurt, null, this);

        this.physics.add.overlap(this.player, this.ammoGroup, function (player, ammoGroup)
        {
            ammoGroup.hit();
        })

        this.physics.add.overlap(this.player, this.powerGroup, function (player, powerGroup)
        {
            powerGroup.hit();
        })

        // Spawning
        this.spawnTrack = startTrack;
        this.spawnWave();
    }

    update(time, delta) {
        let horz = 0;
        let vert = 0;
        let tempSpeed = this.playerSpeed;

        //background scroll update
        this.cloudScroll.tilePositionY -= 2;
        this.towerScroll.tilePositionY -= 3;

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
                tempSpeed = 0.709 * this.playerSpeed;//for diagonal movement
            }
            this.player.setVelocityX(horz * tempSpeed * this.focus);
            this.player.setVelocityY(vert * tempSpeed * this.focus);
    
            // attack
            if (this.shootKey.isDown && !this.swung) {
                if (this.sword.reverse) {
                    if (this.powerMode) {
                        this.sword.anims.playReverse('powerSlashAnim');
                    } else {
                        this.sword.anims.playReverse('slashAnim');
                    }
                    this.sword.reverse = false;
                } else {
                    if (this.powerMode) {
                        this.sword.anims.play('powerSlashAnim');
                    } else {
                        this.sword.anims.play('slashAnim');
                    }
                    this.sword.reverse = true;
                }
                this.swung = true;
                var tempSwing = swingSpeed;
                if (this.powerMode) {
                    tempSwing = pSwingSpeed;
                }
                this.recover = this.time.delayedCall(tempSwing, () => {
                    this.swung = false;
                }, null, this);
                this.swordBeamFire.play();//Fire sfx
                this.swordGroup.shootBeam(this.player.x, this.player.y - 60, this.sword.reverse, this.powerMode);
            }

            // awful naming conventions...
            // shoot and tracking
            if (this.focusKey.isDown) {
                this.closestEnemy = null;
                this.closestGroup(this.scoutGroup); //updates closestEnemy to the closest active enemy in the group
                this.closestGroup(this.regularGroup);
                this.closestGroup(this.heavyGroup);
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

            if (Phaser.Input.Keyboard.JustDown(this.gunKey)) {

                if (this.ammo > 0) {

                    this.gunShot.play(); //Gunshot sfx
                    var convertedAngle = Phaser.Math.DegToRad(this.gun.angle-90);
                    var gunOffset = 70;
                    this.tracerGroup.shootTracer(this.gun.x + gunOffset * Math.cos(convertedAngle), this.gun.y + gunOffset * Math.sin(convertedAngle), this, this.gun.angle-90);
                    this.ammo--;
                    this.ammoCount.text = this.ammo + "/" + baseAmmo;;
                    this.ammoCountShadow.text = this.ammo + "/" + baseAmmo;;
                    if (this.powerMode) {
                        this.gun.setTexture('gunShotUpgrade');
                    } else {
                        this.gun.setTexture('gunShot');
                    }
                    this.shot = this.time.delayedCall(100, () => {
                        if (this.powerMode) {
                            this.gun.setTexture('gunUpgrade');
                        } else {
                            this.gun.setTexture('gun');
                        }
                    }, null, this);

                }
        
                else if (this.ammo < 1) {

                    this.ammoOrigin = 107;
                    this.tweens.addCounter({

                        from: 0,
                        to: 10,
                        duration: 50,
                        ease: Phaser.Math.Easing.Linear,
                        loop: 1,
                        yoyo: true,
                        onUpdate: tween => {
    
                            this.ammoValue = tween.getValue();
                            this.ammoCountShadow.x = this.ammoOrigin + this.ammoValue ;
                            this.ammoCount.x = this.ammoOrigin + 2 + this.ammoValue;
                                
                        },
                        onComplete: function() {

                            // DEBOUNCE RESET

                        }

                    }); 

                }

            }

            // gun focus
            if (Phaser.Input.Keyboard.JustDown(this.focusKey)) {
                this.focus = focusModifier;
                this.gun.moveTo.speed = gunFocusSpeed;
                this.sword.moveTo.speed = 1000;
                this.hitbox.setVisible(true);
            }
            if (Phaser.Input.Keyboard.JustUp(this.focusKey)) {
                this.focus = 1;
                this.gun.moveTo.speed = gunFollowSpeed;
                this.gun.angle = 0;
                this.sword.moveTo.speed = 1000;
                this.crosshair.alpha = 0;
                this.hitbox.setVisible(false);
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

        // power up!
        if (this.power >= 1) {
            if (!this.powerMode && Phaser.Input.Keyboard.JustDown(this.powerKey)) {
                this.powerMode = true;
                this.powerDecrease = basePowerDecrease;
                this.gun.setTexture('gunUpgrade');

                // ui update

                this.swordIcon.setTexture('swordIconUpgraded');
                this.gunIcon.setTexture('gunIconUpgraded');

                this.swordLabel.text = "UPGRADED";
                this.swordLabelShadow.style.color = '#ff8797';
                this.swordLabelShadow.text = "UPGRADED";

                this.gunLabel.text = "UPGRADED";
                this.gunLabelShadow.style.color = '#ff8797';
                this.gunLabelShadow.text = "UPGRADED";

                if (this.sword.reverse) {
                    this.sword.anims.playReverse('powerSlashAnim');
                } else {
                    this.sword.anims.play('powerSlashAnim');
                }
                this.sword.anims.pause();

                this.playerSpeed = pPlayerSpeed;
            }
        }
        if (this.powerMode) {
            this.power -= this.powerDecrease * delta / 60;
            if (this.powerDecrease < maxPowerLoss) {
                this.powerDecrease += powerLoss;
            } else {
                this.powerDecrease = maxPowerLoss;
            }

            if (this.power <= 0) {
                this.power = 0;
                this.powerMode = false;
                this.gun.setTexture('gun');

                //ui update

                this.swordIcon.setTexture('swordIconRegular');
                this.gunIcon.setTexture('gunIconRegular');

                this.swordLabel.text = "STANDARD";
                this.swordLabelShadow.style.color = '#89cae0';
                this.swordLabelShadow.text = "STANDARD";

                this.gunLabel.text = "STANDARD";
                this.gunLabelShadow.style.color = '#89cae0';
                this.gunLabelShadow.text = "STANDARD";

                if (this.sword.reverse) {
                    this.sword.anims.playReverse('slashAnim');
                } else {
                    this.sword.anims.play('slashAnim');
                }
                this.sword.anims.pause();

                this.playerSpeed = playerSpeed;
            }
        }

        // ui power
        this.endCap.height = 190 * this.power;
        this.endCap.y = 471 - this.endCap.height + 190;
        var offset = 3 / 190;
        if (this.power > 1-offset){
            this.powerProgress.height = 184;
            this.powerProgress.y = 474;
        } else if (this.power < offset) {
            this.powerProgress.height = 0;
        } else if (offset < this.power && this.power < 1-offset) {
            this.powerProgress.height = this.endCap.height - 3;
            this.powerProgress.y = this.endCap.y;
        } 

        //debug power
        if (Phaser.Input.Keyboard.JustDown(this.debugPower) && debug) {
            this.power = 1;
        }

        // hitbox
        this.hitbox.x = this.player.x;
        this.hitbox.y = this.player.y;
        this.hitbox.body.setVelocityX(this.player.body.velocity.x);
        this.hitbox.body.setVelocityY(this.player.body.velocity.y);

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

    spawnWave(wave) {
        var delay = 2000;
        var tempTrack = this.spawnTrack;
        if (wave != null) {
            tempTrack = wave;
        }
        switch(tempTrack) {
            case 1 : 
                //x, y, scene, speed, accel, ang, angAccel, power(#), ammo(%), bulletOption(0-2)
                //180-900, 1/4 = 360, 1/2 = 540, 3/4 = 720
                this.scoutGroup.spawn(340, -50, this, scoutSpeed, 20, -20, -2.5, 1, 0, 1);
                if (wave == null) {
                    this.spawn = this.time.delayedCall(300, this.spawnWave, [1], this);
                    this.spawn = this.time.delayedCall(600, this.spawnWave, [1], this);
                }
            break;

            case 2 :
                //x, y, scene, speed, accel, ang, angAccel, power(#), ammo(%), bulletOption(0-2)
                this.scoutGroup.spawn(740, -50, this, scoutSpeed, 20, 20, 2.5, 1, 0, 1);
                if (wave == null) {
                    this.spawn = this.time.delayedCall(300, this.spawnWave, [2], this);
                    this.spawn = this.time.delayedCall(600, this.spawnWave, [2], this);
                }
            break;

            case 3 :
                this.regularGroup.spawn(540, -75, this, regularSpeed, -4, 0, 0, 3, 1);
                this.spawn = this.time.delayedCall(4000, () => {
                    this.regularGroup.spawn(360, -75, this, regularSpeed, -4, 0, 0, 3, 1);
                }, null, this);
                this.spawn = this.time.delayedCall(8000, () => {
                    this.regularGroup.spawn(720, -75, this, regularSpeed, -4, 0, 0, 3, 1);
                }, null, this);
                delay = 14000;
            break;

            case 4 :
                this.scoutGroup.spawn(300, -50, this, scoutSpeed, 30, 0, 0, 1, 0, 2);
                if (wave == null) {
                    this.spawn = this.time.delayedCall(300, this.spawnWave, [4], this);
                    this.spawn = this.time.delayedCall(600, this.spawnWave, [4], this);
                }
                delay = 2000;  
            break;

            //#region tracking scouts 5-8
            case 5 :
                this.scoutGroup.spawn(780, -50, this, scoutSpeed, 30, 0, 0, 1, 0, 2);
                if (wave == null) {
                    this.spawn = this.time.delayedCall(300, this.spawnWave, [tempTrack], this);
                    this.spawn = this.time.delayedCall(600, this.spawnWave, [tempTrack], this);
                }
                delay = 2000;  
            break;

            case 6 :
                this.scoutGroup.spawn(420, -50, this, scoutSpeed, 30, 0, 0, 1, 0, 2);
                if (wave == null) {
                    this.spawn = this.time.delayedCall(300, this.spawnWave, [tempTrack], this);
                    this.spawn = this.time.delayedCall(600, this.spawnWave, [tempTrack], this);
                }
                delay = 2000;  
            break;

            case 7 :
                this.scoutGroup.spawn(660, -50, this, scoutSpeed, 30, 0, 0, 1, 0, 2);
                if (wave == null) {
                    this.spawn = this.time.delayedCall(300, this.spawnWave, [tempTrack], this);
                    this.spawn = this.time.delayedCall(600, this.spawnWave, [tempTrack], this);
                }
                delay = 2000;  
            break;

            case 8 :
                this.scoutGroup.spawn(540, -50, this, scoutSpeed, 30, 0, 0, 1, 0, 2);
                if (wave == null) {
                    this.spawn = this.time.delayedCall(300, this.spawnWave, [tempTrack], this);
                    this.spawn = this.time.delayedCall(600, this.spawnWave, [tempTrack], this);
                }
                delay = 2000;  
            break;

            //#endregion tracking scouts

            case 9 :
                this.heavyGroup.spawn(540, -100, this, heavySpeed, -1.4, 0, 0, 6, 1);
                this.spawn = this.time.delayedCall(2000, () => {//I'm sorry for whoever has to look at this
                    this.scoutGroup.spawn(300, -50, this, scoutSpeed + 200, 20, 10, -4.5, 1, 0, 3);
                }, null, this);
                this.spawn = this.time.delayedCall(2300, () => {
                    this.scoutGroup.spawn(300, -50, this, scoutSpeed + 200, 20, 10, -4.5, 0, 1, 3);
                }, null, this);
                this.spawn = this.time.delayedCall(2600, () => {
                    this.scoutGroup.spawn(300, -50, this, scoutSpeed + 200, 20, 10, -4.5, 1, 0, 3);
                }, null, this);
                this.spawn = this.time.delayedCall(6100, () => {
                    this.scoutGroup.spawn(780, -50, this, scoutSpeed + 200, 20, -10, 4.5, 1, 0, 3);
                }, null, this);
                this.spawn = this.time.delayedCall(6400, () => {
                    this.scoutGroup.spawn(780, -50, this, scoutSpeed + 200, 20, -10, 4.5, 0, 1, 3);
                }, null, this);
                this.spawn = this.time.delayedCall(6700, () => {
                    this.scoutGroup.spawn(780, -50, this, scoutSpeed + 200, 20, -10, 4.5, 1, 0, 3);
                }, null, this);
                this.spawn = this.time.delayedCall(10200, () => {
                    this.scoutGroup.spawn(300, -50, this, scoutSpeed + 200, 20, 10, -4.5, 1, 0, 3);
                }, null, this);
                this.spawn = this.time.delayedCall(10500, () => {
                    this.scoutGroup.spawn(300, -50, this, scoutSpeed + 200, 20, 10, -4.5, 0, 1, 3);
                }, null, this);
                this.spawn = this.time.delayedCall(10800, () => {
                    this.scoutGroup.spawn(300, -50, this, scoutSpeed + 200, 20, 10, -4.5, 1, 0, 3);
                }, null, this);
                delay = 16000;
            break;

            case 10 :
                //this.scoutGroup.spawn(320, -50, this, scoutSpeed, 10, 0, -1, 1, 0.5);
                delay = 0;
                this.spawnTrack = startTrack-1;
            break;

            default :
                console.log("spawn error");
        }
        if (wave == null) {
            this.spawnTrack++;

            // repeat the wave for testing
            this.spawn = this.time.delayedCall(delay, this.spawnWave, null, this);
        }
    }

    angToPlayer(x, y) {
        var ang = Phaser.Math.Angle.BetweenPoints({x: x, y: y}, {x: this.player.x, y: this.player.y});
        ang = Phaser.Math.RadToDeg(ang);
        return ang;
    }

    spawnBasic(x, y, scene, angle) {
        if (angle == null) {
            this.basicBulletGroup.shootBullet(x, y, scene, this.angToPlayer(x, y), 1);
        } else {
            this.basicBulletGroup.shootBullet(x, y, scene, angle, 1);
        }
    }

    spawnFast(x, y, scene, angle) {
        if (angle == null) {
            this.fastBulletGroup.shootBullet(x, y, scene, this.angToPlayer(x, y));
        } else {
            this.fastBulletGroup.shootBullet(x, y, scene, angle);
        }
    }

    spawnCircle(x, y, scene, number, angle) {
        if (angle == null) {
            for (let index = 0; index < number; index++) {
                this.basicBulletGroup.shootBullet(x, y, scene, this.angToPlayer(x, y) + index * 360 / number);
            }
        } else {
            for (let index = 0; index < number; index++) {
                this.basicBulletGroup.shootBullet(x, y, scene, angle + index * 360 / number);
            }
        }
    }

    spawnHeavy(x, y, scene, angle) {
        if (angle == null) {
            this.basicBulletGroup.shootBullet(x, y, scene, this.angToPlayer(x, y), 2);
        } else {
            this.basicBulletGroup.shootBullet(x, y, scene, angle, 2);
        }
    }

    spawnHeavyKids(obj, scene) {
        this.basicBulletGroup.shootBullet(obj.x, obj.y, scene, obj.angle + 90, 3);
        this.basicBulletGroup.shootBullet(obj.x, obj.y, scene, obj.angle - 90, 3);
    }

    spawnTrail(obj, scene) {
        this.basicBulletGroup.shootBullet(obj.x, obj.y, scene, obj.angle + 150, 1);
        this.basicBulletGroup.shootBullet(obj.x, obj.y, scene, obj.angle - 150, 1);
        console.log("test");
    }

    spawnPickup(x, y, power, ammo) {
        var spawnCode = this.spawnAmmo(x, y, ammo);
        if (spawnCode == -1){
            if (power <= 1) {
                if (Phaser.Math.Between(0, 1) <= power) {
                    this.spawnPower(x, y, power, true);
                }
            } else {
                this.spawnPower(x, y, power, false);
            }
        } else {
            this.spawnPower(x, y, power + spawnCode, true);
        }
    }

    spawnAmmo(x, y, chance) {
        if (chance > 0) {
            if(this.ammo < this.maxAmmo) {
                if (Phaser.Math.Between(0, 1) <= chance) {
                    this.ammoGroup.spawn(Phaser.Math.Between(-10, 10) + x,Phaser.Math.Between(-10, 10) + y);
                }
            } else {
                return 1;
            }
        }
        return -1;
    }

    spawnPower(x, y, amount, center) {
        var randAngOffset = Phaser.Math.Between(0, 360);
        if (amount > 1 || center == false) {
            for (let index = 0; index < amount; index++) {
                var angle = Phaser.Math.DegToRad(Phaser.Math.Between(-20, 20) + (360/amount) * index + randAngOffset);
                var distance = Phaser.Math.Between(10, 40) + amount * 4;
    
                this.powerGroup.spawn(Math.cos(angle) * distance + x, Math.sin(angle) * distance + y);
            }
        } else {
            this.powerGroup.spawn(Phaser.Math.Between(-10, 10) + x,Phaser.Math.Between(-10, 10) + y);
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

                // damage tween

                this.tweens.addCounter({

                    from: 0,
                    to: 10,
                    duration: 50,
                    ease: Phaser.Math.Easing.Linear,
                    loop: 1,
                    yoyo: true,
                    onUpdate: tween => {
    
                        this.healthValue = tween.getValue();

                        for (let i = 0; i < 3; i++) {
                            
                            this.livesArray[i].x = this.healthOrigins[i] + this.healthValue;
                            this.damagedArray[i].x = this.healthOrigins[i] + this.healthValue;

                        }
                                
                    }

                }); 

            }
            this.playerHitSfx.play();
            this.noAmmoSfx.play();
            this.livesArray[this.lives].destroy();
            this.damagedArray[this.lives].alpha = 1;
            this.lives--;
            this.livesArray.pop;
        }
    }

    closestGroup(group) {
        var active = group.getMatching('active', true)
        for (var i = 0; i < active.length; ++i) {
            if (active[i].x + active[i].width/2 > 180 && active[i].x - active[i].width/2 < game.config.width - 360) {
                this.closestChild(active[i]);
            }
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