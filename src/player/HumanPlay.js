import BasePlayer from './BasePlayer';
import readlineSync from 'readline-sync';

export default class HumanPlay extends BasePlayer {
  move(board) {
    var line = readlineSync.question('Enter position(x,y): ');
    var strs = line.trim().split(',')
    board.placePiece(this.color, parseInt(strs[0]), parseInt(strs[1]));
    return board;
  }
}
