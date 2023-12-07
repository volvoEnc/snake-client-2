import {socket} from "../../main";

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



    constructor(id, snake) {
        this.snake = snake;
        this.id = id;
        // Раз в секунду
        socket.on('step', (data) => {
            this.handle();
        });
    }

    // Активация ускорения
    activate() {
        if (this.currentTimeReset > 0) {
            console.log('перезарядка')
            // Перезарядка ускорения
            return;
        }
        this.currentTimeActive = this.timeActive;
        this.isActive = true;

        console.log('ускорение активировано')
        socket.emit('speedRun', {
            id: this.id
        });
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
