'use strict';

// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const Room = require('./lib/server/room.js');

//initialization
var app = express();
var server = http.Server(app);
var io = socketIO(server);



app.set('port', 5000);
app.use('/static', express.static(__dirname + '/lib/client'));

//Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/lib/client/html/index.html'));
});

app.get('/singleplayer', function(request, response) {
    response.sendFile(path.join(__dirname, '/lib/client/html/singleplayer.html'));
});

app.get('/tutorial', function(request, response) {
    response.sendFile(path.join(__dirname, '/lib/client/html/tutorial.html'));
});

app.get('/contact', function(request, response) {
    response.sendFile(path.join(__dirname, '/lib/client/html/contact.html'));
});

app.get('/about', function(request, response) {
    response.sendFile(path.join(__dirname, '/lib/client/html/about.html'));
});

server.listen(5000, function() {
    console.log('Starting server on port 5000');
});

//setInterval(function() {io.sockets.emit('matrix', m); }, 1000);

let room = new Room();

io.on('connection', (socket) => {
    // console.log('client connected');
    //create new singleplayer game
    // let game = new Game();
    // console.log(socket.id);
    //
    // socket.on('inputState', (data) => {
    //     game.update(data);
    //
    //     socket.emit('gameView', game.getViewObject());
    // });
    // socket.emit('message', 'hello from the server');
    // socket.on('hello', () => console.log('hello'));

    console.log('new client connected');
    room.addPlayer(socket);

    socket.on('username', (data) => {
        // TODO: refactor this constant
        const MAX_USERNAME_LENGTH = 12;
        room.setPlayerUsername(socket.id, data.substring(0, MAX_USERNAME_LENGTH));
    });

    socket.on('inputState', (data) => {
      room.updatePlayerInputState(socket.id, data);
    });

    socket.on('disconnect', () => {
      room.removePlayer(socket.id);
    })
});

setInterval(() => {
    room.update();
    room.sendState();
}, 1000/60);
