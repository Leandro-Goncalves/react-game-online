import { useEffect, useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import "./App.css";
import { World } from "./classes/World";
import { Player } from "./classes/Player";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { random2dPosition } from "./helpers/utils/randomPosition";
import { ChatBar } from "./components/ChatBar";
import { Sprite } from "./classes/Sprite";

function App() {
  let world: World;
  let wallSrc: p5Types.Image;
  let playerSrc: p5Types.Image;
  let socket: Socket;

  const preload = async (p5: p5Types) => {
    wallSrc = p5.loadImage("sprites.png");
    playerSrc = p5.loadImage("playerSprite.png");
  };

  const setup = async (p5: p5Types, canvasParentRef: Element) => {
    const windowResized = () => {
      if (p5) {
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", windowResized);

    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );

    socket = io("https://my-game-backend.herokuapp.com:39361");

    socket.on("connect", () => {
      socket.emit(
        "joinInFirstRoom",
        ({ myCurrentWorld, initialUsersPositions }: any) => {
          const initialSpawn = myCurrentWorld.initialSpawn ?? {
            x: 100,
            y: 100,
          };

          const MyPlayer = new Player({
            x: initialSpawn.x,
            y: initialSpawn.y,
            width: 40,
            height: 40,
            id: socket.id,
            socket,
            isMyPlayer: true,
            playerSrc,
          });

          (window as any).MyPlayer = MyPlayer;

          world = new World({
            p5,
            tiles: myCurrentWorld.layers,
            tilesWidth: myCurrentWorld.width,
            tilesHeight: myCurrentWorld.height,
            tilesSize: myCurrentWorld.tilewidth,
            texture: wallSrc,
            pinToPlayer: MyPlayer,
          });

          (window as any).World = world;

          initialUsersPositions.forEach((user: any) => {
            world.addEntity(
              new Player({
                x: user.x,
                y: user.y,
                width: 40,
                height: 40,
                id: user.id,
                socket,
                playerSrc,
                initialAnimation: user.animationName,
              })
            );
          });

          world.addEntity(MyPlayer);
        }
      );

      return;
    });

    socket.on("disconnectUser", (id) => {
      world.removeEntityById(id);
    });

    socket.on("updatePositions", (data) => {
      const currentUser = world.entities.find((entity) => {
        if (entity instanceof Player) {
          if (entity.id === data.id) {
            return true;
          }
        }
        return false;
      }) as Player | undefined;

      if (!currentUser) {
        return;
      }

      currentUser.x = data.x;
      currentUser.y = data.y;

      if (data.animationName) {
        currentUser.sprite.setSpritePosition(data.animationName);
      }
    });

    socket.on("aNewUserEnterInRoom", (data) => {
      world.addEntity(
        new Player({
          x: data.x,
          y: data.y,
          width: 40,
          height: 40,
          id: data.id,
          socket,
          playerSrc,
        })
      );
    });

    socket.on("userSendMessage", ({ message, id }) => {
      handleSendMessage(message, id, false);
    });
  };

  const draw = (p5: p5Types) => {
    p5.background(0);

    if (!world) {
      return;
    }
    world.draw(p5);
    world.update(p5);
  };

  const handleSendMessage = (
    message: string,
    playerId: string,
    sendSocketEvent: boolean = true
  ) => {
    if (!world) {
      return;
    }

    const myUser = world.entities.find((entity) => {
      if (!(entity instanceof Player)) {
        return false;
      }

      if (entity.id !== playerId) {
        return false;
      }

      return true;
    }) as Player | undefined;

    if (!myUser) {
      return;
    }

    myUser.addMessage(message);

    if (sendSocketEvent) {
      socket.emit("sendMessage", message);
    }
  };

  const handleSendMessageToMyPlayer = (message: string) => {
    handleSendMessage(message, socket.id);
  };

  return (
    <div className="App">
      <Sketch setup={setup} draw={draw} preload={preload} />
      <ChatBar sendMessage={handleSendMessageToMyPlayer} />
    </div>
  );
}

export default App;
