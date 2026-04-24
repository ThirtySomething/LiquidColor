export function setElementSize(element, width, height) {
    if (!element) {
        return;
    }
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.width = width;
    element.height = height;
}
export function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
}
export function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = String(value);
    }
}
export function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}
export function show(id, displayMode = "block") {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = displayMode;
    }
}
export function hide(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = "none";
    }
}
export function removeClass(id, className) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove(className);
    }
}
export function clearChildren(id) {
    const element = document.getElementById(id);
    if (element) {
        element.replaceChildren();
    }
}
export function getCssNumberVar(name, fallback = 0) {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}
