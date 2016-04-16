import ReversiBoard, { W, B, InvalidMoveError} from './ReversiBoard';
import {RandomPlay, HumanPlay} from './player';

export default class Game {
  constructor(opts = {}) {
    this.playerBlack = typeof opts.black == 'undefined' ? new RandomPlay(B) : new opts.black(B);
    this.playerWhite = typeof opts.white == 'undefined' ? new RandomPlay(W) : new opts.white(W);
    this.board = new ReversiBoard();
  }

  start() {
    while(this.board.getTurn() != null) {
      switch(this.board.getTurn()) {
        case W:
          this.playerWhite.move(this.board);
          break;
        case B:
          this.playerBlack.move(this.board);
          break;
        default:
          break;
      }
      this.board.logBoard();
    }
  }

  reset() {
    this.board = new ReversiBoard();
  }
}
