import { W, B } from '../ReversiBoard';

export function opponent(color) {
  return color == B ? W : B;
}
