let root = document.querySelector(":root");
let grid = document.querySelector(".grid");
let gridCells = [];
let gridSize = 10 ;
let gridSizeTemp = 0;

// COLOR OPTIONS AND MODE TOGGLES
let chosenHoverColor = "rgb(192, 192, 192)";
let cellBackgroundColor = "rgb(255, 255, 255)";
let gridBackgroundColor = "rgb(128, 128, 128)";
let drawColor = "rgb(0, 0, 0)";
let normalMode = true;
let randomMode = false;
let eraserMode = false;
let shaderMode = false;
let colorPickerMode = false;
let colorChangeValue = 0;

let drawColorContainer = document.querySelector(".drawColorContainer");
drawColorContainer.style.cssText = "background-color : " + drawColor + ";"

let backgroundColorContainer = document.querySelector(".backgroundColorContainer");
backgroundColorContainer.style.cssText = "background-color : " + cellBackgroundColor + ";"

function hexToRGB(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return ("rgb(" + r + ", " + g + ", " + b + ")")
}

function rgbStringToArray(rgbString) {return rgbString.split(")").join("").split(")").join("").split(" ").join("").split("(")[1].split(",")};
function rgbArrayToHexString(rgbArray) {
    let r = parseInt(rgbArray[0]).toString(16);
    let g = parseInt(rgbArray[1]).toString(16);
    let b = parseInt(rgbArray[2]).toString(16);
    if (r.length == 1) {r = "0" + r}
    if (g.length == 1) {g = "0" + g}
    if (b.length == 1) {b = "0" + b}
    return ("#" + r + g + b)
}

let drawColorPicker = document.querySelector(".drawColorPicker");
drawColorPicker.addEventListener("input", function(e){
    drawColor = hexToRGB(e.target.value)
    drawColorContainer.style.cssText = "background-color : " + drawColor + ";"
})

let cellBackgroundColorPicker = document.querySelector(".cellBackgroundColorPicker");
cellBackgroundColorPicker.addEventListener("input", function(e){
    cellBackgroundColor = hexToRGB(e.target.value)
    gridCells.forEach(function(gridCell){
        if (gridCell.classList.contains("empty")){
            gridCell.style.cssText = "background-color : " + cellBackgroundColor + "; transition : 0s;"
        }
    backgroundColorContainer.style.cssText = "background-color : " + cellBackgroundColor + ";"
    })
    let darkInvert = false;
    let textInvert = false;
    function changeColor(array, divider) {
        let r = parseInt(array[0]);
        let g = parseInt(array[1]);
        let b = parseInt(array[2]);
        let modifier = 0
        if (r > g && r > b) {modifier = r}
        else if (g > r && g > b) {modifier = g}
        else {modifier = b}
        if ((modifier >= 128 && modifier < 192) || (modifier < 64)) {textInvert = true};
        if (modifier < 128) {modifier = Math.floor((255 - modifier) / divider)
            r = r + modifier;
            g = g + modifier;
            b = b + modifier;   
        }
        else {modifier = Math.floor(modifier / divider)
            r = r - modifier;
            g = g - modifier;
            b = b - modifier;
            darkInvert = true;
        }

        if (r < 0) {r = 0};
        if (g < 0) {g = 0};
        if (b < 0) {b = 0};
        return [r, g, b]
    }
    let tempArray1 = changeColor(rgbStringToArray(cellBackgroundColor), 2);
    gridBackgroundColor = "rgb(" + tempArray1[0] + ", " + tempArray1[1] + ", " + tempArray1[2] + ")";
    grid.style.backgroundColor = gridBackgroundColor;
    let tempArray2 = changeColor(rgbStringToArray(cellBackgroundColor), 4);
    chosenHoverColor = "rgb(" + tempArray2[0] + ", " + tempArray2[1] + ", " + tempArray2[2] + ")";
    if (darkInvert) {
        root.style.setProperty("--second-color", gridBackgroundColor);
        root.style.setProperty("--third-color", chosenHoverColor);
        root.style.setProperty("--main-color", cellBackgroundColor);
    }
    else {
        root.style.setProperty("--second-color", cellBackgroundColor);
        root.style.setProperty("--third-color", chosenHoverColor);
        root.style.setProperty("--main-color", gridBackgroundColor);

    }
    if (textInvert) {root.style.setProperty("--adaptive-text-color", "rgb(255, 255, 255)")}
    else {root.style.setProperty("--adaptive-text-color", "rgb(0, 0, 0)")}
    
    let tempArray = rgbStringToArray(getComputedStyle(root).getPropertyValue("--third-color"))
        shaderChangedColor.style.cssText ="background-color : rgb(" + (+tempArray[0] + colorChangeValue) + ", " + (+tempArray[1] + colorChangeValue) + ", " + (+tempArray[2] + colorChangeValue) + ");"
})

function generateRandomColor(){
    drawColor = "rgb(" + (Math.floor(Math.random() * 255) + 1) + ", " + (Math.floor(Math.random() * 255) + 1) + ", " + (Math.floor(Math.random() * 255) + 1) + ")"
}

let normalModeToggle = document.querySelector(".normalMode");
normalModeToggle.addEventListener("click", function(e){
    normalMode = true;
    normalModeToggle.classList.add("buttonActive");
    randomMode = false;
    randomModeToggle.classList.remove("buttonActive");
    eraserMode = false;
    eraserModeToggle.classList.remove("buttonActive");
    shaderMode = false;
    shaderModeToggle.classList.remove("buttonActive");
    colorPickerMode = false;
    colorPickerModeToggle.classList.remove("buttonActive");
    drawColor = drawColorPicker.value;
})

let randomModeToggle = document.querySelector(".randomMode");
randomModeToggle.addEventListener("click", function(e){
    normalMode = false;
    normalModeToggle.classList.remove("buttonActive");
    randomMode = true;
    randomModeToggle.classList.add("buttonActive");
    eraserMode = false;
    eraserModeToggle.classList.remove("buttonActive");
    shaderMode = false;
    shaderModeToggle.classList.remove("buttonActive");
    colorPickerMode = false;
    colorPickerModeToggle.classList.remove("buttonActive");
})

let eraserModeToggle = document.querySelector(".eraserMode");
eraserModeToggle.addEventListener("click", function(e){
    normalMode = false;
    normalModeToggle.classList.remove("buttonActive");
    randomMode = false;
    randomModeToggle.classList.remove("buttonActive");
    eraserMode = true;
    eraserModeToggle.classList.add("buttonActive");
    shaderMode = false;
    shaderModeToggle.classList.remove("buttonActive");
    colorPickerMode = false;
    colorPickerModeToggle.classList.remove("buttonActive");
})

let shaderModeToggle = document.querySelector(".shaderMode");
shaderModeToggle.addEventListener("click", function(e){
    normalMode = false;
    normalModeToggle.classList.remove("buttonActive");
    randomMode = false;
    randomModeToggle.classList.remove("buttonActive");
    eraserMode = false;
    eraserModeToggle.classList.remove("buttonActive");
    shaderMode = true;
    shaderModeToggle.classList.add("buttonActive");
    colorPickerMode = false;
    colorPickerModeToggle.classList.remove("buttonActive");
})

let colorPickerModeToggle = document.querySelector(".colorPickerMode");
colorPickerModeToggle.addEventListener("click", function(e){
    normalMode = false;
    normalModeToggle.classList.remove("buttonActive");
    randomMode = false;
    randomModeToggle.classList.remove("buttonActive");
    eraserMode = false;
    eraserModeToggle.classList.remove("buttonActive");
    shaderMode = false;
    shaderModeToggle.classList.remove("buttonActive");
    colorPickerMode = true;
    colorPickerModeToggle.classList.add("buttonActive");
})

let colorChangeSlider = document.querySelector(".colorChangeSlider");
let colorChangeSliderText = document.querySelector(".colorChangeSliderText")
let shaderChangedColor = document.querySelector(".shaderChangedColor")
colorChangeSlider.addEventListener("input", function(e) {
        colorChangeValue = Math.floor(colorChangeSlider.value / 100 * 255); 
        colorChangeSliderText.textContent = Math.abs(colorChangeSlider.value) + " %";
        
        let tempArray = rgbStringToArray(getComputedStyle(root).getPropertyValue("--third-color"))
        shaderChangedColor.style.cssText ="background-color : rgb(" + (+tempArray[0] + colorChangeValue) + ", " + (+tempArray[1] + colorChangeValue) + ", " + (+tempArray[2] + colorChangeValue) + ");"
    })

// CLICK LISTENERS
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
document.addEventListener("dragstart", function(e){
    e.preventDefault();
}) // This prevents grid elements from being dragged, which could alter drawing in some browsers



// GRID CONFIGURATION
let gridSizeSlider = document.querySelector(".slider");
let gridSizeSliderText = document.querySelector(".sliderText")
gridSizeSlider.addEventListener("input", function(e) {
        resizeGrid()
        gridSizeTemp = 0; // This will trigger enableDrawing on mouseup
        gridSizeSliderText.textContent = gridSize + " X " + gridSize;
    })

let resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", function(e){
        resizeGrid();
        enableDrawing(); // Setting gridSizeTemp = 0 would not trigger enableDrawing, click event comes after mouseup event
    })

let showGridToggle = document.querySelector(".showGridToggle");
let showGrid = true;
showGridToggle.addEventListener("click", function(e){
    showGrid = !showGrid;
    if (showGrid) {grid.style.gap = "1px"
        showGridToggle.textContent = "HIDE GRID"}
    else {grid.style.gap ="0px"
        showGridToggle.textContent = "SHOW GRID"}
    })

function resizeGrid(){
    let gridSizeSlider = document.querySelector(".slider");
    gridSize = gridSizeSlider.value;
    grid.innerHTML = "";
    for (i = 0; i < (gridSize * gridSize); i++) {
        let div = document.createElement("div");
        div.classList.add("gridCell", "empty")
        grid.appendChild(div)
    }
    grid.style.cssText = "grid-template-columns : repeat(" + gridSize + ", 1fr); grid-template-rows : repeat(" + gridSize + ", 1fr)";
    gridCells = document.querySelectorAll(".gridCell");
    gridCells.forEach(function(gridCell) {
        gridCell.style.cssText = "background-color : " + cellBackgroundColor + ";";
    })
    grid.style.backgroundColor = gridBackgroundColor;
}

function enableDrawing() {
    gridCells.forEach(function(gridCell) {
        
        function selectDrawingCondition(){
            if (normalMode === true) {gridCell.style.cssText = "background-color : " + drawColor + "; transition : 0s;"
                gridCell.classList.remove("empty")
                gridCell.classList.add("filled")
            }
            else if (randomMode === true) {generateRandomColor();
                gridCell.style.cssText = "background-color : " + drawColor + "; transition : 0s;"
                gridCell.classList.remove("empty")
                gridCell.classList.add("filled")
            }
            else if (eraserMode) {gridCell.style.cssText = "background-color : " + cellBackgroundColor + "; transition : 0s;";
                gridCell.classList.remove("filled");
                gridCell.classList.add("empty");
            }
            // This reads current color value and darkens or lightens it by 10%
            else if (shaderMode === true) {
                let currentColor = gridCell.style.backgroundColor;
                if (gridCell.classList.contains("empty")) {
                    currentColor = cellBackgroundColor
                }
                let currentColorArray = rgbStringToArray(currentColor);
                for (i = 0; i < currentColorArray.length; i++) {
                    currentColorArray[i] = +currentColorArray[i] + colorChangeValue;
                    if (currentColorArray[i] > 255){currentColorArray[i] = 255}
                    else if (currentColorArray[i] < 0) {currentColorArray[i] = 0}
                }
                gridCell.style.cssText = "background-color : rgb(" + currentColorArray[0] + ", " + currentColorArray[1] + ", " + currentColorArray[2] + "); transition : 0s;"
                gridCell.classList.remove("empty")
                gridCell.classList.add("filled")
                if ("rgb(" + currentColorArray[0] + ", " + currentColorArray[1] + ", " + currentColorArray[2] + ")" == cellBackgroundColor) {
                    gridCell.classList.remove("filled")
                    gridCell.classList.add("empty")
                }
            }
            else if (colorPickerMode === true) {if (gridCell.classList.contains("empty")) {drawColorPicker.value = rgbArrayToHexString(rgbStringToArray(cellBackgroundColor))
                    drawColorContainer.style.cssText = "background-color : " + cellBackgroundColor + ";"}
                else {drawColorPicker.value = rgbArrayToHexString(rgbStringToArray(gridCell.style.backgroundColor))
                    drawColorContainer.style.cssText = "background-color : " + gridCell.style.backgroundColor + ";"}
            }
        }

        function mouseOverHover() {
            if (clickHold) {selectDrawingCondition()}
            else if (gridCell.classList.contains("filled")){}
            else {gridCell.style.cssText = "background-color : " + chosenHoverColor + "; transition : 0.1s;"};
        }

        function mouseOutHover() {
            if (gridCell.classList.contains("filled")) {}
            else {gridCell.style.cssText = "background-color : " + cellBackgroundColor + "; transition : 0.3s;"};
        }

        gridCell.addEventListener("mouseover", mouseOverHover) 
        gridCell.addEventListener("mouseout", mouseOutHover);
        gridCell.addEventListener("mousedown", function(e){selectDrawingCondition()})    
    })
    if (showGrid) {grid.style.gap = "1px"}
    else {grid.style.gap ="0px"}
}

// ON PAGE LOAD FUNCTIONS
resizeGrid();
enableDrawing();