import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

const VILLAGE_LEANS = [
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

const FAMILIES_SAMPLE = [
  {
    head: 'Shivram Nara Naik family',
    village: 'Pale',
    house: 'House No. 01',
    membersCount: 25,
    sample: [
      { name: 'Swapna Somnath Naik', age: 51, gender: 'F' },
      { name: 'Navnita Navin Naik', age: 52, gender: 'F' },
      { name: 'Ravindra Nara Naik', age: 56, gender: 'M' },
      { name: 'Rakhee Ravindra Naik', age: 51, gender: 'F' },
    ],
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
  },
];

export default function InsightsView({ data }) {
  const meta = data?.meta || {};
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFamilies = FAMILIES_SAMPLE.filter(
    (f) =>
      f.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.house.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Village Margins (Matching PDF Page 7-8) */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
          Village-level Electoral Lean
        </h3>
        <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium mb-4">
          Each village's own average BJP margin across its booths (Green = Safe ≥10% avg margin)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VILLAGE_LEANS.map((item) => (
            <div key={item.village} className="bg-slate-50 dark:bg-slate-900/90 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-[14px]">{item.village}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">{formatIndianNumber(item.voters)} electors</p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-extrabold text-teal-700 dark:text-teal-400 tabular-nums leading-tight">{item.margin}</p>
                <span className="inline-block text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded mt-0.5">
                  Safe
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family / Household Groups (Matching PDF Page 10-13) */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100">
              Family / Household Groups
            </h3>
            <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium">
              {formatIndianNumber(meta.total_families || 6041)} household groups detected via surname & house clustering
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search surname, village, house no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Family Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFamilies.map((f, i) => (
            <div key={i} className="bg-slate-50/70 dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[14px]">{f.head} →</h4>
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
                    <span>{m.name}</span>
                    <span className="text-slate-400 dark:text-slate-500 tabular-nums">{m.age} / {m.gender}</span>
                  </div>
                ))}
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold pt-1">+ {f.membersCount - f.sample.length} more family members…</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
