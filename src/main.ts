import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Phaser from 'phaser';
import { io } from 'socket.io-client';
import MainScene from './game/scenes/MainScene';

// export const socket = io('ws://109.194.141.184:4338/snake');
export const socket = io('ws://212.220.200.39:4338/snake');
export const ceilWidth = 32;
export const ceilHeight = 32;
export const ceilPhysicalWidth = 16;
export const ceilPhysicalHeight = 16;

const phaserConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  fullscreenTarget: 'game',
  scene: [MainScene],
  banner: false,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'game',
    width: '100%',
    height: '100%',
    min: {
      width: 300,
    },
    max: {
      width: 1200,
      height: 640,
    },
  },
};
createApp(App).mount('#app');

export function initPhaser() {
  return new Phaser.Game(phaserConfig);
}
