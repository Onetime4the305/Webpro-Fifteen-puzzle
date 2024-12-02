"use strict";

let emptyX, emptyY;
let tileElements;
let timeDisplay;
let secondsElapsed = 0;
let gameInterval;
let gridSize = 4;
let movesCount = 0; //moves counter
let currentBackground = "Background.png"



window.onload = function () {
    timeDisplay = document.getElementById("timer");
    movesDisplay = document.getElementById("moves");
    initializeBoard();
};

function initializeBoard() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // Clear the board for reinitialization

    const tileSize = Math.floor(400 / gridSize); // Tile size based on grid size
    board.style.width = `${400}px`;
    board.style.height = `${400}px`;
    board.style.position = "relative";

    emptyX = (gridSize - 1) * tileSize;
    emptyY = (gridSize - 1) * tileSize;

    // Create tiles
    for (let i = 0; i < gridSize * gridSize - 1; i++) {
        const tile = document.createElement("div");
        tile.className = "tilePiece";
        tile.style.width = `${tileSize - 2}px`;
        tile.style.height = `${tileSize - 2}px`;
        tile.style.left = `${(i % gridSize) * tileSize}px`;
        tile.style.top = `${Math.floor(i / gridSize) * tileSize}px`;

        // Set the correct section of the background image for the tile
        tile.style.backgroundImage = `url(${currentBackground})`;
        tile.style.backgroundSize = `${400}px ${400}px`;
        tile.style.backgroundPosition = `-${(i % gridSize) * tileSize}px -${Math.floor(i / gridSize) * tileSize}px`;

        tile.textContent = i + 1; // Set tile number (except for the empty space)
        tile.addEventListener("click", () => moveTile(tile));
        board.appendChild(tile);
    }

    tileElements = document.querySelectorAll(".tilePiece");
}


function moveTile(tile) {
    // Check if the tile can move to the empty space
    if (canSlide(tile)) {
        swapTiles(tile);
        movesCount++;
        document.getElementById("moves").textContent = `Moves: ${movesCount}`;
        if (isComplete()) {
            declareVictory();
        }
    }
}

function canSlide(tile) {
    const tileX = parseInt(tile.style.left, 10);
    const tileY = parseInt(tile.style.top, 10);
    const tileSize = Math.floor(400 / gridSize);
    return (
        (tileX === emptyX && Math.abs(tileY - emptyY) === tileSize) ||
        (tileY === emptyY && Math.abs(tileX - emptyX) === tileSize)
    );
}

function swapTiles(tile) {
    const tempX = tile.style.left;
    const tempY = tile.style.top;
    tile.style.left = `${emptyX}px`;
    tile.style.top = `${emptyY}px`;
    emptyX = parseInt(tempX, 10);
    emptyY = parseInt(tempY, 10);
}

function isComplete() {
    let index = 0;
    const tileSize = Math.floor(400 / gridSize);
    for (let tile of tileElements) {
        const expectedX = (index % gridSize) * tileSize;
        const expectedY = Math.floor(index / gridSize) * tileSize;
        if (
            parseInt(tile.style.left, 10) !== expectedX ||
            parseInt(tile.style.top, 10) !== expectedY
        ) {
            return false;
        }
        index++;
    }
    return true;
}

function declareVictory() {
    clearInterval(gameInterval);
    alert(`🎉 Congratulations! You solved the puzzle in ${secondsElapsed} seconds.`);
}

function shuffleTiles() {
    secondsElapsed = 0;
    timeDisplay.textContent = "Time: 0s";
    document.getElementById("moves").textContent = "Moves: 0";
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        secondsElapsed++;
        timeDisplay.textContent = `Time: ${secondsElapsed}s`;
    }, 1000);

    for (let i = 0; i < gridSize * gridSize * 10; i++) {
        const neighbors = getMovableTiles();
        const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
        swapTiles(randomTile);
    }
}

function getMovableTiles() {
    return [...tileElements].filter((tile) => canSlide(tile));
}

function changeGrid() {
    const newSize = prompt("Enter grid size (4, 6, 8, or 10):", gridSize);
    if ([4, 6, 8, 10].includes(parseInt(newSize))) {
        gridSize = parseInt(newSize);
        initializeBoard();
    } else {
        alert("Invalid size. Please enter 4, 6, 8, or 10.");
    }
}


function changeBackground(image){
    currentBackground = image;
    initializeBoard();
}

let isPaused = false;

function togglePause() {
    const pauseButton = document.getElementById("pauseButton");

    if(isPaused){
        //resume the game
        gameInterval = setInterval(() => {
            secondsElapsed++;
            timeDisplay.textContent = `time: ${secondsElapsed}`;
        }, 1000);
        pauseButton.textContent = "pause";
        isPaused = false;

        tileElements.forEach(tile => {
            tile.style.pointerEvents = "auto";

        });
    } else {
            clearInterval(gameInterval);
            pauseButton.textContent = "Resume";
            isPaused = true;

            tileElements.forEach(tile =>{
                tile.style.pointerEvents = "none";
            });
            
    }
}



