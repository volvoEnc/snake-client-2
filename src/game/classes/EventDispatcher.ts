import Phaser from 'phaser';

export default class EventDispatcher extends Phaser.Events.EventEmitter {
  private static instance: EventDispatcher | null = null;
  constructor() {
    super();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new EventDispatcher();
    }
    return this.instance;
  }
}
