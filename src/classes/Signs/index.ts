import { entityListColliding } from "../../helpers/utils/collision";
import { Entity, EntityProps } from "../Entity";
import { GestureEntity } from "../GestureEntity";
import { World } from "../World";

export interface SignsProps extends EntityProps {
  text: string;
}

export class Signs extends GestureEntity {
  constructor({ ...rest }: SignsProps) {
    super(rest);
  }

  playerCollidingWithMyAndPressKey(event: KeyboardEvent) {
    if (event.code === "Enter") {
      console.log("Enter");
    }
  }
}
