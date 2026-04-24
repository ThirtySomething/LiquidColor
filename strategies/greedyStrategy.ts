import { LCCell } from "../lccell.js";
import { simulateCapture } from "./simulateCapture.js";
import type { LCStrategyInput } from "./types.js";

export function chooseGreedyColor(input: LCStrategyInput): string {
    const {
        cells,
        definitions,
        newColorPlayer,
        compPlayerName,
        humanPlayerName,
        compCurrentColor
    } = input;

    const compOwned = new Set<LCCell>();
    const humanOwned = new Set<LCCell>();
    const allColors = new Set<string>();

    cells.forEach((row) => {
        row.forEach((cell) => {
            if (cell.m_Owner === compPlayerName) {
                compOwned.add(cell);
            } else if (cell.m_Owner === humanPlayerName) {
                humanOwned.add(cell);
            }
            if (!cell.m_Occupied) {
                allColors.add(cell.m_Color);
            }
        });
    });

    let bestColor = compCurrentColor;
    let bestGain = -1;

    for (const compColor of allColors) {
        if (compColor === newColorPlayer || compColor === compCurrentColor) {
            continue;
        }

        const { gained } = simulateCapture(cells, definitions, compOwned, humanOwned, compColor);
        if (gained > bestGain) {
            bestGain = gained;
            bestColor = compColor;
        }
    }

    return bestColor;
}
