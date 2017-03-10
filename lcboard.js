"use strict";

function LCBoard(Definitions, PlayerHuman, PlayerComputer) {
    // ------------------------------------------------------------
    // Board config
    this.m_Cells = [];
    this.m_CanvasElement = null;
    this.m_Definitions = Definitions;
    this.m_PlayerHuman = PlayerHuman;
    this.m_PlayerComputer = PlayerComputer;
    // ------------------------------------------------------------
    this.Init = function (GameField, ButtonField) {
        var BoardWidth = this.m_Definitions.DimensionX * this.m_Definitions.CellSize;
        var BoardHeight = this.m_Definitions.DimensionY * this.m_Definitions.CellSize;
        $("#" + GameField).css("width", BoardWidth);
        $("#" + GameField).css("height", BoardHeight);
        $("#" + GameField).css("border", "1px solid black");
        $("#" + GameField).attr("width", BoardWidth);
        $("#" + GameField).attr("height", BoardHeight);

        var Graphics = document.getElementById(GameField);
        if (Graphics.getContext) {
            this.m_CanvasElement = Graphics.getContext("2d");
            this.BoardInit();
            this.BoardButtonsInit(ButtonField);
            this.PlayerInit();
        }
    };
    // ------------------------------------------------------------
    this.PlayerInit = function () {
        this.m_PlayerComputer.m_BaseCell = this.m_Cells[0][this.m_Definitions.DimensionX - 1];
        this.m_PlayerComputer.m_BaseCell.OwnerSet(this.m_PlayerComputer.m_PlayerName);

        this.m_PlayerHuman.m_BaseCell = this.m_Cells[this.m_Definitions.DimensionY - 1][0];
        this.m_PlayerHuman.m_BaseCell.OwnerSet(this.m_PlayerHuman.m_PlayerName);

        while (this.m_PlayerHuman.m_BaseCell.m_Color === this.m_PlayerComputer.m_BaseCell.m_Color) {
            this.m_PlayerComputer.m_BaseCell.CellColorRandomSet(this.m_Definitions.Colors);
        }
        this.m_PlayerComputer.m_BaseCell.Draw(this);

        this.CellMarkOwner(this.m_PlayerComputer);
        this.CellMarkOwner(this.m_PlayerHuman);
    };
    // ------------------------------------------------------------
    this.BoardInit = function () {
        this.m_Cells = [];

        for (var LoopY = 0; LoopY < this.m_Definitions.DimensionY; LoopY++) {
            this.m_Cells[LoopY] = [];
            for (var LoopX = 0; LoopX < this.m_Definitions.DimensionX; LoopX++) {
                var PosX = LoopX * this.m_Definitions.CellSize;
                var PosY = LoopY * this.m_Definitions.CellSize;
                var CurrentCell = new LCCell(LoopX, LoopY, this.m_Definitions.Colors);
                CurrentCell.CellColorRandomSet(this.m_Definitions.Colors);
                CurrentCell.Draw(this);
                this.m_Cells[LoopY].push(CurrentCell);
            }
        }
    };
    // ------------------------------------------------------------
    this.SetDebugData = function () {
        for (var Loop = 0; Loop < this.m_Definitions.DebugData.length; Loop += 1) {
            var RawData = this.m_Definitions.DebugData[Loop];
            this.m_Cells[RawData.PY][RawData.PX].m_Color = RawData.COL;
            this.m_Cells[RawData.PY][RawData.PX].Draw(this);
        }
    };
    // ------------------------------------------------------------
    this.BoardButtonsInit = function (ButtonField) {
        // Retrive margin size from CSS classn
        var BtnMargin = parseInt($(".gamebtn").css("margin"));
        var NumberOfButtons = this.m_Definitions.Colors.length;
        var BtnWidth = Math.floor((this.m_Definitions.DimensionX * this.m_Definitions.CellSize) / 5);
        var BtnHeight = Math.floor(((this.m_Definitions.DimensionY * this.m_Definitions.CellSize) - ((NumberOfButtons + 1) * BtnMargin)) / NumberOfButtons);

        for (var Loop = 0; Loop < NumberOfButtons; Loop++) {
            var CurCol = this.m_Definitions.Colors[Loop];
            var Button = $("#" + ButtonField).append("<div id=\"" + CurCol + "\"></div>");

            $("#" + CurCol).css("width", BtnWidth);
            $("#" + CurCol).css("height", BtnHeight);
            $("#" + CurCol).css("background-color", CurCol);
            $("#" + CurCol).addClass("gamebtn");
            $("#" + CurCol).unbind("click").bind("click", {
                Board: this,
                Color: CurCol
            }, function (event) {
                event.data.Board.PerformMove(event.data.Color);
            });
        }
    };
    // ------------------------------------------------------------
    this.CellMarkOwner = function (Player) {
        var CellsCollect = [];
        var CellsWork = Player.m_BaseCell.NeighboursGet(this.m_Cells, this.m_Definitions.Offsets);

        do {
            for (var Loop = 0; Loop < CellsWork.length; Loop += 1) {
                var CurrentCell = CellsWork[Loop];
                CurrentCell.m_Color = Player.m_BaseCell.m_Color;
                CurrentCell.OwnerSet(Player.m_PlayerName);
                CurrentCell.Draw(this);
                var NewNeighbours = CurrentCell.NeighboursGet(this.m_Cells, this.m_Definitions.Offsets);
                NewNeighbours.forEach(function (NewCell) {
                    CellsCollect.push(NewCell)
                });
            }
            CellsWork = CellsCollect;
            CellsCollect = [];
        } while (0 < CellsWork.length);

        Player.CounterUpdate(this);
    };
    // ------------------------------------------------------------
    this.PerformMove = function (NewColor) {
        if (NewColor === this.m_PlayerHuman.m_BaseCell.m_Color) {
            alert("You cannot select the color of yourself.");
            return;
        }
        if (NewColor === this.m_PlayerComputer.m_BaseCell.m_Color) {
            alert("You cannot select the color of your opponent.");
            return;
        }
        this.m_PlayerHuman.m_BaseCell.m_Color = NewColor;
        this.m_PlayerHuman.m_BaseCell.Draw(this);
        this.CellMarkOwner(this.m_PlayerHuman);

        this.m_PlayerComputer.m_BaseCell.CellColorRandomSet(this.m_Definitions.Colors);
        while (this.m_PlayerHuman.m_BaseCell.m_Color === this.m_PlayerComputer.m_BaseCell.m_Color) {
            this.m_PlayerComputer.m_BaseCell.CellColorRandomSet(this.m_Definitions.Colors);
        }
        this.m_PlayerComputer.m_BaseCell.Draw(this);
        this.CellMarkOwner(this.m_PlayerComputer);
    };
}