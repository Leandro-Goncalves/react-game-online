import React from "react";
import p5Types from "p5";
import axios from "axios";
import { GestureEntity, GestureEntityProps } from "../GestureEntity";
import { Player } from "../Player";
import { World } from "../World";

interface PassageProps extends GestureEntityProps {
  newWorldGuid: string;
}

export class Passage extends GestureEntity {
  newWorldGuid: string;
  isLoaded: boolean;

  constructor({ newWorldGuid, ...rest }: PassageProps) {
    super(rest);
    this.newWorldGuid = newWorldGuid;
    this.isLoaded = false;
  }

  async playerCollidingWithMy(world: World) {
    const myId = world.entities.find(
      (entity) => entity instanceof Player && entity?.isMyPlayer
    ) as Player;
    if (!myId || this.isLoaded) {
      return;
    }

    this.isLoaded = true;
    const { data } = await axios.post("http://192.168.200.106:3001/world2", {
      id: myId.id,
    });

    console.log(data);
    // world.loadNewTiles(newMap.layers);
  }
}
