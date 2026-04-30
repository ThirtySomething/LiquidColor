export class UiFacade {
    static getElement(id) {
        return document.getElementById(id);
    }
    static getInputValue(id) {
        const element = this.getElement(id);
        return element ? element.value : "";
    }
    static setInputValue(id, value) {
        const element = this.getElement(id);
        if (element) {
            element.value = String(value);
        }
    }
    static setText(id, value) {
        const element = this.getElement(id);
        if (element) {
            element.textContent = value;
        }
    }
    static getText(id) {
        const element = this.getElement(id);
        return element?.textContent ?? "";
    }
    static setDisplay(id, displayMode) {
        const element = this.getElement(id);
        if (element) {
            element.style.display = displayMode;
        }
    }
    static show(id, displayMode = "block") {
        const element = this.getElement(id);
        if (element) {
            element.style.display = displayMode;
        }
    }
    static hide(id) {
        const element = this.getElement(id);
        if (element) {
            element.style.display = "none";
        }
    }
    static getDisplay(id) {
        const element = this.getElement(id);
        return element ? element.style.display : "";
    }
    static removeClass(id, className) {
        const element = this.getElement(id);
        if (element) {
            element.classList.remove(className);
        }
    }
    static addClass(id, className) {
        const element = this.getElement(id);
        if (element) {
            element.classList.add(className);
        }
    }
    static hasClass(id, className) {
        const element = this.getElement(id);
        return element ? element.classList.contains(className) : false;
    }
    static clearChildren(id) {
        const element = this.getElement(id);
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
    static setElementSize(element, width, height) {
        if (!element) {
            return;
        }
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.width = width;
        element.height = height;
    }
    static getCanvasElement(id) {
        return this.getElement(id);
    }
    static getCanvasContext(id) {
        const canvas = this.getCanvasElement(id);
        if (!canvas?.getContext) {
            return null;
        }
        return canvas.getContext("2d");
    }
    static createColorButton(color, width, height, onClick) {
        const colorButton = document.createElement("button");
        colorButton.type = "button";
        colorButton.id = color;
        colorButton.className = "gamebtn";
        colorButton.style.backgroundColor = color;
        colorButton.style.width = `${width}px`;
        colorButton.style.height = `${height}px`;
        colorButton.setAttribute("aria-label", `Choose ${color} color`);
        colorButton.addEventListener("click", onClick);
        return colorButton;
    }
    static appendChild(parent, child) {
        parent.appendChild(child);
    }
}
