class LCDefinitions {
    constructor(dimX, dimY, cellSize) {
        this.reInit(dimX, dimY, cellSize);
        this.Colors = ["blue", "cyan", "green", "red", "yellow"];
        this.Offsets = [
            { DX: 0, DY: 1 },
            { DX: 1, DY: 0 },
            { DX: 0, DY: -1 },
            { DX: -1, DY: 0 }
        ];
    }

    reInit(dimX, dimY, cellSize) {
        this.DimensionX = Number.parseInt(dimX, 10);
        this.DimensionY = Number.parseInt(dimY, 10);
        this.CellSize = Number.parseInt(cellSize, 10);
        this.Winner = Number.parseInt((this.DimensionX * this.DimensionY) / 2 + 1, 10);
    }
}