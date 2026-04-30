import type { Offset } from "./offset.js";

export type { Offset } from "./offset.js";

export class Definitions {
    private static instance: Definitions | null = null;
    private static readonly DEFAULT_DIMENSION_X = 30;
    private static readonly DEFAULT_DIMENSION_Y = 20;
    private static readonly DEFAULT_CELL_SIZE = 15;
    private static readonly MIN_DIMENSION = 2;
    private static readonly MAX_DIMENSION = 200;
    private static readonly MIN_CELL_SIZE = 2;
    private static readonly MAX_CELL_SIZE = 80;

    DimensionX: number;
    DimensionY: number;
    CellSize: number;
    Winner: number;
    Colors: string[];
    Offsets: Offset[];

    private constructor(dimX: number | string, dimY: number | string, cellSize: number | string) {
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

    static initialize(dimX: number | string, dimY: number | string, cellSize: number | string): void {
        if (!Definitions.instance) {
            Definitions.instance = new Definitions(dimX, dimY, cellSize);
        }
        else {
            Definitions.instance.reInit(dimX, dimY, cellSize);
        }
    }

    static getInstance(): Definitions {
        if (!Definitions.instance) {
            throw new Error("Definitions not initialized");
        }
        return Definitions.instance;
    }

    private sanitizeInt(
        value: number | string,
        min: number,
        max: number,
        fallback: number
    ): number {
        const parsed = Number.parseInt(String(value), 10);
        if (Number.isNaN(parsed)) {
            return fallback;
        }

        return Math.min(max, Math.max(min, parsed));
    }

    reInit(dimX: number | string, dimY: number | string, cellSize: number | string): void {
        const fallbackDimX = this.DimensionX > 0
            ? this.DimensionX
            : Definitions.DEFAULT_DIMENSION_X;
        const fallbackDimY = this.DimensionY > 0
            ? this.DimensionY
            : Definitions.DEFAULT_DIMENSION_Y;
        const fallbackCellSize = this.CellSize > 0
            ? this.CellSize
            : Definitions.DEFAULT_CELL_SIZE;

        this.DimensionX = this.sanitizeInt(
            dimX,
            Definitions.MIN_DIMENSION,
            Definitions.MAX_DIMENSION,
            fallbackDimX
        );
        this.DimensionY = this.sanitizeInt(
            dimY,
            Definitions.MIN_DIMENSION,
            Definitions.MAX_DIMENSION,
            fallbackDimY
        );
        this.CellSize = this.sanitizeInt(
            cellSize,
            Definitions.MIN_CELL_SIZE,
            Definitions.MAX_CELL_SIZE,
            fallbackCellSize
        );
        this.Winner = Math.floor((this.DimensionX * this.DimensionY) / 2 + 1);
    }
}
