"use strict";

function LCDefinitions(DimX, DimY, CellSize) {
    // ------------------------------------------------------------
    this.DimensionX = parseInt(DimX);
    this.DimensionY = parseInt(DimY);
    this.CellSize = parseInt(CellSize);
    // ------------------------------------------------------------
    this.Colors = [
        "blue",
        "cyan",
        "gray",
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
};