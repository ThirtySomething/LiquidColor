function LQBoard(DimX, DimY, CellSize) {
    // ------------------------------------------------------------
    this.Config = {};
    this.Config.DimensionX = parseInt(DimX);
    this.Config.DimensionY = parseInt(DimY);
    this.Config.CellSize = parseInt(CellSize);
    this.Config.Colors = ["red", "green", "blue", "yellow"];
    // ------------------------------------------------------------
    this.Playground = {};
    this.Playground.Cells = [];
    this.Playground.CanvasElement = null;
    // ------------------------------------------------------------
    this.Init = function (ElementName) {
        var BoardWidth = parseInt(this.Config.DimensionX * this.Config.CellSize);
        var BoardHeight = parseInt(this.Config.DimensionY * this.Config.CellSize);
        $("#" + ElementName).css("width", BoardWidth);
        $("#" + ElementName).css("height", BoardHeight);
        $("#" + ElementName).css("border", "1px solid black");
        $("#" + ElementName).attr("width", BoardWidth);
        $("#" + ElementName).attr("height", BoardHeight);

        console.log(JSON.stringify(this.Config));
        console.log("BoardWidth[" + BoardWidth + "], BoardHeight[" + BoardHeight + "]");

        var Graphics = document.getElementById(ElementName);
        if (Graphics.getContext) {
            this.Playground.CanvasElement = Graphics.getContext("2d");
            this.BoardInit();
        }
    };
    // ------------------------------------------------------------
    this.BoardInit = function () {
        this.Playground.Cells = new Array;

        for (var LoopX = 0; LoopX < this.Config.DimensionX; LoopX++) {
            for (var LoopY = 0; LoopY < this.Config.DimensionY; LoopY++) {
                var CellSize = this.Config.CellSize;
                var PosX = parseInt(LoopX * CellSize);
                var PosY = parseInt(LoopY * CellSize);
                var ColorIndex = parseInt(Math.floor((Math.random() * this.Config.Colors.length)));
                var ColorName = this.Config.Colors[ColorIndex];
                var CurrentCell = new LQCell(PosX, PosY, CellSize);

                CurrentCell.ColorSet(ColorName);
                CurrentCell.Draw(this.Playground.CanvasElement);
                this.Playground.Cells.push(CurrentCell);
            }
        }
    };
}