// 120 Bullet Hell (temp) by Team Radicool Dragonfire Ninjas
// Made for the AGPM and CMPM 120-1 classes, section E
// By Liam Booher, Ashley Chapp, Ethan Tung, and Nathan Wang


let config = {
    type: Phaser.CANVAS,
    width: 1080,
    height: 720,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    },
    /*fps: {
        target: 60,
        forceSetTimeOut: true
    },*/
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);
let playerSpeed = 560;
let swordSpeed = 700;
let swingSpeed = 350;
let tracerSpeed = 2000;
let baseDamage = 150;
let tracerDamage = 500;
let lives = 2;
let focusModifier = 0.6;
let gunFollowSpeed = 400;
let gunFocusSpeed = 800;
let baseAmmo = 5;
let swordDecay = 15;
let powerIncrease = 0.2;

let scoutHealth = 50;
let basicBulletSpeed = 250;

/* 

NOTES FOR THE GRADERS OF CMPM-120-1, PROFESSOR ADAM SMITH:

- Used the "rexbullet and rexmoveto plugin" by Rex under the MIT License. Source: https://github.com/rexrainbow/phaser3-rex-notes/


*/