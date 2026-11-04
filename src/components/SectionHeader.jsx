import React from 'react';
import { ChevronDown } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

const AVAILABLE_ACS = [
  { slug: 'ac17-sanquelim', name: 'AC17 — Sanquelim', state: 'Goa', district: 'North Goa', taluka: 'Bicholim' },
  { slug: 'ac09-porvorim',  name: 'AC09 — Porvorim',  state: 'Goa', district: 'North Goa', taluka: 'Bardez' },
  { slug: 'ac10-aldona',    name: 'AC10 — Aldona',    state: 'Goa', district: 'North Goa', taluka: 'Bardez' },
];

export default function SectionHeader({
  data,
  currentSlug = 'ac17-sanquelim',
  onSelectAC,
}) {
  const meta = data?.meta || {};
  const totalVoters = meta.total_voters || 27265;
  const villages = meta.constituent_areas || [];

  return (
    <div className="bg-white border-b border-slate-200/80 px-8 pt-7 pb-6">
      {/* Administrative Subtitle */}
      <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase mb-1.5">
        {meta.state ? `${meta.state.toUpperCase()} · ` : ''}
        {meta.district ? `${meta.district.toUpperCase()} DISTRICT · ` : ''}
        {meta.taluka ? `${meta.taluka.toUpperCase()} TALUKA` : ''}
      </p>

      {/* Main Title Row with AC Switcher */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
        <div className="relative inline-flex items-center gap-2">
          <select
            value={currentSlug}
            onChange={(e) => onSelectAC?.(e.target.value)}
            className="font-serif text-[32px] md:text-[36px] font-bold text-slate-900 tracking-tight cursor-pointer outline-none bg-transparent appearance-none pr-8 hover:text-teal-800 transition-colors"
          >
            {AVAILABLE_ACS.map(ac => (
              <option key={ac.slug} value={ac.slug} className="font-sans text-[15px] font-normal text-slate-800">
                {ac.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={22}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {/* Hero Electors Count */}
        <div className="text-left md:text-right">
          <p className="text-[34px] md:text-[38px] font-bold text-teal-800 tabular-nums leading-none tracking-tight">
            {formatIndianNumber(totalVoters)}
          </p>
          <p className="text-[12px] font-medium text-slate-500 mt-1">
            Current active electors
          </p>
        </div>
      </div>

      {/* 4-Column Metadata Table (Matching PDF Page 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-slate-100 text-[12px]">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Parliamentary Constituency
          </p>
          <p className="font-semibold text-slate-900">
            {meta.pc_no ? `${meta.pc_no} - ` : ''}{meta.pc_name ? meta.pc_name.toUpperCase() : 'NORTH GOA'}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            District
          </p>
          <p className="font-semibold text-slate-900">
            {meta.district || 'North Goa'}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Taluka
          </p>
          <p className="font-semibold text-slate-900">
            {meta.taluka || 'Bicholim'}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Reservation
          </p>
          <p className="font-semibold text-slate-900">
            {meta.reservation || 'Un-Reserved'}
          </p>
        </div>
      </div>

      {/* Villages List (Matching PDF Page 1) */}
      {villages.length > 0 && (
        <div className="pt-3 border-t border-slate-100 text-[12px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Villages / Constituent Areas
          </p>
          <p className="text-slate-700 font-medium leading-relaxed">
            {villages.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
