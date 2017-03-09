"use strict";

function LCBoard(Definitions) {
    // ------------------------------------------------------------
    // Board config
    this.m_Cells = [];
    this.m_CanvasElement = null;
    this.m_Definitions = Definitions;
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
        }
    };
    // ------------------------------------------------------------
    this.BaseGetHuman = function () {
        var Index = this.m_Definitions.DimensionY - 1;
        var Base = this.m_Cells[Index][0];

        return Base;
    };
    // ------------------------------------------------------------
    this.BaseGetComputer = function () {
        var Index = this.m_Definitions.DimensionX - 1;
        var Base = this.m_Cells[0][Index];

        return Base;
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

        var BaseComputer = this.BaseGetComputer();
        var BaseHuman = this.BaseGetHuman();

        BaseComputer.OwnerSet("computer");
        BaseHuman.OwnerSet("human");

        while (BaseComputer.m_Color === BaseHuman.m_Color) {
            BaseHuman.m_Color = this.CellColorRandomGet();
            BaseHuman.Draw(this);
        }

        this.CellMarkOwner(BaseComputer);
        this.CellMarkOwner(BaseHuman);
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
            $("#" + CurCol).unbind("click").bind("click", { Owner: "human", Board: this, PosY: this.m_Definitions.DimensionX - 1 }, function (event) {
                var Data = event.data;
                Data.Board.CellMarkOwner(Data.Owner, Data.PosY, 0);
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

        for (var Loop = 0; Loop < Neighbours.length; Loop++) {
            var CurrentCell = Neighbours[Loop];
            var CurrentState = CurrentCell.StateGet(BaseCell, this.m_Definitions);

            switch (CurrentState) {
            case this.m_Definitions.EnumState.FREE_COLOR_DIFFERENT:
                break;
            case this.m_Definitions.EnumState.FREE_COLOR_EQUAL:
                CurrentCell.OwnerSet(BaseCell.m_Owner);
                this.CellMarkOwner(CurrentCell);
                break;
            case this.m_Definitions.EnumState.OCCUPIED_OWNER_DIFFERENT:
                break;
            case this.m_Definitions.EnumState.OCCUPIED_OWNER_EQUAL:
                break;
            case this.m_Definitions.EnumState.UNDEFINED:
            default:
                console.log("Got undefined state for cell[" + PosX + "][" + PosY + "]");
                break;
            }
        }
    };
}