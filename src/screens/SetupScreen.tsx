import { useState } from 'react';
import { Trophy, Play, Users, LogOut } from 'lucide-react';
import type { FirebaseUser } from '../types/game';

interface SetupScreenProps {
  user: FirebaseUser;
  hasGameId: boolean;
  onCreateGame: (name: string) => void;
  onJoinGame: (name: string) => void;
  onSignOut: () => void;
}

export function SetupScreen({ user, hasGameId, onCreateGame, onJoinGame, onSignOut }: SetupScreenProps) {
  const defaultName = user.displayName || user.email?.split('@')[0] || '';
  const [localName, setLocalName] = useState(defaultName);

  const handleSubmit = () => {
    if (!localName.trim()) return;
    if (hasGameId) {
      onJoinGame(localName);
    } else {
      onCreateGame(localName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-300 dark:border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-full">
            <Trophy size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">
          {hasGameId ? 'Join Game' : 'Tournament'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
          {hasGameId
            ? 'Enter your name to join the match'
            : 'Create a room to play with a friend'}
        </p>

        <div className="flex items-center justify-between bg-slate-200/50 dark:bg-slate-700/50 rounded-lg px-3 py-2 mb-4 border border-slate-300 dark:border-slate-600">
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</span>
          <button
            onClick={onSignOut}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors ml-2 shrink-0"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="player-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Your Name
            </label>
            <input
              id="player-name"
              type="text"
              maxLength={15}
              className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Player 1"
            />
          </div>

          {hasGameId ? (
            <button
              onClick={handleSubmit}
              disabled={!localName.trim()}
              className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Users size={20} /> Join Match
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!localName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play size={20} /> Create Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
