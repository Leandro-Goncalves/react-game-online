import { World } from "../..";
import { Door } from "../../../Door";
import { Entity } from "../../../Entity";
import { GestureEntity } from "../../../GestureEntity";
import { Passage } from "../../../Passage";
import { formatLayersProperties } from "../formatLayersProperties";
import { ObjectData } from "../renderLayers";
import { selectCurrentTileTexture } from "../selectCurrentTileTexture";

export const DoorObject = (world: World, object: ObjectData) => {
  const xPosition = object.x;
  const yPosition = object.y - 48;

  const src = selectCurrentTileTexture(world, object.gid, 48);

  const properties = formatLayersProperties(object.properties);
  const buttonId = properties.buttonId?.value as string;

  world.addEntity(
    new Door({
      buttonId,
      index: 0,
      x: xPosition,
      y: yPosition,
      width: 48,
      height: 48,
      src,
    })
  );
};
