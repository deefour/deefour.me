import {
  CELL_PAD,
  CELL_SIZE,
  KEEPALIVE,
  REPRODUCE,
  SEEDS,
  SEED_SIZE,
  SEED_VITALITY,
} from '../constants';

import Cell from './Cell';
import Content from './Content';

/**
 * Board represents the canvas itself.
 */
export default class Board {
  protected context: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;
  protected cachedContent: Content;
  protected cells = [];

  constructor(
    protected $canvas: HTMLCanvasElement,
    protected $content: Element
  ) {
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

    // empty the cells array
    this.cells.splice(0, this.cells.length);

    // build up new Cells to use
    for (let i = 0; i < this.rows(); i++) {
      for (let j = 0; j < this.columns(); j++) {
        this.set(i, j, new Cell(this, i, j));
      }
    }

    // make some cells 'alive'
    this.seed();

    // draw everything.
    this.cells.forEach(cell => cell.draw(this.context));

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
          const cell = this.get(row + i, column + j);

          if (cell) {
            cell.setVitality(Math.random() < SEED_VITALITY);
          }
        }
      }
    }

    return this;
  }

  public tick(): this {
    const actionsQueue = [];

    this.cells.forEach((cell: Cell) => {
      const livingNeighborsCount = this.neighborsOf(cell).filter(c =>
        c.isAlive()
      ).length;

      if (cell.isAlive() && KEEPALIVE.includes(livingNeighborsCount)) {
        // keep the cell alive
        return;
      }

      if (cell.isDead() && !REPRODUCE.includes(livingNeighborsCount)) {
        // keep the cell dead
        return;
      }

      actionsQueue.push({
        cell,
        action: cell.isAlive() ? 'kill' : 'resurrect',
      });
    });

    actionsQueue.forEach(({ cell, action }) => {
      cell[action].call(cell);
      cell.draw(this.context);
    });

    return this;
  }

  public toIndex(row: number, column: number): number {
    return column + row * this.columns();
  }

  public set(row: number, column: number, cell: number): void {
    this.cells[this.toIndex(row, column)] = cell;
  }

  public get(row: number, column: number): Cell | undefined {
    return this.cells?.[this.toIndex(row, column)];
  }

  /**
   * Collect the neighboring cells around the one passed. If 'o' below is the passed
   * Cell, an array of Cells marked as 'x' below will be returned.
   *
   *   x x x
   *   x o x
   *   x x x
   *
   * @param {Cell} cell the cell to collect neighbors for
   * @return {Cell[]}
   */
  public neighborsOf(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const neighbor = this.get(cell.row + i, cell.column + j);

        if (neighbor && neighbor !== cell) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }
}
