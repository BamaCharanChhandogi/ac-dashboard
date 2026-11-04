import React from 'react';
import { formatIndianNumber } from '../utils/formatters';

const PARTY_COLORS = {
  BJP: '#FF9933',
  INC: '#1982C4',
  IND: '#6B7280',
  AAP: '#0E7490',
  AITC: '#10B981',
  TMC: '#10B981',
  RGP: '#8B5CF6',
  NOTA: '#94A3B8',
  Others: '#94A3B8',
};

function getPartyColor(party) {
  return PARTY_COLORS[party] || '#94A3B8';
}

export default function GenderVoteShare({ data }) {
  const gender = data?.demographics?.gender || {};
  const totalVoters = data?.meta?.total_voters || 0;

  const malePct = gender.male?.pct || 48.9;
  const femalePct = gender.female?.pct || 51.1;

  // Donut math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const maleArc = (malePct / 100) * circumference;
  const femaleArc = (femalePct / 100) * circumference;

  // Latest election vote share
  const elections = data?.elections?.vote_share_bars?.assembly || [];
  const latestElection = elections.length > 0 ? elections[0] : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 h-full flex flex-col justify-between">
      {/* Gender Distribution */}
      <div>
        <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Gender Distribution</h3>

        <div className="flex items-center justify-center gap-6 py-1">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0">
            <svg width="124" height="124" viewBox="0 0 124 124">
              <circle cx="62" cy="62" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="13" />
              {/* Male arc */}
              <circle
                cx="62" cy="62" r={radius}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="13"
                strokeDasharray={`${maleArc} ${circumference - maleArc}`}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              {/* Female arc */}
              <circle
                cx="62" cy="62" r={radius}
                fill="none"
                stroke="#EC4899"
                strokeWidth="13"
                strokeDasharray={`${femaleArc} ${circumference - femaleArc}`}
                strokeDashoffset={circumference * 0.25 - maleArc}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[16px] font-bold text-slate-900 tabular-nums">
                {totalVoters > 100000
                  ? `${(totalVoters / 100000).toFixed(2)}L`
                  : `${(totalVoters / 1000).toFixed(1)}K`}
              </span>
              <span className="text-[9.5px] text-slate-400 font-medium">Population</span>
            </div>
          </div>

          {/* Counts */}
          <div className="space-y-3 min-w-[120px]">
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-slate-500 leading-tight">Male</p>
                <p className="text-[14px] font-bold text-slate-900 tabular-nums">
                  {gender.male ? formatIndianNumber(gender.male.count) : '—'}
                </p>
                <p className="text-[10.5px] text-slate-400 font-medium tabular-nums">({malePct}%)</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-slate-500 leading-tight">Female</p>
                <p className="text-[14px] font-bold text-slate-900 tabular-nums">
                  {gender.female ? formatIndianNumber(gender.female.count) : '—'}
                </p>
                <p className="text-[10.5px] text-slate-400 font-medium tabular-nums">({femalePct}%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 my-2" />

      {/* Vote Share Horizontal Bars */}
      {latestElection && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[13px] font-semibold text-slate-900">Vote Share</h3>
            <span className="text-[10.5px] text-slate-400 font-medium">
              ({latestElection.election || 'Latest Assembly'})
            </span>
          </div>

          <div className="space-y-2">
            {(latestElection.candidates || []).slice(0, 4).map((cand, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getPartyColor(cand.party) }}
                  />
                  <span className="text-[11px] font-semibold text-slate-700 truncate">{cand.party}</span>
                </div>

                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(cand.pct, 100)}%`,
                      backgroundColor: getPartyColor(cand.party),
                    }}
                  />
                </div>

                <span className="text-[11px] font-bold text-slate-800 tabular-nums w-12 text-right flex-shrink-0">
                  {cand.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
