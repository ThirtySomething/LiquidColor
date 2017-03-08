"use strict";

function LCCell(PosX, PosY, CellSize) {
    // ------------------------------------------------------------
    // Cell data
    this.Config = {};
    this.Config.PosX = parseInt(PosX);
    this.Config.PosY = parseInt(PosY);
    this.Config.CellSize = parseInt(CellSize);
    this.Config.Color = "white";
    this.Config.Owner = "";
    this.Config.Occupied = false;
    // ------------------------------------------------------------
    this.Draw = function (CanvasElement) {
        CanvasElement.beginPath();
        CanvasElement.rect(this.Config.PosX, this.Config.PosY, this.Config.CellSize, this.Config.CellSize);
        CanvasElement.fillStyle = this.Config.Color;
        CanvasElement.fill();
        CanvasElement.lineWidth = 1;
        CanvasElement.strokeStyle = "black";
        CanvasElement.stroke();
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
}