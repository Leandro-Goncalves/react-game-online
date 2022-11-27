import { entityListColliding } from "../../helpers/utils/collision";
import { Entity, EntityProps } from "../Entity";
import { World } from "../World";

export interface GestureEntityProps extends EntityProps {}

export class GestureEntity extends Entity {
  constructor({ ...rest }: GestureEntityProps) {
    super(rest);
  }

  playerCollidingWithMy(world: World) {}

  playerCollidingWithMyAndPressKey(event: KeyboardEvent) {}
}
