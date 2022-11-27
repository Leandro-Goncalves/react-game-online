import p5Types from "p5";
import { Socket } from "socket.io-client";
import { Coordinates } from "../../helpers/coordinates";
import { EntityDTO, World } from "../World";

export interface EntityProps extends Partial<Coordinates> {
  width: number;
  height: number;
  disableCollision?: boolean;
  index?: number;

  src?: p5Types.Image;
  imgWidth?: number;
  imgHeight?: number;

  drawRect?: boolean;
}

export class Entity implements EntityDTO {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  disableCollision: boolean;

  src?: p5Types.Image;
  imgWidth: number;
  imgHeight: number;

  drawRect: boolean;
  constructor({
    x,
    y,
    height,
    width,
    disableCollision,
    index,
    src,
    imgWidth,
    imgHeight,
    drawRect,
  }: EntityProps) {
    this.index = index ?? 0;
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.width = width;
    this.height = height;
    this.disableCollision = disableCollision ?? false;

    this.src = src;
    this.imgWidth = imgWidth ?? this.width;
    this.imgHeight = imgHeight ?? this.height;

    this.drawRect = drawRect ?? false;
  }

  onkeyup(event: KeyboardEvent) {}

  onkeypress(event: KeyboardEvent) {}

  update(p5: p5Types, world: World) {}

  draw(p5: p5Types) {
    if (this.src) {
      p5.image(this.src, this.x, this.y, this.imgWidth, this.imgHeight);
      return;
    }

    if (this.drawRect) {
      p5.rect(this.x, this.y, this.width, this.height);
    }
  }
}
