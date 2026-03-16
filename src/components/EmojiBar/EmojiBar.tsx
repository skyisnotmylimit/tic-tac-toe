import { useState, useEffect, useMemo } from 'react';
import { EMOJI_REACTIONS, REACTION_DISPLAY_MS } from '../../constants/game';
import type { EmojiReaction } from '../../types/game';

interface EmojiBarProps {
  onSend: (emoji: string) => void;
  lastReaction: EmojiReaction | null;
  currentUserId: string;
}

export function EmojiBar({ onSend, lastReaction, currentUserId }: EmojiBarProps) {
  const [hiddenTimestamp, setHiddenTimestamp] = useState<number | null>(null);

  // Auto-hide reaction after timeout
  useEffect(() => {
    if (!lastReaction) return;
    const timeout = setTimeout(() => setHiddenTimestamp(lastReaction.timestamp), REACTION_DISPLAY_MS);
    return () => clearTimeout(timeout);
  }, [lastReaction?.timestamp, lastReaction]);

  const visibleReaction = useMemo(() => {
    if (!lastReaction) return null;
    if (hiddenTimestamp === lastReaction.timestamp) return null;
    return lastReaction;
  }, [lastReaction, hiddenTimestamp]);

  const isFromOpponent = visibleReaction && visibleReaction.fromPlayer !== currentUserId;

  return (
    <div className="relative">
      {/* Floating reaction */}
      {visibleReaction && (
        <div
          className={`absolute -top-16 ${isFromOpponent ? 'left-0' : 'right-0'} 
            text-4xl animate-bounce pointer-events-none z-20`}
        >
          {visibleReaction.emoji}
        </div>
      )}

      {/* Emoji buttons */}
      <div className="flex gap-2 justify-center">
        {EMOJI_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSend(emoji)}
            className="text-xl hover:scale-125 active:scale-90 transition-transform p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            title={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
