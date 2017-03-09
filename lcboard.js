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
        this.m_PlayerHuman.m_BaseCell = this.m_Cells[this.m_Definitions.DimensionY - 1][0];
        this.m_PlayerHuman.m_BaseCell.OwnerSet(this.m_PlayerHuman.m_PlayerName);

        this.m_PlayerComputer.m_BaseCell = this.m_Cells[0][this.m_Definitions.DimensionX - 1];
        this.m_PlayerComputer.m_BaseCell.OwnerSet(this.m_PlayerComputer.m_PlayerName);

        while (this.m_PlayerComputer.m_BaseCell.m_Color === this.m_PlayerHuman.m_BaseCell.m_Color) {
            this.m_PlayerHuman.m_BaseCell.m_Color = this.CellColorRandomGet();
            this.m_PlayerHuman.m_BaseCell.Draw(this);
        }

        this.CellMarkOwner(this.m_PlayerComputer.m_BaseCell);
        this.CellMarkOwner(this.m_PlayerHuman.m_BaseCell);

        this.m_PlayerComputer.CounterUpdate(this);
        this.m_PlayerHuman.CounterUpdate(this);
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
            $("#" + CurCol).unbind("click").bind("click", { Owner: this.m_PlayerHuman, Board: this, Color: CurCol }, function (event) {
                event.data.Owner.m_BaseCell.m_Color = event.data.Color;
                event.data.Owner.m_BaseCell.Draw(event.data.Board);
                event.data.Board.CellMarkOwner(event.data.Owner.m_BaseCell);
                event.data.Owner.CounterUpdate(event.data.Board);
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
    this.CellExists = function (PosX, PosY) {
        var CellExists = false;

        if (("undefined" !== typeof this.m_Cells[PosY]) &&
            ("undefined" !== typeof this.m_Cells[PosY][PosX])) {
            CellExists = true;
        }

        return CellExists;
    };
    // ------------------------------------------------------------
    this.CellNeighboursGet = function (PosX, PosY) {
        var Neighbours = [];

        if (true === this.CellExists(PosX - 1, PosY)) {
            Neighbours.push(this.m_Cells[PosY][PosX - 1]);
        }
        if (true === this.CellExists(PosX + 1, PosY)) {
            Neighbours.push(this.m_Cells[PosY][PosX + 1]);
        }

        if (true === this.CellExists(PosX, PosY - 1)) {
            Neighbours.push(this.m_Cells[PosY - 1][PosX]);
        }
        if (true === this.CellExists(PosX, PosY + 1)) {
            Neighbours.push(this.m_Cells[PosY + 1][PosX]);
        }

        return Neighbours;
    };
    // ------------------------------------------------------------
    this.CellMarkOwner = function (BaseCell) {
        var Neighbours = this.CellNeighboursGet(BaseCell.m_PosX, BaseCell.m_PosY);
        var CellMarks = [];

        for (var Loop = 0; Loop < Neighbours.length; Loop++) {
            var CurrentCell = Neighbours[Loop];
            var CurrentState = CurrentCell.StateGet(BaseCell, this.m_Definitions);
            var Recurse = false;

            switch (CurrentState) {
            case this.m_Definitions.EnumState.FREE_COLOR_DIFFERENT:
                break;
            case this.m_Definitions.EnumState.FREE_COLOR_EQUAL:
                CurrentCell.OwnerSet(BaseCell.m_Owner);
                CurrentCell.Draw(this);
                CellMarks.push(CurrentCell);
                break;
            case this.m_Definitions.EnumState.OCCUPIED_OWNER_DIFFERENT:
                break;
            case this.m_Definitions.EnumState.OCCUPIED_OWNER_EQUAL:
                CurrentCell.OwnerSet(BaseCell.m_Owner);
                CurrentCell.Draw(this);
                CellMarks.push(CurrentCell);
                break;
            case this.m_Definitions.EnumState.UNDEFINED:
            default:
                console.log("Got undefined state for cell[" + PosX + "][" + PosY + "]");
                break;
            }
        }

        for (var Loop = 0; Loop < CellMarks.length; Loop++) {
            var CurrentCell = CellMarks[Loop];
            // this.CellMarkOwner(CurrentCell);
        }
    };
}