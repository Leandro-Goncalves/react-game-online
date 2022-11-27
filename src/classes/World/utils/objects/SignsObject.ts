import { World } from "../..";
import { Button } from "../../../Button";
import { GestureEntity } from "../../../GestureEntity";
import { Signs } from "../../../Signs";
import { formatLayersProperties } from "../formatLayersProperties";
import { ObjectData } from "../renderLayers";
import { selectCurrentTileTexture } from "../selectCurrentTileTexture";

export const SignsObject = (world: World, object: ObjectData) => {
  const xPosition = object.x;
  const yPosition = object.y - 48;

  const src = selectCurrentTileTexture(world, object.gid);

  const properties = formatLayersProperties(object.properties);
  const text = properties.text?.value as string;

  world.addEntity(
    new Signs({
      index: 0,
      x: xPosition,
      y: yPosition,
      width: 48,
      height: 48,
      src,
      text: text ?? "",
    })
  );
};
