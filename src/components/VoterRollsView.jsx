import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

const VILLAGE_STATS = [
  { village: 'Sanquelim', total: 8480, deleted: 316, added: 231, modified: 92 },
  { village: 'Pale',      total: 4431, deleted: 66,  added: 83,  modified: 41 },
  { village: 'Surla',     total: 3163, deleted: 42,  added: 72,  modified: 46 },
  { village: 'Cudnem',    total: 2742, deleted: 44,  added: 84,  modified: 36 },
  { village: 'Amona',     total: 2621, deleted: 27,  added: 86,  modified: 36 },
  { village: 'Navelim',   total: 2285, deleted: 39,  added: 40,  modified: 22 },
  { village: 'Arvalem',   total: 2095, deleted: 52,  added: 52,  modified: 34 },
  { village: 'Velguem',   total: 1599, deleted: 37,  added: 36,  modified: 18 },
  { village: 'Cotombi',   total: 483,  deleted: 11,  added: 9,   modified: 5 },
];

export default function VoterRollsView({ data }) {
  const meta = data?.meta || {};
  const churnRecords = data?.churn_records || [];
  const [activeTab, setActiveTab] = useState('deleted');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChurn = churnRecords.filter((c) => {
    const matchesTab = c.kind === activeTab;
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.epic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.village || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.reason || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* Title */}
      <div>
        <h2 className="font-serif text-[26px] font-bold text-slate-900 tracking-tight">
          Voter Rolls & SIR Audit Analysis
        </h2>
        <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
          Special Summary Revision (SIR 2026) roll movements, village breakdowns, and granular elector audit records
        </p>
      </div>

      {/* 3 Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs border-l-[4px] border-l-[#DC2626]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">DELETED (SIR)</p>
          <p className="text-[26px] font-bold text-[#DC2626] tabular-nums leading-none">
            {formatIndianNumber(meta.sir_deleted || 634)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Expired, shifted, or disqualified electors</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs border-l-[4px] border-l-[#16A34A]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ADDED (SIR)</p>
          <p className="text-[26px] font-bold text-[#16A34A] tabular-nums leading-none">
            {formatIndianNumber(meta.sir_added || 693)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Form 6 fresh enrollments</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">MODIFIED (SIR)</p>
          <p className="text-[26px] font-bold text-[#1E3A8A] tabular-nums leading-none">
            {formatIndianNumber(meta.sir_modified || 330)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Form 8 address / detail corrections</p>
        </div>
      </div>

      {/* Village-wise Roll Movement Table (Matching PDF Page 9 & 10) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="font-serif text-[18px] font-bold text-slate-900 mb-1">
          Village Roll Churn Breakdown
        </h3>
        <p className="text-[11.5px] text-slate-400 font-medium mb-4">
          Share of each village's roll deleted, added, and modified across {meta.ac_name || 'Sanquelim'}'s 9 villages
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pr-4">VILLAGE</th>
                <th className="pb-3 px-4 text-right">TOTAL ELECTORS</th>
                <th className="pb-3 px-4 text-right">DELETIONS</th>
                <th className="pb-3 px-4 text-right">ADDITIONS</th>
                <th className="pb-3 pl-4 text-right">MODIFICATIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {VILLAGE_STATS.map((v) => (
                <tr key={v.village} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-4 font-bold text-slate-900">
                    {v.village}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatIndianNumber(v.total)}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-600 font-bold tabular-nums">
                    {v.deleted} ({((v.deleted / v.total) * 100).toFixed(2)}%)
                  </td>
                  <td className="py-3 px-4 text-right text-teal-700 font-bold tabular-nums">
                    +{v.added} ({((v.added / v.total) * 100).toFixed(2)}%)
                  </td>
                  <td className="py-3 pl-4 text-right text-slate-600 tabular-nums">
                    {v.modified} ({((v.modified / v.total) * 100).toFixed(2)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deleted / Modified / Added Voters Granular Table (Matching PDF Page 17-19) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900">
              Deleted / Modified / Added Voters Roster
            </h3>
            <p className="text-[11.5px] text-slate-400 font-medium">
              Granular audit log records verified from ECI gazette supplements
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, EPIC, or house number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('deleted')}
            className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
              activeTab === 'deleted'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Deleted ({meta.sir_deleted || 634})
          </button>
          <button
            onClick={() => setActiveTab('added')}
            className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
              activeTab === 'added'
                ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Added ({meta.sir_added || 693})
          </button>
          <button
            onClick={() => setActiveTab('modified')}
            className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
              activeTab === 'modified'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Modified ({meta.sir_modified || 330})
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pr-4">NAME</th>
                <th className="pb-3 px-4">RELATION</th>
                <th className="pb-3 px-4">EPIC</th>
                <th className="pb-3 px-4">VILLAGE</th>
                <th className="pb-3 px-4">BOOTH</th>
                <th className="pb-3 px-4">STAGE</th>
                <th className="pb-3 pl-4">REASON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChurn.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-4 font-bold text-slate-900">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {c.relation || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {c.epic}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {c.village}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                    {c.booth}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {c.stage}
                  </td>
                  <td className="py-3 pl-4 text-slate-700 font-medium">
                    {c.reason}
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
