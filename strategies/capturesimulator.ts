import { Cell } from "../cell.js";
import { Definitions } from "../definitions.js";

export class CaptureSimulator 
{
    static simulate(
        cells: Cell[][],
        definitions: Definitions,
        ownedSet: ReadonlySet<Cell>,
        extraBlocked: ReadonlySet<Cell>,
        color: string
    ): { gained: number; newOwnedSet: Set<Cell> } 
    {
        const newOwned = new Set<Cell>(ownedSet);
        let frontier = Array.from(ownedSet);
        let gained = 0;

        while (frontier.length > 0) 
        {
            const next: Cell[] = [];
            for (const cell of frontier) 
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
                    if (!neighbor || newOwned.has(neighbor) || extraBlocked.has(neighbor)) 
                    {
                        continue;
                    }

                    if (!neighbor.m_Occupied && neighbor.m_Color === color) 
                    {
                        newOwned.add(neighbor);
                        next.push(neighbor);
                        gained++;
                    }
                }
            }
            frontier = next;
        }

        return { gained, newOwnedSet: newOwned };
    }
}
