import { useState } from 'react';
import briefingsData from './data/briefings.json';
import Sidebar from './components/Sidebar.jsx';
import BriefingView from './components/BriefingView.jsx';
import CompanyDrawer from './components/CompanyDrawer.jsx';
import GlobalSearch from './components/GlobalSearch.jsx';

export default function App() {
  const { briefings } = briefingsData;
  const [selectedDate, setSelectedDate] = useState(briefings[0]?.date ?? null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const currentBriefing = briefings.find(b => b.date === selectedDate);

  const handleSelectCompany = (company) => setSelectedCompany(company);
  const handleCloseDrawer = () => setSelectedCompany(null);
  const handleSearchPick = (date, company) => { setSelectedDate(date); setSelectedCompany(company); };

  const companies = currentBriefing?.companies ?? [];
  const currentIdx = selectedCompany ? companies.findIndex(c => c.name === selectedCompany.name) : -1;

  const handlePrev = () => {
    if (currentIdx > 0) setSelectedCompany(companies[currentIdx - 1]);
  };
  const handleNext = () => {
    if (currentIdx < companies.length - 1) setSelectedCompany(companies[currentIdx + 1]);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f172a]">
      {/* Top header banner */}
      <div className="flex-shrink-0 bg-[#0a1628] px-6 py-2.5 flex items-center gap-3 border-b border-[#1e293b]">
        <div className="w-2 h-2 rounded-full bg-[#76B900]" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#76B900]">Startup Briefings</span>
        <span className="text-[#475569] text-[11px]">·</span>
        <span className="text-[11px] text-slate-300 font-medium">South East Asia</span>
        <div className="flex-1 flex justify-center px-6">
          <GlobalSearch briefings={briefings} onPick={handleSearchPick} />
        </div>
        <span className="flex items-center gap-2.5">
          {[
            { code: 'sg', name: 'Singapore' },
            { code: 'my', name: 'Malaysia' },
            { code: 'vn', name: 'Vietnam' },
            { code: 'id', name: 'Indonesia' },
            { code: 'ph', name: 'Philippines' },
            { code: 'th', name: 'Thailand' },
          ].map(({ code, name }) => (
            <img
              key={code}
              src={`https://flagcdn.com/w40/${code}.png`}
              alt={name}
              title={name}
              className="h-4 w-auto rounded-[2px] opacity-90 hover:opacity-100 transition-opacity shadow-sm"
            />
          ))}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          briefings={briefings}
          selectedDate={selectedDate}
          onSelectDate={(date) => { setSelectedDate(date); setSelectedCompany(null); }}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          {currentBriefing ? (
            <BriefingView
              key={currentBriefing.date}
              briefing={currentBriefing}
              onSelectCompany={handleSelectCompany}
              selectedCompany={selectedCompany}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Select a briefing date from the sidebar
            </div>
          )}
        </main>
      </div>

      {selectedCompany && (
        <CompanyDrawer
          company={selectedCompany}
          briefingDate={selectedDate}
          onClose={handleCloseDrawer}
          onPrev={currentIdx > 0 ? handlePrev : null}
          onNext={currentIdx < companies.length - 1 ? handleNext : null}
        />
      )}
    </div>
  );
}
