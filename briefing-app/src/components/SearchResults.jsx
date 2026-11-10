import { X } from 'lucide-react';
import { getVerticalColor, getStageColor } from '../lib/utils.js';

/**
 * Full-page results for a company-name search across every briefing.
 * `results` is an array of { briefing, company } already ranked by App.
 */
export default function SearchResults({ query, results, selectedCompany, onSelect, onClear }) {
  const briefingCount = new Set(results.map(r => r.briefing.date)).size;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 px-6 py-4 bg-[#0a1628] border-b border-[#1e293b] flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">
            Search: <span className="text-[#76B900]">“{query.trim()}”</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {results.length === 0
              ? 'No company in any briefing matches that name.'
              : `${results.length} compan${results.length === 1 ? 'y' : 'ies'} across ${briefingCount} briefing${briefingCount === 1 ? '' : 's'} · click a row to open it`}
          </p>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-[#1e293b] flex-shrink-0"
        >
          <X size={10} />
          Clear search
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {results.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#0f172a] z-10">
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-[#1e293b]">
                <th className="px-6 py-2.5 font-semibold">Company</th>
                <th className="px-3 py-2.5 font-semibold">Country</th>
                <th className="px-3 py-2.5 font-semibold">Vertical</th>
                <th className="px-3 py-2.5 font-semibold">Stage</th>
                <th className="px-3 py-2.5 font-semibold">Fit</th>
                <th className="px-3 py-2.5 font-semibold">Briefing</th>
                <th className="px-3 py-2.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ briefing, company }) => {
                const isSelected = selectedCompany &&
                  selectedCompany.name === company.name && selectedCompany._briefingDate === briefing.date;
                return (
                  <tr
                    key={`${briefing.date}-${company.rank}`}
                    onClick={() => onSelect(briefing, company)}
                    className={`cursor-pointer border-b border-[#1e293b] transition-colors ${
                      isSelected ? 'bg-[#1e293b]' : 'hover:bg-[#1e293b]/60'
                    }`}
                  >
                    <td className="px-6 py-3 align-top">
                      <div className="text-sm font-medium text-slate-100">{company.name}</div>
                      <div className="text-[10px] text-slate-600 font-mono mt-0.5">#{company.rank}</div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      {company.country ? (
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <img
                            src={`https://flagcdn.com/w20/${company.country.code}.png`}
                            alt={company.country.name}
                            className="h-2.5 w-auto rounded-[1px]"
                          />
                          {company.country.name}
                        </span>
                      ) : <span className="text-xs text-slate-600">—</span>}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${getVerticalColor(company.vertical)}`}>
                        {company.vertical}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${getStageColor(company.stage)}`}>
                        {company.stage}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <span className={`flex items-center gap-1.5 text-xs ${company.fit.level === 'strong' ? 'text-[#76B900]' : 'text-amber-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${company.fit.level === 'strong' ? 'bg-[#76B900]' : 'bg-amber-400'}`} />
                        {company.fit.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-top whitespace-nowrap">
                      <div className="text-xs text-slate-300">{briefing.label || briefing.date}</div>
                      <div className="text-[10px] text-slate-600 font-mono">{briefing.date}</div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-xl">{company.description}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
