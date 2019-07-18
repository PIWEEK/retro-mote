var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
  socket.on('postIt move', function(postIt){
    console.log(postIt)
    io.emit('postIt move', postIt);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
