
import { Cell, CellValue, Difficulty, DIFFICULTY_SETTINGS } from '@/types/minesweeper';

export const createBoard = (difficulty: Difficulty): Cell[][] => {
  const { size, mines } = DIFFICULTY_SETTINGS[difficulty];
  const board: Cell[][] = Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => ({
      value: null,
      isRevealed: false,
      isFlagged: false,
    }))
  );

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (board[y][x].value !== 'mine') {
      board[y][x].value = 'mine';
      minesPlaced++;
    }
  }

  // Calculate numbers
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x].value !== 'mine') {
        const mineCount = countAdjacentMines(board, x, y);
        board[y][x].value = mineCount;
      }
    }
  }

  return board;
};

const countAdjacentMines = (board: Cell[][], x: number, y: number): number => {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ny = y + dy;
      const nx = x + dx;
      if (
        ny >= 0 && ny < board.length &&
        nx >= 0 && nx < board[0].length &&
        board[ny][nx].value === 'mine'
      ) {
        count++;
      }
    }
  }
  return count;
};

export const revealCell = (board: Cell[][], x: number, y: number): Cell[][] => {
  if (
    y < 0 || y >= board.length ||
    x < 0 || x >= board[0].length ||
    board[y][x].isRevealed ||
    board[y][x].isFlagged
  ) {
    return board;
  }

  board[y][x].isRevealed = true;

  if (board[y][x].value === 0) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        revealCell(board, x + dx, y + dy);
      }
    }
  }

  return board;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
