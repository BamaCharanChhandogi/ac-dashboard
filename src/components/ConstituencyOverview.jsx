import React from 'react';
import { formatIndianNumber } from '../utils/formatters';

export default function ConstituencyOverview({ data }) {
  const meta = data?.meta || {};
  const progression = data?.roll_progression || [];

  const totalVoters = meta.total_voters || 27265;
  const totalBooths = meta.total_booths || 50;
  const villagesCount = meta.constituent_areas?.length || 9;
  const totalFamilies = meta.total_families || 6041;

  const deletedSIR = meta.sir_deleted || 634;
  const addedSIR = meta.sir_added || 693;
  const modifiedSIR = meta.sir_modified || 330;

  // Stages matching PDF Page 1 (with Supplement-4 Oct 1)
  const defaultStages = [
    { name: 'DRAFT ROLL (DEC 2025)', count: 27206, added: null, deleted: null },
    { name: 'FINAL DRAFT (FEB 2026)', count: 27089, added: 409, deleted: 526 },
    { name: 'SUPPLEMENT-2 (APRIL 1)', count: 27145, added: 79, deleted: 23 },
    { name: 'SUPPLEMENT-3 (JULY 1)', count: 27265, added: 205, deleted: 85 },
    { name: 'SUPPLEMENT-4 (OCT 1)', count: 27265, added: 68, deleted: 68 },
  ];

  // If data has roll_progression, map from data
  const stages = progression.length > 0
    ? progression.map((p, idx) => ({
        name: p.stage_name?.toUpperCase() || `STAGE ${idx + 1}`,
        count: p.total_electors || totalVoters,
        added: p.added_count,
        deleted: p.deleted_count,
      }))
    : defaultStages;

  // Ensure Supplement-4 is present
  const hasSupp4 = stages.some(s => s.name.includes('SUPPLEMENT-4') || s.name.includes('OCT'));
  if (!hasSupp4) {
    stages.push({
      name: 'SUPPLEMENT-4 (OCT 1)',
      count: totalVoters,
      added: 68,
      deleted: 68,
    });
  }

  return (
    <div className="px-8 py-6 space-y-6 max-w-7xl">
      {/* Section Title */}
      <div>
        <h2 className="font-serif text-[26px] font-bold text-slate-900 tracking-tight">
          Constituency Overview
        </h2>
      </div>

      {/* Card: Electoral Roll Progression — SIR 2026 (Matching PDF Page 1) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="font-serif text-[18px] font-bold text-slate-900 mb-6">
          Electoral Roll Progression — SIR 2026
        </h3>

        {/* Horizontal Progression Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {stage.name}
              </p>
              <p className="text-[26px] font-bold text-slate-900 tabular-nums leading-none mb-2">
                {formatIndianNumber(stage.count)}
              </p>
              {stage.added != null || stage.deleted != null ? (
                <div className="flex items-center gap-2 text-[12px] font-semibold tabular-nums">
                  {stage.added != null && (
                    <span className="text-teal-700">+{stage.added}</span>
                  )}
                  {stage.deleted != null && (
                    <span className="text-rose-600">−{stage.deleted}</span>
                  )}
                </div>
              ) : (
                <span className="text-slate-300 text-[13px]">— —</span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Dual KPI inside Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 mt-6 border-t border-slate-100">
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Current Total Active Voters — {meta.ac_name ? meta.ac_name.toUpperCase() : 'SANQUELIM'} AC
            </p>
            <p className="text-[32px] font-bold text-teal-800 tabular-nums leading-none">
              {formatIndianNumber(totalVoters)}
            </p>
          </div>

          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Family / Household Groups
            </p>
            <p className="text-[32px] font-bold text-slate-900 tabular-nums leading-none">
              {formatIndianNumber(totalFamilies)}
            </p>
          </div>
        </div>
      </div>

      {/* Master KPI Row: 2 Rows x 3 Columns (Matching PDF Page 1 & 2) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
        {/* Row 1: Active Electors, Villages, Booths */}
        <div className="grid grid-cols-3 gap-6 text-left pb-6 border-b border-slate-100">
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Active Electors
            </p>
            <p className="text-[28px] font-bold text-slate-900 tabular-nums leading-none">
              {formatIndianNumber(totalVoters)}
            </p>
          </div>

          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Villages
            </p>
            <p className="text-[28px] font-bold text-slate-900 tabular-nums leading-none">
              {villagesCount}
            </p>
          </div>

          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Booths
            </p>
            <p className="text-[28px] font-bold text-slate-900 tabular-nums leading-none">
              {totalBooths}
            </p>
          </div>
        </div>

        {/* Row 2: Deleted (SIR), Added (SIR), Modified (SIR) */}
        <div className="grid grid-cols-3 gap-6 text-left pt-6">
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Deleted (SIR)
            </p>
            <p className="text-[28px] font-bold text-rose-600 tabular-nums leading-none">
              {formatIndianNumber(deletedSIR)}
            </p>
          </div>

          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Added (SIR)
            </p>
            <p className="text-[28px] font-bold text-teal-700 tabular-nums leading-none">
              {formatIndianNumber(addedSIR)}
            </p>
          </div>

          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Modified (SIR)
            </p>
            <p className="text-[28px] font-bold text-slate-900 tabular-nums leading-none">
              {formatIndianNumber(modifiedSIR)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
