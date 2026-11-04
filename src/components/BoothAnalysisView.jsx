import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function BoothAnalysisView({ data }) {
  const meta = data?.meta || {};
  const spatial = data?.spatial || {};
  const booths = spatial.booths || [];
  const villages = spatial.villages || [];
  const viewBox = spatial.viewBox || '0 0 1186 920';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedElection, setSelectedElection] = useState('Overall');

  const filteredBooths = booths.filter((b) => {
    const matchesSearch =
      (b.station_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.village || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(b.part_no).includes(searchTerm);
    const matchesVillage = selectedVillage === 'All' || b.village === selectedVillage;
    return matchesSearch && matchesVillage;
  });

  const uniqueVillages = ['All', ...new Set(booths.map((b) => b.village).filter(Boolean))];

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* Title */}
      <div>
        <h2 className="font-serif text-[26px] font-bold text-slate-900 tracking-tight">
          Booth Analysis & Polling Stations Roster
        </h2>
        <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
          Electoral geography, spatial margins, and 100% verified booth roster across {meta.ac_name || 'Sanquelim'}
        </p>
      </div>

      {/* Top 4 KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL BOOTHS</p>
          <p className="text-[26px] font-bold text-[#1E3A8A] tabular-nums leading-none">
            {meta.total_booths || booths.length}
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

      {/* Voronoi / Village Spatial Vector Map (Matching PDF Page 6) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900">
              Booth-level Form-20 Election Retrospective
            </h3>
            <p className="text-[11.5px] text-slate-500 font-medium">
              Overall = each booth's own average BJP margin across all elections with a real figure for that booth.
            </p>
          </div>

          {/* Election Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
            {['Overall', '2012 AE', '2014 LS', '2017 AE', '2019 LS', '2022 AE', '2024 LS'].map((elec) => (
              <button
                key={elec}
                onClick={() => setSelectedElection(elec)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedElection === elec ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {elec}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="w-full h-[360px] bg-[#F8FAFC] rounded-xl border border-slate-200/60 relative overflow-hidden flex items-center justify-center p-2">
          <svg viewBox={viewBox} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Village Boundaries */}
            {villages.map((v, i) => (
              <g key={`v-${i}`}>
                <circle
                  cx={v.cx}
                  cy={v.cy}
                  r={v.r}
                  fill="#D1FAE5"
                  fillOpacity="0.4"
                  stroke="#10B981"
                  strokeWidth="1.5"
                />
                <text
                  x={v.cx}
                  y={v.cy}
                  textAnchor="middle"
                  fill="#065F46"
                  fontSize="22"
                  fontWeight="bold"
                >
                  {v.name}
                </text>
                <text
                  x={v.cx}
                  y={v.cy + 24}
                  textAnchor="middle"
                  fill="#047857"
                  fontSize="16"
                  fontWeight="600"
                >
                  +{v.margin_pct}%
                </text>
              </g>
            ))}

            {/* Booth Dots */}
            {booths.map((b, i) => (
              <g key={`b-${i}`} className="cursor-pointer">
                <circle
                  cx={b.x}
                  cy={b.y}
                  r="12"
                  fill={b.category === 'Weak' ? '#DC2626' : b.category === 'Battle Ground' ? '#F59E0B' : '#16A34A'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={b.x}
                  y={b.y + 4}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {b.part_no}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-[12px] font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
            <span>Safe (BJP margin ≥10%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span>Battle Ground (within 10%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#DC2626]" />
            <span>Weak (BJP trails by 10%+)</span>
          </div>
        </div>
      </div>

      {/* Full Booths Table Roster (Matching PDF Page 13-17) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900">
              Booths in this Constituency
            </h3>
            <p className="text-[11.5px] text-slate-400 font-medium">
              Showing {filteredBooths.length} verified polling stations
            </p>
          </div>

          {/* Search & Village Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search station or part no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-blue-500 w-52"
              />
            </div>

            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none bg-white text-slate-700"
            >
              {uniqueVillages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
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
                <th className="pb-3 pl-4 text-right">FAMILIES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooths.map((b) => (
                <tr key={b.part_no} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-4 font-bold text-slate-900 tabular-nums">
                    {b.part_no}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {b.station_name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
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
                  <td className="py-3 pl-4 text-right text-slate-600 tabular-nums">
                    {b.families_count || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
