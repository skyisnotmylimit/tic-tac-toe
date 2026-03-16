import { TURN_TIMER_SECONDS } from '../../constants/game';

interface TurnTimerProps {
  secondsLeft: number;
  isMyTurn: boolean;
  isActive: boolean;
}

export function TurnTimer({ secondsLeft, isMyTurn, isActive }: TurnTimerProps) {
  if (!isActive) return null;

  const percentage = (secondsLeft / TURN_TIMER_SECONDS) * 100;
  const isUrgent = secondsLeft <= 5;

  return (
    <div className="w-full max-w-xs mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {isMyTurn ? 'Your time' : "Opponent's time"}
        </span>
        <span
          className={`text-sm font-bold tabular-nums ${
            isUrgent ? 'text-red-400 animate-pulse' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {secondsLeft}s
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-linear ${
            isUrgent ? 'bg-red-500' : secondsLeft <= 10 ? 'bg-yellow-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
