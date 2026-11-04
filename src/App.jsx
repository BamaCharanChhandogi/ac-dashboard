import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import HeroLetterhead from './components/HeroLetterhead';
import NavPills from './components/NavPills';
import KPIGrid from './components/KPIGrid';
import RollProgression from './components/RollProgression';
import Demographics from './components/Demographics';
import LeadershipDossier from './components/LeadershipDossier';
import ElectionVoteShareBars from './components/ElectionVoteShareBars';
import TrendsAndSwing from './components/TrendsAndSwing';
import PartyControlTimeline from './components/PartyControlTimeline';
import CandidateReturnTables from './components/CandidateReturnTables';
import SpatialMaps from './components/SpatialMaps';
import FamilyClusters from './components/FamilyClusters';
import DataTables from './components/DataTables';
import CitizenSurvey from './components/CitizenSurvey';
import Footer from './components/Footer';

export default function App() {
  const [directory, setDirectory] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('ac17-sanquelim');
  const [constituencyData, setConstituencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch directory on mount
  useEffect(() => {
    const dirUrl = `${import.meta.env.BASE_URL}data/directory.json`;
    fetch(dirUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load directory.json');
        return res.json();
      })
      .then((dirData) => {
        const pcList = dirData.parliamentary_constituencies || [];
        const allAcs = [];
        pcList.forEach((pc) => {
          (pc.assembly_constituencies || []).forEach((ac) => {
            allAcs.push(ac);
          });
        });
        setDirectory(allAcs);

        // Check if URL hash matches an AC
        const hashSlug = window.location.hash.replace('#', '').split('?')[0];
        const match = allAcs.find((c) => c.slug === hashSlug);
        if (match) {
          setSelectedSlug(match.slug);
        }
      })
      .catch((err) => {
        console.error('Directory fetch error:', err);
      });
  }, []);

  // Listen for browser back / forward hash navigation
  useEffect(() => {
    const onHashChange = () => {
      const hashSlug = window.location.hash.replace('#', '').split('?')[0];
      if (hashSlug && directory.some((c) => c.slug === hashSlug)) {
        setSelectedSlug(hashSlug);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [directory]);

  // 2. Fetch specific constituency dataset when selectedSlug changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    const filePath = `${import.meta.env.BASE_URL}data/${selectedSlug}.json`;
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${filePath}`);
        return res.json();
      })
      .then((data) => {
        setConstituencyData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Constituency data fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [selectedSlug]);

  const handleSelectConstituency = (slug) => {
    setSelectedSlug(slug);
    if (window.location.hash !== `#${slug}`) {
      window.location.hash = slug;
    }
    // Smooth scroll back to top on switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* Level 1: Fixed Global Header */}
      <TopNav
        constituencies={directory}
        selectedSlug={selectedSlug}
        onSelectConstituency={handleSelectConstituency}
        currentData={constituencyData}
      />

      {loading && (
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Compiling Constituency Intelligence...
            </span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-xl mx-auto my-20 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <div className="text-rose-800 font-bold text-lg mb-1">Failed to load dataset</div>
          <p className="text-xs text-rose-600">{error}</p>
          <button
            onClick={() => handleSelectConstituency('ac17-sanquelim')}
            className="mt-4 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-bold"
          >
            Reset to AC 17 Sanquelim
          </button>
        </div>
      )}

      {!loading && !error && constituencyData && (
        <>
          {/* Level 2: Hero Letterhead Banner */}
          <HeroLetterhead data={constituencyData} />

          {/* Level 3: Sticky Navigation Pills */}
          <NavPills hasSurvey={constituencyData.survey?.has_data !== false} />

          {/* Main Dashboard Presentation Stack */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 flex-1 w-full">
            
            {/* Level 4: Master KPI Sub-Header Strip */}
            <section id="overview" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                  Constituency Overview & Peak Benchmarks
                </h2>
              </div>
              <KPIGrid data={constituencyData} />
            </section>

            {/* Level 5: SIR 2026 Roll Progression Timeline */}
            <RollProgression data={constituencyData} />

            {/* Level 6: Demographics (Donut, Age Bars & Diverging Pyramid) */}
            <Demographics data={constituencyData} />

            {/* Level 7: Elected Leadership Dossier (Sitting MLA & MP) */}
            <LeadershipDossier data={constituencyData} />

            {/* Level 8: Election Results — Stacked Vote Share Bars */}
            <ElectionVoteShareBars data={constituencyData} />

            {/* Level 9: Trends, Swing & Takeaways (3-Column Layout) */}
            <TrendsAndSwing data={constituencyData} />

            {/* Level 10: "Party Control at a Glance" Chronological Stepper */}
            <PartyControlTimeline data={constituencyData} />

            {/* Level 11: Granular Candidate Return Tables (Side-by-Side AC vs LS) */}
            <CandidateReturnTables data={constituencyData} />

            {/* Level 12: Spatial Vector Maps (Adaptive SVG Voronoi & Village Lean) */}
            <SpatialMaps data={constituencyData} />

            {/* Level 13: Family & Household Groups Directory */}
            <FamilyClusters data={constituencyData} />

            {/* Level 14: Searchable Data Tables (Booths & Voter Churn Log) */}
            <DataTables data={constituencyData} />

            {/* Level 15: Citizen Sentiment Analytics (Conditional IVRS Module) */}
            <CitizenSurvey data={constituencyData} />

          </main>

          {/* Level 16: Footer & Data Governance Letterhead */}
          <Footer data={constituencyData} />
        </>
      )}

    </div>
  );
}
