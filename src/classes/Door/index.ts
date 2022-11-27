import p5Types from "p5";
import { Button } from "../Button";
import { Entity, EntityProps } from "../Entity";
import { World } from "../World";

interface indexProps extends EntityProps {
  isOpened?: boolean;
  buttonId: string;
}

export class Door extends Entity {
  isOpened: boolean;
  buttonId: string;
  opacity: number;
  constructor({ buttonId, isOpened, ...props }: indexProps) {
    super({ ...props });
    this.buttonId = buttonId;
    this.isOpened = isOpened ?? false;
    this.opacity = 1;
  }

  update(p5: p5Types, world: World) {
    if (this.isOpened && this.opacity > 0) {
      this.opacity -= 0.05;
    } else if (!this.isOpened && this.opacity < 1) {
      this.opacity += 0.05;
    }
    const selectButtonsLinkedWithThisDoor = world.entities.filter((entity) => {
      if (!(entity instanceof Button)) {
        return false;
      }

      if (entity.id !== this.buttonId) {
        return false;
      }

      return true;
    }) as Button[];

    const isAllButtonsPressed = selectButtonsLinkedWithThisDoor.every(
      (button) => button.isPressed
    );
    if (isAllButtonsPressed) {
      this.isOpened = true;
      this.disableCollision = true;
      return;
    }

    if (this.isOpened) {
      this.isOpened = false;
      this.disableCollision = false;
    }
  }
  draw(p5: p5Types) {
    if (this.src) {
      p5.tint(255, this.opacity * 255);
      p5.image(this.src, this.x, this.y, this.imgWidth, this.imgHeight);
      p5.noTint();
    }
  }
}
