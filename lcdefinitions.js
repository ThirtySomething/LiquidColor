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
};