import './index.scss';

import { DEBOUNCE, FPS } from './constants';

import Board from './Animation/Board';
import debounce from 'lodash/debounce';

// preload the hover-state profile
new Image().src = require('./awesome.svg');

const $canvas = document.createElement('canvas');
const $content = document.querySelector('#container');

document.body.appendChild($canvas);

let board = null;

let then = Date.now();

const animate = (): void => {
  requestAnimationFrame(animate);

  const now = Date.now();
  const elapsed = now - then;

  if (elapsed > 1000 / FPS) {
    then = now - (elapsed % (1000 / FPS));

    board.tick();
  }
};

window.addEventListener('load', () => {
  board = new Board($canvas, $content)
    .resize(document.body.clientWidth, document.body.clientHeight)
    .refresh();

  animate();
});

window.addEventListener(
  'resize',
  debounce(() => {
    board
      .resize(document.body.clientWidth, document.body.clientHeight)
      .refresh();

    animate();
  }, DEBOUNCE)
);
