
export type CellValue = number | 'mine' | null;

export interface Cell {
  value: CellValue;
  isRevealed: boolean;
  isFlagged: boolean;
}

export interface GameState {
  board: Cell[][];
  gameOver: boolean;
  victory: boolean;
  mineCount: number;
  flaggedCount: number;
  timeElapsed: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_SETTINGS = {
  easy: { size: 9, mines: 10 },
  medium: { size: 16, mines: 40 },
  hard: { size: 22, mines: 99 },
};
