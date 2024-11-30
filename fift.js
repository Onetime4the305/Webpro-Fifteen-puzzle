"use strict";

let emptyX, emptyY;
let tileElements;
let timeDisplay;
let secondsElapsed = 0;
let gameInterval;
let gridSize = 4;
let currentBackground = "background1.jpg";

window.onload = function () {
	timeDisplay = document.getElementById("timer");
	initializeBoard();
};

function initializeBoard() {
	const board = document.getElementById("board");
	board.innerHTML = ""; // Clear the board for reinitialization

	const tileSize = 400 / gridSize;
	board.style.width = `${400}px`;
	board.style.height = `${400}px`;
	board.style.position = "relative";

	emptyX = (gridSize - 1) * tileSize;
	emptyY = (gridSize - 1) * tileSize;

	for (let i = 0; i < gridSize * gridSize - 1; i++) {
		const tile = document.createElement("div");
		tile.className = "tilePiece";
		tile.style.width = `${tileSize - 2}px`; // Subtract 2 for border
		tile.style.height = `${tileSize - 2}px`;
		tile.style.left = `${(i % gridSize) * tileSize}px`;
		tile.style.top = `${Math.floor(i / gridSize) * tileSize}px`;
		tile.style.backgroundImage = `url(${currentBackground})`;
		tile.style.backgroundSize = `${400}px ${400}px`;
		tile.style.backgroundPosition = `-${(i % gridSize) * tileSize}px -${Math.floor(i / gridSize) * tileSize}px`;
		tile.textContent = i + 1;
		tile.addEventListener("click", () => moveTile(tile));
		board.appendChild(tile);
	}

	tileElements = document.querySelectorAll(".tilePiece");
}

function moveTile(tile) {
	if (canSlide(tile)) {
		swapTiles(tile);
		if (isComplete()) {
			declareVictory();
		}
	}
}

function canSlide(tile) {
	let tileX = parseInt(tile.style.left);
	let tileY = parseInt(tile.style.top);
	return (
		(tileX === emptyX && Math.abs(tileY - emptyY) === 400 / gridSize) ||
		(tileY === emptyY && Math.abs(tileX - emptyX) === 400 / gridSize)
	);
}

function swapTiles(tile) {
	let tempX = tile.style.left;
	let tempY = tile.style.top;
	tile.style.left = emptyX + "px";
	tile.style.top = emptyY + "px";
	emptyX = parseInt(tempX);
	emptyY = parseInt(tempY);
}

function isComplete() {
	let index = 0;
	for (let tile of tileElements) {
		let expectedX = (index % gridSize) * (400 / gridSize);
		let expectedY = Math.floor(index / gridSize) * (400 / gridSize);
		if (
			parseInt(tile.style.left) !== expectedX ||
			parseInt(tile.style.top) !== expectedY
		) {
			return false;
		}
		index++;
	}
	return true;
}

function declareVictory() {
	clearInterval(gameInterval);
	alert(`Congratulations! You solved the puzzle in ${secondsElapsed} seconds.`);
}

function shuffleTiles() {
	secondsElapsed = 0;
	timeDisplay.textContent = "Time: 0s";
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
	const newSize = prompt(
		"Enter grid size (4, 6, 8, or 10):",
		gridSize
	);
	if ([4, 6, 8, 10].includes(parseInt(newSize))) {
		gridSize = parseInt(newSize);
		initializeBoard();
	} else {
		alert("Invalid size. Please enter 4, 6, 8, or 10.");
	}
}

function changeBackground(image) {
	currentBackground = image;
	initializeBoard();
}
