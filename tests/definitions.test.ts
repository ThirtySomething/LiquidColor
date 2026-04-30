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
});
