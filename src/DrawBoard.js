import ReversiBoard, { W, B, InvalidMoveError} from './ReversiBoard';
import {MctsPlayer, RandomPlay} from './player';

var chessB = new Image();
var chessW = new Image();


chessB.src="images/blackChess.png";
chessW.src="images/whiteChess.png";

var images = [chessB, chessW];
var loadedCount = 0;

export function initialize() {
  window.board = new ReversiBoard();
  window.playerBlack = new MctsPlayer(B);
  window.playerWhite = null;

  for(var i = 0; i < 2; i++) {
    images[i].onload = function() {
      loadedCount++;
      if (loadedCount == 2) {
        checkMove();
        drawBoard();
      }
    }
  }
}

export function reset() {
  initialize();
}

export function drawBoard(){
  var canvas = window.document.getElementById("canvas");
  var context = canvas.getContext("2d");

  context.fillStyle = "#E4AC6A";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for(var count = 0; count <= 320; count += 40){
    context.beginPath();
    context.moveTo(0,count);
    context.lineTo(320,count);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(count,0);
    context.lineTo(count,320);
    context.closePath();
    context.stroke();
  }

  var boardData = window.board.getBoardData();

  // draw current chess
  for(var x = 0; x < 8; x++) {
    for(var y = 0; y < 8; y++) {
      if (boardData[x + y * 8] != null) {
        drawChess(context, x, y, boardData[x + y * 8])
      }
    }
  }
}

export function checkMove() {
  var turn = window.board.getTurn();
  console.log("checkMove");

  if (turn == B) {
    if (playerBlack != null) {
      var position = window.playerBlack.getMove(window.board);
      window.board.placePiece(B, position[0], position[1]);
    }
  }
  else if (turn == W) {
    if (playerWhite != null) {
      var position = window.playerWhite.getMove(window.board);
      window.board.placePiece(W, position[0], position[1]);
    }
  } else {
    gameOver();
  }

}

function gameOver() {
  console.log("OVERRRRR");
}

export function touchBoard(pos){
  var result = getCursorPosition(pos);

  var x = parseInt(result.x / 40);
  var y = parseInt(result.y / 40);

  console.log(x + ", " + y)

  if (window.board.isValidPosition(x, y)) {
    window.board.placePiece(window.board.getTurn(), x, y);
  }
  drawBoard();

  checkMove();
  drawBoard();
}

function getCursorPosition(event) {
    var canvas = window.document.getElementById("canvas");
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return {x, y};
}

export function drawChess(context, x, y, color){
  if( color == B ){
    context.drawImage(chessB, x * 40 + 1.5, y * 40 + 1.5);
  } else {
    context.drawImage(chessW, x * 40 + 1.5, y * 40 + 1.5);
  }
}
