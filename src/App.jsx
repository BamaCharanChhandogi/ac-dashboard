import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ConstituencyOverview from './components/ConstituencyOverview';
import ConstituenciesView from './components/ConstituenciesView';
import BoothAnalysisView from './components/BoothAnalysisView';
import VoterRollsView from './components/VoterRollsView';
import DemographicsView from './components/DemographicsView';
import ElectionResultsView from './components/ElectionResultsView';
import ReportsView from './components/ReportsView';
import InsightsView from './components/InsightsView';

export default function App() {
  const [currentSlug, setCurrentSlug] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ac') || 'ac17-sanquelim';
  });
  const [data, setData] = useState(null);
  const [directory, setDirectory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || window.location.hash.replace('#', '') || 'dashboard';
  });

  const handleNavigate = (section) => {
    setActiveSection(section);
    window.location.hash = section;
  };

  const handleSelectAC = (slug) => {
    setCurrentSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set('ac', slug);
    window.history.replaceState({}, '', url);
  };

  // Listen to hash changes for browser back/forward and deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch nationwide directory registry on mount
  useEffect(() => {
    fetch('/data/directory.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((dir) => setDirectory(dir))
      .catch((err) => console.warn('Could not load directory.json:', err));
  }, []);

  // Fetch active constituency data
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
      <div className="h-screen flex items-center justify-center bg-[#F1F5F9] dark:bg-[#0B1120]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2563EB] dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 text-[13px] font-semibold">Loading Electoral Intelligence…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F1F5F9] dark:bg-[#0B1120] p-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100 mb-1">Failed to Load Dataset</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[12px] mb-4">{error}</p>
          <button
            onClick={() => handleSelectAC('ac17-sanquelim')}
            className="px-4 py-2 bg-[#2563EB] text-white text-[12px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset to Sanquelim (AC 17)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Left Sidebar Navigation with Persistent Global Switcher */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentSlug={currentSlug}
        directory={directory}
        onSelectAC={handleSelectAC}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[240px] flex flex-col h-full overflow-y-auto bg-[#F1F5F9] dark:bg-[#0B1120] transition-colors duration-200">
        {activeSection === 'dashboard' && (
          <ConstituencyOverview
            data={data}
            currentSlug={currentSlug}
            onSelectAC={handleSelectAC}
            directory={directory}
          />
        )}

        {activeSection === 'constituencies' && (
          <ConstituenciesView
            currentSlug={currentSlug}
            directory={directory}
            onSelectAC={(slug) => {
              handleSelectAC(slug);
              setActiveSection('dashboard');
            }}
          />
        )}

        {activeSection === 'booth' && (
          <BoothAnalysisView data={data} />
        )}

        {activeSection === 'voter-rolls' && (
          <VoterRollsView data={data} />
        )}

        {activeSection === 'demographics' && (
          <DemographicsView data={data} />
        )}

        {activeSection === 'results' && (
          <ElectionResultsView data={data} />
        )}

        {activeSection === 'reports' && (
          <ReportsView data={data} />
        )}

        {activeSection === 'insights' && (
          <InsightsView data={data} />
        )}
      </main>
    </div>
  );
}
