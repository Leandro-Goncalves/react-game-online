import { World } from "..";
import { Entity } from "../../Entity";
import { formatLayersProperties } from "./formatLayersProperties";
import { ButtonObject } from "./objects/ButtonObject";
import { SignsObject } from "./objects/SignsObject";
import { DoorObject } from "./objects/DoorObject";
import { initialSpawnObject } from "./objects/initialSpawnObject";
import { PassageObject } from "./objects/PassageObject";
import { selectCurrentTileTexture } from "./selectCurrentTileTexture";

export interface Properties {
  name: string;
  type: string;
  value: string | boolean | number;
}

export interface ObjectData {
  gid: number;
  x: number;
  y: number;
  properties: Properties[];
  type: string;
  width: number;
  height: number;
}

export interface Layer {
  data?: number[];
  objects?: ObjectData[];
  name: string;
  properties?: Properties[];
  type: string;
}

const layersTypes: Record<string, any> = {
  tilelayer: (props: TileLayer) => tilesLayer(props),
  objectgroup: (props: ObjectLayer) => objectLayer(props),
};

export const renderLayer = (world: World, layer: Layer) => {
  const currentLayer = layersTypes[layer.type];

  if (!currentLayer) {
    return;
  }

  currentLayer({
    world,
    layer: layer,
  });
};

interface TileLayer {
  world: World;
  layer: Layer;
}

const tilesLayer = ({ world, layer }: TileLayer) => {
  if (!layer.data) {
    return;
  }

  const properties = formatLayersProperties(layer.properties);
  const layerIndex = properties.index?.value ?? 0;
  const isColisionLayer = properties.colisionLayer?.value ?? false;

  layer.data.forEach((tile, index) => {
    if (tile === 0) {
      return;
    }
    const xPosition = 48 * (index % world.tilesWidth);
    const yPosition = 48 * Math.floor(index / world.tilesWidth);

    const src = selectCurrentTileTexture(world, tile);
    world.addEntity(
      new Entity({
        index: isNaN(layerIndex as any) ? 0 : (layerIndex as number),
        x: xPosition,
        y: yPosition,
        width: 48,
        height: 48,
        src,
        disableCollision: !Boolean(isColisionLayer),
      })
    );
  });
};

interface ObjectLayer {
  world: World;
  layer: Layer;
}

const objectClasses: Record<string, any> = {
  passage: PassageObject,
  door: DoorObject,
  button: ButtonObject,
  initialSpawn: initialSpawnObject,
  signs: SignsObject,
};

const objectLayer = ({ world, layer }: ObjectLayer) => {
  if (!layer.objects) {
    return;
  }

  layer.objects.forEach((object) => {
    const currentObjectClass = objectClasses[object.type];
    if (currentObjectClass) {
      currentObjectClass(world, object);
      return;
    }

    const xPosition = object.x;
    const yPosition = object.y - 48;

    const src = selectCurrentTileTexture(world, object.gid);

    world.addEntity(
      new Entity({
        index: 0,
        x: xPosition,
        y: yPosition,
        width: 48,
        height: 48,
        src,
        disableCollision: true,
      })
    );
  });
};
