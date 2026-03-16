export const WINNING_COMBINATIONS: readonly number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;

export const BOARD_SIZE = 9;

export const ROUND_TRANSITION_DELAY_MS = 1500;

export const TURN_TIMER_SECONDS = 15;

export const EMOJI_REACTIONS = ['👏', '😂', '😮', '🔥', '💀', '😎'] as const;

export const REACTION_DISPLAY_MS = 2500;

export const CELL_LABELS = ['top-left', 'top-center', 'top-right', 'mid-left', 'center', 'mid-right', 'bot-left', 'bot-center', 'bot-right'] as const;
