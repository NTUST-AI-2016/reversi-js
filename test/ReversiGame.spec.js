import { assert } from 'chai';

import Game from '../src/Game.js';
import {RandomPlay, HumanPlay} from '../src/player';

describe('ReversiBoard', () => {
  it("start new game", () => {
    var game = new Game({
      black: RandomPlay,
      white: RandomPlay
    });

    game.start();
    assert.equal(true, true);
  });

  // it("wait for human inputs", () => {
  //   var game = new Game({
  //     black: RandomPlay,
  //     white: HumanPlay
  //   });

  //   game.start();

  //   assert.equal(game.state, Game.WHITE_TURN);

  //   // random pick from available moves
  //   var positions = game.getValidPositions();
  //   game.placeAt(positions[0][0], positions[0][1]);

  //   assert.equal(game.state, Game.WHITE_TURN);
  // });
});
