import BasePlayer from './BasePlayer';

export default class RandomPlay extends BasePlayer {

  move(board) {
    var validPositions = board.getValidPositions();
    var pos = validPositions[this.randomPick(0, validPositions.length-1)];
    board.placePiece(this.color, pos[0], pos[1]);
    return board;
  }

  randomPick(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
}
