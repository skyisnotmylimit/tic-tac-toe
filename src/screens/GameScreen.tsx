import type { GameData, FirebaseUser, Theme } from '../types/game';
import { isPlayerTurn } from '../utils/game';
import { Board } from '../components/Board';
import { Scoreboard } from '../components/Scoreboard';
import { SetOverOverlay } from '../components/SetOverOverlay';
import { InviteLink } from '../components/InviteLink';
import { TurnTimer } from '../components/TurnTimer';
import { EmojiBar } from '../components/EmojiBar';
import { Confetti } from '../components/Confetti';
import { MoveHistory } from '../components/MoveHistory';
import { Toolbar } from '../components/Toolbar';
import { useTurnTimer } from '../hooks/useTurnTimer';

interface GameScreenProps {
  gameData: GameData;
  user: FirebaseUser;
  gameId: string;
  isCreator: boolean;
  onMove: (index: number) => void;
  onRestart: () => void;
  onSendReaction: (emoji: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function GameScreen({
  gameData,
  user,
  gameId,
  isCreator,
  onMove,
  onRestart,
  onSendReaction,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}: GameScreenProps) {
  const isMyTurn = isPlayerTurn(gameData, user.uid);
  const isPlaying = gameData.status === 'playing' && !gameData.winningLine;
  const { secondsLeft, isExpired } = useTurnTimer(gameData.turnStartedAt, isPlaying);
  const isSetOver = gameData.status === 'set-over';

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-white'} flex flex-col items-center p-4 transition-colors duration-300`}>
      <Toolbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
      />

      <Confetti active={isSetOver} />

      <Scoreboard gameData={gameData} user={user} />

      <TurnTimer secondsLeft={secondsLeft} isMyTurn={isMyTurn} isActive={isPlaying} />

      <div className={`text-sm font-medium py-1 px-3 rounded-full border mb-6 ${
        theme === 'light'
          ? 'bg-white border-slate-300 text-slate-700'
          : 'bg-slate-800 border-slate-700 text-slate-300'
      }`}>
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

        {isSetOver && gameData.setWinner && (
          <SetOverOverlay
            winnerName={gameData.setWinner}
            isCreator={isCreator}
            onRestart={onRestart}
          />
        )}
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
    </div>
  );
}
