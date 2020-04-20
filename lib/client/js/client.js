'use strict';

import Drawing from './drawing.js';

var socket = io();

var matrixCanvas = document.getElementById('matrix');
var matrixContext = matrixCanvas.getContext('2d');
matrixCanvas.width = 400;
matrixCanvas.height = 760;

var pillQueueCanvas = document.getElementById('pillQueue');
var pillQueueContext = pillQueueCanvas.getContext('2d');
pillQueueCanvas.width = (matrixCanvas.width-20) / 2;
pillQueueCanvas.height = matrixCanvas.height * (7/16);

var opponentsCanvas = document.getElementById('opponents');
var opponentsContext = opponentsCanvas.getContext('2d');
opponentsCanvas.width = 800;
opponentsCanvas.height = 800;

let username = 'Dr. Anon';


document.getElementById('buttonSubmitUsername').onclick = () => {
    if (document.getElementById('inputUsername').value.length > 0) {
        username = document.getElementById('inputUsername').value;
        socket.emit('username', username);
        document.getElementById('usernameSubmission').style.display = 'none';
    }
}

socket.on('gameView', (gameView) => {
    matrixContext.fillStyle = 'black';
    matrixContext.fillRect(0, 0, matrixContext.canvas.width, matrixContext.canvas.height);
    Drawing.drawPillQueue(gameView.pillQueue, pillQueueContext);
    //Drawing.drawMatrix(gameView.matrix, 0, 0, 380, 760, matrixContext);
    //Drawing.drawGarbageIndicator(gameView.garbageQueueLength, matrixContext);
    Drawing.drawGameElements(0, 0, matrixCanvas.width, matrixCanvas.height, gameView.matrix, gameView.garbageQueueLength, username, matrixContext);
    if (gameView.state == 'top-out') {
        Drawing.drawBigText('GAME OVER', matrixContext);
    }
    else if (gameView.state == 'victory') {
        Drawing.drawBigText('VICTORY!', matrixContext);
    }
});

socket.on('opponentMatrixes', (data) => {
    Drawing.drawOpponents(data, opponentsContext);
});

socket.on('numOfPlayers', (data) => console.log("Number of other players: " + data));

socket.on('leaderboard', (data) => (console.log(data)));



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
