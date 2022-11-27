import { World } from "..";

export const selectCurrentTileTexture = (
  world: World,
  tile: number,
  size?: number
) => {
  const correctlySize = size ?? 48;
  let tileLine = Math.floor((tile - 1) / 8);
  let tileColumn = (tile - 1) % 8;

  const src = world.texture.get(
    tileColumn * correctlySize,
    tileLine * correctlySize,
    correctlySize,
    correctlySize
  );

  return src;
};
