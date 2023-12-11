import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Phaser from 'phaser';
import { io } from 'socket.io-client';
import MainScene from './game/scenes/MainScene';

// export const socket = io('ws://109.194.141.184:4338/snake');
export const socket = io('ws://127.0.0.1:4338/snake');
export const ceilWidth = 32;
export const ceilHeight = 32;
export const ceilPhysicalWidth = 16;
export const ceilPhysicalHeight = 16;

const phaserConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 640,
  backgroundColor: '#000000',
  parent: 'game',
  fullscreenTarget: 'game',
  scene: [MainScene],
  banner: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};
createApp(App).mount('#app');

export function initPhaser() {
  return new Phaser.Game(phaserConfig);
}
