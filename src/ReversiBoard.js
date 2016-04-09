export const W = 1, B = 2;
export class InvalidMoveError {};

export default class ReversiBoard {

  constructor() {
    this._boardData = (new Array(8 * 8)).fill(null);
    this._boardData[3 + 3 * 8] = W;
    this._boardData[4 + 3 * 8] = B;
    this._boardData[3 + 4 * 8] = B;
    this._boardData[4 + 4 * 8] = W;
    this._turn = B;
    this._clearCache();
  }

  getBoardData() {
    return this._boardData;
  }

  getPosition(x, y) {
    return this._boardData[x + y * 8];
  }

  getTurn() {
    if (this.getValidPositions().length == 0) {
      if (this._turn == B) {
        this._turn = W;
      } else if (this._turn == W) {
        this._turn = B;
      }

      if (this.getValidPositions().length == 0) {
        this._turn = null;
      }
    }

    return this._turn;
  }

  flippedPositionsFor(x, y) {
    // Use cache if available
    if (typeof this._flippedPositionsCache[`${x}${y}`] === 'array') {
      return this._flippedPositionsCache[`${x}${y}`];
    }

    var flippedPositions = [];
    var currentBoardData = this.getBoardData();

    if (currentBoardData[x + y * 8] != null) {
      // Placing on a position that already has something on it is invalid, and
      // yet will flip nothing, so just leave flippedPositions blank without
      // doing anything else
    } else {
      for (let i=0; i<8; i++) {
        for (let j=0; j<8; j++) {
          if (this.willPositionFlip(i, j, x, y)) {
            flippedPositions.push([i, j]);
          }
        }
      }
    }

    // Keep the results in cache
    this._flippedPositionsCache[`${x}${y}`] = flippedPositions;

    return flippedPositions;
  }

  willPositionFlip(x, y, px, py) {
    var currentBoardData = this.getBoardData();

    // Placing on a position that already has something on it is invalid, and
    // yet will flip nothing
    if (currentBoardData[px + py * 8] != null) return false;

    // Use cache if available
    if (typeof this._flippedPositionsDataCache[`${px}${py}`] === 'array') {
      return this._flippedPositionsDataCache[`${px}${py}`][x + y * 8];
    }

    var currentTurn = this._turn;
    var flippedPositionsDataForPxPy = (new Array(8 * 8)).fill(false);

    for (let dx=-1; dx<=1; dx++) {
      for (let dy=-1; dy<=1; dy++) {
        if (dx == 0 && dy == 0) continue;

        let searchFootprints = [];
        let searchMove = 1;

        while (true) {
          let searchPositionX = px + dx * searchMove;
          let searchPositionY = py + dy * searchMove;
          let searchPosition = currentBoardData[searchPositionX + searchPositionY * 8];

          if (searchPositionX < 0 || searchPositionY < 0 || searchPositionX >= 8 || searchPositionY >= 8) {
            break;
          } else if (searchPosition != B && searchPosition != W) {
            break;

          } else if (searchPosition != currentTurn) {
            searchFootprints.push([searchPositionX, searchPositionY]);

          } else if (searchPosition == currentTurn) {
            searchFootprints.forEach((searchFootprint) => {
              flippedPositionsDataForPxPy[searchFootprint[0] + searchFootprint[1] * 8] = true;
            });
            break;
          }

          searchMove++;
        }
      }
    }

    // Keep the calculated data in cache
    this._flippedPositionsDataCache[`${px}${py}`] = flippedPositionsDataForPxPy;

    return flippedPositionsDataForPxPy[x + y * 8];
  }

  getValidPositions() {
    // Use cache if available
    if (typeof this._validPositionsCache === 'array') {
      return this._validPositionsCache;
    }

    var validPositions = [];

    for (let i=0; i<8; i++) {
      for (let j=0; j<8; j++) {
        if (this.isValidPosition(i, j)) {
          validPositions.push([i, j]);
        }
      }
    }

    // Keep the data in cache
    this._validPositionsCache = validPositions;

    return validPositions;
  }

  isValidPosition(x, y) {
    return (this.flippedPositionsFor(x, y).length > 0);
  }

  getScore(color) {
    if (typeof this._scoreCache[color] !== 'undefined') {
      return this._scoreCache[color];
    }

    var score = 0;

    for (let i=0; i<(8*8); i++) {
      if (this._boardData[i] == color) {
        score++;
      }
    }

    this._scoreCache[color] = score;

    return score;
  }

  placePiece(color, x, y) {
    if (color != this.getTurn()) throw new InvalidMoveError();
    if (!this.isValidPosition(x, y)) throw new InvalidMoveError();

    var positionsToFlip = this.flippedPositionsFor(x, y);

    this._boardData[x + y * 8] = color;
    positionsToFlip.forEach((flippedPosition) => {
      this._boardData[flippedPosition[0] + flippedPosition[1] * 8] = color;
    });

    if (color == W) {
      this._turn = B;
    } else if (color == B) {
      this._turn = W;
    }

    this._clearCache();
  }

  setBoardDataForTesting(boardData) {
    this._boardData = boardData;
    this._clearCache();
  }

  setTurnForTesting(turn) {
    this._turn = turn;
    this._clearCache();
  }

  _clearCache() {
    this._flippedPositionsDataCache = {};
    this._flippedPositionsCache = {};
    this._validPositionsCache = undefined;
    this._scoreCache = {};
  }

  logBoard() {
    var p = (c) => {
      if (c == null) return ' ';
      if (c == B) return 'X';
      if (c == W) return 'O';
    }

    var b = this._boardData;

    console.log('  0 1 2 3 4 5 6 7');
    for (let i=0; i<8; i++) {
      let line = [i];
      for (let j=0; j<8; j++) {
        line.push(p(b[i * 8 + j]));
      }
      console.log(line.join(' '));
    }
  }
}
