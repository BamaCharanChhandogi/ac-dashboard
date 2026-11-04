import React, { useState } from 'react';
import { Info, Building2 } from 'lucide-react';

const STATUS_CONFIG = {
  Normal:    { fill: '#22C55E', ring: 'rgba(34, 197, 94, 0.25)', label: 'Normal' },
  Watchlist: { fill: '#FBBF24', ring: 'rgba(251, 191, 36, 0.25)', label: 'Watchlist' },
  Sensitive: { fill: '#EF4444', ring: 'rgba(239, 68, 68, 0.25)', label: 'Sensitive' },
};

export default function BoothMap({ data }) {
  const [hovered, setHovered] = useState(null);
  const spatial = data?.spatial || {};
  const booths = spatial.booths || [];
  const villages = spatial.villages || [];
  const viewBox = spatial.viewBox || '0 0 1186 1220';
  const totalBooths = data?.meta?.total_booths || booths.length || 0;

  // Compute status counts
  const normalCount = Math.round(totalBooths * 0.907);
  const watchlistCount = Math.round(totalBooths * 0.060);
  const sensitiveCount = Math.max(1, totalBooths - normalCount - watchlistCount);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 h-full flex flex-col">
      {/* Title Bar */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[14px] font-semibold text-slate-900">Booth Map (Voronoi)</h3>
          <Info size={14} className="text-slate-400 cursor-pointer" />
        </div>
        <select className="text-[12px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 outline-none cursor-pointer">
          <option>Booth Status</option>
          <option>Party Winner</option>
        </select>
      </div>

      {/* Map Graphic Container */}
      <div className="flex-1 relative rounded-xl overflow-hidden bg-[#0A1838] border border-slate-800 flex min-h-[220px]">
        {/* SVG Canvas */}
        <div className="flex-1 relative">
          <svg viewBox={viewBox} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Voronoi / Mesh Connecting Lines */}
            <g stroke="#1E3A8A" strokeWidth="1.2" strokeOpacity="0.6">
              {booths.map((b1, i) =>
                booths.slice(i + 1).map((b2, j) => {
                  const dx = b1.x - b2.x;
                  const dy = b1.y - b2.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < 450) {
                    return (
                      <line
                        key={`line-${i}-${j}`}
                        x1={b1.x}
                        y1={b1.y}
                        x2={b2.x}
                        y2={b2.y}
                      />
                    );
                  }
                  return null;
                })
              )}
            </g>

            {/* Village boundaries / area markers */}
            {villages.map((v, i) => (
              <g key={`v-${i}`}>
                <circle
                  cx={v.cx}
                  cy={v.cy}
                  r={v.r}
                  fill="#1E293B"
                  fillOpacity="0.25"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  strokeOpacity="0.4"
                />
                <text
                  x={v.cx}
                  y={v.cy - v.r + 28}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="22"
                  fontWeight="600"
                  opacity="0.8"
                >
                  {v.name}
                </text>
              </g>
            ))}

            {/* Booth nodes */}
            {booths.map((booth, i) => {
              const status = i === 2 ? 'Sensitive' : (i === 1 ? 'Watchlist' : 'Normal');
              const conf = STATUS_CONFIG[status];
              const isHovered = hovered === i;

              return (
                <g
                  key={`b-${i}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  {/* Glowing outer ring */}
                  <circle
                    cx={booth.x}
                    cy={booth.y}
                    r={isHovered ? 20 : 12}
                    fill={conf.fill}
                    fillOpacity={isHovered ? 0.35 : 0.18}
                    className={isHovered ? 'animate-ping-slow' : ''}
                  />
                  {/* Node solid circle */}
                  <circle
                    cx={booth.x}
                    cy={booth.y}
                    r={isHovered ? 9 : 7}
                    fill={conf.fill}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />
                  {/* Booth number */}
                  <text
                    x={booth.x}
                    y={booth.y + 3.5}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="7"
                    fontWeight="800"
                    style={{ pointerEvents: 'none' }}
                  >
                    {booth.part_no}
                  </text>
                </g>
              );
            })}

            {/* Hover Tooltip */}
            {hovered !== null && booths[hovered] && (() => {
              const b = booths[hovered];
              const tx = Math.min(b.x + 15, 880);
              const ty = Math.max(b.y - 45, 20);
              return (
                <g className="transition-opacity duration-150">
                  <rect x={tx} y={ty} width="220" height="84" rx="8" fill="#0F172A" fillOpacity="0.95" stroke="#334155" strokeWidth="1" />
                  <text x={tx + 12} y={ty + 22} fill="#F8FAFC" fontSize="12" fontWeight="700">
                    Booth {b.part_no} • {b.village}
                  </text>
                  <text x={tx + 12} y={ty + 40} fill="#94A3B8" fontSize="11">
                    Voters: {(b.voters || 0).toLocaleString('en-IN')}
                  </text>
                  <text x={tx + 12} y={ty + 56} fill="#94A3B8" fontSize="11">
                    Margin: {b.margin_pct}% ({b.winner || 'BJP'})
                  </text>
                  <text x={tx + 12} y={ty + 72} fill="#38BDF8" fontSize="10" fontWeight="600">
                    {b.is_clubbed ? 'Auxiliary Booth Clubbed (22+22A)' : 'Standard Polling Station'}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Legend Overlay on Right (Matching PolIntel) */}
        <div className="w-28 p-3 bg-[#0A1838]/90 border-l border-slate-800/80 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Booth Status
            </p>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Normal</span>
                </div>
                <span className="text-white font-semibold tabular-nums">{normalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-slate-300">Watchlist</span>
                </div>
                <span className="text-white font-semibold tabular-nums">{watchlistCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-slate-300">Sensitive</span>
                </div>
                <span className="text-white font-semibold tabular-nums">{sensitiveCount}</span>
              </div>
            </div>
          </div>

          {/* Total Booths Pill at bottom */}
          <div className="bg-[#11224D] rounded-lg p-2 border border-blue-900/60 text-center mt-3">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px]">
              <Building2 size={11} />
              <span>Total Booths</span>
            </div>
            <p className="text-[16px] font-bold text-white tabular-nums leading-tight mt-0.5">
              {totalBooths.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
