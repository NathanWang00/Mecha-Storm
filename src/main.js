// Mecha Storm by Team Radicool Dragonfire Ninjas
// Made for the AGPM and CMPM 120-1 classes, section E
// By Liam Booher, Ashley Chapp, Ethan Tung, and Nathan Wang


let config = {
    type: Phaser.WEBGL,
    width: 1080,
    height: 720,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
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
let swordSpeed = 600;
let swingSpeed = 350;
let tracerSpeed = 1900;
let baseDamage = 150;
let tracerDamage = 225;
let lives = 2;
let focusModifier = 0.5;
let gunFollowSpeed = 400;
let gunFocusSpeed = 800;
let baseAmmo = 7;
let swordDecay = 15;
let powerIncrease = 0.1;
let basePowerDecrease = 0.001;
let powerLoss = 0.0001;
let maxPowerLoss = 0.02;

let scoutHealth = 50;
let scoutSpeed = 200;
let maxScoutSpeed = 350;
let scoutPoints = 50;

let regularHealth = 500;
let regularSpeed = 150;
let regularPoints = 125;
let regularMinSpeed = 50;
let regularShootDelay = 25;
let regulatShootDelay2 = 3.25;

let heavyHealth = 1500;
let heavySpeed = 95;
let heavyPoints = 500;
let heavyShootDelay = 50;

let bbSpeed = 400;
let bbMin = 175;
let bbAccel = -50;

let fbSpeed = 700;
let fbMin = 50;
let fbAccel = 100;

//power upgrades
let pPlayerSpeed = 650;
let pSwingSpeed = 275;
let pSwordDamage = 200;
let pSwordSpeed = 775;
let pTracerSpeed = 3500;
let pTracerDamage = 350;

let debug = true;
let startTrack = 8;

/* 

NOTES FOR THE GRADERS OF CMPM-120-1, PROFESSOR ADAM SMITH:

- Used the "rexbullet and rexmoveto plugin" by Rex under the MIT License. Source: https://github.com/rexrainbow/phaser3-rex-notes/


*/