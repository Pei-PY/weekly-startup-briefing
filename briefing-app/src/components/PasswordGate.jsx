import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { fetchEncrypted, unlockFromSession, unlockWithPassword } from '../lib/crypto.js';

/**
 * Full-screen password prompt. Loads the encrypted briefings file, tries the key saved in
 * this tab's session, otherwise asks for the password and decrypts in the browser.
 */
export default function PasswordGate({ onUnlock }) {
  const [env, setEnv] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const e = await fetchEncrypted();
        if (cancelled) return;
        setEnv(e);
        const fromSession = await unlockFromSession(e);
        if (cancelled) return;
        if (fromSession) { onUnlock(fromSession); return; }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load briefings.');
      } finally {
        if (!cancelled) { setBusy(false); setTimeout(() => inputRef.current?.focus(), 0); }
      }
    })();
    return () => { cancelled = true; };
  }, [onUnlock]);

  const submit = async (e) => {
    e.preventDefault();
    if (!env || !password) return;
    setBusy(true);
    setError('');
    try {
      const payload = await unlockWithPassword(password, env);
      onUnlock(payload);
    } catch {
      setError('Incorrect password.');
      setPassword('');
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f172a] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-[#0a1628] border border-[#1e293b] rounded-lg p-6 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#76B900]" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#76B900]">Startup Briefings</span>
          <span className="text-[#475569] text-[11px]">·</span>
          <span className="text-[11px] text-slate-300 font-medium">South East Asia</span>
        </div>
        <h1 className="text-lg font-semibold text-slate-100 mt-3 flex items-center gap-2">
          <Lock size={16} className="text-slate-500" />
          Enter password
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          This site is private. The briefings are encrypted and are decrypted in your browser only.
        </p>

        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={busy}
          autoComplete="current-password"
          placeholder="Password"
          aria-label="Password"
          className="mt-4 w-full rounded px-3 py-2 text-sm bg-[#1e293b] border border-[#334155] text-slate-100 placeholder:text-slate-600 outline-none focus:border-[#76B900]/60 disabled:opacity-60"
        />

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 w-full rounded px-3 py-2 text-sm font-medium bg-[#76B900] text-[#0a1628] hover:bg-[#86c910] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {busy ? 'Working…' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
