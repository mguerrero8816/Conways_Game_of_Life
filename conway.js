// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by over-population.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

var BOARDWIDTH = 50;
var BOARDHEIGHT = 30;
var ALIVE = 1;
var DEAD = 0;
var ROUNDS = 10;
var ROUNDTIME = 300; //in miliseconds
var lastCell;
var jsGameBoard = []

function createBoard(){
  var cellNumber = 0;
  for(var i = 0; i < BOARDHEIGHT; i++){
    var row = $("#gameBoard").append("<tr></tr>");
    for(var y = 0; y < BOARDWIDTH; y++){
      jsGameBoard[cellNumber] = DEAD;
      $(row).append('<td id="' + cellNumber + '"></td>');
      cellNumber++
    }
  }
  return cellNumber
}

function randomizeBoard(board){
  newBoard = []
  for(var i = 0; i < lastCell; i++){
    var condition = Math.floor(Math.random()*2);
    newBoard[i] = condition;
    if(condition === ALIVE){
      $("#" + i).addClass("cellAlive");
    }
  }
  return newBoard;
}

//determines if edge cases are true
function isInRightColumn(location){
  return location%BOARDWIDTH === BOARDWIDTH - 1;
}

function isInLeftColumn(location){
  return location%BOARDWIDTH === 0;
}

function isInTopRow(location){
  return location < BOARDWIDTH;
}

function isInBottomRow(location){
  return location >= (BOARDWIDTH)*(BOARDHEIGHT-1);
}

//Purpse: counts the number of living neighbors and returns that number
//Signature: Array, Integer -> Integer
function countLiveNeighbors(board, location){
  var liveNeighbors = 0;
  //check above
  if(board[location - BOARDWIDTH] === ALIVE && !isInTopRow(location)){
    liveNeighbors++;
  }
  //check below
  if(board[location + BOARDWIDTH] === ALIVE && !isInBottomRow(location)){
    liveNeighbors++;
  }
  //check right
  if(board[location + 1] === ALIVE && !isInRightColumn(location)){
    liveNeighbors++;
  }
  //check left
  if(board[location - 1] === ALIVE && !isInLeftColumn(location)){
    liveNeighbors++;
  }
  //check aboveright
  if(board[location - BOARDWIDTH + 1] === ALIVE && !isInTopRow(location) && !isInRightColumn(location)){
    liveNeighbors++;
  }
  //check aboveleft
  if(board[location - BOARDWIDTH - 1] === ALIVE && !isInTopRow(location) && !isInLeftColumn(location)){
    liveNeighbors++;
  }
  //check belowright
  if(board[location + BOARDWIDTH + 1] === ALIVE && !isInBottomRow(location) && !isInRightColumn(location)){
    liveNeighbors++;
  }
  //check belowleft
  if(board[location + BOARDWIDTH - 1] === ALIVE && !isInBottomRow(location) && !isInLeftColumn(location)){
    liveNeighbors++;
  }
  return liveNeighbors;
}

function killCell(board, location){
  if(countLiveNeighbors(board, location) < 2){
    return DEAD;
  }
  if(countLiveNeighbors(board, location) === 2 || countLiveNeighbors(board, location) === 3){
    return ALIVE;
  }
  if(countLiveNeighbors(board, location) > 3){
    return DEAD;
  }
}

function reviveCell(board, location){
  if(board[location] === DEAD && countLiveNeighbors(board, location) === 3){
    return ALIVE;
  }
  return DEAD;
}

function newCellCondition(board, location){
  if(board[location] === ALIVE){
    return killCell(board, location);
  }
  if(board[location] === DEAD){
    return reviveCell(board, location);
  }
}

function updateBoard(board){
  updatedBoard = [];
  for(var i = 0; i < board.length; i++){
    updatedBoard[i] = newCellCondition(board, i);
    if(newCellCondition(board, i) === ALIVE){
      $("#" + i).addClass("cellAlive");
    }
    if(newCellCondition(board, i) === DEAD){
      $("#" + i).removeClass("cellAlive");
    }
  }
  return updatedBoard;
}

function playGame(){
  for(var i = 0; i < ROUNDS; i++){
    jsGameBoard = updateBoard(jsGameBoard);
    alert('hi');
  }
}

$(document).ready(function(){
  lastCell = createBoard();

  // jsGameBoard[1] = ALIVE;
  // jsGameBoard[2] = ALIVE;
  // jsGameBoard[11] = ALIVE;
  // jsGameBoard[12] = ALIVE;
  //
  // jsGameBoard[15] = ALIVE;
  // jsGameBoard[16] = ALIVE;
  // jsGameBoard[17] = ALIVE;

  jsGameBoard = randomizeBoard(jsGameBoard);

  setInterval(function(){
    jsGameBoard = updateBoard(jsGameBoard);
  }, ROUNDTIME);

});
