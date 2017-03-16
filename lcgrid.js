"use strict";

function LCGrid() {
    // ------------------------------------------------------------
    this.m_Cells = [];
    // ------------------------------------------------------------
    this.GridInit = function (Definitions, CanvasElement) {
        this.m_Cells = [];

        for (var LoopY = 0; LoopY < Definitions.DimensionY; LoopY++) {
            this.m_Cells[LoopY] = [];
            for (var LoopX = 0; LoopX < Definitions.DimensionX; LoopX++) {
                var PosX = LoopX * Definitions.CellSize;
                var PosY = LoopY * Definitions.CellSize;
                var CurrentCell = new LCCell(LoopX, LoopY);
                CurrentCell.m_Color = CurrentCell.CellColorRandomGet(Definitions.Colors);
                CurrentCell.Draw(Definitions, CanvasElement);
                this.m_Cells[LoopY].push(CurrentCell);
            }
        }
    };
    // ------------------------------------------------------------
    this.GridReset = function () {
        this.m_Cells.forEach(function (CurrentRow) {
            CurrentRow.forEach(function (CurrentCell) {
                CurrentCell.m_DoRedraw = true;
            });
        });
    }

};