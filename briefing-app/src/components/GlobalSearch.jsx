import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { getVerticalColor } from '../lib/utils.js';

const MAX_RESULTS = 40;

function normalize(s) {
  return (s || '').toLowerCase();
}

/**
 * Search box in the top banner. Matches company name, vertical, stage, country,
 * investors and description across every briefing; picking a result switches the
 * briefing and opens that company.
 */
export default function GlobalSearch({ briefings, onPick }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  const index = useMemo(() => {
    const rows = [];
    for (const b of briefings) {
      for (const c of b.companies) {
        rows.push({
          briefing: b,
          company: c,
          haystack: normalize([
            c.name, c.vertical, c.stage, c.country?.name,
            (c.investors || []).join(' '), c.description, c.articleBody,
          ].join(' ')),
        });
      }
    }
    return rows;
  }, [briefings]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    const scored = [];
    for (const row of index) {
      if (!terms.every(t => row.haystack.includes(t))) continue;
      const name = normalize(row.company.name);
      let score = 0;
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 60;
      else if (name.includes(q)) score += 40;
      if (normalize(row.company.vertical).includes(q)) score += 20;
      if (normalize(row.company.country?.name).includes(q)) score += 10;
      scored.push({ ...row, score });
    }
    scored.sort((a, b) => b.score - a.score || b.briefing.date.localeCompare(a.briefing.date));
    return scored.slice(0, MAX_RESULTS);
  }, [index, query]);

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const pick = (row) => {
    onPick(row.briefing.date, row.company);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); return; }
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(results[active]); }
  };

  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 bg-[#1e293b] border border-[#334155] rounded px-2.5 py-1.5 focus-within:border-[#76B900]/60 transition-colors">
        <Search size={12} className="text-slate-500 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search all briefings — company, vertical, investor, country  (Ctrl+K)"
          className="flex-1 bg-transparent text-[12px] text-slate-200 placeholder:text-slate-600 outline-none"
          aria-label="Search all briefings"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="text-slate-500 hover:text-slate-300"
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 mt-1 z-50 bg-[#0f172a] border border-[#334155] rounded shadow-2xl max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-3 py-3 text-[12px] text-slate-500">No companies match “{query.trim()}”.</div>
          ) : (
            <>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-600 border-b border-[#1e293b]">
                {results.length}{results.length === MAX_RESULTS ? '+' : ''} result{results.length === 1 ? '' : 's'} across all briefings
              </div>
              {results.map((row, i) => {
                const c = row.company;
                const b = row.briefing;
                const isActive = i === active;
                return (
                  <button
                    key={`${b.date}-${c.rank}-${c.name}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(row)}
                    className={`w-full text-left px-3 py-2 flex items-start gap-3 border-b border-[#1e293b] last:border-b-0 transition-colors ${
                      isActive ? 'bg-[#1e293b]' : 'hover:bg-[#1e293b]/60'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-slate-100 truncate">{c.name}</span>
                        {c.country && (
                          <img
                            src={`https://flagcdn.com/w20/${c.country.code}.png`}
                            alt={c.country.name}
                            title={c.country.name}
                            className="h-2.5 w-auto rounded-[1px] opacity-80"
                          />
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${getVerticalColor(c.vertical)}`}>{c.vertical}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.description}</div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-[11px] text-slate-400">{b.label || b.date}</div>
                      <div className="text-[10px] text-slate-600 font-mono">{b.date} · #{c.rank}</div>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
