import 'babel-polyfill';
import './app.css';

const $canvas = document.createElement('canvas');
const $content = document.querySelector('div');

document.body.appendChild($canvas);

const FPS = 6;
const MIN_ALPHA = 0.02;
const MAX_ALPHA = 0.07;
const ACTIVE_ALPHA = 0.05;
const CELL_SIZE = 8;
const CELL_PAD = 1;
const SEEDS = 100;
const SEED_SIZE = 9;
const KEEPALIVE = [2, 3];
const REPRODUCE = [3];
const FADE_SCALE = 1.75;
const DEBOUNCE = 50;

let board = null;

class Content {

  constructor($content) {
    this.$content = $content;
    this.bounds = this.$content.getBoundingClientRect();
  }

  radius() {
    return Math.max(this.bounds.width, this.bounds.height) * FADE_SCALE;
  }

  center() {
    return {
      x: this.bounds.left + this.bounds.width / 2,
      y: this.bounds.top + this.bounds.height / 2
    };
  }

}


class Cell {

  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.alpha = Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA;
    this.size = CELL_SIZE;
    this.pad = CELL_PAD;
    this.alive = false;
    this.x = this.column * (this.size + this.pad);
    this.y = this.row * (this.size + this.pad);
  }

  draw(context) {
    context.fillStyle = this.color();

    context.clearRect(this.x, this.y, this.size, this.size);
    context.fillRect(this.x, this.y, this.size, this.size);
  }

  color() {
    const red = this.isAlive() ? 255 : 0;

    return `rgba(0, 0, 0, ${this.opacity()})`;
  }

  opacity() {
    let alpha = this.alpha;
    const content = board.content();

    if (this.isAlive()) {
      alpha += ACTIVE_ALPHA;
    }

    const distance = Math.sqrt(
      Math.pow(Math.abs(this.x - content.center().x), 2) + Math.pow(Math.abs(this.y - content.center().y), 2)
    );

    if (distance < content.radius()) {
      alpha *= distance / content.radius();
    }

    return alpha;
  }

  isAlive() {
    return this.alive;
  }

  isDead() {
    return ! this.isAlive();
  }

  clone() {
    return Object.assign(Object.create(this), this);
  }

}


class State {

  constructor(state = []) {
    this.state = state;
  }

  alive() {
    return this.all().filter(cell => cell.isAlive());
  }

  all() {
    return this.state.reduce((acc, row) => acc.concat(row), []);
  }

  set(row, column, cell) {
    this.state[row] = this.state[row] || [];
    this.state[row][column] = cell;
  }

  get(row, column) {
    if (!Array.isArray(this.state[row]) || !this.state[row][column]) {
      return null;
    }

    return this.state[row][column];
  }

  has(row, column) {
    return ;
  }

  apply(callback) {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        callback.call(this, this.get(i, j), i, j);
      }
    }
  }

  neighborsOf(cell) {
    const neighbors = [];

    for (let i = -1; i <=1; i++) {
      for (let j = -1; j <=1; j++) {
        const neighbor = this.get(cell.row + i, cell.column + j);

        if (neighbor && neighbor !== cell) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

}

class Board {

  constructor($canvas, $content) {
    this.$canvas = $canvas;
    this.state = new State;
    this.context = this.$canvas.getContext('2d');
    this.$content = $content;
  }

  content() {
    return this._content = this._content || new Content(this.$content);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.$canvas.setAttribute('width', this.width);
    this.$canvas.setAttribute('height', this.height);

    return this;
  }

  refresh() {
    this._content = null;

    for (let i = 0; i < this.rows(); i++) {
      for (let j = 0; j < this.columns(); j++) {
        this.state.set(i, j, new Cell(i, j));
      }
    }

    this.seed();

    this.state.apply(cell => cell.draw(this.context));

    return this;
  }

  rows() {
    return Math.ceil(this.height / (CELL_SIZE + CELL_PAD));
  }

  columns() {
    return Math.ceil(this.width / (CELL_SIZE + CELL_PAD));
  }

  seed() {
    for (let n = 0; n < SEEDS; n++) {
      const row = Math.floor(Math.random() * this.rows());
      const column = Math.floor(Math.random() * this.columns());

      const rows = Math.ceil(Math.random() * SEED_SIZE);
      const columns = Math.ceil(Math.random() * SEED_SIZE);

      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= columns; j++) {
          const cell = this.state.get(row + i, column + j);

          if (cell) {
            cell.alive = Math.random() < .5;
          }
        }
      }
    }

    return this;
  }

  seeds() {
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
            cell.alive = seed[i + 1][j + 1] === 1;
          }
        }
      }

    }

    return this;
  }

  tick() {
    const state = new State;

    this.state.apply(cell => {
      const neighbors = this.state.neighborsOf(cell)
        .filter(c => c.isAlive())
        .length;

      const keepAlive = () => cell.isAlive() && KEEPALIVE.includes(neighbors);
      const keepDead = () => cell.isDead() && ! REPRODUCE.includes(neighbors);

      if (keepAlive() || keepDead()) {
          state.set(cell.row, cell.column, cell);

          return;
      }

      const copy = cell.clone();

      copy.alive = ! copy.alive;

      state.set(cell.row, cell.column, copy);

      copy.draw(this.context);
    });

    this.state = state;

    return this;
  }

}

let then = Date.now();
let startTime = then;

const debounce = (func, wait) => {
  var timeout;

  return function () {
    const args = arguments;
    const later = () => {
      timeout = null;

      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (!timeout) {
      func.apply(this, args);
    }
  };
};

const animate = () => {
  requestAnimationFrame(animate);

  const now = Date.now();
  const elapsed = now - then;

  if (elapsed > 1000 / FPS) {
    then = now - (elapsed % (1000 / FPS));

    board.tick();
  }
};

window.addEventListener('load', () => {
  board = new Board($canvas, $content);

  board.resize(document.body.clientWidth, document.body.clientHeight).refresh();

  animate();
});

window.addEventListener('resize', debounce(() => {
  board.resize(document.body.clientWidth, document.body.clientHeight).refresh();

  animate();
}, DEBOUNCE));
