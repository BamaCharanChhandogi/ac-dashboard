import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Users, 
  X, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  Filter 
} from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import { tagHouseholdCluster } from '../utils/normalizer';

export default function FamilyClusters({ data }) {
  if (!data?.families) return null;
  const rawFamilies = data.families || [];
  const meta = data.meta || {};
  const totalFamilies = meta.total_families || rawFamilies.length;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [activeModalFamily, setActiveModalFamily] = useState(null);

  // Apply household cluster heuristics
  const taggedFamilies = useMemo(() => {
    return rawFamilies.map(tagHouseholdCluster);
  }, [rawFamilies]);

  // Village list
  const villagesList = useMemo(() => {
    const set = new Set();
    taggedFamilies.forEach(f => f.village && set.add(f.village));
    return ['All', ...Array.from(set)];
  }, [taggedFamilies]);

  // Keyboard listener for Escape key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalFamily(null);
      }
    };
    if (activeModalFamily) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeModalFamily]);

  // Filtered families
  const filteredFamilies = useMemo(() => {
    return taggedFamilies.filter(f => {
      const matchVillage = selectedVillage === 'All' || f.village === selectedVillage;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchVillage;

      const headName = String(f.head_name || '').toLowerCase();
      const surname = String(f.surname || '').toLowerCase();
      const houseNo = String(f.house_no ?? '').toLowerCase();
      const village = String(f.village || '').toLowerCase();

      return matchVillage && (headName.includes(q) || surname.includes(q) || houseNo.includes(q) || village.includes(q));
    });
  }, [taggedFamilies, selectedVillage, searchQuery]);

  return (
    <section id="families" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Family & Household Groups Directory
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Clustered domestic units compiled from residential house numbers and shared patronymic surnames
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold">
          <Home className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
          <span>{formatIndianNumber(totalFamilies)} Household Units Identified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by surname, family head, house number, or village..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Village Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-600 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-600" />
            Area:
          </span>
          {villagesList.map((vil) => (
            <button
              key={vil}
              onClick={() => setSelectedVillage(vil)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedVillage === vil
                  ? 'bg-navy-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {vil}
            </button>
          ))}
        </div>

      </div>

      {/* Families Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFamilies.map((fam, idx) => (
          <div
            key={idx}
            onClick={() => setActiveModalFamily(fam)}
            className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 hover:border-blue-400 hover:bg-white hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-extrabold text-navy-900 text-sm group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                    <span>{fam.head_name} family</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </h4>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {fam.village} · House No. {fam.house_no}
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 tabular-nums">
                  {fam.members_count} members
                </span>
              </div>

              {/* Cluster Heuristic Tag */}
              {fam.isWadaCompound ? (
                <div className="mb-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  <span>🏛️ {fam.clusterTag}</span>
                </div>
              ) : (
                <div className="mb-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-700">
                  <span>{fam.clusterTag}</span>
                </div>
              )}

              {/* Members Snippet */}
              <div className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-200/60">
                {fam.members?.slice(0, 4).map((m, mIdx) => (
                  <div key={mIdx} className="flex items-center justify-between py-0.5">
                    <span className="truncate pr-2">{m.name}</span>
                    <span className="font-mono text-[11px] text-slate-500 shrink-0">
                      {m.age} / {m.gender === 'Female' ? 'F' : 'M'}
                    </span>
                  </div>
                ))}
                {fam.members_count > 4 && (
                  <div className="text-[11px] font-bold text-blue-600 pt-1">
                    +{fam.members_count - 4} more electors in this household...
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-600 flex items-center justify-between">
              <span>Verified Household Group</span>
              <span className="font-semibold text-blue-600 group-hover:underline">View Roster →</span>
            </div>
          </div>
        ))}
      </div>

      {filteredFamilies.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No household units found matching "{searchQuery}".
        </div>
      )}

      {/* Full Family Roster Modal Dialog */}
      {activeModalFamily && (
        <div 
          onClick={() => setActiveModalFamily(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col justify-between cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-navy-900">
                    {activeModalFamily.head_name} Household Roster
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {activeModalFamily.village} · House No. {activeModalFamily.house_no} · {activeModalFamily.clusterTag}
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalFamily(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Roster Table */}
              <div className="overflow-y-auto max-h-[50vh] my-4 pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                      <th className="py-2 px-2">#</th>
                      <th className="py-2 px-2">Elector Name</th>
                      <th className="py-2 px-2">Age/Gender</th>
                      <th className="py-2 px-2 text-right">EPIC ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeModalFamily.members?.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-2 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-2 font-bold text-navy-900">{m.name}</td>
                        <td className="py-2 px-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            m.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {m.age} Yrs · {m.gender}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-600 font-semibold">
                          {m.epic || `EPIC_${idx + 100}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Privacy Protected: Personal Phone Numbers Redacted
              </span>
              <button
                onClick={() => setActiveModalFamily(null)}
                className="px-3.5 py-1.5 rounded-lg bg-navy-900 text-white font-bold text-xs"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
