'use strict';

import Drawing from './drawing.js';

var socket = io();

var matrixCanvas = document.getElementById('matrix');
var matrixContext = matrixCanvas.getContext('2d');
matrixCanvas.width = 400;
matrixCanvas.height = 800;

var pillQueueCanvas = document.getElementById('pillQueue');
var pillQueueContext = pillQueueCanvas.getContext('2d');
pillQueueCanvas.width = matrixCanvas.width / 2;
pillQueueCanvas.height = matrixCanvas.height * (7/16);

socket.on('gameView', (gameView) => {
    Drawing.drawMatrix(gameView.matrix, matrixContext);
    Drawing.drawPillQueue(gameView.pillQueue, pillQueueContext);
    if (gameView.state == 'topOut') {
        Drawing.gameOver(matrixContext);
    }
});

socket.on('message', (data) => console.log(data));

socket.emit('hello', 'hello');


const KEY_BINDS = {
    37: 'LEFT',
    39: 'RIGHT',
    68: 'ROTATE_CLOCKWISE',
    65: 'ROTATE_COUNTERCLOCKWISE',
    16: 'SOFT_DROP',
    32: 'HARD_DROP',
    84: 'DEBUG',
}

let inputState = {
    LEFT: false,
    RIGHT: false,
    ROTATE_CLOCKWISE: false,
    ROTATE_COUNTERCLOCKWISE: false,
    SOFT_DROP: false,
    HARD_DROP: false,
    DEBUG: false,
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

setInterval(
    () => {
        socket.emit('inputState', inputState);
        // temporary, remove later
        inputState = {
            LEFT: false,
            RIGHT: false,
            ROTATE_CLOCKWISE: false,
            ROTATE_COUNTERCLOCKWISE: false,
            SOFT_DROP: false,
            HARD_DROP: false,
            DEBUG: false,
        }
    },
    1000 / 60
);
