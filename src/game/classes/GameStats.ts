import MainScene from '../scenes/MainScene';
import { socket } from '../../main';
import EventDispatcher from './EventDispatcher';

export interface IStatsData {
  fps: number;
  ping: number;
  serverLoad: number;
}

export class GameStats {
  private fps: number;
  private ping: number;
  private serverLoad: number;
  private scene: MainScene;
  private lastTime: number;
  private eventDispatcher: EventDispatcher;

  constructor(scene: MainScene) {
    this.fps = 0;
    this.ping = 0;
    this.serverLoad = 0;
    this.scene = scene;
    this.lastTime = Date.now();
    this.eventDispatcher = EventDispatcher.getInstance();

    socket.on('stats-response', (data: { timestamp: number; serverLoad: number }) => {
      this.ping = Date.now() - this.lastTime;
      this.serverLoad = data.serverLoad;
      this.fps = Math.floor(this.scene.game.loop.actualFps);

      this.eventDispatcher.emit('statsData', this.getStats());
    });

    setInterval(() => {
      this.lastTime = Date.now();
      socket.emit('stats-request');
    }, 1000);
  }

  public getStats(): IStatsData {
    return {
      fps: this.fps,
      ping: this.ping,
      serverLoad: this.serverLoad,
    };
  }
}
