import { World } from "../..";
import { Button } from "../../../Button";
import { formatLayersProperties } from "../formatLayersProperties";
import { ObjectData } from "../renderLayers";
import { selectCurrentTileTexture } from "../selectCurrentTileTexture";

export const ButtonObject = (world: World, object: ObjectData) => {
  const xPosition = object.x;
  const yPosition = object.y - 48;

  const src = selectCurrentTileTexture(world, object.gid);

  const properties = formatLayersProperties(object.properties);
  const id = properties.id?.value as string;
  const isSwitch = properties.isSwitch?.value as boolean;

  world.addEntity(
    new Button({
      id,
      index: 0,
      x: xPosition,
      y: yPosition,
      width: 25,
      height: 25,
      src,
      isSwitch,
    })
  );
};
