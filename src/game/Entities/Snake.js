import {socket} from "../../main.js";
import SpeedRun from "./SpeedRun.js";

export default class Snake {
    body = [];
    direction = 'up';
    speed = 200;

    speedBonus;

    constructor(scene, playerID, body, color) {
        this.body = body;
        this.scene = scene;
        this.color = color;
        this.playerID = playerID;

        this.speedBonus = new SpeedRun(playerID, this);

        console.log(this.playerID)
        console.log(this.scene.playerID)
        console.log(this.scene.playerID === this.playerID)

        if(this.scene.playerID === this.playerID) {
            this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this.keyWDown = false;
            this.keySDown = false;
            this.keyADown = false;
            this.keyDDown = false;
            this.keySpaceDown = false;
        }

        socket.on('direction', (dir) => {
            this.direction = dir;
        });
    }

    updateBody(body) {
        this.destroy()

        this.body = body;
        this.draw();

        if (this.speedBonus.getBonusActive()) {
            this.speed = 100;
        } else {
            this.speed = 200;
        }

        for (const bodyCeil of this.body) {
            const bodyGroups = {
                up: [],
                down: [],
                left: [],
                right: []
            };
            if (bodyCeil.ceil) {
                switch (bodyCeil.d) {
                    case 'up':
                        bodyCeil.ceil.y += this.scene.height;
                        bodyGroups.up.push(bodyCeil.ceil);
                        break;
                    case 'down':
                        bodyCeil.ceil.y -= this.scene.height;
                        bodyGroups.down.push(bodyCeil.ceil);
                        break;
                    case 'left':
                        bodyCeil.ceil.x += this.scene.width;
                        bodyGroups.left.push(bodyCeil.ceil);
                        break;
                    case 'right':
                        bodyCeil.ceil.x -= this.scene.width;
                        bodyGroups.right.push(bodyCeil.ceil);
                        break;
                }
            }

            this.scene.tweens.add({
                targets: bodyGroups.up,
                ease: 'Linear',
                duration: this.speed,
                y: `-=${this.scene.height}`
            });
            this.scene.tweens.add({
                targets: bodyGroups.down,
                ease: 'Linear',
                duration: this.speed,
                y: `+=${this.scene.height}`
            });
            this.scene.tweens.add({
                targets: bodyGroups.left,
                ease: 'Linear',
                duration: this.speed,
                x: `-=${this.scene.width}`
            });
            this.scene.tweens.add({
                targets: bodyGroups.right,
                ease: 'Linear',
                duration: this.speed,
                x: `+=${this.scene.width}`
            });
        }
    }

    update() {
        let direction = this.direction

        //
        if(this.keyW.isDown && !this.keyWDown) {
            direction = 'up'
            this.keyWDown = true;
        }

        if(this.keyW.isUp && this.keyWDown) {
            this.keyWDown = false;
        }

        //
        if(this.keyS.isDown && !this.keySDown) {
            direction = 'down'
            this.keySDown = true;
        }

        if(this.keyS.isUp && this.keySDown) {
            this.keySDown = false;
        }

        //
        if(this.keyA.isDown && !this.keyADown) {
            direction = 'left'
            this.keyADown = true;
        }

        if(this.keyA.isUp && this.keyADown) {
            this.keyADown = false;
        }

        //
        if(this.keyD.isDown && !this.keyDDown) {
            direction = 'right'
            this.keyDDown = true;
        }

        if(this.keyD.isUp && this.keyDDown) {
            this.keyDDown = false;
        }

        if (this.direction !== direction) {
            socket.emit('direction', {
                id: this.playerID,
                direction: direction
            })
            this.direction = direction
        }

        // Ускорение нажато
        if (this.keySpace.isDown && !this.keySpaceDown) {
            this.keySpaceDown = true;
            this.speedBonus.activate();
        }
        if (this.keySpace.isUp && this.keySpaceDown) {
            this.keySpaceDown = false;
        }
    }

    draw() {
        let idx = 0;
        for (const bodyCeil of this.body) {
            if (bodyCeil.ceil === undefined) {
                bodyCeil.ceil = this.scene.add.circle(0, 0, 12, parseInt(this.color)).setOrigin(0.5).setScale(1 - (0.01 * idx));
                if(this.scene.playerID === this.playerID) {
                    bodyCeil.ceil.setStrokeStyle(1, 0x000000)
                }
                if (idx === 0) {
                    bodyCeil.ceil.setStrokeStyle(3, 0x000000)
                }
            }
            const x = bodyCeil.mx * this.scene.width + (this.scene.width / 2);
            const y = bodyCeil.my * this.scene.height + (this.scene.height / 2);
            bodyCeil.ceil.x = x;
            bodyCeil.ceil.y = y;
            idx++;
        }
    }

    destroy() {
        for (const bodyCeil of this.body) {
            if (bodyCeil.ceil !== undefined) {
                bodyCeil.ceil.destroy(true)
            }
        }
    }
}