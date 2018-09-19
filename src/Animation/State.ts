export default class State {
  constructor(protected state = []) {
    //
  }

  public alive() {
    return this.all().filter(cell => cell.isAlive());
  }

  public all() {
    return this.state.reduce((acc, row) => acc.concat(row), []);
  }

  public set(row, column, cell) {
    this.state[row] = this.state[row] || [];
    this.state[row][column] = cell;
  }

  public get(row, column) {
    if (!Array.isArray(this.state[row]) || !this.state[row][column]) {
      return null;
    }

    return this.state[row][column];
  }

  public has(row, column) {
    return;
  }

  public apply(callback) {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        callback.call(this, this.get(i, j), i, j);
      }
    }
  }

  public neighborsOf(cell) {
    const neighbors = [];

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
