import { ceilPhysicalHeight, ceilPhysicalWidth } from '../../main';
import MainScene from '../scenes/MainScene';
import Phaser from 'phaser';

export default class Eat {
  protected readonly scene: MainScene;
  public readonly id: string;
  protected readonly mX: number;
  protected readonly mY: number;

  protected readonly sprite: Phaser.GameObjects.Image;
  constructor(scene: MainScene, id: string, mx: number, my: number) {
    this.scene = scene;
    this.id = id;
    this.mX = mx;
    this.mY = my;

    this.sprite = this.scene.add
      .image(this.mX * ceilPhysicalWidth, this.mY * ceilPhysicalHeight, 'food')
      .setOrigin(0, 0);
    this.scene.tweens.add({
      targets: this.sprite,
      ease: 'Linear',
      duration: 250,
      repeat: -1,
      scale: 1.2,
      yoyo: true,
    });
  }

  destroy() {
    this.scene.add.particles(this.mX * ceilPhysicalWidth, this.mY * ceilPhysicalHeight, 'food', {
      speed: { min: 35, max: 75 },
      quantity: 5,
      lifespan: { min: 250, max: 400 },
      duration: 150,
      scale: 0.5,
    });
    this.sprite.destroy(true);
  }
}
