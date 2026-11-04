import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  UserPlus, 
  UserMinus, 
  UserCog, 
  TrendingUp, 
  Calendar,
  Layers
} from 'lucide-react';
import { formatIndianNumber, formatPercentage } from '../utils/formatters';
import { safePercentage } from '../utils/normalizer';

export default function RollProgression({ data }) {
  if (!data) return null;
  const { roll_progression = [], meta = {} } = data;
  const [selectedStageIndex, setSelectedStageIndex] = useState(roll_progression.length - 1);

  const totalVoters = meta.total_voters || 1;
  const sirDeleted = meta.sir_deleted || 0;
  const sirAdded = meta.sir_added || 0;
  const sirModified = meta.sir_modified || 0;

  const additionRate = safePercentage(sirAdded, totalVoters);
  const deletionRate = safePercentage(sirDeleted, totalVoters);

  const selectedStage = roll_progression[selectedStageIndex] || roll_progression[roll_progression.length - 1];

  return (
    <section id="sir-timeline" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      
      {/* Header with Title and Revision Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Electoral Roll Progression — SIR 2026
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            4-Stage revision lifecycle tracking additions, deletions, and net elector changes from Draft Roll to Supplement-3
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
          <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
          <span>Special Intensive Revision (SIR 2026)</span>
        </div>
      </div>

      {/* 4-Stage Chronological Linked Stepper */}
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {roll_progression.map((stage, idx) => {
            const isSelected = idx === selectedStageIndex;
            const isLast = idx === roll_progression.length - 1;

            return (
              <div
                key={idx}
                onClick={() => setSelectedStageIndex(idx)}
                className={`relative cursor-pointer rounded-xl p-4 transition-all border ${
                  isSelected 
                    ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/20' 
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
                    isSelected ? 'text-blue-700' : 'text-slate-500'
                  }`}>
                    Stage {stage.stage_order}
                  </span>
                  {isLast ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      CURRENT
                    </span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="font-bold text-sm text-navy-900 mb-1">
                  {stage.stage_name}
                </div>

                <div className="text-2xl font-black text-navy-900 tabular-nums">
                  {formatIndianNumber(stage.total_electors)}
                </div>

                {/* Growth & Churn stats */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                  {stage.added_count !== null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700">+{stage.added_count}</span>
                      <span className="text-rose-700">−{stage.deleted_count}</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 font-mono text-[11px]">Baseline Roll</span>
                  )}
                  {stage.net_growth !== undefined && stage.net_growth !== 0 && (
                    <span className={`text-[11px] font-bold ${
                      stage.net_growth > 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {stage.net_growth > 0 ? `+${stage.net_growth}` : stage.net_growth} net
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Revision Aggregate KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
        
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Active Voters</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-navy-900 tabular-nums">
            {formatIndianNumber(totalVoters)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Supplement-3 certified active electors
          </div>
        </div>

        <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-200/80">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Deleted (SIR)</span>
            <UserMinus className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-800 tabular-nums">
            {formatIndianNumber(sirDeleted)}
          </div>
          <div className="text-[11px] text-rose-700 font-medium mt-1">
            {deletionRate}% of constituency baseline roll
          </div>
        </div>

        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200/80">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Added (SIR)</span>
            <UserPlus className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 tabular-nums">
            {formatIndianNumber(sirAdded)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {additionRate}% fresh enrollments across stages
          </div>
        </div>

        <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/80">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Modified (SIR)</span>
            <UserCog className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800 tabular-nums">
            {formatIndianNumber(sirModified)}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Field corrections & section updates
          </div>
        </div>

      </div>

    </section>
  );
}
