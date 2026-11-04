import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SectionHeader from './components/SectionHeader';
import KPICards from './components/KPICards';
import PopulationPyramid from './components/PopulationPyramid';
import GenderVoteShare from './components/GenderVoteShare';
import BoothMap from './components/BoothMap';
import VoterRollStepper from './components/VoterRollStepper';
import KeyMetrics from './components/KeyMetrics';
import BoothAlerts from './components/BoothAlerts';

export default function App() {
  const [currentSlug, setCurrentSlug] = useState('ac09-porvorim');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarSection, setSidebarSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('overview');

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
      {/* Left Sidebar */}
      <Sidebar activeSection={sidebarSection} onNavigate={setSidebarSection} />

      {/* Main Content Area (No top header bar, directly begins with content) */}
      <main className="flex-1 lg:ml-[230px] flex flex-col h-full overflow-y-auto">
        {/* Section Header: Title + Dropdown on Left, Tab Pills on Right */}
        <SectionHeader
          data={data}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentSlug={currentSlug}
          onSelectAC={setCurrentSlug}
        />

        {/* KPI Metric Cards Row (6 Cards) */}
        <KPICards data={data} />

        {/* Middle Bento Grid (3 Columns: Age-Gender Pyramid, Gender & Vote Share, Voronoi Booth Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-6 lg:px-8 pb-4">
          <PopulationPyramid data={data} />
          <GenderVoteShare data={data} />
          <BoothMap data={data} />
        </div>

        {/* Bottom Bento Grid (3 Columns: Voter Roll Status Stepper, Key Electoral Metrics, Recent Booth Alerts) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-6 lg:px-8 pb-8">
          <VoterRollStepper data={data} />
          <KeyMetrics data={data} />
          <BoothAlerts data={data} />
        </div>
      </main>
    </div>
  );
}
