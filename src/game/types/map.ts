import SnakeBody from '../Entities/SnakeBody';

export type snakeBody = {
  x: number;
  y: number;
};
export type snakeBodyItem = {
  item: SnakeBody | null;
} & snakeBody;

export enum MapItemTypeEnum {
  SOLID = 'solid',
  EMPTY = 'empty',
}

export interface IMapPhysicalItem {
  x: number;
  y: number;
  type: MapItemTypeEnum;
}

export interface IMapItem {
  x: number;
  y: number;
  texture: number;
}

export interface IMap {
  width: number;
  height: number;

  items: IMapItem[];
  physicalItems: IMapPhysicalItem[];
}

export interface IEat {
  id: string;
  x: number;
  y: number;
}

export interface ISnake {
  direction: string;
  color: number;
  body: snakeBody[];
}

export interface IPlayer {
  id: string;
  score: number;
  name: string;
  snake: ISnake;
}

export interface IBullet {
  id: string;
  x: number;
  y: number;
  direction: string;
  color: number;
}

export type roomData = {
  time: number;
  map: IMap;
  eats: IEat[];
  players: IPlayer[];
  bullets: IBullet[];
};
