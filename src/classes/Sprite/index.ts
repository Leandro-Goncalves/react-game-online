import p5Types from "p5";

interface SpritesPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GeneralProps {
  animationTime?: number;
}

interface SpriteProps {
  spriteSrc: p5Types.Image;
  initialSpritePosition: SpritesPosition;
  generalProps?: GeneralProps;
}

export class Sprite {
  private spriteSrc: p5Types.Image;
  private sprites: Record<string, p5Types.Image[]>;
  currentSprite?: {
    name: string;
    position: number;
    images: p5Types.Image[];
  };
  generalProps: GeneralProps;

  currentSpriteImage: p5Types.Image;
  constructor({ spriteSrc, initialSpritePosition, generalProps }: SpriteProps) {
    this.spriteSrc = spriteSrc;
    this.sprites = {};
    this.generalProps = generalProps ?? {};

    const { x, y, width, height } = initialSpritePosition;
    this.currentSpriteImage = spriteSrc.get(x, y, width, height);
  }

  addSpriteAnimation(name: string, spritesPosition: SpritesPosition[]) {
    const imagesFormatted = spritesPosition.map(({ x, y, width, height }) => {
      return this.spriteSrc.get(x, y, width, height);
    });

    this.sprites[name] = imagesFormatted;
  }

  setSpritePosition(name: string) {
    const spriteToUpdate = this.sprites[name];
    if (!spriteToUpdate) {
      return;
    }

    if (this.currentSprite?.name === name) {
      let newPosition =
        this.currentSprite.position +
        1 / (this.generalProps.animationTime ?? 1);

      if (this.currentSprite.position >= this.currentSprite.images.length - 1) {
        newPosition = 0;
      }

      this.currentSprite.position = newPosition;
    } else {
      this.currentSprite = { name, images: spriteToUpdate, position: 0 };
    }

    this.currentSpriteImage =
      this.currentSprite.images[Math.floor(this.currentSprite.position)];
  }
  setCurrentSpritePosition(newPosition: number, spriteName?: string) {
    if (spriteName) {
      const spriteToUpdate = this.sprites[spriteName];
      if (spriteToUpdate) {
        this.currentSprite = {
          name: spriteName,
          images: spriteToUpdate,
          position: newPosition,
        };
        this.currentSpriteImage =
          this.currentSprite.images[this.currentSprite.position];
      }
    }

    if (this.currentSprite && this.currentSprite) {
      this.currentSprite.position = newPosition;

      this.currentSpriteImage =
        this.currentSprite.images[this.currentSprite.position];
    }
  }
}
