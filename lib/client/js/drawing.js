'use strict';

const PILL_COLORS = ['red', 'yellow', 'blue'];
const VIRUS_COLORS = ['#883333', '#888833', '#333388'];


export default class Drawing {
    static drawMatrix(matrix, matrixX, matrixY, matrixWidth, matrixHeight, context) {

        //set background to dark gray
        context.beginPath();
        context.rect(matrixX, matrixY, matrixWidth, matrixHeight);
        context.fillStyle = '#111122';
        context.fill();
        context.strokeStyle = 'white';
        context.stroke();


        for(let r = 0; r < matrix.cells.length; r++) {
            for(let c = 0; c < matrix.cells[r].length; c++) {
                if(matrix.cells[r][c] != null) {
                    // just to save some time
                    let startX = (matrixWidth)*(c/matrix.cells[r].length) + matrixX;
                    let startY = (matrixHeight)*(r/matrix.cells.length) + matrixY;
                    let cellWidth = (matrixWidth)/matrix.cells[r].length;
                    let cellHeight = (matrixHeight)/matrix.cells.length;

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

                    if (matrix.cells[r][c].isVirus) {
                        //draw X
                        context.moveTo(startX, startY);
                        context.lineTo(startX + cellWidth, startY + cellHeight);
                        context.moveTo(startX + cellWidth, startY);
                        context.lineTo(startX, startY + cellHeight);
                    }

                    context.stroke();

                    // TODO: remove anit-aliasing
                }
            }
        }
    }
    static drawBigText(text, context) {
        context.font = '60px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(text, context.canvas.width / 2, context.canvas.height / 2);
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
    static drawGarbageIndicator(len, x, y, width, maxHeight, context) {
        const INDICATOR_RESOLUTION = 6;
        if (len > INDICATOR_RESOLUTION) {
            len = INDICATOR_RESOLUTION;
        }
        let height = maxHeight / INDICATOR_RESOLUTION * len;
        context.fillStyle = 'orange';
        context.fillRect(x, maxHeight, width, -height);
    }
    static drawOpponents(opponents, context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        let numRows = Math.floor(Math.sqrt(Math.ceil(opponents.length/2))*2)/2;
        let numCols = Math.ceil(opponents.length / numRows);

        let mWidth = context.canvas.width / numCols;
        let mHeight = context.canvas.height / numRows;
        if (mWidth*2 > mHeight) {
            mWidth = mHeight / 2;
        } else {
            mHeight = mWidth * 2;
        }

        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                if (opponents.length > 0) {
                    //this.drawMatrix(opponents.pop(), c*mWidth, r*mHeight, mWidth, mHeight, context);
                    let opponent = opponents.pop();
                    this.drawGameElements(c*mWidth, r*mHeight, mWidth, mHeight, opponent.matrix, opponent.garbageQueueLength, opponent.username, context);
                }
            }
        }
    }

    //helper method to draw matrix, garbage indicator, and username
    //precondition: width must be height/2
    static drawGameElements(x, y, width, height, matrix, garbageLen, username, context) {
        //outline background
        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = '#111122';
        context.fill();
        context.strokeStyle = 'white';
        context.stroke();

        this.drawMatrix(matrix, x, y, width-20, height-20, context);
        this.drawGarbageIndicator(garbageLen, x+width-20, y, 20, height, context);
        context.font = '16px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(username, x + (width/2), y + height - 4);
    }
}
