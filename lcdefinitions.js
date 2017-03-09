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
    // ------------------------------------------------------------
    this.DebugData = [{
            PX: 0,
            PY: 39,
            COL: "cyan"
        },
        {
            PX: 1,
            PY: 39,
            COL: "cyan"
        },
        {
            PX: 2,
            PY: 39,
            COL: "green"
        },
        {
            PX: 3,
            PY: 39,
            COL: "yellow"
        },
        {
            PX: 4,
            PY: 39,
            COL: "yellow"
        },
        {
            PX: 5,
            PY: 39,
            COL: "red"
        },
        {
            PX: 6,
            PY: 39,
            COL: "blue"
        },
        {
            PX: 7,
            PY: 39,
            COL: "cyan"
        },
        {
            PX: 8,
            PY: 39,
            COL: "gray"
        },
        {
            PX: 9,
            PY: 39,
            COL: "green"
        },
        {
            PX: 0,
            PY: 38,
            COL: "blue"
        },
        {
            PX: 1,
            PY: 38,
            COL: "cyan"
        },
        {
            PX: 2,
            PY: 38,
            COL: "yellow"
        },
        {
            PX: 3,
            PY: 38,
            COL: "blue"
        },
        {
            PX: 4,
            PY: 38,
            COL: "cyan"
        },
        {
            PX: 5,
            PY: 38,
            COL: "blue"
        },
        {
            PX: 6,
            PY: 38,
            COL: "blue"
        },
        {
            PX: 7,
            PY: 38,
            COL: "yellow"
        },
        {
            PX: 8,
            PY: 38,
            COL: "cyan"
        },
        {
            PX: 9,
            PY: 38,
            COL: "red"
        },
        {
            PX: 0,
            PY: 37,
            COL: "red"
        },
        {
            PX: 1,
            PY: 37,
            COL: "green"
        },
        {
            PX: 2,
            PY: 37,
            COL: "cyan"
        },
        {
            PX: 3,
            PY: 37,
            COL: "blue"
        },
        {
            PX: 4,
            PY: 37,
            COL: "green"
        },
        {
            PX: 5,
            PY: 37,
            COL: "green"
        },
        {
            PX: 6,
            PY: 37,
            COL: "green"
        },
        {
            PX: 7,
            PY: 37,
            COL: "green"
        },
        {
            PX: 8,
            PY: 37,
            COL: "red"
        },
        {
            PX: 9,
            PY: 37,
            COL: "gray"
        },
        {
            PX: 0,
            PY: 36,
            COL: "green"
        },
        {
            PX: 1,
            PY: 36,
            COL: "red"
        },
        {
            PX: 2,
            PY: 36,
            COL: "blue"
        },
        {
            PX: 3,
            PY: 36,
            COL: "green"
        },
        {
            PX: 4,
            PY: 36,
            COL: "cyan"
        },
        {
            PX: 5,
            PY: 36,
            COL: "blue"
        },
        {
            PX: 6,
            PY: 36,
            COL: "gray"
        },
        {
            PX: 7,
            PY: 36,
            COL: "gray"
        },
        {
            PX: 8,
            PY: 36,
            COL: "blue"
        },
        {
            PX: 9,
            PY: 36,
            COL: "yellow"
        }, {
            PX: 0,
            PY: 35,
            COL: "green"
        },
        {
            PX: 1,
            PY: 35,
            COL: "gray"
        },
        {
            PX: 2,
            PY: 35,
            COL: "red"
        },
        {
            PX: 3,
            PY: 35,
            COL: "blue"
        },
        {
            PX: 4,
            PY: 35,
            COL: "cyan"
        },
        {
            PX: 5,
            PY: 35,
            COL: "red"
        },
        {
            PX: 6,
            PY: 35,
            COL: "blue"
        },
        {
            PX: 7,
            PY: 35,
            COL: "cyan"
        },
        {
            PX: 8,
            PY: 35,
            COL: "gray"
        },
        {
            PX: 9,
            PY: 35,
            COL: "gray"
        }, {
            PX: 0,
            PY: 34,
            COL: "cyan"
        },
        {
            PX: 1,
            PY: 34,
            COL: "cyan"
        },
        {
            PX: 2,
            PY: 34,
            COL: "gray"
        },
        {
            PX: 3,
            PY: 34,
            COL: "cyan"
        },
        {
            PX: 4,
            PY: 34,
            COL: "red"
        },
        {
            PX: 5,
            PY: 34,
            COL: "cyan"
        },
        {
            PX: 6,
            PY: 34,
            COL: "gray"
        },
        {
            PX: 7,
            PY: 34,
            COL: "green"
        },
        {
            PX: 8,
            PY: 34,
            COL: "blue"
        },
        {
            PX: 9,
            PY: 34,
            COL: "cyan"
        },
        {
            PX: 0,
            PY: 33,
            COL: "green"
        },
        {
            PX: 1,
            PY: 33,
            COL: "cyan"
        },
        {
            PX: 2,
            PY: 33,
            COL: "red"
        },
        {
            PX: 3,
            PY: 33,
            COL: "green"
        },
        {
            PX: 4,
            PY: 33,
            COL: "blue"
        },
        {
            PX: 5,
            PY: 33,
            COL: "cyan"
        },
        {
            PX: 6,
            PY: 33,
            COL: "blue"
        },
        {
            PX: 7,
            PY: 33,
            COL: "gray"
        },
        {
            PX: 8,
            PY: 33,
            COL: "green"
        },
        {
            PX: 9,
            PY: 33,
            COL: "gray"
        }, {
            PX: 0,
            PY: 32,
            COL: "green"
        },
        {
            PX: 1,
            PY: 32,
            COL: "yellow"
        },
        {
            PX: 2,
            PY: 32,
            COL: "red"
        },
        {
            PX: 3,
            PY: 32,
            COL: "cyan"
        },
        {
            PX: 4,
            PY: 32,
            COL: "yellow"
        },
        {
            PX: 5,
            PY: 32,
            COL: "cyan"
        },
        {
            PX: 6,
            PY: 32,
            COL: "blue"
        },
        {
            PX: 7,
            PY: 32,
            COL: "green"
        },
        {
            PX: 8,
            PY: 32,
            COL: "gray"
        },
        {
            PX: 9,
            PY: 32,
            COL: "red"
        },
        {
            PX: 0,
            PY: 31,
            COL: "cyan"
        },
        {
            PX: 1,
            PY: 31,
            COL: "red"
        },
        {
            PX: 2,
            PY: 31,
            COL: "green"
        },
        {
            PX: 3,
            PY: 31,
            COL: "yellow"
        },
        {
            PX: 4,
            PY: 31,
            COL: "cyan"
        },
        {
            PX: 5,
            PY: 31,
            COL: "green"
        },
        {
            PX: 6,
            PY: 31,
            COL: "red"
        },
        {
            PX: 7,
            PY: 31,
            COL: "yellow"
        },
        {
            PX: 8,
            PY: 31,
            COL: "green"
        },
        {
            PX: 9,
            PY: 31,
            COL: "cyan"
        }, {
            PX: 0,
            PY: 30,
            COL: "cyan"
        },
        {
            PX: 1,
            PY: 30,
            COL: "cyan"
        },
        {
            PX: 2,
            PY: 30,
            COL: "gray"
        },
        {
            PX: 3,
            PY: 30,
            COL: "cyan"
        },
        {
            PX: 4,
            PY: 30,
            COL: "red"
        },
        {
            PX: 5,
            PY: 30,
            COL: "cyan"
        },
        {
            PX: 6,
            PY: 30,
            COL: "yellow"
        },
        {
            PX: 7,
            PY: 30,
            COL: "gray"
        },
        {
            PX: 8,
            PY: 30,
            COL: "cyan"
        },
        {
            PX: 9,
            PY: 30,
            COL: "blue"
        }
    ];
};