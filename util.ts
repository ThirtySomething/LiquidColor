export function setElementSize(
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

export function getInputValue(id: string): string {
    const element = document.getElementById(id) as HTMLInputElement | null;
    return element ? element.value : "";
}

export function setInputValue(id: string, value: string | number): void {
    const element = document.getElementById(id) as HTMLInputElement | null;
    if (element) {
        element.value = String(value);
    }
}

export function setText(id: string, value: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

export function show(id: string, displayMode = "block"): void {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = displayMode;
    }
}

export function hide(id: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = "none";
    }
}

export function removeClass(id: string, className: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove(className);
    }
}

export function clearChildren(id: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.replaceChildren();
    }
}

export function getCssNumberVar(name: string, fallback = 0): number {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}
