import { useEffect, useRef } from 'react';
import { useAuth } from './hooks/useAuth';
import { useGame } from './hooks/useGame';
import { useTheme } from './hooks/useTheme';
import { useSoundEffects } from './hooks/useSoundEffects';
import { SetupScreen, LobbyScreen, GameScreen, EndedScreen, AuthScreen } from './screens';

export default function App() {
  const { user, loading, login, register, signOut } = useAuth();
  const {
    gameId,
    gameData,
    gameScreen,
    createGame,
    joinGame,
    handleMove,
    sendReaction,
    endGame,
    leaveGame,
  } = useGame(user);
  const { theme, toggleTheme } = useTheme();
  const { playMove, toggleSound, soundEnabled } = useSoundEffects();
  const prevBoardRef = useRef(gameData?.board);

  // Sound effects on board changes
  useEffect(() => {
    if (!gameData) return;
    const boardChanged =
      prevBoardRef.current &&
      JSON.stringify(prevBoardRef.current) !== JSON.stringify(gameData.board);

    if (boardChanged) playMove();

    prevBoardRef.current = gameData.board;
  }, [gameData, playMove]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={login} onRegister={register} />;
  }

  if (gameScreen === 'setup') {
    return (
      <SetupScreen
        user={user}
        hasGameId={!!gameId}
        onCreateGame={createGame}
        onJoinGame={joinGame}
        onSignOut={signOut}
      />
    );
  }

  if (gameScreen === 'lobby' && gameData && gameId) {
    return <LobbyScreen gameId={gameId} />;
  }

  if (gameScreen === 'ended' && gameData) {
    return (
      <EndedScreen
        gameData={gameData}
        onLeave={leaveGame}
      />
    );
  }

  if (!gameData || !gameId) return null;

  return (
    <GameScreen
      gameData={gameData}
      user={user}
      gameId={gameId}
      onMove={handleMove}
      onSendReaction={sendReaction}
      onEndGame={endGame}
      theme={theme}
      onToggleTheme={toggleTheme}
      soundEnabled={soundEnabled.current}
      onToggleSound={toggleSound}
    />
  );
}