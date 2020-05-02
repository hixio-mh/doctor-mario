'use strict';

import Cell from './cell.js';

export default class Pill {
    constructor() {
        this.x = 3;
        this.y = -1;

        let leftCol = Math.floor(Math.random() * 3);
        let rightCol = Math.floor(Math.random() * 3);
        //let rightCol = Math.floor(Math.random() * (3-leftCol) + leftCol);
        this.cells = [
            [null, null],
            [new Cell(leftCol, false, 'right'), new Cell(rightCol, false, 'left')]
        ];
    }
    rotateColockwise() {
        if(this.cells[0][0] != null) {
            this.cells[1][1] = this.cells[0][0];
            this.cells[0][0] = null;
            this.cells[1][0].linkage = 'right';
            this.cells[1][1].linkage = 'left';
        }
        else {
            this.cells[0][0] = this.cells[1][0];
            this.cells[1][0] = this.cells[1][1];
            this.cells[1][1] = null;
            this.cells[0][0].linkage = 'down';
            this.cells[1][0].linkage = 'up';
        }
    }
    rotateCounterclockwise() {
        if(this.cells[0][0] != null) {
            this.cells[1][1] = this.cells[1][0];
            this.cells[1][0] = this.cells[0][0];
            this.cells[0][0] = null;
            this.cells[1][0].linkage = 'right';
            this.cells[1][1].linkage = 'left';
        }
        else {
            this.cells[0][0] = this.cells[1][1];
            this.cells[1][1] = null;
            this.cells[0][0].linkage = 'down';
            this.cells[1][0].linkage = 'up';
        }
    }
    copy() {
        let p = new Pill();
        p.x = this.x;
        p.y = this.y;
        for(let r = 0; r < this.cells.length; r++) {
            p.cells[r] = [null, null];
            for(let c = 0; c < this.cells[0].length; c++) {
                if(this.cells[r][c] != null) {
                    p.cells[r][c] = Object.assign({}, this.cells[r][c]);
                }
            }
        }
        return p;
    }
}
