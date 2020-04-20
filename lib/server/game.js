'use strict';

const Matrix = require('./matrix.js');
const Cell = require('./cell.js');
const Pill = require('./pill.js');

//manages the game of one player

// TODO: change colors to only use 1-3

class Game {
    constructor() {
        this.matrix = new Matrix(8, 16, 100);
        this.matrix.populateMatrixWithViruses(20);
        // local queue of pills
        this.pillQueue = [];
        // position in the room's pill queue
        this.pillQueuePos = 0;
        this.currentPill = null;
        //possible states: controlling, settling, clearing, top-out, victory, frozen
        this.state = 'controlling';
        // how many times update() is called per second
        this.tickFrequency = 60;
        this.tickCounter = 0;
        this.combo = [];
        this.garbageQueue = [];

        this.inputState = [];
    }
    update() {
        this.tickCounter ++;
        if (this.state == 'controlling') {
            // pill drop from gravity
            /*
            if (this.tickCounter % Math.round(this.tickFrequency / 1) == 0) {
                let updatedPill = this.currentPill.copy();
                updatedPill.y ++;
                if (this.matrix.conflictsWith(updatedPill)) {
                    this.matrix.addPillToCells(this.currentPill);
                    this.state = 'settling';
                } else {
                    this.currentPill = updatedPill;
                }
            }
            */

            if(this.inputState.LEFT) {
                let updatedPill = this.currentPill.copy();
                updatedPill.x --;
                if (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill;
                }
            }
            if(this.inputState.RIGHT) {
                let updatedPill = this.currentPill.copy();
                updatedPill.x ++;
                if (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill;
                }
            }
            if(this.inputState.SOFT_DROP) {
                let updatedPill = this.currentPill.copy();
                updatedPill.y ++;
                if (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill;
                }
            }
            if(this.inputState.ROTATE_CLOCKWISE) {
                let updatedPill = this.currentPill.copy();
                updatedPill.rotateColockwise();
                updatedPill = this.kickPill(updatedPill);
                if (updatedPill != null) {
                    this.currentPill = updatedPill;
                }
            }
            if(this.inputState.ROTATE_COUNTERCLOCKWISE) {
                let updatedPill = this.currentPill.copy();
                updatedPill.rotateCounterclockwise();
                updatedPill = this.kickPill(updatedPill);
                if (updatedPill != null) {
                    this.currentPill = updatedPill;
                }
            }
            if(this.inputState.HARD_DROP) {
                let updatedPill = this.currentPill.copy();
                while (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill.copy();
                    updatedPill.y ++;
                }
                this.matrix.addPillToCells(this.currentPill);
                this.addGarbage();
                this.state = 'settling';
            }
            if(this.inputState.DEBUG) {
                console.log('debug');
                this.matrix.cells[15][5] = new Cell(2, true, 'none');
                this.matrix.cells[13][5] = new Cell(2, false, 'right');
                this.matrix.cells[12][5] = new Cell(2, false, 'none');
                this.matrix.cells[11][5] = new Cell(2, false, 'none');
                this.matrix.cells[15][6] = new Cell(1, false, 'none');
                this.matrix.cells[14][6] = new Cell(1, false, 'none');
                this.matrix.cells[13][6] = new Cell(1, false, 'left');

            }
        }
        // update 4 times per second
        if (this.state == 'settling' && this.tickCounter % Math.round(this.tickFrequency / 4) == 0) {

            let clears = this.matrix.clearStreaks();
            if (clears.length == 0) {
                if (this.matrix.settlePills() == 0) {

                    let p = this.getNextPill();
                    if (this.matrix.conflictsWith(p)) {
                        this.state = 'top-out';
                    } else if (this.matrix.virusesRemaining() == 0) {
                        this.state = 'victory';
                    }
                    else {
                        this.currentPill = p;
                        this.state = 'controlling';
                    }


                }
            }
            this.combo = this.combo.concat(clears);
        }
    }
    // when a pill is rotated, it may need to "kick" off of a wall it hits
    // p is the rotated but not yet placed pill
    // returns p, moved if necessary, or null if p can't be put anywhere
    // kinda garbage code, feel free to revise, but it does the job
    kickPill(p) {
        // horizontal to vertical
        if (p.cells[0][0] != null) {
            if (p.y > 0 && this.matrix.cells[p.y][p.x] == null) {
                return p;
            }
            else if (p.y > 0 && p.x + 1 < this.matrix.cells[0].length && this.matrix.cells[p.y][p.x + 1] == null) {
                p.x ++;
                return p;
            }
            else if (p.y + 2 < this.matrix.cells.length && this.matrix.cells[p.y+2][p.x] == null) {
                p.y ++;
                return p;
            }
            else if (p.y + 2 < this.matrix.cells.length && p.x + 1 < this.matrix.cells[0].length && this.matrix.cells[p.y+1][p.x+1] == null) {
                p.y ++;
                p.x ++;
                return p;
            }
            else {
                return null;
            }
        }
        // vertical to horizontal
        else {
            if (p.x + 1 < this.matrix.cells[0].length && this.matrix.cells[p.y+1][p.x+1] == null) {
                return p;
            }
            else if (p.x - 1 >= 0 && this.matrix.cells[p.y+1][p.x-1] == null) {
                p.x --;
                return p;
            }
            else {
                return null;
            }
        }
    }
    getNextPill() {
        return this.pillQueue.shift();
    }
    getViewObject() {
        let output = {
            matrix: this.matrix.copy(),
            state: this.state,
            pillQueue: this.pillQueue,
            garbageQueueLength: this.garbageQueue.length,
        };
        if (this.state == 'controlling') {
            output.matrix.addPillToCells(this.currentPill);
        }

        return output;
    }
    addGarbage() {
        if (this.garbageQueue.length > 0) {
            this.matrix.addGarbage(this.garbageQueue.shift());
        }
    }
}

module.exports = Game;
