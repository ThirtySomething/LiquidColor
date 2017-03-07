var LiquidColor = {
    Config: {
        DimensionX: 5,
        DimensionY: 5,
        CellSize: 30,
        Colors: ["red", "green", "blue", "yellow", "lightgray", "cyan", "orange", "lightblue"],
    },
    Playground: {
        Cells: [],
        CanvasElement: null
    },
    Init: function (ElementName) {
        var BoardWidth = this.Config.DimensionX * this.Config.CellSize;
        var BoardHeight = this.Config.DimensionY * this.Config.CellSize;

        $("#" + ElementName).css("width", BoardWidth);
        $("#" + ElementName).css("height", BoardHeight);
        $("#" + ElementName).css("border", "1px solid black");

        var Graphics = document.getElementById(ElementName);

        if (Graphics.getContext) {
            this.Playground.CanvasElement = Graphics.getContext("2d");
            this.Playground.CanvasElement.width = BoardWidth + this.Config.CellSize;
            this.Playground.CanvasElement.height = BoardHeight + this.Config.CellSize;
            this.CellCreateAll();
        }
    },
    CellCreateAll: function () {
        this.Playground.Cells = new Array;

        for (var LoopX = 0; LoopX < this.Config.DimensionX; LoopX++) {
            for (var LoopY = 0; LoopY < this.Config.DimensionY; LoopY++) {
                var Size = this.Config.CellSize;
                var PosX = LoopX * Size;
                var PosY = LoopY * Size;
                var ColorIndex = Math.floor((Math.random() * this.Config.Colors.length) + 1);

                console.log("PosX[" + PosX + "], PosY[" + PosY + "], CellSize[" + Size + "]");

                this.Playground.CanvasElement.beginPath();
                this.Playground.CanvasElement.rect(PosX, PosY, Size, Size);
                this.Playground.CanvasElement.fillStyle = this.Config.Colors[ColorIndex];
                this.Playground.CanvasElement.fill();
                this.Playground.CanvasElement.lineWidth = 1;
                this.Playground.CanvasElement.strokeStyle = "black";
                this.Playground.CanvasElement.stroke();
            }
        }
    },
}