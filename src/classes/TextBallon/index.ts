import p5Types from "p5";
import { v4 as uuidv4 } from "uuid";

interface Message {
  message: string;
  id: string;
  opacity: number;
}

export class TextBallon {
  messages: Message[];
  constructor() {
    this.messages = [];
  }

  add(message: string) {
    const id = uuidv4();
    this.messages.push({
      message,
      id,
      opacity: 1,
    });

    if (this.messages.length > 4) {
      this.messages.shift();
    }
    setTimeout(() => this.remove(id), 10000);
  }
  remove(messageId: string) {
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
  clear() {
    this.messages = [];
  }

  render(p5: p5Types, x: number, y: number, alignCenter?: boolean) {
    if (this.messages.length < 1) {
      return;
    }

    // p5.textFont((window as any).mainFont);

    let XValue = x;

    const largestMessage = this.messages
      .reverse()
      .sort((a, b) => a.message.length - b.message.length)
      .reverse()[0];

    let textBallonWidth = largestMessage.message.length * 13;
    if (textBallonWidth < 100) textBallonWidth = 100;

    if (alignCenter) {
      XValue -= textBallonWidth / 2;
    }

    p5.fill("rgba(255,255,255,1)");
    p5.rect(XValue, y + 5, textBallonWidth, -31 * this.messages.length, 10);

    const messageReverse = [...this.messages].reverse();
    messageReverse.forEach(({ message, opacity }, index) => {
      p5.fill(`rgba(0,0,0,${opacity})`);

      p5.textSize(24);
      p5.text(message, XValue + 5, y - 3 - 30 * index);
    });
  }
}
