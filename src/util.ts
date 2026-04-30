import { UiFacade } from "./uifacade.js";

export class Util {
    static setElementSize(element: HTMLCanvasElement | null, width: number, height: number): void {
        UiFacade.setElementSize(element, width, height);
    }

    static getInputValue(id: string): string {
        return UiFacade.getInputValue(id);
    }

    static setInputValue(id: string, value: string | number): void {
        UiFacade.setInputValue(id, value);
    }

    static setText(id: string, value: string): void {
        UiFacade.setText(id, value);
    }

    static show(id: string, displayMode = "block"): void {
        UiFacade.show(id, displayMode);
    }

    static hide(id: string): void {
        UiFacade.hide(id);
    }

    static removeClass(id: string, className: string): void {
        UiFacade.removeClass(id, className);
    }

    static clearChildren(id: string): void {
        UiFacade.clearChildren(id);
    }

    static getCssNumberVar(name: string, fallback = 0): number {
        return UiFacade.getCssNumberVar(name, fallback);
    }
}
