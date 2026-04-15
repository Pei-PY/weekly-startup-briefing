import { formatDateLong, formatCapital } from '../lib/utils.js';
import CompanyTable from './CompanyTable.jsx';

export default function BriefingView({ briefing, onSelectCompany, selectedCompany }) {
  const verticals = [...new Set(briefing.companies.map(c => c.vertical))];
  const strongCount = briefing.companies.filter(c => c.nvidiaAlignment.level === 'strong').length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-[#161616] border-b border-[#262626]">
        <h1 className="text-lg font-semibold text-slate-100">
          {briefing.label || formatDateLong(briefing.date)}
        </h1>
        <div className="flex items-center gap-4 mt-1.5">
          <Pill label={`${briefing.companies.length} companies`} color="text-slate-400" />
          <Pill label={`${formatCapital(briefing.totalCapitalM)} represented`} color="text-slate-400" />
          <Pill label={`${verticals.length} verticals`} color="text-slate-400" />
          <Pill
            label={`${strongCount} strong NVIDIA fit`}
            color="text-[#76B900]"
            dot="bg-[#76B900]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <CompanyTable
          key={briefing.date}
          companies={briefing.companies}
          onSelectCompany={onSelectCompany}
          selectedCompany={selectedCompany}
        />
      </div>
    </div>
  );
}

function Pill({ label, color, dot }) {
  return (
    <span className={`flex items-center gap-1.5 text-sm ${color}`}>
      {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
      {label}
    </span>
  );
}
