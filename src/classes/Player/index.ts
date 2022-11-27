import p5Types from "p5";
import { Socket } from "socket.io-client";
import { Coordinates } from "../../helpers/coordinates";
import {
  entityListColliding,
  isColliding,
} from "../../helpers/utils/collision";
import { Entity, EntityProps } from "../Entity";
import { GestureEntity } from "../GestureEntity";
import { World } from "../World";
import { v4 as uuidv4 } from "uuid";
import { Sprite } from "../Sprite";

interface Message {
  message: string;
  id: string;
  opacity: number;
}

interface PlayerProps extends EntityProps {
  id: string;
  socket: Socket;
  isMyPlayer?: boolean;
  playerSrc: p5Types.Image;
  initialAnimation?: string;
}

enum validKeys {
  up = "up",
  left = "left",
  down = "down",
  right = "right",
}

const movements: Record<
  validKeys,
  (movementSpeed: number) => Partial<Coordinates>
> = {
  up: (movementSpeed: number) => ({
    y: -movementSpeed,
  }),
  left: (movementSpeed: number) => ({
    x: -movementSpeed,
  }),
  down: (movementSpeed: number) => ({
    y: movementSpeed,
  }),
  right: (movementSpeed: number) => ({
    x: movementSpeed,
  }),
};

export class Player extends Entity {
  id: string;
  keys: Record<validKeys, boolean>;
  movementSpeed: number;
  socket: Socket;
  isMyPlayer: boolean;
  messages: Message[];
  sprite: Sprite;
  constructor({
    x,
    y,
    width,
    height,
    id,
    socket,
    isMyPlayer,
    playerSrc,
    initialAnimation,
  }: PlayerProps) {
    super({ x, y, width, height });
    this.socket = socket;
    this.id = id;
    this.isMyPlayer = isMyPlayer ?? false;
    this.movementSpeed = 3;
    this.messages = [];
    this.keys = {
      up: false,
      left: false,
      down: false,
      right: false,
    };

    this.sprite = new Sprite({
      spriteSrc: playerSrc,
      initialSpritePosition: { x: 0, y: 0, width: 48, height: 48 },
      generalProps: {
        animationTime: 3,
      },
    });

    this.sprite.addSpriteAnimation("down", [
      { x: 0, y: 0, width: 48, height: 48 },
      { x: 48, y: 0, width: 48, height: 48 },
      { x: 96, y: 0, width: 48, height: 48 },
    ]);

    this.sprite.addSpriteAnimation("left", [
      { x: 0, y: 48, width: 48, height: 48 },
      { x: 48, y: 48, width: 48, height: 48 },
      { x: 96, y: 48, width: 48, height: 48 },
    ]);

    this.sprite.addSpriteAnimation("right", [
      { x: 0, y: 96, width: 48, height: 48 },
      { x: 48, y: 96, width: 48, height: 48 },
      { x: 96, y: 96, width: 48, height: 48 },
    ]);

    this.sprite.addSpriteAnimation("up", [
      { x: 0, y: 144, width: 48, height: 48 },
      { x: 48, y: 144, width: 48, height: 48 },
      { x: 96, y: 144, width: 48, height: 48 },
    ]);

    if (initialAnimation) {
      this.sprite.setSpritePosition(initialAnimation);
    }
  }

  update(p5: p5Types, world: World) {
    const keysArray = Object.entries(this.keys);

    const firstKeyValid = keysArray.find(([_, value]) => value);

    if (firstKeyValid && this.isMyPlayer) {
      const [key] = firstKeyValid;
      this.sprite.setSpritePosition(key);
    }

    keysArray.map(([key, value]) => {
      if (value && this.isMyPlayer) {
        const coordinates = movements[key as validKeys](this.movementSpeed);

        const { isColliding, Entity } = entityListColliding(
          this,
          world.entities,
          coordinates
        );
        if (isColliding) {
          this.sprite.setCurrentSpritePosition(1);
          if (!Entity) {
            return;
          }
          if (Entity instanceof GestureEntity) {
            Entity.playerCollidingWithMy(world);
          }
          return;
        }

        if (coordinates.x) {
          this.x += coordinates.x;
        }
        if (coordinates.y) {
          this.y += coordinates.y;
        }

        this.socket.emit("userChangePosition", {
          id: this.id,
          x: this.x,
          y: this.y,
          animationName: this.sprite.currentSprite?.name,
        });
      }
    });
  }

  removeMessage(messageId: string) {
    const message = this.messages.find((m) => m.id === messageId);
    if (!message) {
      return;
    }

    const decreaseOpacity = () => {
      message.opacity -= 0.05;
      if (message.opacity > 0) {
        setTimeout(decreaseOpacity, 5);
      } else {
        message.opacity = 0;
        this.messages = this.messages.filter(({ id }) => id !== messageId);
      }
    };

    decreaseOpacity();
  }

  addMessage(message: string) {
    const id = uuidv4();
    this.messages.push({
      message,
      id,
      opacity: 1,
    });

    if (this.messages.length > 4) {
      this.messages.shift();
    }
    setTimeout(() => this.removeMessage(id), 10000);
  }

  draw(p5: p5Types) {
    if (this.sprite.currentSpriteImage) {
      p5.image(
        this.sprite.currentSpriteImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else {
      p5.fill(this.isMyPlayer ? "#FF0000" : "#FFFFFF");
      p5.rect(this.x, this.y, this.width, this.height);
    }

    if (this.messages.length < 1) {
      return;
    }

    p5.fill("rgba(0,0,0,0.5)");
    p5.rect(this.x + 25, this.y + 5, 100, -30 * this.messages.length);

    const messageReverse = [...this.messages].reverse();
    messageReverse.forEach(({ message, opacity }, index) => {
      p5.fill(`rgba(255,255,255,${opacity})`);

      p5.textSize(24);
      p5.text(message, this.x + 30, this.y - 30 * index);
    });
  }

  onkeyup(event: KeyboardEvent) {
    let key = "";
    if (event.code === "ArrowUp" || event.code === "KeyW") key = "up";
    if (event.code === "ArrowDown" || event.code === "KeyS") key = "down";
    if (event.code === "ArrowLeft" || event.code === "KeyA") key = "left";
    if (event.code === "ArrowRight" || event.code === "KeyD") key = "right";

    if (key in this.keys) {
      this.keys[key as validKeys] = false;
    }
  }

  onkeypress(event: KeyboardEvent) {
    let key = "";
    if (event.code === "ArrowUp" || event.code === "KeyW") key = "up";
    if (event.code === "ArrowDown" || event.code === "KeyS") key = "down";
    if (event.code === "ArrowLeft" || event.code === "KeyA") key = "left";
    if (event.code === "ArrowRight" || event.code === "KeyD") key = "right";
    if (key in this.keys) {
      this.keys[key as validKeys] = true;
    }
  }
}
