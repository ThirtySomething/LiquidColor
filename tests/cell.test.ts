import { describe, expect, it, vi } from "vitest";

import { Cell } from "../src/cell";
import { Definitions } from "../src/definitions";

const getCanvasCtx = (): CanvasRenderingContext2D =>
    ({
        beginPath: vi.fn(),
        rect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillStyle: ""
    }) as unknown as CanvasRenderingContext2D;

describe("Cell", () => {
    it("draw paints only when m_DoRedraw is true", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const cell = new Cell(1, 1);
        cell.m_Color = "red";
        const ctx = getCanvasCtx();

        cell.draw(definitions, ctx);
        expect((ctx.beginPath as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);

        cell.draw(definitions, ctx);
        expect((ctx.beginPath as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
    });

    it("ownerSet marks occupied and owner", () => {
        const cell = new Cell(0, 0);
        cell.ownerSet("P");
        expect(cell.m_Owner).toBe("P");
        expect(cell.m_Occupied).toBe(true);
    });

    it("neighboursGet returns neighbors by ownership and color rules", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const cells = [
            [new Cell(0, 0), new Cell(1, 0)],
            [new Cell(0, 1), new Cell(1, 1)]
        ];

        const source = cells[0][0];
        source.m_Color = "blue";
        source.m_Owner = "A";
        source.m_Occupied = true;

        const sameColorUnoccupied = cells[0][1];
        sameColorUnoccupied.m_Color = "blue";
        sameColorUnoccupied.m_Occupied = false;

        const sameOwnerDifferentColor = cells[1][0];
        sameOwnerDifferentColor.m_Color = "red";
        sameOwnerDifferentColor.m_Owner = "A";
        sameOwnerDifferentColor.m_Occupied = true;

        const blocked = cells[1][1];
        blocked.m_DoRedraw = false;

        const neighbours = source.neighboursGet(cells, definitions);

        expect(neighbours).toContain(sameColorUnoccupied);
        expect(neighbours).toContain(sameOwnerDifferentColor);
        expect(neighbours).not.toContain(blocked);
    });

    it("neighboursGet handles sparse rows and missing neighbors", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const sparse = [[new Cell(0, 0)]] as unknown as Cell[][];

        expect(() => sparse[0][0].neighboursGet(sparse, definitions)).not.toThrow();
    });

    it("cellColorRandomGet returns selected index color or current color fallback", () => {
        const cell = new Cell(0, 0);
        cell.m_Color = "fallback";

        vi.spyOn(Math, "random").mockReturnValue(0.5);
        expect(cell.cellColorRandomGet(["a", "b", "c"])).toBe("b");

        vi.spyOn(Math, "random").mockReturnValue(0.99);
        expect(cell.cellColorRandomGet([])).toBe("fallback");
    });

    it("isBorderCell detects adjacent unoccupied cells", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const cells = [
            [new Cell(0, 0), new Cell(1, 0)],
            [new Cell(0, 1), new Cell(1, 1)]
        ];

        cells[0][1].m_Occupied = true;
        cells[1][0].m_Occupied = true;
        expect(cells[0][0].isBorderCell(cells, definitions)).toBe(false);

        cells[1][0].m_Occupied = false;
        expect(cells[0][0].isBorderCell(cells, definitions)).toBe(true);
    });

    it("isBorderCell handles sparse grid rows and neighbors", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const sparse = [[new Cell(0, 0)]] as unknown as Cell[][];

        expect(() => sparse[0][0].isBorderCell(sparse, definitions)).not.toThrow();
    });
});
