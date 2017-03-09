"use strict";

function LCDefinitions() {
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
    this.EnumState = {
        UNDEFINED: -1,
        FREE_COLOR_DIFFERENT: 0,
        FREE_COLOR_EQUAL: 1,
        OCCUPIED_OWNER_DIFFERENT: 2,
        OCCUPIED_OWNER_EQUAL: 3
    };
}