const Game = require('./game.js');
const Matrix = require('./matrix.js');
const Pill = require('./pill.js');

class Room {
    constructor() {
        // each game object represents one player
        this.games = {};
        this.clients = {};
        this.usernames = {};
        this.pillQueue = [];
        this.leaderboard = [];
        // possible states: match-in-progress, match-over
        this.state = 'match-in-progress';
    }
    addPlayer(socket) {
        let game = new Game();
        game.currentPill = this.getPillFromQueue(game.pillQueuePos++);
        game.state = 'frozen';

        this.games[socket.id] = game;

        this.clients[socket.id] = socket;

        this.usernames[socket.id] = "Anonymous";

        this.startNewRound();
    }
    removePlayer(id) {
        delete this.games[id];
        delete this.clients[id];
        delete this.usernames[id];
    }
    setPlayerUsername(id, username) {
        this.usernames[id] = username;
    }
    updatePlayerInputState(id, data) {
        if (this.games[id] == null) {
            console.log("this.games[id] never set, id is " + id);
        } else {
            this.games[id].inputState = data;
        }
    }
    startNewRound() {
        this.leaderboard = [];
        this.pillQueue = [];
        this.state = 'match-in-progress';

        let matrixTemplate = new Matrix(8, 16, 100);
        matrixTemplate.populateMatrixWithViruses(5);

        Object.keys(this.games).forEach((id) => {
            this.games[id] = new Game();
            this.games[id].matrix = matrixTemplate.copy();
            this.games[id].currentPill = this.getPillFromQueue(this.games[id].pillQueuePos++);
        });

    }
    update() {
        if (this.state == 'match-in-progress') {
            Object.keys(this.games).forEach((id) => {
                let game = this.games[id];
                // add pill to queue if necessary
                if (game.pillQueue.length < 4) {
                    game.pillQueue.push(this.getPillFromQueue(game.pillQueuePos++));
                }

                game.update();
                // send garbage
                if (Object.values(this.games).length > 1 && (game.state == 'controlling' || game.state == 'victory') && game.combo.length >= 2) {
                    let randGame = game;
                    while (randGame == game) {
                        randGame = Object.values(this.games)[Math.floor(Math.random() * Object.values(this.games).length)];
                    }
                    randGame.garbageQueue.push(game.combo);
                    game.combo = [];
                }
                // check top-out
                if (game.state == 'top-out' && !this.leaderboard.includes(this.usernames[id])) {
                    this.leaderboard.unshift(this.usernames[id]);
                    // second to last player has topped out
                    if (this.leaderboard.length >= Object.keys(this.games).length-1) {
                        this.state = 'match-over';
                        Object.values(this.usernames).forEach((username) => {
                            if (!this.leaderboard.includes(username)) {
                                this.leaderboard.unshift(username);
                            }
                        });
                    }
                }
                // check victory
                if (game.state == 'victory') {
                    this.state = 'match-over';
                    // generate leaderboard based on remaining viruses
                    while (true) {
                        // id of game with most viruses
                        let mostViruses = null;
                        Object.keys(this.games).forEach((id) => {
                            if (!this.leaderboard.includes(this.usernames[id])) {
                                if (mostViruses == null || this.games[id].matrix.virusesRemaining() > this.games[mostViruses].matrix.virusesRemaining()) {
                                    mostViruses = id;
                                }
                            }
                        });
                        if (mostViruses != null) {
                            this.leaderboard.unshift(this.usernames[mostViruses]);
                        } else {
                            break;
                        }
                    }

                    this.leaderboard.unshift(this.usernames[id]);
                }

            });
        }
        else if (this.state == 'match-over') {
            Object.values(this.clients).forEach((socket) => {
                socket.emit('leaderboard', this.leaderboard);
            });

        }
    }
    getPillFromQueue(pos) {
        if (pos > this.pillQueue.length-1) {
            this.pillQueue.push(new Pill());
        }
        return this.pillQueue[pos];
    }
    sendState() {
        Object.keys(this.clients).forEach((id) => {
            if (this.clients[id] == null) {
                this.removePlayer(id);
            } else {
                this.clients[id].emit('gameView', this.games[id].getViewObject());
                this.clients[id].emit('numOfPlayers', Object.keys(this.clients).length);
                //send opponent matrixes
                let temp = this.games[id];
                delete this.games[id];
                let opponents = [];
                Object.keys(this.games).forEach((id) => {
                    opponents.push({
                        matrix: this.games[id].matrix,
                        garbageQueueLength: this.games[id].garbageQueue.length,
                        username: this.usernames[id],
                    });
                });
                this.clients[id].emit('opponentMatrixes', opponents);
                this.games[id] = temp;

            }
        });

    }
}

module.exports = Room;
