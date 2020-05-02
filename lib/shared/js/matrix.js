'use strict';

import Cell from './cell.js';

export default class Matrix {
    /**
    width and height are in cells
    tickSpeed is the time in milliseconds between updates
    */
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
        // TODO: use the method described in the wiki
        while(virusesToPlace > 0) {
            let y = Math.floor(Math.random() * (this.cells.length-3) + 3);
            let x = Math.floor(Math.random() * this.cells[0].length);
            if(this.cells[y][x] == null) {
                let color = Math.floor(Math.random() * 3);
                this.cells[y][x] = new Cell(color, true, 'none');
                virusesToPlace --;
            }
            // ensure there are no streaks of viruses
            if (virusesToPlace == 0) {
                let virusesPlaced = this.virusesRemaining();
                this.clearStreaks();
                virusesToPlace += virusesPlaced - this.virusesRemaining();
            }
        }
    }
    //returns the number of pills settled
    settlePills() {
        let pillsSettled = 0;

        for (let r = this.cells.length-1; r > 0; r--) {
            for (let c = 0; c < this.cells[0].length; c++) {
                if(this.cells[r][c] == null) {
                    // cell assigned just to save time
                    let cell = this.cells[r-1][c];
                    if (cell != null) {

                        if (cell.isVirus == false) {
                            if(cell.linkage == 'none') {
                                this.cells[r][c] = cell;
                                this.cells[r-1][c] = null;
                                pillsSettled ++;
                            }
                            else if (cell.linkage == 'up') {
                                this.cells[r][c] = cell;
                                this.cells[r-1][c] = this.cells[r-2][c];
                                this.cells[r-2][c] = null;
                                pillsSettled += 2;
                            }
                            else if (cell.linkage == 'left') {
                                if(this.cells[r][c-1] == null) {
                                    this.cells[r][c-1] = this.cells[r-1][c-1];
                                    this.cells[r][c] = cell;
                                    pillsSettled += 2;
                                }
                            }
                        }

                    }
                }
            }
        }

        return pillsSettled;
    }
    // returns array of colors cleared (combo)
    clearStreaks() {
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
                updatedCells[r][c] = null;
                if (this.cells[r][c] != null) {
                    updatedCells[r][c] = this.cells[r][c];
                    if (this.cells[r][c].color % 3 == currentColor) {
                        streak ++;

                        if(streak == STREAK_TO_CLEAR) {
                            for(let i = c; i > c-STREAK_TO_CLEAR; i--) {
                                updatedCells[r][i] = null;
                                // updatedCells = this.clearLinkagesAround(updatedCells, r, i);
                            }
                            combo.push(this.cells[r][c].color % 3);
                        }
                        else if (streak > STREAK_TO_CLEAR) {
                            updatedCells[r][c] = null;
                            // updatedCells = this.clearLinkagesAround(updatedCells, r, c);
                        }
                    }
                    else {
                        currentColor = this.cells[r][c].color % 3;
                        streak = 1;
                    }
                } else {
                    streak = 0;
                }
            }
        }

        //clear vertical matches
        for(let c = 0; c < this.cells[0].length; c++) {
            let currentColor = -1;
            let streak = 0;

            for(let r = 0; r < this.cells.length; r++) {
                if (this.cells[r][c] != null) {
                    if (this.cells[r][c].color == currentColor) {
                        streak ++;

                        if(streak == STREAK_TO_CLEAR) {
                            for(let i = r; i > r-STREAK_TO_CLEAR; i--) {
                                updatedCells[i][c] = null;
                                // updatedCells = this.clearLinkagesAround(updatedCells, i, c);
                            }
                            combo.push(this.cells[r][c].color);
                        }
                        else if (streak > STREAK_TO_CLEAR) {
                            updatedCells[r][c] = null;
                            // updatedCells = this.clearLinkagesAround(updatedCells, r, c);
                        }
                    }
                    else {
                        currentColor = this.cells[r][c].color;
                        streak = 1;
                    }
                } else {
                    streak = 0;
                }
            }
        }


        // update cells and return the combo
        this.cells = updatedCells;
        this.fixBrokenLinkages();
        return combo;
    }
    // hardcoded because there aren't many cases
    addGarbage(combo) {
        if (combo.length < 2) {
            return;
        }
        else if (combo.length == 2) {
            let pos1 = Math.floor(Math.random() * (this.cells[0].length - 4));
            this.addGarbageHelper(pos1, combo[0]);
            this.addGarbageHelper(pos1 + 4, combo[1]);
        }
        else if (combo.length == 3) {
            let pos1 = Math.floor(Math.random() * (this.cells[0].length - 4));
            this.addGarbageHelper(pos1, combo[0]);
            this.addGarbageHelper(pos1 + 2, combo[1]);
            this.addGarbageHelper(pos1 + 4, combo[2]);
        }
        else {
            let pos1 = Math.floor(Math.random() * (this.cells[0].length - 6));
            this.addGarbageHelper(pos1, combo[0]);
            this.addGarbageHelper(pos1 + 2, combo[1]);
            this.addGarbageHelper(pos1 + 4, combo[2]);
            this.addGarbageHelper(pos1 + 6, combo[3]);
        }
    }
    addGarbageHelper(x, col) {
        if (this.cells[0][x] == null) {
            this.cells[0][x] = new Cell(col, false, 'none');
        }
    }
    virusesRemaining() {
        let viruses = 0;
        for(let r = 0; r < this.cells.length; r++) {
            for(let c = 0; c < this.cells[0].length; c++) {
                if(this.cells[r][c] != null && this.cells[r][c].isVirus) {
                    viruses ++;
                }
            }
        }
        return viruses;
    }
    addPillToCells(pill) {
        for(let r = 0; r < pill.cells.length; r++) {
            for(let c = 0; c < pill.cells[0].length; c++) {
                if (pill.cells[r][c] != null) {
                    this.cells[r+pill.y][c+pill.x] = pill.cells[r][c];
                }
            }
        }
    }
    conflictsWith(pill) {
        for(let r = 0; r < pill.cells.length; r++) {
            for(let c = 0; c < pill.cells[0].length; c++) {
                if(pill.cells[r][c] != null) {
                    // pill extends past left of matrix
                    if (pill.x + c < 0) return true;
                    // pill extends past right of matrix
                    if (pill.x + c > this.cells[0].length-1) return true;
                    // pill extends below matrix
                    if (pill.y + r > this.cells.length-1) return true;
                    // pill extends above matrix
                    // TODO: this probably isn't necessary and should be removed eventually
                    if (pill.y + r < 0) return true;
                    // pill overlaps with existing cells in matrix
                    if (this.cells[pill.y+r][pill.x+c] != null) return true;
                }
            }
        }
        return false;
    }

    copy() {
        let m = new Matrix(this.cells[0].length, this.cells.length);
        for(let r = 0; r < this.cells.length; r++) {
            for(let c = 0; c < this.cells[0].length; c++) {
                if(this.cells[r][c] != null) {
                    // TODO: this method may be laggy, but it works
                    m.cells[r][c] = Object.assign({}, this.cells[r][c]);
                }
            }
        }
        return m;
    }

    // utility function
    // no longer used
    clearLinkagesAround(cells, r, c) {
        //above
        if (r > 0 && cells[r-1][c] != null && cells[r-1][c].linkage == 'down') {
            cells[r-1][c].linkage = 'none';
        }
        //right
        if (c < cells[0].length-1 && cells[r][c+1] != null && cells[r][c+1].linkage == 'left') {
            cells[r][c+1].linkage = 'none';
        }
        //below
        if (r < cells.length-1 && cells[r+1][c] != null && cells[r+1][c].linkage == 'up') {
            cells[r+1][c].linkage = 'none';
        }
        //left
        if (c > 0 && cells[r][c-1] != null && cells[r][c-1].linkage == 'right') {
            cells[r][c-1].linkage = 'none';
        }

        return cells;
    }
    fixBrokenLinkages() {
        for (let r = 0; r < this.cells.length; r++) {
            for (let c = 0; c < this.cells[0].length; c++) {
                if (this.cells[r][c] != null) {
                    switch (this.cells[r][c].linkage) {
                        case 'up':
                            if (r == 0 || this.cells[r-1][c] == null || this.cells[r-1][c].linkage != 'down') {
                                this.cells[r][c].linkage = 'none';
                            }
                            break;
                        case 'down':
                            if (r == this.cells.length-1 || this.cells[r+1][c] == null || this.cells[r+1][c].linkage != 'up') {
                                this.cells[r][c].linkage = 'none';
                            }
                            break;
                        case 'left':
                            if (c == 0 || this.cells[r][c-1] == null || this.cells[r][c-1].linkage != 'right') {
                                this.cells[r][c].linkage = 'none';
                            }
                            break;
                        case 'right':
                            if (c == this.cells[0].length-1 || this.cells[r][c+1] == null || this.cells[r][c+1].linkage != 'left') {
                                this.cells[r][c].linkage = 'none';
                            }
                            break;
                    }
                }
            }
        }
    }
}
