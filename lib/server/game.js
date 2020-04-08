'use strict';

const Matrix = require('./matrix.js');
const Cell = require('./cell.js');
const Pill = require('./pill.js');

//manages the game of one player

// TODO: change colors to only use 1-3

class Game {
    constructor() {
        this.matrix = new Matrix(8, 16, 100);
        this.matrix.populateMatrixWithViruses(0);
        this.pillQueue = [];
        this.currentPill = this.getNextPill();
        //possible states: controlling, settling, clearing, topOut, frozen
        this.state = 'controlling';
        // how many times update() is called per second
        this.tickFrequency = 60;
        this.tickCounter = 0;
        this.combo = [];
    }
    update(inputState) {
        this.tickCounter ++;
        if (this.state == 'controlling') {

            if(inputState.LEFT) {
                let updatedPill = this.currentPill.copy();
                updatedPill.x --;
                if (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill;
                }
            }
            if(inputState.RIGHT) {
                let updatedPill = this.currentPill.copy();
                updatedPill.x ++;
                if (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill;
                }
            }
            if(inputState.SOFT_DROP) {
                let updatedPill = this.currentPill.copy();
                updatedPill.y ++;
                if (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill;
                }
            }
            // TODO: add kicks for rotation
            if(inputState.ROTATE_CLOCKWISE) {
                let updatedPill = this.currentPill.copy();
                updatedPill.rotateColockwise();
                if (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill;
                }
            }
            if(inputState.ROTATE_COUNTERCLOCKWISE) {
                let updatedPill = this.currentPill.copy();
                updatedPill.rotateCounterclockwise();
                if (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill;
                }
            }
            if(inputState.HARD_DROP) {
                let updatedPill = this.currentPill.copy();
                while (!this.matrix.conflictsWith(updatedPill)) {
                    this.currentPill = updatedPill.copy();
                    updatedPill.y ++;
                }
                this.matrix.addPillToCells(this.currentPill);
                this.state = 'settling';
            }
            if(inputState.DEBUG) {
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

            let clears = this.matrix.clearPills();
            if (clears.length == 0) {
                if (this.matrix.settlePills() == 0) {
                    if (this.combo.length >= 2) {
                        this.matrix.addGarbage(this.combo);
                    } else {
                        let p = this.getNextPill();
                        if (this.matrix.conflictsWith(p)) {
                            this.state = 'topOut';
                        } else {
                            this.currentPill = p;
                            this.state = 'controlling';
                        }
                    }
                    this.combo = [];

                }
            }
            this.combo = this.combo.concat(clears);
        }
    }
    getNextPill() {
        while (this.pillQueue.length < 4) {
            this.pillQueue.push(new Pill());
        }
        return this.pillQueue.shift();
    }
    getViewObject() {
        let output = {
            matrix: this.matrix.copy(),
            state: this.state,
            pillQueue: this.pillQueue,
        };
        if (this.state == 'controlling') {
            output.matrix.addPillToCells(this.currentPill);
        }

        return output;
    }
}

module.exports = Game;
