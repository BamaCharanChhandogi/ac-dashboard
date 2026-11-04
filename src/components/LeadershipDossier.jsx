import React from 'react';
import { Award, Briefcase, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatIndianNumber, getPartyTheme } from '../utils/formatters';

function LeaderCard({ leader, typeLabel }) {
  if (!leader) return null;

  const partyTheme = getPartyTheme(leader.party);
  const marginPct = leader.margin_pct != null ? `${leader.margin_pct > 0 ? '+' : ''}${leader.margin_pct}%` : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 card-hover flex flex-col justify-between">
      {/* Top row: Role badge & Tenure */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200/60">
            <Award size={12} className="text-blue-600" />
            {typeLabel}
          </span>
          {leader.tenure && (
            <span className="text-[11px] font-medium text-slate-400">
              {leader.tenure}
            </span>
          )}
        </div>

        {/* Profile info: photo + name + party */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={leader.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'}
              alt={leader.name}
              className="w-14 h-14 rounded-xl object-cover border-2 shadow-xs"
              style={{ borderColor: partyTheme.bg }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256';
              }}
            />
            <span
              className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[9px] font-extrabold text-white shadow-xs"
              style={{ backgroundColor: partyTheme.bg }}
            >
              {leader.party}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-[18px] font-bold text-slate-900 tracking-tight leading-tight truncate">
              {leader.name}
            </h4>
            <p className="text-[12px] font-medium text-slate-500 mt-0.5">
              {leader.party_name || leader.party} • {leader.age ? `${leader.age} yrs` : ''}
            </p>
            <p className="text-[11.5px] text-slate-400 mt-0.5 truncate">
              {leader.constituency}
            </p>
          </div>
        </div>

        {/* Electoral performance strip */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-4">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Vote Share</p>
            <p className="text-[16px] font-bold text-slate-900 tabular-nums mt-0.5">
              {leader.vote_pct}%
            </p>
            {leader.votes && (
              <p className="text-[10.5px] text-slate-400 tabular-nums">
                {formatIndianNumber(leader.votes)} votes
              </p>
            )}
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Margin</p>
            <p className="text-[16px] font-bold text-emerald-600 tabular-nums mt-0.5">
              {marginPct}
            </p>
            {leader.margin_votes && (
              <p className="text-[10.5px] text-slate-400 tabular-nums">
                +{formatIndianNumber(leader.margin_votes)} lead
              </p>
            )}
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Runner-Up</p>
            <p className="text-[13px] font-semibold text-slate-700 truncate mt-0.5">
              {leader.runner_up || '—'}
            </p>
            <p className="text-[10.5px] text-slate-400">Closest rival</p>
          </div>
        </div>
      </div>

      {/* Portfolio / Official Position */}
      {leader.portfolio && (
        <div className="pt-3 border-t border-slate-100 flex items-start gap-2">
          <Briefcase size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] font-medium text-slate-600 leading-snug">
            {leader.portfolio}
          </p>
        </div>
      )}
    </div>
  );
}

export default function LeadershipDossier({ data }) {
  const leaders = data?.leaders || {};
  const mla = leaders.mla;
  const mp = leaders.mp;

  if (!mla && !mp) return null;

  return (
    <div className="px-6 lg:px-8 pb-6">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
            Elected Representatives
          </h3>
          <p className="text-[11.5px] text-slate-500 font-medium">
            Sitting Member of Legislative Assembly (MLA) & Member of Parliament (MP)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LeaderCard leader={mla} typeLabel="Sitting MLA (Vidhan Sabha)" />
        <LeaderCard leader={mp} typeLabel="Sitting MP (Lok Sabha)" />
      </div>
    </div>
  );
}
