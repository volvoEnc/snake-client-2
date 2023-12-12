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

  private keyboardBinds: Map<string, Phaser.Input.Keyboard.Key> | null = null;

  constructor(scene: MainScene, playerID: string, body: snakeBody[], color: number) {
    this.body = body;
    this.scene = scene;
    this.color = color;
    this.playerId = playerID;

    this.speedBonus = new SpeedRun(playerID, this);
    this.drawBody = this.createBody(body);
    this.rebuildBodyItems();

    if (MapState.getInstance().getUserid() === this.playerId) {
      if (scene.input.keyboard) {
        this.keyboardBinds = new Map();

        this.keyboardBinds.set(
          'space',
          scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        );
        this.keyboardBinds.set(
          'shift',
          scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
        );
        this.keyboardBinds.set('w', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
        this.keyboardBinds.set('s', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S));
        this.keyboardBinds.set('a', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A));
        this.keyboardBinds.set('d', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D));

        this.keyboardBinds.get('space')?.on('down', () => {
          // Выстрел
          socket.emit('shot');
        });
        this.keyboardBinds.get('shift')?.on('down', () => {
          // Ускорение
          this.speedBonus.activate();
        });

        this.keyboardBinds.get('w')?.on('down', () => {
          this.changeDirectionMove('up');
        });
        this.keyboardBinds.get('d')?.on('down', () => {
          this.changeDirectionMove('right');
        });
        this.keyboardBinds.get('s')?.on('down', () => {
          this.changeDirectionMove('down');
        });
        this.keyboardBinds.get('a')?.on('down', () => {
          this.changeDirectionMove('left');
        });
      }
    }
    socket.on('direction', (dir: string) => {
      this.direction = dir;
    });
  }

  updateBody(body: snakeBody[]) {
    if (body.length > this.drawBody.length) {
      const oldBodyItem = this.drawBody[this.drawBody.length - 1].item;
      if (oldBodyItem) {
        const newBodyItem = this.makeBodyItem(body[body.length - 1], body.length - 1);
        this.drawBody.push(newBodyItem);
        oldBodyItem.setNextItem(newBodyItem.item);
      }
    }
    if (body.length < this.drawBody.length) {
      for (let i = this.drawBody.length - 1; i > 0; i--) {
        if (i >= body.length) {
          this.drawBody[i].item?.destroy();
          this.drawBody.splice(i, 1);
        }
      }
      this.rebuildBodyItems();
    }

    let index = 0;
    for (const bodyItem of body) {
      const drawBodyItem = this.drawBody[index]?.item;
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
          drawBodyItem.setDirection('right');
        }
        if (diffX === 1) {
          drawBodyItem.setDirection('left');
        }
        if (diffY === 1) {
          drawBodyItem.setDirection('up');
        }
        if (diffY === -1) {
          drawBodyItem.setDirection('down');
        }
      }
      index++;
    }
    for (let i = 0; i < body.length; i++) {
      const bodyItem = body[i];
      const drawBodyItem = this.drawBody[i]?.item ?? null;
      // Перемещаем видимые элементы
      if (drawBodyItem) {
        drawBodyItem.setMx(bodyItem.x);
        drawBodyItem.setMy(bodyItem.y);
        drawBodyItem.sprite.setX(this.getXCord(bodyItem.x));
        drawBodyItem.sprite.setY(this.getYCord(bodyItem.y));
      }
    }
    this.drawBody[0].item?.handleTexture();

    this.body = body;
  }

  protected changeDirectionMove(direction: string): void {
    this.direction = direction;
    socket.emit('direction', {
      direction: direction,
    });
  }

  update() {}

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
      bodyDrawItem.item = new SnakeBody(
        this.scene,
        this.getXCord(bodyDrawItem.x),
        this.getYCord(bodyDrawItem.y),
        'body1',
        null,
        bodyItem.x,
        bodyItem.y,
        'up',
        idx,
      );
      if (idx === 0 && this.playerId === MapState.getInstance().getUserid()) {
        this.scene.cameras.main.startFollow(bodyDrawItem.item.sprite, true, 0.005, 0.005);
      }

      idx++;
      bodyItems.push(bodyDrawItem);
    }

    return bodyItems;
  }

  protected rebuildBodyItems() {
    for (let i = 0; i < this.drawBody.length; i++) {
      this.drawBody[i].item?.setNextItem(this.drawBody[i + 1]?.item ?? null);
    }
  }

  protected makeBodyItem(bodyItem: snakeBody, index: number) {
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
      null,
      bodyItem.x,
      bodyItem.y,
      'up',
      index,
    );
    return bodyDrawItem;
  }

  protected getXCord(x: number): number {
    const ceilWidth = this.scene.ceilWidth / 2;
    return x * ceilWidth + ceilWidth / 2;
  }
  protected getYCord(y: number): number {
    const ceilHeight = this.scene.ceilHeight / 2;
    return y * ceilHeight + ceilHeight / 2;
  }

  public dead() {
    this.scene.tweens.add({
      targets: [...this.drawBody.map((bodyItem) => bodyItem.item?.sprite)],
      duration: 500,
      ease: 'Linear',
      alpha: 0,
    });
    for (const bodyItem of this.drawBody) {
      bodyItem.item?.dead();
    }
    // for (let i = 0; i < this.drawBody.length; i++) {
    //   if (i > 5) {
    //     this.drawBody[i].item?.sprite.destroy(true);
    //     this.drawBody[i].item?.background.destroy(true);
    //   }
    // }
  }
  public respawn() {
    this.scene.tweens.add({
      targets: [...this.drawBody.map((bodyItem) => bodyItem.item?.sprite)],
      duration: 200,
      ease: 'Linear',
      alpha: 1,
    });
  }

  public destroy() {
    for (const bodyItem of this.drawBody) {
      bodyItem.item?.sprite.destroy(true);
    }
  }
}
