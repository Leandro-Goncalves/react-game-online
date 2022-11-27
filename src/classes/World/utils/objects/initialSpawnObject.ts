import { World } from "../..";
import { ObjectData } from "../renderLayers";

export const initialSpawnObject = (world: World, object: ObjectData) => {
  world.initialSpawn = {
    minX: object.x,
    maxX: object.x + object.width,
    minY: object.y,
    maxY: object.y + object.height,
  };
};
