'use strict';

import Drawing from './drawing.js';
import {randomUsername} from "./utils.js";
import {openSettingsWindow} from "./settings.js";

var socket = io();

var matrixCanvas = document.getElementById('matrix');
var matrixContext = matrixCanvas.getContext('2d');
matrixCanvas.width = 400;
matrixCanvas.height = 800;

var pillQueueCanvas = document.getElementById('pillQueue');
var pillQueueContext = pillQueueCanvas.getContext('2d');
pillQueueCanvas.width = (matrixCanvas.width-20) / 2;
pillQueueCanvas.height = matrixCanvas.height * (7/16);

var opponentsCanvas = document.getElementById('opponents');
var opponentsContext = opponentsCanvas.getContext('2d');
opponentsCanvas.width = 800;
opponentsCanvas.height = 800;

let username = randomUsername();


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
    Drawing.drawPillQueue(gameView.pillQueue.slice(0, 3), pillQueueContext);
    //Drawing.drawMatrix(gameView.matrix, 0, 0, 380, 760, matrixContext);
    //Drawing.drawGarbageIndicator(gameView.garbageQueueLength, matrixContext);
    Drawing.drawGameElements(0, 0, matrixCanvas.width, matrixCanvas.height, gameView.matrix, gameView.garbageQueueLength, username, gameView.leaderboardPlace, matrixContext);
    // if (gameView.state == 'top-out') {
    //     Drawing.drawBigText('GAME OVER', matrixContext);
    // }
    // else if (gameView.state == 'victory') {
    //     Drawing.drawBigText('VICTORY!', matrixContext);
    // }
});

socket.on('opponentMatrixes', (data) => {
    Drawing.drawOpponents(data, opponentsContext);
});


setInterval(
    () => {
        if (document.activeElement === document.getElementById('inputUsername')) {
            inputState.CAN_INPUT = false;
        } else {
            inputState.CAN_INPUT = true;
        }

        socket.emit('inputState', inputState);

        inputState = {
            CAN_INPUT: inputState.CAN_INPUT,
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


window.openSettingsWindow = openSettingsWindow; // link from imported function to global