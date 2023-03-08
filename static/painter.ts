/// Drawing tools

export enum Color {
  White,
  Black,
  Red,
  Green,
  Blue,
}

export const SIZE = 20;

/**
 * Our main drawing canvas. Canvas' origin (its (0, 0) point) is in the top left corner.
 */
export class Drawing {
  private canvas: Color[][];

  constructor() {
    this.canvas = [];
    for (let i = 0; i < SIZE; i += 1) {
      this.canvas.push([]);

      for (let j = 0; j < SIZE; j += 1) {
        this.canvas[i].push(Color.White);
      }
    }
  }

  /** Set a single pixel */
  setPixel(x: number, y: number, color: Color) {
    assert(x >= 0 && x < SIZE, `x should be in [0, ${SIZE}) range`);
    assert(y >= 0 && y < SIZE, `y should be in [0, ${SIZE}) range`);
    this.canvas[x][y] = color;
  }

  /** Draw a border around canvas */
  border(color: Color) {
    for (let x = 0; x < SIZE; x += 1) {
      this.setPixel(x, 0, color);
      this.setPixel(x, SIZE - 1, color);
    }

    for (let y = 0; y < SIZE; y += 1) {
      this.setPixel(0, y, color);
      this.setPixel(SIZE - 1, y, color);
    }
  }

  /**
   * Draw a vertical line at x, starting from y.
   */
  vl(x: number, fromY: number, height: number, color: Color) {
    for (let y = 0; y < height; y += 1) {
      this.setPixel(x, y + fromY, color);
    }
  }

  /** Complete the drawing */
  complete(): Color[][] {
    return this.canvas;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(msg);
  }
}
