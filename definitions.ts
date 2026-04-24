import type { Offset } from "./offset.js";

export type { Offset } from "./offset.js";

export class Definitions 
{
    private static instance: Definitions | null = null;

    DimensionX: number;
    DimensionY: number;
    CellSize: number;
    Winner: number;
    Colors: string[];
    Offsets: Offset[];

    private constructor(dimX: number | string, dimY: number | string, cellSize: number | string) 
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

    static initialize(dimX: number | string, dimY: number | string, cellSize: number | string): void 
    {
        if (!Definitions.instance) 
        {
            Definitions.instance = new Definitions(dimX, dimY, cellSize);
        }
        else 
        {
            Definitions.instance.reInit(dimX, dimY, cellSize);
        }
    }

    static getInstance(): Definitions 
    {
        if (!Definitions.instance) 
        {
            throw new Error("Definitions not initialized");
        }
        return Definitions.instance;
    }

    reInit(dimX: number | string, dimY: number | string, cellSize: number | string): void 
    {
        this.DimensionX = Number.parseInt(String(dimX), 10);
        this.DimensionY = Number.parseInt(String(dimY), 10);
        this.CellSize = Number.parseInt(String(cellSize), 10);
        this.Winner = Math.floor((this.DimensionX * this.DimensionY) / 2 + 1);
    }
}
