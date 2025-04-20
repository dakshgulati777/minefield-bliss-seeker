
import React, { useState, useEffect } from 'react';
import { Cell, Difficulty, GameState, DIFFICULTY_SETTINGS } from '@/types/minesweeper';
import { createBoard, revealCell, formatTime } from '@/utils/minesweeperUtils';
import MinesweeperCell from './MinesweeperCell';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MinesweeperGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState>({
    board: createBoard('easy'),
    gameOver: false,
    victory: false,
    mineCount: DIFFICULTY_SETTINGS.easy.mines,
    flaggedCount: 0,
    timeElapsed: 0,
  });

  useEffect(() => {
    let timer: number;
    if (!gameState.gameOver && !gameState.victory) {
      timer = window.setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.gameOver, gameState.victory]);

  const handleCellClick = (x: number, y: number) => {
    if (gameState.gameOver || gameState.victory) return;

    const newBoard = [...gameState.board];
    const cell = newBoard[y][x];

    if (cell.isFlagged) return;

    if (cell.value === 'mine') {
      newBoard[y][x].isRevealed = true;
      setGameState(prev => ({ ...prev, board: newBoard, gameOver: true }));
      return;
    }

    const updatedBoard = revealCell(newBoard, x, y);
    const hasWon = checkVictory(updatedBoard);

    setGameState(prev => ({
      ...prev,
      board: updatedBoard,
      victory: hasWon,
    }));
  };

  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameState.gameOver || gameState.victory) return;

    const newBoard = [...gameState.board];
    const cell = newBoard[y][x];

    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      const flaggedCount = countFlags(newBoard);
      setGameState(prev => ({ ...prev, board: newBoard, flaggedCount }));
    }
  };

  const countFlags = (board: Cell[][]): number => {
    return board.flat().filter(cell => cell.isFlagged).length;
  };

  const checkVictory = (board: Cell[][]): boolean => {
    return board.every(row =>
      row.every(cell =>
        (cell.value === 'mine' && !cell.isRevealed) ||
        (cell.value !== 'mine' && cell.isRevealed)
      )
    );
  };

  const resetGame = (newDifficulty: Difficulty = difficulty) => {
    setGameState({
      board: createBoard(newDifficulty),
      gameOver: false,
      victory: false,
      mineCount: DIFFICULTY_SETTINGS[newDifficulty].mines,
      flaggedCount: 0,
      timeElapsed: 0,
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex items-center gap-4">
        <Select
          value={difficulty}
          onValueChange={(value: Difficulty) => {
            setDifficulty(value);
            resetGame(value);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => resetGame()}>New Game</Button>
      </div>

      <div className="flex justify-between w-full max-w-md mb-4">
        <div className="text-lg font-semibold">
          💣 {gameState.mineCount - gameState.flaggedCount}
        </div>
        <div className="text-lg font-semibold">
          ⏱️ {formatTime(gameState.timeElapsed)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="grid gap-px bg-gray-300"
          style={{
            gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty].size}, minmax(0, 1fr))`,
          }}
        >
          {gameState.board.map((row, y) =>
            row.map((cell, x) => (
              <MinesweeperCell
                key={`${x}-${y}`}
                cell={cell}
                onClick={() => handleCellClick(x, y)}
                onRightClick={(e) => handleRightClick(e, x, y)}
              />
            ))
          )}
        </div>
      </div>

      {(gameState.gameOver || gameState.victory) && (
        <div className={`text-xl font-bold ${gameState.victory ? 'text-green-500' : 'text-red-500'}`}>
          {gameState.victory ? '🎉 You Won!' : '💥 Game Over!'}
        </div>
      )}
    </div>
  );
};

export default MinesweeperGame;
