export class UiFacade {
    static getElement<T extends HTMLElement = HTMLElement>(id: string): T | null {
        return document.getElementById(id) as T | null;
    }

    static getInputValue(id: string): string {
        const element = this.getElement<HTMLInputElement>(id);
        return element ? element.value : "";
    }

    static setInputValue(id: string, value: string | number): void {
        const element = this.getElement<HTMLInputElement>(id);
        if (element) {
            element.value = String(value);
        }
    }

    static setText(id: string, value: string): void {
        const element = this.getElement(id);
        if (element) {
            element.textContent = value;
        }
    }

    static getText(id: string): string {
        const element = this.getElement(id);
        return element?.textContent ?? "";
    }

    static setDisplay(id: string, displayMode: string): void {
        const element = this.getElement(id);
        if (element) {
            element.style.display = displayMode;
        }
    }

    static show(id: string, displayMode = "block"): void {
        const element = this.getElement(id);
        if (element) {
            element.style.display = displayMode;
        }
    }

    static hide(id: string): void {
        const element = this.getElement(id);
        if (element) {
            element.style.display = "none";
        }
    }

    static getDisplay(id: string): string {
        const element = this.getElement(id);
        return element ? element.style.display : "";
    }

    static removeClass(id: string, className: string): void {
        const element = this.getElement(id);
        if (element) {
            element.classList.remove(className);
        }
    }

    static addClass(id: string, className: string): void {
        const element = this.getElement(id);
        if (element) {
            element.classList.add(className);
        }
    }

    static hasClass(id: string, className: string): boolean {
        const element = this.getElement(id);
        return element ? element.classList.contains(className) : false;
    }

    static clearChildren(id: string): void {
        const element = this.getElement(id);
        if (element) {
            element.replaceChildren();
        }
    }

    static getCssNumberVar(name: string, fallback = 0): number {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? fallback : parsed;
    }

    static setElementSize(element: HTMLCanvasElement | null, width: number, height: number): void {
        if (!element) {
            return;
        }
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.width = width;
        element.height = height;
    }

    static getCanvasElement(id: string): HTMLCanvasElement | null {
        return this.getElement<HTMLCanvasElement>(id);
    }

    static getCanvasContext(id: string): CanvasRenderingContext2D | null {
        const canvas = this.getCanvasElement(id);
        if (!canvas?.getContext) {
            return null;
        }
        return canvas.getContext("2d");
    }

    static createColorButton(
        color: string,
        width: number,
        height: number,
        onClick: () => void
    ): HTMLButtonElement {
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

    static appendChild(parent: HTMLElement, child: HTMLElement): void {
        parent.appendChild(child);
    }
}
