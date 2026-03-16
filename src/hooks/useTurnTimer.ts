import { useEffect, useState, useMemo } from 'react';
import { TURN_TIMER_SECONDS } from '../constants/game';

function calcRemaining(turnStartedAt: number): number {
  const elapsed = Math.floor((Date.now() - turnStartedAt) / 1000);
  return Math.max(0, TURN_TIMER_SECONDS - elapsed);
}

export function useTurnTimer(turnStartedAt: number | null, isPlaying: boolean) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!turnStartedAt || !isPlaying) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 500);

    return () => clearInterval(interval);
  }, [turnStartedAt, isPlaying]);

  const secondsLeft = useMemo(() => {
    // tick is used to trigger recalculation
    void tick;
    if (!turnStartedAt || !isPlaying) return TURN_TIMER_SECONDS;
    return calcRemaining(turnStartedAt);
  }, [turnStartedAt, isPlaying, tick]);

  return { secondsLeft, isExpired: secondsLeft === 0 };
}
