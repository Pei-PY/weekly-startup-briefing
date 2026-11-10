import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Company-name search box in the top banner. Controlled by App; while the query is
 * non-empty the main area shows SearchResults across every briefing.
 */
export default function GlobalSearch({ query, onChange, resultCount }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="relative w-full max-w-lg">
      <div className={`flex items-center gap-2 rounded px-2.5 py-1.5 border transition-colors ${
        hasQuery
          ? 'bg-[#EC4899]/10 border-[#EC4899]/50'
          : 'bg-[#1e293b] border-[#334155] focus-within:border-[#EC4899]/60'
      }`}>
        <Search size={12} className={hasQuery ? 'text-[#EC4899]' : 'text-slate-500'} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape') { onChange(''); inputRef.current?.blur(); } }}
          placeholder="Search company name across all briefings  (Ctrl+K)"
          className="flex-1 bg-transparent text-[12px] text-slate-200 placeholder:text-slate-600 outline-none"
          aria-label="Search company name across all briefings"
        />
        {hasQuery && (
          <>
            <span className="text-[10px] text-[#EC4899] font-mono tabular-nums flex-shrink-0">
              {resultCount} match{resultCount === 1 ? '' : 'es'}
            </span>
            <button
              onClick={() => { onChange(''); inputRef.current?.focus(); }}
              className="text-slate-500 hover:text-slate-300"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
