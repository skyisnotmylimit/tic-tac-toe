import type { Board as BoardType } from '../../types/game';
import { Square } from './Square';

interface BoardProps {
  board: BoardType;
  winningLine: number[] | null;
  isMyTurn: boolean;
  onMove: (index: number) => void;
}

export function Board({ board, winningLine, isMyTurn, onMove }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-2xl border border-slate-300 dark:border-slate-700">
      {board.map((cell, i) => (
        <Square
          key={i}
          value={cell}
          isWinning={winningLine?.includes(i) ?? false}
          isClickable={isMyTurn}
          onClick={() => onMove(i)}
        />
      ))}
    </div>
  );
}
