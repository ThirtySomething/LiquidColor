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
        this.m_PlayerComputer.m_OffsetX = -1;
        this.m_PlayerComputer.m_OffsetY = 1;

        this.m_PlayerHuman.m_BaseCell = this.m_Cells[this.m_Definitions.DimensionY - 1][0];
        this.m_PlayerHuman.m_BaseCell.OwnerSet(this.m_PlayerHuman.m_PlayerName);
        this.m_PlayerHuman.m_OffsetX = 1;
        this.m_PlayerHuman.m_OffsetY = -1;

        while (this.m_PlayerComputer.m_BaseCell.m_Color === this.m_PlayerHuman.m_BaseCell.m_Color) {
            this.m_PlayerHuman.m_BaseCell.m_Color = this.CellColorRandomGet();
            this.m_PlayerHuman.m_BaseCell.Draw(this);
        }

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
                var CurrentCell = new LCCell(LoopX, LoopY);
                CurrentCell.m_Color = this.CellColorRandomGet();
                CurrentCell.Draw(this);
                this.m_Cells[LoopY].push(CurrentCell);
            }
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
                Owner: this.m_PlayerHuman,
                Board: this,
                Color: CurCol
            }, function (event) {
                event.data.Owner.m_BaseCell.m_Color = event.data.Color;
                event.data.Owner.m_BaseCell.Draw(event.data.Board);
                event.data.Board.CellMarkOwner(event.data.Owner);
            });
        }
    };
    // ------------------------------------------------------------
    this.CellColorRandomGet = function () {
        var ColorIndex = Math.floor((Math.random() * this.m_Definitions.Colors.length));
        var ColorName = this.m_Definitions.Colors[ColorIndex];

        return ColorName;
    };
    // ------------------------------------------------------------
    this.CellsFind = function (BaseCell, OffsetX, OffsetY) {
        var Cells = [];

        if (("undefined" !== typeof this.m_Cells[BaseCell.m_PosY + OffsetY]) &&
            ("undefined" !== typeof this.m_Cells[BaseCell.m_PosY + OffsetY][BaseCell.m_PosX]) &&
            (BaseCell.m_Color === this.m_Cells[BaseCell.m_PosY + OffsetY][BaseCell.m_PosX].m_Color)) {
            Cells.push(this.m_Cells[BaseCell.m_PosY + OffsetY][BaseCell.m_PosX]);
        }

        if (("undefined" !== typeof this.m_Cells[BaseCell.m_PosY]) &&
            ("undefined" !== typeof this.m_Cells[BaseCell.m_PosY][BaseCell.m_PosX + OffsetX]) &&
            (BaseCell.m_Color === this.m_Cells[BaseCell.m_PosY][BaseCell.m_PosX + OffsetX].m_Color)) {
            Cells.push(this.m_Cells[BaseCell.m_PosY][BaseCell.m_PosX + OffsetX]);
        }

        return Cells;
    };
    // ------------------------------------------------------------
    this.CellMarkOwner = function (Player) {
        var CellsWork = this.CellsFind(Player.m_BaseCell, Player.m_OffsetX, Player.m_OffsetY);
        var CellsCollect = [];

        do {
            for (var Loop = 0; Loop < CellsWork.length; Loop += 1) {
                var CurrentCell = CellsWork[Loop];
                if ((false == CurrentCell.m_Occupied) ||
                    (Player.m_PlayerName === CurrentCell.m_Owner)) {
                    CurrentCell.OwnerSet(Player.m_BaseCell.m_PlayerName);
                    CurrentCell.Draw(this);
                    CellsCollect.concat(this.CellsFind(CurrentCell, Player.m_OffsetX, Player.m_OffsetY));
                }
            }
            CellsWork = CellsCollect;
            CellsCollect = [];

        } while (0 < CellsWork.length);

        Player.CounterUpdate(this);
    };
}