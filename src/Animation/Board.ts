import {
  CELL_PAD,
  CELL_SIZE,
  KEEPALIVE,
  REPRODUCE,
  SEEDS,
  SEED_SIZE,
} from '../constants';

import Cell from './Cell';
import Content from './Content';
import State from './State';

/**
 * Board represents the canvas itself.
 */
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

  /**
   * Content instance getter for the main content div.
   *
   * @return {Content}
   */
  public content(): Content {
    return (this.cachedContent =
      this.cachedContent ?? new Content(this.$content));
  }

  public resize(width: number, height: number): this {
    this.width = width;
    this.height = height;

    this.$canvas.setAttribute('width', String(this.width));
    this.$canvas.setAttribute('height', String(this.height));

    return this;
  }

  public refresh(): this {
    // require the next call to content() instantiate a new Content instance
    this.cachedContent = null;

    // help garbage collect Cells currently on the board
    this.state.flush();

    // build up new Cells to use
    for (let i = 0; i < this.rows(); i++) {
      for (let j = 0; j < this.columns(); j++) {
        this.state.set(i, j, new Cell(this, i, j));
      }
    }

    // make some cells 'alive'
    this.seed();

    // draw everything.
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

  /**
   * On each tick of the animation, a new State will be created and filled with
   * cells.
   *
   * Cells that need to be killed or revitalized are cloned before being modified
   * and injected into the new State.
   */
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
