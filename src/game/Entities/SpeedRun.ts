import { socket } from '../../main';
import Snake from './Snake';

export default class SpeedRun {
  cof = 5;

  speed = 3;
  snake;
  id;
  timeReset = 5 * this.cof;
  timeActive = 1 * this.cof;
  currentTimeReset = 0;
  currentTimeActive = 0;
  isActive = false;

  constructor(id: string, snake: Snake) {
    this.snake = snake;
    this.id = id;
    socket.on('time-sec', () => {
      this.handle();
    });
  }

  // Активация ускорения
  activate() {
    if (this.currentTimeReset > 0) {
      console.log('перезарядка');
      // Перезарядка ускорения
      return;
    }
    this.currentTimeActive = this.timeActive;
    this.isActive = true;

    console.log('ускорение активировано');
    socket.emit('speedBonus');
  }

  // Получение состояния активности ускорения
  getBonusActive() {
    return this.isActive;
  }

  // Обработчик цикла
  handle() {
    // Уменьшаем перезарядку на 1 сек
    if (this.currentTimeReset > 0) {
      this.currentTimeReset--;
    }

    if (this.currentTimeActive > 0) {
      this.currentTimeActive--;
      // Время вышло
      if (this.currentTimeActive === 0) {
        this.isActive = false;
        this.currentTimeReset = this.timeReset;
      }
    }
  }
}
