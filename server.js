var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = 8000;
//var nsp = io.of('/DispatchServer');
/*const sql = require('mssql')
var config = {
  driver: 'msnodesqlv8',
  server: 'DESKTOP-C9LSU5E',
  database: 'DTS',
  user: 'sa',
  password: 'eurosoft',
  "options": {
    enableArithAbort: true,
    trustedConnection: true
    }
};*/


app.get('/', function(req, res){
    res.sendFile('index.html', { root: __dirname });
});


io.on('connection', function(socket) {
  console.info(`Client connected [id=${socket.id}]`);
  //Recieving an event from the client
  socket.on('clientEvent', function(data) { console.info(data); });
  
  //sending a message to all connected clients
  socket.emit('broadcast',{ description: ' clients connected!'});
  
  //send the new user a welcome message
  socket.emit('newclientconnect',{ description: 'Hey, welcome!'});

  //send the message
  socket.emit('hi', 'Hello everyone!');

  setTimeout(function() {
    //Send a message after a timeout of 4seconds
    socket.send('Sent a message to connection, after 5 seconds!');
    //Sending an object when emmiting an event
    socket.emit('serverEvent', {name: 'test', description: 'A custom event named testerEvent!'});
  }, 5000);

  socket.on('disconnect', function() {
    console.info(`Client gone [id=${socket.id}]`);
    io.sockets.emit('broadcast',{ description: ' clients disconnected!'});
  });
});

http.listen(port, () => {
  console.info('listening on *:' + port);
});