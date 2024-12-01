const puzzleContainer = document.getElementById('puzzle-container');
const shuffleButton = document.getElementById('shuffle-btn');

// Initialize variables
let emptyRow = 3;
let emptyCol = 3;

// Helper function to create a tile
function createTile(value, row, col) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.id = `tile_${row}_${col}`;
  tile.style.gridColumnStart = col + 1;
  tile.style.gridRowStart = row + 1;

  if (value !== 0) {
    tile.textContent = value;
    tile.addEventListener('click', () => moveTile(row, col));
  } else {
    tile.classList.add('hidden');
  }

  return tile;
}

// Helper function to render the puzzle
function renderPuzzle(puzzle) {
  puzzleContainer.innerHTML = '';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      puzzleContainer.appendChild(createTile(puzzle[row][col], row, col));
    }
  }
}

// Helper function to check if a tile can move
function canMove(row, col) {
  return (
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1)
  );
}

// Helper function to move a tile
function moveTile(row, col) {
  if (canMove(row, col)) {
      const tile = document.getElementById(`tile_${row}_${col}`);
      // Swap the positions in the puzzle
      puzzle[emptyRow][emptyCol] = puzzle[row][col];
      puzzle[row][col] = 0;

      // Update the empty tile position
      emptyRow = row;
      emptyCol = col;

      // Update tile position in the grid
      tile.style.gridColumnStart = emptyCol + 1;
      tile.style.gridRowStart = emptyRow + 1;

      if (isSolved()) {
          setTimeout(() => {
              alert('Congratulations! You solved the puzzle!');
          }, 300); // Match animation duration
      }
  }
}


// Helper function to generate a solvable puzzle
function generatePuzzle() {
  let numbers = [...Array(16).keys()];
  do {
    numbers = numbers.sort(() => Math.random() - 0.5);
  } while (!isSolvable(numbers));

  const puzzle = [];
  for (let i = 0; i < 4; i++) {
    puzzle.push(numbers.slice(i * 4, i * 4 + 4));
  }
  [emptyRow, emptyCol] = findEmptySpace(puzzle);
  return puzzle;
}

// Helper function to check solvability
function isSolvable(numbers) {
  let inversions = 0;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] > 0 && numbers[j] > 0 && numbers[i] > numbers[j]) {
        inversions++;
      }
    }
  }
  const emptyRow = Math.floor(numbers.indexOf(0) / 4);
  return (inversions + emptyRow) % 2 === 0;
}

// Helper function to check if the puzzle is solved
function isSolved(puzzle) {
  let count = 1;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (row === 3 && col === 3) return true;
      if (puzzle[row][col] !== count++) return false;
    }
  }
}

// Helper function to find the empty space
function findEmptySpace(puzzle) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (puzzle[row][col] === 0) return [row, col];
    }
  }
}

// Helper function to get the current puzzle state
function getPuzzle() {
  const puzzle = [];
  for (let row = 0; row < 4; row++) {
    puzzle.push([]);
    for (let col = 0; col < 4; col++) {
      const tile = document.getElementById(`tile_${row}_${col}`);
      puzzle[row].push(tile.classList.contains('hidden') ? 0 : parseInt(tile.textContent));
    }
  }
  return puzzle;
}

// Initialize game
let puzzle = generatePuzzle();
renderPuzzle(puzzle);

// Shuffle button
shuffleButton.addEventListener('click', () => {
  puzzle = generatePuzzle();
  renderPuzzle(puzzle);
});
