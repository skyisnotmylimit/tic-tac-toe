import { useEffect, useState, useCallback, useRef } from 'react';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { appId, db } from '../lib/firebase';
import type { Board, FirebaseUser, GameData, GameScreen, MoveRecord } from '../types/game';
import { ROUND_TRANSITION_DELAY_MS } from '../constants/game';
import {
  checkWinner,
  createEmptyBoard,
  isDraw,
  getMySymbol,
  isPlayerTurn,
  resolveRound,
} from '../utils/game';

function getGameRef(gameId: string) {
  return doc(db, 'artifacts', appId, 'public', 'data', 'matches', gameId);
}

function generateGameId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getInitialGameId(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('game');
}

export function useGame(user: FirebaseUser | null) {
  const [gameId, setGameId] = useState<string | null>(getInitialGameId);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [gameScreen, setGameScreen] = useState<GameScreen>('setup');
  const gameDataRef = useRef<GameData | null>(null);

  // Keep ref in sync so callbacks always see latest data
  useEffect(() => {
    gameDataRef.current = gameData;
  }, [gameData]);

  // Listen to Firestore changes
  useEffect(() => {
    if (!user || !gameId) return;

    const gameRef = getGameRef(gameId);

    const unsubscribe = onSnapshot(
      gameRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as GameData;
          setGameData(data);

          if (data.status === 'playing') setGameScreen('playing');
          if (data.status === 'ended') setGameScreen('ended');
        }
      },
      (error) => {
        console.error('Snapshot error:', error);
      }
    );

    return () => unsubscribe();
  }, [user, gameId]);

  const createGame = useCallback(
    async (playerName: string) => {
      if (!playerName.trim() || !user) return;

      const newGameId = generateGameId();
      const gameRef = getGameRef(newGameId);

      const initialData: GameData = {
        players: {
          p1: { name: playerName, id: user.uid, symbol: 'X' },
          p2: { name: 'Waiting...', id: null, symbol: 'O' },
        },
        board: createEmptyBoard(),
        isXNext: true,
        scores: { p1: 0, p2: 0, draws: 0 },
        currentGameNum: 1,
        status: 'lobby',
        winningLine: null,
        setWinner: null,
        lastMoveBy: null,
        createdAt: Date.now(),
        turnStartedAt: null,
        moveHistory: [],
        lastReaction: null,
      };

      try {
        await setDoc(gameRef, initialData);
        setGameId(newGameId);
        setGameScreen('lobby');
      } catch (err) {
        console.error('Create game error:', err);
      }
    },
    [user]
  );

  const joinGame = useCallback(
    async (playerName: string) => {
      if (!playerName.trim() || !user || !gameId) return;

      const gameRef = getGameRef(gameId);
      const snap = await getDoc(gameRef);

      if (snap.exists()) {
        const data = snap.data() as GameData;
        if (data.players.p2.id && data.players.p2.id !== user.uid) {
          return; // Game is full
        }

        await updateDoc(gameRef, {
          'players.p2': { name: playerName, id: user.uid, symbol: 'O' },
          status: 'playing',
          turnStartedAt: Date.now(),
        });
        setGameScreen('playing');
      }
    },
    [user, gameId]
  );

  const handleMove = useCallback(
    async (index: number) => {
      const currentGame = gameDataRef.current;
      if (!currentGame || !user || !gameId) return;
      if (currentGame.board[index] || currentGame.winningLine || currentGame.status !== 'playing') return;

      const mySymbol = getMySymbol(currentGame, user.uid);
      if (!isPlayerTurn(currentGame, user.uid)) return;

      const newBoard: Board = [...currentGame.board];
      newBoard[index] = mySymbol;

      const moveRecord: MoveRecord = {
        player: mySymbol,
        cell: index,
        timestamp: Date.now(),
      };
      const updatedHistory = [...(currentGame.moveHistory || []), moveRecord];

      const winnerInfo = checkWinner(newBoard);
      const boardIsDraw = !winnerInfo && isDraw(newBoard);
      const gameRef = getGameRef(gameId);

      if (winnerInfo || boardIsDraw) {
        const { newScores, nextGameNum } = resolveRound(
          winnerInfo,
          currentGame
        );

        await updateDoc(gameRef, {
          board: newBoard,
          winningLine: winnerInfo?.line ?? null,
          scores: newScores,
          lastMoveBy: user.uid,
          moveHistory: updatedHistory,
          turnStartedAt: null,
        });

        setTimeout(async () => {
          const startsWithX = nextGameNum % 2 === 1;
          await updateDoc(gameRef, {
            board: createEmptyBoard(),
            winningLine: null,
            isXNext: startsWithX,
            currentGameNum: nextGameNum,
            moveHistory: [],
            turnStartedAt: Date.now(),
          });
        }, ROUND_TRANSITION_DELAY_MS);
      } else {
        await updateDoc(gameRef, {
          board: newBoard,
          isXNext: !currentGame.isXNext,
          lastMoveBy: user.uid,
          moveHistory: updatedHistory,
          turnStartedAt: Date.now(),
        });
      }
    },
    [user, gameId]
  );

  const sendReaction = useCallback(
    async (emoji: string) => {
      if (!gameId || !user) return;
      const gameRef = getGameRef(gameId);
      await updateDoc(gameRef, {
        lastReaction: {
          emoji,
          fromPlayer: user.uid,
          timestamp: Date.now(),
        },
      });
    },
    [gameId, user]
  );

  const endGame = useCallback(async () => {
    if (!gameId || !user) return;
    const gameRef = getGameRef(gameId);
    await updateDoc(gameRef, {
      status: 'ended',
      turnStartedAt: null,
    });
  }, [gameId, user]);

  const leaveGame = useCallback(() => {
    setGameId(null);
    setGameData(null);
    setGameScreen('setup');
  }, []);

  return {
    gameId,
    gameData,
    gameScreen,
    createGame,
    joinGame,
    handleMove,
    sendReaction,
    endGame,
    leaveGame,
  };
}
