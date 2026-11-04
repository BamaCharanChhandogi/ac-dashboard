import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Search, 
  UserMinus, 
  UserPlus, 
  UserCog, 
  ShieldCheck, 
  Layers, 
  X,
  Filter 
} from 'lucide-react';
import { 
  formatIndianNumber, 
  formatPercentage, 
  formatMargin, 
  getMarginCategory 
} from '../utils/formatters';
import { clubAuxiliaryBooths, sanitizeVoterRecord } from '../utils/normalizer';

export default function DataTables({ data }) {
  if (!data) return null;
  const rawBooths = data.spatial?.booths || [];
  const churnRecords = data.churn_records || [];
  const meta = data.meta || {};

  const [activeTab, setActiveTab] = useState('booths'); // 'booths' | 'churn'
  const [boothSearch, setBoothSearch] = useState('');
  const [churnSearch, setChurnSearch] = useState('');
  const [churnFilter, setChurnFilter] = useState('all'); // 'all' | 'deleted' | 'added' | 'modified'

  // Apply auxiliary booth clubbing (consolidating 22 + 22A -> 22)
  const booths = useMemo(() => clubAuxiliaryBooths(rawBooths), [rawBooths]);

  // Sanitize churn records for voter privacy
  const sanitizedChurn = useMemo(() => churnRecords.map(sanitizeVoterRecord), [churnRecords]);

  // Dynamic churn counters without hardcoded fallbacks
  const deletedCount = meta.sir_deleted ?? churnRecords.filter(r => r.kind === 'deleted').length;
  const addedCount = meta.sir_added ?? churnRecords.filter(r => r.kind === 'added').length;
  const modifiedCount = meta.sir_modified ?? churnRecords.filter(r => r.kind === 'modified').length;

  // Filtered booths
  const filteredBooths = useMemo(() => {
    return booths.filter(b => {
      const q = boothSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        String(b.part_no ?? '').toLowerCase().includes(q) ||
        String(b.station_name ?? '').toLowerCase().includes(q) ||
        String(b.village ?? '').toLowerCase().includes(q)
      );
    });
  }, [booths, boothSearch]);

  // Filtered churn
  const filteredChurn = useMemo(() => {
    return sanitizedChurn.filter(r => {
      const matchKind = churnFilter === 'all' || r.kind === churnFilter;
      const q = churnSearch.toLowerCase().trim();
      if (!q) return matchKind;

      return (
        matchKind &&
        (String(r.name || '').toLowerCase().includes(q) ||
         String(r.epic || '').toLowerCase().includes(q) ||
         String(r.village || '').toLowerCase().includes(q) ||
         String(r.reason || '').toLowerCase().includes(q) ||
         String(r.booth || '').toLowerCase().includes(q))
      );
    });
  }, [sanitizedChurn, churnFilter, churnSearch]);

  return (
    <section id="data-tables" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Constituency Data Tables & Audit Logs
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Searchable polling station directories and official SIR 2026 voter churn transaction records
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('booths')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'booths'
                ? 'bg-white text-navy-900 shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Booths Directory ({rawBooths.length})
          </button>
          <button
            onClick={() => setActiveTab('churn')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'churn'
                ? 'bg-white text-navy-900 shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Voter Churn Audit ({churnRecords.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Polling Booths Directory Table */}
      {activeTab === 'booths' && (
        <div className="space-y-4">
          
          {/* Booths Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={boothSearch}
              onChange={(e) => setBoothSearch(e.target.value)}
              placeholder="Search by booth number, school name, or village..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 hover:bg-white"
            />
            {boothSearch && (
              <button
                onClick={() => setBoothSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-50/80">
                  <th className="py-3 px-3">Part #</th>
                  <th className="py-3 px-4">Polling Station Name & Address</th>
                  <th className="py-3 px-3">Village / Ward</th>
                  <th className="py-3 px-3 text-right">Active Voters</th>
                  <th className="py-3 px-3 text-right">Added</th>
                  <th className="py-3 px-3 text-right">Deleted</th>
                  <th className="py-3 px-3 text-right">Families</th>
                  <th className="py-3 px-3 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooths.map((b, idx) => {
                  const category = getMarginCategory(b.margin_pct);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-navy-900">
                        {b.part_no}
                        {b.is_clubbed && (
                          <span className="block text-[9px] text-amber-700 bg-amber-100 px-1 rounded font-sans mt-0.5">
                            Clubbed
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">
                        {b.station_name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        {b.village}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-navy-900 tabular-nums">
                        {formatIndianNumber(b.voters)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums font-semibold">
                        +{b.added}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-700 tabular-nums font-semibold">
                        −{b.deleted}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 tabular-nums">
                        {b.families_count}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${category.badgeClass}`}>
                          {formatMargin(b.margin_pct)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Showing {filteredBooths.length} of {booths.length} booths</span>
            <span>Auxiliary stations clubbed for 1:1 map polygon sync</span>
          </div>
        </div>
      )}

      {/* Tab 2: Voter Churn Audit Log Table */}
      {activeTab === 'churn' && (
        <div className="space-y-4">
          
          {/* Churn Search & Kind Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative max-w-md flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={churnSearch}
                onChange={(e) => setChurnSearch(e.target.value)}
                placeholder="Search by elector name, EPIC ID, or reason..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 hover:bg-white"
              />
              {churnSearch && (
                <button
                  onClick={() => setChurnSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setChurnFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  churnFilter === 'all'
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({sanitizedChurn.length})
              </button>
              <button
                onClick={() => setChurnFilter('deleted')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  churnFilter === 'deleted'
                    ? 'bg-rose-700 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                Deleted ({deletedCount})
              </button>
              <button
                onClick={() => setChurnFilter('added')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  churnFilter === 'added'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Added ({addedCount})
              </button>
              <button
                onClick={() => setChurnFilter('modified')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  churnFilter === 'modified'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Modified ({modifiedCount})
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-50/80">
                  <th className="py-3 px-3">Elector Name</th>
                  <th className="py-3 px-3">Relation Name</th>
                  <th className="py-3 px-3">EPIC Card ID</th>
                  <th className="py-3 px-3">Village</th>
                  <th className="py-3 px-2 text-center">Booth</th>
                  <th className="py-3 px-3">Revision Stage</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4">Official Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredChurn.map((rec, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-navy-900">
                        {rec.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {rec.relation || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-900">
                        {rec.epic}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                        {rec.village}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-800">
                        {rec.booth}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                          {rec.stage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          rec.kind === 'deleted' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                            : rec.kind === 'added'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {rec.kind}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 font-medium">
                        {rec.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Revision Churn Log • Personal Phone Numbers Redacted for Citizen Privacy</span>
            </span>
            <span>Showing {filteredChurn.length} records</span>
          </div>

        </div>
      )}

    </section>
  );
}
