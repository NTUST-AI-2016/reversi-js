export default class Node {
  constructor(board, move=null) {
    this.gameState = { boardData: board.getBoardData(), turn: board.getTurn() };
    this.plays = 0;
    this.wins = 0;
    this.children = [];
    this.parent = null;
    this.movesExpanded = new Set();
    this.move = move;
  }

  addChild(node) {
    this.children = [...this.children, node];
    this.movesExpanded.add(node.move);
    node.parent = this;
    return this;
  }

  hasVisited(move) {
    return this.movesExpanded.has(move);
  }

  hasChildren() {
    return this.children.length > 0
  }

  getWinsPlays() {
    return {
      wins: this.wins,
      plays: this.plays
    }
  }
}
