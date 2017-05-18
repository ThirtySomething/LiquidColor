function ElementSetSize(Element, DimX, DimY) {
    Element.css("width", DimX);
    Element.css("height", DimY);
    Element.attr("width", DimX);
    Element.attr("height", DimY);
}