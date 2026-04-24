import type { Offset } from "./offset.js";

export type { Offset } from "./offset.js";

export class Definitions 
{
    DimensionX: number;
    DimensionY: number;
    CellSize: number;
    Winner: number;
    Colors: string[];
    Offsets: Offset[];

    constructor(dimX: number | string, dimY: number | string, cellSize: number | string) 
    {
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

    reInit(dimX: number | string, dimY: number | string, cellSize: number | string): void 
    {
        this.DimensionX = Number.parseInt(String(dimX), 10);
        this.DimensionY = Number.parseInt(String(dimY), 10);
        this.CellSize = Number.parseInt(String(cellSize), 10);
        this.Winner = Math.floor((this.DimensionX * this.DimensionY) / 2 + 1);
    }
}
