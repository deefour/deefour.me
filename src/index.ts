import { FPS, DEBOUNCE } from './constants';
import Board from './Animation/Board';
import './index.scss';

const $canvas = document.createElement('canvas');
const $content = document.querySelector('div');

document.body.appendChild($canvas);

let board = null;

let then = Date.now();
const startTime = then;

const debounce = (func, wait) => {
  let timeout;

  return function() {
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

window.addEventListener(
  'resize',
  debounce(() => {
    board
      .resize(document.body.clientWidth, document.body.clientHeight)
      .refresh();

    animate();
  }, DEBOUNCE)
);
