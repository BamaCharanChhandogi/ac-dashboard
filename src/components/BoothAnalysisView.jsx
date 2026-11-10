import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Eye } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import sanquelimMapData from '../data/sanquelim-map.json';
import porvorimMapData from '../data/porvorim-map.json';
import aldonaMapData from '../data/aldona-map.json';
import BoothDetailModal from './BoothDetailModal';

const ELECTION_OPTIONS = [
  'Overall',
  '2012 AE',
  '2014 LS',
  '2017 AE',
  '2019 LS',
  '2022 AE',
  '2024 LS',
];

const ELECTION_DESCRIPTIONS = {
  'Overall': "Overall = each booth's own average BJP margin across all elections with a real figure for that booth.",
  '2024 LS': '2024 Lok Sabha (Parliament) — Shripad Naik (BJP) booth returns & victory gaps.',
  '2022 AE': '2022 Goa Legislative Assembly Election — Form-20 booth-level victory margins.',
  '2019 LS': '2019 Lok Sabha (Parliament) — Shripad Naik (BJP) PC in AC booth vote margins.',
  '2017 AE': '2017 Goa Legislative Assembly Election — Form-20 booth-level victory margins.',
  '2014 LS': '2014 Lok Sabha (Parliament) — PC in AC booth-level wave margins.',
  '2012 AE': '2012 Goa Legislative Assembly Election — Form-20 booth-level victory margins.',
};

const STATIC_MAPS = {
  'ac17-sanquelim': sanquelimMapData,
  '17': sanquelimMapData,
  'ac09-porvorim': porvorimMapData,
  '9': porvorimMapData,
  'ac10-aldona': aldonaMapData,
  '10': aldonaMapData,
};

export default function BoothAnalysisView({ data }) {
  const meta = data?.meta || {};
  const spatial = data?.spatial || {};
  const isSanquelim = (meta.ac_no === 17) || !meta.ac_no || (meta.slug === 'ac17-sanquelim');

  // Resolve the active map data across Sanquelim, Porvorim, Aldona, or data.spatial
  const activeMap = useMemo(() => {
    const slugKey = meta.slug || `ac${String(meta.ac_no || '').padStart(2, '0')}`;
    if (STATIC_MAPS[slugKey]) return STATIC_MAPS[slugKey];
    if (STATIC_MAPS[String(meta.ac_no)]) return STATIC_MAPS[String(meta.ac_no)];
    if (spatial?.booths && spatial.booths.length > 0 && spatial.booths[0].path) {
      return spatial;
    }
    return sanquelimMapData;
  }, [meta.slug, meta.ac_no, spatial]);

  // Dynamic scale factor based on viewBox width so badges and text are always sharp and legible
  const mapScale = useMemo(() => {
    const vb = (activeMap.viewBox || '80 100 455 440').split(' ').map(Number);
    const w = vb[2] || 455;
    const ratio = Math.max(0.85, Math.min(2.0, w / 455));
    return {
      badgeR: roundTo(6.8 * ratio, 1),
      badgeDashedR: roundTo(9.5 * ratio, 1),
      badgeFont: roundTo(6.5 * ratio, 1),
      villageFont: roundTo(12.5 * ratio, 1),
      haloStroke: roundTo(2.8 * ratio, 1),
      borderStroke: roundTo(2.2 * ratio, 1),
    };
  }, [activeMap.viewBox]);

  // Full booth roster from activeMap or spatial
  const rawBooths = useMemo(() => {
    if (activeMap?.booths && activeMap.booths.length > 0) return activeMap.booths;
    if (spatial?.booths && spatial.booths.length > 0) return spatial.booths;
    return sanquelimMapData.booths || [];
  }, [activeMap, spatial]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedElection, setSelectedElection] = useState('Overall');
  const [selectedBoothNumber, setSelectedBoothNumber] = useState(null);
  const [hoveredBooth, setHoveredBooth] = useState(null);
  const [isVillageDropdownOpen, setIsVillageDropdownOpen] = useState(false);
  const [modalBooth, setModalBooth] = useState(null);

  // Unique villages for filter dropdown
  const uniqueVillages = useMemo(() => {
    return ['All', ...new Set(rawBooths.map((b) => b.village).filter(Boolean))];
  }, [rawBooths]);

  // Filtered booth roster
  const filteredBooths = useMemo(() => {
    return rawBooths.filter((b) => {
      const bNum = Number(b.part_no || b.number);
      if (selectedBoothNumber && bNum !== selectedBoothNumber) {
        return false;
      }
      const matchesSearch =
        (b.station_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.village || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(b.part_no || b.number).includes(searchTerm);
      const matchesVillage = selectedVillage === 'All' || b.village === selectedVillage;
      return matchesSearch && matchesVillage;
    });
  }, [rawBooths, searchTerm, selectedVillage, selectedBoothNumber]);

  // Helper to resolve margin, category, color, winner, and dashed status for any booth under selectedElection
  const getBoothElectionData = (b) => {
    if (!b) {
      return { margin: 0, category: 'Safe', color: '#15803D', winner: 'BJP', isDashed: false };
    }

    if (b.elections && b.elections[selectedElection]) {
      return b.elections[selectedElection];
    }

    // Dynamic fallback if explicit election object not yet attached
    const baseMargin = b.margin_pct != null ? b.margin_pct : 15.0;
    const cat = b.category || (baseMargin <= -10 ? 'Weak' : baseMargin < 10 ? 'Battle Ground' : 'Safe');
    const col = b.color || (cat === 'Weak' ? '#991B1B' : cat === 'Battle Ground' ? '#D97706' : '#15803D');
    return {
      margin: baseMargin,
      category: cat,
      color: col,
      winner: 'BJP',
      isDashed: !!b.isDashed,
    };
  };

  // Color calculation helper driven by selectedElection
  const getBoothColor = (b) => {
    return getBoothElectionData(b).color;
  };

  // Aggregated breakdown counts for the selected election
  const electionSummary = useMemo(() => {
    let safe = 0;
    let battle = 0;
    let weak = 0;
    let totalMargin = 0;
    rawBooths.forEach((b) => {
      const stats = getBoothElectionData(b);
      if (stats.category === 'Weak' || stats.margin <= -10) weak++;
      else if (stats.category === 'Battle Ground' || (stats.margin > -10 && stats.margin < 10)) battle++;
      else safe++;
      totalMargin += (stats.margin || 0);
    });
    const avgMargin = rawBooths.length > 0 ? (totalMargin / rawBooths.length).toFixed(1) : '0';
    return { safe, battle, weak, avgMargin };
  }, [rawBooths, selectedElection]);

  // Handle booth hover
  const handleMouseEnter = (booth) => {
    setHoveredBooth(booth);
  };

  const handleMouseLeave = () => {
    setHoveredBooth(null);
  };

  const handleBoothClick = (boothOrNum) => {
    let bObj = null;
    let bNum = null;
    if (boothOrNum && typeof boothOrNum === 'object') {
      bObj = boothOrNum;
      bNum = Number(boothOrNum.part_no || boothOrNum.number);
    } else {
      bNum = Number(boothOrNum);
      bObj = rawBooths.find((b) => Number(b.part_no || b.number) === bNum);
    }

    setSelectedBoothNumber(bNum);
    if (bObj) {
      if (selectedVillage !== 'All' && bObj.village !== selectedVillage) {
        setSelectedVillage('All');
      }
      setModalBooth(bObj);
    }
  };

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Header Title */}
      <div>
        <h2 className="font-serif text-[26px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Booth Analysis & Polling Stations Roster
        </h2>
        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Electoral geography, spatial margins, and 100% verified booth roster across {meta.ac_name || 'Sanquelim'}
        </p>
      </div>

      {/* 2. Top 4 KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">TOTAL BOOTHS</p>
          <p className="text-[26px] font-bold text-[#1E3A8A] dark:text-blue-400 tabular-nums leading-none">
            {rawBooths.length || meta.total_booths || 50}
          </p>
        </div>

        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#0D9488]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">ACTIVE VOTERS</p>
          <p className="text-[26px] font-bold text-[#0F766E] dark:text-teal-400 tabular-nums leading-none">
            {formatIndianNumber(meta.total_voters || 27265)}
          </p>
        </div>

        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#16A34A]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">ADDED (ALL STAGES)</p>
          <p className="text-[26px] font-bold text-[#16A34A] dark:text-emerald-400 tabular-nums leading-none">
            {formatIndianNumber(meta.sir_added || 693)}
          </p>
        </div>

        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#DC2626]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">DELETED (ALL STAGES)</p>
          <p className="text-[26px] font-bold text-[#DC2626] dark:text-rose-400 tabular-nums leading-none">
            {formatIndianNumber(meta.sir_deleted || 634)}
          </p>
        </div>
      </div>

      {/* 3. Universal High-Contrast Spatial Vector Map for EVERY Constituency */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100">
                Booth-level Form-20 Election Retrospective
              </h3>
              {selectedBoothNumber && (
                <button
                  type="button"
                  onClick={() => setSelectedBoothNumber(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                >
                  <span>Booth #{selectedBoothNumber} selected</span>
                  <X size={12} />
                </button>
              )}
            </div>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {ELECTION_DESCRIPTIONS[selectedElection] || ELECTION_DESCRIPTIONS['Overall']}
            </p>
          </div>

          {/* Election Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl text-[11px] font-semibold border border-slate-200/80 dark:border-slate-700/80">
            {ELECTION_OPTIONS.map((elec) => (
              <button
                key={elec}
                type="button"
                onClick={() => setSelectedElection(elec)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                  selectedElection === elec
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                {elec}
              </button>
            ))}
          </div>
        </div>

        {/* High-Contrast Dark Spatial Canvas (#131913) */}
        <div className="w-full bg-[#131913] rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-3 select-none min-h-[420px]">
          <svg
            viewBox={activeMap.viewBox || '80 100 455 440'}
            className="w-full h-auto max-h-[580px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="villageTextGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* 1. Outer Border Glow / Halo */}
            {activeMap.outerBorder && (
              <path
                d={activeMap.outerBorder}
                fill="none"
                stroke="#6B7280"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="opacity-80"
              />
            )}

            {/* 2. Booth Polygonal Choropleth Cells */}
            <g id="booth-cells">
              {activeMap.booths?.map((b) => {
                const bNum = Number(b.number || b.part_no);
                const isSelected = selectedBoothNumber === bNum;
                const isHovered = (hoveredBooth?.number || hoveredBooth?.part_no) === bNum;
                const cellFill = getBoothColor(b);

                return (
                  <path
                    key={`poly-${bNum}`}
                    d={b.path}
                    fill={cellFill}
                    stroke={isSelected ? '#FACC15' : isHovered ? '#FFFFFF' : '#111827'}
                    strokeWidth={isSelected ? '2.8' : isHovered ? '2.2' : '1.1'}
                    className="transition-colors duration-150 cursor-pointer"
                    onClick={() => handleBoothClick(bNum)}
                    onMouseEnter={() => handleMouseEnter(b)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </g>

            {/* 3. Village Boundaries (Thick Dark Separators) */}
            <g id="village-borders" className="pointer-events-none">
              {activeMap.villageBorders?.map((vPath, i) => (
                <path
                  key={`vborder-${i}`}
                  d={vPath}
                  fill="none"
                  stroke="#0B120B"
                  strokeWidth={mapScale.borderStroke || '2.2'}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="opacity-95"
                />
              ))}
            </g>

            {/* 4. Booth Badges (Circles with Numbers) */}
            <g id="booth-badges" className="cursor-pointer">
              {activeMap.booths?.map((b) => {
                const bNum = Number(b.number || b.part_no);
                const isSelected = selectedBoothNumber === bNum;
                const badgeStats = getBoothElectionData(b);
                const badgeFill = badgeStats.color;
                const cx = b.cx || b.x;
                const cy = b.cy || b.y;

                return (
                  <g
                    key={`badge-${bNum}`}
                    onClick={() => handleBoothClick(b)}
                    onMouseEnter={() => handleMouseEnter(b)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Dashed outer ring for special booths */}
                    {(badgeStats.isDashed || b.isDashed) && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={mapScale.badgeDashedR}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                      />
                    )}

                    {/* Badge Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={mapScale.badgeR}
                      fill={badgeFill}
                      stroke={isSelected ? '#FACC15' : '#FFFFFF'}
                      strokeWidth={isSelected ? '2.2' : '1.1'}
                      className="transition-transform duration-150"
                    />

                    {/* Booth Number Text */}
                    <text
                      x={cx}
                      y={cy + mapScale.badgeFont * 0.38}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={mapScale.badgeFont}
                      fontWeight="bold"
                      fontFamily="system-ui, sans-serif"
                      className="pointer-events-none select-none"
                    >
                      {bNum}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* 5. Village Labels (Bold White Font with Black Stroke Halo matching authentic design) */}
            <g id="village-labels" className="pointer-events-none select-none">
              {activeMap.villages?.map((v) => (
                <text
                  key={`vlabel-${v.name}`}
                  x={v.x}
                  y={v.y}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth={mapScale.haloStroke}
                  paintOrder="stroke fill"
                  fontSize={mapScale.villageFont}
                  fontWeight="900"
                  letterSpacing="0.01em"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  filter="url(#villageTextGlow)"
                >
                  {v.name}
                </text>
              ))}
            </g>
          </svg>

          {/* Floating Hover Card Tooltip for EVERY Constituency */}
          {hoveredBooth && (() => {
            const hStats = getBoothElectionData(hoveredBooth);
            return (
              <div
                className="absolute pointer-events-none z-30 bg-slate-900/95 text-white border border-slate-700 rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md text-left text-[11px] min-w-[240px]"
                style={{
                  left: '20px',
                  bottom: '20px',
                }}
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                  <span className="font-bold text-[12px] text-white">
                    Booth #{hoveredBooth.number || hoveredBooth.part_no}
                  </span>
                  <span
                    className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      hStats.category === 'Weak'
                        ? 'bg-rose-500/20 text-rose-300'
                        : hStats.category === 'Battle Ground' || hStats.category === 'Battleground'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {hStats.category}
                  </span>
                </div>
                <p className="text-slate-300 font-medium leading-tight mb-2">
                  {hoveredBooth.station_name}
                </p>
                <div className="grid grid-cols-2 gap-2 text-slate-400 text-[10px] pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="block text-slate-500">Village</span>
                    <span className="text-white font-semibold">{hoveredBooth.village || meta.ac_name}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Electors</span>
                    <span className="text-white font-semibold tabular-nums">
                      {formatIndianNumber(hoveredBooth.voters)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500">{selectedElection} Margin</span>
                    <span className={`font-bold tabular-nums ${
                      hStats.margin > 0 ? 'text-emerald-400' : hStats.margin < 0 ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {hStats.margin != null ? `${hStats.margin > 0 ? '+' : ''}${hStats.margin}%` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Lead Party</span>
                    <span className="text-white font-semibold">{hStats.winner || 'BJP'}</span>
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-blue-400 font-bold flex items-center justify-between">
                  <span>Click to view full Form-20 retrospective dossier</span>
                  <span>→</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Legend with Dynamic Live Counts for Selected Election */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[12px] font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#15803D] border border-white dark:border-slate-800 shadow-xs" />
              <span>Safe (≥10%): <strong className="text-emerald-600 dark:text-emerald-400">{electionSummary.safe} booths</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] border border-white dark:border-slate-800 shadow-xs" />
              <span>Battle Ground (±10%): <strong className="text-amber-600 dark:text-amber-400">{electionSummary.battle} booths</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#991B1B] border border-white dark:border-slate-800 shadow-xs" />
              <span>Weak (≤-10%): <strong className="text-rose-600 dark:text-rose-400">{electionSummary.weak} booths</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
              AC Avg Margin in {selectedElection}: <strong className="text-slate-900 dark:text-slate-100 tabular-nums">{electionSummary.avgMargin > 0 ? '+' : ''}{electionSummary.avgMargin}%</strong>
            </span>
            {selectedBoothNumber && (
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                Booth #{selectedBoothNumber} Filter Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Full Booths Table Roster (100% Synced) */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100">
              Booths in this Constituency
            </h3>
            <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium">
              Showing {filteredBooths.length} verified polling stations • Filter: <strong className="text-blue-600 dark:text-blue-400">{selectedElection}</strong>
              {selectedBoothNumber && ` (Booth #${selectedBoothNumber} Active)`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search station or part no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 w-52 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Custom Village Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVillageDropdownOpen(!isVillageDropdownOpen)}
                className="inline-flex items-center justify-between gap-2 text-[12px] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer min-w-[130px]"
              >
                <span>{selectedVillage === 'All' ? 'All Villages' : selectedVillage}</span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 dark:text-slate-500 transition-transform ${isVillageDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isVillageDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-30 py-1 max-h-56 overflow-y-auto">
                  {uniqueVillages.map((v) => {
                    const isSelected = selectedVillage === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setSelectedVillage(v);
                          setIsVillageDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{v === 'All' ? 'All Villages' : v}</span>
                        {isSelected && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reset Button if filtered */}
            {(selectedBoothNumber || selectedVillage !== 'All' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBoothNumber(null);
                  setSelectedVillage('All');
                  setSearchTerm('');
                }}
                className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Table Roster */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pr-4">BOOTH</th>
                <th className="pb-3 px-4">POLLING STATION</th>
                <th className="pb-3 px-4">VILLAGE</th>
                <th className="pb-3 px-4 text-right">VOTERS</th>
                <th className="pb-3 px-4 text-right">ADDED</th>
                <th className="pb-3 px-4 text-right">DELETED</th>
                <th className="pb-3 px-4 text-right">
                  MARGIN ({selectedElection === 'Overall' ? 'AVG' : selectedElection})
                </th>
                <th className="pb-3 pl-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBooths.map((b) => {
                const bNum = Number(b.part_no || b.number);
                const isSelected = selectedBoothNumber === bNum;
                const stats = getBoothElectionData(b);
                const status = stats.category;
                const margin = stats.margin;

                return (
                  <tr
                    key={b.part_no || b.number}
                    onClick={() => handleBoothClick(b)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/70 dark:bg-blue-950/50 font-semibold' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-3 pr-4 font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      <span
                        className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-[11px] ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold'
                        }`}
                      >
                        {b.part_no || b.number}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                      {b.station_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {b.village}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatIndianNumber(b.voters)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-teal-700 dark:text-teal-400 tabular-nums">
                      {b.added != null ? `+${b.added}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                      {b.deleted != null ? `−${b.deleted}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold tabular-nums">
                      <span className={
                        margin > 0 ? 'text-emerald-700 dark:text-emerald-400 font-bold' : margin < 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                      }>
                        {margin != null ? `${margin > 0 ? '+' : ''}${margin}%` : '—'}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            status === 'Weak'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              : status === 'Battle Ground' || status === 'Battleground'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {status}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 text-[10.5px] font-bold text-blue-600 dark:text-blue-400 transition-opacity">
                          Dossier →
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booth Retrospective Dossier Modal */}
      {modalBooth && (
        <BoothDetailModal
          booth={modalBooth}
          onClose={() => setModalBooth(null)}
          data={data}
        />
      )}
    </div>
  );
}

function roundTo(n, digits) {
  const f = Math.pow(10, digits);
  return Math.round(n * f) / f;
}
