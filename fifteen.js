document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const shuffleButton = document.getElementById('shuffleButton');
    const gridSize = 4;
    const totalTiles = gridSize * gridSize - 1;  // 15 tiles (0 is the empty space)

    let boardState = [];
    let emptyTileIndex = totalTiles;  // Index of the empty tile (initially at bottom-right)

    // Victory message container
    const victoryMessage = document.createElement('div');
    victoryMessage.classList.add('victory-message');
    victoryMessage.textContent = 'Congratulations, You Won!';
    document.body.appendChild(victoryMessage);

    // Hide victory message by default
    victoryMessage.style.display = 'none';

    // Function to initialize the board
    function initBoard() {
        boardState = Array.from({ length: gridSize * gridSize }, (_, i) => i);
        renderBoard();
    }

    // Function to render the board
    function renderBoard() {
        board.innerHTML = '';  // Clear current board
        for (let i = 0; i < totalTiles; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = i;

            if (boardState[i] === 0) {
                tile.classList.add('empty');
            } else {
                tile.textContent = boardState[i];
                tile.style.backgroundImage = 'url(background.jpg)';
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            }

            // Add hover effect for movable tiles
            if (canMoveTile(i)) {
                tile.classList.add('movablepiece');
            } else {
                tile.classList.remove('movablepiece');
            }

            tile.addEventListener('click', () => moveTile(i));
            board.appendChild(tile);
        }

        // Check for win condition after rendering the board
        checkWin();
    }

    // Function to shuffle the board
    function shuffleBoard() {
        let shuffleCount = 0;
        while (shuffleCount < 1000) {
            const neighbors = getNeighbors(emptyTileIndex);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            swapTiles(emptyTileIndex, randomNeighbor);
            shuffleCount++;
        }
        renderBoard();
    }

    // Function to swap tiles
    function swapTiles(index1, index2) {
        [boardState[index1], boardState[index2]] = [boardState[index2], boardState[index1]];
        emptyTileIndex = index2;
    }

    // Function to get the neighbors of the empty tile
    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        if (row > 0) neighbors.push(index - gridSize);  // Up
        if (row < gridSize - 1) neighbors.push(index + gridSize);  // Down
        if (col > 0) neighbors.push(index - 1);  // Left
        if (col < gridSize - 1) neighbors.push(index + 1);  // Right

        return neighbors;
    }

    // Function to check if a tile can be moved (is adjacent to the empty tile)
    function canMoveTile(index) {
        return getNeighbors(emptyTileIndex).includes(index);
    }

    // Function to handle tile movement
    function moveTile(index) {
        if (canMoveTile(index)) {
            swapTiles(index, emptyTileIndex);
            renderBoard();
        }
    }

    // Function to check if the puzzle has been solved
    function checkWin() {
        if (boardState.every((tile, index) => tile === index || (tile === 0 && index === totalTiles))) {
            victoryMessage.style.display = 'block';  // Show the victory message
        } else {
            victoryMessage.style.display = 'none';  // Hide the victory message if not won
        }
    }

    // Event listener for shuffle button
    shuffleButton.addEventListener('click', shuffleBoard);

    // Initialize the board on page load
    initBoard();
});
