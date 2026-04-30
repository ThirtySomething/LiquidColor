export class Util {
    static setElementSize(element, width, height) {
        if (!element) {
            return;
        }
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.width = width;
        element.height = height;
    }
    static getInputValue(id) {
        const element = document.getElementById(id);
        return element ? element.value : "";
    }
    static setInputValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = String(value);
        }
    }
    static setText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    static show(id, displayMode = "block") {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = displayMode;
        }
    }
    static hide(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = "none";
        }
    }
    static removeClass(id, className) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove(className);
        }
    }
    static clearChildren(id) {
        const element = document.getElementById(id);
        if (element) {
            element.replaceChildren();
        }
    }
    static getCssNumberVar(name, fallback = 0) {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? fallback : parsed;
    }
}
