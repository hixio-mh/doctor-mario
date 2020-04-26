'use strict';

import Game from '/shared/js/game.js';
import Pill from '/shared/js/pill.js';
import Drawing from '/static/js/drawing.js';

const FPS = 1000 / 60;

let game = new Game();
game.currentPill = new Pill();

let username = 'Dr. Mary';

var matrixCanvas = document.getElementById('matrix');
var matrixContext = matrixCanvas.getContext('2d');
matrixCanvas.width = 400;
matrixCanvas.height = 800;

var pillQueueCanvas = document.getElementById('pillQueue');
var pillQueueContext = pillQueueCanvas.getContext('2d');
pillQueueCanvas.width = (matrixCanvas.width-20) / 2;
pillQueueCanvas.height = matrixCanvas.height * (7/16);



setInterval(() => {
    while (game.pillQueue.length < 4) {
        game.pillQueue.push(new Pill());
    }

    game.inputState = inputState;
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

    game.update();
    let gv = game.getViewObject();

    matrixContext.fillStyle = 'black';
    matrixContext.fillRect(0, 0, matrixContext.canvas.width, matrixContext.canvas.height);
    Drawing.drawPillQueue(gv.pillQueue.slice(0, 3), pillQueueContext);
    Drawing.drawMatrix(gv.matrix, 0, 0, matrixCanvas.width, matrixCanvas.height, matrixContext);
    if (gv.state == 'top-out') {
        Drawing.drawBigText('GAME OVER', 0, 0, matrixCanvas.width, matrixCanvas.height, matrixContext);
    }
    else if (gv.state == 'victory') {
        Drawing.drawBigText('VICTORY!', 0, 0, matrixCanvas.width, matrixCanvas.height, matrixContext);
    }
}, FPS);
