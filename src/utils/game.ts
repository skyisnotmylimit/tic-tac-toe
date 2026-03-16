import type { Board, CellValue, GameData, PlayerSymbol, Scores, WinnerInfo } from '../types/game';
import { BEST_OF, BOARD_SIZE, WINNING_COMBINATIONS, WINS_NEEDED } from '../constants/game';

export function checkWinner(board: Board): WinnerInfo | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { symbol: board[a] as PlayerSymbol, line: combo };
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board.every((cell: CellValue) => cell !== null);
}

export function createEmptyBoard(): Board {
  return Array<CellValue>(BOARD_SIZE).fill(null);
}

export function getMySymbol(gameData: GameData, uid: string): PlayerSymbol {
  return gameData.players.p1.id === uid ? 'X' : 'O';
}

export function isPlayerTurn(gameData: GameData, uid: string): boolean {
  const symbol = getMySymbol(gameData, uid);
  return (gameData.isXNext && symbol === 'X') || (!gameData.isXNext && symbol === 'O');
}

interface RoundResult {
  nextStatus: GameData['status'];
  setWinner: string | null;
  nextGameNum: number;
  newScores: Scores;
}

export function resolveRound(
  winnerInfo: WinnerInfo | null,
  gameData: GameData
): RoundResult {
  const newScores: Scores = { ...gameData.scores };

  if (winnerInfo?.symbol === 'X') newScores.p1 += 1;
  else if (winnerInfo?.symbol === 'O') newScores.p2 += 1;
  else newScores.draws += 1;

  let nextStatus: GameData['status'] = 'playing';
  let setWinner: string | null = null;
  let nextGameNum = gameData.currentGameNum;

  if (newScores.p1 >= WINS_NEEDED) {
    setWinner = gameData.players.p1.name;
    nextStatus = 'set-over';
  } else if (newScores.p2 >= WINS_NEEDED) {
    setWinner = gameData.players.p2.name;
    nextStatus = 'set-over';
  } else if (gameData.currentGameNum === BEST_OF) {
    if (newScores.p1 > newScores.p2) setWinner = gameData.players.p1.name;
    else if (newScores.p2 > newScores.p1) setWinner = gameData.players.p2.name;
    else setWinner = 'Tournament Draw';
    nextStatus = 'set-over';
  } else {
    nextGameNum += 1;
  }

  return { nextStatus, setWinner, nextGameNum, newScores };
}

export function buildInviteLink(gameId: string): string {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('game', gameId);
    return url.toString();
  } catch {
    return (
      window.location.href +
      (window.location.href.includes('?') ? '&' : '?') +
      'game=' +
      encodeURIComponent(gameId)
    );
  }
}
