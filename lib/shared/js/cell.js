export default class Cell {
    constructor(color, isVirus, linkage) {
        // color is an integer can be 0, 1, or 2
        this.color = color;
        this.isVirus = isVirus;
        // linkage is which direction the cell is connected towards; it is the direction of the other linked cell
        this.linkage = linkage;
    }
    copy() {
        return new Cell(this.color, this.isVirus, this.linkage);
    }
}
