import { useCallback, useRef } from 'react';

const MOVE_FREQ = 600;
const WIN_FREQS = [523.25, 659.25, 783.99];
const TICK_FREQ = 880;

function playTone(frequency: number, duration: number, volume = 0.15, type: OscillatorType = 'sine') {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function useSoundEffects() {
  const enabled = useRef(true);

  const playMove = useCallback(() => {
    if (!enabled.current) return;
    playTone(MOVE_FREQ, 0.1, 0.12, 'square');
  }, []);

  const playWin = useCallback(() => {
    if (!enabled.current) return;
    WIN_FREQS.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 0.15), i * 150);
    });
  }, []);

  const playTick = useCallback(() => {
    if (!enabled.current) return;
    playTone(TICK_FREQ, 0.05, 0.08, 'square');
  }, []);

  const playLose = useCallback(() => {
    if (!enabled.current) return;
    playTone(311.13, 0.4, 0.12, 'sawtooth');
  }, []);

  const toggle = useCallback(() => {
    enabled.current = !enabled.current;
    return enabled.current;
  }, []);

  return { playMove, playWin, playTick, playLose, toggleSound: toggle, soundEnabled: enabled };
}
