import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Phaser from 'phaser';
import { io } from 'socket.io-client';
import MainScene from "./game/scenes/MainScene";

export const socket = io('ws://109.194.141.184:4338/snake');
// export const socket = io('ws://127.0.0.1:4338/snake');
const phaserConfig = {
  type: Phaser.AUTO,
  width: 768,
  height: 480,
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