import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  X,
  Landmark,
  Users,
  UserPlus,
  UserMinus,
  MapPin,
  ArrowUpDown,
  AlertTriangle,
  ShieldCheck,
  Layers,
  Info
} from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import sanquelimMapData from '../data/sanquelim-map.json';
import porvorimMapData from '../data/porvorim-map.json';
import aldonaMapData from '../data/aldona-map.json';
import BoothDetailModal from './BoothDetailModal';

const ELECTION_OPTIONS = [
  'Overall',
  '2024 LS',
  '2022 AE',
  '2019 LS',
  '2017 AE',
  '2014 LS',
  '2012 AE',
];

const ELECTION_DESCRIPTIONS = {
  'Overall': "Overall = each booth's average BJP margin across all verified elections.",
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

  // Resolve active map data
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
      villageFont: roundTo(11.0 * ratio, 1),
      haloStroke: roundTo(2.6 * ratio, 1),
      borderStroke: roundTo(2.2 * ratio, 1),
    };
  }, [activeMap.viewBox]);

  // Full booth roster
  const rawBooths = useMemo(() => {
    if (activeMap?.booths && activeMap.booths.length > 0) return activeMap.booths;
    if (spatial?.booths && spatial.booths.length > 0) return spatial.booths;
    return sanquelimMapData.booths || [];
  }, [activeMap, spatial]);

  // Calculate cumulative additions and deletions matching the 5-stage timeline
  const totalRollAdded = useMemo(() => {
    if (data?.roll_progression?.length) {
      return data.roll_progression.reduce((sum, p) => sum + (p.added_count || 0), 0);
    }
    return meta.sir_added || 761;
  }, [data?.roll_progression, meta.sir_added]);

  const totalRollDeleted = useMemo(() => {
    if (data?.roll_progression?.length) {
      return data.roll_progression.reduce((sum, p) => sum + (p.deleted_count || 0), 0);
    }
    return meta.sir_deleted || 702;
  }, [data?.roll_progression, meta.sir_deleted]);

  // Filter & UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedElection, setSelectedElection] = useState('Overall');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'NEEDS_ATTENTION' | 'BATTLE_GROUND' | 'WEAK' | 'SAFE'
  const [sortBy, setSortBy] = useState('part_asc'); // 'part_asc' | 'margin_asc' | 'margin_desc' | 'voters_desc'
  const [selectedBoothNumber, setSelectedBoothNumber] = useState(null);
  const [hoveredBooth, setHoveredBooth] = useState(null);
  const [isVillageDropdownOpen, setIsVillageDropdownOpen] = useState(false);
  const [modalBooth, setModalBooth] = useState(null);

  // Unique villages for filter dropdown (includes Virdi & Maulinguem)
  const uniqueVillages = useMemo(() => {
    return ['All', ...new Set(rawBooths.map((b) => b.village).filter(Boolean))];
  }, [rawBooths]);

  // Helper to resolve margin, category, color, winner, and dashed status
  // STRICT, NON-OVERLAPPING RULE:
  // - Safe: margin > 10.0%
  // - Battle Ground: margin between -10.0% and +10.0% (inclusive)
  // - Weak: margin < -10.0%
  const getBoothElectionData = (b) => {
    if (!b) {
      return { margin: 0, category: 'Safe', color: '#15803D', winner: 'BJP', isDashed: false };
    }

    if (b.elections && b.elections[selectedElection]) {
      const eData = b.elections[selectedElection];
      // Normalize category strictly based on exact margin value
      const m = eData.margin != null ? eData.margin : 0;
      let cat = 'Safe';
      let col = '#15803D';
      if (m < -10.0) {
        cat = 'Weak';
        col = '#991B1B';
      } else if (m <= 10.0) {
        cat = 'Battle Ground';
        col = '#D97706';
      }

      return {
        ...eData,
        category: cat,
        color: col,
        winner: eData.winner || (m >= 0 ? 'BJP' : 'INC'),
      };
    }

    const baseMargin = b.margin_pct != null ? b.margin_pct : 15.0;
    let cat = 'Safe';
    let col = '#15803D';
    if (baseMargin < -10.0) {
      cat = 'Weak';
      col = '#991B1B';
    } else if (baseMargin <= 10.0) {
      cat = 'Battle Ground';
      col = '#D97706';
    }

    return {
      margin: baseMargin,
      category: cat,
      color: col,
      winner: baseMargin >= 0 ? 'BJP' : 'INC',
      isDashed: !!b.isDashed,
    };
  };

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
      if (stats.category === 'Weak') weak++;
      else if (stats.category === 'Battle Ground') battle++;
      else safe++;
      totalMargin += (stats.margin || 0);
    });
    const avgMargin = rawBooths.length > 0 ? (totalMargin / rawBooths.length).toFixed(1) : '0';
    return { safe, battle, weak, needsAttention: battle + weak, avgMargin };
  }, [rawBooths, selectedElection]);

  // Filtered and Sorted booth roster
  const filteredBooths = useMemo(() => {
    return rawBooths
      .filter((b) => {
        const bNum = Number(b.part_no || b.number);
        if (selectedBoothNumber && bNum !== selectedBoothNumber) {
          return false;
        }

        const stats = getBoothElectionData(b);
        if (statusFilter === 'NEEDS_ATTENTION' && stats.category === 'Safe') return false;
        if (statusFilter === 'BATTLE_GROUND' && stats.category !== 'Battle Ground') return false;
        if (statusFilter === 'WEAK' && stats.category !== 'Weak') return false;
        if (statusFilter === 'SAFE' && stats.category !== 'Safe') return false;

        const matchesSearch =
          (b.station_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (b.village || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(b.part_no || b.number).includes(searchTerm);
        const matchesVillage = selectedVillage === 'All' || b.village === selectedVillage;
        return matchesSearch && matchesVillage;
      })
      .sort((a, b) => {
        const aNum = Number(a.part_no || a.number);
        const bNum = Number(b.part_no || b.number);
        const aStats = getBoothElectionData(a);
        const bStats = getBoothElectionData(b);

        if (sortBy === 'margin_asc') {
          return (aStats.margin || 0) - (bStats.margin || 0); // Weakest / lowest margin first
        }
        if (sortBy === 'margin_desc') {
          return (bStats.margin || 0) - (aStats.margin || 0); // Strongest first
        }
        if (sortBy === 'voters_desc') {
          return (b.voters || 0) - (a.voters || 0);
        }
        return aNum - bNum; // Default: part_asc
      });
  }, [rawBooths, searchTerm, selectedVillage, selectedBoothNumber, statusFilter, sortBy, selectedElection]);

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
    <div className="px-6 md:px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Header Title & Election Abbreviation Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-[28px] md:text-[30px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Booth Analysis & Spatial Margins
          </h2>
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Electoral geography, historical Form-20 returns, and statutory polling booth roster across {meta.ac_name || 'Sanquelim'}
          </p>
        </div>

        {/* ECI Election Acronym Key Pill */}
        <div className="inline-flex items-center gap-2 bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800/80 rounded-xl px-3.5 py-2 text-[11px] font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span><strong className="text-slate-900 dark:text-slate-100 font-bold">AE</strong>: Assembly Election</span>
          <span className="opacity-40">•</span>
          <span><strong className="text-slate-900 dark:text-slate-100 font-bold">LS</strong>: Lok Sabha (Parliament)</span>
        </div>
      </div>

      {/* 2. Top 4 Elevated KPI Strip (Matching Modern Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL BOOTHS */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Total Booths
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <p className="font-serif text-[30px] md:text-[32px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none tracking-tight">
              {rawBooths.length || meta.total_booths || 50}
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Designated voting stations
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Across 9 revenue areas</span>
          </div>
        </div>

        {/* Card 2: ACTIVE ELECTORS */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between hover:border-teal-400/50 dark:hover:border-teal-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Active Electors
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-900/60 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <p className="font-serif text-[30px] md:text-[32px] font-bold text-teal-700 dark:text-teal-400 tabular-nums leading-none tracking-tight">
              {formatIndianNumber(meta.total_voters || 27265)}
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Enrolled constituency voters
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>Avg ~545 voters / booth</span>
          </div>
        </div>

        {/* Card 3: ADDED (CUMULATIVE STAGES) */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-400/50 dark:hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Added (All Stages)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <p className="font-serif text-[30px] md:text-[32px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums leading-none tracking-tight">
              +{formatIndianNumber(totalRollAdded)}
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              New additions across stages
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Matches Overview progression</span>
          </div>
        </div>

        {/* Card 4: DELETED (CUMULATIVE STAGES) */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between hover:border-rose-400/50 dark:hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Deleted (All Stages)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-2xs">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <p className="font-serif text-[30px] md:text-[32px] font-bold text-rose-600 dark:text-rose-400 tabular-nums leading-none tracking-tight">
              −{formatIndianNumber(totalRollDeleted)}
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              ASDDO purge deletions
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Includes Oct 2026 Supp-4</span>
          </div>
        </div>
      </div>

      {/* 3. High-Contrast Spatial Vector Map Card */}
      <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-7 shadow-xs space-y-4">
        {/* Top Controls: Title, Election Selector Pills, and Filter Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-[20px] md:text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                Form-20 Spatial Margin Retrospective
              </h3>
              {selectedBoothNumber && (
                <button
                  type="button"
                  onClick={() => setSelectedBoothNumber(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                >
                  <span>Booth #{selectedBoothNumber}</span>
                  <X size={12} />
                </button>
              )}
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              {ELECTION_DESCRIPTIONS[selectedElection] || ELECTION_DESCRIPTIONS['Overall']}
            </p>
          </div>

          {/* Election Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-[#131F38] p-1 rounded-xl text-[11.5px] font-semibold border border-slate-200/80 dark:border-slate-800">
            {ELECTION_OPTIONS.map((elec) => (
              <button
                key={elec}
                type="button"
                onClick={() => setSelectedElection(elec)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                  selectedElection === elec
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/70'
                }`}
              >
                {elec}
              </button>
            ))}
          </div>
        </div>

        {/* Integrated Live Legend Strip (Directly above the map so users never scroll for it!) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#131F38] border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-[12px]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#15803D] border border-white dark:border-slate-800 shadow-2xs" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Safe (&gt;+10%): <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{electionSummary.safe} {electionSummary.safe === 1 ? 'booth' : 'booths'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] border border-white dark:border-slate-800 shadow-2xs" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Battle Ground (±10%): <strong className="text-amber-700 dark:text-amber-400 font-bold">{electionSummary.battle} {electionSummary.battle === 1 ? 'booth' : 'booths'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#991B1B] border border-white dark:border-slate-800 shadow-2xs" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Weak (&lt;−10%): <strong className="text-rose-700 dark:text-rose-400 font-bold">{electionSummary.weak} {electionSummary.weak === 1 ? 'booth' : 'booths'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">
            <span>
              AC Avg Margin: <strong className="text-slate-900 dark:text-slate-100 tabular-nums">{electionSummary.avgMargin > 0 ? '+' : ''}{electionSummary.avgMargin}%</strong>
            </span>
            {selectedBoothNumber && (
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                Booth #{selectedBoothNumber} Active
              </span>
            )}
          </div>
        </div>

        {/* High-Contrast Spatial Canvas with Slate Border */}
        <div className="w-full bg-[#0B1120] dark:bg-[#060B16] rounded-2xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center p-3 select-none min-h-[440px] shadow-inner">
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
                className="opacity-70"
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
                    stroke={isSelected ? '#FACC15' : isHovered ? '#FFFFFF' : '#0B1120'}
                    strokeWidth={isSelected ? '2.8' : isHovered ? '2.2' : '1.1'}
                    className="transition-colors duration-150 cursor-pointer opacity-90 hover:opacity-100"
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
                  stroke="#060B16"
                  strokeWidth={mapScale.borderStroke || '2.2'}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="opacity-95"
                />
              ))}
            </g>

            {/* 4. Village Labels (RENDERED UNDER BOOTH BADGES SO NUMBERS ARE NEVER COVERED!) */}
            <g id="village-labels" className="pointer-events-none select-none opacity-80">
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
                  letterSpacing="0.04em"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  filter="url(#villageTextGlow)"
                >
                  {v.name}
                </text>
              ))}
            </g>

            {/* 5. Booth Badges (RENDERED ON TOP OF VILLAGE LABELS FOR UNHINDERED VISIBILITY!) */}
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
                      strokeWidth={isSelected ? '2.4' : '1.2'}
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
          </svg>

          {/* Floating Hover Card Tooltip */}
          {hoveredBooth && (() => {
            const hStats = getBoothElectionData(hoveredBooth);
            return (
              <div
                className="absolute pointer-events-none z-30 bg-slate-900/95 text-white border border-slate-700/80 rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md text-left text-[11px] min-w-[240px]"
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
      </div>

      {/* 4. Full Booths Table Roster with Status Filters & Sorting */}
      <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-7 shadow-xs space-y-4">
        {/* Table Title and Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-[20px] md:text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              Polling Stations Roster
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Showing <strong className="text-slate-800 dark:text-slate-200">{filteredBooths.length}</strong> of {rawBooths.length} stations in <strong className="text-blue-600 dark:text-blue-400">{selectedElection}</strong>
              {selectedBoothNumber && ` (Booth #${selectedBoothNumber} Filter Active)`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search station, village, or part #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 dark:border-slate-700/80 rounded-xl outline-none focus:border-blue-500 w-56 bg-slate-50/70 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Custom Village Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVillageDropdownOpen(!isVillageDropdownOpen)}
                className="inline-flex items-center justify-between gap-2 text-[12px] border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 bg-slate-50/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer min-w-[130px]"
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

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[12px] border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 bg-slate-50/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="part_asc">Sort: Part # (1 → 50)</option>
                <option value="margin_asc">Sort: Lowest Margin (Weak First)</option>
                <option value="margin_desc">Sort: Highest Margin (Safe First)</option>
                <option value="voters_desc">Sort: Most Electors</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(selectedBoothNumber || selectedVillage !== 'All' || searchTerm || statusFilter !== 'ALL' || sortBy !== 'part_asc') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBoothNumber(null);
                  setSelectedVillage('All');
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setSortBy('part_asc');
                }}
                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Status Filter Tabs (Addresses Problem #10: "47 rows say SAFE - weak & battleground should be easy to find") */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mr-1">
            Status Filter:
          </span>

          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                : 'bg-slate-100 dark:bg-[#131F38] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All ({rawBooths.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('NEEDS_ATTENTION')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              statusFilter === 'NEEDS_ATTENTION'
                ? 'bg-amber-600 text-white shadow-2xs ring-1 ring-amber-500'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Needs Attention ({electionSummary.needsAttention})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('BATTLE_GROUND')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              statusFilter === 'BATTLE_GROUND'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-[#131F38] text-amber-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Battle Ground ({electionSummary.battle})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('WEAK')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              statusFilter === 'WEAK'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-[#131F38] text-rose-700 dark:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Weak ({electionSummary.weak})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('SAFE')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              statusFilter === 'SAFE'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-[#131F38] text-emerald-700 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Safe ({electionSummary.safe})
          </button>
        </div>

        {/* Table Roster */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 font-bold uppercase text-[10.5px] tracking-wider">
                <th className="pb-3 pr-3">BOOTH</th>
                <th className="pb-3 px-3">POLLING STATION</th>
                <th className="pb-3 px-3">VILLAGE / LOCALITY</th>
                <th className="pb-3 px-3 text-right">ELECTORS</th>
                <th className="pb-3 px-3 text-right">ADDED</th>
                <th className="pb-3 px-3 text-right">DELETED</th>
                <th className="pb-3 px-3 text-right">
                  MARGIN ({selectedElection === 'Overall' ? 'AVG' : selectedElection}) &amp; STATUS
                </th>
                <th className="pb-3 pl-3 text-right">DOSSIER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredBooths.map((b) => {
                const bNum = Number(b.part_no || b.number);
                const isSelected = selectedBoothNumber === bNum;
                const stats = getBoothElectionData(b);
                const status = stats.category;
                const margin = stats.margin;

                const isBattleOrWeak = status === 'Battle Ground' || status === 'Weak';

                return (
                  <tr
                    key={b.part_no || b.number}
                    onClick={() => handleBoothClick(b)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/50 font-semibold'
                        : isBattleOrWeak
                        ? 'bg-amber-50/30 dark:bg-amber-950/20 hover:bg-amber-50/60 dark:hover:bg-amber-950/40'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Part No Circle */}
                    <td className="py-3 pr-3 font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      <span
                        className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-[11px] ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold'
                        }`}
                      >
                        {b.part_no || b.number}
                      </span>
                    </td>

                    {/* Polling Station Name */}
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">
                      {b.station_name}
                    </td>

                    {/* Village Name */}
                    <td className="py-3 px-3 font-medium">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                        {b.village}
                      </span>
                    </td>

                    {/* Electors Count */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatIndianNumber(b.voters)}
                    </td>

                    {/* Added */}
                    <td className="py-3 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {b.added != null ? `+${b.added}` : '—'}
                    </td>

                    {/* Deleted */}
                    <td className="py-3 px-3 text-right font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                      {b.deleted != null ? `−${b.deleted}` : '—'}
                    </td>

                    {/* Margin & Status Combined (Addresses Problem #12: eliminates empty space!) */}
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <span
                          className={`font-serif text-[13px] font-bold tabular-nums ${
                            margin > 10
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : margin >= -10
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {margin != null ? `${margin > 0 ? '+' : ''}${margin}%` : '—'}
                        </span>

                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                            status === 'Weak'
                              ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                              : status === 'Battle Ground' || status === 'Battleground'
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                              : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </td>

                    {/* Dossier Link */}
                    <td className="py-3 pl-3 text-right">
                      <span className="opacity-0 group-hover:opacity-100 text-[11px] font-bold text-blue-600 dark:text-blue-400 transition-opacity">
                        View Dossier →
                      </span>
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
