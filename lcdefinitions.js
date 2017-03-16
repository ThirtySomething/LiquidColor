"use strict";

function LCDefinitions(DimX, DimY, CellSize) {
    // ------------------------------------------------------------
    this.DimensionX = parseInt(DimX);
    this.DimensionY = parseInt(DimY);
    this.CellSize = parseInt(CellSize);
    this.Winner = parseInt(((parseInt(DimX) * parseInt(DimY)) / 2) + 1);
    // ------------------------------------------------------------
    this.ReInit = function (DimX, DimY, CellSize) {
        this.DimensionX = parseInt(DimX);
        this.DimensionY = parseInt(DimY);
        this.CellSize = parseInt(CellSize);
        this.Winner = parseInt(((parseInt(DimX) * parseInt(DimY)) / 2) + 1);
    };
    // ------------------------------------------------------------
    this.Colors = [
        "blue",
        "cyan",
        "green",
        "red",
        "yellow"
    ];
    // ------------------------------------------------------------
    this.Offsets = [{
        DX: 0,
        DY: 1
    }, {
        DX: 1,
        DY: 0
    }, {
        DX: 0,
        DY: -1
    }, {
        DX: -1,
        DY: 0
    }];
}