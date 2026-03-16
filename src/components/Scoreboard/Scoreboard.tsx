import type { GameData, FirebaseUser } from '../../types/game';
import { Trophy } from 'lucide-react';

interface ScoreboardProps {
  gameData: GameData;
  user: FirebaseUser;
}

export function Scoreboard({ gameData, user }: ScoreboardProps) {
  const { players, scores, isXNext, winningLine, currentGameNum } = gameData;

  return (
    <div className="w-full max-w-xl flex flex-col items-center mt-4 mb-8">
      <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4 uppercase tracking-widest text-sm">
        <Trophy size={18} /> Best of 3 Set
      </div>

      <div className="grid grid-cols-3 w-full bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-700 mb-4">
        <PlayerColumn
          label="X"
          isYou={players.p1.id === user.uid}
          name={players.p1.name}
          score={scores.p1}
          isActive={isXNext && !winningLine}
          accentColor="indigo"
        />

        <div className="flex flex-col items-center justify-center border-x border-slate-700">
          <span className="text-xs text-slate-400 uppercase font-bold mb-1">Game</span>
          <span className="text-2xl font-black">{currentGameNum}/3</span>
          <span className="text-xs text-slate-500 mt-1">Draws: {scores.draws}</span>
        </div>

        <PlayerColumn
          label="O"
          isYou={players.p2.id === user.uid}
          name={players.p2.name}
          score={scores.p2}
          isActive={!isXNext && !winningLine}
          accentColor="rose"
        />
      </div>
    </div>
  );
}

interface PlayerColumnProps {
  label: string;
  isYou: boolean;
  name: string;
  score: number;
  isActive: boolean;
  accentColor: 'indigo' | 'rose';
}

function PlayerColumn({ label, isYou, name, score, isActive, accentColor }: PlayerColumnProps) {
  const ringClass = accentColor === 'indigo' ? 'ring-indigo-500' : 'ring-rose-500';
  const scoreClass = accentColor === 'indigo' ? 'text-indigo-400' : 'text-rose-400';

  return (
    <div
      className={`flex flex-col items-center p-2 rounded-xl transition-all ${
        isActive ? `bg-slate-700 ring-2 ${ringClass}` : ''
      }`}
    >
      <span className="text-xs text-slate-400 uppercase font-bold mb-1">
        {label} {isYou && '(You)'}
      </span>
      <span className="text-lg font-bold truncate w-full text-center">{name}</span>
      <span className={`text-3xl font-black ${scoreClass}`}>{score}</span>
    </div>
  );
}
