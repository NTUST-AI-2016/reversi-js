import Game from '../src/Game.js';
import { RandomPlay, HumanPlay } from '../src/player';

var game = new Game({
  black: RandomPlay,
  white: HumanPlay
});

game.start();
