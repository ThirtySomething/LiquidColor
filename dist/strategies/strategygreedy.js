import { Cell } from "../cell.js";
import { CaptureSimulator } from "./capturesimulator.js";
export class StrategyGreedy {
    chooseColor(input) {
        const { cells, definitions, newColorPlayer, compPlayerName, humanPlayerName, compCurrentColor } = input;
        const compOwned = new Set();
        const humanOwned = new Set();
        const allColors = new Set();
        cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.m_Owner === compPlayerName) {
                    compOwned.add(cell);
                }
                else if (cell.m_Owner === humanPlayerName) {
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
            const { gained } = CaptureSimulator.simulate(cells, definitions, compOwned, humanOwned, compColor);
            if (gained > bestGain) {
                bestGain = gained;
                bestColor = compColor;
            }
        }
        return bestColor;
    }
}
//# sourceMappingURL=strategygreedy.js.map