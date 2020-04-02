'use strict';

import Cell from './cell.js';

class Matrix {
    constructor(width, height) {
        let m = [];
        for(let r = 0; r < height; r++) {
            m[r] = [];
            for(let c = 0; c < width; c++) {
                m[r][c] = null;
            }
        }
        this.cells = m;
    }
    populateMatrixWithViruses(virusesToPlace) {
        //may want to find a faster way to do this. Shuffle the array?
        while(virusesToPlace > 0) {
            let row = Math.floor(Math.random() * (this.cells.length-3) + 3);
            let col = Math.floor(Math.random() * this.cells[0].length);
            if(this.cells[row][col] == 0) {
                let col = Math.floor(Math.random() * 3);
                this.cells[row][col] = new Cell(col, true, 'none');
                virusesToPlace --;
            }
        }
    }
    settlePills() {
        for (let r = this.cells.length-1; r > 0; r++) {
            for (let c = 0; c < this.cells[0].length; c++) {
                if(this.cells[r][c] == null) {
                    // cell assigned just to save time
                    let cell = this.cells[r-1][c];

                    if (cell != null && cell.isVirus == false) {
                        if(cell.linkage == 'none') {
                            this.cells[r][c] = cell;
                            this.cells[r-1][c] = null;
                        }
                    }
                    else if (cell.linkage == 'up') {
                        this.cells[r][c] = cell;
                        this.cells[r-1][c] = this.cells[r-2][c];
                        this.cells[r-2][c] = null;
                    }
                    else if (cell.linkage == 'left') {
                        if(this.cells[r][c-1] == null) {
                            this.cells[r][c-1] = this.cells[r-1][c-1];
                            this.cells[r][c] = cell;
                        }
                    }
                }
            }
        }
    }
    clearPills() {
        const STREAK_TO_CLEAR = 4;
        let updatedCells = [];
        // the color of each clear is added to combo
        let combo = [];

        // clear horizontal matches
        for(let r = 0; r < this.cells.length; r++) {
            let currentColor = "";
            let streak = 0;
            updatedCells[r] = [];
            for(let c = 0; c < this.cells[0].length; c++) {
                updatedCells[r][c] = this.cells[r][c];

                if (this.cells[r][c].color == currentColor) {
                    if(streak == STREAK_TO_CLEAR) {
                        for(let i = c; i > c-STREAK_TO_CLEAR; i--) {
                            updatedCells[r][i] = null;
                        }
                        combo.push(this.cells[r][c].color);
                    }
                    else if (streak > STREAK_TO_CLEAR) {
                        updatedCells[r][c] = null;
                    }
                    streak ++;
                }
                else {
                    currentColor = this.cells.color;
                    streak = 1;
                }
            }
        }

        //clear vertical matches
        for(let c = 0; c < this.cells[0].length; c++) {
            let currentColor = "";
            let streak = 0;

            for(let r = 0; r < this.cells.length; r++) {
                if (this.cells[r][c].color == currentColor) {
                    if(streak == STREAK_TO_CLEAR) {
                        for(let i = r; i > r-STREAK_TO_CLEAR; i--) {
                            updatedCells[i][c] = null;
                        }
                        combo.push(this.cells[r][c].color);
                    }
                    else if (streak > STREAK_TO_CLEAR) {
                        updatedCells[r][c] = null;
                    }
                    streak ++;
                }
                else {
                    currentColor = this.cells.color;
                    streak = 1;
                }
            }
        }


        // update cells and return the combo
        this.cells = updatedCells;
        return combo;
    }
}

module.exports = Matrix;
