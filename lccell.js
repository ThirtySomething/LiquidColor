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
        var PosX = BoardData.m_CellSize * this.m_PosX;
        var PosY = BoardData.m_CellSize * this.m_PosY;

        BoardData.m_CanvasElement.beginPath();
        BoardData.m_CanvasElement.rect(PosX, PosY, BoardData.m_CellSize, BoardData.m_CellSize);
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
    this.StateGet = function (CellCompare, Definitions) {
        var State = Definitions.EnumState.UNDEFINED;

        if ((false === this.m_Occupied) &&
            (CellCompare.m_Color !== this.m_Color)) {
            State = Definitions.EnumState.FREE_COLOR_DIFFERENT;
        } else if ((false === this.m_Occupied) &&
            (CellCompare.m_Color === this.m_Color)) {
            State = Definitions.EnumState.FREE_COLOR_EQUAL;
        } else if ((true === this.m_Occupied) &&
            (CellCompare.m_Owner !== this.m_Owner)) {
            State = Definitions.EnumState.OCCUPIED_OWNER_DIFFERENT;
        } else if ((true === this.m_Occupied) &&
            (CellCompare.m_Owner === this.m_Owner)) {
            State = Definitions.EnumState.OCCUPIED_OWNER_EQUAL;
        }

        return State;
    };
}