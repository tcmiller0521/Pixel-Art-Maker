const pixelCanvas = document.querySelector('.pixel-canvas');
const canvasSize = document.querySelector('.canvas-size');
const inputHeight = document.querySelector('.input-height');
const inputWidth = document.querySelector('.input-width');
const paletteContainer = document.querySelector('.palette-container');
const pictureContainer = document.querySelector('.picture-container');
const pictureImage = document.querySelector('.picture-image')
let canvasHeight = document.querySelector('.input-height').value;
let canvasWidth = document.querySelector('.input-width').value;
const whiteCanvas = document.querySelector('.white-canvas')

const saveButton = document.querySelector('.save-button');
const loadButton = document.querySelector('.load-button');
const fillButton = document.querySelector('.fill-button');
const clearButton = document.querySelector('.clear-button');
const loadPictureButton = document.querySelector('.image-button');
const undoButton = document.querySelector('.undo-button');
const redoButton = document.querySelector('.redo-button');
const square = document.querySelectorAll('td');

const paintBrush = document.querySelector('.paint-brush');
const eraser = document.querySelector('.eraser');
const colorPicker = document.querySelector('.color-picker');


const paletteColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'gray', 'white'];
let paintColor = 'black';

//create canvas
function makeGrid(canvasHeight, canvasWidth) {
  while (pixelCanvas.firstChild) {
    pixelCanvas.removeChild(pixelCanvas.firstChild);
  }
  for (let i = 0; i < canvasHeight; i++) {
    const row = document.createElement('tr');
    pixelCanvas.appendChild(row);
    for (let j = 0; j < canvasWidth; j++) {
      const cell = document.createElement('td');
      row.appendChild(cell);

      //paint brush
      paintBrush.addEventListener('click', () => {
        cell.addEventListener('click', () => {
          cell.style.backgroundColor = paintColor;
        })
      });

      //eraser
      eraser.addEventListener('click', () => {
        cell.addEventListener('click', () => {
          cell.style.backgroundColor = "";
        })
      });

      makeCanvasWhite(cell);
      fillCanvas(cell); 
      clearCanvas(cell);
    }
  }
}


//Function for canvas size
function changeCanvasSize() {
  canvasSize.addEventListener('submit', (e) => {
    e.preventDefault();
    makeGrid(canvasHeight, canvasWidth);
  });
  inputHeight.addEventListener('change', (e) => {
    canvasHeight = e.target.value;
  });
  inputWidth.addEventListener('change', (e) => {
    canvasWidth = e.target.value;
  });
}




//function for drag and draw
function dragAndDraw() {
  paintBrush.addEventListener('click', () => {
    pixelCanvas.addEventListener('mousedown', () => {
      down = true;
      pixelCanvas.addEventListener('mouseup', () => {
        down = false;
        pixelCanvas.addEventListener('mouseover', (e) => {
          if (e.target.className === "" && down) {
            e.target.style.backgroundColor = paintColor;
          }
        });
      });
    });
  });
}

//function for drag and erase
function dragAndErase() {
  eraser.addEventListener('click', () => {
    pixelCanvas.addEventListener('mousedown', () => {
      down = true;
      pixelCanvas.addEventListener('mouseup', () => {
        down = false;
        pixelCanvas.addEventListener('mouseover', (e) => {
          if (e.target.className === "" && down) {
            e.target.style.backgroundColor = "";
          }
        });
      });
    });
  });
}

//make canvas white
function makeCanvasWhite(cell) {
  window.addEventListener('load', () => {
    cell.style.backgroundColor = "white";
  });
}

//Fill canvas
function fillCanvas(cell) {
  fillButton.addEventListener('click', () => {
    cell.style.backgroundColor = paintColor;
  });
}

//clear canvas
function clearCanvas(cell) {
  clearButton.addEventListener('click', () => {
    cell.style.backgroundColor = "White";
  });
}

//Color picker
function changeColor() {
  colorPicker.addEventListener('change', () => {
    paintColor = colorPicker.value;

    createColorCircleAndAppend(colorPicker.value);
  });
}

//load random image into canvas
function getImageFromApi() {
  const fetchRequest = fetch('https://source.unsplash.com/random/800x600');

  fetchRequest.then((response) => {
    return response.JSON();
  }).then((data) => {
    console.log(data);
    pixelCanvas.style.backgroundImage = `url("${data.message}")`
    clearCells();
  });
}

function loadImageFromApi() {
  loadPictureButton.addEventListener('click', (e) => {
    e.preventDefault();
    getImageFromApi();
  });
}

function clearCells() {
  const cellArray = [];
  const allCells = document.querySelectorAll('td');
  for (let i = 0; i < allCells.length; i++) {
    const cells = allCells[i];
    cells.style.backgroundColor = "";
    }
}

//save canvas
function saveCanvas () {
  saveButton.addEventListener('click', () => {
    const cellArray = [];
    const allCells = document.querySelectorAll('td');
    for (let i = 0; i < allCells.length; i++) {
      const cells = allCells[i];
      cellArray.push(cells.style.backgroundColor);
    }

    const canvasInfo = {
      canvas: cellArray,
      height: canvasHeight,
      width: canvasWidth,
    }

    localStorage.setItem('canvas', JSON.stringify(canvasInfo));
  });
}

//load canvas
function loadCanvas() {
  loadButton.addEventListener('click', () => {
    const savedCanvasInfo = JSON.parse(localStorage.getItem('canvas'));
    makeGrid(savedCanvasInfo.height, savedCanvasInfo.width);
    const allCells = document.querySelectorAll('td');
    for (let i = 0; i < allCells.length; i++) {
      allCells[i].style.backgroundColor = savedCanvasInfo.canvas[i];
    }
  });
}

//undo autosave
function undoSave () {
  pixelCanvas.addEventListener('mousedown', () => {
    const cellArray = [];
    const allCells = document.querySelectorAll('td');
    for (let i = 0; i < allCells.length; i++) {
      const cells = allCells[i];
      cellArray.push(cells.style.backgroundColor);
    }

    const canvasInfo = {
      canvas: cellArray,
      height: canvasHeight,
      width: canvasWidth,
    }

    localStorage.setItem('undo', JSON.stringify(canvasInfo));
  });
}

//undo button
function undoAction() {
  undoButton.addEventListener('click', () => {
    const savedCanvasInfo = JSON.parse(localStorage.getItem('undo'));
    makeGrid(savedCanvasInfo.height, savedCanvasInfo.width);
    const allCells = document.querySelectorAll('td');
    for (let i = 0; i < allCells.length; i++) {
      allCells[i].style.backgroundColor = savedCanvasInfo.canvas[i];
    }
  });
}

//redo autosave
function redoSave () {
  pixelCanvas.addEventListener('mousemove', () => {
    const cellArray = [];
    const allCells = document.querySelectorAll('td');
    for (let i = 0; i < allCells.length; i++) {
      const cells = allCells[i];
      cellArray.push(cells.style.backgroundColor);
    }

    const canvasInfo = {
      canvas: cellArray,
      height: canvasHeight,
      width: canvasWidth,
    }

    localStorage.setItem('redo', JSON.stringify(canvasInfo));
  });
}

//redo button
function redoAction() {
  redoButton.addEventListener('click', () => {
    const savedCanvasInfo = JSON.parse(localStorage.getItem('redo'));
    makeGrid(savedCanvasInfo.height, savedCanvasInfo.width);
    const allCells = document.querySelectorAll('td');
    for (let i = 0; i < allCells.length; i++) {
      allCells[i].style.backgroundColor = savedCanvasInfo.canvas[i];
    }
  });
}


//create palette circles
function createColorCircleAndAppend(colorHex) {
  const colorCircle = document.createElement('div');
  colorCircle.classList.add('circle');
  colorCircle.style.backgroundColor = colorHex;

  paletteContainer.appendChild(colorCircle);

  //Grab color from circles
  colorCircle.addEventListener('click', () => {
    paintColor = colorCircle.style.backgroundColor;
  })
}

//Create color palette
function createColorPalette() {
  for (let i = 0; i < paletteColors.length; i++) {
    let colorHex = paletteColors[i];

    createColorCircleAndAppend(colorHex);
  }
}



function init() {
  makeGrid(canvasHeight, canvasWidth);
  createColorPalette();
  dragAndDraw();
  dragAndErase();
  fillCanvas();
  clearCanvas();
  changeColor();
  changeCanvasSize();
  saveCanvas();
  loadCanvas();
  loadImageFromApi();
  undoSave();
  undoAction();
  redoAction();
  redoSave();
  makeCanvasWhite();
}

init();
