import React from 'react';
import { 
  UserCheck, 
  Award, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Landmark 
} from 'lucide-react';
import { 
  formatIndianNumber, 
  formatPercentage, 
  formatMargin, 
  getPartyTheme 
} from '../utils/formatters';

export default function LeadershipDossier({ data }) {
  if (!data?.leaders) return null;
  const { mla, mp } = data.leaders;

  const renderLeaderCard = (leader, isMla = true) => {
    if (!leader) return null;
    const partyTheme = getPartyTheme(leader.party);

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
        
        <div>
          {/* Card Header & Role Tag */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wider uppercase ${
                isMla ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
              }`}>
                {leader.role}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {leader.constituency}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${partyTheme.badgeClass}`}>
              <span>{leader.party}</span>
              <span className="text-sm">
                {leader.party === 'BJP' ? '🪷' : (leader.party === 'INC' ? '✋' : '★')}
              </span>
            </div>
          </div>

          {/* Profile Name & Key Figures */}
          <div className="py-5 flex items-start gap-4">
            <div className="relative">
              <img
                src={leader.photo_url}
                alt={leader.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=0A1838&color=fff`;
                }}
                className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-navy-900 tracking-tight leading-tight">
                {leader.name}
              </h3>
              <div className="text-xs text-slate-600 font-medium">
                {leader.party_name || partyTheme.name}
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-2">
                <span>Age {leader.age} Yrs</span>
                <span>•</span>
                <span>{leader.tenure}</span>
              </div>
            </div>
          </div>

          {/* Winning Metric Dual-Card Strip */}
          <div className="grid grid-cols-2 gap-3 py-3 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Winning Vote Share
              </span>
              <div className="text-2xl font-black text-navy-900 tabular-nums">
                {formatPercentage(leader.vote_pct)}
              </div>
              <span className="text-[11px] text-slate-600">
                {formatIndianNumber(leader.votes)} EVM Votes
              </span>
            </div>

            <div className="border-l border-slate-200 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Victory Margin
              </span>
              <div className="text-2xl font-black text-emerald-800 tabular-nums">
                {formatMargin(leader.margin_pct)}
              </div>
              <span className="text-[11px] text-slate-600">
                {leader.margin_votes > 0 ? `+${formatIndianNumber(leader.margin_votes)}` : formatIndianNumber(leader.margin_votes)} vs runner-up
              </span>
            </div>

          </div>

          {/* Runner Up Note */}
          {leader.runner_up && (
            <div className="mt-3 text-xs text-slate-600 bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Runner-up Contestant:</span>
              <span className="font-semibold text-slate-800">{leader.runner_up}</span>
            </div>
          )}

          {/* Official Cabinet Portfolio */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-slate-600" />
              Official Government Portfolio
            </span>
            <p className="text-xs font-semibold text-navy-900 leading-snug">
              {leader.portfolio}
            </p>
          </div>

        </div>

      </div>
    );
  };

  return (
    <section id="leadership" className="space-y-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Elected Leadership Dossier
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Executive profile comparison between Sitting Member of Legislative Assembly (MLA) and Member of Parliament (MP)
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
          <span>Incumbent Term Roster</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderLeaderCard(mla, true)}
        {renderLeaderCard(mp, false)}
      </div>

    </section>
  );
}
