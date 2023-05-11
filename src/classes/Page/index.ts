import p5Types from "p5";
import { GestureEntity, GestureEntityProps } from "../GestureEntity";
import { publish } from "../../patterns/pubsub/publish";
import { messages } from "../../patterns/pubsub/messages";

export interface PageProps extends GestureEntityProps {
  openURL: string;
  imageSrc: string;
}

export class Page extends GestureEntity {
  openURL?: string;
  imageSrc: string;
  constructor({ openURL, imageSrc, ...rest }: PageProps) {
    super(rest);
    this.openURL = openURL;
    this.imageSrc = imageSrc;
  }

  playerCollidingWithMyAndPressKey(event: KeyboardEvent) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      if (this.openURL) {
        window.open(this.openURL);
        return;
      }

      publish(messages.project.open, this.imageSrc);
    }
  }
}
