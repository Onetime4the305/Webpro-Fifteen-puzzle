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

	const tileSize = Math.floor(400/gridSize); //changed from `400 / gridsize 
	board.style.width = `${400}px`;
	board.style.height = `${400}px`;
	//board.style.width = `${tileSize * gridSize}px`;
	//board.style.height = `${tileSize * gridSize}px`;
	board.style.position = "relative";

	emptyX = (gridSize - 1) * tileSize; //line changed
	emptyY = (gridSize - 1) * tileSize; //line changed
	//emptyX = (gridSize - 1) * tileSize;
	//emptyY = (gridSize - 1) * tileSize;

	for (let i = 0; i < gridSize * gridSize - 1; i++) {
		const tile = document.createElement("div");
		tile.className = "tilePiece";
		tile.style.width = `${tileSize - 2}px`; // Subtract 2 for border
		tile.style.height = `${tileSize - 2}px`;
		tile.style.left = `${(i % gridSize) * tileSize}px`;
		tile.style.top = `${Math.floor(i / gridSize) * tileSize}px`;
		tile.style.backgroundImage = `url(${currentBackground})`;
		tile.style.backgroundSize = `${400}px ${400}px`;
		//tile.style.backgroundSize = `${tileSize * gridSize}px ${tileSize * gridSize}px`;
		//tile.style.backgroundPosition = `-${Math.round((i % gridSize) * tileSize)}px -${Math.round(Math.floor(i / gridSize) * tileSize)}px`;
		tile.style.backgroundPosition = `-${(i % gridSize) * tileSize}px -${Math.floor(i / gridSize) * tileSize}px`;
		tile.textContent = i + 1;
		tile.addEventListener("click", () => moveTile(tile));
		board.appendChild(tile);
	}

	tileElements = document.querySelectorAll(".tilePiece");
}

function moveTile(tile) {
	//check if the tile can move adjacent to the empty space
	if (canSlide(tile)) {
		swapTiles(tile);
		if (isComplete()) {
			declareVictory();
		}
	}
}

function canSlide(tile) {
	const tileX = parseInt(tile.style.left,10); //changed
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
	//let tempX = Math.round(parseFloat(tile.style.left,10));
	//let tempY = Math.round(parseFloat(tile.style.top,10));

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
			parseInt(tile.style.top,10) !== expectedY
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
	const validSizes= [4,6,8,10];
	if ([4, 6, 8, 10].includes(parseInt(newSize, 10))){
		gridSize = parseInt(newSize, 10);
		initializeBoard();
	} else {
		alert("Invalid size, please enter 4,6,8, 0r 10.");
	}
}

function changeBackground(image) {
	currentBackground = image;
	initializeBoard();
}

//adding confetti

function declareVictory() {
	clearInverval(gameInterval);

	showConfetti();

	const modal = document.getElementById("victoryModal");
	const modalMessage = document.getElementById("victoryMessage");
	modalMessage.textContent = `Congratulations! you solved the puzzle in ${secondsElapsed} seconds.`;
	modal.style.display = "block";
}

function showConfetti() {
	const confettiContainer = document.createElement("div");
	confettiContainer.className = "confetti-container";
	document.body.appendChild(confettiContainer);

	for(let i=0; i < 100; i++){
		const confetti = document.createElement("div");
		confetti.className = "confetti";
		confetti.style.left= `${Math.random() * 100}vw`;
		confetti.style.animationDelay = `${Math.random()}s`;
		confettiContainer.appendChild(confetti);
	}
	//remove confetti after animation

	setTimeOut(() => {
		confettiContainer.remove();
	}, 5000);
}

function restartGame(){
	const modal = document.getElementById("victoryModal");
	modal.style.display="none";
	initializeBoard();
	shuffleTiles();
}

