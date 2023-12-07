export type snakeBody = {
  x: number;
  y: number;
  direction: string;
  ceil: null | any;
};
export type roomData = {
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
