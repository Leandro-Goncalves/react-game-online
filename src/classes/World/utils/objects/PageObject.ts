import p5Types from "p5";
import { World } from "../..";
import { GestureEntity } from "../../../GestureEntity";
import { Page } from "../../../Page";
import { formatLayersProperties } from "../formatLayersProperties";
import { ObjectData } from "../renderLayers";

export const PageObject = (world: World, object: ObjectData) => {
  const xPosition = object.x;
  const yPosition = object.y;
  const p5 = (window as any).p5 as p5Types;

  const properties = formatLayersProperties(object.properties);
  const openURL = properties.openURL?.value as string;
  const imageSrc = properties.imageSrc?.value as string;

  p5.loadImage(imageSrc, (img) => {
    world.addEntity(
      new Page({
        x: xPosition,
        y: yPosition,
        height: object.height,
        width: object.width,
        src: img,
        openURL,
        imageSrc,
      })
    );
  });
};
