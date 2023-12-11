import Phaser from 'phaser';
import MainScene from '../scenes/MainScene';
import { IBullet } from '../types/map';
import { ceilPhysicalHeight, ceilPhysicalWidth } from '../../main';

export default class Bullet {
  protected readonly mX: number;
  protected readonly mY: number;
  protected readonly direction: string;
  public readonly id: string;

  protected sprite: Phaser.GameObjects.Shape;
  protected destroyParticles: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(
    scene: MainScene,
    mX: number,
    mY: number,
    id: string,
    color: number,
    direction: string,
  ) {
    this.mX = mX;
    this.mY = mY;
    this.id = id;
    this.direction = direction;

    this.sprite = scene.add
      .rectangle(mX * (scene.ceilWidth / 2), mY * (scene.ceilWidth / 2), 16, 8, color)
      .setAngle(this.directionToAngle(direction));

    this.destroyParticles = scene.add
      .particles(mX * ceilPhysicalWidth, mY * ceilPhysicalHeight, 'bulletParticle', {
        speed: { min: 35, max: 75 },
        quantity: 5,
        lifespan: { min: 250, max: 400 },
      })
      .stop();
  }
  public serverUpdate(bullet: IBullet) {
    this.sprite.setX(bullet.x * ceilPhysicalWidth);
    this.sprite.setY(bullet.y * ceilPhysicalHeight);
  }

  public destroy(): void {
    this.destroyParticles.setX(this.sprite.x);
    this.destroyParticles.setY(this.sprite.y);
    this.destroyParticles.start(0, 100);
    this.sprite.destroy(true);
  }

  protected directionToAngle(direction: string): number {
    switch (direction) {
      case 'up':
        return 270;
      case 'down':
        return 90;
      case 'left':
        return 180;
      case 'right':
        return 0;
    }
    return 0;
  }
}
