"use strict";

function LCCell(PosX, PosY) {
    // ------------------------------------------------------------
    // Cell data
    this.m_PosX = parseInt(PosX);
    this.m_PosY = parseInt(PosY);
    this.m_Color = "white";
    this.m_Owner = "";
    this.m_Occupied = false;
    // ------------------------------------------------------------
    this.Draw = function (BoardData) {
        var PosX = BoardData.m_Definitions.CellSize * this.m_PosX;
        var PosY = BoardData.m_Definitions.CellSize * this.m_PosY;

        BoardData.m_CanvasElement.beginPath();
        BoardData.m_CanvasElement.rect(PosX, PosY, BoardData.m_Definitions.CellSize, BoardData.m_Definitions.CellSize);
        BoardData.m_CanvasElement.fillStyle = this.m_Color;
        BoardData.m_CanvasElement.fill();
        BoardData.m_CanvasElement.lineWidth = 1;
        BoardData.m_CanvasElement.strokeStyle = "black";
        BoardData.m_CanvasElement.stroke();
    };
    // ------------------------------------------------------------
    this.OwnerSet = function (NewOwner) {
        this.m_Owner = NewOwner;
        this.m_Occupied = true;
    };
    // ------------------------------------------------------------
    this.NeighboursGet = function (CellsComplete, Offsets) {
        var Neighbours = [];

        for (var Loop = 0; Loop < Offsets.length; Loop += 1) {
            var CurrentOffsets = Offsets[Loop];
            if (("undefined" !== typeof CellsComplete[this.m_PosY + CurrentOffsets.DY]) &&
                ("undefined" !== typeof CellsComplete[this.m_PosY + CurrentOffsets.DY][this.m_PosX + CurrentOffsets.DX])) {
                var DoPush = false;
                if ((false === CellsComplete[this.m_PosY + CurrentOffsets.DY][this.m_PosX + CurrentOffsets.DX].m_Occupied) &&
                    (this.m_Color === CellsComplete[this.m_PosY + CurrentOffsets.DY][this.m_PosX + CurrentOffsets.DX].m_Color)) {
                    DoPush = true;
                } else if (this.m_Owner === CellsComplete[this.m_PosY + CurrentOffsets.DY][this.m_PosX + CurrentOffsets.DX].m_Owner) {
                    DoPush = true;
                }
                if (true === DoPush) {
                    Neighbours.push(CellsComplete[this.m_PosY + CurrentOffsets.DY][this.m_PosX + CurrentOffsets.DX]);
                }
            }
        }

        return Neighbours;
    };
}