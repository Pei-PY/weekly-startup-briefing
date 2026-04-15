import { useState } from 'react';
import { Info, X, GitBranch } from 'lucide-react';
import { formatDate } from '../lib/utils.js';

const SCORING = [
  { signal: 'Investor quality', range: 'Unknown angels → Tier-1 VC or YC' },
  { signal: 'Founder signal',   range: 'First-time → Repeat + domain expert' },
  { signal: 'Market timing',    range: 'Generic AI claim → Clear inflection point' },
  { signal: 'Traction / proof', range: 'None → Hard ARR or enterprise contracts' },
  { signal: 'NVIDIA relevance', range: 'Maybe → Strong potential' },
];

const DISQUALIFIERS = [
  'Total raised > $200M',
  'Public company (post-IPO)',
  'Crypto / Web3-only (no AI component)',
  'Already a High Touch Inception member',
  '2+ Opportunities in Salesforce NVCRM',
  'Founded more than 10 years ago',
  '"Enterprise Customer" tag in Salesforce',
];

const SOURCES = [
  'TechCrunch', 'VentureBeat', 'Y Combinator / HN',
  'Crunchbase News', 'Fortune', 'Business Insider',
  'Axios', 'Product Hunt', 'LinkedIn', 'Reddit',
];

export default function Sidebar({ briefings, selectedDate, onSelectDate }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <aside className="w-56 flex-shrink-0 bg-[#111] flex flex-col h-full border-r border-[#222] relative">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#76B900]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#76B900]">
            NVIDIA Inception
          </span>
        </div>
        <div className="flex items-center justify-between mt-1 gap-2">
          <p className="text-white font-semibold text-sm leading-tight">Daily Startup Briefings</p>
          <button
            onClick={() => setShowInfo(v => !v)}
            className={`flex-shrink-0 p-0.5 rounded transition-colors ${
              showInfo ? 'text-[#76B900]' : 'text-[#4b5563] hover:text-slate-400'
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
          return (
            <button
              key={b.date}
              onClick={() => onSelectDate(b.date)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors group ${
                isActive
                  ? 'bg-[#1a1a1a] border-l-2 border-[#76B900]'
                  : 'border-l-2 border-transparent hover:bg-[#1a1a1a]/60'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-[#9ca3af] group-hover:text-[#d1d5db]'}`}>
                  {formatDate(b.date)}
                </p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">
                  {b.companies.length} companies
                </p>
              </div>
              <span className={`text-[11px] font-mono tabular-nums ${isActive ? 'text-[#76B900]' : 'text-[#4b5563]'}`}>
                {b.date.slice(5)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#222]">
        {(() => {
          const totalM = briefings.reduce((s, b) => s + b.companies.reduce((cs, c) => cs + (c.totalRaised?.valueM || 0), 0), 0);
          const fundingDisplay = totalM >= 1000 ? `$${(totalM / 1000).toFixed(1)}B` : `$${Math.round(totalM)}M`;
          return (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-lg font-bold text-[#76B900] leading-none">{briefings.length}</p>
                <p className="text-[10px] text-[#6b7280] mt-1 leading-tight">briefings</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#76B900] leading-none">{briefings.reduce((s, b) => s + b.companies.length, 0)}</p>
                <p className="text-[10px] text-[#6b7280] mt-1 leading-tight">companies</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#76B900] leading-none">{fundingDisplay}</p>
                <p className="text-[10px] text-[#6b7280] mt-1 leading-tight">total raised</p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Methodology panel — slides in to the right of sidebar */}
      {showInfo && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowInfo(false)}
          />
          {/* Panel */}
          <div className="absolute left-full top-0 z-50 w-80 h-full bg-[#161616] border-r border-[#2a2a2a] shadow-2xl overflow-y-auto flex flex-col">
            {/* GitHub link */}
            <a
              href="https://github.com/richling98/daily-startup-briefing"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0d0d0d] border-b border-[#262626] hover:bg-[#111] transition-colors group flex-shrink-0"
            >
              <GitBranch size={13} className="text-[#6b7280] group-hover:text-slate-300 transition-colors flex-shrink-0" />
              <span className="text-[11px] text-[#6b7280] group-hover:text-slate-300 transition-colors font-mono">
                GitHub Repo
              </span>
            </a>
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#262626] flex-shrink-0">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#76B900]">Methodology</p>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">How this briefing works</p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="p-1 rounded text-[#4b5563] hover:text-slate-300 hover:bg-[#222] transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#1e1e1e]">
              {/* Purpose */}
              <Section label="Purpose">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Surfaces the <strong className="text-slate-100">top 10 AI & tech startups</strong> each day
                  that are most relevant to <strong className="text-slate-100">NVIDIA's Inception program</strong> —
                  covering pre-seed through Series D, across 23 strategic verticals. Used by the Inception team
                  to identify and recruit high-potential companies into the program before they become widely known.
                </p>
              </Section>

              {/* Research */}
              <Section label="Daily Research">
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  Every briefing runs <strong className="text-slate-100">45+ targeted searches</strong> across
                  a strict 24-hour publication window — one query per Inception vertical, plus funding,
                  acquisition, and launch sweeps.
                </p>
                <div className="flex flex-wrap gap-1">
                  {SOURCES.map(s => (
                    <span key={s} className="text-[10px] bg-[#1e1e1e] border border-[#2a2a2a] text-[#94a3b8] rounded px-1.5 py-0.5">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>

              {/* Scoring */}
              <Section label="Scoring (max 15 pts)">
                <p className="text-[10px] text-[#64748b] mb-2">5 signals × 1–3 pts each. Higher NVIDIA relevance breaks ties.</p>
                <div className="space-y-2">
                  {SCORING.map(({ signal, range }) => (
                    <div key={signal}>
                      <p className="text-[11px] font-medium text-slate-200">{signal}</p>
                      <p className="text-[10px] text-[#64748b]">{range}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Salesforce checks */}
              <Section label="Salesforce Verification">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every candidate is checked against <strong className="text-slate-100">NVIDIA's CRM (NVCRM)</strong> before
                  inclusion. The briefing only surfaces companies that are genuinely new to NVIDIA's pipeline —
                  not ones already covered by field teams or Inception account managers.
                </p>
              </Section>

              {/* Disqualifiers */}
              <Section label="Disqualifiers">
                <p className="text-[10px] text-[#64748b] mb-2">A company is automatically excluded if any of the following apply:</p>
                <ul className="space-y-1.5">
                  {DISQUALIFIERS.map(d => (
                    <li key={d} className="flex items-baseline gap-1.5">
                      <span className="text-[#dc2626] flex-shrink-0">×</span>
                      <span className="text-[11px] text-slate-300">{d}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* NVIDIA Fit */}
              <Section label="NVIDIA Fit Rating">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#76B900] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-slate-200">Strong potential</p>
                      <p className="text-[10px] text-[#64748b]">GPU-native workloads, inference at scale, or confirmed NVIDIA tech fit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-slate-200">Maybe</p>
                      <p className="text-[10px] text-[#64748b]">Software-only, no meaningful compute, or built on non-NVIDIA silicon</p>
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
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#76B900] mb-2">{label}</p>
      {children}
    </div>
  );
}
