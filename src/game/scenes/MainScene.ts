import Phaser from 'phaser';
import Snake from '../Entities/Snake';
import Eat from '../Entities/Eat';
import { MapItemTypeEnum, roomData } from '../types/map';
import MapState from '../State/MapState';
import { socket } from '../../main';
import Bullet from '../Entities/Bullet';

export default class MainScene extends Phaser.Scene {
  public readonly ceilWidth: number = 32;
  public readonly ceilHeight: number = 32;

  protected roomData: roomData | null = null;

  protected snakes: Snake[] = [];
  protected eats: Eat[] = [];
  protected bullets: Bullet[] = [];

  constructor() {
    super({ key: 'MainScene', active: true });
    this.roomData = MapState.getInstance().getMapData();
  }

  preload() {
    this.load.image('tiles', 'map.png');
    this.load.image('body1', 'snake/body1.png');
    this.load.image('body2', 'snake/body2.png');
    this.load.image('tail1', 'snake/tail1.png');
    this.load.image('tail2', 'snake/tail2.png');
    this.load.image('head1', 'snake/head1.png');
    this.load.image('bulletParticle', 'particles/bulletParticle.png');
    this.load.tilemapTiledJSON('map', 'map.json');
  }

  create() {
    if (!this.roomData) {
      return;
    }

    // this.scale.setZoom(0.8);
    this.cameras.main.setBounds(
      0,
      0,
      this.ceilWidth * this.roomData.map.width,
      this.ceilHeight * this.roomData.map.height,
    );

    const tilemap = this.make.tilemap({ key: 'map' });
    const tiles = tilemap.addTilesetImage('map', 'tiles');

    if (!tiles) {
      return;
    }

    const layer = tilemap.createBlankLayer(
      'background',
      tiles,
      0,
      0,
      this.roomData.map.width,
      this.roomData.map.height,
    );
    if (!layer) {
      return;
    }

    // Создаем карту
    for (const ceil of this.roomData.map.items) {
      layer.fill(ceil.texture, ceil.x, ceil.y, 1, 1);
    }
    // Создаем карту коллизий
    for (const item of this.roomData.map.physicalItems) {
      const ceilWidth = this.ceilWidth / 2;
      const ceilHeight = this.ceilHeight / 2;
      const ceil = this.add.rectangle(
        ceilWidth * item.x,
        ceilHeight * item.y,
        ceilWidth,
        ceilHeight,
      );
      let strokeColor = 0x000;
      if (item.type === MapItemTypeEnum.SOLID) {
        strokeColor = 0xeb4034;
      }
      ceil.setStrokeStyle(1, strokeColor, 0).setOrigin(0, 0);
    }

    // Создаем змеек
    for (const player of this.roomData.players) {
      this.snakes.push(new Snake(this, player.id, player.snake.body, player.snake.color));
    }

    socket.on('joined-player', (player) => {
      this.snakes.push(new Snake(this, player.id, player.snake.body, player.snake.color));
    });
    socket.on('delete-bullet', (data: { id: string }) => {
      const bulletIndex = this.bullets.findIndex((bullet) => bullet.id === data.id);
      if (bulletIndex) {
        const bullet = this.bullets[bulletIndex];
        bullet.destroy();
        this.bullets.splice(bulletIndex, 1);
      }
    });
    socket.on('delete-player', (data: { id: string }) => {
      const deletePlayerIndex = this.snakes.findIndex((snake) => snake.playerId === data.id);
      if (deletePlayerIndex) {
        const snake = this.snakes[deletePlayerIndex];
        snake.destroy();
        this.bullets.splice(deletePlayerIndex, 1);
      }
    });
    socket.on('dead', (data: { id: string }) => {
      const snake = this.snakes.find((snake) => snake.playerId === data.id);
      if (snake) {
        snake.dead();
      }
    });
    socket.on('respawn', (data: { id: string }) => {
      const snake = this.snakes.find((snake) => snake.playerId === data.id);
      if (snake) {
        snake.respawn();
      }
    });
    socket.on('step', (data: roomData) => {
      data.bullets.forEach((bullet) => {
        const candidate = this.bullets.find((oBullet) => oBullet.id === bullet.id);

        if (!candidate) {
          const newBullet = new Bullet(
            this,
            bullet.x,
            bullet.y,
            bullet.id,
            bullet.color,
            bullet.direction,
          );
          this.bullets.push(newBullet);
        } else {
          candidate.serverUpdate(bullet);
        }
      });
      data.players.forEach((player) => {
        const candidate = this.snakes.find((snake) => snake.playerId === player.id);
        if (candidate) {
          candidate.updateBody(player.snake.body);
        }
      });
    });
  }

  update(time: number, delta: number) {
    this.snakes.forEach((snake) => {
      const playerId = MapState.getInstance().getUserid();
      if (playerId && playerId === snake.playerId) {
        snake.update();
      }
    });
    super.update(time, delta);
  }
}
