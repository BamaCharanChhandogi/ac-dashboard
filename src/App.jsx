import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SectionHeader from './components/SectionHeader';
import KPICards from './components/KPICards';
import LeadershipDossier from './components/LeadershipDossier';

export default function App() {
  const [currentSlug, setCurrentSlug] = useState('ac09-porvorim');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarSection, setSidebarSection] = useState('dashboard');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/data/${currentSlug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load ${currentSlug}.json`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load constituency data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [currentSlug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-[13px] font-semibold">Loading Constituency Analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="text-center max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
            !
          </div>
          <h2 className="text-[16px] font-bold text-slate-800 mb-1">Failed to Load Dataset</h2>
          <p className="text-slate-500 text-[12px] mb-4">{error}</p>
          <button
            onClick={() => setCurrentSlug('ac09-porvorim')}
            className="px-4 py-2 bg-blue-600 text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset to Porvorim
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Left Sidebar Navigation with authentic Parliament graphic */}
      <Sidebar activeSection={sidebarSection} onNavigate={setSidebarSection} />

      {/* Main Content Area: Strictly Section 1 (Constituency Overview & Master KPIs) */}
      <main className="flex-1 lg:ml-[230px] flex flex-col h-full overflow-y-auto">
        {/* Section 1 - Part A: Letterhead, Administrative Hierarchy & Constituency Selector */}
        <SectionHeader
          data={data}
          currentSlug={currentSlug}
          onSelectAC={setCurrentSlug}
        />

        {/* Section 1 - Part B: Master Electoral KPI Strip (Page 2 of PDF) */}
        <KPICards data={data} />

        {/* Section 1 - Part C: Elected Leadership Dossier - Sitting MLA & MP (Page 1 of PDF) */}
        <LeadershipDossier data={data} />
      </main>
    </div>
  );
}
