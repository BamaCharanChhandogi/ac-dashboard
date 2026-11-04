import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  Sparkles,
  Info
} from 'lucide-react';
import { formatPercentage, getPartyTheme } from '../utils/formatters';

export default function TrendsAndSwing({ data }) {
  if (!data?.elections?.trends_and_swing) return null;
  const { years = [], series = [], key_movements = [], takeaways = [] } = data.elections.trends_and_swing;

  const [activePoint, setActivePoint] = useState(null);

  // SVG Line Chart Dimensions
  const svgWidth = 460;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 40 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Scale Functions
  const minVal = 0;
  const maxVal = 100;

  const getX = (index) => {
    if (years.length <= 1) return padding.left;
    return padding.left + (index / (years.length - 1)) * chartWidth;
  };

  const getY = (val) => {
    const cleaned = typeof val === 'string' ? parseFloat(val) : Number(val);
    const safeVal = Number.isFinite(cleaned) ? Math.max(minVal, Math.min(maxVal, cleaned)) : 0;
    return padding.top + chartHeight - (safeVal / maxVal) * chartHeight;
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Multi-Cycle Trends, Swing & Takeaways
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Longitudinal vote share trajectories (2008–2024), delta point swings, and strategic constituency dynamics
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
          <span>Longitudinal Intelligence</span>
        </div>
      </div>

      {/* 3-Column Composite Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Column 1: Multi-Party SVG Line Chart (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Vote Share Trajectory (2008–2024)
              </span>
              <span className="text-[11px] text-slate-600 font-mono">0% to 100%</span>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative w-full overflow-hidden">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                {/* Horizontal Gridlines */}
                {[0, 25, 50, 75, 100].map((level) => {
                  const y = getY(level);
                  return (
                    <g key={level}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={svgWidth - padding.right}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] fill-slate-400 font-mono"
                      >
                        {level}%
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Years */}
                {years.map((year, idx) => {
                  const x = getX(idx);
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-600 font-bold font-mono"
                    >
                      {year}
                    </text>
                  );
                })}

                {/* Multi-Party Paths */}
                {series.map((s, sIdx) => {
                  const points = s.data.map((val, idx) => `${getX(idx)},${getY(val)}`).join(' ');
                  return (
                    <g key={sIdx}>
                      <polyline
                        fill="none"
                        stroke={s.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                        className="transition-all duration-300"
                      />

                      {/* Interactive Circles */}
                      {s.data.map((val, pIdx) => {
                        const cx = getX(pIdx);
                        const cy = getY(val);
                        const isHovered = activePoint?.series === sIdx && activePoint?.point === pIdx;

                        return (
                          <circle
                            key={pIdx}
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 6 : 4}
                            fill="#FFFFFF"
                            stroke={s.color}
                            strokeWidth="2.5"
                            className="cursor-pointer transition-all duration-150 hover:scale-125"
                            onMouseEnter={() => setActivePoint({ series: sIdx, point: pIdx, val, year: years[pIdx], party: s.party })}
                            onMouseLeave={() => setActivePoint(null)}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              {/* Point Tooltip */}
              {activePoint && (
                <div className="absolute top-2 right-2 bg-navy-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-700 pointer-events-none animate-in fade-in duration-150">
                  <span className="font-bold">{activePoint.party}</span> ({activePoint.year}):{' '}
                  <span className="font-mono text-amber-400 font-extrabold">{formatPercentage(activePoint.val)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Party Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-200 text-xs font-semibold">
            {series.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-700">{s.party}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Key Movements Cards (3.5 cols) */}
        <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Key Historical Vote Swings
          </div>

          <div className="space-y-2.5">
            {key_movements.map((move, idx) => {
              const theme = getPartyTheme(move.party);
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-navy-900 text-xs truncate max-w-[170px]">
                      {move.title}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-black tabular-nums border ${
                        move.is_positive
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {move.is_positive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 text-emerald-700" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 text-rose-700" />
                      )}
                      {move.delta}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-snug">
                    {move.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Strategic Takeaways (3.5 cols) */}
        <div className="lg:col-span-3 bg-blue-50/50 rounded-xl p-4 border border-blue-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Core Electoral Insights</span>
            </div>

            <div className="space-y-3">
              {takeaways.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-200/60 text-[11px] text-blue-800 font-semibold flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Form 20 Historical Audit</span>
          </div>
        </div>

      </div>

    </section>
  );
}
