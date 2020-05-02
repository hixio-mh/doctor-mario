'use strict';

import Drawing from './drawing.js';
import Game from '/shared/js/game.js';
import Matrix from '/shared/js/matrix.js';
import Pill from '/shared/js/pill.js';

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

let username = 'Anonymous';
let game = new Game();
let opponents = [];


document.getElementById('buttonSubmitUsername').onclick = () => {
    if (document.getElementById('inputUsername').value.length > 0) {
        username = document.getElementById('inputUsername').value;
        socket.emit('username', username);
        document.getElementById('usernameSubmission').style.display = 'none';
    }
}

socket.on('gameState', (updatedGame) => {
    if (updatedGame.state == 'controlling') {
        // keep the matrix and current pill if necessary
        updatedGame.currentPill = game.currentPill;
    }
    Object.assign(game, updatedGame);
    // for some reason these don't keep the functions even just with Object.assign, so fresh objects are created
    // this will likely be a source of lag, so it would be a good idea to change this
    game.matrix = new Matrix(10, 20);
    Object.assign(game.matrix, updatedGame.matrix);
    game.currentPill = new Pill();
    Object.assign(game.currentPill, updatedGame.currentPill);


});

socket.on('opponents', (updatedOpponents) => {
    opponents = updatedOpponents;
});

// update loop
setInterval(
    () => {
        // make it impossible to move pills while typing in a username
        if (document.activeElement === document.getElementById('inputUsername')) {
            inputState.CAN_INPUT = false;
        } else {
            inputState.CAN_INPUT = true;
        }


        if (game != null) {
            if (game.state == 'controlling') {
                game.inputState = inputState;
                game.update();

            }

            if (game.state == 'pill-placed') {
                socket.emit('pillPlaced', game.currentPill);
                game.state = 'frozen';
            }
        }





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

// draw loop
setInterval(
    () => {
        // client's game
        matrixContext.fillStyle = 'black';
        matrixContext.fillRect(0, 0, matrixContext.canvas.width, matrixContext.canvas.height);
        Drawing.drawPillQueue(game.pillQueue.slice(0, 3), pillQueueContext);
        Drawing.drawGameElements(
            0, 0, matrixCanvas.width, matrixCanvas.height,
            game.getViewMatrix(),
            game.garbageQueue.length,
            username,
            game.leaderboardPlace,
            matrixContext
        );

        // opponents
        // if (opponents != null) {
        //     Drawing.drawOpponents(opponents, opponentsContext);
        // }
    }, 1000/60
);
