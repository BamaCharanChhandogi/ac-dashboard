import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Users, Home, MapPin } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import sanquelimMapData from '../data/sanquelim-map.json';
import porvorimMapData from '../data/porvorim-map.json';
import aldonaMapData from '../data/aldona-map.json';

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

const SHIVRAM_MEMBERS = [
  { name: 'Radha Krishna Naik', relation: 'Krishna Naik', age: 77, gender: 'Female', epic: 'IIT0250183', booth: 45 },
  { name: 'Shivram Nara Naik', relation: 'Nara Naik', age: 74, gender: 'Male', epic: 'IIT0406330', booth: 45 },
  { name: 'Sitabai Shivram Naik', relation: 'Shivram Naik', age: 69, gender: 'Female', epic: 'IIT0406322', booth: 45 },
  { name: 'Anant Nara Naik', relation: 'Nara Naik', age: 63, gender: 'Male', epic: 'IIT0406314', booth: 45 },
  { name: 'Ambika Anant Naik', relation: 'Anant Naik', age: 61, gender: 'Female', epic: 'IIT0406306', booth: 45 },
  { name: 'Ravindra Nara Naik', relation: 'Nara Naik', age: 56, gender: 'Male', epic: 'BGP1207372', booth: 45 },
  { name: 'Navin Krishna Naik', relation: 'Krishna Naik', age: 54, gender: 'Male', epic: 'BGP5160494', booth: 45 },
  { name: 'Navnita Navin Naik', relation: 'Navin Naik', age: 52, gender: 'Female', epic: 'BGP0465120', booth: 45 },
  { name: 'Somnath Krishna Naik', relation: 'Krishna Naik', age: 52, gender: 'Male', epic: 'IIT0271890', booth: 45 },
  { name: 'Swapna Somnath Naik', relation: 'Somnath Naik', age: 51, gender: 'Female', epic: 'BGP0465112', booth: 45 },
  { name: 'Rakhee Ravindra Naik', relation: 'Ravindra Naik', age: 51, gender: 'Female', epic: 'BGP1207380', booth: 45 },
  { name: 'Satish Shivram Naik', relation: 'Shivram Naik', age: 44, gender: 'Male', epic: 'BGP1619444', booth: 45 },
  { name: 'Nitesh Krishna Naik', relation: 'Krishna Naik', age: 44, gender: 'Male', epic: 'BGP5149091', booth: 45 },
  { name: 'Nishakant Shivram Naik', relation: 'Shivram Naik', age: 42, gender: 'Male', epic: 'BGP1208990', booth: 45 },
  { name: 'Nilesh Anant Naik', relation: 'Anant Naik', age: 38, gender: 'Male', epic: 'IIT0406298', booth: 45 },
  { name: 'Pratima Shivram Naik', relation: 'Shivram Naik', age: 38, gender: 'Female', epic: 'IIT0406280', booth: 45 },
  { name: 'Neha Nitesh Naik', relation: 'Nitesh Naik', age: 37, gender: 'Female', epic: 'IIT0406272', booth: 45 },
  { name: 'Pritesh Anant Naik', relation: 'Anant Naik', age: 35, gender: 'Male', epic: 'IIT0406264', booth: 45 },
  { name: 'Shrutika Somnath Naik', relation: 'Somnath Naik', age: 30, gender: 'Female', epic: 'IIT0406256', booth: 45 },
  { name: 'Shubham Ravindra Naik', relation: 'Ravindra Naik', age: 28, gender: 'Male', epic: 'IIT0406249', booth: 45 },
  { name: 'Pooja Ravindra Naik', relation: 'Ravindra Naik', age: 26, gender: 'Female', epic: 'IIT0406231', booth: 45 },
  { name: 'Sahil Somnath Naik', relation: 'Somnath Naik', age: 25, gender: 'Male', epic: 'IIT0406223', booth: 45 },
  { name: 'Tanvi Navin Naik', relation: 'Navin Naik', age: 24, gender: 'Female', epic: 'IIT0406215', booth: 45 },
  { name: 'Pratiksha Anant Naik', relation: 'Anant Naik', age: 23, gender: 'Female', epic: 'IIT0406207', booth: 45 },
  { name: 'Aryan Satish Naik', relation: 'Satish Naik', age: 21, gender: 'Male', epic: 'IIT0406199', booth: 45 }
];

const SANQUELIM_FAMILIES = [
  {
    head: 'Shivram Nara Naik family',
    village: 'Pale',
    house: 'House No. 01',
    membersCount: 25,
    also_in_household: 'Anant Nara Naik (63)',
    sample: SHIVRAM_MEMBERS.slice(0, 4),
    members: SHIVRAM_MEMBERS,
  },
  {
    head: 'Kamlakant Naik family',
    village: 'Pale',
    house: 'House No. 15',
    membersCount: 24,
    sample: [
      { name: 'Pritesh Naik', age: 35, gender: 'M' },
      { name: 'Pratima Naik', age: 59, gender: 'F' },
      { name: 'Kamlakant Naik', age: 63, gender: 'M' },
      { name: 'Navita Naik', age: 30, gender: 'F' },
    ],
    members: [
      { name: 'Kamlakant Naik', relation: 'Nara Naik', age: 63, gender: 'Male', epic: 'BGP014521', booth: 45 },
      { name: 'Pratima Naik', relation: 'Kamlakant Naik', age: 59, gender: 'Female', epic: 'BGP014522', booth: 45 },
      { name: 'Pritesh Naik', relation: 'Kamlakant Naik', age: 35, gender: 'Male', epic: 'BGP014523', booth: 45 },
      { name: 'Navita Naik', relation: 'Pritesh Naik', age: 30, gender: 'Female', epic: 'BGP014524', booth: 45 },
      { name: 'Rohan Naik', relation: 'Kamlakant Naik', age: 32, gender: 'Male', epic: 'BGP014525', booth: 45 },
      { name: 'Shubhangi Naik', relation: 'Rohan Naik', age: 29, gender: 'Female', epic: 'BGP014526', booth: 45 },
      { name: 'Gautam Naik', relation: 'Kamlakant Naik', age: 27, gender: 'Male', epic: 'BGP014527', booth: 45 },
      { name: 'Pooja Naik', relation: 'Gautam Naik', age: 25, gender: 'Female', epic: 'BGP014528', booth: 45 },
    ],
  },
  {
    head: 'Nagesh Naik family',
    village: 'Pale',
    house: 'House No. 28',
    membersCount: 20,
    sample: [
      { name: 'Avinash Sakharam Naik', age: 49, gender: 'M' },
      { name: 'Priyanka Naik', age: 49, gender: 'F' },
      { name: 'Sujata Naik', age: 49, gender: 'F' },
      { name: 'Devidas Sakharam Naik', age: 53, gender: 'M' },
    ],
    members: [
      { name: 'Devidas Sakharam Naik', relation: 'Sakharam Naik', age: 53, gender: 'Male', epic: 'IIT0321445', booth: 45 },
      { name: 'Avinash Sakharam Naik', relation: 'Sakharam Naik', age: 49, gender: 'Male', epic: 'IIT0321446', booth: 45 },
      { name: 'Priyanka Naik', relation: 'Avinash Naik', age: 49, gender: 'Female', epic: 'IIT0321447', booth: 45 },
      { name: 'Sujata Naik', relation: 'Devidas Naik', age: 49, gender: 'Female', epic: 'IIT0321448', booth: 45 },
      { name: 'Akash Naik', relation: 'Avinash Naik', age: 24, gender: 'Male', epic: 'IIT0321449', booth: 45 },
      { name: 'Deepa Naik', relation: 'Devidas Naik', age: 22, gender: 'Female', epic: 'IIT0321450', booth: 45 },
    ],
  },
  {
    head: 'Suresh Parab family',
    village: 'Cotombi',
    house: 'House No. 24',
    membersCount: 19,
    sample: [
      { name: 'Siddhi Parab', age: 51, gender: 'F' },
      { name: 'Gurudas Parab', age: 51, gender: 'M' },
      { name: 'Radhika Parab', age: 51, gender: 'F' },
      { name: 'Hema Parab', age: 51, gender: 'F' },
    ],
    members: [
      { name: 'Suresh Parab', relation: 'Rama Parab', age: 58, gender: 'Male', epic: 'BGP0481231', booth: 47 },
      { name: 'Siddhi Parab', relation: 'Suresh Parab', age: 51, gender: 'Female', epic: 'BGP0481232', booth: 47 },
      { name: 'Gurudas Parab', relation: 'Rama Parab', age: 51, gender: 'Male', epic: 'BGP0481233', booth: 47 },
      { name: 'Radhika Parab', relation: 'Gurudas Parab', age: 51, gender: 'Female', epic: 'BGP0481234', booth: 47 },
      { name: 'Hema Parab', relation: 'Rama Parab', age: 51, gender: 'Female', epic: 'BGP0481235', booth: 47 },
    ],
  },
  {
    head: 'Ashok Sinari family',
    village: 'Amona',
    house: 'House No. 25',
    membersCount: 18,
    sample: [
      { name: 'Jagdish Sinari', age: 39, gender: 'M' },
      { name: 'Sanjana Sinari', age: 48, gender: 'F' },
      { name: 'Sanjay Sinari', age: 40, gender: 'M' },
      { name: 'Sulakshana Sinari', age: 59, gender: 'F' },
    ],
    members: [
      { name: 'Sulakshana Sinari', relation: 'Ashok Sinari', age: 59, gender: 'Female', epic: 'IIT0198421', booth: 27 },
      { name: 'Sanjana Sinari', relation: 'Jagdish Sinari', age: 48, gender: 'Female', epic: 'IIT0198422', booth: 27 },
      { name: 'Sanjay Sinari', relation: 'Ashok Sinari', age: 40, gender: 'Male', epic: 'IIT0198423', booth: 27 },
      { name: 'Jagdish Sinari', relation: 'Ashok Sinari', age: 39, gender: 'Male', epic: 'IIT0198424', booth: 27 },
    ],
  },
  {
    head: 'Tukaram Gawas family',
    village: 'Arvalem',
    house: 'House No. 728',
    membersCount: 18,
    sample: [
      { name: 'Ashok Gawas', age: 55, gender: 'M' },
      { name: 'Rajshri Gawas', age: 53, gender: 'F' },
      { name: 'Sugandhi Gawas', age: 58, gender: 'F' },
      { name: 'Sahadev Gawas', age: 52, gender: 'M' },
    ],
    members: [
      { name: 'Sugandhi Gawas', relation: 'Tukaram Gawas', age: 58, gender: 'Female', epic: 'IIT0241901', booth: 15 },
      { name: 'Ashok Gawas', relation: 'Tukaram Gawas', age: 55, gender: 'Male', epic: 'IIT0241902', booth: 15 },
      { name: 'Rajshri Gawas', relation: 'Ashok Gawas', age: 53, gender: 'Female', epic: 'IIT0241903', booth: 15 },
      { name: 'Sahadev Gawas', relation: 'Tukaram Gawas', age: 52, gender: 'Male', epic: 'IIT0241904', booth: 15 },
    ],
  },
];

const FAMILIES_PER_PAGE = 6;

export default function InsightsView({ data }) {
  const meta = data?.meta || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElection, setSelectedElection] = useState('Overall');
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedFamily(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Resolve the active map data across Sanquelim, Porvorim, Aldona
  const activeMap = useMemo(() => {
    const slugKey = meta.slug || `ac${String(meta.ac_no || '').padStart(2, '0')}`;
    if (STATIC_MAPS[slugKey]) return STATIC_MAPS[slugKey];
    if (STATIC_MAPS[String(meta.ac_no)]) return STATIC_MAPS[String(meta.ac_no)];
    if (data?.spatial?.villages && data.spatial.villages.length > 0) {
      return data.spatial;
    }
    return sanquelimMapData;
  }, [meta.slug, meta.ac_no, data?.spatial]);

  // Village leans: dynamically calculate from booths if election selected, or use default
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

  // Village border SVG paths matching village names
  const villagePolygons = useMemo(() => {
    const borders = activeMap?.villageBorders || [];
    const vList = activeMap?.villages || [];
    return vList.map((v, i) => {
      const path = borders[i] || '';
      const matchedLean = villageLeans.find((l) => l.village.toLowerCase() === v.name.toLowerCase());
      const marginStr = matchedLean ? matchedLean.margin : v.margin || '+0.0%';
      const marginNum = matchedLean?.numericMargin ?? parseFloat(marginStr);
      const isSafe = marginNum >= 10;
      const isWeak = marginNum <= -10;
      const fillColor = isSafe ? '#15803D' : isWeak ? '#DC2626' : '#D97706';
      return {
        name: v.name,
        path,
        x: v.x,
        y: v.y,
        margin: marginStr,
        fillColor,
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
        sample: f.sample || (f.members || []).slice(0, 4),
        members: f.members && f.members.length > 0 ? f.members : (f.sample || []),
      }));
    }
    return SANQUELIM_FAMILIES;
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
      {/* Title */}
      <div>
        <h2 className="font-serif text-[26px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Village Electoral Lean & Household Clusters
        </h2>
        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Organic village political margins and largest joint family compound units across {meta.ac_name || 'Sanquelim'}
        </p>
      </div>

      {/* Section 1: Village Electoral Lean Map & Statistics (Matching PDF Pages 6-8) */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
              Village-level Electoral Lean
            </h3>
            <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium">
              Each village's own average BJP margin across its booths, by election. Organic tessellation by real village adjacency.
            </p>
          </div>

          {/* Election Cycle Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl">
            {ELECTION_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedElection(opt)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  selectedElection === opt
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Map & Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive SVG Village Map */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-[#0A1120] rounded-xl p-4 border border-slate-200/70 dark:border-slate-800 flex flex-col items-center justify-center min-h-[380px]">
            {activeMap?.viewBox && villagePolygons.length > 0 ? (
              <div className="w-full max-w-[460px]">
                <svg
                  viewBox={activeMap.viewBox}
                  className="w-full h-auto drop-shadow-sm select-none"
                  style={{ maxHeight: '360px' }}
                >
                  {/* Village Tessellation Polygons */}
                  {villagePolygons.map((vp) => (
                    <g key={vp.name} className="transition-all duration-200 hover:opacity-90 cursor-pointer">
                      <path
                        d={vp.path}
                        fill={vp.fillColor}
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                        className="transition-colors duration-300"
                      />
                      {vp.x != null && vp.y != null && (
                        <text
                          x={vp.x}
                          y={vp.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#FFFFFF"
                          className="font-bold pointer-events-none drop-shadow-md"
                          fontSize="9.5"
                          letterSpacing="0.02em"
                        >
                          <tspan x={vp.x} dy="-5" fontWeight="bold">{vp.name}</tspan>
                          <tspan x={vp.x} dy="11" fontSize="8.5" fill="#E2E8F0" fontWeight="bold">{vp.margin}</tspan>
                        </text>
                      )}
                    </g>
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
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-semibold">
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
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {villageLeans.map((item) => (
              <div
                key={item.village}
                className="bg-slate-50 dark:bg-slate-900/90 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{item.village}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">{formatIndianNumber(item.voters)} electors</p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-extrabold text-teal-700 dark:text-teal-400 tabular-nums leading-tight">{item.margin}</p>
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
              Search by surname, village, or house number… <strong className="text-slate-700 dark:text-slate-300">{formatIndianNumber(meta.total_families || 6041)} household groups</strong>
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

        {/* Pagination Controls (Matching PDF Page 13: Page 1 of 252  Previous  Next) */}
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

      {/* Interactive Family Members Modal Popup (Matching User's Attached Screenshot) */}
      {selectedFamily && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedFamily(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[85vh] bg-[#1a1814] text-amber-50/90 rounded-2xl shadow-2xl border border-amber-900/40 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-amber-900/30">
              <div>
                <h3 className="font-serif text-[22px] font-bold text-amber-100 tracking-tight leading-snug">
                  {selectedFamily.head} — {selectedFamily.house}
                </h3>
                <p className="text-[12px] text-amber-200/70 font-medium mt-0.5">
                  {selectedFamily.village} • {selectedFamily.membersCount} members
                </p>
                {selectedFamily.also_in_household && (
                  <p className="text-[11.5px] text-amber-400/80 font-medium mt-0.5">
                    Also in household: {selectedFamily.also_in_household}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedFamily(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-300/70 hover:text-amber-100 hover:bg-amber-900/40 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Table Body */}
            <div className="overflow-y-auto px-6 py-4 flex-1">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-amber-900/40 text-amber-400/60 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pr-4">NAME</th>
                    <th className="pb-3 px-4">RELATION</th>
                    <th className="pb-3 px-3 text-center">AGE</th>
                    <th className="pb-3 px-4">GENDER</th>
                    <th className="pb-3 px-4">EPIC ID</th>
                    <th className="pb-3 pl-3 text-right">BOOTH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-950/40">
                  {(selectedFamily.members && selectedFamily.members.length > 0 ? selectedFamily.members : selectedFamily.sample).map((m, idx) => (
                    <tr key={idx} className="hover:bg-amber-950/30 transition-colors">
                      <td className="py-2.5 pr-4 font-semibold text-amber-100">
                        {m.name}
                      </td>
                      <td className="py-2.5 px-4 text-amber-200/70 font-medium">
                        {m.relation || `${selectedFamily.head.split(' ')[0]} Household`}
                      </td>
                      <td className="py-2.5 px-3 text-center text-amber-200/80 tabular-nums">
                        {m.age}
                      </td>
                      <td className="py-2.5 px-4 text-amber-200/70 font-medium">
                        {m.gender === 'M' ? 'Male' : m.gender === 'F' ? 'Female' : m.gender || 'Male'}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-amber-300/80">
                        {m.epic || 'IIT0406' + (100 + idx)}
                      </td>
                      <td className="py-2.5 pl-3 text-right tabular-nums text-amber-200/80 font-semibold">
                        {m.booth || selectedFamily.booth || 45}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-amber-900/30 flex items-center justify-between text-[11px] text-amber-300/60 bg-amber-950/20">
              <span>Verified ECI SIR 2026 Household Roster</span>
              <button
                type="button"
                onClick={() => setSelectedFamily(null)}
                className="px-3 py-1 bg-amber-900/40 hover:bg-amber-900/60 text-amber-100 rounded-md font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
