import { Share2 } from 'lucide-react';
import { InviteLink } from '../components/InviteLink';

interface LobbyScreenProps {
  gameId: string;
}

export function LobbyScreen({ gameId }: LobbyScreenProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 text-center">
        <div className="animate-bounce mb-6 inline-block">
          <Share2 size={48} className="text-indigo-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Invite your Friend</h2>
        <p className="text-slate-400 mb-6">
          Copy the link below and send it to your opponent to start the Best of 3 tournament.
        </p>

        <InviteLink gameId={gameId} />

        <div className="flex items-center justify-center gap-2 text-slate-500 animate-pulse">
          <div className="w-2 h-2 bg-slate-500 rounded-full" />
          Waiting for opponent...
        </div>
      </div>
    </div>
  );
}
