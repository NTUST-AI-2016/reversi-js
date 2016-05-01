import BasePlayer from './BasePlayer';

export default class RandomPlay extends BasePlayer {

  getMove(board) {
    var validPositions = board.getValidPositions();
    return validPositions[this.randomPick(0, validPositions.length-1)];
  }

  randomPick(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
}
