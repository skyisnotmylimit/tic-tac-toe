import { useEffect, useRef } from 'react';
import { useAuth } from './hooks/useAuth';
import { useGame } from './hooks/useGame';
import { useTheme } from './hooks/useTheme';
import { useSoundEffects } from './hooks/useSoundEffects';
import { SetupScreen, LobbyScreen, GameScreen } from './screens';

export default function App() {
  const user = useAuth();
  const {
    gameId,
    isCreator,
    gameData,
    gameScreen,
    createGame,
    joinGame,
    handleMove,
    resetSet,
    sendReaction,
  } = useGame(user);
  const { theme, toggleTheme } = useTheme();
  const { playMove, playWin, toggleSound, soundEnabled } = useSoundEffects();
  const prevBoardRef = useRef(gameData?.board);
  const prevStatusRef = useRef(gameData?.status);

  // Sound effects on board/status changes
  useEffect(() => {
    if (!gameData) return;
    const boardChanged =
      prevBoardRef.current &&
      JSON.stringify(prevBoardRef.current) !== JSON.stringify(gameData.board);
    const becameSetOver =
      prevStatusRef.current !== 'set-over' && gameData.status === 'set-over';

    if (becameSetOver) playWin();
    else if (boardChanged) playMove();

    prevBoardRef.current = gameData.board;
    prevStatusRef.current = gameData.status;
  }, [gameData, playMove, playWin]);

  const bgClass = theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-white';

  if (!user) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        Connecting...
      </div>
    );
  }

  if (gameScreen === 'setup') {
    return (
      <SetupScreen
        hasGameId={!!gameId}
        onCreateGame={createGame}
        onJoinGame={joinGame}
      />
    );
  }

  if (gameScreen === 'lobby' && gameData && gameId) {
    return <LobbyScreen gameId={gameId} />;
  }

  if (!gameData || !gameId) return null;

  return (
    <GameScreen
      gameData={gameData}
      user={user}
      gameId={gameId}
      isCreator={isCreator}
      onMove={handleMove}
      onRestart={resetSet}
      onSendReaction={sendReaction}
      theme={theme}
      onToggleTheme={toggleTheme}
      soundEnabled={soundEnabled.current}
      onToggleSound={toggleSound}
    />
  );
}