// ref1: https://github.com/andysalerno/reversi-ai
// ref2: http://www.cameronius.com/cv/mcts-survey-master.pdf
import BasePlayer from './BasePlayer';
import Node from './mcts/Node';
import ReversiBoard, { W, B } from '../ReversiBoard';
import '../utils';

export default class MctsPlayer extends BasePlayer {
  getMove(board) {
    var curBoard = this.boardFromState(board.getBoardData(), board._turn);
    var pos = this.monteCarloTreeSearch(curBoard)
    return pos;
  }

  monteCarloTreeSearch(board) {
    var rootNode = new Node(board);
    var simCount = 0

    var begin = new Date().getTime();
    while (new Date().getTime() - begin < 3000) {
      var pickedNode = this.treePolicy(rootNode);
      var result = this.simulate(pickedNode.gameState);
      this.backPropogation(pickedNode, result);
      simCount += 1;
    }

    for (let child in rootNode.children) {
      var {wins, plays} = rootNode.children[child].getWinsPlays();
      var position = rootNode.children[child].move;
      // console.log(`${position}: (${wins}/${plays})`);
    }
    // console.log(`${simCount} simulations performed.`);

    return this.bestAction(rootNode)
  }

  bestAction(node) {
    var mostPlays = Number.NEGATIVE_INFINITY;
    var bestWins = Number.NEGATIVE_INFINITY;
    var bestActions = [];

    for (let child in node.children) {
      var { wins, plays } = node.children[child].getWinsPlays();
      if (plays > mostPlays) {
        mostPlays = plays;
        bestActions = [node.children[child].move]
      } else if (plays == mostPlays) {
        if (wins > bestWins) {
          bestWins = wins
          bestActions = [node.children[child].move]
        } else if (wins == bestWins) {
          bestActions = [...bestActions, node.children[child].move]
        }
      }
    }

    // console.log(bestActions);
    // console.log(this.color);

    return bestActions[this.randomPick(0, bestActions.length-1)];
  }

  backPropogation(node, delta) {
    while(node.parent != null) {
      node.plays += 1;
      node.wins += delta;
      node = node.parent;
    }

    node.plays += 1;
    node.wins += delta;
  }

  treePolicy(rootNode) {
    var curNode = rootNode;

    while(true) {
      var legalMoves = this.boardFromState(curNode.gameState.boardData, curNode.gameState.turn).getValidPositions();
      if (legalMoves.length == 0) {
        if (this.boardFromState(curNode.gameState.boardData, curNode.gameState.turn).getWinner()) {
          // game is won
          return curNode;
        } else {
          var passNode = new Node(this.boardFromState(curNode.gameState.boardData, opponent(curNode.gameState.turn)));
          curNode.addChild(passNode);
          curNode = passNode;
          continue;
        }

      } else if (curNode.children.length < legalMoves.length ) { // not fully expanded
        var unexpanded = legalMoves.filter(move => !curNode.hasVisited(move) );
        // console.log(`unexpanded: ${unexpanded}, legalMoves: ${legalMoves}`);
        // for (var move in curNode.movesExpanded.values()) {console.log(`${move}, `)};

        var move = unexpanded[this.randomPick(0, unexpanded.length-1)];
        var nextBoard = this.boardFromState(curNode.gameState.boardData, curNode.gameState.turn).placePiece(curNode.gameState.turn, move[0], move[1]);
        var nextNode = new Node(nextBoard, move);

        curNode.addChild(nextNode);
        return nextNode;

      } else {
        curNode = this.bestChild(curNode);
      }
    }

    return curNode;
  }

  bestChild(node) {
    var C = 1; // 'exploration' value
    var max = { node: null, value: Number.NEGATIVE_INFINITY };

    for (var child in node.children) {
      var { wins, plays } = node.children[child].getWinsPlays();
      var { plays: parentPlays } = node.getWinsPlays();

      var value = (wins / plays) + C * Math.sqrt(2 * Math.log(parentPlays) / plays);
      if ( value > max.value ) {
        max.node = node.children[child];
        max.value = value;
      }
    }

    return max.node;
  }

  simulate(gameState) {
    const WIN_PRIZE = 1;
    const LOSS_PRIZE = 0;

    var state = Object.assign({}, gameState);

    while(true) {
      var curBoard = this.boardFromState(state.boardData, state.turn);
      var winner = curBoard.getWinner();

      if (winner) {
        return winner == this.color ? WIN_PRIZE : LOSS_PRIZE;
      }

      var moves = curBoard.getValidPositions();
      if (moves.length == 0) {
        state = Object.assign({}, state, {turn: opponent(state.turn)} );
        moves = this.boardFromState(state.boardData, state.turn).getValidPositions();
      }

      var pickedMove =  moves[this.randomPick(0, moves.length-1)];
      var nextBoard = this.boardFromState(state.boardData, state.turn).placePiece(state.turn, pickedMove[0], pickedMove[1]);
      state = {boardData: nextBoard.getBoardData(), turn: nextBoard._turn};
    }
  }

  randomPick(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  boardFromState(boardData, turn) {
    return new ReversiBoard().setBoardData([...boardData], turn);
  }
}
