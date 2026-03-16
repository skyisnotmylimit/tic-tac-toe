import { useState } from 'react';
import { Trophy, LogIn, UserPlus, AlertCircle } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<string | null>;
  onRegister: (email: string, password: string, displayName: string) => Promise<string | null>;
}

export function AuthScreen({ onLogin, onRegister }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    if (mode === 'register' && !displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    const result =
      mode === 'login'
        ? await onLogin(email, password)
        : await onRegister(email, password, displayName);

    setSubmitting(false);

    if (result) {
      setError(formatError(result));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-300 dark:border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-full">
            <Trophy size={40} className="text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">Tic Tac Toe</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
          {mode === 'login' ? 'Sign in to play' : 'Create your account'}
        </p>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="display-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                id="display-name"
                type="text"
                maxLength={15}
                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Player 1"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Min. 6 characters"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {submitting ? (
              'Please wait...'
            ) : mode === 'login' ? (
              <><LogIn size={20} /> Sign In</>
            ) : (
              <><UserPlus size={20} /> Create Account</>
            )}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={switchMode}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function formatError(message: string): string {
  if (message.includes('auth/email-already-in-use')) return 'This email is already registered.';
  if (message.includes('auth/invalid-email')) return 'Invalid email address.';
  if (message.includes('auth/weak-password')) return 'Password must be at least 6 characters.';
  if (message.includes('auth/user-not-found')) return 'No account found with this email.';
  if (message.includes('auth/wrong-password')) return 'Incorrect password.';
  if (message.includes('auth/invalid-credential')) return 'Invalid email or password.';
  if (message.includes('auth/too-many-requests')) return 'Too many attempts. Try again later.';
  return message;
}
