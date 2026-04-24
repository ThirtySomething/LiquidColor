import { Cell } from "../cell.js";
import { CaptureSimulator } from "./capturesimulator.js";
import type { IComputerStrategy } from "./icomputerstrategy.js";
import type { StrategyInput } from "./strategyinput.js";
export class StrategyMinimax implements IComputerStrategy 
{
    chooseColor(input: StrategyInput): string 
    {
        const {
            cells,
            definitions,
            newColorPlayer,
            compPlayerName,
            humanPlayerName,
            compCurrentColor,
            humanCurrentColor
        } = input;

        const DENY_WEIGHT = 1.2;
        const DIVERSITY_WEIGHT = 0.15;

        const compOwned = new Set<Cell>();
        const humanOwned = new Set<Cell>();
        const allColors = new Set<string>();

        cells.forEach((row) => 
        {
            row.forEach((cell) => 
            {
                if (cell.m_Owner === compPlayerName) 
                {
                    compOwned.add(cell);
                }
                else if (cell.m_Owner === humanPlayerName) 
                {
                    humanOwned.add(cell);
                }
                if (!cell.m_Occupied) 
                {
                    allColors.add(cell.m_Color);
                }
            });
        });

        let bestColor = compCurrentColor;
        let bestScore = -Infinity;

        for (const compColor of allColors) 
        {
            if (compColor === newColorPlayer || compColor === compCurrentColor) 
            {
                continue;
            }

            const { gained: compGain, newOwnedSet: compOwned2 } =
                CaptureSimulator.simulate(cells, definitions, compOwned, humanOwned, compColor);

            const frontierColors = new Set<string>();
            for (const cell of compOwned2) 
            {
                for (const offset of definitions.Offsets) 
                {
                    const ny = cell.m_PosY + offset.DY;
                    const nx = cell.m_PosX + offset.DX;
                    if (ny < 0 || ny >= definitions.DimensionY || nx < 0 || nx >= definitions.DimensionX) 
                    {
                        continue;
                    }
                    const neighbor = cells[ny]?.[nx];
                    if (neighbor && !neighbor.m_Occupied && !compOwned2.has(neighbor) && !humanOwned.has(neighbor)) 
                    {
                        frontierColors.add(neighbor.m_Color);
                    }
                }
            }

            let bestHumanGain = 0;
            for (const humanColor of allColors) 
            {
                if (humanColor === compColor || humanColor === humanCurrentColor) 
                {
                    continue;
                }

                const { gained: humanGain } =
                    CaptureSimulator.simulate(cells, definitions, humanOwned, compOwned2, humanColor);
                if (humanGain > bestHumanGain) 
                {
                    bestHumanGain = humanGain;
                }
            }

            const score =
                compGain
                - bestHumanGain * DENY_WEIGHT
                + frontierColors.size * DIVERSITY_WEIGHT;

            if (score > bestScore) 
            {
                bestScore = score;
                bestColor = compColor;
            }
        }

        return bestColor;
    }
}
