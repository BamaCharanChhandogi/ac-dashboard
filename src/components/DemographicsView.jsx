import React, { useMemo } from 'react';
import { Users } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';
import PageHeader from './PageHeader';

export default function DemographicsView({ data }) {
  const meta = data?.meta || {};
  const demo = data?.demographics || {};
  const gender = demo?.gender || {};
  const ageGroups = demo?.age_groups || [];
  const totalVoters = meta.total_voters || 27265;

  const femaleCount = gender.female?.count || Math.round(totalVoters * 0.51);
  const maleCount = gender.male?.count || Math.round(totalVoters * 0.49);
  const sexRatio = gender.sex_ratio || Math.round((femaleCount / (maleCount || 1)) * 1000);

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

  // Age group distribution
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
        subtitle={`Constituency demographic pyramid, sex ratio benchmarks, and cohort breakdowns based on Supplement-4 rolls across ${meta.ac_name || 'Sanquelim'}`}
        meta={meta}
      />

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Active Electors</p>
          <p className="text-[26px] font-bold text-[#1E3A8A] dark:text-blue-400 tabular-nums leading-none">
            {formatIndianNumber(totalVoters)}
          </p>
        </div>

        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs border-l-[4px] border-l-[#EC4899]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Sex Ratio</p>
          <p className="text-[26px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
            {sexRatio} <span className="text-[14px] font-semibold text-slate-500 dark:text-slate-400">♀ / 1,000 ♂</span>
          </p>
        </div>

        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs border-l-[4px] border-l-[#0D9488]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Female Advantage</p>
          <p className="text-[26px] font-bold text-[#0F766E] dark:text-teal-400 tabular-nums leading-none">
            +{formatIndianNumber(femaleCount - maleCount)}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Female electors outnumber males</p>
        </div>
      </div>

      {/* Bento Grid: Gender Split Donut & Age Cohorts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Gender Split Donut */}
        <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
              Gender Split
            </h3>
            <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium mb-6">All electors on record in {meta.ac_name || 'Sanquelim'}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              {/* Donut SVG */}
              <div className="relative w-44 h-44 flex-shrink-0">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="18" />
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
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatIndianNumber(totalVoters)}
                  </span>
                  <span className="text-[9.5px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                    ELECTORS
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-4 min-w-[180px]">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#EC4899]" />
                    <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Female</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mr-2">
                      {femalePct}%
                    </span>
                    <span className="text-[12px] text-slate-400 dark:text-slate-500 tabular-nums">
                      {formatIndianNumber(femaleCount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
                    <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Male</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mr-2">
                      {malePct}%
                    </span>
                    <span className="text-[12px] text-slate-400 dark:text-slate-500 tabular-nums">
                      {formatIndianNumber(maleCount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Age Group Split Table & Bars */}
        <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
          <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
            Age Group Split
          </h3>
          <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium mb-4">Total across all electors</p>

          <div className="space-y-2.5">
            {sortedAgeGroups.map((g) => (
              <div key={g.cohort} className="flex items-center gap-3 text-[12px]">
                <span className="w-12 font-bold text-slate-700 dark:text-slate-300 tabular-nums flex-shrink-0">
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

      {/* Mirrored Diverging Male vs. Female Population Pyramid */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
          Age Group by Gender
        </h3>
        <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium mb-6">
          Male vs Female across age bands (mirrored population pyramid)
        </p>

        {/* Pyramid Rows */}
        <div className="space-y-2 max-w-3xl mx-auto my-4">
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
                <span className="w-14 text-center font-bold text-slate-800 dark:text-slate-200 tabular-nums flex-shrink-0 py-0.5 px-1 bg-slate-100 dark:bg-slate-800 rounded text-[11.5px]">
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

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-[12px] font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
            <span className="text-slate-700 dark:text-slate-300">Male: {formatIndianNumber(maleCount)} ({malePct}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EC4899]" />
            <span className="text-slate-700 dark:text-slate-300">Female: {formatIndianNumber(femaleCount)} ({femalePct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
