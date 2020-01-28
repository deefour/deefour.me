import {
  CELL_SIZE,
  CELL_PAD,
  MAX_ALPHA,
  MIN_ALPHA,
  ACTIVE_ALPHA,
  COLOR_CHANCE,
  COLORS,
} from '../constants';
import Board from './Board';

const COLOR_VALUES = Object.values(COLORS);

export default class Cell {
  protected alpha: number;
  protected size = CELL_SIZE;
  protected pad = CELL_PAD;
  protected alive = false;
  protected x: number;
  protected y: number;

  constructor(
    protected board: Board,
    protected row: number,
    protected column: number
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
      alpha *= distance / content.radius();
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
