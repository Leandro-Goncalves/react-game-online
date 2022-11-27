import p5Types from "p5";
import { isColliding } from "../../helpers/utils/collision";
import { Entity, EntityProps } from "../Entity";
import { World } from "../World";

interface ButtonProps extends Omit<EntityProps, "disableCollision"> {
  isSwitch?: boolean;
  id: string;
}

export class Button extends Entity {
  isPressed: boolean;
  isSwitch: boolean;
  id: string;
  constructor({ isSwitch, id, ...props }: ButtonProps) {
    super({ ...props, disableCollision: true });
    this.isPressed = false;
    this.isSwitch = isSwitch ?? false;
    this.id = id;
  }

  update(p5: p5Types, world: World) {
    const worldWithoutMyselfAnsEntityWithoutCollision = world.entities.filter(
      (entity) => entity !== this && !entity.disableCollision
    );
    const isCollidingWithSomeEntity =
      worldWithoutMyselfAnsEntityWithoutCollision.some((entity) =>
        isColliding(this, entity)
      );

    if (isCollidingWithSomeEntity) {
      this.isPressed = true;
      return;
    }

    if (this.isSwitch) {
      this.isPressed = false;
    }
  }

  draw(p5: p5Types) {
    p5.fill(this.isPressed ? "#919191" : "#FFFFFF");
    p5.rect(this.x, this.y, this.width, this.height);
  }
}
