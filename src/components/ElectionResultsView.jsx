import React, { useMemo } from 'react';
import { Landmark, Vote, Building2 } from 'lucide-react';
import PageHeader from './PageHeader';
import { formatIndianNumber } from '../utils/formatters';

export default function ElectionResultsView({ data }) {
  const meta = data?.meta || {};
  const leaders = data?.leaders || {};
  const elections = data?.elections || {};

  // =========================================================================
  // 1. DYNAMIC MLA & MP DOSSIER DATA (ROW 1)
  // =========================================================================
  const mla = leaders.mla || {};
  const mp = leaders.mp || {};
  const assemblyReturns = elections.candidate_returns?.assembly_2022 || [];
  const parliamentReturns = elections.candidate_returns?.parliament_2024 || [];

  const mlaWinner = useMemo(() => {
    const winnerCandidate = assemblyReturns.find((c) => c.rank === 1 || c.status === 'Winner');
    const runnerUpCandidate = assemblyReturns.find((c) => c.rank === 2 || c.status === 'Runner-Up');
    const votePct = mla.vote_pct || winnerCandidate?.pct || 47.73;
    const votes = mla.votes || winnerCandidate?.votes || 12250;
    const marginVotes = mla.margin_votes !== undefined ? mla.margin_votes : (winnerCandidate?.margin ? parseInt(winnerCandidate.margin) : 666);
    const marginPct = mla.margin_pct !== undefined ? mla.margin_pct : (winnerCandidate && runnerUpCandidate ? (winnerCandidate.pct - runnerUpCandidate.pct).toFixed(2) : '2.60');

    const marginStr = marginVotes > 0 ? `+${formatIndianNumber(marginVotes)}` : formatIndianNumber(marginVotes);

    return {
      title: 'Latest Assembly Result (2022)',
      subtitle: `${meta.ac_name || 'Sanquelim'} • AC ${meta.ac_no || '17'}`,
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
  }, [mla, assemblyReturns, meta.ac_name, meta.ac_no]);

  const mpWinner = useMemo(() => {
    const winnerCandidate = parliamentReturns.find((c) => c.rank === 1 || c.status === 'Winner');
    const runnerUpCandidate = parliamentReturns.find((c) => c.rank === 2 || c.status === 'Runner-Up');
    const votePct = mp.vote_pct || winnerCandidate?.pct || 56.43;
    const votes = mp.votes || winnerCandidate?.votes || 257326;
    const marginVotes = mp.margin_votes !== undefined ? mp.margin_votes : (winnerCandidate?.margin ? parseInt(winnerCandidate.margin) : 116015);
    const marginPct = mp.margin_pct !== undefined ? mp.margin_pct : 25.44;

    const marginStr = marginVotes > 0 ? `+${formatIndianNumber(marginVotes)}` : formatIndianNumber(marginVotes);

    return {
      title: 'Latest Parliamentary Result (2024)',
      subtitle: `${meta.pc_name || 'North Goa'} • PC 1`,
      name: mp.name || winnerCandidate?.name || 'Shripad Yesso Naik',
      party: mp.party || winnerCandidate?.party || 'BJP',
      photo: mp.photo_url || '/images/leaders/shripad-naik.jpg',
      voteShare: `${Number(votePct).toFixed(2)}%`,
      votes: `${formatIndianNumber(votes)} votes`,
      margin: marginStr,
      marginPct: `(+${Number(marginPct).toFixed(2)}%)`,
      runnerUp: runnerUpCandidate ? `${runnerUpCandidate.name} (${runnerUpCandidate.party})` : mp.runner_up || 'Ramakant Khalap (INC)',
      runnerUpVotes: runnerUpCandidate ? `${formatIndianNumber(runnerUpCandidate.votes)} votes (${runnerUpCandidate.pct.toFixed(2)}%)` : '1,41,311 votes (30.99%)',
    };
  }, [mp, parliamentReturns, meta.pc_name]);

  // =========================================================================
  // 2. DYNAMIC ASSEMBLY TREND GRAPH (ROW 2 - LEFT)
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

  const c1Width = 540;
  const c1Height = 230;
  const c1Pad = { left: 45, right: 35, top: 25, bottom: 30 };
  const c1PlotW = c1Width - c1Pad.left - c1Pad.right;
  const c1PlotH = c1Height - c1Pad.top - c1Pad.bottom;
  const c1BaseY = c1Height - c1Pad.bottom;

  const c1Years = journeyData.years || [];
  const c1Series = journeyData.series || [];
  const c1YMin = 0;
  const c1YMax = 80;
  const c1YTicks = [80, 60, 40, 20, 0];

  const getC1X = (index) => c1Pad.left + (index / Math.max(1, c1Years.length - 1)) * c1PlotW;
  const getC1Y = (val) => c1Pad.top + (1 - (val - c1YMin) / (c1YMax - c1YMin)) * c1PlotH;

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
  // 3. DYNAMIC PARLIAMENTARY TREND GRAPH (ROW 2 - RIGHT)
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

  const c4Width = 540;
  const c4Height = 230;
  const c4Pad = { left: 45, right: 35, top: 35, bottom: 30 };
  const c4PlotW = c4Width - c4Pad.left - c4Pad.right;
  const c4PlotH = c4Height - c4Pad.top - c4Pad.bottom;
  const c4BaseY = c4Height - c4Pad.bottom;

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

  // =========================================================================
  // 4. DYNAMIC ASSEMBLY ELECTION HISTORY TABLE (ROW 3 - FULL WIDTH)
  // =========================================================================
  const assemblyHistory = useMemo(() => {
    if (elections.assembly_history && elections.assembly_history.length > 0) {
      return elections.assembly_history;
    }
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

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* Editorial Page Header */}
      <PageHeader
        title="Election Results & Historical Returns"
        subtitle={`Assembly Form-20 returns, Parliamentary margins, longitudinal vote-share trends, and historical returns across ${meta.ac_name || 'Sanquelim'}`}
      />

      {/* ========================================================================= */}
      {/* ROW 1: SITTING MLA & SITTING MP (SIDE BY SIDE 2-COLUMN)                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT: SITTING MLA CARD */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <Vote className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {mlaWinner.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                    {mlaWinner.subtitle}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                Vidhan Sabha
              </span>
            </div>

            {/* Winner Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 py-4">
              {/* Winner Profile */}
              <div className="sm:col-span-6 flex items-center gap-3 min-w-0">
                <img
                  src={mlaWinner.photo}
                  alt={mlaWinner.name}
                  className="w-16 h-16 sm:w-17 sm:h-17 rounded-full object-cover border-2 border-orange-400/90 shadow-xs flex-shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase">
                    WINNER
                  </span>
                  <h4 className="font-serif text-[17px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-tight whitespace-nowrap">
                    {mlaWinner.name}
                  </h4>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                    {mlaWinner.party}
                  </span>
                </div>
              </div>

              {/* Vote Share */}
              <div className="sm:col-span-3 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-3 text-left">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Vote Share
                </p>
                <p className="font-serif text-[24px] sm:text-[26px] font-bold text-slate-900 dark:text-slate-100 leading-none my-1">
                  {mlaWinner.voteShare}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  {mlaWinner.votes}
                </p>
              </div>

              {/* Victory Margin */}
              <div className="sm:col-span-3 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-3 text-left">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Victory Margin
                </p>
                <p className="font-serif text-[24px] sm:text-[26px] font-bold text-emerald-600 dark:text-emerald-400 leading-none my-1">
                  {mlaWinner.margin}
                </p>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {mlaWinner.marginPct}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Tinted Pill Strip */}
          <div className="bg-[#EFF6FF]/70 dark:bg-[#111C35] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[12.5px] border border-blue-100/70 dark:border-slate-800 mt-4">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Runner-up:{' '}
              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                {mlaWinner.runnerUp}
              </strong>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {mlaWinner.runnerUpVotes}
            </span>
          </div>
        </div>

        {/* RIGHT: SITTING MP CARD */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {mpWinner.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                    {mpWinner.subtitle}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60">
                Lok Sabha
              </span>
            </div>

            {/* Winner Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 py-4">
              {/* Winner Profile */}
              <div className="sm:col-span-6 flex items-center gap-3 min-w-0">
                <img
                  src={mpWinner.photo}
                  alt={mpWinner.name}
                  className="w-16 h-16 sm:w-17 sm:h-17 rounded-full object-cover border-2 border-orange-400/90 shadow-xs flex-shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase">
                    WINNER
                  </span>
                  <h4 className="font-serif text-[17px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-tight whitespace-nowrap">
                    {mpWinner.name}
                  </h4>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                    {mpWinner.party}
                  </span>
                </div>
              </div>

              {/* Vote Share */}
              <div className="sm:col-span-3 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-3 text-left">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Vote Share
                </p>
                <p className="font-serif text-[24px] sm:text-[26px] font-bold text-slate-900 dark:text-slate-100 leading-none my-1">
                  {mpWinner.voteShare}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  {mpWinner.votes}
                </p>
              </div>

              {/* Victory Margin */}
              <div className="sm:col-span-3 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-3 text-left">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Victory Margin
                </p>
                <p className="font-serif text-[24px] sm:text-[26px] font-bold text-emerald-600 dark:text-emerald-400 leading-none my-1">
                  {mpWinner.margin}
                </p>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  {mpWinner.marginPct}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Tinted Pill Strip */}
          <div className="bg-[#EEF2FF]/70 dark:bg-[#111C35] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[12.5px] border border-indigo-100/70 dark:border-slate-800 mt-4">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Runner-up:{' '}
              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                {mpWinner.runnerUp}
              </strong>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {mpWinner.runnerUpVotes}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: ASSEMBLY & PARLIAMENTARY TREND GRAPHS (SIDE BY SIDE 2-COLUMN)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* CARD 1: ELECTORAL JOURNEY — ASSEMBLY */}
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

                {/* Dash for first year if BJP did not contest */}
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

        {/* CARD 2: PARLIAMENTARY VOTE SHARE TREND */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5">
              <Building2 className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
              <div>
                <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  Parliamentary (North Goa) — Vote Share Trend
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Longitudinal Lok Sabha returns across 6 general election cycles (1999–2024)
                </p>
              </div>
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

                {/* Horizontal Gridlines & Y-Axis Labels */}
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

                {/* Points & Tags */}
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

      {/* ========================================================================= */}
      {/* ROW 3: ASSEMBLY ELECTION HISTORY TABLE (FULL 100% WIDTH)                  */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Landmark className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
            <div>
              <h3 className="font-serif text-[20px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                Assembly Election History
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                Official ECI Form-20 returns, winning candidate vote shares, and victory margins across {meta.ac_name || 'Sanquelim'}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
            Form-20 Historical Ledger
          </span>
        </div>

        {/* Spacious Full-Width Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="pb-3.5 pr-4 font-bold">Year</th>
                <th className="pb-3.5 px-4 font-bold">Winner (Party)</th>
                <th className="pb-3.5 px-4 text-right font-bold">Votes</th>
                <th className="pb-3.5 px-4 text-right font-bold">Vote Share</th>
                <th className="pb-3.5 px-4 font-bold">Runner-up (Party)</th>
                <th className="pb-3.5 px-4 text-right font-bold">Votes</th>
                <th className="pb-3 pl-4 text-right font-bold">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {assemblyHistory.map((row) => (
                <tr
                  key={row.year}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Year */}
                  <td className="py-4 pr-4 font-serif font-bold text-slate-900 dark:text-slate-100 text-[14px]">
                    {row.year}
                  </td>

                  {/* Winner (Party) */}
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    <span className="font-bold text-[13px]">{row.winner}</span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded text-[10px] font-extrabold inline-block ${
                        row.winnerParty === 'BJP'
                          ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                      }`}
                    >
                      {row.winnerParty}
                    </span>
                  </td>

                  {/* Winner Votes */}
                  <td className="py-4 px-4 text-right font-medium text-slate-600 dark:text-slate-300 tabular-nums text-[13px]">
                    {row.winnerVotes}
                  </td>

                  {/* Vote Share */}
                  <td className="py-4 px-4 text-right font-extrabold text-slate-900 dark:text-slate-100 tabular-nums text-[13px]">
                    {row.winnerPct}
                  </td>

                  {/* Runner-up (Party) */}
                  <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap text-[13px]">
                    {row.runnerUp}
                  </td>

                  {/* Runner-up Votes */}
                  <td className="py-4 px-4 text-right font-medium text-slate-600 dark:text-slate-300 tabular-nums text-[13px]">
                    {row.runnerUpVotes}
                  </td>

                  {/* Margin */}
                  <td className="py-4 pl-4 text-right tabular-nums whitespace-nowrap">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 leading-tight text-[13px]">
                      {row.marginVotes}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
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
  );
}
