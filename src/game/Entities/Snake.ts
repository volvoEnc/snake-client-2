import { socket } from '../../main';
import SpeedRun from './SpeedRun';
import MapState from '../State/MapState';
import MainScene from '../scenes/MainScene';
import { snakeBody, snakeBodyItem } from '../types/map';
import Phaser from 'phaser';
import SnakeBody from './SnakeBody';

export default class Snake {
  protected body: snakeBody[] = [];
  protected drawBody: snakeBodyItem[] = [];
  protected direction: string = 'up';
  protected speed = 200;

  protected speedBonus: SpeedRun;
  protected scene: MainScene;
  protected color: number;
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

  constructor(scene: MainScene, playerID: string, body: snakeBody[], color: number) {
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
          drawBodyItem.setDirection('right');
        }
        if (diffX === 1) {
          bodyGroups.left.push(this.drawBody[index].item);
          drawBodyItem.setDirection('left');
        }
        if (diffY === 1) {
          bodyGroups.up.push(this.drawBody[index].item);
          drawBodyItem.setDirection('up');
        }
        if (diffY === -1) {
          bodyGroups.down.push(this.drawBody[index].item);
          drawBodyItem.setDirection('down');
        }
      }
      index++;
    }
    for (let i = 0; i < body.length; i++) {
      const bodyItem = body[i];
      const drawBodyItem = this.drawBody[i].item;
      // Перемещаем видимые элементы
      if (drawBodyItem) {
        drawBodyItem.sprite.setX(this.getXCord(bodyItem.x));
        drawBodyItem.sprite.setY(this.getYCord(bodyItem.y));
      }
    }
    this.drawBody[this.drawBody.length - 1].item?.handleTexture();

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
    let nextItem: SnakeBody | null = null;
    const bodyItems: snakeBodyItem[] = [];
    for (const bodyItem of body) {
      // make item
      const bodyDrawItem: snakeBodyItem = {
        x: bodyItem.x,
        y: bodyItem.y,
        item: null,
      };
      bodyDrawItem.item = new SnakeBody(
        this.scene,
        this.getXCord(bodyDrawItem.x),
        this.getYCord(bodyDrawItem.y),
        'body1',
        nextItem,
        bodyItem.x,
        bodyItem.y,
        'up',
        body.length - idx - 1,
        this.color,
      );
      nextItem = bodyDrawItem.item;
      if (idx === 0 && this.playerId === MapState.getInstance().getUserid()) {
        this.scene.cameras.main.startFollow(bodyDrawItem.item.sprite, true, 0.005, 0.005);
      }

      idx++;
      bodyItems.push(bodyDrawItem);
    }

    return bodyItems;
  }

  protected getXCord(x: number): number {
    const ceilWidth = this.scene.ceilWidth / 2;
    return x * ceilWidth + ceilWidth / 2;
  }
  protected getYCord(y: number): number {
    const ceilHeight = this.scene.ceilHeight / 2;
    return y * ceilHeight + ceilHeight / 2;
  }

  destroy() {
    // for (const bodyCeil of this.body) {
    //   if (bodyCeil.ceil !== undefined) {
    //     bodyCeil.ceil.destroy(true);
    //   }
    // }
  }
}
