import { Entity } from "../../classes/Entity";
import { Player } from "../../classes/Player";
import { Coordinates } from "../coordinates";

interface entityListCollidingReturn {
  isColliding: boolean;
  Entity: Entity | undefined;
}

export const entityListColliding = (
  myEntity: Entity,
  entityList: Entity[],
  myNewCoordinates?: Partial<Coordinates> | Partial<Coordinates>[]
): entityListCollidingReturn => {
  const newCoordinatesArray = Array.isArray(myNewCoordinates)
    ? myNewCoordinates
    : [myNewCoordinates];
  let EntityThatIColliding: Entity | undefined = undefined;

  const isCollidingSome = newCoordinatesArray.some((newCoordinates) => {
    const listWithoutMyselfAndEntityWithoutCollision = entityList.filter(
      (entity) =>
        entity !== myEntity &&
        !entity.disableCollision &&
        !(entity instanceof Player)
    );
    const isCollidingWithSomeEntity =
      listWithoutMyselfAndEntityWithoutCollision.some((entity) => {
        const myEntityWithNextCoordinates: Entity = {
          ...myEntity,
          x: myEntity.x + (newCoordinates?.x ?? 0),
          y: myEntity.y + (newCoordinates?.y ?? 0),
        } as Entity;

        const isCollidingBoolean = isColliding(
          myEntityWithNextCoordinates,
          entity
        );

        if (isCollidingBoolean) {
          EntityThatIColliding = entity;
        }

        return isCollidingBoolean;
      });

    return isCollidingWithSomeEntity;
  });

  return {
    isColliding: isCollidingSome,
    Entity: EntityThatIColliding,
  };
};

export const isColliding = (entity1: Entity, entity2: Entity) => {
  const distanceX = entity1.x - entity2.x;
  const distanceY = entity1.y - entity2.y;

  let isCollidingX = false;
  let isCollidingY = false;

  if (distanceX < 0) {
    isCollidingX = Math.abs(distanceX) < entity1.width;
  } else {
    isCollidingX = distanceX < entity2.width;
  }

  if (distanceY < 0) {
    isCollidingY = Math.abs(distanceY) < entity1.height;
  } else {
    isCollidingY = distanceY < entity2.height;
  }

  return isCollidingX && isCollidingY;
};
