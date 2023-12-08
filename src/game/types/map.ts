import Phaser from 'phaser';

export type snakeBody = {
  x: number;
  y: number;
};
export type snakeBodyItem = {
  item: Phaser.GameObjects.Shape | null;
} & snakeBody;

export type roomData = {
  time: number;
  map: {
    width: number;
    height: number;
    items: { x: number; y: number; texture: number; type: string }[];
  };
  eats: {
    x: number;
    y: number;
  }[];
  players: {
    id: string;
    score: number;
    name: string;
    snake: {
      direction: string;
      color: string;
      body: snakeBody[];
    };
  }[];
};
