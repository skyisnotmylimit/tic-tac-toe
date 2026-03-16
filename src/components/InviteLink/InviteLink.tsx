import { Share2, Copy, Check } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import { buildInviteLink } from '../../utils/game';

interface InviteLinkProps {
  gameId: string;
  variant?: 'full' | 'compact';
}

export function InviteLink({ gameId, variant = 'full' }: InviteLinkProps) {
  const { copied, copyToClipboard } = useClipboard();
  const inviteLink = buildInviteLink(gameId);

  const handleCopy = () => copyToClipboard(inviteLink);

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
      >
        <Share2 size={14} /> {copied ? 'Link Copied!' : 'Invite another player'}
      </button>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-2 mb-6 overflow-hidden">
      <code className="text-xs text-indigo-600 dark:text-indigo-300 truncate flex-1">{inviteLink}</code>
      <button
        onClick={handleCopy}
        className="p-2 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      </button>
    </div>
  );
}
