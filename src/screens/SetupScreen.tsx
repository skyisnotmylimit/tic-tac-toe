import { useState } from 'react';
import { Trophy, Play, Users } from 'lucide-react';

interface SetupScreenProps {
  hasGameId: boolean;
  onCreateGame: (name: string) => void;
  onJoinGame: (name: string) => void;
}

export function SetupScreen({ hasGameId, onCreateGame, onJoinGame }: SetupScreenProps) {
  const [localName, setLocalName] = useState('');

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
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-full">
            <Trophy size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">
          {hasGameId ? 'Join Game' : 'Tournament'}
        </h1>
        <p className="text-slate-400 text-center mb-8">
          {hasGameId
            ? 'Enter your name to join the match'
            : 'Create a room to play with a friend'}
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="player-name" className="block text-sm font-medium text-slate-300 mb-1">
              Your Name
            </label>
            <input
              id="player-name"
              type="text"
              maxLength={15}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
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
