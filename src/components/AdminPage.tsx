import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Lock, KeyRound, LogOut } from 'lucide-react';
import { contentFiles } from '../data';

// Passcode-gated personal section. Renders the markdown at
// src/content/private/admin-prep.md only after the user enters the
// correct passcode. Unlock state persists for the session in
// sessionStorage so re-entry isn't required on tab refreshes.
//
// Security note: this is a static site, so the passcode and the
// document content both ship in the JS bundle. This gate keeps the
// content out of casual browsing — it is NOT a security control.
// Don't put genuinely sensitive material here.

const PASSCODE = '5713';
const SESSION_KEY = 'admin-unlocked';
const PRIVATE_DOC = './content/private/admin-prep.md';

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState<boolean>(() =>
    typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1'
  );
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const content = useMemo(
    () => contentFiles[PRIVATE_DOC] || '_Document not found._',
    [],
  );

  function attempt(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
      setError('');
      setInput('');
    } else {
      setError('Incorrect passcode');
      setInput('');
    }
  }

  function lock() {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  }

  // Auto-focus the passcode input when locked
  useEffect(() => {
    if (!unlocked) {
      const el = document.getElementById('admin-passcode-input') as HTMLInputElement | null;
      el?.focus();
    }
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-4">
              <Lock size={26} />
            </div>
            <h1 className="text-xl font-bold mb-1">Admin Area</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter the passcode to view this section.
            </p>
          </div>
          <form onSubmit={attempt} className="space-y-3">
            <div className="relative">
              <KeyRound
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="admin-passcode-input"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(''); }}
                placeholder="Passcode"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors text-base tracking-widest"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 md:px-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium">
            <Lock size={11} />
            Admin
          </span>
          <span className="text-slate-400">Personal interview prep</span>
        </div>
        <button
          onClick={lock}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Lock and clear session"
        >
          <LogOut size={13} />
          Lock
        </button>
      </div>
      <div className="prose-container">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
