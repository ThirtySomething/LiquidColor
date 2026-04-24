export class LCDefinitions {
    DimensionX;
    DimensionY;
    CellSize;
    Winner;
    Colors;
    Offsets;
    constructor(dimX, dimY, cellSize) {
        this.DimensionX = 0;
        this.DimensionY = 0;
        this.CellSize = 0;
        this.Winner = 0;
        this.Colors = ["blue", "cyan", "green", "red", "yellow"];
        this.Offsets = [
            { DX: 0, DY: 1 },
            { DX: 1, DY: 0 },
            { DX: 0, DY: -1 },
            { DX: -1, DY: 0 }
        ];
        this.reInit(dimX, dimY, cellSize);
    }
    reInit(dimX, dimY, cellSize) {
        this.DimensionX = Number.parseInt(String(dimX), 10);
        this.DimensionY = Number.parseInt(String(dimY), 10);
        this.CellSize = Number.parseInt(String(cellSize), 10);
        this.Winner = Math.floor((this.DimensionX * this.DimensionY) / 2 + 1);
    }
}
//# sourceMappingURL=lcdefinitions.js.map