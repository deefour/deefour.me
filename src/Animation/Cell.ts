import {
  ACTIVE_ALPHA,
  CELL_PAD,
  CELL_SIZE,
  COLORS,
  COLOR_CHANCE,
  MAX_ALPHA,
  MIN_ALPHA,
} from '../constants';

import Board from './Board';

const COLOR_VALUES = Object.values(COLORS);

/**
 * A Cell represents a single block on the Board.
 *
 * It's opacity is randomly determined during instantiation. When 'alive', its
 * color will standout from neighboring 'dead' Cells.
 */
export default class Cell {
  protected alpha: number;
  protected size = CELL_SIZE;
  protected pad = CELL_PAD;
  protected alive = false;
  protected x: number;
  protected y: number;

  constructor(
    protected board: Board,
    public readonly row: number,
    public readonly column: number
  ) {
    this.alpha = Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA;
    this.x = this.column * (this.size + this.pad);
    this.y = this.row * (this.size + this.pad);
  }

  public draw(context): void {
    context.fillStyle = this.color();

    context.clearRect(this.x, this.y, this.size, this.size);
    context.fillRect(this.x, this.y, this.size, this.size);
  }

  public color(): string {
    // should the cell be colored?
    const inColor = Math.random() <= COLOR_CHANCE;

    let colorRGB = COLORS.comment; // default

    if (this.isAlive()) {
      colorRGB = COLORS.cyan;
    } else if (inColor) {
      colorRGB = COLOR_VALUES[Math.floor(Math.random() * COLOR_VALUES.length)];
    }

    const [r, g, b] = colorRGB;

    return `rgba(${r}, ${g}, ${b}, ${this.opacity()})`;
  }

  public opacity(): number {
    let alpha = this.alpha;
    const content = this.board.content();

    if (this.isAlive()) {
      alpha += ACTIVE_ALPHA;
    }

    const distance = Math.sqrt(
      Math.pow(Math.abs(this.x - content.center().x), 2) +
        Math.pow(Math.abs(this.y - content.center().y), 2)
    );

    if (distance < content.radius()) {
      alpha = Math.max(0.04, alpha * Math.pow(distance / content.radius(), 4));
    }

    return alpha;
  }

  public isAlive(): boolean {
    return this.alive;
  }

  public resurrect(): void {
    this.alive = true;
  }

  public kill(): void {
    this.alive = false;
  }

  public setVitality(spare: boolean): void {
    spare ? this.resurrect() : this.kill();
  }

  public isDead(): boolean {
    return !this.isAlive();
  }

  public clone(): this {
    return Object.assign(Object.create(this), this);
  }
}
