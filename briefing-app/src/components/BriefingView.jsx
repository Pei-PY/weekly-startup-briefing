import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { formatDateLong, formatCapital } from '../lib/utils.js';
import CompanyTable from './CompanyTable.jsx';

const STAGE_ORDER = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D'];

export default function BriefingView({ briefing, onSelectCompany, selectedCompany }) {
  const [filters, setFilters] = useState({ vertical: '', stage: '', nvidiaFit: '' });

  const verticals = [...new Set(briefing.companies.map(c => c.vertical))].sort();
  const stages = STAGE_ORDER.filter(s => briefing.companies.some(c => c.stage === s));
  const strongCount = briefing.companies.filter(c => c.nvidiaAlignment.level === 'strong').length;

  const filteredCompanies = briefing.companies.filter(c => {
    if (filters.vertical && c.vertical !== filters.vertical) return false;
    if (filters.stage && c.stage !== filters.stage) return false;
    if (filters.nvidiaFit && c.nvidiaAlignment.level !== filters.nvidiaFit) return false;
    return true;
  });

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const clearFilters = () => setFilters({ vertical: '', stage: '', nvidiaFit: '' });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-[#0a1628] border-b border-[#1e293b]">
        <h1 className="text-lg font-semibold text-slate-100">
          {briefing.label || formatDateLong(briefing.date)}
        </h1>
        <div className="flex items-center gap-4 mt-1.5">
          <Pill label={`${briefing.companies.length} companies`} color="text-slate-500" />
          <Pill label={`${formatCapital(briefing.totalCapitalM)} represented`} color="text-slate-500" />
          <Pill label={`${verticals.length} verticals`} color="text-slate-500" />
          <Pill
            label={`${strongCount} strong NVIDIA fit`}
            color="text-[#76B900]"
            dot="bg-[#76B900]"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex-shrink-0 px-6 py-2.5 bg-[#0f172a] border-b border-[#1e293b] flex items-center gap-3">
        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold flex-shrink-0">
          Filter
        </span>

        <FilterSelect
          placeholder="All Verticals"
          value={filters.vertical}
          onChange={v => setFilters(f => ({ ...f, vertical: v }))}
          options={verticals}
        />

        <FilterSelect
          placeholder="All Stages"
          value={filters.stage}
          onChange={v => setFilters(f => ({ ...f, stage: v }))}
          options={stages}
        />

        <FilterSelect
          placeholder="All NVIDIA Fit"
          value={filters.nvidiaFit}
          onChange={v => setFilters(f => ({ ...f, nvidiaFit: v }))}
          options={[
            { label: 'Strong', value: 'strong' },
            { label: 'Maybe', value: 'maybe' },
          ]}
        />

        {hasActiveFilters && (
          <>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-[#1e293b]"
            >
              <X size={10} />
              Clear
            </button>
            <span className="ml-auto text-[11px] text-slate-500">
              <span className="text-[#76B900]">{filteredCompanies.length}</span>
              {' '}of {briefing.companies.length}
            </span>
          </>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <CompanyTable
          key={briefing.date}
          companies={filteredCompanies}
          onSelectCompany={onSelectCompany}
          selectedCompany={selectedCompany}
        />
      </div>
    </div>
  );
}

function FilterSelect({ placeholder, value, onChange, options }) {
  const isActive = Boolean(value);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={[
          'appearance-none rounded px-3 py-1.5 pr-6 text-[11px] cursor-pointer transition-colors outline-none',
          isActive
            ? 'bg-[#76B900]/10 border border-[#76B900]/40 text-[#76B900] focus:border-[#76B900]/70'
            : 'bg-[#1e293b] border border-[#334155] text-slate-400 hover:border-[#475569] hover:text-slate-200 focus:border-[#475569]',
        ].join(' ')}
      >
        <option value="">{placeholder}</option>
        {options.map(opt =>
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
      <ChevronDown
        size={10}
        className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ${isActive ? 'text-[#76B900]' : 'text-slate-500'}`}
      />
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
