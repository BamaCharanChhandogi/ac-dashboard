import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Info, 
  CheckCircle2, 
  Compass,
  Maximize2 
} from 'lucide-react';
import { 
  formatIndianNumber, 
  formatPercentage, 
  formatMargin, 
  getMarginCategory 
} from '../utils/formatters';
import { clubAuxiliaryBooths } from '../utils/normalizer';

export default function SpatialMaps({ data }) {
  if (!data?.spatial) return null;
  const { viewBox = "0 0 1186 920", villages = [], booths: rawBooths = [] } = data.spatial;
  const meta = data.meta || {};

  const [activeCycle, setActiveCycle] = useState('Overall');
  const [mapMode, setMapMode] = useState('booths'); // 'booths' | 'villages'
  const [hoveredItem, setHoveredItem] = useState(null);

  const cycles = ['Overall', '2024 LS', '2022 AE', '2019 LS', '2017 AE', '2012 AE'];

  // Consolidate auxiliary booths (e.g. 22 + 22A -> Booth 22)
  const booths = useMemo(() => clubAuxiliaryBooths(rawBooths), [rawBooths]);

  // Calculate Safe / Battleground / Weak distribution
  const safeBooths = booths.filter(b => (b.margin_pct || 0) >= 10).length;
  const battlegroundBooths = booths.filter(b => (b.margin_pct || 0) > -10 && (b.margin_pct || 0) < 10).length;
  const weakBooths = booths.filter(b => (b.margin_pct || 0) <= -10).length;

  return (
    <section id="spatial-maps" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Spatial Vector Intelligence — Booth Voronoi & Village Lean
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Auto-framing SVG coordinate mesh showing {meta.total_booths} polling booths and {villages.length} constituent administrative areas
          </p>
        </div>

        {/* View Mode & Cycle Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Layer Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setMapMode('booths')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapMode === 'booths'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Booth Voronoi ({booths.length})
            </button>
            <button
              onClick={() => setMapMode('villages')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapMode === 'villages'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Village Lean ({villages.length})
            </button>
          </div>

          {/* Election Cycle Filter */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {cycles.map((cyc) => (
              <button
                key={cyc}
                onClick={() => setActiveCycle(cyc)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activeCycle === cyc
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cyc}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Map Canvas and Summary Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Map Viewport Container (9 cols) */}
        <div className="lg:col-span-9 bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-inner relative overflow-hidden flex flex-col justify-between">
          
          {/* Top Bar inside Map */}
          <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono uppercase font-bold tracking-wider text-slate-200">
                {meta.ac_name} {mapMode === 'booths' ? 'Polling Station Grid' : 'Village Boundaries'} ({activeCycle})
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Auto-Framed ViewBox: {viewBox}
            </div>
          </div>

          {/* Dynamic SVG Container */}
          <div className="relative w-full aspect-[4/3] max-h-[560px] flex items-center justify-center">
            <svg 
              viewBox={viewBox} 
              className="w-full h-full filter drop-shadow-md select-none transition-all duration-300"
            >
              {/* Outer boundary ambient glow */}
              <rect x="0" y="0" width="100%" height="100%" fill="transparent" />

              {/* Village Region Blobs / Polygons */}
              {villages.map((vil, vIdx) => {
                const category = getMarginCategory(vil.margin_pct);
                const isHovered = hoveredItem?.type === 'village' && hoveredItem.name === vil.name;
                const isVillageMode = mapMode === 'villages';

                return (
                  <g key={vIdx}>
                    <circle
                      cx={vil.cx}
                      cy={vil.cy}
                      r={vil.r}
                      fill={isVillageMode ? category.color : '#1E293B'}
                      fillOpacity={isVillageMode ? (isHovered ? 0.9 : 0.75) : 0.35}
                      stroke={isHovered ? '#FFFFFF' : '#475569'}
                      strokeWidth={isHovered ? 3 : 1.5}
                      strokeDasharray={isVillageMode ? 'none' : '4 4'}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredItem({ type: 'village', ...vil, category })}
                      onMouseLeave={() => setHoveredItem(null)}
                    />
                    {/* Village Name Label */}
                    <text
                      x={vil.cx}
                      y={vil.cy - (isVillageMode ? 8 : 0)}
                      textAnchor="middle"
                      className="text-[14px] font-extrabold fill-white drop-shadow-md pointer-events-none select-none tracking-wide"
                    >
                      {vil.name}
                    </text>
                    {isVillageMode && (
                      <text
                        x={vil.cx}
                        y={vil.cy + 14}
                        textAnchor="middle"
                        className="text-[13px] font-black fill-amber-300 font-mono drop-shadow-md pointer-events-none"
                      >
                        {formatMargin(vil.margin_pct)}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Polling Booth Nodes / Voronoi Points */}
              {mapMode === 'booths' && booths.map((booth, bIdx) => {
                const category = getMarginCategory(booth.margin_pct);
                const isHovered = hoveredItem?.type === 'booth' && hoveredItem.part_no === booth.part_no;

                return (
                  <g key={bIdx} className="cursor-pointer">
                    {/* Outer Glow Halo */}
                    <circle
                      cx={booth.x}
                      cy={booth.y}
                      r={isHovered ? 20 : (booth.is_clubbed ? 15 : 12)}
                      fill={category.color}
                      fillOpacity={isHovered ? 0.9 : 0.8}
                      stroke={booth.is_clubbed ? '#F59E0B' : '#FFFFFF'}
                      strokeWidth={isHovered ? 3 : (booth.is_clubbed ? 2.5 : 1.5)}
                      className="transition-all duration-150 hover:scale-125"
                      onMouseEnter={() => setHoveredItem({ type: 'booth', ...booth, category })}
                      onMouseLeave={() => setHoveredItem(null)}
                    />
                    {/* Booth Part Number Label */}
                    <text
                      x={booth.x}
                      y={booth.y + 4}
                      textAnchor="middle"
                      className="text-[10px] font-black fill-white font-mono pointer-events-none drop-shadow-sm select-none"
                    >
                      {booth.part_no}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Floating Tooltip */}
            {hoveredItem && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-slate-900/95 text-white rounded-xl p-3.5 border border-slate-700 shadow-2xl backdrop-blur-md pointer-events-none animate-in fade-in duration-150">
                {hoveredItem.type === 'booth' ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-amber-400">
                        Booth Part {hoveredItem.part_no}
                        {hoveredItem.is_clubbed && ' (Consolidated 22+22A)'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${hoveredItem.category.badgeClass}`}>
                        {hoveredItem.category.label}
                      </span>
                    </div>
                    <div className="font-bold text-white leading-tight">
                      {hoveredItem.station_name}
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      Village: <strong>{hoveredItem.village}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/80 text-[11px] font-mono">
                      <div>Electors: <span className="text-white font-bold">{formatIndianNumber(hoveredItem.voters)}</span></div>
                      <div>Margin: <span className="text-emerald-400 font-bold">{formatMargin(hoveredItem.margin_pct)}</span></div>
                      <div>Added: <span className="text-emerald-400">+{hoveredItem.added}</span></div>
                      <div>Deleted: <span className="text-rose-400">−{hoveredItem.deleted}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-white">
                        {hoveredItem.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${hoveredItem.category.badgeClass}`}>
                        {hoveredItem.category.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Constituent Administrative Village Area
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/80 text-[11px] font-mono">
                      <div>Electors: <span className="text-white font-bold">{formatIndianNumber(hoveredItem.voters)}</span></div>
                      <div>Avg Margin: <span className="text-amber-400 font-bold">{formatMargin(hoveredItem.margin_pct)}</span></div>
                      <div>SIR Added: <span className="text-emerald-400">+{hoveredItem.added}</span></div>
                      <div>SIR Deleted: <span className="text-rose-400">−{hoveredItem.deleted}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auxiliary Booth Callout Note */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Auxiliary Station Policy: <strong>Booth 22 = (22 + 22A)</strong> aggregated 1:1 with map polygon</span>
            <span>Scale: Organic Voronoi Proximity</span>
          </div>
        </div>

        {/* Right Summary Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Classification Legend Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Political Lean Legend</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-900">Safe Majority</div>
                    <div className="text-[10px] text-emerald-700">Margin ≥ +10%</div>
                  </div>
                </div>
                <span className="font-black text-emerald-900 font-mono text-sm">
                  {safeBooths} booths
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <div className="font-bold text-amber-900">Battleground</div>
                    <div className="text-[10px] text-amber-700">-10% to +10%</div>
                  </div>
                </div>
                <span className="font-black text-amber-900 font-mono text-sm">
                  {battlegroundBooths} booths
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600 shrink-0" />
                  <div>
                    <div className="font-bold text-rose-900">Weak / Trailing</div>
                    <div className="text-[10px] text-rose-700">Margin ≤ -10%</div>
                  </div>
                </div>
                <span className="font-black text-rose-900 font-mono text-sm">
                  {weakBooths} booths
                </span>
              </div>
            </div>
          </div>

          {/* Top Village Lean Ranks */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2.5">
              Village Margins (Ranked)
            </h4>

            <div className="space-y-1.5 text-xs max-h-64 overflow-y-auto pr-1">
              {[...villages].sort((a, b) => b.margin_pct - a.margin_pct).map((vil, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-white border border-slate-200/70 hover:border-slate-300"
                >
                  <span className="font-semibold text-slate-800 truncate max-w-[120px]">{vil.name}</span>
                  <span className={`font-mono font-bold tabular-nums ${
                    vil.margin_pct >= 10 ? 'text-emerald-700' : (vil.margin_pct <= -10 ? 'text-rose-700' : 'text-amber-700')
                  }`}>
                    {formatMargin(vil.margin_pct)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
