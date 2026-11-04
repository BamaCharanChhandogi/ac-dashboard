import React from 'react';
import { Flag, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { getPartyTheme } from '../utils/formatters';

export default function PartyControlTimeline({ data }) {
  if (!data?.elections?.party_control_timeline) return null;
  const timeline = data.elections.party_control_timeline;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Party Control at a Glance
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Chronological seat stewardship and party transitions across successive elections (2008–2024)
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
          <Flag className="w-3.5 h-3.5 mr-1.5 text-navy-900" />
          <span>Historical Governance Roster</span>
        </div>
      </div>

      {/* Horizontal Chronological Linked Stepper */}
      <div className="py-2">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 overflow-x-auto pb-2">
          
          {timeline.map((step, idx) => {
            const theme = getPartyTheme(step.party_code);
            const prevParty = idx > 0 ? timeline[idx - 1].party_code : null;
            const isFlipped = prevParty && prevParty !== step.party_code;

            return (
              <React.Fragment key={idx}>
                {/* Stepper Card */}
                <div className="flex-1 min-w-[190px] bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
                  
                  <div>
                    {/* Year & Type */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-black text-navy-900 tracking-tight font-mono">
                        {step.year}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        {step.type}
                      </span>
                    </div>

                    {/* Party Tag & Symbol */}
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border ${theme.badgeClass}`}
                      >
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: theme.barColor }}
                        />
                        <span>{step.winner}</span>
                        <span className="text-xs">
                          {step.party_code === 'BJP' ? '🪷' : (step.party_code === 'INC' ? '✋' : '★')}
                        </span>
                      </span>

                      {isFlipped && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-0.5">
                          <RefreshCw className="w-2.5 h-2.5" />
                          FLIP
                        </span>
                      )}
                    </div>

                    {/* Candidate Name */}
                    <div className="text-xs font-bold text-navy-900 truncate">
                      {step.lead}
                    </div>
                  </div>

                  {/* Winning Vote Share */}
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Winning Share:</span>
                    <span className="text-navy-900 font-black tabular-nums font-mono">
                      {step.vote_pct}
                    </span>
                  </div>

                </div>

                {/* Connecting Arrow for Desktop */}
                {idx < timeline.length - 1 && (
                  <div className="hidden md:flex items-center justify-center shrink-0 text-slate-300">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}

        </div>
      </div>

    </section>
  );
}
