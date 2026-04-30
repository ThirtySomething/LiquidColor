import { describe, expect, it, vi } from "vitest";

import { UiFacade } from "../src/uifacade";

describe("UiFacade", () => {
    it("handles text/display/class operations and missing elements", () => {
        document.body.innerHTML = '<div id="x" class="old"><span>child</span></div><input id="inp" value="hello">';

        expect(UiFacade.getInputValue("inp")).toBe("hello");
        UiFacade.setInputValue("inp", 7);
        expect(UiFacade.getInputValue("inp")).toBe("7");

        UiFacade.setText("x", "txt");
        expect(UiFacade.getText("x")).toBe("txt");

        UiFacade.setDisplay("x", "flex");
        expect(UiFacade.getDisplay("x")).toBe("flex");
        UiFacade.show("x");
        expect(UiFacade.getDisplay("x")).toBe("block");
        UiFacade.hide("x");
        expect(UiFacade.getDisplay("x")).toBe("none");

        UiFacade.removeClass("x", "old");
        expect(UiFacade.hasClass("x", "old")).toBe(false);
        UiFacade.addClass("x", "new");
        expect(UiFacade.hasClass("x", "new")).toBe(true);

        UiFacade.clearChildren("x");
        expect(document.getElementById("x")?.children.length).toBe(0);

        expect(UiFacade.getText("missing")).toBe("");
        expect(UiFacade.getDisplay("missing")).toBe("");
        expect(UiFacade.hasClass("missing", "x")).toBe(false);
        expect(() => {
            UiFacade.setInputValue("missing", "x");
            UiFacade.setText("missing", "x");
            UiFacade.setDisplay("missing", "none");
            UiFacade.show("missing");
            UiFacade.hide("missing");
            UiFacade.removeClass("missing", "x");
            UiFacade.addClass("missing", "x");
            UiFacade.clearChildren("missing");
        }).not.toThrow();
    });

    it("reads css number vars and sets element size", () => {
        document.documentElement.style.setProperty("--gap", " 12 ");
        expect(UiFacade.getCssNumberVar("--gap", 4)).toBe(12);
        expect(UiFacade.getCssNumberVar("--missing", 5)).toBe(5);

        const canvas = document.createElement("canvas");
        UiFacade.setElementSize(canvas, 30, 40);
        expect(canvas.style.width).toBe("30px");
        expect(canvas.style.height).toBe("40px");
        expect(canvas.width).toBe(30);
        expect(canvas.height).toBe(40);

        expect(() => UiFacade.setElementSize(null, 1, 1)).not.toThrow();
    });

    it("gets canvas context, including null branch when canvas/context is unavailable", () => {
        document.body.innerHTML = '<canvas id="ok"></canvas><div id="bad"></div>';
        const canvas = document.getElementById("ok") as HTMLCanvasElement;
        const fakeCtx = {} as CanvasRenderingContext2D;
        (canvas as unknown as { getContext: () => CanvasRenderingContext2D }).getContext = () => fakeCtx;

        expect(UiFacade.getCanvasElement("ok")).toBe(canvas);
        expect(UiFacade.getCanvasContext("ok")).toBe(fakeCtx);
        expect(UiFacade.getCanvasContext("missing")).toBeNull();
        expect(UiFacade.getCanvasContext("bad")).toBeNull();
    });

    it("creates color button and appendChild wires click handler", () => {
        document.body.innerHTML = '<div id="p"></div>';
        const parent = document.getElementById("p") as HTMLElement;
        const clickSpy = vi.fn();

        const button = UiFacade.createColorButton("red", 22, 33, clickSpy);
        UiFacade.appendChild(parent, button);
        button.click();

        expect(button.id).toBe("red");
        expect(button.className).toBe("gamebtn");
        expect(button.style.backgroundColor).toBe("red");
        expect(button.style.width).toBe("22px");
        expect(button.style.height).toBe("33px");
        expect(button.getAttribute("aria-label")).toBe("Choose red color");
        expect(parent.children).toHaveLength(1);
        expect(clickSpy).toHaveBeenCalledTimes(1);
    });
});
