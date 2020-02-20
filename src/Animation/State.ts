import Cell from './Cell';

/**
 * State represents the current state of the board - a reference to each Cell on
 * the board and the position of each.
 */
export default class State {
  constructor(protected state = []) {
    //
  }

  /**
   * Destroy all cells currently in state
   */
  public flush(): void {
    this.state = [];
  }

  public alive(): Cell[] {
    return this.all().filter(cell => cell.isAlive());
  }

  public all(): Cell[] {
    return this.state.reduce((acc, row) => acc.concat(row), []);
  }

  public set(row, column, cell): void {
    this.state[row] = this.state[row] ?? [];
    this.state[row][column] = cell;
  }

  public get(row, column): Cell | undefined {
    return this.state?.[row]?.[column];
  }

  public apply(callback): void {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        callback.call(this, this.get(i, j), i, j);
      }
    }
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
