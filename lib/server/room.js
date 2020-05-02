// TODO: fix these icky paths if you want to scale this
// const Game = require('../shared/js/game.js');
// const Matrix = require('../shared/js/matrix.js');
// const Pill = require('../shared/js/pill.js');

import Game from '../shared/js/game.js';
import Matrix from '../shared/js/matrix.js';
import Pill from '../shared/js/pill.js';


export default class Room {
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

        this.usernames[socket.id] = 'Anonymous';

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
    validatePillPlacement(id, pillData) {
        if (this.games[id] == null) {
            console.log('this.games[id] never set, id is ' + id);
        } else {
            let pill = Object.assign(new Pill(), pillData);
            if (this.games[id].matrix.conflictsWith(pill)) {
                console.log('placed pill conflicts with matrix (might indicate cheating), but placing anyways');
            }

            this.games[id].currentPill = pill;
            this.games[id].state = 'pill-placed';
            this.games[id].update();
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
                if (Object.values(this.games).length > 1 && (game.state == 'controlling' || game.state == 'victory')) {
                    if (game.combo.length >= 2) {
                        let randGame = game;
                        while (randGame == game) {
                            randGame = Object.values(this.games)[Math.floor(Math.random() * Object.values(this.games).length)];
                        }
                        randGame.garbageQueue.push(game.combo);
                    }

                    game.combo = [];
                }
                // check top-out
                if (game.state == 'top-out' && !this.leaderboard.includes(id)) {
                    this.leaderboard.unshift(id);
                    // second to last player has topped out
                    if (this.leaderboard.length >= Object.keys(this.games).length-1) {
                        this.state = 'match-over';
                        Object.keys(this.games).forEach((id) => {
                            if (!this.leaderboard.includes(id)) {
                                this.leaderboard.unshift(id);
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
                        Object.keys(this.games).forEach((g) => {
                            if (!this.leaderboard.includes(g) && g != id) {
                                if (mostViruses == null || this.games[g].matrix.virusesRemaining() > this.games[mostViruses].matrix.virusesRemaining()) {
                                    mostViruses = g;
                                }
                            }
                        });
                        if (mostViruses != null) {
                            this.leaderboard.unshift(mostViruses);
                        } else {
                            break;
                        }
                    }

                    this.leaderboard.unshift(id);
                }

                this.games[id].leaderboardPlace = this.getLeaderboardPlace(id);

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
            try {
                this.clients[id].emit('gameState', this.games[id]);

                //send opponent matrixes
                let temp = this.games[id];
                delete this.games[id];
                let opponents = [];
                Object.keys(this.games).forEach((id) => {
                    opponents.push({
                        game: this.games[id],
                        username: this.usernames[id],
                    });
                });
                this.clients[id].emit('opponents', opponents);
                this.games[id] = temp;
            } catch (e) {
                this.removePlayer(id);
            }
        });

    }
    // helper method
    getLeaderboardPlace(id) {
        let place = this.leaderboard.indexOf(id);
        if (place != -1) {
            place += (Object.keys(this.clients).length - this.leaderboard.length) + 1;
        }
        return place;
    }
}
