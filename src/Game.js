import ReversiBoard, { W, B, InvalidMoveError} from './ReversiBoard';
import {RandomPlay, MctsPlayer} from './player';

export default class Game {
  constructor(opts = {}) {
    this.playerBlack = typeof opts.black == 'undefined' ? new RandomPlay(B) : new opts.black(B);
    this.playerWhite = typeof opts.white == 'undefined' ? new MctsPlayer(W) : new opts.white(W);
    this.board = new ReversiBoard();
  }

  start() {
    while(this.board.getTurn() != null) {
      switch(this.board.getTurn()) {
        case W:
          var position = this.playerWhite.getMove(this.board);
          this.board.placePiece(W, position[0], position[1]);
          break;
        case B:
          var position = this.playerBlack.getMove(this.board);
          this.board.placePiece(B, position[0], position[1]);
          break;
        default:
          break;
      }
      this.board.logBoard();
    }

    console.log(`W: ${this.board.getScore(W)}, B: ${this.board.getScore(B)}`);
  }

  reset() {
    this.board = new ReversiBoard();
  }
}
