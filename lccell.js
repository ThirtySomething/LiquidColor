"use strict";

function LCCell(PosX, PosY) {
    // ------------------------------------------------------------
    // Cell data
    this.m_PosX = parseInt(PosX);
    this.m_PosY = parseInt(PosY);
    this.m_Color = "white";
    this.m_Owner = "";
    this.m_Occupied = false;
    this.m_DoRedraw = true;
    // ------------------------------------------------------------
    this.Draw = function (Definitions, CanvasElement) {
        if (true === this.m_DoRedraw) {
            var PosX = Definitions.CellSize * this.m_PosX;
            var PosY = Definitions.CellSize * this.m_PosY;

            CanvasElement.beginPath();
            CanvasElement.rect(PosX, PosY, Definitions.CellSize, Definitions.CellSize);
            CanvasElement.fillStyle = this.m_Color;
            CanvasElement.fill();
            CanvasElement.lineWidth = 1;
            CanvasElement.strokeStyle = "black";
            CanvasElement.stroke();
            this.m_DoRedraw = false;
        }
    };
    // ------------------------------------------------------------
    this.OwnerSet = function (NewOwner) {
        this.m_Owner = NewOwner;
        this.m_Occupied = true;
    };
    // ------------------------------------------------------------
    this.NeighboursGet = function (Cells, Definitions) {
        var Neighbours = [];
        var CurrentCell = this;

        Definitions.Offsets.forEach(function (CurrentOffset) {
            var PosY = CurrentCell.m_PosY + CurrentOffset.DY;

            if ((0 > PosY) ||
                (Definitions.DimensionY <= PosY)) {
                return true;
            }

            var PosX = CurrentCell.m_PosX + CurrentOffset.DX;
            if ((0 > PosX) ||
                (Definitions.DimensionX <= PosX)) {
                return true;
            }

            var CurrentNeighbour = Cells[PosY][PosX];


            if (false === CurrentNeighbour.m_DoRedraw) {
                return true;
            }

            var IsOfInterest = false;
            if (((false === CurrentNeighbour.m_Occupied) &&
                    (CurrentCell.m_Color === CurrentNeighbour.m_Color)) ||
                ((CurrentCell.m_Owner === CurrentNeighbour.m_Owner) &&
                    (CurrentCell.m_Color !== CurrentNeighbour.m_Color))) {
                Neighbours.push(CurrentNeighbour);
            }
        });

        return Neighbours;
    };
    // ------------------------------------------------------------
    this.CellColorRandomSet = function (Colors) {
        var ColorIndex = Math.floor((Math.random() * Colors.length));
        this.m_Color = Colors[ColorIndex];
    };
}