import React, { useState } from 'react';
import { Users, UserCheck, Heart, Info } from 'lucide-react';
import { formatIndianNumber, formatPercentage } from '../utils/formatters';
import { safePercentage, computeSexRatio } from '../utils/normalizer';

export default function Demographics({ data }) {
  if (!data?.demographics) return null;
  const { gender = {}, age_groups = [] } = data.demographics;
  const meta = data.meta || {};
  const totalElectors = meta.total_voters || 1;

  const femaleCount = gender.female?.count || 0;
  const maleCount = gender.male?.count || 0;
  const tgCount = gender.third_gender?.count || 0;
  const unknownCount = gender.unknown?.count || 0;

  const femalePct = safePercentage(femaleCount, totalElectors);
  const malePct = safePercentage(maleCount, totalElectors);
  const tgPct = safePercentage(tgCount, totalElectors);
  const unknownPct = safePercentage(unknownCount, totalElectors);

  const sexRatio = gender.sex_ratio || computeSexRatio(maleCount, femaleCount);

  // SVG Donut Calculations
  // Circumference = 2 * PI * r = 2 * PI * 65 = 408.407
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const femaleDash = (femalePct / 100) * circumference;
  const maleDash = (malePct / 100) * circumference;
  const tgDash = (tgPct / 100) * circumference;

  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Sort age groups for ranked bars
  const sortedAgeGroups = [...age_groups].sort((a, b) => (b.count || 0) - (a.count || 0));

  // Age Cohorts in chronological order for the diverging pyramid
  const pyramidCohorts = [...age_groups].sort((a, b) => {
    const getMinAge = (cohort) => {
      const cohortStr = String(cohort ?? '');
      if (cohortStr.includes('+')) return 75;
      const match = cohortStr.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return getMinAge(a.cohort) - getMinAge(b.cohort);
  });

  return (
    <section id="demographics" className="space-y-6">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Demographic & Elector Composition
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gender breakdown, age cohort distributions, and mirrored population pyramid based on Supplement-3 roll records
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-900 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 mr-1.5 text-pink-600" />
          <span>Sex Ratio: {formatIndianNumber(sexRatio)} F / 1000 M</span>
        </div>
      </div>

      {/* Grid: Gender Donut + Ranked Age Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Gender Split Donut Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-navy-900 text-base">Gender Split</h3>
                <span className="text-xs text-slate-600">All registered electors on record</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                {formatIndianNumber(totalElectors)} Electors
              </span>
            </div>

            {/* SVG Donut */}
            <div className="relative flex items-center justify-center py-4">
              <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#E2E8F0"
                  strokeWidth="18"
                />
                
                {/* Female Slice (Pink) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#EC4899"
                  strokeWidth="18"
                  strokeDasharray={`${femaleDash} ${circumference}`}
                  strokeDashoffset={0}
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('female')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />

                {/* Male Slice (Blue) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#2563EB"
                  strokeWidth="18"
                  strokeDasharray={`${maleDash} ${circumference}`}
                  strokeDashoffset={-femaleDash}
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('male')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />

                {/* Third Gender Slice (Purple, if > 0) */}
                {tgPct > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#9333EA"
                    strokeWidth="18"
                    strokeDasharray={`${tgDash} ${circumference}`}
                    strokeDashoffset={-(femaleDash + maleDash)}
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                    onMouseEnter={() => setHoveredSlice('tg')}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                )}
              </svg>

              {/* Centered Total Electors Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600">
                  Total Roll
                </span>
                <span className="text-2xl font-black text-navy-900 tabular-nums">
                  {formatIndianNumber(totalElectors)}
                </span>
                <span className="text-[10px] text-slate-600 font-semibold">
                  ELECTORS
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-pink-50/60 border border-pink-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500 shrink-0" />
                <span className="font-semibold text-slate-800">Female</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono">{formatIndianNumber(femaleCount)}</span>
                <span className="font-bold text-pink-700 tabular-nums">{formatPercentage(femalePct)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800">Male</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono">{formatIndianNumber(maleCount)}</span>
                <span className="font-bold text-blue-700 tabular-nums">{formatPercentage(malePct)}</span>
              </div>
            </div>

            {tgCount > 0 && (
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-purple-50/60 border border-purple-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Third Gender</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">{formatIndianNumber(tgCount)}</span>
                  <span className="font-bold text-purple-700 tabular-nums">{formatPercentage(tgPct)}</span>
                </div>
              </div>
            )}

            {unknownCount > 0 && (
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-100/80 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">Unknown / Scan Anomaly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">{formatIndianNumber(unknownCount)}</span>
                  <span className="font-bold text-slate-600 tabular-nums">{formatPercentage(unknownPct)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ranked Age Group Split Bars */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-navy-900 text-base">Age Cohort Distribution</h3>
                <span className="text-xs text-slate-600">Ranked by elector concentration across standard brackets</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                7 Cohorts
              </span>
            </div>

            {/* Horizontal Ranked Bars */}
            <div className="space-y-3 py-1">
              {sortedAgeGroups.map((item, idx) => {
                const pct = item.pct || safePercentage(item.count, totalElectors);
                const isDominant = idx === 0;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy-900 w-12">{item.cohort}</span>
                        <span className="text-[11px] text-slate-600">
                          {formatIndianNumber(item.count)} electors
                        </span>
                      </div>
                      <span className={`font-bold tabular-nums ${isDominant ? 'text-blue-700' : 'text-slate-700'}`}>
                        {formatPercentage(pct)}
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDominant 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                            : 'bg-gradient-to-r from-slate-400 to-slate-500'
                        }`}
                        style={{ width: `${Math.min(pct * 3.5, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Primary Demographic Bulge: <strong>45-54 & 25-34 age brackets</strong></span>
            <span>Source: Form 6 Electoral Roll</span>
          </div>
        </div>

      </div>

      {/* Mirrored Diverging Population Pyramid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-bold text-navy-900 text-base flex items-center gap-2">
              <span>Mirrored Population Pyramid</span>
              <span className="text-xs font-normal text-slate-600">(Male vs Female across Age Bands)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Male percentage evaluated against total males ({formatIndianNumber(maleCount)}), Female percentage against total females ({formatIndianNumber(femaleCount)})
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-blue-700">
              <span className="w-3 h-3 rounded-xs bg-blue-600" />
              <span>Male Electors</span>
            </div>
            <div className="flex items-center gap-1.5 text-pink-700">
              <span className="w-3 h-3 rounded-xs bg-pink-500" />
              <span>Female Electors</span>
            </div>
          </div>
        </div>

        {/* Pyramid Chart Rows */}
        <div className="space-y-2.5 max-w-4xl mx-auto py-2">
          {pyramidCohorts.map((row, idx) => {
            const mCount = row.male || 0;
            const fCount = row.female || 0;
            const mPct = safePercentage(mCount, maleCount);
            const fPct = safePercentage(fCount, femaleCount);

            return (
              <div key={idx} className="grid grid-cols-12 items-center gap-2 text-xs">
                
                {/* Male Bar (Extending Left) */}
                <div className="col-span-5 flex items-center justify-end gap-2">
                  <span className="text-slate-600 font-mono text-[11px] tabular-nums whitespace-nowrap hidden sm:inline">
                    {formatIndianNumber(mCount)} ({formatPercentage(mPct)})
                  </span>
                  <div className="w-full max-w-[200px] bg-slate-100 h-6 rounded-l-md overflow-hidden flex justify-end">
                    <div
                      className="h-full bg-blue-600 rounded-l-md transition-all duration-300 hover:bg-blue-700"
                      style={{ width: `${Math.min(mPct * 3.8, 100)}%` }}
                      title={`Male ${row.cohort}: ${formatIndianNumber(mCount)} (${formatPercentage(mPct)})`}
                    />
                  </div>
                </div>

                {/* Center Cohort Axis */}
                <div className="col-span-2 text-center">
                  <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-extrabold text-xs border border-slate-200 shadow-2xs">
                    {row.cohort}
                  </span>
                </div>

                {/* Female Bar (Extending Right) */}
                <div className="col-span-5 flex items-center justify-start gap-2">
                  <div className="w-full max-w-[200px] bg-slate-100 h-6 rounded-r-md overflow-hidden flex justify-start">
                    <div
                      className="h-full bg-pink-500 rounded-r-md transition-all duration-300 hover:bg-pink-600"
                      style={{ width: `${Math.min(fPct * 3.8, 100)}%` }}
                      title={`Female ${row.cohort}: ${formatIndianNumber(fCount)} (${formatPercentage(fPct)})`}
                    />
                  </div>
                  <span className="text-slate-600 font-mono text-[11px] tabular-nums whitespace-nowrap hidden sm:inline">
                    {formatIndianNumber(fCount)} ({formatPercentage(fPct)})
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
