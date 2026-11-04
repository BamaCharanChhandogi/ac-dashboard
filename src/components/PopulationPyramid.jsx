import React from 'react';
import { Info } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function PopulationPyramid({ data }) {
  const ageGroups = data?.demographics?.age_groups || [];
  const gender = data?.demographics?.gender || {};

  // Sort cohorts so oldest is at top, youngest at bottom
  const sorted = [...ageGroups].sort((a, b) => {
    const ageA = parseInt(a.cohort) || 0;
    const ageB = parseInt(b.cohort) || 0;
    return ageB - ageA;
  });

  const maxVal = Math.max(
    ...sorted.map(g => Math.max(g.male || 0, g.female || 0)),
    3000
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900 leading-tight">Population by Age & Gender</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Population pyramid (voter roll data)</p>
        </div>
        <Info size={14} className="text-slate-400 cursor-pointer" />
      </div>

      {/* Pyramid Rows */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-center my-2">
        {sorted.map((group) => {
          const malePct = ((group.male || 0) / maxVal) * 100;
          const femalePct = ((group.female || 0) / maxVal) * 100;

          return (
            <div key={group.cohort} className="flex items-center gap-2 h-5 text-[11px]">
              {/* Male bar (anchored to right) */}
              <div className="flex-1 flex justify-end">
                <div
                  className="bg-blue-500 rounded-l-[3px] h-4 transition-all duration-500 relative group"
                  style={{ width: `${Math.max(malePct, 3)}%` }}
                >
                  <span className="absolute right-1 top-0 text-[8.5px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {(group.male || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Age label in center */}
              <span className="w-10 text-center text-[10.5px] font-semibold text-slate-500 tabular-nums flex-shrink-0">
                {group.cohort}
              </span>

              {/* Female bar (anchored to left) */}
              <div className="flex-1 flex justify-start">
                <div
                  className="bg-pink-500 rounded-r-[3px] h-4 transition-all duration-500 relative group"
                  style={{ width: `${Math.max(femalePct, 3)}%` }}
                >
                  <span className="absolute left-1 top-0 text-[8.5px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {(group.female || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-slate-600 font-medium">
            Male <span className="font-semibold text-slate-900">{gender.male ? formatIndianNumber(gender.male.count) : '—'}</span> ({gender.male?.pct || 0}%)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span className="text-slate-600 font-medium">
            Female <span className="font-semibold text-slate-900">{gender.female ? formatIndianNumber(gender.female.count) : '—'}</span> ({gender.female?.pct || 0}%)
          </span>
        </div>
      </div>
    </div>
  );
}
