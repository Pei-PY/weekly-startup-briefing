import { useState, useMemo } from 'react';
import { ExternalLink, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { getVerticalColor, getStageColor, getInceptionColor } from '../lib/utils.js';

const STAGE_ORDER = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D'];

const COLS = [
  { key: 'rank',        label: '#',               width: 'w-8',  sticky: 'left-0',  sortable: true },
  { key: 'name',        label: 'Company',         width: 'w-44', sticky: 'left-8',  sortable: true },
  { key: 'vertical',    label: 'Vertical',        width: 'w-48',                    sortable: true },
  { key: 'totalRaised', label: 'Total Raised',    width: 'w-28',                    sortable: true },
  { key: 'stage',       label: 'Stage',           width: 'w-28',                    sortable: true },
  { key: 'founder',     label: 'Founder BG',      width: 'w-44',                    sortable: false },
  { key: 'alignment',   label: 'NVIDIA Fit',      width: 'w-32',                    sortable: true },
  { key: 'description', label: 'Description',     width: 'w-64',                    sortable: false },
  { key: 'article',     label: "Today's News",    width: 'w-64',                    sortable: false },
  { key: 'investors',   label: 'Investors',       width: 'w-52',                    sortable: false },
  { key: 'nvidia',      label: 'NVIDIA Relevancy',width: 'w-64',                    sortable: false },
  { key: 'inception',   label: 'Inception',       width: 'w-40',                    sortable: true },
  { key: 'website',     label: 'Website',         width: 'w-36',                    sortable: false },
];

export default function CompanyTable({ companies, onSelectCompany, selectedCompany }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedCompanies = useMemo(() => {
    if (!sortKey) return companies;
    return [...companies].sort((a, b) => {
      let av, bv;
      switch (sortKey) {
        case 'rank':        av = a.rank; bv = b.rank; break;
        case 'name':        av = a.name.toLowerCase(); bv = b.name.toLowerCase(); break;
        case 'vertical':    av = a.vertical.toLowerCase(); bv = b.vertical.toLowerCase(); break;
        case 'totalRaised': av = a.totalRaised.valueM ?? -1; bv = b.totalRaised.valueM ?? -1; break;
        case 'stage':       av = STAGE_ORDER.indexOf(a.stage); bv = STAGE_ORDER.indexOf(b.stage); break;
        case 'alignment':   av = a.nvidiaAlignment.level === 'strong' ? 0 : 1; bv = b.nvidiaAlignment.level === 'strong' ? 0 : 1; break;
        case 'inception':   av = a.inceptionStatus ?? ''; bv = b.inceptionStatus ?? ''; break;
        default: return 0;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [companies, sortKey, sortDir]);

  return (
    <div className="h-full overflow-auto bg-[#0f172a]">
      <table className="min-w-max w-full text-sm border-collapse">
        <thead className="sticky top-0 z-20 bg-[#1e293b] border-b border-[#334155]">
          <tr>
            {COLS.map(col => {
              const isActive = sortKey === col.key;
              const SortIcon = isActive ? (sortDir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
              return (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  className={[
                    'px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap',
                    col.width,
                    col.sticky ? `sticky ${col.sticky} bg-[#1e293b] z-30` : '',
                    col.sortable ? 'cursor-pointer select-none group/th' : '',
                    isActive ? 'text-[#76B900]' : 'text-slate-500',
                  ].join(' ')}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        size={10}
                        className={isActive ? 'text-[#76B900]' : 'text-slate-600 group-hover/th:text-slate-400'}
                      />
                    )}
                  </span>
                </th>
              );
            })}
            <th className="sticky right-0 bg-[#1e293b] z-30 w-10 px-2 border-l border-[#334155]" />
          </tr>
        </thead>
        <tbody>
          {sortedCompanies.map((company, i) => (
            <CompanyRow
              key={company.name}
              company={company}
              isEven={i % 2 === 0}
              isSelected={selectedCompany?.name === company.name}
              onClick={() => onSelectCompany(company)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompanyRow({ company, isEven, isSelected, onClick }) {
  const rowBg = isSelected
    ? 'bg-[#76B900]/10'
    : isEven
      ? 'bg-[#0f172a] hover:bg-[#1e293b]'
      : 'bg-[#0d1526] hover:bg-[#1e293b]';

  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer transition-colors border-b border-[#1e293b] ${rowBg} group`}
    >
      {/* Rank */}
      <td className="sticky left-0 px-3 py-3 text-slate-600 text-xs font-mono tabular-nums bg-inherit">
        {company.rank}
      </td>

      {/* Company Name */}
      <td className="sticky left-8 px-3 py-3 bg-inherit shadow-[1px_0_0_0_#1e293b]">
        <div className="font-semibold text-slate-100 leading-tight">{company.name}</div>
      </td>

      {/* Vertical */}
      <td className="px-3 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getVerticalColor(company.vertical)}`}>
          {company.vertical}
        </span>
      </td>

      {/* Total Raised */}
      <td className="px-3 py-3">
        <span className="font-mono text-xs text-slate-300">{company.totalRaised.display || '—'}</span>
      </td>

      {/* Stage */}
      <td className="px-3 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getStageColor(company.stage)}`}>
          {company.stage}
        </span>
      </td>

      {/* Founder Background */}
      <td className="px-3 py-3">
        {company.founderBackground?.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {company.founderBackground.map(tag => (
              <span
                key={tag}
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border leading-none ${
                  tag === 'Serial founder'
                    ? 'bg-amber-900/40 text-amber-300 border-amber-800/50'
                    : 'bg-sky-900/40 text-sky-300 border-sky-800/50'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-700">—</span>
        )}
      </td>

      {/* NVIDIA Alignment */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${company.nvidiaAlignment.level === 'strong' ? 'bg-[#76B900]' : 'bg-amber-500'}`} />
          <span className={`text-xs font-medium ${company.nvidiaAlignment.level === 'strong' ? 'text-[#76B900]' : 'text-amber-400'}`}>
            {company.nvidiaAlignment.level === 'strong' ? 'Strong' : 'Maybe'}
          </span>
        </div>
      </td>

      {/* Description (truncated) */}
      <td className="px-3 py-3 max-w-[16rem]">
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{company.description}</p>
      </td>

      {/* Article (truncated + link) */}
      <td className="px-3 py-3 max-w-[16rem]">
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{company.articleBody}</p>
        {company.articleUrl && (
          <a
            href={company.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-0.5 text-[10px] text-blue-400 hover:text-blue-300 mt-1"
          >
            <ExternalLink size={10} />
            Read article
          </a>
        )}
      </td>

      {/* Investors */}
      <td className="px-3 py-3 max-w-[13rem]">
        <div className="flex flex-wrap gap-1">
          {company.investors.slice(0, 2).map(inv => (
            <span key={inv} className="text-[11px] bg-[#1e293b] text-slate-400 rounded px-1.5 py-0.5 leading-none border border-[#334155]">
              {inv.length > 22 ? inv.slice(0, 22) + '…' : inv}
            </span>
          ))}
          {company.investors.length > 2 && (
            <span className="text-[11px] bg-[#1e293b] text-slate-600 rounded px-1.5 py-0.5 leading-none border border-[#334155]">
              +{company.investors.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* NVIDIA Relevancy (truncated) */}
      <td className="px-3 py-3 max-w-[16rem]">
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{company.nvidiaRelevancy}</p>
      </td>

      {/* Inception Status */}
      <td className="px-3 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getInceptionColor(company.inceptionStatus)}`}>
          {company.inceptionStatus || '—'}
        </span>
      </td>

      {/* Website */}
      <td className="px-3 py-3">
        {company.websiteUrl ? (
          <a
            href={company.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
          >
            <ExternalLink size={11} />
            {company.websiteDisplay || company.websiteUrl.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span className="text-xs text-slate-700">—</span>
        )}
      </td>

      {/* Open button */}
      <td className="sticky right-0 px-2 py-3 bg-inherit shadow-[-1px_0_0_0_#1e293b] border-l border-[#1e293b]">
        <button
          onClick={onClick}
          className="p-1 rounded hover:bg-[#334155] text-slate-700 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
          title="Open details"
        >
          <ChevronRight size={14} />
        </button>
      </td>
    </tr>
  );
}
