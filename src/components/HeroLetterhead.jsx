import React from 'react';
import { MapPin, Landmark, Award, Flag, Users2, Compass, Layers } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function HeroLetterhead({ data }) {
  if (!data) return null;
  const { meta, kpis } = data;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#07132e] via-[#0A1838] to-[#1E3A8A] text-white border-b border-slate-800 shadow-lg">
      
      {/* Decorative Grid Backdrop */}
      <div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Metadata & Titles */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Administrative Breadcrumb Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-blue-200/90 uppercase">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                {meta.state}
              </span>
              <span>•</span>
              <span>{meta.district} DISTRICT</span>
              <span>•</span>
              <span>{meta.taluka} TALUKA</span>
            </div>

            {/* Main Title Heading */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span className="text-amber-400 font-mono">AC{String(meta.ac_no).padStart(2, '0')}</span>
                <span>—</span>
                <span>{meta.ac_name}</span>
              </h1>
              <p className="text-sm sm:text-base text-blue-100/80 font-normal">
                Electoral Roll Intelligence, Polling Station Analytics & Historical Voter Churn Dossier
              </p>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-blue-200">PC:</span>
                <span className="font-semibold">{meta.pc_no} - {meta.pc_name}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-blue-200">Reservation:</span>
                <span className="font-semibold">{meta.reservation}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-blue-200">Booths:</span>
                <span className="font-semibold">{meta.total_booths} Polling Stations</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-sky-300" />
                <span className="text-blue-200">Families:</span>
                <span className="font-semibold">{formatIndianNumber(meta.total_families)} Households</span>
              </div>
            </div>

            {/* Constituent Villages / Wards List */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-blue-300/80 uppercase tracking-wider mb-1.5">
                Constituent Areas ({meta.constituent_areas?.length || 0}) — {meta.urban_rural_split?.area_type || 'Wards & Villages'}:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {meta.constituent_areas?.map((village, idx) => (
                  <span 
                    key={idx}
                    className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-950/60 text-blue-200 border border-blue-700/40"
                  >
                    {village}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Hero Electors Metric & State Vector Map */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6 lg:border-l lg:border-white/15 lg:pl-8">
            
            {/* Electors Count Display */}
            <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-inner text-center sm:text-left lg:text-center">
              <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300/90 mb-1 flex items-center justify-center sm:justify-start lg:justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Current Active Electors
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums drop-shadow-sm">
                {formatIndianNumber(meta.total_voters)}
              </div>
              <div className="text-xs text-blue-200/90 mt-1.5 font-medium">
                SIR 2026 Supplement-3 Revision Stage
              </div>
            </div>

            {/* Goa Vector Silhouette with Pulsing Location Pin */}
            <div className="relative w-48 h-32 flex items-center justify-center bg-blue-950/40 rounded-xl border border-white/10 p-2">
              
              {/* Stylized Goa Coastline SVG */}
              <svg viewBox="0 0 100 120" className="w-28 h-28 text-blue-400/30 fill-current filter drop-shadow">
                <path d="M40 10 C 50 15, 60 25, 55 40 C 52 50, 65 65, 60 80 C 55 95, 45 105, 35 115 C 30 110, 25 90, 30 75 C 32 60, 25 45, 28 30 C 30 20, 35 15, 40 10 Z" />
              </svg>

              {/* Pulsing Location Pin at North Goa / Bicholim / Bardez coordinates */}
              <div className="absolute top-10 left-[48%] -translate-x-1/2 flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-amber-400/30 animate-ping-slow" />
                <span className="absolute w-4 h-4 rounded-full bg-amber-400/60 animate-pulse" />
                <div className="relative w-4 h-4 rounded-full bg-amber-400 border-2 border-navy-900 shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy-900" />
                </div>
              </div>

              {/* Contender Party Badges */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  <span>BJP</span>
                  <span className="text-xs">🪷</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/40 text-[10px] font-bold text-sky-300">
                  <span>INC</span>
                  <span className="text-xs">✋</span>
                </div>
              </div>

              <div className="absolute top-2 right-2 text-[10px] font-mono text-blue-300/80 bg-navy-900/80 px-1.5 py-0.5 rounded border border-white/10">
                GOA · PIN
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
