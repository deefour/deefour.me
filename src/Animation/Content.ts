import { FADE_SCALE } from '../constants';

interface Position {
  x: number;
  y: number;
}

export default class Content {
  protected bounds: ClientRect;

  constructor(protected $content: Element) {
    this.bounds = this.$content.getBoundingClientRect();
  }

  public radius(): number {
    return Math.max(this.bounds.width, this.bounds.height) * FADE_SCALE;
  }

  public center(): Position {
    return {
      x: this.bounds.left + this.bounds.width / 2,
      y: this.bounds.top + this.bounds.height / 2,
    };
  }
}
