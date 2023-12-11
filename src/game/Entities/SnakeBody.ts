import Phaser from 'phaser';
import MainScene from '../scenes/MainScene';
import { ceilPhysicalHeight, ceilPhysicalWidth } from '../../main';

export default class SnakeBody {
  // Следующий элемент тела змеи
  protected readonly nextItem: SnakeBody | null;

  protected readonly scene: MainScene;

  // Положение в клетках по X
  protected mX: number;

  // Положение в клетках по Y
  protected mY: number;

  // Направление движения элемента змеи
  protected direction: string;

  public index: number;

  public background: Phaser.GameObjects.Rectangle;
  public sprite: Phaser.GameObjects.Sprite;

  protected readonly TEXTURES = {
    head: {
      default: 'head1',
      rotate: 'head1',
    },
    tail: {
      default: 'tail1',
      rotate: 'tail2',
    },
    body: {
      default: 'body2',
      rotate: 'body1',
    },
  };
  constructor(
    scene: MainScene,
    x: number,
    y: number,
    texture: string,
    next: SnakeBody | null,
    mX: number,
    mY: number,
    direction: string,
    index: number,
    color: number,
  ) {
    this.nextItem = next;
    this.scene = scene;

    this.mX = mX;
    this.mY = mY;
    this.direction = direction;
    this.index = index;

    this.background = scene.add.rectangle(x, y, 32, 16, color);
    this.background.setDepth(1);
    this.sprite = scene.add.sprite(x, y, texture);
    this.sprite.addToUpdateList();
    this.sprite.setDepth(2);
  }

  public setDirection(direction: string): void {
    this.direction = direction;
  }

  public setMx(mX: number) {
    this.mX = mX;
  }

  public setMy(mY: number) {
    this.mY = mY;
  }

  protected checkDiffDirection(): number | null {
    if (!this.nextItem) {
      return null;
    }
    const nextItemDirection = this.nextItem.direction;
    if (this.direction === 'right' && nextItemDirection === 'up') {
      return 180;
    }
    if (this.direction === 'up' && nextItemDirection === 'right') {
      return 0;
    }

    if (this.direction === 'right' && nextItemDirection === 'down') {
      return 90;
    }
    if (this.direction === 'down' && nextItemDirection === 'right') {
      return 270;
    }

    if (this.direction === 'left' && nextItemDirection === 'up') {
      return 270;
    }
    if (this.direction === 'up' && nextItemDirection === 'left') {
      return 90;
    }

    if (this.direction === 'left' && nextItemDirection === 'down') {
      return 0;
    }
    if (this.direction === 'down' && nextItemDirection === 'left') {
      return 180;
    }

    return null;
  }

  public appendIndex(): void {
    this.index++;
  }

  public handleTexture(): void {
    let type: string = 'body';
    let variant: string = 'default';
    const rotateAngle = this.checkDiffDirection();
    let angle = 0;

    // Определяем вид элемента (голова, тело, хвост)
    if (this.index === 0) {
      type = 'tail';
    }
    if (!this.nextItem) {
      type = 'head';
    }

    // Определяем вариант текстуры (обычная, с изгибом)
    if (rotateAngle !== null) {
      variant = 'rotate';
    }

    if (!rotateAngle) {
      if (this.direction === 'right') {
        angle = 0;
      } else if (this.direction === 'down') {
        angle = 90;
      } else if (this.direction === 'left') {
        angle = 180;
      } else if (this.direction === 'up') {
        angle = 270;
      }
    }

    this.background.setVisible(variant === 'default' && type === 'body');

    this.background.setAngle(rotateAngle ?? angle);
    this.background.setX(this.sprite.x);
    this.background.setY(this.sprite.y);

    const texture = this.TEXTURES[type][variant];
    this.sprite.setTexture(texture);
    this.sprite.setAngle(rotateAngle ?? angle);

    if (this.nextItem) {
      this.nextItem.handleTexture();
    }
  }

  public dead() {
    this.scene.add.particles(this.mX * ceilPhysicalWidth, this.mY * ceilPhysicalHeight, 'body2', {
      speed: { min: 35, max: 75 },
      quantity: 5,
      lifespan: { min: 250, max: 400 },
      duration: 150,
      scale: 0.25,
    });
  }
}
