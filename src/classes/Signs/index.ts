import p5Types from "p5";
import { EntityProps } from "../Entity";
import { GestureEntity } from "../GestureEntity";
import { TextBallon } from "../TextBallon";

export interface SignsProps extends EntityProps {
  text: string;
}

export class Signs extends GestureEntity {
  TextBallon: TextBallon;
  text: string;
  constructor({ text, ...rest }: SignsProps) {
    super(rest);
    this.text = text;
    this.TextBallon = new TextBallon();
    this.index = 2;
  }

  playerCollidingWithMyAndPressKey(event: KeyboardEvent) {
    if (event.code === "Enter") {
      this.TextBallon.clear();
      var separateLines = this.text.split(/\r?\n|\r|\n/g);
      separateLines.map((line) => {
        this.TextBallon.add(line);
      });
    }
  }

  draw(p5: p5Types) {
    if (this.src) {
      p5.image(this.src, this.x, this.y, this.imgWidth, this.imgHeight);
    } else if (this.drawRect) {
      p5.rect(this.x, this.y, this.width, this.height);
    }

    this.TextBallon.render(p5, this.x + this.imgWidth / 2, this.y - 8, true);
  }
}
