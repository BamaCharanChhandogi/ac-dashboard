import React from 'react';
import { Trophy, Award, CheckCircle, Table, ArrowUpRight } from 'lucide-react';
import { formatIndianNumber, formatPercentage, getPartyTheme } from '../utils/formatters';

export default function CandidateReturnTables({ data }) {
  if (!data?.elections?.candidate_returns) return null;
  const { assembly_2022 = [], parliament_2024 = [] } = data.elections.candidate_returns;

  const renderTable = (returns, title, subtitle, isAssembly = true) => {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          {/* Table Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-navy-900 text-base flex items-center gap-2">
                <span>{title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  isAssembly ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-blue-50 text-blue-800 border-blue-300'
                }`}>
                  {isAssembly ? 'Vidhan Sabha' : 'Lok Sabha'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            </div>
            <Trophy className={`w-5 h-5 ${isAssembly ? 'text-amber-500' : 'text-blue-500'}`} />
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-50/60">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Party</th>
                  <th className="py-2.5 px-3 text-right">Votes</th>
                  <th className="py-2.5 px-3 text-right">Vote %</th>
                  <th className="py-2.5 px-3 text-right">Margin</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returns.map((cand, idx) => {
                  const theme = getPartyTheme(cand.party);
                  const isWinner = cand.status === 'Winner' || idx === 0;

                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isWinner ? 'bg-amber-50/30 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-slate-500">{cand.rank || idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-navy-900">{cand.name}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${theme.badgeClass}`}>
                          <span>{cand.party}</span>
                          <span className="text-[10px]">
                            {cand.party === 'BJP' ? '🪷' : (cand.party === 'INC' ? '✋' : '')}
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-800">
                        {formatIndianNumber(cand.votes)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-navy-900">
                        {formatPercentage(cand.pct)}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-mono tabular-nums text-[11px] font-semibold ${
                        (String(cand.margin ?? '').startsWith('+') || (typeof cand.margin === 'number' && cand.margin > 0))
                          ? 'text-emerald-700 font-bold'
                          : 'text-slate-500'
                      }`}>
                        {cand.margin !== undefined && cand.margin !== null && cand.margin !== ''
                          ? (typeof cand.margin === 'number'
                              ? (cand.margin > 0 ? `+${formatIndianNumber(cand.margin)}` : formatIndianNumber(cand.margin))
                              : String(cand.margin))
                          : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            cand.status === 'Winner'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : cand.status === 'Runner-Up'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {cand.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
          <span>Official Form 20 Verification</span>
          <span>EVM Counted</span>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Granular Candidate Return Tables
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full candidate rosters, official EVM counts, vote shares, and margin differentials
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
          <Table className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
          <span>Form 20 Certified Returns</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTable(
          assembly_2022, 
          "2022 General Assembly Election", 
          "Official Vidhan Sabha Constituency Results", 
          true
        )}
        {renderTable(
          parliament_2024, 
          "2024 Lok Sabha Election", 
          "North Goa Parliamentary Polling within this AC Segment", 
          false
        )}
      </div>

    </section>
  );
}
