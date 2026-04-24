class LCCell {
    constructor(posX, posY) {
        this.m_PosX = Number.parseInt(posX, 10);
        this.m_PosY = Number.parseInt(posY, 10);
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
            canvasElement.rect(
                cellPosX,
                cellPosY,
                definitions.CellSize,
                definitions.CellSize
            );
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

        definitions.Offsets.forEach((currentOffset) => {
            const cellPosY = this.m_PosY + currentOffset.DY;
            if (cellPosY < 0 || definitions.DimensionY <= cellPosY) {
                return;
            }

            const cellPosX = this.m_PosX + currentOffset.DX;
            if (cellPosX < 0 || definitions.DimensionX <= cellPosX) {
                return;
            }

            const currentNeighbour = cells[cellPosY][cellPosX];
            if (!currentNeighbour.m_DoRedraw) {
                return;
            }

            if (
                (!currentNeighbour.m_Occupied && this.m_Color === currentNeighbour.m_Color) ||
                (this.m_Owner === currentNeighbour.m_Owner && this.m_Color !== currentNeighbour.m_Color)
            ) {
                neighbours.push(currentNeighbour);
            }
        });

        return neighbours;
    }

    cellColorRandomGet(colors) {
        const colorIndex = Math.floor(Math.random() * colors.length);
        return colors[colorIndex];
    }

    isBorderCell(cells, definitions) {
        let isBorder = false;

        definitions.Offsets.forEach((currentOffset) => {
            const cellPosY = this.m_PosY + currentOffset.DY;
            if (cellPosY < 0 || definitions.DimensionY <= cellPosY) {
                return;
            }

            const cellPosX = this.m_PosX + currentOffset.DX;
            if (cellPosX < 0 || definitions.DimensionX <= cellPosX) {
                return;
            }

            const currentNeighbour = cells[cellPosY][cellPosX];
            if (!currentNeighbour.m_Occupied) {
                isBorder = true;
            }
        });

        return isBorder;
    }
}