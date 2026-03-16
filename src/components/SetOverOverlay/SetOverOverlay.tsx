import { Medal, RotateCcw } from 'lucide-react';

interface SetOverOverlayProps {
  winnerName: string;
  isCreator: boolean;
  onRestart: () => void;
}

export function SetOverOverlay({ winnerName, isCreator, onRestart }: SetOverOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="bg-yellow-500/20 p-4 rounded-full mb-4">
        <Medal size={48} className="text-yellow-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Set Winner!</h2>
      <p className="text-4xl font-black text-white mb-8">{winnerName}</p>
      {isCreator ? (
        <button
          onClick={onRestart}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <RotateCcw size={18} /> Restart Set
        </button>
      ) : (
        <p className="text-slate-400 italic">Waiting for host to restart...</p>
      )}
    </div>
  );
}
