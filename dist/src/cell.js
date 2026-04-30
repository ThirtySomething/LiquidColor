import { Definitions } from "./definitions.js";
import { MathRandomSource } from "./randomsource.js";
export class Cell {
    m_PosX;
    m_PosY;
    m_Color;
    m_Owner;
    m_Occupied;
    m_DoRedraw;
    constructor(posX, posY) {
        this.m_PosX = Number.parseInt(String(posX), 10);
        this.m_PosY = Number.parseInt(String(posY), 10);
        this.m_Color = "white";
        this.m_Owner = "";
        this.m_Occupied = false;
        this.m_DoRedraw = true;
    }
    draw(definitions, canvasElement) {
        if (this.m_DoRedraw) {
            const cellPosX = definitions.CellSize * this.m_PosX;
            const cellPosY = definitions.CellSize * this.m_PosY;
            canvasElement.beginPath();
            canvasElement.rect(cellPosX, cellPosY, definitions.CellSize, definitions.CellSize);
            canvasElement.fillStyle = this.m_Color;
            canvasElement.fill();
            canvasElement.stroke();
            this.m_DoRedraw = false;
        }
    }
    ownerSet(newOwner) {
        this.m_Owner = newOwner;
        this.m_Occupied = true;
    }
    neighboursGet(cells, definitions) {
        const neighbours = [];
        for (const currentOffset of definitions.Offsets) {
            const cellPosY = this.m_PosY + currentOffset.DY;
            if (cellPosY < 0 || definitions.DimensionY <= cellPosY) {
                continue;
            }
            const cellPosX = this.m_PosX + currentOffset.DX;
            if (cellPosX < 0 || definitions.DimensionX <= cellPosX) {
                continue;
            }
            const row = cells[cellPosY];
            if (!row) {
                continue;
            }
            const currentNeighbour = row[cellPosX];
            if (!currentNeighbour) {
                continue;
            }
            if (!currentNeighbour.m_DoRedraw) {
                continue;
            }
            if ((!currentNeighbour.m_Occupied && this.m_Color === currentNeighbour.m_Color) ||
                (this.m_Owner === currentNeighbour.m_Owner && this.m_Color !== currentNeighbour.m_Color)) {
                neighbours.push(currentNeighbour);
            }
        }
        return neighbours;
    }
    cellColorRandomGet(colors, randomSource = MathRandomSource) {
        const colorIndex = Math.floor(randomSource.next() * colors.length);
        return colors[colorIndex] ?? this.m_Color;
    }
    isBorderCell(cells, definitions) {
        for (const currentOffset of definitions.Offsets) {
            const cellPosY = this.m_PosY + currentOffset.DY;
            if (cellPosY < 0 || definitions.DimensionY <= cellPosY) {
                continue;
            }
            const cellPosX = this.m_PosX + currentOffset.DX;
            if (cellPosX < 0 || definitions.DimensionX <= cellPosX) {
                continue;
            }
            const row = cells[cellPosY];
            if (!row) {
                continue;
            }
            const currentNeighbour = row[cellPosX];
            if (!currentNeighbour) {
                continue;
            }
            if (!currentNeighbour.m_Occupied) {
                return true;
            }
        }
        return false;
    }
}
