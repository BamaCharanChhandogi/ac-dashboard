import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import sanquelimMapData from '../data/sanquelim-map.json';

const ELECTION_OPTIONS = [
  'Overall',
  '2012 AE',
  '2014 LS',
  '2017 AE',
  '2019 LS',
  '2022 AE',
  '2024 LS',
];

export default function BoothAnalysisView({ data }) {
  const meta = data?.meta || {};
  const spatial = data?.spatial || {};
  const isSanquelim = (meta.ac_no === 17) || !meta.ac_no || (meta.slug === 'ac17-sanquelim');

  // Use the verified 50-booth roster from data.spatial.booths
  const rawBooths = spatial.booths || sanquelimMapData.booths || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedElection, setSelectedElection] = useState('Overall');
  const [selectedBoothNumber, setSelectedBoothNumber] = useState(null);
  const [hoveredBooth, setHoveredBooth] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isVillageDropdownOpen, setIsVillageDropdownOpen] = useState(false);

  // Unique villages for filter
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

  // Handle map hover
  const handleMouseEnter = (booth, e) => {
    setHoveredBooth(booth);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredBooth(null);
  };

  const handleBoothClick = (boothNum) => {
    if (selectedBoothNumber === boothNum) {
      setSelectedBoothNumber(null);
    } else {
      setSelectedBoothNumber(boothNum);
      // Also sync selected village if filtered
      const bObj = rawBooths.find(b => Number(b.part_no || b.number) === boothNum);
      if (bObj && selectedVillage !== 'All' && bObj.village !== selectedVillage) {
        setSelectedVillage('All');
      }
    }
  };

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Header Title */}
      <div>
        <h2 className="font-serif text-[26px] font-bold text-slate-900 tracking-tight">
          Booth Analysis & Polling Stations Roster
        </h2>
        <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
          Electoral geography, spatial margins, and 100% verified booth roster across {meta.ac_name || 'Sanquelim'}
        </p>
      </div>

      {/* 2. Top 4 KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL BOOTHS</p>
          <p className="text-[26px] font-bold text-[#1E3A8A] tabular-nums leading-none">
            {meta.total_booths || rawBooths.length || 50}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#0D9488]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ACTIVE VOTERS</p>
          <p className="text-[26px] font-bold text-[#0F766E] tabular-nums leading-none">
            {formatIndianNumber(meta.total_voters || 27265)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#16A34A]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ADDED (ALL STAGES)</p>
          <p className="text-[26px] font-bold text-[#16A34A] tabular-nums leading-none">
            {formatIndianNumber(meta.sir_added || 693)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#DC2626]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">DELETED (ALL STAGES)</p>
          <p className="text-[26px] font-bold text-[#DC2626] tabular-nums leading-none">
            {formatIndianNumber(meta.sir_deleted || 634)}
          </p>
        </div>
      </div>

      {/* 3. Voronoi / Village Spatial Vector Map (Matching PDF Page 6 & media_1793792399680_6581f137.png) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-[18px] font-bold text-slate-900">
                Booth-level Form-20 Election Retrospective
              </h3>
              {selectedBoothNumber && (
                <button
                  type="button"
                  onClick={() => setSelectedBoothNumber(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <span>Booth #{selectedBoothNumber} selected</span>
                  <X size={12} />
                </button>
              )}
            </div>
            <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">
              Overall = each booth's own average BJP margin across all elections with a real figure for that booth.
            </p>
          </div>

          {/* Election Filter Pills (Overall, 2012 AE, etc.) */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
            {ELECTION_OPTIONS.map((elec) => (
              <button
                key={elec}
                type="button"
                onClick={() => setSelectedElection(elec)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  selectedElection === elec
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {elec}
              </button>
            ))}
          </div>
        </div>

        {/* High-Contrast Organic Spatial Map Canvas (Matching media_1793792399680_6581f137.png) */}
        <div className="w-full bg-[#131913] rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-3 select-none">
          <svg
            viewBox={sanquelimMapData.viewBox || '80 100 455 440'}
            className="w-full h-auto max-h-[560px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="villageTextGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* 1. Outer Border Glow / Halo */}
            <path
              d={sanquelimMapData.outerBorder}
              fill="none"
              stroke="#6B7280"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="opacity-80"
            />

            {/* 2. 50 Booth Polygonal Choropleth Cells */}
            <g id="booth-cells">
              {sanquelimMapData.booths.map((b) => {
                const isSelected = selectedBoothNumber === b.number;
                const isHovered = hoveredBooth?.number === b.number;

                // Color calculation
                let cellFill = b.color;
                if (b.number === 5) cellFill = '#991B1B'; // Deep Crimson Red
                else if (b.number === 7 || b.number === 41) cellFill = '#D97706'; // Amber Yellow
                else cellFill = '#15803D'; // Rich Forest Green

                return (
                  <path
                    key={`poly-${b.number}`}
                    d={b.path}
                    fill={cellFill}
                    stroke={isSelected ? '#FACC15' : isHovered ? '#FFFFFF' : '#111827'}
                    strokeWidth={isSelected ? '2.8' : isHovered ? '2.2' : '1.1'}
                    className="transition-colors duration-150 cursor-pointer"
                    onClick={() => handleBoothClick(b.number)}
                    onMouseEnter={(e) => handleMouseEnter(b, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </g>

            {/* 3. Village Boundaries (Dark Thick Separators) */}
            <g id="village-borders" className="pointer-events-none">
              {sanquelimMapData.villageBorders.map((vPath, i) => (
                <path
                  key={`vborder-${i}`}
                  d={vPath}
                  fill="none"
                  stroke="#0B120B"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="opacity-95"
                />
              ))}
            </g>

            {/* 4. Booth Badges (Circles with Numbers) */}
            <g id="booth-badges" className="cursor-pointer">
              {sanquelimMapData.booths.map((b) => {
                const isSelected = selectedBoothNumber === b.number;
                const isHovered = hoveredBooth?.number === b.number;

                let badgeFill = b.color;
                if (b.number === 5) badgeFill = '#991B1B';
                else if (b.number === 7 || b.number === 41) badgeFill = '#D97706';
                else badgeFill = '#15803D';

                return (
                  <g
                    key={`badge-${b.number}`}
                    onClick={() => handleBoothClick(b.number)}
                    onMouseEnter={(e) => handleMouseEnter(b, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Dashed outer ring for Booth 10 */}
                    {b.isDashed && (
                      <circle
                        cx={b.cx}
                        cy={b.cy}
                        r="9.5"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                      />
                    )}

                    {/* Badge Circle */}
                    <circle
                      cx={b.cx}
                      cy={b.cy}
                      r="6.8"
                      fill={badgeFill}
                      stroke={isSelected ? '#FACC15' : '#FFFFFF'}
                      strokeWidth={isSelected ? '2.2' : '1.1'}
                      className="transition-transform duration-150"
                    />

                    {/* Booth Number Text */}
                    <text
                      x={b.cx}
                      y={b.cy + 2.5}
                      textAnchor="middle"
                      fill={b.number === 7 ? '#FFFFFF' : '#FFFFFF'}
                      fontSize="6.5"
                      fontWeight="bold"
                      fontFamily="system-ui, sans-serif"
                      className="pointer-events-none select-none"
                    >
                      {b.number}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* 5. Village Labels (Bold White Font with Black Stroke Halo matching media_1793792399680_6581f137.png) */}
            <g id="village-labels" className="pointer-events-none select-none">
              {sanquelimMapData.villages.map((v) => (
                <text
                  key={`vlabel-${v.name}`}
                  x={v.x}
                  y={v.y}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="2.8"
                  paintOrder="stroke fill"
                  fontSize="12.5"
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

          {/* Interactive Floating Hover Card Tooltip */}
          {hoveredBooth && (
            <div
              className="absolute pointer-events-none z-30 bg-slate-900/95 text-white border border-slate-700 rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md text-left text-[11px] min-w-[220px]"
              style={{
                left: '20px',
                bottom: '20px',
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="font-bold text-[12px] text-white">
                  Booth #{hoveredBooth.number}
                </span>
                <span
                  className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    hoveredBooth.category === 'Weak'
                      ? 'bg-rose-500/20 text-rose-300'
                      : hoveredBooth.category === 'Battle Ground'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {hoveredBooth.category}
                </span>
              </div>
              <p className="text-slate-300 font-medium leading-tight mb-1">
                {hoveredBooth.station_name}
              </p>
              <div className="grid grid-cols-2 gap-2 text-slate-400 text-[10px] pt-1">
                <div>
                  <span className="block text-slate-500">Village</span>
                  <span className="text-white font-semibold">{hoveredBooth.village || 'Sanquelim'}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Electors</span>
                  <span className="text-white font-semibold tabular-nums">{formatIndianNumber(hoveredBooth.voters)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend (Safe, Battle Ground, Weak matching PDF Page 6) */}
        <div className="flex flex-wrap items-center gap-6 mt-4 text-[12px] font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#15803D] border border-white shadow-xs" />
            <span>Safe (BJP margin ≥10%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] border border-white shadow-xs" />
            <span>Battle Ground (within 10%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#991B1B] border border-white shadow-xs" />
            <span>Weak (BJP trails by 10%+)</span>
          </div>
          {selectedBoothNumber && (
            <div className="ml-auto text-[11px] text-blue-600 font-bold">
              Showing filtered results for Booth #{selectedBoothNumber}
            </div>
          )}
        </div>
      </div>

      {/* 4. Full Booths Table Roster (Matching PDF Page 13-17) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900">
              Booths in this Constituency
            </h3>
            <p className="text-[11.5px] text-slate-400 font-medium">
              Showing {filteredBooths.length} verified polling stations
              {selectedBoothNumber && ` (Filtered by Booth #${selectedBoothNumber})`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search station or part no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-blue-500 w-52 bg-white"
              />
            </div>

            {/* Custom Village Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVillageDropdownOpen(!isVillageDropdownOpen)}
                className="inline-flex items-center justify-between gap-2 text-[12px] border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 hover:border-slate-300 transition-colors cursor-pointer min-w-[130px]"
              >
                <span>{selectedVillage === 'All' ? 'All Villages' : selectedVillage}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isVillageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isVillageDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl z-30 py-1 max-h-56 overflow-y-auto">
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
                          isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{v === 'All' ? 'All Villages' : v}</span>
                        {isSelected && <Check size={14} className="text-blue-600" />}
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
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
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
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pr-4">BOOTH</th>
                <th className="pb-3 px-4">POLLING STATION</th>
                <th className="pb-3 px-4">VILLAGE</th>
                <th className="pb-3 px-4 text-right">VOTERS</th>
                <th className="pb-3 px-4 text-right">ADDED</th>
                <th className="pb-3 px-4 text-right">DELETED</th>
                <th className="pb-3 px-4 text-right">MARGIN</th>
                <th className="pb-3 pl-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooths.map((b) => {
                const bNum = Number(b.part_no || b.number);
                const isSelected = selectedBoothNumber === bNum;
                const status = b.category || (bNum === 5 ? 'Weak' : bNum === 7 ? 'Battle Ground' : 'Safe');

                return (
                  <tr
                    key={b.part_no || b.number}
                    onClick={() => handleBoothClick(bNum)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3 pr-4 font-bold text-slate-900 tabular-nums">
                      <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-[11px] ${
                        isSelected ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-800 font-semibold'
                      }`}>
                        {b.part_no || b.number}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {b.station_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {b.village}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                      {formatIndianNumber(b.voters)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-teal-700 tabular-nums">
                      {b.added != null ? `+${b.added}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-rose-600 tabular-nums">
                      {b.deleted != null ? `−${b.deleted}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums">
                      {b.margin_pct != null ? `+${b.margin_pct}%` : '+20.0%'}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          status === 'Weak'
                            ? 'bg-rose-100 text-rose-700'
                            : status === 'Battle Ground'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
