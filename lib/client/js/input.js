// look, this should probably be a module, rather than use a bunch of global variables. But, until it actually causes problems, this is how we're gonna do it

// Delayed Auto Scroll: delay between first and second piece movement while holding a move key
const DAS = 200;
// Auto Repeat Rate: delay between piece movements after second piece movement while holding a move key
const ARR = 50;

const KEY_BINDS = {
    37: 'LEFT',
    39: 'RIGHT',
    68: 'ROTATE_CLOCKWISE',
    65: 'ROTATE_COUNTERCLOCKWISE',
    16: 'SOFT_DROP',
    32: 'HARD_DROP',
    84: 'DEBUG',
}

let inputState = {
    CAN_INPUT: true,
    LEFT: false,
    RIGHT: false,
    ROTATE_CLOCKWISE: false,
    ROTATE_COUNTERCLOCKWISE: false,
    SOFT_DROP: false,
    HARD_DROP: false,
    DEBUG: false,
}

// used to cancel timeouts
let timeoutKey = null;
let intervalKey = null;

function onKeyDown(event) {
    // !event.repeat ensures that the key isn't repeat firing while being held down
    if (inputState.CAN_INPUT && !event.repeat && KEY_BINDS[event.keyCode] != null) {
        inputState[KEY_BINDS[event.keyCode]] = true;
        if (KEY_BINDS[event.keyCode] == 'LEFT' || KEY_BINDS[event.keyCode] == 'RIGHT') {
            if (timeoutKey != null) {
                clearTimeout(timeoutKey);
                timeoutKey = null;
            }
            if (intervalKey != null) {
                clearInterval(intervalKey);
                intervalKey = null;
            }
            timeoutKey = setTimeout(() => {
                inputState[KEY_BINDS[event.keyCode]] = true;
                timeoutKey = null;
                intervalKey = setInterval(() => inputState[KEY_BINDS[event.keyCode]] = true, ARR);
            }, DAS);
        }
    }
}

function onKeyUp(event) {
    if (inputState.CAN_INPUT && KEY_BINDS[event.keyCode] != null) {
        // if statement to allow for DAS maintenance
        if (KEY_BINDS[event.keyCode] == 'LEFT' || KEY_BINDS[event.keyCode] == 'RIGHT') {
            if (timeoutKey != null) {
                clearTimeout(timeoutKey);
                timeoutKey = null;
            }
            if (intervalKey != null) {
                clearInterval(intervalKey);
                intervalKey = null;
            }
        }
    }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
