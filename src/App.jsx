import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SectionHeader from './components/SectionHeader';
import ConstituencyOverview from './components/ConstituencyOverview';

export default function App() {
  const [currentSlug, setCurrentSlug] = useState('ac17-sanquelim');
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
      <div className="h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-[13px] font-medium">Loading Electoral Analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
        <div className="text-center max-w-md bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-[16px] font-bold text-slate-800 mb-1">Failed to Load Dataset</h2>
          <p className="text-slate-500 text-[12px] mb-4">{error}</p>
          <button
            onClick={() => setCurrentSlug('ac17-sanquelim')}
            className="px-4 py-2 bg-teal-800 text-white text-[12px] font-semibold rounded-lg hover:bg-teal-900 transition-colors"
          >
            Reset to Sanquelim (AC 17)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      {/* Left Sidebar Navigation */}
      <Sidebar activeSection={sidebarSection} onNavigate={setSidebarSection} />

      {/* Main Content Area: Strictly Section 1 (Constituency Overview & Master KPIs) */}
      <main className="flex-1 lg:ml-[230px] flex flex-col h-full overflow-y-auto">
        {/* Letterhead Banner & AC Switcher (Matching PDF Page 1) */}
        <SectionHeader
          data={data}
          currentSlug={currentSlug}
          onSelectAC={setCurrentSlug}
        />

        {/* Constituency Overview & Electoral Roll Progression SIR 2026 (Matching PDF Page 1 & 2) */}
        <ConstituencyOverview data={data} />
      </main>
    </div>
  );
}
