import React, { useState, useMemo } from 'react';
import { Landmark, Vote, Building2 } from 'lucide-react';
import PageHeader from './PageHeader';
import { formatIndianNumber, formatMargin } from '../utils/formatters';

export default function ElectionResultsView({ data }) {
  const meta = data?.meta || {};
  const leaders = data?.leaders || {};
  const elections = data?.elections || {};
  const [activeScope, setActiveScope] = useState('assembly'); // 'assembly' | 'parliament'

  // =========================================================================
  // 1. DYNAMIC ASSEMBLY JOURNEY DATA & MATHEMATICAL SVG SCALING (CARD 1)
  // =========================================================================
  const journeyData = useMemo(() => {
    if (elections.assembly_journey) return elections.assembly_journey;
    return {
      years: ['2007', '2012', '2017', '2022'],
      series: [
        { party: 'BJP', color: '#EA580C', data: [null, 65.93, 42.44, 47.73] },
        { party: 'INC', color: '#2563EB', data: [42.0, 33.93, 33.9, 45.13] },
        { party: 'Others', color: '#16A34A', data: [null, null, 16.4, 6.1] },
      ],
    };
  }, [elections.assembly_journey]);

  // Card 1 SVG Layout dimensions
  const c1Width = 540;
  const c1Height = 230;
  const c1Pad = { left: 45, right: 35, top: 25, bottom: 30 };
  const c1PlotW = c1Width - c1Pad.left - c1Pad.right;
  const c1PlotH = c1Height - c1Pad.top - c1Pad.bottom;
  const c1BaseY = c1Height - c1Pad.bottom; // 200

  const c1Years = journeyData.years || [];
  const c1Series = journeyData.series || [];
  const c1YMin = 0;
  const c1YMax = 80;
  const c1YTicks = [80, 60, 40, 20, 0];

  const getC1X = (index) => c1Pad.left + (index / Math.max(1, c1Years.length - 1)) * c1PlotW;
  const getC1Y = (val) => c1Pad.top + (1 - (val - c1YMin) / (c1YMax - c1YMin)) * c1PlotH;

  // Compute points and paths for each party series dynamically
  const computedC1Series = useMemo(() => {
    return c1Series.map((s, sIdx) => {
      const validPoints = [];
      s.data.forEach((val, idx) => {
        if (val !== null && val !== undefined) {
          validPoints.push({
            x: getC1X(idx),
            y: getC1Y(val),
            val,
            year: c1Years[idx],
            index: idx,
          });
        }
      });

      const polylineStr = validPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      let polygonStr = '';
      if (validPoints.length > 0) {
        polygonStr = `${polylineStr} ${validPoints[validPoints.length - 1].x.toFixed(1)},${c1BaseY} ${validPoints[0].x.toFixed(1)},${c1BaseY}`;
      }

      return {
        party: s.party,
        color: s.color,
        validPoints,
        polylineStr,
        polygonStr,
        gradId: `grad_c1_${sIdx}`,
      };
    });
  }, [c1Series, c1Years]);

  // =========================================================================
  // 2. DYNAMIC LATEST RESULTS (CARD 2)
  // =========================================================================
  const mla = leaders.mla || {};
  const mp = leaders.mp || {};
  const assemblyReturns = elections.candidate_returns?.assembly_2022 || [];
  const parliamentReturns = elections.candidate_returns?.parliament_2024 || [];

  const activeWinner = useMemo(() => {
    if (activeScope === 'assembly') {
      const winnerCandidate = assemblyReturns.find((c) => c.rank === 1 || c.status === 'Winner');
      const runnerUpCandidate = assemblyReturns.find((c) => c.rank === 2 || c.status === 'Runner-Up');
      const votePct = mla.vote_pct || winnerCandidate?.pct || 47.73;
      const votes = mla.votes || winnerCandidate?.votes || 12250;
      const marginVotes = mla.margin_votes !== undefined ? mla.margin_votes : (winnerCandidate?.margin ? parseInt(winnerCandidate.margin) : 666);
      const marginPct = mla.margin_pct !== undefined ? mla.margin_pct : (winnerCandidate && runnerUpCandidate ? (winnerCandidate.pct - runnerUpCandidate.pct).toFixed(2) : '2.60');

      const marginStr = marginVotes > 0 ? `+${formatIndianNumber(marginVotes)}` : formatIndianNumber(marginVotes);

      return {
        name: mla.name || winnerCandidate?.name || 'Dr. Pramod Sawant',
        party: mla.party || winnerCandidate?.party || 'BJP',
        photo: mla.photo_url || '/images/leaders/pramod-sawant.jpg',
        voteShare: `${Number(votePct).toFixed(2)}%`,
        votes: `${formatIndianNumber(votes)} votes`,
        margin: marginStr,
        marginPct: `(+${Number(marginPct).toFixed(2)}%)`,
        runnerUp: runnerUpCandidate ? `${runnerUpCandidate.name} (${runnerUpCandidate.party})` : mla.runner_up || 'Dharmesh Saglani (INC)',
        runnerUpVotes: runnerUpCandidate ? `${formatIndianNumber(runnerUpCandidate.votes)} votes (${runnerUpCandidate.pct.toFixed(2)}%)` : '11,584 votes (45.13%)',
      };
    } else {
      const winnerCandidate = parliamentReturns.find((c) => c.rank === 1 || c.status === 'Winner');
      const runnerUpCandidate = parliamentReturns.find((c) => c.rank === 2 || c.status === 'Runner-Up');
      const votePct = mp.vote_pct || winnerCandidate?.pct || 56.43;
      const votes = mp.votes || winnerCandidate?.votes || 257326;
      const marginVotes = mp.margin_votes !== undefined ? mp.margin_votes : (winnerCandidate?.margin ? parseInt(winnerCandidate.margin) : 116015);
      const marginPct = mp.margin_pct !== undefined ? mp.margin_pct : 25.44;

      const marginStr = marginVotes > 0 ? `+${formatIndianNumber(marginVotes)}` : formatIndianNumber(marginVotes);

      return {
        name: mp.name || winnerCandidate?.name || 'Shripad Yesso Naik',
        party: mp.party || winnerCandidate?.party || 'BJP',
        photo: mp.photo_url || '/images/leaders/shripad-naik.jpg',
        voteShare: `${Number(votePct).toFixed(2)}%`,
        votes: `${formatIndianNumber(votes)} votes`,
        margin: marginStr,
        marginPct: `(+${Number(marginPct).toFixed(2)}%)`,
        runnerUp: runnerUpCandidate ? `${runnerUpCandidate.name} (${runnerUpCandidate.party})` : mp.runner_up || 'Ramakant Khalap (INC)',
        runnerUpVotes: runnerUpCandidate ? `${formatIndianNumber(runnerUpCandidate.votes)} votes (${runnerUpCandidate.pct.toFixed(2)}%)` : '3,442 votes (15.10%)',
      };
    }
  }, [activeScope, mla, mp, assemblyReturns, parliamentReturns]);

  // =========================================================================
  // 3. DYNAMIC ASSEMBLY ELECTION HISTORY (CARD 3)
  // =========================================================================
  const assemblyHistory = useMemo(() => {
    if (elections.assembly_history && elections.assembly_history.length > 0) {
      return elections.assembly_history;
    }
    // Fallback: derive dynamically from vote_share_bars.assembly
    const bars = elections.vote_share_bars?.assembly || [];
    return bars.map((elec) => {
      const winner = elec.candidates?.find((c) => c.is_winner) || elec.candidates?.[0];
      const runnerUp = elec.candidates?.filter((c) => c !== winner).sort((a, b) => b.pct - a.pct)[0];
      const marginVotes = winner && runnerUp && winner.votes && runnerUp.votes ? winner.votes - runnerUp.votes : null;
      const marginPct = winner && runnerUp ? (winner.pct - runnerUp.pct).toFixed(2) : null;
      const year = elec.election.replace(/[^\d]/g, '');
      return {
        year,
        winner: winner?.name || '—',
        winnerParty: winner?.party || '—',
        winnerVotes: winner?.votes ? formatIndianNumber(winner.votes) : '—',
        winnerPct: winner?.pct ? `${winner.pct}%` : '—',
        runnerUp: runnerUp ? `${runnerUp.name} (${runnerUp.party})` : '—',
        runnerUpVotes: runnerUp?.votes ? formatIndianNumber(runnerUp.votes) : '—',
        marginVotes: marginVotes ? `+${formatIndianNumber(marginVotes)}` : '—',
        marginPct: marginPct ? `(${marginPct}%)` : '',
      };
    });
  }, [elections.assembly_history, elections.vote_share_bars?.assembly]);

  // =========================================================================
  // 4. DYNAMIC PARLIAMENTARY TREND & MATHEMATICAL SVG SCALING (CARD 4)
  // =========================================================================
  const parliamentData = useMemo(() => {
    if (elections.parliament_trend && elections.parliament_trend.length > 0) {
      return elections.parliament_trend;
    }
    return [
      { year: '1999', pct: 54.96 },
      { year: '2004', pct: 56.84 },
      { year: '2009', pct: 47.10 },
      { year: '2014', pct: 58.51 },
      { year: '2019', pct: 57.12 },
      { year: '2024', pct: 56.43 },
    ];
  }, [elections.parliament_trend]);

  // Card 4 SVG dimensions
  const c4Width = 540;
  const c4Height = 230;
  const c4Pad = { left: 45, right: 35, top: 35, bottom: 30 };
  const c4PlotW = c4Width - c4Pad.left - c4Pad.right;
  const c4PlotH = c4Height - c4Pad.top - c4Pad.bottom;
  const c4BaseY = c4Height - c4Pad.bottom; // 200

  // Dynamic Y bounds for Card 4
  const c4YMin = 40;
  const c4YMax = 70;
  const c4YTicks = [70, 60, 50, 40];

  const getC4X = (index) => c4Pad.left + (index / Math.max(1, parliamentData.length - 1)) * c4PlotW;
  const getC4Y = (pct) => c4Pad.top + (1 - (pct - c4YMin) / (c4YMax - c4YMin)) * c4PlotH;

  const computedC4Points = useMemo(() => {
    return parliamentData.map((pt, idx) => ({
      x: getC4X(idx),
      y: getC4Y(pt.pct),
      pct: pt.pct,
      year: pt.year,
    }));
  }, [parliamentData]);

  const c4PolylineStr = useMemo(() => {
    return computedC4Points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }, [computedC4Points]);

  const c4PolygonStr = useMemo(() => {
    if (computedC4Points.length === 0) return '';
    return `${c4PolylineStr} ${computedC4Points[computedC4Points.length - 1].x.toFixed(1)},${c4BaseY} ${computedC4Points[0].x.toFixed(1)},${c4BaseY}`;
  }, [c4PolylineStr, computedC4Points]);

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Standardized Editorial Page Header */}
      <PageHeader
        title="Election Results & Historical Returns"
        subtitle={`Assembly Form-20 returns, Parliamentary margins, and longitudinal vote-share trends across ${meta.ac_name || 'Sanquelim'}`}
      />

      {/* 2. Unified 2x2 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* ================= CARD 1: ELECTORAL JOURNEY — ASSEMBLY ================= */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title and Dynamic Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <Landmark className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    Electoral Journey — Assembly
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    Vote share and margin trend over time
                  </p>
                </div>
              </div>

              {/* Dynamic Legend */}
              <div className="flex items-center gap-3.5 text-[11.5px] font-bold text-slate-700 dark:text-slate-300">
                {c1Series.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.party}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SVG Trend Chart */}
            <div className="w-full h-[225px]">
              <svg viewBox={`0 0 ${c1Width} ${c1Height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  {computedC1Series.map((s) => (
                    <linearGradient key={s.gradId} id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={s.color} stopOpacity="0.20" />
                      <stop offset="100%" stopColor={s.color} stopOpacity="0.01" />
                    </linearGradient>
                  ))}
                </defs>

                {/* Horizontal Gridlines & Y-Axis Labels */}
                {c1YTicks.map((val) => {
                  const y = getC1Y(val);
                  return (
                    <g key={val}>
                      <line
                        x1={c1Pad.left}
                        y1={y}
                        x2={c1Width - c1Pad.right + 15}
                        y2={y}
                        stroke="currentColor"
                        className="text-slate-100 dark:text-slate-800/80"
                        strokeWidth="1"
                      />
                      <text
                        x={c1Pad.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-slate-400 dark:fill-slate-500 text-[11px] font-semibold"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Base Axis Line */}
                <line
                  x1={c1Pad.left}
                  y1={c1BaseY}
                  x2={c1Width - c1Pad.right + 15}
                  y2={c1BaseY}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="1.2"
                />

                {/* Render Area Polygons & Polylines */}
                {computedC1Series.map((s) => (
                  <g key={s.party}>
                    {s.polygonStr && (
                      <polygon points={s.polygonStr} fill={`url(#${s.gradId})`} />
                    )}
                    {s.polylineStr && (
                      <polyline
                        points={s.polylineStr}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2.2"
                      />
                    )}
                  </g>
                ))}

                {/* Render Dots & Percentage Labels */}
                {computedC1Series.map((s) => (
                  <g key={`dots_${s.party}`}>
                    {s.validPoints.map((pt, pIdx) => {
                      // Adjust label Y placement to avoid collision
                      const isBjp = s.party.includes('BJP');
                      const isInc = s.party.includes('INC');
                      const labelY = isBjp ? pt.y - 12 : (isInc && pt.index === 0 ? pt.y - 12 : pt.y + 17);

                      return (
                        <g key={pIdx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="4.5"
                            fill={s.color}
                            stroke="#fff"
                            strokeWidth="2"
                          />
                          <text
                            x={pt.x}
                            y={labelY}
                            textAnchor="middle"
                            fill={s.color}
                            className="text-[12px] font-bold"
                          >
                            {pt.val.toFixed(2).replace(/\.00$/, '')}%
                          </text>
                        </g>
                      );
                    })}
                  </g>
                ))}

                {/* Special dash for first year if BJP didn't contest */}
                {journeyData.series[0]?.data[0] === null && (
                  <text
                    x={getC1X(0)}
                    y={getC1Y(16)}
                    textAnchor="middle"
                    className="fill-slate-800 dark:fill-slate-200 text-[13px] font-bold"
                  >
                    —
                  </text>
                )}

                {/* X-Axis Year Labels */}
                {c1Years.map((year, idx) => (
                  <text
                    key={year}
                    x={getC1X(idx)}
                    y={c1Height - 12}
                    textAnchor="middle"
                    className="fill-slate-600 dark:fill-slate-400 text-[12px] font-semibold"
                  >
                    {year}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* ================= CARD 2: LATEST RESULTS ================= */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title and Scope Toggle */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <Vote className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
                <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  Latest Results
                </h3>
              </div>

              {/* Segmented Toggle Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/90 rounded-full border border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveScope('assembly')}
                  className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all ${
                    activeScope === 'assembly'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Assembly (2022)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScope('parliament')}
                  className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all ${
                    activeScope === 'parliament'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Lok Sabha (2024)
                </button>
              </div>
            </div>

            {/* Winner Row: Profile + Divider + Vote Share + Divider + Victory Margin */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 py-4">
              {/* Winner Profile */}
              <div className="sm:col-span-6 flex items-center gap-3 min-w-0">
                <img
                  src={activeWinner.photo}
                  alt={activeWinner.name}
                  className="w-16 h-16 sm:w-17 sm:h-17 rounded-full object-cover border-2 border-orange-400/90 shadow-xs flex-shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase">
                    WINNER
                  </span>
                  <h4 className="font-serif text-[17px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-tight whitespace-nowrap">
                    {activeWinner.name}
                  </h4>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                    {activeWinner.party}
                  </span>
                </div>
              </div>

              {/* Vote Share */}
              <div className="sm:col-span-3 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-3 text-left">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Vote Share
                </p>
                <p className="font-serif text-[24px] sm:text-[26px] font-bold text-slate-900 dark:text-slate-100 leading-none my-1">
                  {activeWinner.voteShare}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  {activeWinner.votes}
                </p>
              </div>

              {/* Victory Margin */}
              <div className="sm:col-span-3 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-3 text-left">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Victory Margin
                </p>
                <p className="font-serif text-[24px] sm:text-[26px] font-bold text-emerald-600 dark:text-emerald-400 leading-none my-1">
                  {activeWinner.margin}
                </p>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {activeWinner.marginPct}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Tinted Pill Strip */}
          <div className="bg-[#EFF6FF]/70 dark:bg-[#111C35] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[12.5px] border border-blue-100/70 dark:border-slate-800 mt-4">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Runner-up:{' '}
              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                {activeWinner.runnerUp}
              </strong>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {activeWinner.runnerUpVotes}
            </span>
          </div>
        </div>

        {/* ================= CARD 3: ASSEMBLY ELECTION HISTORY ================= */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <Landmark className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
              <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                Assembly Election History
              </h3>
            </div>

            {/* Historical Ledger Table (Dynamically rendered, zero scrollbar) */}
            <div className="w-full overflow-hidden">
              <table className="w-full table-fixed text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold text-slate-400 dark:text-slate-500">
                    <th className="pb-3 pr-1 font-semibold w-[8%]">Year</th>
                    <th className="pb-3 px-1 font-semibold w-[27%]">Winner (Party)</th>
                    <th className="pb-3 px-1 text-right font-semibold w-[10%]">Votes</th>
                    <th className="pb-3 px-1 text-right font-semibold w-[10%]">Vote Share</th>
                    <th className="pb-3 px-1 font-semibold w-[23%]">Runner-up (Party)</th>
                    <th className="pb-3 px-1 text-right font-semibold w-[11%]">Votes</th>
                    <th className="pb-3 pl-1 text-right font-semibold w-[11%]">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {assemblyHistory.map((row) => (
                    <tr
                      key={row.year}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Year */}
                      <td className="py-3 pr-1 font-serif font-bold text-slate-900 dark:text-slate-100 text-[12.5px] truncate">
                        {row.year}
                      </td>

                      {/* Winner (Party) */}
                      <td className="py-3 px-1 font-medium text-slate-900 dark:text-slate-100 truncate">
                        <span className="text-[10.5px] font-semibold">{row.winner}</span>
                        <span
                          className={`ml-1 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold inline-block ${
                            row.winnerParty === 'BJP'
                              ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300'
                              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          }`}
                        >
                          {row.winnerParty}
                        </span>
                      </td>

                      {/* Winner Votes */}
                      <td className="py-3 px-1 text-right font-medium text-slate-600 dark:text-slate-300 tabular-nums text-[10.5px] truncate">
                        {row.winnerVotes}
                      </td>

                      {/* Vote Share */}
                      <td className="py-3 px-1 text-right font-extrabold text-slate-900 dark:text-slate-100 tabular-nums text-[10.5px] truncate">
                        {row.winnerPct}
                      </td>

                      {/* Runner-up (Party) */}
                      <td className="py-3 px-1 font-medium text-slate-600 dark:text-slate-400 text-[10.5px] truncate">
                        {row.runnerUp}
                      </td>

                      {/* Runner-up Votes */}
                      <td className="py-3 px-1 text-right font-medium text-slate-600 dark:text-slate-300 tabular-nums text-[10.5px] truncate">
                        {row.runnerUpVotes}
                      </td>

                      {/* Margin */}
                      <td className="py-3 pl-1 text-right tabular-nums truncate">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 leading-tight text-[10.5px]">
                          {row.marginVotes}
                        </div>
                        <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {row.marginPct}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= CARD 4: PARLIAMENTARY VOTE SHARE TREND ================= */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5">
              <Building2 className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
              <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                Parliamentary (North Goa) — Vote Share Trend
              </h3>
            </div>

            {/* SVG Trend Chart */}
            <div className="w-full h-[225px]">
              <svg viewBox={`0 0 ${c4Width} ${c4Height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="parliamentAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Labels (Calculated mathematically) */}
                {c4YTicks.map((val) => {
                  const y = getC4Y(val);
                  return (
                    <g key={val}>
                      <line
                        x1={c4Pad.left}
                        y1={y}
                        x2={c4Width - c4Pad.right + 15}
                        y2={y}
                        stroke="currentColor"
                        className="text-slate-100 dark:text-slate-800/80"
                        strokeWidth="1"
                      />
                      <text
                        x={c4Pad.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-slate-400 dark:fill-slate-500 text-[11px] font-semibold"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Base Axis Line */}
                <line
                  x1={c4Pad.left}
                  y1={c4BaseY}
                  x2={c4Width - c4Pad.right + 15}
                  y2={c4BaseY}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="1.2"
                />

                {/* Area Polygon & Polyline */}
                {c4PolygonStr && (
                  <polygon points={c4PolygonStr} fill="url(#parliamentAreaGrad)" />
                )}
                {c4PolylineStr && (
                  <polyline
                    points={c4PolylineStr}
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="2.2"
                  />
                )}

                {/* Points & Tags (Dynamically computed from data) */}
                {computedC4Points.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="4.5" fill="#EA580C" stroke="#fff" strokeWidth="2" />
                    <text
                      x={pt.x}
                      y={pt.y - 11}
                      textAnchor="middle"
                      className="fill-[#EA580C] text-[12px] font-bold"
                    >
                      {pt.pct.toFixed(2)}%
                    </text>
                    <text
                      x={pt.x}
                      y={c4Height - 12}
                      textAnchor="middle"
                      className="fill-slate-600 dark:fill-slate-400 text-[12px] font-semibold"
                    >
                      {pt.year}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
