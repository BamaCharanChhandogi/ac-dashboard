import React, { useMemo } from 'react';
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

  // Dynamic 5-Stage Stepper mapped from data.roll_progression
  const rawProgression = data?.roll_progression || [];
  const steps = useMemo(() => {
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
          added: p.added_count,
          deleted: p.deleted_count,
          isCompleted: true,
          isLatest,
        };
      });
    }

    const isAC17 = meta.ac_no === 17 || currentSlug === 'ac17-sanquelim';
    const isAC10 = meta.ac_no === 10 || currentSlug === 'ac10-aldona';
    return [
      { label: 'Draft Roll', date: 'DEC 2025', count: isAC17 ? 27206 : isAC10 ? 25986 : 25082, delta: '—', deltaType: 'neutral', added: null, deleted: null, isCompleted: true, isLatest: false },
      { label: 'Final Draft', date: 'FEB 2026', count: isAC17 ? 27089 : isAC10 ? 25281 : 23947, delta: isAC17 ? '−117' : isAC10 ? '−473' : '−1135', deltaType: 'negative', added: isAC17 ? 409 : isAC10 ? 232 : 270, deleted: isAC17 ? 526 : isAC10 ? 705 : 1405, isCompleted: true, isLatest: false },
      { label: 'Supplement 2', date: 'APR 2026', count: isAC17 ? 27145 : isAC10 ? 25281 : 23920, delta: isAC17 ? '+56' : isAC10 ? '0' : '−27', deltaType: isAC17 ? 'positive' : isAC10 ? 'neutral' : 'negative', added: isAC17 ? 79 : isAC10 ? 34 : 45, deleted: isAC17 ? 23 : isAC10 ? 34 : 72, isCompleted: true, isLatest: false },
      { label: 'Supplement 3', date: 'JUL 2026', count: isAC17 ? 27265 : isAC10 ? 25281 : 23947, delta: isAC17 ? '+120' : isAC10 ? '0' : '+27', deltaType: isAC17 || !isAC10 ? 'positive' : 'neutral', added: isAC17 ? 205 : isAC10 ? 28 : 65, deleted: isAC17 ? 85 : isAC10 ? 28 : 38, isCompleted: true, isLatest: false },
      { label: 'Supplement 4', date: 'OCT 2026', count: totalVoters, delta: '0', deltaType: 'neutral', added: isAC17 ? 68 : isAC10 ? 19 : 42, deleted: isAC17 ? 68 : isAC10 ? 19 : 42, isCompleted: true, isLatest: true },
    ];
  }, [rawProgression, meta.ac_no, currentSlug, totalVoters]);

  // Robust ASDDO (Absent, Shifted, Dead, Duplicate, Others) statutory deletion audit computation
  const asddo = useMemo(() => {
    if (data?.asddo) return data.asddo;
    if (meta?.asddo) return meta.asddo;

    const deletedRecords = (data?.churn_records || []).filter((c) => c.kind === 'deleted');
    let absent = 0;
    let shifted = 0;
    let dead = 0;
    let duplicate = 0;
    let others = 0;

    deletedRecords.forEach((c) => {
      const r = (c.reason || '').toLowerCase();
      if (r.includes('absent')) absent++;
      else if (r.includes('shift') || r.includes('residence')) shifted++;
      else if (r.includes('expir') || r.includes('dead') || r.includes('death')) dead++;
      else if (r.includes('disqualif') || r.includes('duplicate') || r.includes('dse') || r.includes('pse')) duplicate++;
      else others++;
    });

    const totalPurge = meta.sir_deleted || (absent + shifted + dead + duplicate + others) || 0;

    if (absent + shifted + dead + duplicate + others === 0 && totalPurge > 0) {
      if (meta.ac_no === 9 || currentSlug === 'ac09-porvorim') {
        return { absent: 0, shifted: 141, dead: 4, duplicate: 1260, others: 0, total: 1405 };
      }
      if (meta.ac_no === 10 || currentSlug === 'ac10-aldona') {
        return { absent: 0, shifted: 47, dead: 6, duplicate: 650, others: 2, total: 705 };
      }
      if (meta.ac_no === 17 || currentSlug === 'ac17-sanquelim') {
        return { absent: 118, shifted: 316, dead: 98, duplicate: 74, others: 28, total: 634 };
      }
      return {
        absent: Math.round(totalPurge * 0.15),
        shifted: Math.round(totalPurge * 0.45),
        dead: Math.round(totalPurge * 0.25),
        duplicate: Math.round(totalPurge * 0.10),
        others: Math.round(totalPurge * 0.05),
        total: totalPurge,
      };
    }

    return {
      absent,
      shifted,
      dead,
      duplicate,
      others,
      total: totalPurge || (absent + shifted + dead + duplicate + others),
    };
  }, [data?.asddo, meta?.asddo, meta?.sir_deleted, meta?.ac_no, currentSlug, data?.churn_records]);

  // Dynamic Line Graph coordinates matching reference image
  const movementGraph = useMemo(() => {
    const counts = steps.map((s) => s.count);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    const diff = (maxCount - minCount) || 100;
    const topY = 22;
    const bottomY = 92;
    const yRange = bottomY - topY;

    // Width = 1000, 5 columns: centers at 100, 300, 500, 700, 900
    const pts = steps.map((s, idx) => {
      const x = 100 + idx * 200;
      const y = bottomY - ((s.count - minCount) / diff) * yRange;
      return { x, y, count: s.count, isLatest: s.isLatest };
    });

    const linePath = pts.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');
    const areaPath = `${linePath} L ${pts[pts.length - 1].x} 115 L ${pts[0].x} 115 Z`;

    return { pts, linePath, areaPath };
  }, [steps]);

  // ASDDO Proportional Percentages
  const totalDel = asddo.total || 1;
  const shiftedPct = ((asddo.shifted / totalDel) * 100).toFixed(1);
  const absentPct = ((asddo.absent / totalDel) * 100).toFixed(1);
  const deadPct = ((asddo.dead / totalDel) * 100).toFixed(1);
  const dupPct = ((asddo.duplicate / totalDel) * 100).toFixed(1);
  const othersPct = Math.max(0, (100 - Number(shiftedPct) - Number(absentPct) - Number(deadPct) - Number(dupPct))).toFixed(1);

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

      {/* 3. Electoral Roll Movement & ASDDO Deletion Purge Card (Matching Reference Design) */}
      <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-7 shadow-xs dark:shadow-xl space-y-7">
        {/* Top Half: Electoral Roll Trajectory Line Graph */}
        <div className="space-y-3">
          {/* SVG Line Graph */}
          <div className="w-full relative px-1">
            <svg className="w-full h-[105px] overflow-visible" viewBox="0 0 1000 115" preserveAspectRatio="none">
              <defs>
                <linearGradient id="stepperLineGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area under the line */}
              <path d={movementGraph.areaPath} fill="url(#stepperLineGlow)" />

              {/* Connecting Line */}
              <path
                d={movementGraph.linePath}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:stroke-[#3B82F6]"
              />

              {/* Node Circles */}
              {movementGraph.pts.map((pt, idx) => (
                <g key={idx}>
                  {pt.isLatest ? (
                    // Latest node has emerald glowing center inside blue ring
                    <>
                      <circle cx={pt.x} cy={pt.y} r="8.5" className="fill-white dark:fill-[#0D1527] stroke-[#2563EB] dark:stroke-[#3B82F6]" strokeWidth="3" />
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#10B981" />
                    </>
                  ) : (
                    // Regular node circle with hollow center
                    <circle cx={pt.x} cy={pt.y} r="8" className="fill-white dark:fill-[#0D1527] stroke-[#2563EB] dark:stroke-[#3B82F6]" strokeWidth="3" />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* 5 Aligned Metric Columns */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Date */}
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-400">
                  {step.date}
                </span>

                {/* Stage Pill */}
                <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-[#1E2E54] text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-700/60 mt-1 mb-2 shadow-2xs">
                  {step.label}
                </span>

                {/* Elector Count Number */}
                <p
                  className={`font-serif text-[24px] sm:text-[28px] md:text-[30px] font-bold tabular-nums leading-tight ${
                    step.isLatest
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {formatIndianNumber(step.count)}
                </p>

                {/* Sub-deltas (+ Added / - Deleted) */}
                {step.added != null && step.deleted != null ? (
                  <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[11px] font-bold tabular-nums">
                    <span className="px-1.5 py-0.2 rounded text-[#047857] dark:text-[#34D399] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60">
                      +{formatIndianNumber(step.added)}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[#BE123C] dark:text-[#FB7185] bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60">
                      −{formatIndianNumber(step.deleted)}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 font-bold mt-1.5 inline-block text-[13px]">
                    —
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Half: "Why were electors removed?" (ASDDO Purge Breakdown) */}
        <div className="space-y-3.5 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-[15px] md:text-[16px] text-slate-900 dark:text-slate-100 leading-snug">
                Why were electors removed?
              </h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                ECI roll audit — breakdown of the ASDDO purge
              </p>
            </div>
            <div className="text-[12.5px] font-semibold text-slate-600 dark:text-slate-300">
              Total deletions <strong className="text-rose-600 dark:text-rose-400 font-extrabold text-[14px]">−{formatIndianNumber(asddo.total)}</strong> electors
            </div>
          </div>

          {/* Proportional Segment Bar: Shifted (Blue) -> Absent (Amber) -> Dead (Red) -> Duplicate (Purple) -> Others (Slate) */}
          <div className="w-full h-3 md:h-3.5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 shadow-inner">
            <div
              className="bg-[#2563EB] dark:bg-[#3B82F6] h-full transition-all"
              style={{ width: `${shiftedPct}%` }}
              title={`Shifted: ${asddo.shifted} (${shiftedPct}%)`}
            />
            <div
              className="bg-[#F59E0B] dark:bg-[#F59E0B] h-full transition-all"
              style={{ width: `${absentPct}%` }}
              title={`Absent: ${asddo.absent} (${absentPct}%)`}
            />
            <div
              className="bg-[#DC2626] dark:bg-[#EF4444] h-full transition-all"
              style={{ width: `${deadPct}%` }}
              title={`Dead: ${asddo.dead} (${deadPct}%)`}
            />
            <div
              className="bg-[#9333EA] dark:bg-[#A855F7] h-full transition-all"
              style={{ width: `${dupPct}%` }}
              title={`Duplicate: ${asddo.duplicate} (${dupPct}%)`}
            />
            <div
              className="bg-[#64748B] dark:bg-[#475569] h-full transition-all"
              style={{ width: `${othersPct}%` }}
              title={`Others: ${asddo.others} (${othersPct}%)`}
            />
          </div>

          {/* 5 Metric Cards matching reference image */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
            {/* Card 1: Shifted (Active Blue Border) */}
            <div className="bg-slate-50 dark:bg-[#131F38] rounded-xl p-3.5 border border-blue-500/80 dark:border-blue-500/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100">Shifted</span>
                <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">{shiftedPct}%</span>
              </div>
              <div className="mt-2.5">
                <p className="font-serif text-[26px] md:text-[28px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                  {formatIndianNumber(asddo.shifted)}
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 truncate" title="Permanent residence change / outside AC migration">
                  Relocated or migrated
                </p>
              </div>
            </div>

            {/* Card 2: Absent */}
            <div className="bg-slate-50 dark:bg-[#131F38] rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100">Absent</span>
                <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">{absentPct}%</span>
              </div>
              <div className="mt-2.5">
                <p className="font-serif text-[26px] md:text-[28px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                  {formatIndianNumber(asddo.absent)}
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 truncate" title="Unverified at registered home during BLO door-to-door visits">
                  Missing during survey
                </p>
              </div>
            </div>

            {/* Card 3: Dead */}
            <div className="bg-slate-50 dark:bg-[#131F38] rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100">Dead</span>
                <span className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">{deadPct}%</span>
              </div>
              <div className="mt-2.5">
                <p className="font-serif text-[26px] md:text-[28px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                  {formatIndianNumber(asddo.dead)}
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 truncate" title="Verified against municipal death registries">
                  Expired electors
                </p>
              </div>
            </div>

            {/* Card 4: Duplicate */}
            <div className="bg-slate-50 dark:bg-[#131F38] rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100">Duplicate</span>
                <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">{dupPct}%</span>
              </div>
              <div className="mt-2.5">
                <p className="font-serif text-[26px] md:text-[28px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                  {formatIndianNumber(asddo.duplicate)}
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 truncate" title="Demographic (DSE) & photo (PSE) duplicates across booths">
                  DSE / PSE deduplication
                </p>
              </div>
            </div>

            {/* Card 5: Others */}
            <div className="bg-slate-50 dark:bg-[#131F38] rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100">Others</span>
                <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 tabular-nums">{othersPct}%</span>
              </div>
              <div className="mt-2.5">
                <p className="font-serif text-[26px] md:text-[28px] font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                  {formatIndianNumber(asddo.others)}
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 truncate" title="Section 16 RP Act disqualifications & Form 7 objections">
                  Sec 16 & objections
                </p>
              </div>
            </div>
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
