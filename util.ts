function setElementSize(
    element: HTMLCanvasElement | null,
    width: number,
    height: number
): void {
    if (!element) {
        return;
    }
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.width = width;
    element.height = height;
}

function getInputValue(id: string): string {
    const element = document.getElementById(id) as HTMLInputElement | null;
    return element ? element.value : "";
}

function setInputValue(id: string, value: string | number): void {
    const element = document.getElementById(id) as HTMLInputElement | null;
    if (element) {
        element.value = String(value);
    }
}

function setText(id: string, value: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function show(id: string, displayMode = "block"): void {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = displayMode;
    }
}

function hide(id: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = "none";
    }
}

function removeClass(id: string, className: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove(className);
    }
}

function clearChildren(id: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.replaceChildren();
    }
}

function getCssNumberVar(name: string, fallback = 0): number {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}
