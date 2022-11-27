import { World } from "../..";
import { Entity } from "../../../Entity";
import { GestureEntity } from "../../../GestureEntity";
import { Passage } from "../../../Passage";
import { formatLayersProperties } from "../formatLayersProperties";
import { ObjectData } from "../renderLayers";
import { selectCurrentTileTexture } from "../selectCurrentTileTexture";

export const PassageObject = (world: World, object: ObjectData) => {
  const xPosition = object.x;
  const yPosition = object.y - 48;

  const src = selectCurrentTileTexture(world, object.gid);

  const properties = formatLayersProperties(object.properties);
  const newWorldGuid = properties.newWorldGuid?.value as string;

  world.addEntity(
    new Passage({
      newWorldGuid,
      index: 0,
      x: xPosition,
      y: yPosition,
      width: 48,
      height: 48,
      src,
    })
  );
};
