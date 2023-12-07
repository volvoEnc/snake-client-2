import Phaser from 'phaser';
import Snake from '../Entities/Snake';
import Eat from '../Entities/Eat';
import { roomData } from '../types/map';
import MapState from '../State/MapState';
import { socket } from '../../main.ts';

export default class MainScene extends Phaser.Scene {
  public readonly ceilWidth: number = 32;
  public readonly ceilHeight: number = 32;

  protected roomData: roomData | null = null;

  protected snakes: Snake[] = [];
  protected eats: Eat[] = [];

  constructor() {
    super({ key: 'MainScene', active: true });
    this.roomData = MapState.getInstance().getMapData();
  }

  preload() {
    this.load.image('tiles', 'map.png');
    this.load.tilemapTiledJSON('map', 'map.json');
  }

  create() {
    if (!this.roomData) {
      return;
    }
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

    // Создаем змеек
    for (const player of this.roomData.players) {
      this.snakes.push(new Snake(this, player.id, player.snake.body, player.snake.color));
    }

    // tilemap.fill(46, 0, 0, 1, 1);

    // this.eat = null;
    // this.reward = 0;
    // this.linesState = null;

    // Получаем информацию о комнате
    // for (const ceil of this.map)
    //   socket.on('joined-player', (data) => {
    //     data.forEach((snake) => {
    //       this.snakes.push(new Snake(this, snake.id, snake.body, snake.color));
    //     });
    //   });
    //
    socket.on('step', (data: roomData) => {
      // this.stepsLeftText.innerHTML = `Осталось: ${data.stepsLeft}`;
      // data.eats.forEach((data) => {
      //   if (data) {
      //     const candidate = this.eats.find((eat) => eat.id === data.id);
      //     if (!candidate) {
      //       const eat = new Eat(this, data);
      //       eat.render();
      //       this.eats.push(eat);
      //     }
      //   }
      // });
      data.players.forEach((player) => {
        const candidate = this.snakes.find((snake) => snake.playerId === player.id);
        const my = this.snakes.find(() => MapState.getInstance().getUserid() === player.id);
        if (candidate) {
          candidate.updateBody(player.snake.body);
        }
        // if (my) {
        //   this.rewardText.innerHTML = `Счет: ${dataSnake.reward}`;
        // }
      });
    });
    //
    // socket.on('delete-player', (data) => {
    //   const candidate = this.snakes.find((snake) => data.id === snake.playerID);
    //   if (candidate) {
    //     candidate.destroy();
    //   }
    // });
    //
    // socket.on('delete-eat', (data) => {
    //   const candidate = this.eats.find((eat) => eat.id === data.id);
    //   if (candidate) {
    //     candidate.destroy();
    //   }
    // });
    //
    // socket.on('end-game', (data) => {
    //   alert(`MAX RESULT: ${data.maxReward}`);
    // });
    //
    // socket.emit('init');
  }

  update(time, delta) {
    this.snakes.forEach((snake) => {
      const playerId = MapState.getInstance().getUserid();
      if (playerId && playerId === snake.playerId) {
        snake.update();
      }
    });
    super.update(time, delta);
  }
}
