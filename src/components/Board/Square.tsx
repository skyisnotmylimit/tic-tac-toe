import type { CellValue } from '../../types/game';

interface SquareProps {
  value: CellValue;
  isWinning: boolean;
  isClickable: boolean;
  onClick: () => void;
}

export function Square({ value, isWinning, isClickable, onClick }: SquareProps) {
  const baseClasses =
    'w-20 h-20 sm:w-28 sm:h-28 rounded-lg flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-300';

  const interactiveClasses = !value && isClickable
    ? 'bg-slate-700 hover:bg-slate-600 cursor-pointer active:scale-90'
    : 'bg-slate-700 cursor-default opacity-90';

  const winningClasses = isWinning ? 'ring-4 ring-emerald-500 bg-emerald-900/40' : '';

  const symbolClasses = value === 'X' ? 'text-indigo-400' : 'text-rose-400';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${winningClasses} ${symbolClasses}`}
    >
      {value}
    </button>
  );
}
