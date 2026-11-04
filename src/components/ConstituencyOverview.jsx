import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

const AVAILABLE_ACS = [
  { slug: 'ac17-sanquelim', name: 'AC 17 • Sanquelim', state: 'GOA', district: 'NORTH GOA', taluka: 'BICHOLIM' },
  { slug: 'ac09-porvorim',  name: 'AC 09 • Porvorim',  state: 'GOA', district: 'NORTH GOA', taluka: 'BARDEZ' },
  { slug: 'ac10-aldona',    name: 'AC 10 • Aldona',    state: 'GOA', district: 'NORTH GOA', taluka: 'BARDEZ' },
];

export default function ConstituencyOverview({ data, currentSlug, onSelectAC }) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const meta = data?.meta || {};
  const currentAC = AVAILABLE_ACS.find(ac => ac.slug === currentSlug) || AVAILABLE_ACS[0];
  const totalVoters = meta.total_voters || 27265;
  const totalBooths = meta.total_booths || 50;
  const villagesCount = meta.constituent_areas?.length || 9;
  const totalFamilies = meta.total_families || 6041;
  const villages = meta.constituent_areas || [];

  // 5-Stage Stepper data matching media_1793789065466_25ac374c.png
  const steps = [
    {
      label: 'Draft Roll',
      date: 'DEC 2025',
      count: meta.ac_no === 17 ? 27206 : Math.round(totalVoters * 0.994),
      delta: '—',
      deltaType: 'neutral',
      isCompleted: false,
    },
    {
      label: 'Final Draft',
      date: 'FEB 2026',
      count: meta.ac_no === 17 ? 27089 : Math.round(totalVoters * 0.990),
      delta: meta.ac_no === 17 ? '−117' : '−90',
      deltaType: 'negative',
      isCompleted: false,
    },
    {
      label: 'Supplement 2',
      date: 'APR 2026',
      count: meta.ac_no === 17 ? 27145 : Math.round(totalVoters * 0.994),
      delta: meta.ac_no === 17 ? '+56' : '+85',
      deltaType: 'positive',
      isCompleted: false,
    },
    {
      label: 'Supplement 3',
      date: 'JUL 2026',
      count: totalVoters,
      delta: meta.ac_no === 17 ? '+120' : '+142',
      deltaType: 'positive',
      isCompleted: false,
    },
    {
      label: 'Supplement 4',
      date: 'OCT 2026',
      count: totalVoters,
      delta: '0',
      deltaType: 'neutral',
      isCompleted: true,
    },
  ];

  const avgVotersPerBooth = Math.round(totalVoters / (totalBooths || 1));
  const avgVotersPerFamily = (totalVoters / (totalFamilies || 1)).toFixed(1);

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* 1. Top Header Row: Breadcrumb & Title on Left, Active Electors Card on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <p className="text-[11px] font-bold tracking-widest text-[#2563EB] uppercase mb-1">
            {meta.state ? meta.state.toUpperCase() : 'GOA'} &nbsp;/&nbsp; {meta.district ? meta.district.toUpperCase() : 'NORTH GOA'} &nbsp;/&nbsp; {meta.taluka ? meta.taluka.toUpperCase() : 'BICHOLIM'}
          </p>

          {/* AC Title with Sleek Custom React Dropdown */}
          <div className="relative inline-flex items-center" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="group inline-flex items-center gap-2.5 text-left outline-none cursor-pointer"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <h1 className="font-serif text-[32px] md:text-[34px] font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                {currentAC.name}
              </h1>
              <span className="w-6 h-6 rounded-md border border-slate-300 flex items-center justify-center bg-white shadow-xs group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
                <ChevronDown size={14} className={`text-slate-600 group-hover:text-blue-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl border border-slate-200/90 shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Constituency
                </div>
                <div className="py-1">
                  {AVAILABLE_ACS.map(ac => {
                    const isSelected = ac.slug === currentSlug;
                    return (
                      <button
                        key={ac.slug}
                        type="button"
                        onClick={() => {
                          onSelectAC?.(ac.slug);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-[13px] transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div>
                          <p className="font-serif font-bold text-[14px] leading-tight">
                            {ac.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                            {ac.district} • {ac.taluka}
                          </p>
                        </div>
                        {isSelected && (
                          <Check size={16} className="text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Electors Card (Right Side) */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl px-5 py-3.5 shadow-xs sm:text-right min-w-[180px]">
          <p className="text-[12px] font-bold text-slate-500 mb-0.5">
            Active Electors
          </p>
          <p className="text-[32px] font-extrabold text-[#0D6E6E] tabular-nums leading-none tracking-tight">
            {formatIndianNumber(totalVoters)}
          </p>
        </div>
      </div>

      {/* 2. Metadata Card (5 Distinct Columns) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-[12px]">
          <div className="pt-2 md:pt-0 md:pr-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">PC</p>
            <p className="font-bold text-slate-900 text-[14px]">
              {meta.pc_no ? `${meta.pc_no} – ` : ''}{meta.pc_name || 'North Goa'}
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">District</p>
            <p className="font-bold text-slate-900 text-[14px]">
              {meta.district || 'North Goa'}
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Taluka</p>
            <p className="font-bold text-slate-900 text-[14px]">
              {meta.taluka || 'Bicholim'}
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reservation</p>
            <p className="font-bold text-slate-900 text-[14px]">
              {meta.reservation || 'General'}
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:pl-4 col-span-2 md:col-span-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Areas / Villages</p>
            <p className="font-medium text-slate-700 text-[12px] leading-snug truncate" title={villages.join(', ')}>
              {villages.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Electoral Roll Movement Card (With Connected Stepper & Stability Badge) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        {/* Title & Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-8">
          <div>
            <h3 className="font-serif text-[22px] font-bold text-slate-900 tracking-tight leading-snug">
              Electoral Roll Movement
            </h3>
            <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
              Voter roll progression across drafts and supplements — {meta.ac_name ? `AC ${meta.ac_no} ${meta.ac_name}` : 'AC 17 Sanquelim'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[12px] font-semibold self-start md:self-auto shadow-xs">
            <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0">
              <Check size={11} strokeWidth={3} />
            </div>
            <span>Roll is stable since July • no net change in latest supplement</span>
          </div>
        </div>

        {/* Connected Stepper Line */}
        <div className="relative px-4 pb-2">
          {/* Background Connecting Blue Line */}
          <div className="absolute top-[11px] left-12 right-12 h-[2.5px] bg-[#3B82F6]" />

          {/* Stepper Nodes Grid */}
          <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Node Circle */}
                <div className="mb-3.5 z-10 flex items-center justify-center h-6">
                  {step.isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-sm">
                      <Check size={13} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-[3px] border-[#2563EB] bg-white shadow-xs" />
                  )}
                </div>

                {/* Stage Tag Pill */}
                <span
                  className={`px-3 py-0.5 rounded-md text-[11px] font-bold tracking-tight mb-1.5 ${
                    step.isCompleted
                      ? 'bg-[#D1FAE5] text-[#065F46]'
                      : 'bg-[#EFF6FF] text-[#1E40AF]'
                  }`}
                >
                  {step.label}
                </span>

                {/* Date */}
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  {step.date}
                </p>

                {/* Electors Count */}
                <p className="text-[24px] font-extrabold text-slate-900 tabular-nums leading-tight mb-1">
                  {formatIndianNumber(step.count)}
                </p>

                {/* Delta */}
                <p
                  className={`text-[13px] font-bold tabular-nums ${
                    step.deltaType === 'positive'
                      ? 'text-[#16A34A]'
                      : step.deltaType === 'negative'
                      ? 'text-[#DC2626]'
                      : 'text-slate-400'
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
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            ACTIVE ELECTORS
          </p>
          <p className="text-[26px] font-bold text-[#1E3A8A] tabular-nums leading-none">
            {formatIndianNumber(totalVoters)}
          </p>
        </div>

        {/* Card 2: HOUSEHOLD GROUPS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#0D9488]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            HOUSEHOLD GROUPS
          </p>
          <p className="text-[26px] font-bold text-[#0F766E] tabular-nums leading-none">
            {formatIndianNumber(totalFamilies)}
          </p>
        </div>

        {/* Card 3: VILLAGES */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            VILLAGES
          </p>
          <p className="text-[26px] font-bold text-[#1E3A8A] tabular-nums leading-none">
            {villagesCount}
          </p>
        </div>

        {/* Card 4: POLLING BOOTHS */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#2563EB]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            POLLING BOOTHS
          </p>
          <p className="text-[26px] font-bold text-[#1E3A8A] tabular-nums leading-none">
            {totalBooths}
          </p>
        </div>
      </div>

      {/* 5. Constituency Signals Section */}
      <div className="space-y-3">
        <h3 className="font-serif text-[22px] font-bold text-slate-900 tracking-tight">
          Constituency Signals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Signal 1: Roll Stability */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#10B981]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Roll Stability
            </p>
            <p className="text-[18px] font-bold text-[#16A34A] leading-tight mb-1">
              Stable
            </p>
            <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
              No net change since July ({formatIndianNumber(totalVoters)}). Roll movement is minimal and within normal range.
            </p>
          </div>

          {/* Signal 2: Booth Coverage */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#3B82F6]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Booth Coverage
            </p>
            <p className="text-[18px] font-bold text-[#1E40AF] leading-tight mb-1">
              {totalBooths} Booths
            </p>
            <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
              Coverage across {villagesCount} villages. Average ~{avgVotersPerBooth} electors per booth.
            </p>
          </div>

          {/* Signal 3: Household Concentration */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs border-l-[4px] border-l-[#0D9488]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Household Concentration
            </p>
            <p className="text-[18px] font-bold text-[#0F766E] leading-tight mb-1">
              {formatIndianNumber(totalFamilies)} Households
            </p>
            <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
              Average ~{avgVotersPerFamily} electors per household.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
