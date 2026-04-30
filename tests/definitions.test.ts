import { describe, expect, it } from "vitest";

import { Definitions } from "../definitions";

describe("Definitions", () => {
    it("throws when getInstance is called before initialization", () => {
        (Definitions as unknown as { instance: Definitions | null }).instance = null;
        expect(() => Definitions.getInstance()).toThrowError("Definitions not initialized");
    });

    it("uses defaults when initialized with non-numeric values", () => {
        Definitions.initialize("abc", "def", "ghi");
        const definitions = Definitions.getInstance();

        expect(definitions.DimensionX).toBe(30);
        expect(definitions.DimensionY).toBe(20);
        expect(definitions.CellSize).toBe(15);
        expect(definitions.Winner).toBe(Math.floor((30 * 20) / 2 + 1));
    });

    it("clamps values to configured min and max boundaries", () => {
        Definitions.initialize(1, 999, 999);
        const definitions = Definitions.getInstance();

        expect(definitions.DimensionX).toBe(2);
        expect(definitions.DimensionY).toBe(200);
        expect(definitions.CellSize).toBe(80);
        expect(definitions.Winner).toBe(Math.floor((2 * 200) / 2 + 1));
    });

    it("keeps previous values as fallback for invalid reInit input", () => {
        Definitions.initialize(10, 12, 6);
        const definitions = Definitions.getInstance();

        definitions.reInit("NaN", "NaN", "NaN");

        expect(definitions.DimensionX).toBe(10);
        expect(definitions.DimensionY).toBe(12);
        expect(definitions.CellSize).toBe(6);
    });

    it("accepts exact boundary values at min and max limits", () => {
        Definitions.initialize(2, 200, 80);
        const definitions = Definitions.getInstance();

        expect(definitions.DimensionX).toBe(2);
        expect(definitions.DimensionY).toBe(200);
        expect(definitions.CellSize).toBe(80);
    });

    it("coerces decimal and mixed string inputs using integer parsing", () => {
        Definitions.initialize("2.9", "003", "15px");
        const definitions = Definitions.getInstance();

        expect(definitions.DimensionX).toBe(2);
        expect(definitions.DimensionY).toBe(3);
        expect(definitions.CellSize).toBe(15);
    });

    it("falls back on invalid non-string/non-number values via coercion", () => {
        Definitions.initialize(9, 9, 9);
        const definitions = Definitions.getInstance();

        definitions.reInit(
            undefined as unknown as string,
            { bad: true } as unknown as string,
            null as unknown as string
        );

        expect(definitions.DimensionX).toBe(9);
        expect(definitions.DimensionY).toBe(9);
        expect(definitions.CellSize).toBe(9);
    });
});
