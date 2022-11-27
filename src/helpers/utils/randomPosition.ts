import { InitialSpawn } from "../../classes/World";

export const randomPosition = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const random2dPosition = ({ minX, maxX, minY, maxY }: InitialSpawn) => {
  const randomX = randomPosition(minX, maxX);
  const randomY = randomPosition(minY, maxY);

  return {
    x: randomX,
    y: randomY,
  };
};
