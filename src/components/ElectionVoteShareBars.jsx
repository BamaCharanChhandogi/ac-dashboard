import React, { useState } from 'react';
import { 
  BarChart2, 
  Layers, 
  Check, 
  Vote, 
  Percent, 
  ChevronRight,
  TrendingUp 
} from 'lucide-react';
import { 
  formatIndianNumber, 
  formatPercentage, 
  getPartyTheme 
} from '../utils/formatters';

export default function ElectionVoteShareBars({ data }) {
  if (!data?.elections?.vote_share_bars) return null;
  const { assembly = [], parliament = [] } = data.elections.vote_share_bars;
  const [metricMode, setMetricMode] = useState('percent'); // 'percent' | 'votes'

  const renderElectionRow = (item, idx) => {
    const candidates = item.candidates || [];
    const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);

    return (
      <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
        
        {/* Election Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-navy-900 text-sm">
              {item.election}
            </span>
            <span className="text-xs text-slate-600 font-mono">
              ({formatIndianNumber(totalVotes)} total votes)
            </span>
          </div>

          {candidates.length > 0 && candidates[0]?.party && (
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {candidates[0].party} Plurality
            </span>
          )}
        </div>

        {/* Horizontal Stacked Bar */}
        <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner border border-slate-200">
          {candidates.map((cand, cIdx) => {
            const theme = getPartyTheme(cand.party);
            const rawPct = cand.pct != null ? (typeof cand.pct === 'string' ? parseFloat(cand.pct) : cand.pct) : (totalVotes > 0 ? (cand.votes / totalVotes) * 100 : 0);
            const widthPct = Number.isFinite(rawPct) ? Math.max(0, rawPct) : 0;

            return (
              <div
                key={cIdx}
                className="h-full relative group transition-all duration-300 hover:brightness-95 flex items-center justify-center overflow-hidden"
                style={{ 
                  width: `${widthPct}%`,
                  backgroundColor: theme.barColor,
                }}
                title={`${cand.name} (${cand.party}): ${formatPercentage(cand.pct)} — ${formatIndianNumber(cand.votes)} votes`}
              >
                {widthPct >= 12 && (
                  <span className="text-white text-xs font-bold drop-shadow-xs truncate px-1">
                    {metricMode === 'percent' ? formatPercentage(cand.pct) : formatIndianNumber(cand.votes)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Candidate Detail Badges Strip */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100">
          {candidates.map((cand, cIdx) => {
            const theme = getPartyTheme(cand.party);
            return (
              <div 
                key={cIdx}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${
                  cand.is_winner 
                    ? 'bg-amber-50/80 border-amber-300 text-navy-900 font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: theme.barColor }}
                />
                <span className="font-semibold">{cand.name}</span>
                <span className="text-slate-600 font-mono text-[11px]">· {cand.party}</span>
                <span className="font-extrabold tabular-nums ml-1">
                  {metricMode === 'percent' ? formatPercentage(cand.pct) : formatIndianNumber(cand.votes)}
                </span>
                {cand.is_winner && (
                  <span className="ml-1 text-[10px] text-amber-700 bg-amber-100 px-1 rounded font-bold">
                    WIN
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    );
  };

  return (
    <section id="elections" className="space-y-6">
      
      {/* Section Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Candidate Vote Share & EVM Tallies
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AC-wide valid vote shares for Assembly elections and parliamentary booth votes
          </p>
        </div>

        {/* Metric Toggle Pill */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setMetricMode('percent')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metricMode === 'percent'
                ? 'bg-white text-navy-900 shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-blue-600" />
            <span>Vote Share (%)</span>
          </button>
          <button
            onClick={() => setMetricMode('votes')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metricMode === 'votes'
                ? 'bg-white text-navy-900 shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <Vote className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total EVM Votes</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Assembly Elections */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              State Legislative Assembly Contests
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          <div className="space-y-3">
            {assembly.map(renderElectionRow)}
          </div>
        </div>

        {/* Parliament (Lok Sabha) Elections */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Parliament (Lok Sabha) Contests — AC Segment Booth Polling
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          <div className="space-y-3">
            {parliament.map(renderElectionRow)}
          </div>
        </div>
      </div>

    </section>
  );
}
