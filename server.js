'use strict';

// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const Game = require('./lib/server/game.js');

//initialization
var app = express();
var server = http.Server(app);
var io = socketIO(server);



app.set('port', 5000);
app.use('/static', express.static(__dirname + '/lib/client'));

//Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/index.html'));
});

server.listen(5000, function() {
    console.log('Starting server on port 5000');
});

//setInterval(function() {io.sockets.emit('matrix', m); }, 1000);


// Add the WebSocket handlers
io.on('connection', (socket) => {
    console.log('client connected');
    //create new singleplayer game
    let game = new Game();
    //socket.on('inputState', (data) => game.update(data));
    socket.on('inputState', (data) => {
        game.update(data);
        
        socket.emit('gameView', game.getViewObject());
    });
    socket.emit('message', 'hello from the server');
    socket.on('hello', () => console.log('hello'));

    //setInterval(() => socket.emit('matrix', game.matrix), 1000 / 60);
});
