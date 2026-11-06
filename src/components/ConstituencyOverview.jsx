import React from 'react';
import { Check } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function ConstituencyOverview({ data, currentSlug, directory }) {
  const meta = data?.meta || {};
  const acNumber = meta.ac_no || (currentSlug === 'ac09-porvorim' ? 9 : currentSlug === 'ac10-aldona' ? 10 : 17);
  const acName = meta.ac_name || (currentSlug === 'ac09-porvorim' ? 'Porvorim' : currentSlug === 'ac10-aldona' ? 'Aldona' : 'Sanquelim');
  const formattedTitle = `AC ${String(acNumber).padStart(2, '0')} • ${acName}`;
  const totalVoters = meta.total_voters || 27265;
  const totalBooths = meta.total_booths || 50;
  const villagesCount = meta.constituent_areas?.length || 9;
  const totalFamilies = meta.total_families || 6041;
  const villages = meta.constituent_areas || [];

  // Dynamic 5-Stage Stepper mapped from data.roll_progression (All revisions completed up to latest)
  const rawProgression = data?.roll_progression || [];
  const steps = React.useMemo(() => {
    if (rawProgression.length > 0) {
      return rawProgression.map((p, idx) => {
        const isLatest = idx === rawProgression.length - 1;
        const net = p.net_growth;
        let delta = '—';
        let deltaType = 'neutral';
        if (net != null && idx > 0) {
          if (net > 0) {
            delta = `+${net}`;
            deltaType = 'positive';
          } else if (net < 0) {
            delta = `−${Math.abs(net)}`;
            deltaType = 'negative';
          } else {
            delta = '0';
            deltaType = 'neutral';
          }
        }

        let label = p.stage_name;
        let date = '2026';
        if (p.stage_name.includes('Draft Roll')) {
          label = 'Draft Roll';
          date = 'DEC 2025';
        } else if (p.stage_name.includes('Final Draft')) {
          label = 'Final Draft';
          date = 'FEB 2026';
        } else if (p.stage_name.includes('Supplement-2') || p.stage_name.includes('Supplement 2')) {
          label = 'Supplement 2';
          date = 'APR 2026';
        } else if (p.stage_name.includes('Supplement-3') || p.stage_name.includes('Supplement 3')) {
          label = 'Supplement 3';
          date = 'JUL 2026';
        } else if (p.stage_name.includes('Supplement-4') || p.stage_name.includes('Supplement 4')) {
          label = 'Supplement 4';
          date = 'OCT 2026';
        }

        return {
          label,
          date,
          count: p.total_electors,
          delta,
          deltaType,
          isCompleted: true, // Marked completed
          isLatest,
        };
      });
    }

    // Default 5-stage progression
    return [
      { label: 'Draft Roll', date: 'DEC 2025', count: meta.ac_no === 17 ? 27206 : Math.round(totalVoters * 0.994), delta: '—', deltaType: 'neutral', isCompleted: true, isLatest: false },
      { label: 'Final Draft', date: 'FEB 2026', count: meta.ac_no === 17 ? 27089 : Math.round(totalVoters * 0.990), delta: meta.ac_no === 17 ? '−117' : '−90', deltaType: 'negative', isCompleted: true, isLatest: false },
      { label: 'Supplement 2', date: 'APR 2026', count: meta.ac_no === 17 ? 27145 : Math.round(totalVoters * 0.994), delta: meta.ac_no === 17 ? '+56' : '+85', deltaType: 'positive', isCompleted: true, isLatest: false },
      { label: 'Supplement 3', date: 'JUL 2026', count: totalVoters, delta: meta.ac_no === 17 ? '+120' : '+142', deltaType: 'positive', isCompleted: true, isLatest: false },
      { label: 'Supplement 4', date: 'OCT 2026', count: totalVoters, delta: '0', deltaType: 'neutral', isCompleted: true, isLatest: true },
    ];
  }, [rawProgression, meta.ac_no, totalVoters]);

  const avgVotersPerBooth = Math.round(totalVoters / (totalBooths || 1));
  const avgVotersPerFamily = (totalVoters / (totalFamilies || 1)).toFixed(1);

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Top Header Row: Breadcrumb & Title on Left, Active Electors Card on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <p className="text-[11px] font-bold tracking-widest text-[#2563EB] dark:text-blue-400 uppercase mb-1">
            {meta.state ? meta.state.toUpperCase() : 'GOA'} &nbsp;/&nbsp; {meta.district ? meta.district.toUpperCase() : 'NORTH GOA'} &nbsp;/&nbsp; {meta.taluka ? meta.taluka.toUpperCase() : 'BICHOLIM'}
          </p>

          {/* AC Title (Clean Institutional Editorial Heading) */}
          <h1 className="font-serif text-[32px] md:text-[34px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {formattedTitle}
          </h1>
        </div>

        {/* Active Electors Card (Right Side) */}
        <div className="bg-[#F0FDF4] dark:bg-emerald-950/30 border border-[#DCFCE7] dark:border-emerald-800/50 rounded-xl px-5 py-3.5 shadow-xs sm:text-right min-w-[180px]">
          <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
            Active Electors
          </p>
          <p className="text-[32px] font-extrabold text-[#0D6E6E] dark:text-emerald-400 tabular-nums leading-none tracking-tight">
            {formatIndianNumber(totalVoters)}
          </p>
        </div>
      </div>

      {/* 2. Metadata Card (5 Distinct Columns) */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 text-[12px]">
          <div className="pt-2 md:pt-0 md:pr-4">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">PC</p>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-[14px]">
              {meta.pc_no ? `${meta.pc_no} – ` : ''}{meta.pc_name || 'North Goa'}
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">District</p>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-[14px]">
              {meta.district || 'North Goa'}
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Taluka</p>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-[14px]">
              {meta.taluka || 'Bicholim'}
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Reservation</p>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-[14px]">
              {meta.reservation || 'General'}
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:pl-4 col-span-2 md:col-span-1">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Areas / Villages</p>
            <p className="font-medium text-slate-700 dark:text-slate-300 text-[12px] leading-snug truncate" title={villages.join(', ')}>
              {villages.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Electoral Roll Movement Card (With Connected Stepper & Stability Badge) */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        {/* Title & Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-8">
          <div>
            <h3 className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
              Electoral Roll Movement
            </h3>
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Voter roll progression across drafts and supplements — {meta.ac_name ? `AC ${meta.ac_no} ${meta.ac_name}` : 'AC 17 Sanquelim'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 border border-[#A7F3D0] dark:border-emerald-800/60 text-[#065F46] dark:text-emerald-300 text-[12px] font-semibold self-start md:self-auto shadow-xs">
            <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0">
              <Check size={11} strokeWidth={3} />
            </div>
            <span>Roll is stable since July • no net change in latest supplement</span>
          </div>
        </div>

        {/* Connected Stepper Line */}
        <div className="relative px-2 pb-2">
          {/* Background Connecting Blue Line: strictly starts at node 0 center and ends at last node center */}
          {steps.length > 1 && (
            <div
              className="absolute top-[11px] h-[2.5px] bg-[#3B82F6] dark:bg-blue-500"
              style={{
                left: `${100 / (steps.length * 2)}%`,
                right: `${100 / (steps.length * 2)}%`,
              }}
            />
          )}

          {/* Stepper Nodes Grid: exactly matching steps.length columns */}
          <div
            className="relative grid gap-4 text-center"
            style={{
              gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            }}
          >
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Node Circle */}
                <div className="mb-3.5 z-10 flex items-center justify-center h-6">
                  {step.isLatest ? (
                    <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-sm">
                      <Check size={13} strokeWidth={3} />
                    </div>
                  ) : step.isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                      <Check size={11} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-[3px] border-[#2563EB] dark:border-blue-400 bg-white dark:bg-slate-900 shadow-xs" />
                  )}
                </div>

                {/* Stage Tag Pill */}
                <span
                  className={`px-3 py-0.5 rounded-md text-[11px] font-bold tracking-tight mb-1.5 ${
                    step.isLatest
                      ? 'bg-[#D1FAE5] dark:bg-emerald-950/60 text-[#065F46] dark:text-emerald-300'
                      : 'bg-[#EFF6FF] dark:bg-blue-950/60 text-[#1E40AF] dark:text-blue-300'
                  }`}
                >
                  {step.label}
                </span>

                {/* Date */}
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-1.5">
                  {step.date}
                </p>

                {/* Electors Count */}
                <p className="text-[24px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums leading-tight mb-1">
                  {formatIndianNumber(step.count)}
                </p>

                {/* Delta */}
                <p
                  className={`text-[13px] font-bold tabular-nums ${
                    step.deltaType === 'positive'
                      ? 'text-[#16A34A] dark:text-emerald-400'
                      : step.deltaType === 'negative'
                      ? 'text-[#DC2626] dark:text-rose-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.delta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Master Metric Cards Row (Left Accent Strips) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: ACTIVE ELECTORS */}
        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            ACTIVE ELECTORS
          </p>
          <p className="text-[26px] font-bold text-[#1E3A8A] dark:text-blue-400 tabular-nums leading-none">
            {formatIndianNumber(totalVoters)}
          </p>
        </div>

        {/* Card 2: HOUSEHOLD GROUPS */}
        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#0D9488]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            HOUSEHOLD GROUPS
          </p>
          <p className="text-[26px] font-bold text-[#0F766E] dark:text-teal-400 tabular-nums leading-none">
            {formatIndianNumber(totalFamilies)}
          </p>
        </div>

        {/* Card 3: VILLAGES */}
        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            VILLAGES
          </p>
          <p className="text-[26px] font-bold text-[#1E3A8A] dark:text-blue-400 tabular-nums leading-none">
            {villagesCount}
          </p>
        </div>

        {/* Card 4: POLLING BOOTHS */}
        <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            POLLING BOOTHS
          </p>
          <p className="text-[26px] font-bold text-[#1E3A8A] dark:text-blue-400 tabular-nums leading-none">
            {totalBooths}
          </p>
        </div>
      </div>

      {/* 5. Constituency Signals Section */}
      <div className="space-y-3">
        <h3 className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Constituency Signals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Signal 1: Roll Stability */}
          <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#10B981]">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Roll Stability
            </p>
            <p className="text-[18px] font-bold text-[#16A34A] dark:text-emerald-400 leading-tight mb-1">
              Stable
            </p>
            <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              No net change since July ({formatIndianNumber(totalVoters)}). Roll movement is minimal and within normal range.
            </p>
          </div>

          {/* Signal 2: Booth Coverage */}
          <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#3B82F6]">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Booth Coverage
            </p>
            <p className="text-[18px] font-bold text-[#1E40AF] dark:text-blue-400 leading-tight mb-1">
              {totalBooths} Booths
            </p>
            <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Coverage across {villagesCount} villages. Average ~{avgVotersPerBooth} electors per booth.
            </p>
          </div>

          {/* Signal 3: Household Concentration */}
          <div className="bg-white dark:bg-[#111C35] rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-xs border-l-[4px] border-l-[#0D9488]">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Household Concentration
            </p>
            <p className="text-[18px] font-bold text-[#0F766E] dark:text-teal-400 leading-tight mb-1">
              {formatIndianNumber(totalFamilies)} Households
            </p>
            <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Average ~{avgVotersPerFamily} electors per household.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
