"use strict";

function LCBoard(DimX, DimY, CellSize) {
    // ------------------------------------------------------------
    // Board config
    this.Config = {};
    this.Config.DimensionX = parseInt(DimX);
    this.Config.DimensionY = parseInt(DimY);
    this.Config.CellSize = parseInt(CellSize);
    this.Config.Colors = ["blue", "cyan", "gray", "green", "red", "yellow"];
    this.Config.Cells = [];
    this.Config.CanvasElement = null;
    // ------------------------------------------------------------
    this.Init = function (GameField, ButtonField) {
        var BoardWidth = this.Config.DimensionX * this.Config.CellSize;
        var BoardHeight = this.Config.DimensionY * this.Config.CellSize;
        $("#" + GameField).css("width", BoardWidth);
        $("#" + GameField).css("height", BoardHeight);
        $("#" + GameField).css("border", "1px solid black");
        $("#" + GameField).attr("width", BoardWidth);
        $("#" + GameField).attr("height", BoardHeight);

        var Graphics = document.getElementById(GameField);
        if (Graphics.getContext) {
            this.Config.CanvasElement = Graphics.getContext("2d");
            this.BoardButtonsInit(ButtonField)
            this.BoardInit();
        }
    };
    // ------------------------------------------------------------
    this.BaseGetHuman = function () {
        var Index = this.Config.DimensionY - 1;
        var Base = this.Config.Cells[Index][0];

        return Base;
    };
    // ------------------------------------------------------------
    this.BaseGetComputer = function () {
        var Index = this.Config.DimensionX - 1;
        var Base = this.Config.Cells[0][Index];

        return Base;
    };
    // ------------------------------------------------------------
    this.BoardInit = function () {
        this.Config.Cells = [];

        for (var LoopY = 0; LoopY < this.Config.DimensionY; LoopY++) {
            this.Config.Cells[LoopY] = [];
            for (var LoopX = 0; LoopX < this.Config.DimensionX; LoopX++) {
                var PosX = LoopX * this.Config.CellSize;
                var PosY = LoopY * this.Config.CellSize;
                var CurrentCell = new LCCell(LoopX, LoopY);
                CurrentCell.ColorSet(this.CellColorRandomGet());
                CurrentCell.Draw(this.Config);
                this.Config.Cells[LoopY].push(CurrentCell);
            }
        }

        // ToDo: Update surrounding cells of same color with owner and occupy flag
        var BaseComputer = this.BaseGetComputer();
        var BaseHuman = this.BaseGetHuman();

        BaseComputer.OwnerSet("computer");
        BaseHuman.OwnerSet("human");

        while (BaseComputer.ColorGet() === BaseHuman.ColorGet()) {
            BaseHuman.ColorSet(this.CellColorRandomGet());
            BaseHuman.Draw(this.Config);
        }

        this.CellMarkOwner(BaseComputer);
        this.CellMarkOwner(BaseHuman);
    };
    // ------------------------------------------------------------
    this.BoardButtonsInit = function (ButtonField) {
        // Retrive margin size from CSS classn
        var BtnMargin = parseInt($(".gamebtn").css("margin"));
        var NumberOfButtons = this.Config.Colors.length;
        var BtnWidth = Math.floor((this.Config.DimensionX * this.Config.CellSize) / 5);
        var DimMulCell = Math.floor(this.Config.DimensionY * this.Config.CellSize);
        var BtnHeight = Math.floor(((this.Config.DimensionY * this.Config.CellSize) - ((NumberOfButtons + 1) * BtnMargin)) / NumberOfButtons);

        for (var Loop = 0; Loop < NumberOfButtons; Loop++) {
            var CurCol = this.Config.Colors[Loop];
            var Button = $("#" + ButtonField).append("<div id=\"" + CurCol + "\"></div>");

            $("#" + CurCol).css("width", BtnWidth);
            $("#" + CurCol).css("height", BtnHeight);
            $("#" + CurCol).css("background-color", CurCol);
            $("#" + CurCol).addClass("gamebtn");
            $("#" + CurCol).unbind("click").bind("click", { Owner: "human", Board: this, PosY: this.Config.DimensionY - 1 }, function (event) {
                var Data = event.data;
                Data.Board.CellMarkOwner(Data.Owner, Data.PosY, 0);
            });
        }
    };
    // ------------------------------------------------------------
    this.BoardConfigGet = function () {
        return this.Config;
    };
    // ------------------------------------------------------------
    this.CellColorRandomGet = function () {
        var ColorIndex = Math.floor((Math.random() * this.Config.Colors.length));
        var ColorName = this.Config.Colors[ColorIndex];

        return ColorName;
    };
    // ------------------------------------------------------------
    this.CellExists = function (PosX, PosY) {
        var CellExists = false;

        if (("undefined" !== typeof this.Config.Cells[PosY]) &&
            ("undefined" !== typeof this.Config.Cells[PosY][PosX])) {
            CellExists = true;
        }

        return CellExists;
    };
    // ------------------------------------------------------------
    this.CellNeighboursGet = function (PosX, PosY) {
        var Neighbours = [];

        if (true === this.CellExists(PosX - 1, PosY)) {
            Neighbours.push(this.Config.Cells[PosY][PosX - 1]);
        }
        if (true === this.CellExists(PosX + 1, PosY)) {
            Neighbours.push(this.Config.Cells[PosY][PosX + 1]);
        }

        if (true === this.CellExists(PosX, PosY - 1)) {
            Neighbours.push(this.Config.Cells[PosY - 1][PosX]);
        }
        if (true === this.CellExists(PosX, PosY + 1)) {
            Neighbours.push(this.Config.Cells[PosY + 1][PosX]);
        }

        return Neighbours;
    };
    // ------------------------------------------------------------
    this.CellMarkOwner = function (BaseCell) {
        var Neighbours = this.CellNeighboursGet(BaseCell.Config.PosX, BaseCell.Config.PosY);

        for (var Loop = 0; Loop < Neighbours.length; Loop++) {
            var CurrentCell = Neighbours[Loop];
            var CurrentState = CurrentCell.StateGet(BaseCell);

            switch (CurrentState) {
            case CurrentCell.EnumState.FREE_COLOR_DIFFERENT:
                break;
            case CurrentCell.EnumState.FREE_COLOR_EQUAL:
                CurrentCell.OwnerSet(BaseCell.Config.Owner);
                this.CellMarkOwner(CurrentCell);
                break;
            case CurrentCell.EnumState.OCCUPIED_OWNER_DIFFERENT:
                break;
            case CurrentCell.EnumState.OCCUPIED_OWNER_EQUAL:
                break;
            case CurrentCell.EnumState.UNDEFINED:
            default:
                console.log("Got undefined state for cell[" + PosX + "][" + PosY + "]");
                break;
            }
        }
    };
}