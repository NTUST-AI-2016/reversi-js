import BasePlayer from './BasePlayer';
import readlineSync from 'readline-sync';

export default class HumanPlay extends BasePlayer {

  getMove(board) {
    var line = readlineSync.question('Enter position(x,y): ');
    var strs = line.trim().split(',')

    return strs.map(input => parseInt(input))
  }
}
