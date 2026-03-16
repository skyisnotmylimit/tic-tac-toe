import type { User } from 'firebase/auth';

export type PlayerSymbol = 'X' | 'O';

export type CellValue = PlayerSymbol | null;

export type Board = CellValue[];

export type GameStatus = 'lobby' | 'playing' | 'ended';

export type GameScreen = 'setup' | 'lobby' | 'playing' | 'ended';

export interface Player {
  name: string;
  id: string | null;
  symbol: PlayerSymbol;
}

export interface Scores {
  p1: number;
  p2: number;
  draws: number;
}

export interface MoveRecord {
  player: PlayerSymbol;
  cell: number;
  timestamp: number;
}

export interface EmojiReaction {
  emoji: string;
  fromPlayer: string;
  timestamp: number;
}

export interface GameData {
  players: {
    p1: Player;
    p2: Player;
  };
  board: Board;
  isXNext: boolean;
  scores: Scores;
  currentGameNum: number;
  status: GameStatus;
  winningLine: number[] | null;
  setWinner: string | null;
  lastMoveBy: string | null;
  createdAt: number;
  turnStartedAt: number | null;
  moveHistory: MoveRecord[];
  lastReaction: EmojiReaction | null;
}

export interface WinnerInfo {
  symbol: PlayerSymbol;
  line: number[];
}

export type Theme = 'dark' | 'light';

export type FirebaseUser = User;
