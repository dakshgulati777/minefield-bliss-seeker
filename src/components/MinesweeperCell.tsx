
import React from 'react';
import { Cell } from '@/types/minesweeper';
import { Flag, Bomb } from 'lucide-react';

interface CellProps {
  cell: Cell;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

const NUMBER_COLORS = {
  1: 'text-blue-500',
  2: 'text-green-500',
  3: 'text-red-500',
  4: 'text-purple-500',
  5: 'text-yellow-600',
  6: 'text-cyan-600',
  7: 'text-gray-700',
  8: 'text-gray-500',
};

const MinesweeperCell: React.FC<CellProps> = ({ cell, onClick, onRightClick }) => {
  const getCellContent = () => {
    if (!cell.isRevealed && cell.isFlagged) {
      return <Flag className="w-4 h-4 text-red-500" />;
    }
    if (!cell.isRevealed) {
      return null;
    }
    if (cell.value === 'mine') {
      return <Bomb className="w-4 h-4" />;
    }
    if (cell.value === 0) {
      return null;
    }
    return (
      <span className={`font-bold ${NUMBER_COLORS[cell.value as keyof typeof NUMBER_COLORS]}`}>
        {cell.value}
      </span>
    );
  };

  return (
    <button
      onClick={onClick}
      onContextMenu={onRightClick}
      className={`
        w-8 h-8 flex items-center justify-center
        border border-gray-300 text-sm font-semibold
        transition-all duration-200
        ${!cell.isRevealed ? 'bg-gray-200 hover:bg-gray-300' : 'bg-white'}
        ${cell.value === 'mine' && cell.isRevealed ? 'bg-red-100' : ''}
      `}
    >
      {getCellContent()}
    </button>
  );
};

export default MinesweeperCell;
