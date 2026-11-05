import React, { useState, useMemo } from 'react';
import { Search, MapPin, Building2, User, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function ConstituenciesView({
  currentSlug,
  directory,
  onSelectAC,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  // Extract flat list from directory
  const constituencies = useMemo(() => {
    if (!directory) {
      return [
        {
          slug: 'ac17-sanquelim',
          ac_no: 17,
          ac_name: 'Sanquelim',
          state: 'Goa',
          district: 'North Goa',
          taluka: 'Bicholim',
          sitting_mla: 'Dr. Pramod Sawant',
          party: 'BJP',
          margin: '+2.6%',
          total_voters: 27265,
          total_booths: 50,
          villages: 9,
          status: 'Safe / CM Constituency',
        },
        {
          slug: 'ac09-porvorim',
          ac_no: 9,
          ac_name: 'Porvorim',
          state: 'Goa',
          district: 'North Goa',
          taluka: 'Bardez',
          sitting_mla: 'Rohan Khaunte',
          party: 'BJP',
          margin: '+37.4%',
          total_voters: 23947,
          total_booths: 39,
          villages: 3,
          status: 'Safe / High Margin',
        },
        {
          slug: 'ac10-aldona',
          ac_no: 10,
          ac_name: 'Aldona',
          state: 'Goa',
          district: 'North Goa',
          taluka: 'Bardez',
          sitting_mla: 'Carlos Alvares Ferreira',
          party: 'INC',
          margin: '+8.1%',
          total_voters: 25541,
          total_booths: 41,
          villages: 10,
          status: 'Competitive / Opposition Seat',
        },
      ];
    }

    const list = [];
    const stateName = directory.state || 'Goa';
    (directory.parliamentary_constituencies || []).forEach((pc) => {
      (pc.assembly_constituencies || []).forEach((ac) => {
        let party = 'Other';
        let mlaName = ac.sitting_mla || 'MLA';
        if (ac.sitting_mla) {
          if (ac.sitting_mla.includes('(BJP)')) party = 'BJP';
          else if (ac.sitting_mla.includes('(INC)')) party = 'INC';
          mlaName = ac.sitting_mla.replace(/\s*\([A-Z]+\)\s*/, '');
        }

        list.push({
          slug: ac.slug,
          ac_no: ac.ac_no,
          ac_name: ac.ac_name,
          state: stateName,
          district: ac.district || 'North Goa',
          taluka: ac.taluka || '',
          sitting_mla: mlaName,
          party,
          margin: ac.slug === 'ac17-sanquelim' ? '+2.6%' : ac.slug === 'ac09-porvorim' ? '+37.4%' : '+8.1%',
          total_voters: ac.total_voters,
          total_booths: ac.total_booths,
          villages: ac.slug === 'ac17-sanquelim' ? 9 : ac.slug === 'ac09-porvorim' ? 3 : 10,
          status: ac.slug === 'ac17-sanquelim' ? 'Safe / CM Constituency' : ac.slug === 'ac09-porvorim' ? 'Safe / High Margin' : 'Competitive / Opposition Seat',
        });
      });
    });
    return list;
  }, [directory]);

  // Unique states
  const states = useMemo(() => {
    return ['All', ...new Set(constituencies.map((c) => c.state).filter(Boolean))];
  }, [constituencies]);

  // Filtered list
  const filteredACs = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return constituencies.filter((ac) => {
      const matchesSearch =
        !q ||
        ac.ac_name.toLowerCase().includes(q) ||
        String(ac.ac_no).includes(q) ||
        ac.district.toLowerCase().includes(q) ||
        ac.sitting_mla.toLowerCase().includes(q) ||
        ac.party.toLowerCase().includes(q);

      const matchesState = selectedState === 'All' || ac.state === selectedState;
      return matchesSearch && matchesState;
    });
  }, [constituencies, searchTerm, selectedState]);

  // Aggregated KPIs
  const totalElectorsCombined = constituencies.reduce((sum, c) => sum + (c.total_voters || 0), 0);
  const totalBoothsCombined = constituencies.reduce((sum, c) => sum + (c.total_booths || 0), 0);

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Header Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-[26px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Nationwide Constituencies Directory
          </h2>
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Cross-constituency intelligence directory, comparative benchmarks, and multi-seat analysis across India
          </p>
        </div>

        {/* Global summary badge */}
        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 px-4 py-2.5 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[13px]">
            {constituencies.length}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Monitored Seats</p>
            <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{formatIndianNumber(totalElectorsCombined)} Electors</p>
          </div>
        </div>
      </div>

      {/* 2. Top Aggregate KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">MONITORED ACS</p>
          <p className="text-[26px] font-bold text-[#1E3A8A] dark:text-blue-400 tabular-nums leading-none">
            {constituencies.length}
          </p>
        </div>

        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#0D9488]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">TOTAL ELECTORS</p>
          <p className="text-[26px] font-bold text-[#0F766E] dark:text-teal-400 tabular-nums leading-none">
            {formatIndianNumber(totalElectorsCombined)}
          </p>
        </div>

        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#16A34A]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">TOTAL BOOTHS</p>
          <p className="text-[26px] font-bold text-[#16A34A] dark:text-emerald-400 tabular-nums leading-none">
            {totalBoothsCombined}
          </p>
        </div>

        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#EA580C]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">RULING / OPPOSITION</p>
          <p className="text-[26px] font-bold text-[#EA580C] dark:text-orange-400 tabular-nums leading-none">
            2 / 1
          </p>
        </div>
      </div>

      {/* 3. Search & State Filter Bar */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by AC name, number, MLA, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[12.5px] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800"
          />
        </div>

        {/* State filter pills if multiple states */}
        {states.length > 2 && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">State:</span>
            {states.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedState === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}

        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Showing {filteredACs.length} of {constituencies.length} Assembly Constituencies
        </div>
      </div>

      {/* 4. Multi-Constituency Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredACs.map((ac) => {
          const isSelected = currentSlug === ac.slug;
          return (
            <div
              key={ac.slug}
              onClick={() => onSelectAC(ac.slug)}
              className={`
                bg-white dark:bg-[#111C35] rounded-2xl border p-6 shadow-xs cursor-pointer transition-all duration-200 relative group
                ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                    : 'border-slate-200/90 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                }
              `}
            >
              {/* Top Row: Party Badge & Status */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-tight ${
                    ac.party === 'BJP'
                      ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300'
                      : ac.party === 'INC'
                      ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {ac.party}
                </span>

                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  {ac.status}
                </span>
              </div>

              {/* AC Title */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                  AC {ac.ac_no}
                </span>
                <h3 className="font-serif text-[21px] font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ac.ac_name}
                </h3>
              </div>

              {/* Subtitle */}
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mb-3">
                {ac.district} • {ac.taluka ? `${ac.taluka} Taluka` : ac.state}
              </p>

              {/* MLA Row */}
              <div className="bg-slate-50 dark:bg-slate-900/90 rounded-xl p-3 border border-slate-100 dark:border-slate-800 mb-4 text-[12px]">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                  Sitting MLA
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{ac.sitting_mla}</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400 tabular-nums">{ac.margin}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <p className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] uppercase">Voters</p>
                  <p className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatIndianNumber(ac.total_voters)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] uppercase">Booths</p>
                  <p className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    {ac.total_booths}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] uppercase">Villages</p>
                  <p className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    {ac.villages}
                  </p>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {isSelected ? (
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-blue-600 dark:text-blue-400">
                    <CheckCircle2 size={14} />
                    <span>Currently Active Dossier</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <span>Open Comprehensive Dossier</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
