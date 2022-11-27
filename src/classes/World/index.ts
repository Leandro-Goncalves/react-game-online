import p5Types from "p5";
import { entityListColliding } from "../../helpers/utils/collision";
import { Entity } from "../Entity";
import { GestureEntity } from "../GestureEntity";
import { Passage } from "../Passage";
import { Player } from "../Player";
import { Layer, renderLayer } from "./utils/renderLayers";

export interface EntityDTO {
  update: (p5: p5Types, world: World) => void;
  draw: (p5: p5Types) => void;
  onkeypress: (event: KeyboardEvent) => void;
  onkeyup: (event: KeyboardEvent) => void;
}

interface WorldProps {
  p5: p5Types;
  tiles: Layer[];
  tilesWidth: number;
  tilesHeight: number;
  tilesSize: number;
  texture: p5Types.Image;
  pinToPlayer: Player;
}

export interface InitialSpawn {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export class World {
  p5: p5Types;
  entities: Entity[];
  staticEntities: { wasRendered: boolean; entity: Entity }[];
  tilesWidth: number;
  tilesHeight: number;
  tilesSize: number;
  texture: p5Types.Image;
  initialSpawn?: InitialSpawn;
  pinToPlayer: Player;

  cameraPosition?: p5Types.Vector;
  scale: number;

  constructor({
    p5,
    tiles,
    tilesWidth,
    tilesHeight,
    tilesSize,
    texture,
    pinToPlayer,
  }: WorldProps) {
    this.entities = [];
    this.staticEntities = [];
    this.tilesWidth = tilesWidth;
    this.tilesHeight = tilesHeight;
    this.tilesSize = tilesSize;
    this.texture = texture;
    this.pinToPlayer = pinToPlayer;

    this.p5 = p5;
    this.scale = 1.5;

    tiles.map((layer) => renderLayer(this, layer));

    window.addEventListener("keypress", this.onKeyPress.bind(this));
    window.addEventListener("keyup", this.onKeyup.bind(this));
  }
  loadNewTiles(tiles: Layer[]) {
    this.entities = [];
    tiles.map((layer) => renderLayer(this, layer));
  }
  onKeyPress(event: any) {
    if (event.path[0] instanceof HTMLInputElement) {
      return;
    }
    this.entities.forEach((entity) => entity.onkeypress(event));

    const { isColliding, Entity } = entityListColliding(
      this.pinToPlayer,
      this.entities,
      [{ x: 3 }, { x: -3 }, { y: 3 }, { y: -3 }]
    );
    if (isColliding && Entity instanceof GestureEntity) {
      Entity.playerCollidingWithMyAndPressKey(event);
    }
  }

  onKeyup(event: any) {
    this.entities.forEach((entity) => entity.onkeyup(event));
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
    const sortedEntities = this.entities.sort((a, b) => a.index - b.index);
    this.entities = sortedEntities;
  }

  removeEntityById(id: string) {
    this.entities = this.entities.filter((entity) => {
      if (entity instanceof Player) {
        if (entity.id === id) {
          return false;
        }
      }
      return true;
    });
  }

  update(p5: p5Types) {
    this.entities.forEach((entity) => entity.update(p5, this));
  }

  renderCameraPosition(p5: p5Types) {
    const player = this.pinToPlayer;
    const scale = this.scale;

    let translateX =
      window.innerWidth / scale / 2 - player.x - player.width / 2;
    let translateY =
      window.innerHeight / scale / 2 - player.y - player.height / 2;

    const finalX =
      (this.tilesSize * this.tilesWidth - window.innerWidth / scale) * -1;
    const finalY =
      (this.tilesSize * this.tilesHeight - window.innerHeight / scale) * -1;

    if (translateX > 0) {
      translateX = 0;
    }

    if (translateY > 0) {
      translateY = 0;
    }

    if (translateX < finalX) {
      translateX = finalX;
    }

    if (translateY < finalY) {
      translateY = finalY;
    }

    if (!this.cameraPosition) {
      this.cameraPosition = p5.createVector(translateX, translateY);
    } else {
      this.cameraPosition = this.cameraPosition.lerp(
        translateX,
        translateY,
        0,
        0.1
      );
    }

    const { x, y } = this.cameraPosition;
    p5.scale(scale);
    p5.translate(x, y);
    return { x: x * -1, y: y * -1 };
  }

  draw(p5: p5Types) {
    const { x: cameraX, y: cameraY } = this.renderCameraPosition(p5);

    this.entities.forEach((entity) => {
      const SCREEN_OVERFLOW = entity.width * 2;
      if (
        entity.x < cameraX - SCREEN_OVERFLOW ||
        entity.x + entity.width >
          cameraX + window.innerWidth / this.scale + SCREEN_OVERFLOW
      ) {
        return;
      }

      if (
        entity.y < cameraY - SCREEN_OVERFLOW ||
        entity.y + entity.height >
          cameraY + window.innerHeight / this.scale + SCREEN_OVERFLOW
      ) {
        return;
      }
      entity.draw(p5);
    });
  }
}
