'use strict';

var socket = io();

const CELL_COLORS = ['black', 'red', 'yellow', 'blue'];

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 800;

socket.on('matrix', function(matrix) {
    //set background to dark gray
    context.fillStyle = '#222244';
    context.fillRect(0, 0, canvas.width, canvas.height);


    for(let row = 0; row < matrix.length; row++) {
        for(let col = 0; col < matrix[row].length; col++) {
            if(matrix[row][col] != 0) {
                context.fillStyle = (CELL_COLORS[matrix[row][col]]);
                context.fillRect(
                    canvas.width*(col/matrix[row].length),
                    canvas.height*(row/matrix.length),
                    canvas.width/matrix[row].length,
                    canvas.height/matrix.length
                );
            }
        }
    }
});
