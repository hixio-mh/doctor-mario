var audioCtx = new (window.AudioContext || window.webkitAudioContext);


document.getElementById('play').onclick = () => {

    var sine = audioCtx.createOscillator();
    sine.start();
    sine.connect(audioCtx.destination);
    console.log("playing sound?");
}
