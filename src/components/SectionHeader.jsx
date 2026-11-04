import React from 'react';
import { ChevronDown } from 'lucide-react';

const TABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'booth',        label: 'Booth' },
  { id: 'voter-roll',   label: 'Voter Roll' },
  { id: 'demographics', label: 'Demographics' },
  { id: 'results',      label: 'Results' },
  { id: 'insights',     label: 'Insights' },
];

const AVAILABLE_ACS = [
  { slug: 'ac09-porvorim', name: 'Porvorim (AC 09)', state: 'Goa', district: 'North Goa', pc: 'North Goa PC' },
  { slug: 'ac10-aldona',   name: 'Aldona (AC 10)',   state: 'Goa', district: 'North Goa', pc: 'North Goa PC' },
  { slug: 'ac17-sanquelim',name: 'Sanquelim (AC 17)',state: 'Goa', district: 'North Goa', pc: 'North Goa PC' },
];

export default function SectionHeader({
  data,
  activeTab = 'overview',
  onTabChange,
  currentSlug = 'ac09-porvorim',
  onSelectAC,
}) {
  const meta = data?.meta || {};

  return (
    <div className="px-6 lg:px-8 pt-6 pb-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Constituency Title & Breadcrumb metadata */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              CONSTITUENCY OVERVIEW
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Constituency Switcher Dropdown */}
            <div className="relative inline-block">
              <select
                value={currentSlug}
                onChange={(e) => onSelectAC?.(e.target.value)}
                className="appearance-none bg-transparent pr-7 text-[26px] font-bold text-slate-900 tracking-tight cursor-pointer outline-none hover:text-blue-600 transition-colors"
              >
                {AVAILABLE_ACS.map(ac => (
                  <option key={ac.slug} value={ac.slug} className="text-[15px] font-normal text-slate-800">
                    {ac.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              {meta.state || 'Goa'}
            </span>

            {meta.reservation && meta.reservation !== 'General' && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                {meta.reservation}
              </span>
            )}
          </div>

          <p className="text-[13px] text-slate-500 mt-1">
            {meta.pc_name ? `${meta.pc_name} Parliamentary Constituency` : ''}
            {meta.district ? ` • ${meta.district} District` : ''}
            {meta.taluka ? ` • ${meta.taluka} Taluka` : ''}
          </p>
        </div>

        {/* Right: Tab pills (Matching PolIntel exact layout) */}
        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0">
          {TABS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange?.(id)}
                className={`
                  px-4 py-2 rounded-lg text-[13px] transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
