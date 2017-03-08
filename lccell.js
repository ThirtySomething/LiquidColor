"use strict";

function LCCell(PosX, PosY) {
    // ------------------------------------------------------------
    // Cell data
    this.Config = {};
    this.Config.PosX = parseInt(PosX);
    this.Config.PosY = parseInt(PosY);
    this.Config.CellSize = 0;
    this.Config.Color = "white";
    this.Config.Owner = "";
    this.Config.Occupied = false;
    // ------------------------------------------------------------
    this.EnumState = {
        UNDEFINED: -1,
        FREE_COLOR_DIFFERENT: 0,
        FREE_COLOR_EQUAL: 1,
        OCCUPIED_OWNER_DIFFERENT: 2,
        OCCUPIED_OWNER_EQUAL: 3
    };
    // ------------------------------------------------------------
    this.Draw = function (BoardData) {
        if ((BoardData.hasOwnProperty("DimensionX")) &&
            (BoardData.hasOwnProperty("DimensionY")) &&
            (BoardData.hasOwnProperty("CellSize")) &&
            (BoardData.hasOwnProperty("CanvasElement"))) {

            var PosX = BoardData.CellSize * this.Config.PosX;
            var PosY = BoardData.CellSize * this.Config.PosY;

            BoardData.CanvasElement.beginPath();
            BoardData.CanvasElement.rect(PosX, PosY, BoardData.CellSize, BoardData.CellSize);
            BoardData.CanvasElement.fillStyle = this.Config.Color;
            BoardData.CanvasElement.fill();
            BoardData.CanvasElement.lineWidth = 1;
            BoardData.CanvasElement.strokeStyle = "black";
            BoardData.CanvasElement.stroke();
        } else {
            console.log("No board config data object passed!");
        }
    };
    // ------------------------------------------------------------
    this.ColorSet = function (NewColor) {
        this.Config.Color = NewColor;
    };
    // ------------------------------------------------------------
    this.ColorGet = function () {
        return this.Config.Color;
    };
    // ------------------------------------------------------------
    this.OwnerSet = function (NewOwner) {
        this.Config.Owner = NewOwner;
        this.Config.Occupied = true;
    };
    // ------------------------------------------------------------
    this.OwnerGet = function () {
        return this.Config.Owner;
    };
    // ------------------------------------------------------------
    this.IsOccupied = function () {
        return this.Config.Occupied;
    };
    // ------------------------------------------------------------
    this.StateGet = function (CellCompare) {
        var State = this.EnumState.UNDEFINED;

        if ((false === this.Config.Occupied) &&
            (CellCompare.Config.Color !== this.Config.Color)) {
            State = this.EnumState.FREE_COLOR_DIFFERENT;
        } else if ((false === this.Config.Occupied) &&
            (CellCompare.Config.Color === this.Config.Color)) {
            State = this.EnumState.FREE_COLOR_EQUAL;
        } else if ((true === this.Config.Occupied) &&
            (CellCompare.Config.Owner !== this.Config.Owner)) {
            State = this.EnumState.OCCUPIED_OWNER_DIFFERENT;
        } else if ((true === this.Config.Occupied) &&
            (CellCompare.Config.Owner === this.Config.Owner)) {
            State = this.EnumState.OCCUPIED_OWNER_EQUAL;
        }

        return State;
    };
}