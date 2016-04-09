import assert from 'assert';

import ReversiBoard, { W, B, InvalidMoveError } from '../src/ReversiBoard';

// Set these consts for more visual clarity on placing test bord data
const O = W, X = B, _ = null;

describe('ReversiBoard', () => {
  // https://en.wikipedia.org/wiki/Reversi
  it("starts with starting position", () => {
    var board = new ReversiBoard();
    for (var i=0; i<8; i++) {
      for (var j=0; j<8; j++) {
        if (i == 3 && j == 3) {
          assert.equal(board.getPosition(i, j), W);
        } else if (i == 4 && j == 3) {
          assert.equal(board.getPosition(i, j), B);
        } else if (i == 3 && j == 4) {
          assert.equal(board.getPosition(i, j), B);
        } else if (i == 4 && j == 4) {
          assert.equal(board.getPosition(i, j), W);
        } else {
          assert.equal(board.getPosition(i, j), null);
        }
      }
    }
  });

  it("starts with black's turn", () => {
    var board = new ReversiBoard();
    assert.equal(board.getTurn(), B);
  });

  describe("getTurn()", () => {
    it("returns the current turn", () => {
      var board = new ReversiBoard();
      assert.equal(board.getTurn(), B);
      board.placePiece(B, 3, 2);
      assert.equal(board.getTurn(), W);
    });

    it("returns the next turn if current turn has no moves", () => {
      var board = new ReversiBoard();
      board.setBoardDataForTesting([
        _, _, _, _, X, X, X, X,
        _, _, _, _, X, X, X, X,
        _, _, _, _, O, X, X, X,
        _, _, _, O, X, O, X, X,
        _, _, _, X, X, X, X, X,
        _, O, O, O, X, X, X, X,
        _, O, _, X, X, X, X, X,
        X, X, X, X, X, X, X, X,
      ]);
      board.setTurnForTesting(W);
      // since W have no moves...
      assert.equal(board.getTurn(), B);
    });

    context("game ends", () => {
      it("returns null", () => {
        // The grid is completely filled, game ends
        var board = new ReversiBoard();
        board.setBoardDataForTesting([
          O, O, O, O, O, O, O, O,
          X, X, X, X, O, X, X, O,
          O, O, X, O, O, X, O, O,
          O, O, O, O, X, X, X, O,
          O, X, O, O, O, O, X, O,
          O, O, X, O, O, O, O, O,
          O, O, O, O, O, O, O, O,
          O, O, O, O, O, O, O, O,
        ]);
        assert.equal(board.getTurn(), null);

        // Game ends before the grid is completely filled
        var board = new ReversiBoard();
        board.setBoardDataForTesting([
          O, O, O, O, O, O, O, O,
          O, O, O, O, O, O, O, O,
          O, O, O, O, O, O, O, O,
          O, O, O, O, O, O, O, _,
          O, O, O, O, O, O, _, _,
          O, O, O, O, O, O, _, X,
          O, O, O, O, O, O, O, _,
          O, O, O, O, O, O, O, O,
        ]);
        assert.equal(board.getTurn(), null);
      });
    });
  });

  describe("getScore()", () => {
    it("returns the current score", () => {
      var board = new ReversiBoard();
      board.setBoardDataForTesting([
        _, _, _, _, _, _, _, _,
        _, _, _, _, _, _, _, _,
        _, _, X, _, O, X, _, _,
        _, _, O, O, O, X, O, _,
        _, _, _, X, O, X, _, _,
        _, _, X, _, O, X, _, _,
        _, _, _, _, _, _, _, _,
        _, _, _, _, _, _, _, _,
      ]);
      assert.equal(board.getScore(B), 7);
      assert.equal(board.getScore(W), 7);

      var board = new ReversiBoard();
      board.setBoardDataForTesting([
        O, O, O, O, O, O, O, O,
        X, X, X, X, O, X, X, O,
        O, O, X, O, O, X, O, O,
        O, O, O, O, X, X, X, O,
        O, X, O, O, O, O, X, O,
        O, O, X, O, O, O, O, O,
        O, O, O, O, O, O, O, O,
        O, O, O, O, O, O, O, O,
      ]);
      assert.equal(board.getScore(B), 14);
      assert.equal(board.getScore(W), 50);
    });
  });

  describe("placePiece()", () => {
    context("black places a piece", () => {
      it("flips pieces lying on a straight line between the new piece andany anchoring dark pieces", () => {
        var board = new ReversiBoard();
        board.placePiece(B, 3, 2);
        assert.equal(board.getPosition(3, 2), B);
        assert.equal(board.getPosition(3, 3), B);
        assert.equal(board.getPosition(3, 4), B);
        assert.equal(board.getPosition(4, 3), B);
        assert.equal(board.getPosition(4, 4), W);
      });

      it("updates the current score", () => {
        var board = new ReversiBoard();
        board.placePiece(B, 3, 2);
        assert.equal(board.getScore(B), 4);
        assert.equal(board.getScore(W), 1);
      });

      context("black places a piece on a invalid position", () => {
        it("throws an error", () => {
          var board = new ReversiBoard();
          assert.throws(() => {
            board.placePiece(B, 1, 1);
          }, InvalidMoveError);

          var board = new ReversiBoard();
          assert.throws(() => {
            board.placePiece(B, 3, 3);
          }, InvalidMoveError);
        });
      });

      context("black places a piece while it is not black's move", () => {
        it("throws an error", () => {
          var board = new ReversiBoard();
          board.placePiece(B, 3, 2);
          assert.throws(() => {
            board.placePiece(B, 5, 5);
          }, InvalidMoveError);
        });
      });
    });

    context("white places a piece", () => {
      it("flips pieces lying on a straight line between the new piece and any anchoring dark pieces", () => {
        var board = new ReversiBoard();
        board.setBoardDataForTesting([
          _, _, _, _, O, _, _, O,
          _, _, _, _, O, X, O, _,
          _, _, _, _, X, X, _, _,
          _, _, X, X, X, X, _, _,
          _, _, X, X, X, X, _, _,
          _, _, X, X, O, X, _, _,
          _, _, X, _, O, _, _, _,
          _, _, _, _, _, _, _, _,
        ]);
        board.setTurnForTesting(W);

        board.placePiece(W, 6, 3);

        assert.equal(board.getBoardData(), [
          _, _, _, _, O, _, _, O,
          _, _, _, _, O, X, O, _,
          _, _, _, _, X, O, _, _,
          _, _, X, X, X, X, O, _,
          _, _, X, X, X, O, _, _,
          _, _, X, X, O, X, _, _,
          _, _, X, _, O, _, _, _,
          _, _, _, _, _, _, _, _,
        ]);
      });

      it("updates the current score", () => {
        var board = new ReversiBoard();
        board.setBoardDataForTesting([
          _, _, _, _, _, _, _, _,
          _, _, _, _, _, _, _, _,
          _, _, _, _, _, _, _, _,
          _, _, X, X, X, _, _, _,
          _, _, _, X, O, _, _, _,
          _, _, _, _, _, _, _, _,
          _, _, _, _, _, _, _, _,
          _, _, _, _, _, _, _, _,
        ]);
        board.setTurnForTesting(W);

        board.placePiece(W, 3, 3);

        assert.equal(board.getScore(W), 3);
        assert.equal(board.getScore(B), 3);
      });

      context("white places a piece on a invalid position", () => {
        it("throws an error", () => {
          var board = new ReversiBoard();
          board.setBoardDataForTesting([
            _, _, _, _, _, _, _, _,
            _, _, _, _, _, _, _, _,
            _, _, _, _, _, _, _, _,
            _, _, X, X, X, _, _, _,
            _, _, _, X, O, _, _, _,
            _, _, _, _, _, _, _, _,
            _, _, _, _, _, _, _, _,
            _, _, _, _, _, _, _, _,
          ]);
          board.setTurnForTesting(W);

          assert.throws(() => {
            board.placePiece(W, 5, 5);
          }, InvalidMoveError);

          assert.throws(() => {
            board.placePiece(W, 1, 1);
          }, InvalidMoveError);

          assert.throws(() => {
            board.placePiece(W, 3, 3);
          }, InvalidMoveError);
        });
      });

      context("white places a piece while it is not white's move", () => {
        it("throws an error", () => {
          var board = new ReversiBoard();

          assert.throws(() => {
            board.placePiece(W, 3, 5);
          }, InvalidMoveError);
        });
      });
    });
  });
});
