'use strict';

const CELL_COLORS = ['black', '#883333', '#888833', '#333388', 'red', 'yellow', 'blue'];


export default class Drawing {

    static drawMatrix(matrix, context) {

        //set background to dark gray
        context.fillStyle = '#222244';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);


        for(let row = 0; row < matrix.length; row++) {
            for(let col = 0; col < matrix[row].length; col++) {
                if(matrix[row][col] != 0) {
                    context.fillStyle = (CELL_COLORS[matrix[row][col]]);
                    context.fillRect(
                        context.canvas.width*(col/matrix[row].length),
                        context.canvas.height*(row/matrix.length),
                        context.canvas.width/matrix[row].length,
                        context.canvas.height/matrix.length
                    );
                }
            }
        }
    }
}
