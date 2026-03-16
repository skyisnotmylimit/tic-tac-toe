import type { GameData, FirebaseUser, Theme } from '../types/game';
import { useState } from 'react';
import { isPlayerTurn } from '../utils/game';
import { Board } from '../components/Board';
import { Scoreboard } from '../components/Scoreboard';
import { InviteLink } from '../components/InviteLink';
import { TurnTimer } from '../components/TurnTimer';
import { EmojiBar } from '../components/EmojiBar';
import { MoveHistory } from '../components/MoveHistory';
import { Toolbar } from '../components/Toolbar';
import { useTurnTimer } from '../hooks/useTurnTimer';
import { LogOut, X } from 'lucide-react';

interface GameScreenProps {
  gameData: GameData;
  user: FirebaseUser;
  gameId: string;
  onMove: (index: number) => void;
  onSendReaction: (emoji: string) => void;
  onEndGame: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function GameScreen({
  gameData,
  user,
  gameId,
  onMove,
  onSendReaction,
  onEndGame,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}: GameScreenProps) {
  const isMyTurn = isPlayerTurn(gameData, user.uid);
  const isPlaying = gameData.status === 'playing' && !gameData.winningLine;
  const { secondsLeft, isExpired } = useTurnTimer(gameData.turnStartedAt, isPlaying);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col items-center p-4 transition-colors duration-300">
      <Toolbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
      />

      <Scoreboard gameData={gameData} user={user} />

      <TurnTimer secondsLeft={secondsLeft} isMyTurn={isMyTurn} isActive={isPlaying} />

      <div className="text-sm font-medium py-1 px-3 rounded-full border mb-6 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
        {isExpired && isMyTurn
          ? "Time's up!"
          : isMyTurn
            ? "Your Turn!"
            : "Opponent's Turn..."}
      </div>

      <div className="relative group">
        <Board
          board={gameData.board}
          winningLine={gameData.winningLine}
          isMyTurn={isMyTurn && !isExpired}
          onMove={onMove}
        />
      </div>

      <div className="mt-6">
        <EmojiBar
          onSend={onSendReaction}
          lastReaction={gameData.lastReaction}
          currentUserId={user.uid}
        />
      </div>

      <MoveHistory moves={gameData.moveHistory ?? []} />

      <div className="mt-6 flex flex-col items-center gap-2">
        <InviteLink gameId={gameId} variant="compact" />
      </div>

      {/* End Game */}
      <div className="mt-4">
        {showEndConfirm ? (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700`}>
            <span className="text-sm text-slate-400">End game for both players?</span>
            <button
              onClick={() => { onEndGame(); setShowEndConfirm(false); }}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-md transition-colors"
            >
              Yes, End
            </button>
            <button
              onClick={() => setShowEndConfirm(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowEndConfirm(true)}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} /> End Game
          </button>
        )}
      </div>
    </div>
  );
}
