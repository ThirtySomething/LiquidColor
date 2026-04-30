import { describe, expect, it } from "vitest";

import { Util } from "../util";

describe("Util", () => {
    it("setElementSize updates style and canvas dimensions", () => {
        const canvas = document.createElement("canvas");

        Util.setElementSize(canvas, 123, 45);

        expect(canvas.style.width).toBe("123px");
        expect(canvas.style.height).toBe("45px");
        expect(canvas.width).toBe(123);
        expect(canvas.height).toBe(45);
    });

    it("setElementSize is a no-op for null element", () => {
        expect(() => Util.setElementSize(null, 1, 1)).not.toThrow();
    });

    it("reads and writes input values", () => {
        document.body.innerHTML = '<input id="value" value="old">';

        expect(Util.getInputValue("value")).toBe("old");
        Util.setInputValue("value", 42);
        expect(Util.getInputValue("value")).toBe("42");
        expect(Util.getInputValue("missing")).toBe("");
    });

    it("sets text and show/hide display", () => {
        document.body.innerHTML = '<div id="x"></div>';

        Util.setText("x", "hello");
        Util.show("x", "flex");
        expect(document.getElementById("x")?.textContent).toBe("hello");
        expect((document.getElementById("x") as HTMLElement).style.display).toBe("flex");

        Util.hide("x");
        expect((document.getElementById("x") as HTMLElement).style.display).toBe("none");
    });

    it("removeClass and clearChildren handle missing and existing elements", () => {
        document.body.innerHTML = '<div id="parent" class="a"><span>child</span></div>';

        Util.removeClass("parent", "a");
        expect(document.getElementById("parent")?.classList.contains("a")).toBe(false);

        Util.clearChildren("parent");
        expect(document.getElementById("parent")?.children.length).toBe(0);

        expect(() => {
            Util.removeClass("missing", "x");
            Util.clearChildren("missing");
            Util.setText("missing", "x");
            Util.show("missing");
            Util.hide("missing");
        }).not.toThrow();
    });

    it("reads css number variable with fallback", () => {
        document.documentElement.style.setProperty("--button-gap", " 27 ");
        expect(Util.getCssNumberVar("--button-gap", 10)).toBe(27);
        expect(Util.getCssNumberVar("--nope", 11)).toBe(11);

        document.documentElement.style.setProperty("--bad", "oops");
        expect(Util.getCssNumberVar("--bad", 9)).toBe(9);
    });
});
