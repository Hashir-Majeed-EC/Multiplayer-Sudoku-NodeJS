var socket;
var cell = [];
var w = 40;
var count = 0;
var grid = createGrid();
var delayCount = 0;
var winT = '';

function setup() {
  frameRate(100);
  createCanvas(1600,789);
  background(51);
  socket = io.connect('http://localhost:8080');

  grid = makeCells(grid, 75, 100);
  sendGrid(grid);
  //console.log(checkRows([[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]]));
  socket.on('start', function(data){
    var newCell = new Cell(data.x, data.y, 40, data.val, data.revealed);
    cell.push(newCell);
    if (delayCount < 85){
      sendGrid(grid);
    }
    delayCount ++;
  });
  
  socket.on('win', winner);
  
  function winner(t){
    winT = t;
  }
  
}


function draw() {
  background(255, 204, 100);
  for (var i = 0; i < 9; i ++){
    for (var j = 0; j < 9; j ++){
      grid[i][j].show();
    } 
  }
  
  for (var i = 0; i < cell.length; i ++){
    cell[i].show();
  }
  
  stroke(255);
  rect(250, 500, 200, 100);
  stroke('white');
  textSize(32);
  text('Win!', 310, 550);
 
  textSize(50);
  text(winT, 50, 50);
 
}
function make2DArray(){
  var array = new Array(9);
  for (var i = 0; i < 9; i++){
    array[i] = new Array(9);
  }
  return array;
}

function makeCells(grid, offx, offy){
  
  for (var i = 0; i < 9; i ++){
    for (var j = 0; j < 9; j ++){
      grid[i][j] = new Cell(w * i + offx, w * j + offy, w, int(random(1, 10)), random(1) < 0.35);
    } 
  }
  
  /*while(!validSudoku(grid)){
    for (var i = 0; i < 9; i ++){
      for (var j = 0; j < 9; j ++){
        grid[i][j] = new Cell(w * i + offx, w * j + offy, w, int(random(1,10)), random(1)<0.5);
      } 
    }
  }*/
  
  return grid;
}

function createGrid(){
  grid = make2DArray();
  return grid;
}

function sendGrid(grid){
  for (var i = 0; i < 9; i ++){
    for (var j = 0; j < 9; j ++){
      
      var data = {
        x: grid[i][j].x,
        y: grid[i][j].y,
        val: grid[i][j].val,
        revealed: grid[i][j].revealed
      };
      
      socket.emit('start', data);
    } 
  }
}


function randArr(arr){
  for (var i = 0; i < 81; i ++){
    arr[i] = int(random(1,9));
  }
  return arr;
}

function mousePressed(){
  var x = mouseX;
  var y = mouseY;
  
  if (x > 250 && x < 450 && y > 500 && y < 600){
    if (validSudoku(grid)){
      socket.emit('win', true);
    } else {
      console.log('win clicked, but sudoku not valid');
    }
  }
  
  var found = false;
  for (var i = 0; i < 9; i ++){
    for (var j = 0; j < 9; j ++){
      if (grid[i][j].contains(x, y)){
        console.log('first: ' + grid[i][j]);
        found = true;
        
        var data = {
          x: grid[i][j].x,
          y: grid[i][j].y,
          val: grid[i][j].val,
          revealed: grid[i][j].revealed
        };
        if (!data.revealed){
          grid[i][j].val += 1;
        }
        break;
      }    
    } 
  }
  
  if (! found){
    for (var i = 0; i < cell.length; i ++){
      if (cell[i].contains(x, y)){
        console.log('second: ' + cell[i]);
        var data = {
          x: cell[i].x,
          y: cell[i].y,
          val: cell[i].val,
          revealed: cell[i].revealed
        };
        if (!data.revealed){
          cell[i].val += 1;
        }
        found = true;
        break;
      }
    }
  }  
  if (found && data.x < 450 && !data.revealed){
    data.val += 1;
    socket.emit('clicked', data);
  }
  
}

function validSudoku(board){
  var valid = false;
  var rowVals = make2DArray();
  var colVals = make2DArray();
  
  for (var i = 0; i < 9; i ++){
    for (var j = 0; j < 9; j ++){
      rowVals[i][j] = board[i][j].val;
      colVals[j][i] = board[j][i].val;
      //if (! check3x3(board, i, j)){
        //return false;
      //}
    }
  }

  return checkRows(rowVals) && checkRows(colVals);
}

function checkRows(board){
  var valid = true;
  //board = sort(board, board.length);
  
  for (var i = 0; i < 9; i ++){
    board[i] = sort(board[i], board[i].length);
    //console.log(board[i]);
    for (var j = 0; j < 8; j ++){
      if (board[i][j] == board[i][j+1]){
        valid = false;
        break;
      }
    }
  }
  
  return valid;
}


/*function check3x3(board, r, c){
  var set = new HashSet<int>();
  for(int i = r; i < r + 3; ++i){
    for(int j = c; j < c + 3; ++j){
      var ch = board[i][j];
      if(set.Contains(ch) && ch != '.'){
        return false;
      }
      set.Add(ch);
    }
  }
  
  return true;
}*/