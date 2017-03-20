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
    };
    // ------------------------------------------------------------
    this.GetPlayerCells = function (Player) {
        var PlayerCells = [];

        this.m_Cells.forEach(function (CurrentRow) {
            CurrentRow.forEach(function (CurrentCell) {
                if (CurrentCell.m_Owner === Player.m_PlayerName) {
                    PlayerCells.push(CurrentCell);
                }
            });
        });

        return PlayerCells;
    };
    // ------------------------------------------------------------
    this.IdentifyBorderCells = function (Cells, Definitions) {
        var BorderCells = [];
        var Grid = this;

        Cells.forEach(function (CurrentCell) {
            if (true == CurrentCell.IsBorderCell(Grid.m_Cells, Definitions)) {
                BorderCells.push(CurrentCell);
            };
        });

        return BorderCells;
    };
    // ------------------------------------------------------------
    this.PlayerColorsGet = function (Cells, Definitions) {
        var PlayerColors = [];
        var Grid = this;

        Cells.forEach(function (CurrentCell) {
            Definitions.Offsets.some(function (CurrentOffset) {
                var Cell_PosY = CurrentCell.m_PosY + CurrentOffset.DY;

                if ((0 > Cell_PosY) || (Definitions.DimensionY <= Cell_PosY)) {
                    return true;
                }

                var Cell_PosX = CurrentCell.m_PosX + CurrentOffset.DX;
                if ((0 > Cell_PosX) || (Definitions.DimensionX <= Cell_PosX)) {
                    return true;
                }

                // Todo: Extend condition here!
                var CurrentNeighbour = this.m_Cells[Cell_PosY][Cell_PosX];
                var ValueOld = 0;
                if (true === PlayerColors.hasOwnProperty(CurrentNeighbour.m_Color)) {
                    ValueOld = PlayerColors[CurrentCell.m_Color];
                }
                PlayerColors[CurrentNeighbour.m_Color] = ValueOld + 1;
            });
        });

        console.log(JSON.stringify(PlayerColors));

        return PlayerColors;
    };
};