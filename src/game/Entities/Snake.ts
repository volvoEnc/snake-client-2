import { socket } from '../../main';
import SpeedRun from './SpeedRun';
import MapState from '../State/MapState';
import MainScene from '../scenes/MainScene';
import { snakeBody } from '../types/map';
import Phaser from 'phaser';

export default class Snake {
  protected body: snakeBody[] = [];
  protected direction: string = 'up';
  protected speed = 200;

  protected speedBonus: SpeedRun;
  protected scene: MainScene;
  protected color: string;
  public playerId: string;

  protected keySpace: Phaser.Input.Keyboard.Key | null = null;
  protected keyW: Phaser.Input.Keyboard.Key | null = null;
  protected keyS: Phaser.Input.Keyboard.Key | null = null;
  protected keyD: Phaser.Input.Keyboard.Key | null = null;
  protected keyA: Phaser.Input.Keyboard.Key | null = null;

  protected keyWDown = false;
  protected keySDown = false;
  protected keyADown = false;
  protected keyDDown = false;
  protected keySpaceDown = false;

  // protected sceneWidth: number;
  // protected sceneHeight: number;

  constructor(scene: MainScene, playerID: string, body: snakeBody[], color: string) {
    // this.sceneWidth = MapState.getInstance().getMapData()?.map.width ?? 0;
    // this.sceneHeight = MapState.getInstance().getMapData()?.map.height ?? 0;
    this.body = body;
    this.scene = scene;
    this.color = color;
    this.playerId = playerID;

    this.speedBonus = new SpeedRun(playerID, this);

    if (MapState.getInstance().getUserid() === this.playerId) {
      if (scene.input.keyboard) {
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      }
    }

    socket.on('direction', (dir: string) => {
      this.direction = dir;
    });

    // this.updateBody();
    this.draw();
  }

  updateBody(body: snakeBody[]) {
    this.destroy();

    this.body = body;
    this.draw();

    if (this.speedBonus.getBonusActive()) {
      this.speed = 100;
    } else {
      this.speed = 200;
    }

    for (const bodyCeil of this.body) {
      const bodyGroups: {
        up: snakeBody[];
        down: snakeBody[];
        left: snakeBody[];
        right: snakeBody[];
      } = {
        up: [],
        down: [],
        left: [],
        right: [],
      };
      if (bodyCeil.ceil) {
        switch (bodyCeil.direction) {
          case 'up':
            bodyCeil.y += this.scene.ceilHeight;
            bodyGroups.up.push(bodyCeil.ceil);
            break;
          case 'down':
            bodyCeil.y -= this.scene.ceilHeight;
            bodyGroups.down.push(bodyCeil.ceil);
            break;
          case 'left':
            bodyCeil.x += this.scene.ceilWidth;
            bodyGroups.left.push(bodyCeil.ceil);
            break;
          case 'right':
            bodyCeil.x -= this.scene.ceilWidth;
            bodyGroups.right.push(bodyCeil.ceil);
            break;
        }
      }

      this.scene.tweens.add({
        targets: bodyGroups.up,
        ease: 'Linear',
        duration: this.speed,
        y: `-=${this.scene.ceilHeight}`,
      });
      this.scene.tweens.add({
        targets: bodyGroups.down,
        ease: 'Linear',
        duration: this.speed,
        y: `+=${this.scene.ceilHeight}`,
      });
      this.scene.tweens.add({
        targets: bodyGroups.left,
        ease: 'Linear',
        duration: this.speed,
        x: `-=${this.scene.ceilWidth}`,
      });
      this.scene.tweens.add({
        targets: bodyGroups.right,
        ease: 'Linear',
        duration: this.speed,
        x: `+=${this.scene.ceilWidth}`,
      });
    }
  }

  update() {
    console.log('123');
    let direction = this.direction;

    //
    if (this.keyW && this.keyW.isDown && !this.keyWDown) {
      direction = 'up';
      this.keyWDown = true;
    }

    if (this.keyW && this.keyW.isUp && this.keyWDown) {
      this.keyWDown = false;
    }

    //
    if (this.keyS && this.keyS.isDown && !this.keySDown) {
      direction = 'down';
      this.keySDown = true;
    }

    if (this.keyS && this.keyS.isUp && this.keySDown) {
      this.keySDown = false;
    }

    //
    if (this.keyA && this.keyA.isDown && !this.keyADown) {
      direction = 'left';
      this.keyADown = true;
    }

    if (this.keyA && this.keyA.isUp && this.keyADown) {
      this.keyADown = false;
    }

    //
    if (this.keyD && this.keyD.isDown && !this.keyDDown) {
      direction = 'right';
      this.keyDDown = true;
    }

    if (this.keyD && this.keyD.isUp && this.keyDDown) {
      this.keyDDown = false;
    }

    if (this.direction !== direction) {
      socket.emit('direction', {
        id: this.playerId,
        direction: direction,
      });
      this.direction = direction;
    }

    // Ускорение нажато
    if (this.keySpace && this.keySpace.isDown && !this.keySpaceDown) {
      this.keySpaceDown = true;
      this.speedBonus.activate();
    }
    if (this.keySpace && this.keySpace.isUp && this.keySpaceDown) {
      this.keySpaceDown = false;
    }
  }

  draw() {
    let idx = 0;
    for (const bodyCeil of this.body) {
      if (bodyCeil.ceil === null) {
        bodyCeil.ceil = this.scene.add
          .circle(0, 0, 12, parseInt(this.color))
          .setOrigin(0.5)
          .setScale(1 - 0.01 * idx);
        if (this.playerId === MapState.getInstance().getUserid()) {
          bodyCeil.ceil.setStrokeStyle(1, 0x000000);
        }
        if (idx === 0) {
          bodyCeil.ceil.setStrokeStyle(3, 0x000000);
        }
      }
      const x = bodyCeil.x * this.scene.ceilWidth + this.scene.ceilWidth / 2;
      const y = bodyCeil.y * this.scene.ceilHeight + this.scene.ceilHeight / 2;
      bodyCeil.ceil.x = x;
      bodyCeil.ceil.y = y;
      idx++;
    }
  }

  destroy() {
    for (const bodyCeil of this.body) {
      if (bodyCeil.ceil !== undefined) {
        bodyCeil.ceil.destroy(true);
      }
    }
  }
}
