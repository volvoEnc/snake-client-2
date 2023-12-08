import { socket } from '../../main';
import SpeedRun from './SpeedRun';
import MapState from '../State/MapState';
import MainScene from '../scenes/MainScene';
import { snakeBody, snakeBodyItem } from '../types/map';
import Phaser from 'phaser';

export default class Snake {
  protected body: snakeBody[] = [];
  protected drawBody: snakeBodyItem[] = [];
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

  constructor(scene: MainScene, playerID: string, body: snakeBody[], color: string) {
    this.body = body;
    this.scene = scene;
    this.color = color;
    this.playerId = playerID;

    this.speedBonus = new SpeedRun(playerID, this);

    this.drawBody = this.createBody(body);

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
  }

  updateBody(body: snakeBody[]) {
    let index = 0;
    const bodyGroups: {
      up: any;
      down: any;
      left: any;
      right: any;
    } = {
      up: [],
      down: [],
      left: [],
      right: [],
    };
    for (const bodyItem of body) {
      const drawBodyItem = this.drawBody[index].item;
      const oldBodyItem = this.body[index];
      if (!drawBodyItem) {
        continue;
      }

      // Вычисляем направление анимации
      if (oldBodyItem) {
        const diffX = oldBodyItem.x - bodyItem.x;
        const diffY = oldBodyItem.y - bodyItem.y;

        // Right
        if (diffX === -1) {
          bodyGroups.right.push(this.drawBody[index].item);
        }
        if (diffX === 1) {
          bodyGroups.left.push(this.drawBody[index].item);
        }
        if (diffY === 1) {
          bodyGroups.up.push(this.drawBody[index].item);
        }
        if (diffY === -1) {
          bodyGroups.down.push(this.drawBody[index].item);
        }
      }
      index++;
    }
    const speed = 250;
    this.scene.tweens.add({
      targets: bodyGroups.right,
      ease: 'Linear',
      duration: speed,
      x: `+=${this.scene.ceilWidth}`,
    });
    this.scene.tweens.add({
      targets: bodyGroups.left,
      ease: 'Linear',
      duration: speed,
      x: `-=${this.scene.ceilWidth}`,
    });
    this.scene.tweens.add({
      targets: bodyGroups.up,
      ease: 'Linear',
      duration: speed,
      y: `-=${this.scene.ceilHeight}`,
    });
    this.scene.tweens.add({
      targets: bodyGroups.down,
      ease: 'Linear',
      duration: speed,
      y: `+=${this.scene.ceilHeight}`,
    });
    setTimeout(() => {
      for (let i = 0; i < body.length; i++) {
        const bodyItem = body[i];
        const drawBodyItem = this.drawBody[i].item;
        // Перемещаем видимые элементы
        if (drawBodyItem) {
          drawBodyItem.setX(this.getXCord(bodyItem.x));
          drawBodyItem.setY(this.getYCord(bodyItem.y));
        }
      }
    }, speed);

    this.body = body;
  }

  update() {
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

  protected createBody(body: snakeBody[]) {
    let idx = 0;
    const bodyItems: snakeBodyItem[] = [];
    for (const bodyItem of body) {
      // make item
      const bodyDrawItem: snakeBodyItem = {
        x: bodyItem.x,
        y: bodyItem.y,
        item: null,
      };

      bodyDrawItem.item = this.scene.add
        .circle(0, 0, 12, parseInt(this.color))
        .setOrigin(0.5)
        .setScale(1 - 0.01 * idx);
      if (idx === 0 && this.playerId === MapState.getInstance().getUserid()) {
        this.scene.cameras.main.startFollow(bodyDrawItem.item, true);
      }

      // if (bodyCeil.ceil === null) {
      //   bodyCeil.ceil =
      //   if () {

      //     bodyCeil.ceil.setStrokeStyle(1, 0x000000);
      //   }
      //   if (idx === 0) {
      //     bodyCeil.ceil.setStrokeStyle(3, 0x000000);
      //   }
      // }
      const x = this.getXCord(bodyDrawItem.x);
      const y = this.getYCord(bodyDrawItem.y);
      bodyDrawItem.item.x = x;
      bodyDrawItem.item.y = y;
      idx++;

      bodyItems.push(bodyDrawItem);
    }

    return bodyItems;
  }

  protected getXCord(x: number): number {
    return x * this.scene.ceilWidth + this.scene.ceilWidth / 2;
  }
  protected getYCord(y: number): number {
    return y * this.scene.ceilHeight + this.scene.ceilHeight / 2;
  }

  destroy() {
    // for (const bodyCeil of this.body) {
    //   if (bodyCeil.ceil !== undefined) {
    //     bodyCeil.ceil.destroy(true);
    //   }
    // }
  }
}
