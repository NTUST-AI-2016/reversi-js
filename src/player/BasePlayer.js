export default class BasePlayer {
  constructor(color) {
    this.color = color;
  }

  getMove() {
    throw "Method Not Implemented"
  }
}
