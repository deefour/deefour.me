import { FADE_SCALE } from '../constants';

interface Position {
  x: number;
  y: number;
}

/**
 * Content describes the location and size of the Element passed in during
 * instantiation.
 *
 * This class is created by the Board, and is used to determine the opacity of
 * individual Cells behind and near the main content div, making that content
 * stand out by increasing contrast between the content and board.
 */
export default class Content {
  protected bounds: ClientRect;

  constructor(protected $content: Element) {
    this.bounds = this.$content.getBoundingClientRect();
  }

  public radius(): number {
    return (Math.max(this.bounds.width, this.bounds.height) * FADE_SCALE) / 2;
  }

  public center(): Position {
    return {
      x: this.bounds.left + this.bounds.width / 2,
      y: this.bounds.top + this.bounds.height / 2,
    };
  }
}
