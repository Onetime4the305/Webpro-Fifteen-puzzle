document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('puzzle-board');
    const shuffleButton = document.getElementById('shuffle-btn');
    const gameContainer = document.getElementById('game-container');
    let puzzle = [];
    let blankPosition = 15; // the position of the empty space, initially at the bottom-right corner

    // Helper function to create the initial game board
    function createBoard() {
        puzzle = [];
        board.innerHTML = '';
        
        // Create the 15 tiles
        for (let i = 0; i < 15; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = i;
            tile.innerText = i + 1;

            // Set the background position for the image slice
            tile.style.backgroundPosition = `-${(i % 4) * 100}px -${Math.floor(i / 4) * 100}px`;

            // Add event listener for tile movement
            tile.addEventListener('click', () => handleTileClick(i));

            // Add hover effects
            tile.addEventListener('mouseover', () => handleHover(i));
            tile.addEventListener('mouseout', () => handleMouseOut(i));

            puzzle.push(tile);
            board.appendChild(tile);
        }

        // Add the empty space at the end
        const emptyTile = document.createElement('div');
        emptyTile.classList.add('tile');
        emptyTile.classList.add('empty');
        emptyTile.dataset.index = 15;
        board.appendChild(emptyTile);
    }

    // Find the row/column of a given tile index
    function getTilePosition(index) {
        return {
            row: Math.floor(index / 4),
            col: index % 4,
        };
    }

    // Move a tile into the blank space
    function moveTile(clickedIndex) {
        const clickedTile = puzzle[clickedIndex];
        const emptyTile = puzzle[blankPosition];
        
        // Swap the content of the tiles
        const temp = clickedTile.innerText;
        clickedTile.innerText = '';
        emptyTile.innerText = temp;

        // Swap the background positions
        const tempBg = clickedTile.style.backgroundPosition;
        clickedTile.style.backgroundPosition = emptyTile.style.backgroundPosition;
        emptyTile.style.backgroundPosition = tempBg;

        // Update the blank position
        blankPosition = clickedIndex;
    }

    // Shuffle the puzzle, including the background image of each tile
    function shuffleBoard() {
        let shuffled = [...Array(16).keys()]; // Create an array of tile indices 0-15
        shuffled = shuffled.filter(num => num !== 15); // Exclude the blank space initially
        
        // Shuffle the tiles and their background positions
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Random index between 0 and i
            // Swap the tiles and their background positions
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Update the board based on the shuffled array
        for (let i = 0; i < 15; i++) {
            puzzle[i].innerText = shuffled[i] + 1;
            puzzle[i].style.backgroundPosition = `-${(shuffled[i] % 4) * 100}px -${Math.floor(shuffled[i] / 4) * 100}px`;
        }

        // Ensure the empty tile is in the correct position (at index 15)
        puzzle[15].innerText = '';
        puzzle[15].style.backgroundPosition = 'none'; // Blank tile has no background image
    }

    // Check if the game has been won (tiles are in the correct order)
    function checkGameWon() {
        for (let i = 0; i < 15; i++) {
            if (puzzle[i].innerText !== (i + 1).toString()) {
                return;
            }
        }
        
        // Display winning message
        displayWinMessage();
    }

    // Display a win message
    function displayWinMessage() {
        const winMessage = document.createElement('div');
        winMessage.id = 'win-message';
        winMessage.innerHTML = '<h2>Congratulations! You solved the puzzle!</h2>';
        winMessage.style.backgroundColor = '#28a745';
        winMessage.style.color = 'white';
        winMessage.style.fontSize = '24px';
        winMessage.style.padding = '20px';
        winMessage.style.margin = '20px auto';
        winMessage.style.width = '300px';
        winMessage.style.textAlign = 'center';
        winMessage.style.borderRadius = '10px';

        gameContainer.appendChild(winMessage);

        // Optionally, add a win image or animation
        const winImage = document.createElement('img');
        winImage.src = 'win_image.jpg';  // Add the path to your win image
        winImage.alt = 'You Win!';
        winImage.style.width = '200px';
        winImage.style.display = 'block';
        winImage.style.margin = '10px auto';

        winMessage.appendChild(winImage);
    }

    // Handle tile click event (move if adjacent to blank space)
    function handleTileClick(clickedIndex) {
        const clickedTile = puzzle[clickedIndex];
        const blankTile = puzzle[blankPosition];
        const clickedPosition = getTilePosition(clickedIndex);
        const blankPositionRowCol = getTilePosition(blankPosition);

        // Check if the clicked tile is in the same row or column as the blank space
        if (clickedPosition.row === blankPositionRowCol.row) {
            // Slide all tiles in the row between the clicked tile and blank space
            const min = Math.min(clickedIndex, blankPosition);
            const max = Math.max(clickedIndex, blankPosition);
            for (let i = min + 1; i < max; i++) {
                moveTile(i);
            }
        } else if (clickedPosition.col === blankPositionRowCol.col) {
            // Slide all tiles in the column between the clicked tile and blank space
            const min = Math.min(clickedIndex, blankPosition);
            const max = Math.max(clickedIndex, blankPosition);
            for (let i = min + 1; i < max; i += 4) {
                moveTile(i);
            }
        } else {
            // If it's not in the same row or column, do nothing
            return;
        }

        // Move the clicked tile into the blank space
        moveTile(clickedIndex);

        // Check if the game is won
        checkGameWon();
    }

    // Handle hover effect for movable tiles
    function handleHover(index) {
        const tile = puzzle[index];
        const clickedPosition = getTilePosition(index);
        const blankPositionRowCol = getTilePosition(blankPosition);

        // Check if the tile is adjacent to the blank space
        if (
            (clickedPosition.row === blankPositionRowCol.row && Math.abs(clickedPosition.col - blankPositionRowCol.col) === 1) ||
            (clickedPosition.col === blankPositionRowCol.col && Math.abs(clickedPosition.row - blankPositionRowCol.row) === 1)
        ) {
            // Add hover effect for movable tiles
            tile.classList.add('movablepiece');
        }
    }

    // Revert hover effect when mouse leaves the tile
    function handleMouseOut(index) {
        const tile = puzzle[index];
        tile.classList.remove('movablepiece');
    }

    // Initialize the board and shuffle
    createBoard();

    shuffleButton.addEventListener('click', shuffleBoard);
});
