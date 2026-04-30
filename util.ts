export class Util
{
    static setElementSize(
        element: HTMLCanvasElement | null,
        width: number,
        height: number
    ): void
    {
        if (!element)
        {
            return;
        }
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.width = width;
        element.height = height;
    }

    static getInputValue(id: string): string
    {
        const element = document.getElementById(id) as HTMLInputElement | null;
        return element ? element.value : "";
    }

    static setInputValue(id: string, value: string | number): void
    {
        const element = document.getElementById(id) as HTMLInputElement | null;
        if (element)
        {
            element.value = String(value);
        }
    }

    static setText(id: string, value: string): void
    {
        const element = document.getElementById(id);
        if (element)
        {
            element.textContent = value;
        }
    }

    static show(id: string, displayMode = "block"): void
    {
        const element = document.getElementById(id);
        if (element)
        {
            element.style.display = displayMode;
        }
    }

    static hide(id: string): void
    {
        const element = document.getElementById(id);
        if (element)
        {
            element.style.display = "none";
        }
    }

    static removeClass(id: string, className: string): void
    {
        const element = document.getElementById(id);
        if (element)
        {
            element.classList.remove(className);
        }
    }

    static clearChildren(id: string): void
    {
        const element = document.getElementById(id);
        if (element)
        {
            element.replaceChildren();
        }
    }

    static getCssNumberVar(name: string, fallback = 0): number
    {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? fallback : parsed;
    }
}
