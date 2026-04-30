import { UiFacade } from "./uifacade.js";
export class Util {
    static setElementSize(element, width, height) {
        UiFacade.setElementSize(element, width, height);
    }
    static getInputValue(id) {
        return UiFacade.getInputValue(id);
    }
    static setInputValue(id, value) {
        UiFacade.setInputValue(id, value);
    }
    static setText(id, value) {
        UiFacade.setText(id, value);
    }
    static show(id, displayMode = "block") {
        UiFacade.show(id, displayMode);
    }
    static hide(id) {
        UiFacade.hide(id);
    }
    static removeClass(id, className) {
        UiFacade.removeClass(id, className);
    }
    static clearChildren(id) {
        UiFacade.clearChildren(id);
    }
    static getCssNumberVar(name, fallback = 0) {
        return UiFacade.getCssNumberVar(name, fallback);
    }
}
