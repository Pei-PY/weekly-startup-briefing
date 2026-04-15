import { useState } from 'react';
import briefingsData from './data/briefings.json';
import Sidebar from './components/Sidebar.jsx';
import BriefingView from './components/BriefingView.jsx';
import CompanyDrawer from './components/CompanyDrawer.jsx';

export default function App() {
  const { briefings } = briefingsData;
  const [selectedDate, setSelectedDate] = useState(briefings[0]?.date ?? null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const currentBriefing = briefings.find(b => b.date === selectedDate);

  const handleSelectCompany = (company) => setSelectedCompany(company);
  const handleCloseDrawer = () => setSelectedCompany(null);

  const companies = currentBriefing?.companies ?? [];
  const currentIdx = selectedCompany ? companies.findIndex(c => c.name === selectedCompany.name) : -1;

  const handlePrev = () => {
    if (currentIdx > 0) setSelectedCompany(companies[currentIdx - 1]);
  };
  const handleNext = () => {
    if (currentIdx < companies.length - 1) setSelectedCompany(companies[currentIdx + 1]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">
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

      {selectedCompany && (
        <CompanyDrawer
          company={selectedCompany}
          onClose={handleCloseDrawer}
          onPrev={currentIdx > 0 ? handlePrev : null}
          onNext={currentIdx < companies.length - 1 ? handleNext : null}
        />
      )}
    </div>
  );
}
