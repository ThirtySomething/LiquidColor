"use strict";

function LCCell(PosX, PosY) {
    // ------------------------------------------------------------
    // Cell data
    this.m_PosX = parseInt(PosX);
    this.m_PosY = parseInt(PosY);
    this.m_Color = "white";
    this.m_Owner = "";
    this.m_Occupied = false;
    this.m_Neighbourcheck = false;
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
        var CurrentCell = this;

        Offsets.forEach(function (CurrentOffset) {
            if (("undefined" !== typeof CellsComplete[CurrentCell.m_PosY + CurrentOffset.DY]) &&
                ("undefined" !== typeof CellsComplete[CurrentCell.m_PosY + CurrentOffset.DY][CurrentCell.m_PosX + CurrentOffset.DX])) {
                var CurrentNeighbour = CellsComplete[CurrentCell.m_PosY + CurrentOffset.DY][CurrentCell.m_PosX + CurrentOffset.DX];
                var IsOfInterest = false;
                if ((false === CurrentNeighbour.m_Occupied) &&
                    (CurrentCell.m_Color === CurrentNeighbour.m_Color)) {
                    IsOfInterest = true;
                } else if ((CurrentCell.m_Owner === CurrentNeighbour.m_Owner) &&
                    (CurrentCell.m_Color !== CurrentNeighbour.m_Color)) {
                    IsOfInterest = true;
                }
                if (true === IsOfInterest) {
                    Neighbours.push(CurrentNeighbour);
                }
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