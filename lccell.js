function LCCell(PosX, PosY) {
    "use strict";
    // ------------------------------------------------------------
    this.m_PosX = parseInt(PosX);
    this.m_PosY = parseInt(PosY);
    this.m_Color = "white";
    this.m_Owner = "";
    this.m_Occupied = false;
    this.m_DoRedraw = true;
    // ------------------------------------------------------------
    this.Draw = function(Definitions, CanvasElement) {
        if (true === this.m_DoRedraw) {
            var Cell_PosX = Definitions.CellSize * this.m_PosX;
            var Cell_PosY = Definitions.CellSize * this.m_PosY;

            CanvasElement.beginPath();
            CanvasElement.rect(
                Cell_PosX,
                Cell_PosY,
                Definitions.CellSize,
                Definitions.CellSize
            );
            CanvasElement.fillStyle = this.m_Color;
            CanvasElement.fill();
            // CanvasElement.lineWidth = 1;
            // CanvasElement.strokeStyle = "black";
            CanvasElement.stroke();
            this.m_DoRedraw = false;
        }
    };
    // ------------------------------------------------------------
    this.OwnerSet = function(NewOwner) {
        this.m_Owner = NewOwner;
        this.m_Occupied = true;
    };
    // ------------------------------------------------------------
    this.NeighboursGet = function(Cells, Definitions) {
        var Neighbours = [];
        var CurrentCell = this;

        Definitions.Offsets.forEach(function(CurrentOffset) {
            var Cell_PosY = CurrentCell.m_PosY + CurrentOffset.DY;

            if (0 > Cell_PosY || Definitions.DimensionY <= Cell_PosY) {
                return true;
            }

            var Cell_PosX = CurrentCell.m_PosX + CurrentOffset.DX;
            if (0 > Cell_PosX || Definitions.DimensionX <= Cell_PosX) {
                return true;
            }

            var CurrentNeighbour = Cells[Cell_PosY][Cell_PosX];

            if (false === CurrentNeighbour.m_DoRedraw) {
                return true;
            }

            if (
                (false === CurrentNeighbour.m_Occupied &&
                    CurrentCell.m_Color === CurrentNeighbour.m_Color) ||
                (CurrentCell.m_Owner === CurrentNeighbour.m_Owner &&
                    CurrentCell.m_Color !== CurrentNeighbour.m_Color)
            ) {
                Neighbours.push(CurrentNeighbour);
            }
        });

        return Neighbours;
    };
    // ------------------------------------------------------------
    this.CellColorRandomGet = function(Colors) {
        var ColorIndex = Math.floor(Math.random() * Colors.length);
        return Colors[ColorIndex];
    };
    // ------------------------------------------------------------
    this.IsBorderCell = function(Cells, Definitions) {
        var IsBorder = false;
        var CurrentCell = this;

        Definitions.Offsets.forEach(function(CurrentOffset) {
            var Cell_PosY = CurrentCell.m_PosY + CurrentOffset.DY;

            if (0 > Cell_PosY || Definitions.DimensionY <= Cell_PosY) {
                return;
            }

            var Cell_PosX = CurrentCell.m_PosX + CurrentOffset.DX;
            if (0 > Cell_PosX || Definitions.DimensionX <= Cell_PosX) {
                return;
            }

            var CurrentNeighbour = Cells[Cell_PosY][Cell_PosX];
            if (false === CurrentNeighbour.m_Occupied) {
                IsBorder = true;
                return;
            }
        });

        return IsBorder;
    };
}