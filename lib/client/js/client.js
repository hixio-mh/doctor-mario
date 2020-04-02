'use strict';

import Drawing from './drawing.js';

var socket = io();

var canvas = document.getElementById('matrix');
var context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 800;

socket.on('matrix', function(matrix) {
    Drawing.drawMatrix(matrix, context);
});


const KEY_BINDS = {
    37: 'LEFT',
    39: 'RIGHT',
    68: 'ROTATE_CLOCKWISE',
    65: 'ROTATE_COUNTERCLOCKWISE',
    16: 'SOFT_DROP',
    32: 'HARD_DROP',
}

let inputState = {
    LEFT: false,
    RIGHT: false,
    ROTATE_CLOCKWISE: false,
    ROTATE_COUNTERCLOCKWISE: false,
    SOFT_DROP: false,
    HARD_DROP: false,
}

function onKeyDown(event) {
    if (KEY_BINDS[event.keyCode] != null) {
        inputState[KEY_BINDS[event.keyCode]] = true;
    }
}

function onKeyUp(event) {
    if (KEY_BINDS[event.keyCode] != null) {
        inputState[KEY_BINDS[event.keyCode]] = false;
    }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

setInterval(() => {
    socket.emit('inputState', inputState);
    }, 1000 / 60);
