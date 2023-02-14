let grid = document.querySelector(".grid");
let gridElements = [];
let eraserIsActive = false;
let gridSize = 10 ;
let gridSizeTemp = 0;

// COLOR OPTIONS
let chosenHoverColor = "#cccccc";
let backgroundColor = "rgb(255, 255, 255)";
let drawColor = "#000000";
let normalMode = true;
let darkenMode = false;
let colorChangeValue = 10;

function hexToRGB(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return ("rgb(" + r + ", " + g + ", " + b + ")")
}

let colorPicker = document.querySelector(".colorPicker");
colorPicker.addEventListener("input", function(e){
    drawColor = hexToRGB(e.target.value)
})

let backgroundColorPicker = document.querySelector(".backgroundColorPicker");
backgroundColorPicker.addEventListener("input", function(e){
    backgroundColor = hexToRGB(e.target.value)
    console.log(backgroundColor)
    gridElements.forEach(function(gridElement){
        if (gridElement.classList.contains("empty")){
            gridElement.style.cssText = "background-color : " + backgroundColor + "; transition : 0s;"
        }
    })
})

function generateRandomColor(){
    drawColor = "rgb(" + (Math.floor(Math.random() * 255) + 1) + ", " + (Math.floor(Math.random() * 255) + 1) + ", " + (Math.floor(Math.random() * 255) + 1) + ")"
}

let normalModeToggle = document.querySelector(".normalMode");
normalModeToggle.addEventListener("click", function(e){
    normalMode = true;
    darkenMode = false;
    lightenMode = false;
    drawColor = colorPicker.value;
})

let randomModeToggle = document.querySelector(".randomMode");
randomModeToggle.addEventListener("click", function(e){
    normalMode = false;
    darkenMode = false;
    lightenMode = false;
})

let darkenModeToggle = document.querySelector(".darkenMode");
darkenModeToggle.addEventListener("click", function(e){
    normalMode = false;
    darkenMode = true;
    lightenMode = false;
})

let lightenModeToggle = document.querySelector(".lightenMode");
lightenModeToggle.addEventListener("click", function(e){
    normalMode = false;
    darkenMode = false;
    lightenMode = true;
})

let colorChangeSlider = document.querySelector(".colorChangeSlider");
let colorChangeSliderText = document.querySelector(".colorChangeSliderText")
colorChangeSlider.addEventListener("input", function(e) {
        colorChangeValue = Math.floor(colorChangeSlider.value / 100 * 255); 
        colorChangeSliderText.textContent = colorChangeSlider.value + " %";
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

let eraser = document.querySelector(".eraser");
eraser.addEventListener("click", function(e){
    eraserIsActive = !eraserIsActive;
})

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
                else if (normalMode === true) {gridElement.style.cssText = "background-color : " + drawColor + "; transition : 0s;"
                    gridElement.classList.remove("empty")
                    gridElement.classList.add("filled")
                }

                // This reads current color value and darkens or lightens it by 10%
                else if (normalMode === false && (darkenMode === true || lightenMode === true)) {
                    let currentColor = gridElement.style.backgroundColor;
                    if (gridElement.classList.contains("empty")) {
                        currentColor = backgroundColor
                    }
                    let currentColorArray = currentColor.split(")").join("").split(")").join("").split(" ").join("").split("(")[1].split(",");
                    let colorModifier = 0;
                    if (darkenMode === true) {colorModifier = 0 - colorChangeValue}
                    else {colorModifier = colorChangeValue}
                    for (i = 0; i < currentColorArray.length; i++) {
                        currentColorArray[i] = +currentColorArray[i] + colorModifier;
                        if (currentColorArray[i] > 255){currentColorArray[i] = 255}
                        else if (currentColorArray[i] < 0) {currentColorArray[i] = 0}
                    }
                    gridElement.style.cssText = "background-color : rgb(" + currentColorArray[0] + ", " + currentColorArray[1] + ", " + currentColorArray[2] + "); transition : 0s;"
                    gridElement.classList.remove("empty")
                    gridElement.classList.add("filled")
                    if ("rgb(" + currentColorArray[0] + ", " + currentColorArray[1] + ", " + currentColorArray[2] + ")" == backgroundColor) {
                        gridElement.classList.remove("filled")
                        gridElement.classList.add("empty")
                    }
                }
                else {generateRandomColor();
                    gridElement.style.cssText = "background-color : " + drawColor + "; transition : 0s;"
                    gridElement.classList.remove("empty")
                    gridElement.classList.add("filled")
                }
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
            else if (normalMode === true) {gridElement.style.cssText = "background-color : " + drawColor + "; transition : 0s;"
                gridElement.classList.remove("empty")
                gridElement.classList.add("filled")
            }
            // This reads current color value and darkens or lightens it by 10%
            else if (normalMode === false && (darkenMode === true || lightenMode === true)) {
                let currentColor = gridElement.style.backgroundColor;
                if (gridElement.classList.contains("empty")) {
                    currentColor = backgroundColor
                }
                let currentColorArray = currentColor.split(")").join("").split(")").join("").split(" ").join("").split("(")[1].split(",");
                let colorModifier = 0;
                if (darkenMode === true) {colorModifier = 0 - colorChangeValue}
                else {colorModifier = colorChangeValue}
                for (i = 0; i < currentColorArray.length; i++) {
                    currentColorArray[i] = +currentColorArray[i] + colorModifier;
                    if (currentColorArray[i] > 255){currentColorArray[i] = 255}
                    else if (currentColorArray[i] < 0) {currentColorArray[i] = 0}
                }
                gridElement.style.cssText = "background-color : rgb(" + currentColorArray[0] + ", " + currentColorArray[1] + ", " + currentColorArray[2] + "); transition : 0s;"
                gridElement.classList.remove("empty")
                gridElement.classList.add("filled")
                if ("rgb(" + currentColorArray[0] + ", " + currentColorArray[1] + ", " + currentColorArray[2] + ")" == backgroundColor) {
                    gridElement.classList.remove("filled")
                    gridElement.classList.add("empty")
                }
            }
            else {generateRandomColor();
                gridElement.style.cssText = "background-color : " + drawColor + "; transition : 0s;"
                gridElement.classList.remove("empty")
                gridElement.classList.add("filled")
            }  
        })    
    })
    if (showGrid) {grid.style.gap = "1px"}
    else {grid.style.gap ="0px"}
}

// ON PAGE LOAD FUNCTIONS
resizeGrid();
enableDrawing();