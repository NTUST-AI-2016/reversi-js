// JavaScript Document

var chessB = new Image();
var chessW = new Image();
var chessG = new Image();

chessB.src="images/blackChess.png";
chessW.src="images/whiteChess.png";
chessG.src="images/greenChess.png";

var empty=0;
var black=1;
var white=2;
var legal=3;
var bound=4;
var depth=100;

var AIcolor;
var Usercolor;
var turn=false; //黑白棋要確認當前是哪方，不像五子棋是兩方交替那麼簡單


var testBoard=[
bound,bound,bound,bound,bound,bound,bound,bound,bound,bound,
bound,empty,empty,empty,empty,empty,empty,empty,empty,bound,
bound,empty,empty,empty,empty,empty,empty,empty,empty,bound,
bound,empty,empty,empty,empty,empty,empty,empty,empty,bound,
bound,empty,empty,empty,white,black,empty,empty,empty,bound,
bound,empty,empty,empty,black,white,empty,empty,empty,bound,
bound,empty,empty,empty,empty,empty,empty,empty,empty,bound,
bound,empty,empty,empty,empty,empty,empty,empty,empty,bound,
bound,empty,empty,empty,empty,empty,empty,empty,empty,bound,
bound,bound,bound,bound,bound,bound,bound,bound,bound,bound
];


var scoreBoard=[

 90, -60,10,10,10,10,-60, 90,
-60, -80, 5, 5, 5, 5,-80,-60,
 10,   5, 1, 1, 1, 1,  5, 10,
 10,   5, 1, 1, 1, 1,  5, 10,
 10,   5, 1, 1, 1, 1,  5, 10,
 10,   5, 1, 1, 1, 1,  5, 10,
-60, -80, 5, 5, 5, 5,-80,-60,
 90, -60,10,10,10,10,-60, 90

];


var direction = [1,-1,9,-9,10,-10,11,-11];

function drawBoard(){
  canvas=document.getElementById("canvas");
  context=canvas.getContext("2d");
  for(var count=0;count <= 320; count+=40){
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
}

function touchBoard(pos){
  var x = parseInt((pos.clientX)/40);
  var y = parseInt((pos.clientY)/40);
  var position=10*y+x+11;
  if(noLegal(2,1) && noLegal(1,2)){
    turn =false;
    alert("Game is end.");
  }else{
  if(turn){
    if(isLegal(2,1,position)){
      touchMove(2,1,position,testBoard);
      renewState();
      turn=false;
      play();
    }else{
      alert("It is not legal position.");
    }
  }else{
    alert("It is not your turn");
  }
  }
}

function drawChess(color,x,y){

  if(color==1){
    context.drawImage(chessB,x*40,y*40);
  }else if(color==2){
    context.drawImage(chessW,x*40,y*40);
  }else if(color==3){
    context.drawImage(chessG,x*40,y*40);
  }

}

function renewState(){
    context.clearRect(0,0,320,320);
  drawBoard();
  for(var i=11;i<89;i++){
    if(testBoard[i]!=empty){
        var x=i%10-1;
      var y=Math.floor(i/10)-1;
      drawChess(testBoard[i],x,y);
    }
  }
}



function initialState(){
  for(var i=11;i<89;i++){
    if(testBoard[i]!=empty){
        var x=i%10-1;
      var y=Math.floor(i/10)-1;
      drawChess(testBoard[i],x,y);
    }
  }
  play();

}

function findLegal(){
  var legal_pos=new Array(1);
  var count=0;
  legal_pos[0]=count;

  for(var i=11;i<89;i++){
    if(testBoard[i]==empty && isLegal(1,2,i)){

       legal_pos.splice(legal_pos.length ,0 ,i);
       count++;
       legal_pos[0]=count;
    }
    //alert(i);
  }

  return legal_pos;

}

function isLegal(test_color,opp_color,pos){
  var scan;
  if(testBoard[pos]==empty){
  for(var i=0;i<8;i++){
        scan=pos;  //這很重要
      scan+=direction[i];
      if(testBoard[scan]==opp_color){
        scan+=direction[i];
        while(testBoard[scan]==opp_color)scan+=direction[i];
        if(testBoard[scan]==test_color){
           var x=pos%10-1;
               var y=Math.floor(pos/10)-1;
               //drawChess(legal,x,y);

           return true;

        }
      }
  }
  return false;
  }

}


function noLegal(test_color,opp_color){
  for(var i=11;i<89;i++){
    if(testBoard[i]==empty && isLegal(test_color,opp_color,i)){
      return false;
    }
  }
  return true;
}


function touchMove(test_color,opp_color,pos,board){
    var scan;

  for(var i=0;i<8;i++){
        scan=pos;  //這很重要
      scan+=direction[i];
      if(board[scan]==opp_color){
        scan+=direction[i];
        while(board[scan]==opp_color)scan+=direction[i];
        if(board[scan]==test_color){
          board[pos]=test_color; //空的那格
          for(var c=pos+direction[i];c!=scan;c+=direction[i]){
            board[c]=test_color;

          }
        }
      }
  }

}


function play(){
  var legal_pos;
  var count;
  var pos;

    if(noLegal(2,1) && noLegal(1,2)){
    alert("Game is end.");
  }else{
    if(!turn){
      pos=moveWithMinmax();
      touchMove(1,2,pos,testBoard);
        renewState();
    }
      turn = true;
  //判斷二者皆沒得下了，結束
  }

}

function evaluate(color,board){
  var count_score;
  var legal_pos;

  var mobility;
  var boardS=0;

  var m_weight=7;
  var b_weight=4;

  legal_pos=findLegal();


  mobility=legal_pos[0];

  for(i=11;i<89;i++){
    if(board[i]==color){
      boardS+=scoreBoard[i-11];
    }
  }

  count_score=m_weight*mobility+b_weight*boardS;
  return count_score;


}


function minmax(turn,depth,alpha,beta,board){

  var score;
  //alert("ISSS>"+depth);
  var c_board = board.slice();

  if(depth==0){
    //alert("button");
    return evaluate(1,c_board);

  }


  if(!turn){
    var value=-9999;
    for(i=11;i<89;i++){
      if(isLegal(1,2,i)){

        touchMove(1,2,i,c_board);
        score=minmax(true,depth-1,alpha,beta,c_board);
        //alert(score);
        if(score>value){
          value=score;
          //alert("YES"+score);
        }

        alpha=Math.max(alpha,score);
        //alert("Alpha"+alpha);
        if(alpha>=beta){
          //包含等號因為一樣的出去沒超過既有的value也無法取代，所以乾脆砍了
          break;
        }

      }
    }
  }
  if(turn){
    var value=9999
    for(i=11;i<89;i++){
      if(isLegal(2,1,i)){
        touchMove(2,1,i,c_board);
        score=minmax(false,depth-1,alpha,beta,c_board);
        //alert("White");
        if(score<value){
          value=score;
        }

        alpha=Math.min(beta,score);
        if(alpha<=beta){
          //包含等號因為一樣的出去沒超過既有的value也無法取代，所以乾脆砍了
          break;
        }

      }
    }
  }
  //alert("value is "+value);
  return value;
}


function moveWithMinmax(){
  var value=-9999;
  var score;
  var pos;

  for(var i=11;i<89;i++){

      if(isLegal(1,2,i)){

      score=minmax(false,depth,-9999,9999,testBoard);
      //alert("SSSS"+score);
      if(score>value){
        value=score;
        pos=i;
      }
      }
  }
  return pos;
}

