import State from './State';
import Content from './Content';
import Cell from './Cell';
import {
  CELL_SIZE,
  CELL_PAD,
  SEED_SIZE,
  SEEDS,
  KEEPALIVE,
  REPRODUCE,
} from '../constants';

export default class Board {
  protected state: State;
  protected context: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;
  protected cachedContent: Content;

  constructor(
    protected $canvas: HTMLCanvasElement,
    protected $content: Element
  ) {
    this.state = new State();
    this.context = this.$canvas.getContext('2d');
  }

  public content(): Content {
    return (this.cachedContent =
      this.cachedContent || new Content(this.$content));
  }

  public resize(width, height): this {
    this.width = width;
    this.height = height;

    this.$canvas.setAttribute('width', String(this.width));
    this.$canvas.setAttribute('height', String(this.height));

    return this;
  }

  public refresh(): this {
    this.cachedContent = null;

    for (let i = 0; i < this.rows(); i++) {
      for (let j = 0; j < this.columns(); j++) {
        this.state.set(i, j, new Cell(this, i, j));
      }
    }

    this.seed();

    this.state.apply(cell => cell.draw(this.context));

    return this;
  }

  public rows(): number {
    return Math.ceil(this.height / (CELL_SIZE + CELL_PAD));
  }

  public columns(): number {
    return Math.ceil(this.width / (CELL_SIZE + CELL_PAD));
  }

  public seed(): this {
    for (let n = 0; n < SEEDS; n++) {
      const row = Math.floor(Math.random() * this.rows());
      const column = Math.floor(Math.random() * this.columns());

      const rows = Math.ceil(Math.random() * SEED_SIZE);
      const columns = Math.ceil(Math.random() * SEED_SIZE);

      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= columns; j++) {
          const cell = this.state.get(row + i, column + j);

          if (cell) {
            cell.setVitality(Math.random() < 0.5);
          }
        }
      }
    }

    return this;
  }

  public seeds(): this {
    const seed = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];

    for (let n = 0; n < SEEDS; n++) {
      const row = Math.floor(Math.random() * this.rows());
      const column = Math.floor(Math.random() * this.columns());

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const cell = this.state.get(row + i, column + j);

          if (cell) {
            cell.setVitality(seed[i + 1][j + 1] === 1);
          }
        }
      }
    }

    return this;
  }

  public tick(): this {
    const state = new State();

    this.state.apply(cell => {
      const neighbors = this.state.neighborsOf(cell).filter(c => c.isAlive())
        .length;

      const keepAlive = (): boolean =>
        cell.isAlive() && KEEPALIVE.includes(neighbors);
      const keepDead = (): boolean =>
        cell.isDead() && !REPRODUCE.includes(neighbors);

      if (keepAlive() || keepDead()) {
        state.set(cell.row, cell.column, cell);

        return;
      }

      const copy = cell.clone();

      copy.alive = !copy.alive;

      state.set(cell.row, cell.column, copy);

      copy.draw(this.context);
    });

    this.state = state;

    return this;
  }
}
