"use strict";
function setElementSize(element, width, height) {
    if (!element) {
        return;
    }
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.width = width;
    element.height = height;
}
function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
}
function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = String(value);
    }
}
function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}
function show(id, displayMode = "block") {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = displayMode;
    }
}
function hide(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = "none";
    }
}
function removeClass(id, className) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove(className);
    }
}
function clearChildren(id) {
    const element = document.getElementById(id);
    if (element) {
        element.replaceChildren();
    }
}
function getCssNumberVar(name, fallback = 0) {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}
