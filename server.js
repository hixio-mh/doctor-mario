'use strict';

// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const Matrix = require('./lib/server/matrix.js');

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
io.on('connection', function(socket) {
    //create new singleplayer game

    let matrix = new Matrix(8, 16);
    matrix.populateMatrixWithViruses(30);
    socket.on('inputState', (inputState) => {
        if(inputState.LEFT) {matrix.cells[0][1] = 3;}
    });

    setInterval(() => socket.emit('matrix', matrix.cells), 1000 / 60);
});
