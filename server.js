var express = require('express');
function Cell(x, y, w, val, id, revealed){
  this.id = id;
  this.x = x;
  this.y = y;
  this.w = w;
  this.revealed = revealed;
  this.val = val;
}

var cells = [];

var app = express();
var server = app.listen(8080);

app.use(express.static('public'));

console.log("My socket server is running.");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
  
  
  console.log('new connection: ' + socket.id);

  
  socket.on('clicked', 
    function(data){
      console.log("CLICKED: " + socket.id + " : " + data.x + " " + data.y + " " + data.revealed);
      var cell = new Cell(data.x, data.y, 40, data.val, socket.id, data.revealed);
      
      if (data.x < 500){
        data.x += 500;
      } else {
        data.x -= 500;
      }
      
      socket.broadcast.emit('start', data);
  })

  socket.on('start', 
    function(data){
      console.log(socket.id + ": " + data.x + " " + data.y + " " + data.revealed);
      var cell = new Cell(data.x, data.y, 40, data.val, socket.id, data.revealed);
      
      data.x += 500;
      socket.broadcast.emit('start', data);
  })
  
  socket.on('win', winner);
  
  function winner(win){
    io.sockets.emit('win', 'Player 1 has Won!');
  }
  /*socket.on('grid', gotGrid);
  function gotGrid(gridElement){
    gridElement.x += 750;
    socket.broadcast.emit('grid', gridElement);
    console.log('server side: grid has been received');
  }*/
  //socket.on('circle', Locate);

}