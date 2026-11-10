import { useMemo, useState } from 'react';
import briefingsData from './data/briefings.json';
import Sidebar from './components/Sidebar.jsx';
import BriefingView from './components/BriefingView.jsx';
import CompanyDrawer from './components/CompanyDrawer.jsx';
import GlobalSearch from './components/GlobalSearch.jsx';
import SearchResults from './components/SearchResults.jsx';

const COUNTRIES = [
  { code: 'sg', name: 'Singapore' },
  { code: 'my', name: 'Malaysia' },
  { code: 'vn', name: 'Vietnam' },
  { code: 'id', name: 'Indonesia' },
  { code: 'ph', name: 'Philippines' },
  { code: 'th', name: 'Thailand' },
];

function normalize(s) {
  return (s || '').toLowerCase().trim();
}

export default function App() {
  const { briefings } = briefingsData;
  const [selectedDate, setSelectedDate] = useState(briefings[0]?.date ?? null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [query, setQuery] = useState('');

  const currentBriefing = briefings.find(b => b.date === selectedDate);
  const isSearching = query.trim().length > 0;

  // Company-name search across every briefing, ranked: exact > starts-with > contains.
  const searchResults = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    const rows = [];
    for (const briefing of briefings) {
      for (const company of briefing.companies) {
        const name = normalize(company.name);
        const web = normalize(company.websiteDisplay);
        let score = 0;
        if (name === q) score = 3;
        else if (name.startsWith(q)) score = 2;
        else if (name.includes(q) || web.includes(q)) score = 1;
        if (score) rows.push({ briefing, company, score });
      }
    }
    rows.sort((a, b) => b.score - a.score || a.company.name.localeCompare(b.company.name) || b.briefing.date.localeCompare(a.briefing.date));
    return rows;
  }, [briefings, query]);

  // Drawer navigation list: search results while searching, else the open briefing.
  const navList = isSearching
    ? searchResults.map(r => ({ ...r.company, _briefingDate: r.briefing.date }))
    : (currentBriefing?.companies ?? []).map(c => ({ ...c, _briefingDate: currentBriefing.date }));
  const currentIdx = selectedCompany
    ? navList.findIndex(c => c.name === selectedCompany.name && c._briefingDate === selectedCompany._briefingDate)
    : -1;

  const handleSelectCompany = (company) =>
    setSelectedCompany({ ...company, _briefingDate: currentBriefing?.date });
  const handleSelectResult = (briefing, company) => {
    setSelectedDate(briefing.date);
    setSelectedCompany({ ...company, _briefingDate: briefing.date });
  };
  const handleCloseDrawer = () => setSelectedCompany(null);
  const handleQueryChange = (q) => { setQuery(q); setSelectedCompany(null); };

  const handlePrev = () => { if (currentIdx > 0) setSelectedCompany(navList[currentIdx - 1]); };
  const handleNext = () => { if (currentIdx < navList.length - 1) setSelectedCompany(navList[currentIdx + 1]); };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f172a]">
      {/* Top header banner */}
      <div className="flex-shrink-0 bg-[#0a1628] px-6 py-2.5 flex items-center gap-3 border-b border-[#1e293b]">
        <div className="w-2 h-2 rounded-full bg-[#76B900]" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#76B900]">Startup Briefings</span>
        <span className="text-[#475569] text-[11px]">·</span>
        <span className="text-[11px] text-slate-300 font-medium">South East Asia</span>
        <div className="flex-1 flex justify-center px-6">
          <GlobalSearch query={query} onChange={handleQueryChange} resultCount={searchResults.length} />
        </div>
        <span className="flex items-center gap-2.5">
          {COUNTRIES.map(({ code, name }) => (
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
          onSelectDate={(date) => { setSelectedDate(date); setSelectedCompany(null); setQuery(''); }}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          {isSearching ? (
            <SearchResults
              query={query}
              results={searchResults}
              selectedCompany={selectedCompany}
              onSelect={handleSelectResult}
              onClear={() => handleQueryChange('')}
            />
          ) : currentBriefing ? (
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
          briefingDate={selectedCompany._briefingDate ?? selectedDate}
          onClose={handleCloseDrawer}
          onPrev={currentIdx > 0 ? handlePrev : null}
          onNext={currentIdx >= 0 && currentIdx < navList.length - 1 ? handleNext : null}
        />
      )}
    </div>
  );
}
