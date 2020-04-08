'use strict';

const PILL_COLORS = ['red', 'yellow', 'blue'];
const VIRUS_COLORS = ['#883333', '#888833', '#333388'];


export default class Drawing {
    static drawMatrix(matrix, context) {

        //set background to dark gray
        context.fillStyle = '#111122';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);


        for(let r = 0; r < matrix.cells.length; r++) {
            for(let c = 0; c < matrix.cells[r].length; c++) {
                if(matrix.cells[r][c] != null) {
                    // just to save some time
                    let startX = context.canvas.width*(c/matrix.cells[r].length);
                    let startY = context.canvas.height*(r/matrix.cells.length);
                    let cellWidth = context.canvas.width/matrix.cells[r].length;
                    let cellHeight = context.canvas.height/matrix.cells.length;

                    context.beginPath();
                    context.rect(
                        startX,
                        startY,
                        cellWidth,
                        cellHeight
                    );
                    context.fillStyle = matrix.cells[r][c].isVirus ? VIRUS_COLORS[matrix.cells[r][c].color] : PILL_COLORS[matrix.cells[r][c].color];
                    context.fill();

                    context.beginPath();
                    context.lineWidth = 2;
                    context.strokeStyle = 'white';
                    context.moveTo(startX, startY);
                    if (matrix.cells[r][c].linkage != 'up') {
                        context.lineTo(startX + cellWidth, startY);
                    } else {
                        context.moveTo(startX + cellWidth, startY);
                    }
                    if (matrix.cells[r][c].linkage != 'right') {
                        context.lineTo(startX + cellWidth, startY + cellHeight);
                    } else {
                        context.moveTo(startX + cellWidth, startY + cellHeight);
                    }
                    if (matrix.cells[r][c].linkage != 'down') {
                        context.lineTo(startX, startY + cellHeight);
                    } else {
                        context.moveTo(startX, startY + cellHeight);
                    }
                    if (matrix.cells[r][c].linkage != 'left') {
                        context.lineTo(startX, startY);
                    }

                    context.stroke();

                    // TODO: remove anit-aliasing
                }
            }
        }
    }
    static gameOver(context) {
        context.font = '60px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText('Game Over', context.canvas.width / 2, context.canvas.height / 2);
    }
    //precondition: pillQueue canvas is 50% the width and height of the matrix canvas
    static drawPillQueue(pillQueue, context) {
        let cellWidth = context.canvas.width / 4;
        for (let r = 0; r < pillQueue.length; r++) {
            for (let c = 0; c < pillQueue[r].cells[0].length; c++) {
                context.fillStyle = PILL_COLORS[pillQueue[r].cells[1][c].color];
                context.fillRect((c + 1) * cellWidth, (r * 2 + 1) * cellWidth, cellWidth, cellWidth);
            }
        }
    }
}
