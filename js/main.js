let grid = document.querySelector(".grid");
let gridElements = [];
let chosenHoverColor = "#cccccc";
let backgroundColor = "#ffffff";
let drawColor = "#00ff00";
let eraserIsActive = false;
let gridSize = 10 ;
let gridSizeTemp = 00;

let clickHold = false;
document.addEventListener("mousedown", function(e){
    clickHold = true;
    gridSizeTemp = gridSize;
})
document.addEventListener("mouseup", function(e){
    if (gridSizeTemp !== gridSize) {enableDrawing()};
    clickHold = false;
})
document.addEventListener("mouseleave", function(e){
    clickHold = false;
})

let eraser = document.querySelector(".eraser");
eraser.addEventListener("click", function(e){
    eraserIsActive = !eraserIsActive;
})

let resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", function(e){
        resizeGrid();
    })

let gridSizeSlider = document.querySelector(".slider");
gridSizeSlider.addEventListener("input", function(e) {
        resizeGrid()
    })

let showGridToggle = document.querySelector(".showGridToggle");
let showGrid = true;
showGridToggle.addEventListener("click", function(e){
    showGrid = !showGrid;
    if (showGrid) {grid.style.gap = "1px"}
    else {grid.style.gap ="0px"}
    })

function resizeGrid(){
    let gridSizeSlider = document.querySelector(".slider");
    gridSize = gridSizeSlider.value;
    grid.innerHTML = "";
    for (i = 0; i < (gridSize * gridSize); i++) {
        let div = document.createElement("div");
        div.classList.add("gridElement", "empty")
        grid.appendChild(div)
    }
    grid.style.cssText = "grid-template-columns : repeat(" + gridSize + ", 1fr); grid-template-rows : repeat(" + gridSize + ", 1fr)";
    gridElements = document.querySelectorAll(".gridElement");
    gridElements.forEach(function(gridElement) {
        gridElement.style.cssText = "background-color : " + backgroundColor + ";";
    })
}

function enableDrawing() {
    gridElements.forEach(function(gridElement) {
        function mouseOverHover() {
            if (clickHold) {
                if (eraserIsActive) {gridElement.style.cssText = "background-color : " + backgroundColor + "; transition : 0s;";
                    gridElement.classList.remove("filled");
                    gridElement.classList.add("empty");
                }
                else {gridElement.style.cssText = "background-color : " + drawColor + "; transition : 0s;"
                    gridElement.classList.remove("empty")
                    gridElement.classList.add("filled")}
                }
            else if (gridElement.classList.contains("filled")){}
            else {gridElement.style.cssText = "background-color : " + chosenHoverColor + "; transition : 0.1s;"};
        }
        function mouseOutHover() {
            if (gridElement.classList.contains("filled")) {}
            else {gridElement.style.cssText = "background-color : " + backgroundColor + "; transition : 0.3s;"};
        }

        gridElement.addEventListener("mouseover", mouseOverHover) 
        gridElement.addEventListener("mouseout", mouseOutHover);

        gridElement.addEventListener("mousedown", function(e){
            if (eraserIsActive) {gridElement.style.cssText = "background-color : " + backgroundColor + "; transition : 0s;";
                gridElement.classList.remove("filled");
                gridElement.classList.add("empty");
            }
            else {gridElement.style.cssText = "background-color : " + drawColor + "; transition : 0s;"
                gridElement.classList.remove("empty")
                gridElement.classList.add("filled")
            }    
        })    
    })
}

resizeGrid();
enableDrawing();