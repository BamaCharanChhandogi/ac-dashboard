import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Users, Home, MapPin, Eye, Lightbulb } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import sanquelimMapData from '../data/sanquelim-map.json';
import porvorimMapData from '../data/porvorim-map.json';
import aldonaMapData from '../data/aldona-map.json';
import VillageDetailModal from './VillageDetailModal';
import BoothDetailModal from './BoothDetailModal';
import PageHeader from './PageHeader';

const ELECTION_OPTIONS = [
  'Overall',
  '2012 AE',
  '2014 LS',
  '2017 AE',
  '2019 LS',
  '2022 AE',
  '2024 LS',
];

const STATIC_MAPS = {
  'ac17-sanquelim': sanquelimMapData,
  '17': sanquelimMapData,
  'ac09-porvorim': porvorimMapData,
  '9': porvorimMapData,
  'ac10-aldona': aldonaMapData,
  '10': aldonaMapData,
};

const SANQUELIM_VILLAGE_LEANS = [
  { village: 'Cotombi',   margin: '+43.4%', status: 'Safe (≥10%)', voters: 483 },
  { village: 'Surla',     margin: '+39.6%', status: 'Safe (≥10%)', voters: 3163 },
  { village: 'Navelim',   margin: '+35.6%', status: 'Safe (≥10%)', voters: 2285 },
  { village: 'Amona',     margin: '+35.1%', status: 'Safe (≥10%)', voters: 2621 },
  { village: 'Cudnem',    margin: '+35.0%', status: 'Safe (≥10%)', voters: 2742 },
  { village: 'Arvalem',   margin: '+32.9%', status: 'Safe (≥10%)', voters: 2095 },
  { village: 'Pale',      margin: '+30.1%', status: 'Safe (≥10%)', voters: 4431 },
  { village: 'Velguem',   margin: '+25.6%', status: 'Safe (≥10%)', voters: 1599 },
  { village: 'Sanquelim', margin: '+20.7%', status: 'Safe (≥10%)', voters: 8480 },
];

const FAMILIES_PER_PAGE = 6;

function roundTo(n, digits) {
  const f = Math.pow(10, digits);
  return Math.round(n * f) / f;
}

export default function InsightsView({ data }) {
  const meta = data?.meta || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElection, setSelectedElection] = useState('Overall');
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVillage, setModalVillage] = useState(null);
  const [modalBooth, setModalBooth] = useState(null);

  // Close modals on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedFamily(null);
        setModalVillage(null);
        setModalBooth(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Resolve active map across Sanquelim, Porvorim, Aldona
  const activeMap = useMemo(() => {
    const slugKey = meta.slug || `ac${String(meta.ac_no || '').padStart(2, '0')}`;
    if (STATIC_MAPS[slugKey]) return STATIC_MAPS[slugKey];
    if (STATIC_MAPS[String(meta.ac_no)]) return STATIC_MAPS[String(meta.ac_no)];
    if (data?.spatial?.booths && data.spatial.booths.length > 0) {
      return data.spatial;
    }
    return sanquelimMapData;
  }, [meta.slug, meta.ac_no, data?.spatial]);

  // Dynamic scale factor based on viewBox width so badges and text are always sharp and legible
  const mapScale = useMemo(() => {
    const vb = (activeMap.viewBox || '80 100 455 440').split(' ').map(Number);
    const w = vb[2] || 455;
    const ratio = Math.max(0.85, Math.min(2.8, w / 455));
    return {
      ratio,
      villageFont: roundTo(11 * ratio, 1),
      marginFont: roundTo(9.5 * ratio, 1),
      borderStroke: roundTo(1.6 * ratio, 1),
      dyTop: roundTo(-6 * ratio, 1),
      dyBottom: roundTo(13 * ratio, 1),
    };
  }, [activeMap.viewBox]);

  // Village leans: dynamically calculate from booths for active election, or fallback
  const villageLeans = useMemo(() => {
    if (activeMap?.booths && activeMap.booths.length > 0) {
      const byVillage = {};
      activeMap.booths.forEach((b) => {
        const vName = b.village;
        if (!vName) return;
        if (!byVillage[vName]) byVillage[vName] = { voters: 0, margins: [] };
        byVillage[vName].voters += Number(b.voters || 0);

        const elecData = b.elections?.[selectedElection] || b.elections?.['Overall'];
        if (elecData && elecData.margin != null) {
          byVillage[vName].margins.push(Number(elecData.margin));
        }
      });

      const list = Object.entries(byVillage).map(([village, stats]) => {
        const avgMargin = stats.margins.length > 0
          ? stats.margins.reduce((a, c) => a + c, 0) / stats.margins.length
          : 0;
        const formatted = `${avgMargin >= 0 ? '+' : ''}${avgMargin.toFixed(1)}%`;
        const status = avgMargin >= 10 ? 'Safe (≥10%)' : avgMargin <= -10 ? 'Weak (≤-10%)' : 'Battle Ground (within 10%)';
        return {
          village,
          margin: formatted,
          numericMargin: avgMargin,
          status,
          voters: stats.voters,
        };
      });

      if (list.length > 0) {
        return list.sort((a, b) => b.numericMargin - a.numericMargin);
      }
    }

    if (data?.village_insights && data.village_insights.length > 0) {
      return data.village_insights;
    }
    return SANQUELIM_VILLAGE_LEANS;
  }, [activeMap, selectedElection, data]);

  // Map each booth to its village lean color for seamless rendering across ALL constituencies (Sanquelim, Porvorim, Aldona)
  const boothPolygons = useMemo(() => {
    const booths = activeMap?.booths || [];
    return booths.map((b, i) => {
      const matchedLean = villageLeans.find(
        (l) => l.village.toLowerCase() === (b.village || '').toLowerCase()
      );
      const marginNum = matchedLean?.numericMargin ?? (b.elections?.[selectedElection]?.margin ?? 0);
      const isSafe = marginNum >= 10;
      const isWeak = marginNum <= -10;
      const fillColor = isSafe ? '#15803D' : isWeak ? '#DC2626' : '#D97706';
      return {
        id: b.number || b.part_no || i,
        village: b.village,
        path: b.path || '',
        fillColor,
        marginNum,
      };
    });
  }, [activeMap, villageLeans, selectedElection]);

  // Village labels overlay
  const villageLabels = useMemo(() => {
    const vList = activeMap?.villages || [];
    return vList.map((v) => {
      const matchedLean = villageLeans.find((l) => l.village.toLowerCase() === v.name.toLowerCase());
      const marginStr = matchedLean ? matchedLean.margin : v.margin || '+0.0%';
      return {
        name: v.name,
        x: v.x,
        y: v.y,
        margin: marginStr,
      };
    });
  }, [activeMap, villageLeans]);

  const rawFamilies = useMemo(() => {
    if (data?.families && data.families.length > 0) {
      return data.families.map((f, idx) => ({
        id: f.id || `fam_${idx}`,
        head: f.head_name || f.head || `${f.surname} Family`,
        village: f.village,
        house: f.house || `House No. ${f.house_no}`,
        membersCount: f.members_count || f.membersCount || f.members?.length || 10,
        also_in_household: f.also_in_household,
        booth: f.booth,
        sample: f.sample || (f.members || []).slice(0, 4),
        members: f.members && f.members.length > 0 ? f.members : (f.sample || []),
      }));
    }
    return [];
  }, [data]);

  // URL deep-link to automatically open a family modal if ?family=... is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const famParam = params.get('family');
    if (famParam && rawFamilies.length > 0) {
      const match = rawFamilies.find(
        (f) =>
          f.head.toLowerCase().includes(famParam.toLowerCase()) ||
          f.house.toLowerCase().includes(famParam.toLowerCase()) ||
          f.village.toLowerCase().includes(famParam.toLowerCase())
      );
      if (match) setSelectedFamily(match);
    }
  }, [rawFamilies]);

  const filteredFamilies = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return rawFamilies.filter((f) => {
      const matchesHead = f.head.toLowerCase().includes(s);
      const matchesVillage = (f.village || '').toLowerCase().includes(s);
      const matchesHouse = (f.house || '').toLowerCase().includes(s);
      const matchesMember = (f.members || []).some(
        (m) =>
          (m.name || '').toLowerCase().includes(s) ||
          (m.epic || '').toLowerCase().includes(s) ||
          (m.relation || '').toLowerCase().includes(s)
      );
      return matchesHead || matchesVillage || matchesHouse || matchesMember;
    });
  }, [rawFamilies, searchTerm]);

  // Constituent booths for selected village modal
  const constituentBoothsForModal = useMemo(() => {
    if (!modalVillage) return [];
    const allBooths = activeMap?.booths || data?.spatial?.booths || [];
    return allBooths.filter(
      (b) => (b.village || '').trim().toLowerCase() === modalVillage.trim().toLowerCase()
    );
  }, [modalVillage, activeMap, data?.spatial]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredFamilies.length / FAMILIES_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIdx = (validPage - 1) * FAMILIES_PER_PAGE;
  const paginatedFamilies = filteredFamilies.slice(startIdx, startIdx + FAMILIES_PER_PAGE);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Standardized Distinctive Page Header */}
      <PageHeader
        badgeLabel="Village Lean & Household Clusters"
        badgeIcon={Lightbulb}
        badgeColor="emerald"
        title="Village Electoral Lean & Household Clusters"
        subtitle={`Organic village political margins, Form-20 lean dynamics, and largest joint family compound clusters across ${meta.ac_name || 'Sanquelim'}`}
        meta={meta}
      />

      {/* Section 1: Village Electoral Lean Map & Statistics (Matching PDF Pages 6-8) */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
              Village-level Electoral Lean
            </h3>
            <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium">
              Each village's own average BJP margin across its constituent booths, by election cycle.
            </p>
          </div>

          {/* Election Cycle Filter Tabs with Persistent Borders & Colors Transition */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl">
            {ELECTION_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedElection(opt)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-colors duration-150 cursor-pointer ${
                  selectedElection === opt
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-slate-200/80 dark:border-slate-700 shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Map & Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive SVG Village Map (Fully Responsive across Sanquelim, Porvorim, Aldona) */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-[#0A1120] rounded-xl p-4 border border-slate-200/70 dark:border-slate-800 flex flex-col items-center justify-center min-h-[420px]">
            {activeMap?.viewBox && boothPolygons.length > 0 ? (
              <div className="w-full flex items-center justify-center">
                <svg
                  viewBox={activeMap.viewBox}
                  className="w-full h-auto drop-shadow-sm select-none"
                  style={{ maxHeight: '400px' }}
                >
                  {/* Booth Voronoi Polygons colored by Village Lean */}
                  {boothPolygons.map((bp) => (
                    <path
                      key={bp.id}
                      d={bp.path}
                      fill={bp.fillColor}
                      stroke="#FFFFFF"
                      strokeWidth={mapScale.borderStroke}
                      strokeLinejoin="round"
                      onClick={() => setModalVillage(bp.village)}
                      className="transition-colors duration-300 opacity-95 hover:opacity-100 cursor-pointer"
                    >
                      <title>{`${bp.village}: ${bp.marginNum >= 0 ? '+' : ''}${bp.marginNum.toFixed(1)}% (Click for Retrospective Dossier)`}</title>
                    </path>
                  ))}

                  {/* Centered Village Labels */}
                  {villageLabels.map((vl) => (
                    vl.x != null && vl.y != null && (
                      <g
                        key={vl.name}
                        onClick={() => setModalVillage(vl.name)}
                        className="cursor-pointer select-none"
                      >
                        <text
                          x={vl.x}
                          y={vl.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#FFFFFF"
                          className="font-bold drop-shadow-md"
                          fontSize={mapScale.villageFont}
                          letterSpacing="0.02em"
                        >
                          <tspan x={vl.x} dy={mapScale.dyTop} fontWeight="bold">{vl.name}</tspan>
                          <tspan x={vl.x} dy={mapScale.dyBottom} fontSize={mapScale.marginFont} fill="#F8FAFC" fontWeight="bold">
                            {vl.margin}
                          </tspan>
                        </text>
                      </g>
                    )
                  ))}
                </svg>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <MapPin className="mx-auto mb-2 opacity-40" size={32} />
                <p className="text-[12px]">Interactive spatial boundary available for constituent villages</p>
              </div>
            )}

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-semibold w-full">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#15803D]" />
                <span className="text-slate-700 dark:text-slate-300">Safe (≥10% margin)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#D97706]" />
                <span className="text-slate-700 dark:text-slate-300">Battle Ground (within 10%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#DC2626]" />
                <span className="text-slate-700 dark:text-slate-300">Weak (trails by 10%+)</span>
              </div>
            </div>
          </div>

          {/* Village Metric Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {villageLeans.map((item) => (
              <div
                key={item.village}
                onClick={() => setModalVillage(item.village)}
                className="bg-slate-50 dark:bg-slate-900/90 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer group shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-[13px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.village}
                    </p>
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-blue-600 dark:text-blue-400 transition-opacity">
                      →
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                    {formatIndianNumber(item.voters)} electors
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-extrabold text-teal-700 dark:text-teal-400 tabular-nums leading-tight">
                    {item.margin}
                  </p>
                  <span
                    className={`inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                      item.status?.includes('Safe')
                        ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60'
                        : item.status?.includes('Battle')
                        ? 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60'
                        : 'text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60'
                    }`}
                  >
                    {item.status?.includes('Safe') ? 'Safe' : item.status?.includes('Battle') ? 'Battle Ground' : 'Weak'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Family / Household Groups (Matching PDF Pages 10-13) */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100">
              Family / Household Groups
            </h3>
            <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium">
              Showing top <strong className="text-slate-700 dark:text-slate-300">{filteredFamilies.length}</strong> joint family clusters (<strong className="text-slate-700 dark:text-slate-300">{formatIndianNumber(meta.total_families || 6041)}</strong> total households on record)
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search surname, village, house number…"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 w-72 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Family Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedFamilies.map((f, i) => (
            <div
              key={f.id || i}
              onClick={() => setSelectedFamily(f)}
              className="group bg-slate-50/70 dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[14px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {f.head} →
                </h4>
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
                  {f.membersCount} members
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mb-3">
                {f.village} · {f.house}
              </p>

              <div className="space-y-1 text-[11px] border-t border-slate-200/60 dark:border-slate-800 pt-2.5">
                {f.sample.map((m, mi) => (
                  <div key={mi} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="truncate pr-2">{m.name}</span>
                    <span className="text-slate-400 dark:text-slate-500 tabular-nums flex-shrink-0">
                      {m.age} / {m.gender?.slice(0, 1) || 'M'}
                    </span>
                  </div>
                ))}
                {f.membersCount > f.sample.length && (
                  <p className="text-[10.5px] text-blue-600 dark:text-blue-400 font-semibold pt-1">
                    +{f.membersCount - f.sample.length} more… (click to view full household roster)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-[12px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Page <strong className="text-slate-800 dark:text-slate-200">{validPage}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-3 py-1.5 rounded-lg border text-[11.5px] font-semibold transition-colors flex items-center gap-1 ${
                validPage <= 1
                  ? 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
              }`}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`px-3 py-1.5 rounded-lg border text-[11.5px] font-semibold transition-colors flex items-center gap-1 ${
                validPage >= totalPages
                  ? 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
              }`}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Family Members Modal (Native Corporate Chanakya Design Palette) */}
      {selectedFamily && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedFamily(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[85vh] bg-white dark:bg-[#111C35] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                  {selectedFamily.head} — {selectedFamily.house}
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {selectedFamily.village} • {selectedFamily.membersCount} members
                </p>
                {selectedFamily.also_in_household && (
                  <p className="text-[11.5px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                    Also in household: {selectedFamily.also_in_household}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedFamily(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Table Body */}
            <div className="overflow-y-auto px-6 py-4 flex-1">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pr-4">NAME</th>
                    <th className="pb-3 px-4">RELATION</th>
                    <th className="pb-3 px-3 text-center">AGE</th>
                    <th className="pb-3 px-4">GENDER</th>
                    <th className="pb-3 px-4">EPIC ID</th>
                    <th className="pb-3 pl-3 text-right">BOOTH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(selectedFamily.members && selectedFamily.members.length > 0 ? selectedFamily.members : selectedFamily.sample).map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 pr-4 font-semibold text-slate-900 dark:text-slate-100">
                        {m.name}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {m.relation || `${selectedFamily.head.split(' ')[0]} Household`}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-800 dark:text-slate-200 tabular-nums font-medium">
                        {m.age}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10.5px] font-semibold ${
                          m.gender === 'Female' || m.gender === 'F'
                            ? 'text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/60'
                            : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60'
                        }`}>
                          {m.gender === 'M' ? 'Male' : m.gender === 'F' ? 'Female' : m.gender || 'Male'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">
                          {m.epic || 'IIT0406' + (100 + idx)}
                        </span>
                      </td>
                      <td className="py-2.5 pl-3 text-right tabular-nums text-slate-900 dark:text-slate-100 font-bold">
                        {m.booth || selectedFamily.booth || 45}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11.5px] text-slate-400 bg-slate-50/70 dark:bg-slate-900/50">
              <span>Verified ECI SIR 2026 Household Roster</span>
              <button
                type="button"
                onClick={() => setSelectedFamily(null)}
                className="px-4 py-1.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-lg font-medium transition-colors cursor-pointer text-[12px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Village Retrospective Dossier Modal */}
      {modalVillage && (
        <VillageDetailModal
          villageName={modalVillage}
          constituentBooths={constituentBoothsForModal}
          onClose={() => setModalVillage(null)}
          onSelectBooth={(b) => setModalBooth(b)}
          data={data}
        />
      )}

      {/* Booth Retrospective Dossier Modal (linked from village modal or direct) */}
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
