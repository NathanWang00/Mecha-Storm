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
let playerSpeed = 375;