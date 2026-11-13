import React, { useMemo } from 'react';
import { Users, UserCheck, Scale } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import PageHeader from './PageHeader';

export default function DemographicsView({ data }) {
  const meta = data?.meta || {};
  const demo = data?.demographics || {};
  const gender = demo?.gender || {};
  const ageGroups = demo?.age_groups || [];
  const totalVoters = meta.total_voters || 27265;

  const femaleCount = gender.female?.count || 13915;
  const maleCount = gender.male?.count || 13350;
  const femaleAdvantage = femaleCount - maleCount; // +565
  const sexRatio = gender.sex_ratio || Math.round((femaleCount / (maleCount || 1)) * 1000); // 1,042

  const femalePct = gender.female?.pct != null
    ? Number(gender.female.pct).toFixed(1)
    : ((femaleCount / (totalVoters || 1)) * 100).toFixed(1);
  const malePct = gender.male?.pct != null
    ? Number(gender.male.pct).toFixed(1)
    : ((maleCount / (totalVoters || 1)) * 100).toFixed(1);

  // SVG Circumference for r=60 is 2 * PI * 60 ≈ 376.99
  const CIRCUMFERENCE = 377;
  const femaleDash = Math.round((parseFloat(femalePct) / 100) * CIRCUMFERENCE);
  const maleDash = CIRCUMFERENCE - femaleDash;

  // Age group distribution sorted by cohort order (descending for pyramid)
  const sortedAgeGroups = useMemo(() => {
    return [...ageGroups].sort((a, b) => {
      const ageA = parseInt(a.cohort) || 0;
      const ageB = parseInt(b.cohort) || 0;
      return ageB - ageA;
    });
  }, [ageGroups]);

  const maxAgeCount = Math.max(...sortedAgeGroups.map((g) => Math.max(g.male || 0, g.female || 0)), 3500);

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Standardized Distinctive Page Header */}
      <PageHeader
        badgeLabel="Electoral Demographics & Pyramid"
        badgeIcon={Users}
        badgeColor="purple"
        title="Gender & Age Composition"
        subtitle={`Constituency demographic pyramid, sex ratio benchmarks, and cohort breakdowns based on Special Summary Revision rolls across ${meta.ac_name || 'Sanquelim'}`}
        meta={meta}
      />

      {/* 2. Top Master KPI Bar - Interconnected Clean 3-Row Strip (Matching Reference Image 2) */}
      <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        {/* Slot 1: Active Electors */}
        <div className="flex items-center gap-4 px-3 py-2 sm:py-0">
          <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 flex-shrink-0">
            <Users size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
                Active Electors
              </span>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/60">
                ↑ Roll Stable
              </span>
            </div>
            <div className="font-serif text-[28px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none mt-1">
              {formatIndianNumber(totalVoters)}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Total enrolled constituency voters
            </div>
          </div>
        </div>

        {/* Slot 2: Female Electors */}
        <div className="flex items-center gap-4 px-4 py-2 sm:py-0">
          <div className="w-11 h-11 rounded-full bg-pink-50 dark:bg-pink-950/60 flex items-center justify-center text-[#EC4899] dark:text-pink-400 flex-shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
              Female Electors
            </div>
            <div className="font-serif text-[28px] font-bold text-[#EC4899] dark:text-pink-400 tabular-nums leading-none mt-1">
              {formatIndianNumber(femaleCount)}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              {femalePct}% registered women voters
            </div>
          </div>
        </div>

        {/* Slot 3: Male Electors */}
        <div className="flex items-center gap-4 px-4 py-2 sm:py-0">
          <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#2563EB] dark:text-blue-400 flex-shrink-0">
            <Users size={20} />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
              Male Electors
            </div>
            <div className="font-serif text-[28px] font-bold text-[#2563EB] dark:text-blue-400 tabular-nums leading-none mt-1">
              {formatIndianNumber(maleCount)}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              {malePct}% registered men voters
            </div>
          </div>
        </div>

        {/* Slot 4: Sex Ratio & Advantage */}
        <div className="flex items-center gap-4 px-4 py-2 sm:py-0">
          <div className="w-11 h-11 rounded-full bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
            <Scale size={20} />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
              Sex Ratio
            </div>
            <div className="font-serif text-[28px] font-bold text-[#0F766E] dark:text-teal-400 tabular-nums leading-none mt-1">
              {sexRatio}{' '}
              <span className="text-[13px] font-sans font-semibold text-slate-500 dark:text-slate-400">
                ♀ / 1,000 ♂
              </span>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              +{formatIndianNumber(femaleAdvantage)} female elector advantage
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bento Grid: Gender Split Donut & Age Cohorts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Gender Split Donut */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100">
              Gender Split
            </h3>
            <p className="text-[12px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 mb-4">
              All registered electors on roll across {meta.ac_name || 'Sanquelim'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              {/* Donut SVG */}
              <div className="relative w-44 h-44 flex-shrink-0">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="18"
                  />
                  {/* Female Arc */}
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="18"
                    strokeDasharray={`${femaleDash} ${CIRCUMFERENCE}`}
                    strokeDashoffset="0"
                  />
                  {/* Male Arc */}
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="18"
                    strokeDasharray={`${maleDash} ${CIRCUMFERENCE}`}
                    strokeDashoffset={String(-femaleDash)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                    {formatIndianNumber(totalVoters)}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                    Total Electors
                  </span>
                </div>
              </div>

              {/* Legend List with Rounded Markers */}
              <div className="space-y-3.5 min-w-[200px]">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-sm bg-[#EC4899]" />
                    <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Female</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mr-2">
                      {femalePct}%
                    </span>
                    <span className="text-[12px] text-slate-400 dark:text-slate-500 tabular-nums">
                      ({formatIndianNumber(femaleCount)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-sm bg-[#2563EB]" />
                    <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Male</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mr-2">
                      {malePct}%
                    </span>
                    <span className="text-[12px] text-slate-400 dark:text-slate-500 tabular-nums">
                      ({formatIndianNumber(maleCount)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Net Advantage</span>
                  <span className="text-pink-600 dark:text-pink-400 font-bold tabular-nums">
                    +{formatIndianNumber(femaleAdvantage)} Female (51.0%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Age Group Split Table & Bars */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100">
                Age Group Split
              </h3>
              <span className="text-[11.5px] font-semibold text-slate-400 dark:text-slate-500">
                7 Cohort Bands
              </span>
            </div>
            <p className="text-[12px] text-slate-400 dark:text-slate-500 font-medium mb-4">
              Cohort distribution across all {formatIndianNumber(totalVoters)} electors
            </p>

            <div className="space-y-3">
              {sortedAgeGroups.map((g) => (
                <div key={g.cohort} className="flex items-center gap-3 text-[12px]">
                  <span className="w-14 font-bold text-slate-700 dark:text-slate-300 tabular-nums flex-shrink-0">
                    {g.cohort}
                  </span>

                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      style={{ width: `${Math.min(g.pct * 4, 100)}%` }}
                    />
                  </div>

                  <span className="w-12 text-right font-bold text-slate-800 dark:text-slate-200 tabular-nums flex-shrink-0">
                    {g.pct}%
                  </span>
                  <span className="w-16 text-right text-slate-400 dark:text-slate-500 tabular-nums flex-shrink-0">
                    {formatIndianNumber(g.count)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Mirrored Diverging Male vs. Female Population Pyramid */}
      <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100">
            Age Group by Gender
          </h3>
          <div className="flex items-center gap-4 text-[12px] font-bold">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Male ({formatIndianNumber(maleCount)})
            </span>
            <span className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Female ({formatIndianNumber(femaleCount)})
            </span>
          </div>
        </div>
        <p className="text-[12px] text-slate-400 dark:text-slate-500 font-medium mb-6">
          Male vs Female electors across age bands (mirrored population pyramid)
        </p>

        {/* Pyramid Rows */}
        <div className="space-y-2.5 max-w-3xl mx-auto my-4">
          {sortedAgeGroups.map((g) => {
            const maleWidth = ((g.male || 0) / maxAgeCount) * 100;
            const femaleWidth = ((g.female || 0) / maxAgeCount) * 100;
            const mCohortPct = (((g.male || 0) / (maleCount || 1)) * 100).toFixed(1);
            const fCohortPct = (((g.female || 0) / (femaleCount || 1)) * 100).toFixed(1);

            return (
              <div key={g.cohort} className="flex items-center gap-3 h-6 text-[11px]">
                {/* Left Side: Male count + Bar */}
                <div className="flex-1 flex items-center justify-end gap-2">
                  <span className="text-slate-400 dark:text-slate-500 tabular-nums text-[11px] font-medium hidden sm:inline">
                    {formatIndianNumber(g.male)} ({mCohortPct}%)
                  </span>
                  <div
                    className="h-5 bg-[#2563EB] rounded-l-[3px] transition-all duration-300"
                    style={{ width: `${Math.max(maleWidth, 4)}%` }}
                  />
                </div>

                {/* Cohort Label Center */}
                <span className="w-16 text-center font-bold text-slate-800 dark:text-slate-200 tabular-nums flex-shrink-0 py-0.5 px-1 bg-slate-100 dark:bg-slate-800 rounded text-[11.5px]">
                  {g.cohort}
                </span>

                {/* Right Side: Female Bar + count */}
                <div className="flex-1 flex items-center justify-start gap-2">
                  <div
                    className="h-5 bg-[#EC4899] rounded-r-[3px] transition-all duration-300"
                    style={{ width: `${Math.max(femaleWidth, 4)}%` }}
                  />
                  <span className="text-slate-400 dark:text-slate-500 tabular-nums text-[11px] font-medium hidden sm:inline">
                    {formatIndianNumber(g.female)} ({fCohortPct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
