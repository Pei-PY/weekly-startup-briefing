import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState, useCallback } from 'react';
import { getVerticalColor, getStageColor } from '../lib/utils.js';
import { extractTech, getCaseStudy, TECH_CATALOG } from '../lib/tech-catalog.js';

const MIN_W = 400;
const DEFAULT_W = 680;
const clampMax = () => Math.max(MIN_W, window.innerWidth - 40);

// Reports that use the reordered drawer layout (Account Workload Research directly
// under the Relevancy paragraph; Library/SDK-by-use-case table at the bottom).
// April 15 and any future report keep the default order.
const NEW_LAYOUT_DATES = new Set([
  '2026-06-21', '2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26',
  '2026-06-27', '2026-06-28', '2026-07-06', '2026-07-07', '2026-07-08',
  '2026-07-09', '2026-07-10', '2026-07-11', '2026-07-12', '2026-07-13', '2026-07-14',
  '2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-19',
  '2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05',
  '2026-08-06', '2026-08-07', '2026-08-08', '2026-08-09', '2026-08-10',
  '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15',
]);

export default function CompanyDrawer({ company, briefingDate, onClose, onPrev, onNext }) {
  const [width, setWidth] = useState(() => Math.min(DEFAULT_W, clampMax()));

  // Suggested library/SDK rows derived from the relevancy text + vertical.
  const techItems = extractTech(company.relevancy, company.vertical);
  const newLayout = NEW_LAYOUT_DATES.has(briefingDate);

  const startResize = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = width;
    const onMove = (ev) => {
      // Drag left → wider; drag right → narrower.
      setWidth(Math.min(Math.max(MIN_W, startW - (ev.clientX - startX)), clampMax()));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.body.style.userSelect = 'none';
  }, [width]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Right-docked, resizable drawer */}
      <div
        className="fixed right-0 top-0 h-full bg-[#0a1628] shadow-2xl z-50 flex flex-col border-l border-[#1e293b] overflow-hidden"
        style={{ width }}
      >
        {/* Resize handle (left edge) — drag to widen/narrow */}
        <div
          onMouseDown={startResize}
          className="group absolute left-0 top-0 h-full w-2 cursor-ew-resize z-20"
          title="Drag to resize"
        >
          <div className="mx-auto h-full w-px bg-[#1e293b] transition-all group-hover:w-0.5 group-hover:bg-[#76B900]" />
        </div>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1e293b] flex-shrink-0 bg-[#0f172a]">
          <div className="flex items-center gap-2">
            {onPrev && (
              <button onClick={onPrev} className="p-1 rounded hover:bg-[#1e293b] text-slate-600 hover:text-slate-300 transition-colors" title="Previous company">
                <ChevronLeft size={16} />
              </button>
            )}
            {onNext && (
              <button onClick={onNext} className="p-1 rounded hover:bg-[#1e293b] text-slate-600 hover:text-slate-300 transition-colors" title="Next company">
                <ChevronRight size={16} />
              </button>
            )}
            <span className="text-xs text-slate-600 ml-1">
              Company {company.rank} of 10
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[#1e293b] text-slate-600 hover:text-slate-300 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Company title block */}
          <div className="px-6 py-5 border-b border-[#1e293b]">
            <h2 className="text-xl font-bold text-slate-100 leading-tight">{company.name}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge color={getVerticalColor(company.vertical)}>{company.vertical}</Badge>
              <Badge color={getStageColor(company.stage)}>{company.stage}</Badge>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Stat label="Total Raised" value={company.totalRaised.display || '—'} mono />
              <Stat
                label="Fit"
                value={company.fit.label}
                valueColor={company.fit.level === 'strong' ? 'text-[#76B900]' : 'text-amber-400'}
                dot={company.fit.level === 'strong' ? 'bg-[#76B900]' : 'bg-amber-500'}
              />
              <div className="flex flex-col gap-2">
                {company.websiteUrl && (
                  <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    <ExternalLink size={11} />
                    {company.websiteDisplay}
                  </a>
                )}
                {company.articleUrl && (
                  <a href={company.articleUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    <ExternalLink size={11} />
                    Source article
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="divide-y divide-[#1e293b]">
            <Section label="What They Do">
              <p className="text-sm text-slate-400 leading-relaxed">{company.description}</p>
            </Section>

            <Section label="News">
              <p className="text-sm text-slate-400 leading-relaxed">{company.articleBody}</p>
              {company.articleUrl && (
                <a href={company.articleUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 font-medium transition-colors">
                  <ExternalLink size={11} />
                  Read full article
                </a>
              )}
            </Section>

            {company.founderBackground?.length > 0 && (
              <Section label="Founder Background">
                <div className="flex flex-wrap gap-1.5">
                  {company.founderBackground.map(tag => (
                    <span
                      key={tag}
                      className={`text-xs font-semibold px-2 py-1 rounded border ${
                        tag === 'Serial founder'
                          ? 'bg-amber-900/40 text-amber-300 border-amber-800/50'
                          : 'bg-sky-900/40 text-sky-300 border-sky-800/50'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <Section label="Investors">
              <div className="flex flex-wrap gap-1.5">
                {company.investors.map(inv => (
                  <span key={inv} className="text-xs bg-[#1e293b] text-slate-400 border border-[#334155] rounded-md px-2 py-1 font-medium">
                    {inv}
                  </span>
                ))}
              </div>
            </Section>

            {newLayout ? (
              <>
                {/* Reordered layout: Account Workload Research under the relevancy paragraph; use-case/SDK table at the bottom */}
                <Section label="Relevancy">
                  <div className="flex items-start gap-2">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${company.fit.level === 'strong' ? 'bg-[#76B900]' : 'bg-amber-500'}`} />
                    <p className="text-sm text-slate-400 leading-relaxed">{company.relevancy}</p>
                  </div>
                </Section>

                {company.workloadResearch?.length > 0 && (
                  <Section label="Account Workload Acceleration Research">
                    <WorkloadResearchTable rows={company.workloadResearch} />
                  </Section>
                )}

                {company.caseStudy && (
                  <Section label="Case Study">
                    <div className="rounded border border-[#1e293b] bg-[#0f172a] px-3.5 py-3">
                      <MarkdownText text={company.caseStudy} />
                    </div>
                  </Section>
                )}

                {techItems.length > 0 && (
                  <Section label="Library / SDK by Use-Case">
                    <TechTable relevancyText={company.relevancy} vertical={company.vertical} />
                  </Section>
                )}
              </>
            ) : (
              <>
                {/* Default layout (April 15 + future reports) */}
                <Section label="Relevancy">
                  <div className="flex items-start gap-2 mb-4">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${company.fit.level === 'strong' ? 'bg-[#76B900]' : 'bg-amber-500'}`} />
                    <p className="text-sm text-slate-400 leading-relaxed">{company.relevancy}</p>
                  </div>
                  <TechTable relevancyText={company.relevancy} vertical={company.vertical} />
                </Section>

                {company.caseStudy && (
                  <Section label="Case Study">
                    <div className="rounded border border-[#1e293b] bg-[#0f172a] px-3.5 py-3">
                      <MarkdownText text={company.caseStudy} />
                    </div>
                  </Section>
                )}

                {company.workloadResearch?.length > 0 && (
                  <Section label="Account Workload Acceleration Research">
                    <WorkloadResearchTable rows={company.workloadResearch} />
                  </Section>
                )}

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Badge({ children, color }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${color}`}>
      {children}
    </span>
  );
}

function Stat({ label, value, mono, valueColor, dot }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1">{label}</p>
      <div className="flex items-center gap-1">
        {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
        <p className={`text-sm font-semibold ${mono ? 'font-mono' : ''} ${valueColor || 'text-slate-200'}`}>{value}</p>
      </div>
    </div>
  );
}

function TechTable({ relevancyText, vertical }) {
  const items = extractTech(relevancyText, vertical);
  if (!items.length) return null;

  return (
    <div className="overflow-x-auto rounded border border-[#1e293b]">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="bg-[#0a1628] border-b border-[#1e293b]">
            {['Use-case', 'Library / SDK', 'Expected Outcome', 'Case Study'].map(h => (
              <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-[#76B900] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(({ key, source }, i) => {
            const t = TECH_CATALOG[key];
            const cs = getCaseStudy(key, vertical);
            const isSuggested = source === 'vertical';
            return (
              <tr key={key} className={`border-b border-[#1e293b] ${i % 2 === 0 ? 'bg-[#0f172a]' : 'bg-[#0d1526]'}`}>
                <td className="px-3 py-2.5 align-top leading-snug">
                  <span className={isSuggested ? 'text-slate-500' : 'text-slate-300 font-medium'}>{t.useCase}</span>
                  {isSuggested && (
                    <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600 bg-[#1e293b] px-1 py-0.5 rounded">
                      suggested
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 align-top">
                  <span className={`font-semibold ${isSuggested ? 'text-[#76B900]/60' : 'text-[#76B900]'}`}>{key}</span>
                  <span className="text-slate-500 block leading-snug mt-0.5">{t.sdk}</span>
                </td>
                <td className="px-3 py-2.5 text-slate-400 align-top leading-snug">{t.outcome}</td>
                <td className="px-3 py-2.5 align-top">
                  <a
                    href={cs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                  >
                    <ExternalLink size={10} />
                    {cs.label}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="px-3 py-1.5 text-[9px] text-slate-700 border-t border-[#1e293b] bg-[#0a1628]">
        Rows marked "suggested" are inferred from the {vertical} vertical — confirm applicability with the company.
      </p>
    </div>
  );
}

const WORKLOAD_COLS = ['Workload', 'Budget', 'Acceleration', 'Nodes', 'Libraries / Tools', 'Partner'];
const ACCEL_COLOR = t => {
  const u = t?.toLowerCase() ?? '';
  if (u.includes('gpu')) return 'text-[#76B900]';
  if (u.includes('cpu')) return 'text-amber-400';
  return 'text-slate-400';
};

function WorkloadResearchTable({ rows }) {
  const headers = Object.keys(rows[0] ?? {});
  return (
    <div className="overflow-x-auto rounded border border-[#1e293b]">
      <table className="w-full text-[11px] border-collapse" style={{ minWidth: headers.includes('Expected Outcomes') ? '920px' : headers.includes('Case Study') ? '780px' : '640px' }}>
        <thead>
          <tr className="bg-[#0a1628] border-b border-[#1e293b]">
            {headers.map(h => (
              <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-[#1e293b] ${i % 2 === 0 ? 'bg-[#0f172a]' : 'bg-[#0d1526]'}`}>
              {headers.map(h => (
                <td key={h} className={`px-3 py-2.5 align-top leading-snug ${h === 'Acceleration' ? ACCEL_COLOR(row[h]) : h === 'Workload' ? 'text-slate-300 font-medium' : 'text-slate-400'}`}>
                  {typeof row[h] === 'string' && row[h].includes('](') ? <MarkdownText text={row[h]} className="" /> : row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3 py-1.5 text-[9px] text-slate-700 border-t border-[#1e293b] bg-[#0a1628]">
        Identifies high-budget CPU-bound workloads not yet GPU-accelerated — acceleration opportunity analysis for partner engagement.
      </p>
    </div>
  );
}

// Renders a markdown snippet supporting **bold** and [text](url) links
function MarkdownText({ text, className = 'text-sm text-slate-400 leading-relaxed' }) {
  const parts = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0, m, i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={i++}>{text.slice(last, m.index)}</span>);
    if (m[1]) {
      parts.push(
        <a key={i++} href={m[2]} target="_blank" rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          {m[1]}
        </a>
      );
    } else {
      parts.push(<strong key={i++} className="text-slate-200 font-semibold">{m[3]}</strong>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(<span key={i++}>{text.slice(last)}</span>);
  return <p className={className}>{parts}</p>;
}

function Section({ label, children }) {
  return (
    <div className="px-6 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#76B900] mb-2">{label}</p>
      {children}
    </div>
  );
}
