import { useState } from 'react';
import { Info, X, GitBranch } from 'lucide-react';
import { formatDate } from '../lib/utils.js';

const SCORING = [
  { signal: 'Investor quality', range: 'Unknown angels → Tier-1 VC or YC' },
  { signal: 'Founder signal',   range: 'First-time → Repeat + domain expert' },
  { signal: 'Market timing',    range: 'Generic AI claim → Clear inflection point' },
  { signal: 'Traction / proof', range: 'None → Hard ARR or enterprise contracts' },
  { signal: 'Relevance',        range: 'Maybe → Strong potential' },
];

const DISQUALIFIERS = [
  'Total raised > $200M',
  'Public company (post-IPO)',
  'Crypto / Web3-only (no AI component)',
  'Already featured in an earlier briefing',
  'Founded more than 10 years ago',
];

const SOURCES = [
  'TechCrunch', 'VentureBeat', 'Y Combinator / HN',
  'Crunchbase News', 'Fortune', 'Business Insider',
  'Axios', 'Product Hunt', 'LinkedIn', 'Reddit',
];

export default function Sidebar({ briefings, selectedDate, onSelectDate }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0a1628] flex flex-col h-full border-r border-[#1e293b] relative">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EC4899]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#EC4899]">
            South East Asia
          </span>
        </div>
        <div className="flex items-center justify-between mt-1 gap-2">
          <p className="text-slate-100 font-semibold text-sm leading-tight">Weekly Startup Briefings</p>
          <button
            onClick={() => setShowInfo(v => !v)}
            className={`flex-shrink-0 p-0.5 rounded transition-colors ${
              showInfo ? 'text-[#EC4899]' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Methodology & purpose"
          >
            <Info size={13} />
          </button>
        </div>
      </div>

      {/* Date list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {briefings.map((b) => {
          const isActive = b.date === selectedDate;
          const isWeekly = /^Week of /.test(b.label ?? '');
          const title = isWeekly ? b.label.replace(/,\s*\d{4}$/, '').replace(/^Week of /, '') : formatDate(b.date);
          return (
            <button
              key={b.date}
              onClick={() => onSelectDate(b.date)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors group ${
                isActive
                  ? 'bg-[#1e293b] border-l-2 border-[#EC4899]'
                  : 'border-l-2 border-transparent hover:bg-[#1e293b]/60'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${isActive ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {title}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {b.companies.length} companies
                </p>
              </div>
              <span className={`text-[11px] font-mono tabular-nums ${isActive ? 'text-[#EC4899]' : 'text-slate-700'}`}>
                {b.date.slice(5)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#1e293b]">
        {(() => {
          const totalM = briefings.reduce((s, b) => s + b.companies.reduce((cs, c) => cs + (c.totalRaised?.valueM || 0), 0), 0);
          const fundingDisplay = totalM >= 1000 ? `$${(totalM / 1000).toFixed(1)}B` : `$${Math.round(totalM)}M`;
          return (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-lg font-bold text-[#EC4899] leading-none">{briefings.length}</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">briefings</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#EC4899] leading-none">{briefings.reduce((s, b) => s + b.companies.length, 0)}</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">companies</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#EC4899] leading-none">{fundingDisplay}</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">total raised</p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Methodology panel */}
      {showInfo && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowInfo(false)}
          />
          <div className="absolute left-full top-0 z-50 w-80 h-full bg-[#0a1628] border-r border-[#1e293b] shadow-xl overflow-y-auto flex flex-col">
            {/* GitHub link */}
            <a
              href="https://github.com/Pei-PY/weekly-startup-briefing"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors group flex-shrink-0"
            >
              <GitBranch size={13} className="text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
              <span className="text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors font-mono">
                GitHub Repo
              </span>
            </a>
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1e293b] flex-shrink-0">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#EC4899]">Methodology</p>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">How this briefing works</p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-[#1e293b] transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#1e293b]">
              {/* Purpose */}
              <Section label="Purpose">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Surfaces the <strong className="text-slate-200">top 10 AI & tech startups</strong> each day
                  with the strongest <strong className="text-slate-200">accelerated-computing potential</strong> —
                  covering pre-seed through Series D, across 23 strategic verticals. Used to identify
                  high-potential companies before they become widely known.
                </p>
              </Section>

              {/* Research */}
              <Section label="Weekly Research">
                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                  Every briefing runs <strong className="text-slate-200">45+ targeted searches</strong> across
                  a strict 24-hour publication window — one query per vertical, plus funding,
                  acquisition, and launch sweeps.
                </p>
                <div className="flex flex-wrap gap-1">
                  {SOURCES.map(s => (
                    <span key={s} className="text-[10px] bg-[#1e293b] border border-[#334155] text-slate-400 rounded px-1.5 py-0.5">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>

              {/* Scoring */}
              <Section label="Scoring (max 15 pts)">
                <p className="text-[10px] text-slate-500 mb-2">5 signals × 1–3 pts each. Higher relevance breaks ties.</p>
                <div className="space-y-2">
                  {SCORING.map(({ signal, range }) => (
                    <div key={signal}>
                      <p className="text-[11px] font-medium text-slate-300">{signal}</p>
                      <p className="text-[10px] text-slate-500">{range}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Duplicate check */}
              <Section label="Duplicate Check">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every candidate is checked against <strong className="text-slate-200">all earlier briefings</strong> by
                  company name, alias and website domain. A company appears in the series once — its first
                  appearance stays, and later repeats are removed before publishing.
                </p>
              </Section>

              {/* Disqualifiers */}
              <Section label="Disqualifiers">
                <p className="text-[10px] text-slate-500 mb-2">A company is automatically excluded if any of the following apply:</p>
                <ul className="space-y-1.5">
                  {DISQUALIFIERS.map(d => (
                    <li key={d} className="flex items-baseline gap-1.5">
                      <span className="text-red-500 flex-shrink-0">×</span>
                      <span className="text-[11px] text-slate-400">{d}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Fit */}
              <Section label="Fit Rating">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EC4899] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-slate-300">Strong potential</p>
                      <p className="text-[10px] text-slate-500">GPU-native workloads, inference at scale, or confirmed accelerated-computing fit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-slate-300">Maybe</p>
                      <p className="text-[10px] text-slate-500">Software-only, no meaningful compute, or built on CPU-only or custom silicon</p>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

function Section({ label, children }) {
  return (
    <div className="px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#EC4899] mb-2">{label}</p>
      {children}
    </div>
  );
}
