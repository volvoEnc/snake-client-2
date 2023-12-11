import { ceilPhysicalHeight, ceilPhysicalWidth } from '../../main';
import MainScene from '../scenes/MainScene';
import Phaser from 'phaser';

export default class Eat {
  radius = 8;
  protected readonly scene: MainScene;
  protected readonly id: string;
  protected readonly mX: number;
  protected readonly mY: number;

  protected readonly sprite: Phaser.GameObjects.Shape;
  constructor(scene: MainScene, id: string, mx: number, my: number) {
    this.scene = scene;
    this.id = id;
    this.mX = mx;
    this.mY = my;

    this.sprite = this.scene.add
      .circle(this.mX * ceilPhysicalWidth, this.mY * ceilPhysicalHeight, 8, 0x49ff03)
      .setOrigin(0.5)
      .setStrokeStyle(1, 0x000000);
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
    this.sprite.destroy(true);
  }
}
