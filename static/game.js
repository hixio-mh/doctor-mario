
var socket = io();



/*var canvas = document.getElementById('canvas');
canvas.width = 400;
canvas.height = 800;
var context = canvas.getContext('2d');*/

socket.on('message', function(data) {
    //set background to dark gray
    console.log('we here');
    //context.fillStyle = '444444';
    //context.filledRect(canvas.width, canvas.height);
});
