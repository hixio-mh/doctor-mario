var audioCtx = new (window.AudioContext || window.webkitAudioContext);

var sine = audioCtx.createOscillator();
sine.connect(audioCtx.destination);

document.getElementById('play').onclick = playA;
document.getElementById('stop').onclick = stopSine;

function playSine() {
    sine.start();

    console.log("playing sound?");
}

function stopSine() {
    audioCtx.suspend();
}

function playA() {
    audioCtx.resume();
    var sinea = audioCtx.createOscillator();
    sinea.frequency.value = 440;
    sinea.type = "sine";
    sinea.start();
    sinea.connect(audioCtx.destination);
    var sineb = audioCtx.createOscillator();
    sineb.frequency.value = 523.25;
    sineb.type = "sine";
    sineb.start();
    sineb.connect(audioCtx.destination);
    var sinec = audioCtx.createOscillator();
    sinec.frequency.value = 698.46;
    sinec.type = "sine";
    sinec.start();
    sinec.connect(audioCtx.destination);
}
