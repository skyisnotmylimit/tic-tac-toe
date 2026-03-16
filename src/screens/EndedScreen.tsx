import { LogOut, Trophy } from 'lucide-react';
import type { GameData } from '../types/game';

interface EndedScreenProps {
  gameData: GameData;
  onLeave: () => void;
}

export function EndedScreen({ gameData, onLeave }: EndedScreenProps) {
  const { scores, players, currentGameNum } = gameData;
  const totalGames = currentGameNum - 1;

  const winner =
    scores.p1 > scores.p2
      ? players.p1.name
      : scores.p2 > scores.p1
        ? players.p2.name
        : null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white"
    >
      <div
        className="p-8 rounded-2xl shadow-2xl w-full max-w-md border text-center bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-red-600/20 p-4 rounded-full">
            <Trophy size={40} className="text-red-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Game Over</h2>
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          {totalGames} {totalGames === 1 ? 'game' : 'games'} played
        </p>

        <div
          className="rounded-xl p-4 mb-6 border bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
        >
          <h3 className="text-sm uppercase font-bold text-slate-500 dark:text-slate-400 mb-3">Final Score</h3>
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">X</span>
              <span className="font-bold">{players.p1.name}</span>
              <span className="text-2xl font-black text-indigo-400">{scores.p1}</span>
            </div>
            <span className="text-slate-500 text-lg font-bold">vs</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">O</span>
              <span className="font-bold">{players.p2.name}</span>
              <span className="text-2xl font-black text-rose-400">{scores.p2}</span>
            </div>
          </div>
          {winner && (
            <p className="mt-3 text-sm font-bold text-emerald-400">
              {winner} wins!
            </p>
          )}
          {!winner && (
            <p className="mt-3 text-sm font-bold text-yellow-400">It&apos;s a tie!</p>
          )}
        </div>

        <button
          onClick={onLeave}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <LogOut size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
}
