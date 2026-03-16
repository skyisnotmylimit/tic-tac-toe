import type { MoveRecord } from '../../types/game';
import { CELL_LABELS } from '../../constants/game';
import { Clock } from 'lucide-react';

interface MoveHistoryProps {
  moves: MoveRecord[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  if (moves.length === 0) return null;

  const recentMoves = moves.slice(-5);

  return (
    <div className="w-full max-w-xs mt-4">
      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase font-bold tracking-wider">
        <Clock size={12} /> Move History
      </div>
      <div className="space-y-1">
        {recentMoves.map((move, i) => (
          <div
            key={`${move.cell}-${move.timestamp}`}
            className={`flex items-center gap-2 text-xs px-2 py-1 rounded-md ${
              i === recentMoves.length - 1
                ? 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-900 dark:text-white'
                : 'text-slate-500'
            }`}
          >
            <span
              className={`font-black text-sm ${
                move.player === 'X' ? 'text-indigo-400' : 'text-rose-400'
              }`}
            >
              {move.player}
            </span>
            <span className="text-slate-500">&rarr;</span>
            <span>{CELL_LABELS[move.cell]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
