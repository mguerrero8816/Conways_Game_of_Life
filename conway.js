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
var FASTTIME = 100; //in miliseconds
var lastCell;
var jsGameBoard = []
var gameStatus;

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

function makeBlinker(board, location){
  newBoard = board;
  newBoard[location] = ALIVE;
  newBoard[location+1] = ALIVE;
  newBoard[location+2] = ALIVE;
  updateHTML(newBoard);
  return newBoard;
}

function makeGlider(board, location){
  newBoard = board;
  newBoard[location] = ALIVE;
  newBoard[location+BOARDWIDTH] = ALIVE;
  newBoard[location+BOARDWIDTH*2] = ALIVE;
  newBoard[location+BOARDWIDTH*2-1] = ALIVE;
  newBoard[location+BOARDWIDTH-2] = ALIVE;
  updateHTML(newBoard);
  return newBoard;
}

function makeJollyRoger(board, location){
  newBoard = board;
  newBoard[location] = ALIVE;
  newBoard[location+1] = ALIVE;
  newBoard[location+2] = ALIVE;
  newBoard[location+6] = ALIVE;
  newBoard[location+7] = ALIVE;
  newBoard[location+8] = ALIVE;
  newBoard[location - BOARDWIDTH - 2] = ALIVE;
  newBoard[location - BOARDWIDTH + 3] = ALIVE;
  newBoard[location - BOARDWIDTH + 5] = ALIVE;
  newBoard[location - BOARDWIDTH + 10] = ALIVE;
  newBoard[location - BOARDWIDTH*2 - 2] = ALIVE;
  newBoard[location - BOARDWIDTH*2 + 3] = ALIVE;
  newBoard[location - BOARDWIDTH*2 + 5] = ALIVE;
  newBoard[location - BOARDWIDTH*2 + 10] = ALIVE;
  newBoard[location - BOARDWIDTH*3 - 2] = ALIVE;
  newBoard[location - BOARDWIDTH*3 + 3] = ALIVE;
  newBoard[location - BOARDWIDTH*3 + 5] = ALIVE;
  newBoard[location - BOARDWIDTH*3 + 10] = ALIVE;
  newBoard[location - BOARDWIDTH*5] = ALIVE;
  newBoard[location+1 - BOARDWIDTH*5] = ALIVE;
  newBoard[location+2 - BOARDWIDTH*5] = ALIVE;
  newBoard[location+6 - BOARDWIDTH*5] = ALIVE;
  newBoard[location+7 - BOARDWIDTH*5] = ALIVE;
  newBoard[location+8 - BOARDWIDTH*5] = ALIVE;
  updateHTML(newBoard);
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

function cycleBoard(board){
  updatedBoard = [];
  for(var i = 0; i < board.length; i++){
    updatedBoard[i] = newCellCondition(board, i);
  }
  updateHTML(updatedBoard);
  return updatedBoard;
}

function startGame(speed){
  stopGame();
  gameStatus = setInterval(function(){
    jsGameBoard = cycleBoard(jsGameBoard);
  }, speed);
}

function updateHTML(board){
  for(var i = 0; i < board.length; i++){
    if(board[i] === ALIVE){
      $("#" + i).addClass("cellAlive");
    }
    else{
      $("#" + i).removeClass("cellAlive");
    }
  }
}

function stopGame(){
  clearInterval(gameStatus);
}

function clearBoard(board){
  var newBoard = [];
  for(var i = 0; i < board.length; i++){
    newBoard[i] = DEAD;
  }
  updateHTML(newBoard);
  return newBoard;
}

function randomizeBoard(board){
  newBoard = []
  for(var i = 0; i < lastCell; i++){
    var condition = Math.floor(Math.random()*2);
    newBoard[i] = condition;
  }
  updateHTML(newBoard);
  return newBoard;
}

function clickToToggleCell(cell){
  var cellID = parseInt($(cell).attr("id"));
  if(jsGameBoard[cellID] === DEAD){
    jsGameBoard[cellID] = ALIVE;
  }
  else{
    jsGameBoard[cellID] = DEAD;
  }
  updateHTML(jsGameBoard);
}

$(document).ready(function(){
  lastCell = createBoard();

  $("td").on("click", function(){
    clickToToggleCell(this)
  });

  $("#normalButton").on("click", function(){
    startGame(ROUNDTIME)});

  $("#fastButton").on("click", function(){
    startGame(FASTTIME)});

  $("#stopButton").on("click", stopGame);

  $("#randomizeButton").on("click", function(){
    jsGameBoard = randomizeBoard(jsGameBoard);
  })

  $("#clearButton").on("click", function(){
    jsGameBoard = clearBoard(jsGameBoard);
  })

  // jsGameBoard = makeGlider(jsGameBoard, BOARDWIDTH+8)
  // jsGameBoard = makeBlinker(jsGameBoard, BOARDWIDTH+2);
  // jsGameBoard = makeJollyRoger(jsGameBoard, 10+(BOARDHEIGHT-1)*BOARDWIDTH);

});
