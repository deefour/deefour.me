/**
 * Cell attributes
 * -----------------------------------------------------------------------------
 */

/**
 * Pixel dimension each square cell should be represented by on the canvas
 *
 * @var {Number}
 */
export const CELL_SIZE = 8;

/**
 * Pixels between each cell
 *
 * @var {Number}
 */
export const CELL_PAD = 1;

/**
 * Minimum acceptable opacity for a cell.
 *
 * @var {Number}
 */
export const MIN_ALPHA = 0.09;

/**
 * Maximum acceptable opacity for a cell.
 *
 * @var {Number}
 */
export const MAX_ALPHA = 0.13;

/**
 * When a cell is alive, it's opacity should be boosted to this value.
 *
 * @var {Number}
 */
export const ACTIVE_ALPHA = 0.18;

/**
 * Percentage chance a cell will give itself an accent color when drawn.
 *
 * @var {Number}
 */
export const COLOR_CHANCE = 0.3;

/**
 * The colors used for the default (comment) and accents when each cell is drawn.
 *
 * @link https://github.com/dracula/dracula-theme
 */
export const COLORS = {
  comment: [98, 114, 164],
  cyan: [139, 233, 253],
  green: [80, 250, 123],
  orange: [255, 184, 108],
  pink: [255, 121, 198],
  purple: [189, 147, 249],
  red: [255, 85, 85],
  yellow: [241, 250, 140],
};

/**
 * Board seeding
 * -----------------------------------------------------------------------------
 */

/**
 * The number of seed groups to place on the board.
 *
 * @var {Number}
 */
export const SEEDS = 100;

/**
 * The max number of rows or columns a seed group should cover
 *
 * @var {Number}
 */
export const SEED_SIZE = 9;

/**
 * The percent chance a cell within a seed group will initially be alive
 *
 * @var {Number}
 */
export const SEED_VITALITY = 0.5;

/**
 * Iteration
 * -----------------------------------------------------------------------------
 */

/**
 * When the # of alive neighbors to a cell is found within this pool, that cell
 * will remain alive for the next animation step.
 *
 * @var {Number[]}
 */
export const KEEPALIVE = [2, 3];

/**
 * When the # of alive neighbors to a cell is found within this pool, that cell
 * will newly become alive on the next animation step.
 *
 * @var {Number[]}
 */
export const REPRODUCE = [3];

/**
 * Board settings
 * -----------------------------------------------------------------------------
 */

/**
 * Cap for the frame rate
 */
export const FPS = 12;

/**
 * how long the animation should run (in seconds)
 */
export const RUNTIME = 90;

/**
 * The larger dimension of the content div is used to create a radius within which
 * cells are given additional transparency. The closer a cell is to the center of
 * the circle created by this radius, the more transparency it receives.
 *
 * The content div dimension is given this scaling factor when determing the radius
 * within which the 'fade' should begin.
 */
export const FADE_SCALE = 1.35;

/**
 * Resize debounce delay
 *
 * @var {Number}
 */
export const DEBOUNCE = 50;
