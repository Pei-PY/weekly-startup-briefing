import { formatDate } from '../lib/utils.js';

export default function Sidebar({ briefings, selectedDate, onSelectDate }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#111] flex flex-col h-full border-r border-[#222]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#76B900]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#76B900]">
            NVIDIA Inception
          </span>
        </div>
        <p className="text-white font-semibold text-sm mt-1">Startup Briefings</p>
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
      <div className="px-4 py-3 border-t border-[#222]">
        <p className="text-[10px] text-[#4b5563]">{briefings.length} briefings total</p>
        <p className="text-[10px] text-[#4b5563] mt-0.5">
          {briefings.reduce((s, b) => s + b.companies.length, 0)} companies tracked
        </p>
      </div>
    </aside>
  );
}
