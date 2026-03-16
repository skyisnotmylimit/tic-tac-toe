import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import type { Theme } from '../../types/game';

interface ToolbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Toolbar({ theme, onToggleTheme, soundEnabled, onToggleSound }: ToolbarProps) {
  return (
    <div className="fixed top-4 right-4 flex gap-2 z-30">
      <button
        onClick={onToggleTheme}
        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button
        onClick={onToggleSound}
        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
        title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </div>
  );
}
