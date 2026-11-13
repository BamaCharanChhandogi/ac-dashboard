import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, MapPin, Building2, User } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function ConstituencySwitcher({
  currentSlug,
  directory,
  onSelectAC,
  isCollapsed = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Flatten constituencies from directory
  const allConstituencies = useMemo(() => {
    if (!directory) return [];
    const list = [];
    const stateName = directory.state || 'Goa';
    (directory.parliamentary_constituencies || []).forEach((pc) => {
      (pc.assembly_constituencies || []).forEach((ac) => {
        list.push({
          ...ac,
          state: stateName,
          pc_name: pc.pc_name,
          pc_no: pc.pc_no,
        });
      });
    });
    return list;
  }, [directory]);

  // Current active AC
  const activeAC = useMemo(() => {
    return (
      allConstituencies.find((ac) => ac.slug === currentSlug) ||
      allConstituencies[0] || {
        ac_no: 17,
        ac_name: 'Sanquelim',
        slug: 'ac17-sanquelim',
        district: 'North Goa',
        state: 'Goa',
        total_voters: 27265,
        total_booths: 50,
        sitting_mla: 'Dr. Pramod Sawant (BJP)',
      }
    );
  }, [allConstituencies, currentSlug]);

  // Unique states
  const uniqueStates = useMemo(() => {
    return ['All', ...new Set(allConstituencies.map((ac) => ac.state).filter(Boolean))];
  }, [allConstituencies]);

  // Filtered constituencies
  const filteredList = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return allConstituencies.filter((ac) => {
      const matchesSearch =
        !q ||
        ac.ac_name.toLowerCase().includes(q) ||
        String(ac.ac_no).includes(q) ||
        (ac.district && ac.district.toLowerCase().includes(q)) ||
        (ac.taluka && ac.taluka.toLowerCase().includes(q)) ||
        (ac.state && ac.state.toLowerCase().includes(q)) ||
        (ac.sitting_mla && ac.sitting_mla.toLowerCase().includes(q));

      const matchesState = selectedState === 'All' || ac.state === selectedState;
      return matchesSearch && matchesState;
    });
  }, [allConstituencies, searchTerm, selectedState]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (slug) => {
    onSelectAC?.(slug);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${isCollapsed ? 'px-2 py-2 flex justify-center' : 'px-3 py-2'}`} ref={dropdownRef}>
      {/* Switcher Button Trigger */}
      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`AC ${activeAC.ac_no} ${activeAC.ac_name}`}
          className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100/70 transition-colors shadow-xs"
        >
          <span className="text-[8px] font-black uppercase text-blue-600 dark:text-blue-400 leading-none">AC</span>
          <span className="text-[12px] font-extrabold text-slate-900 dark:text-slate-100 leading-none mt-0.5">{activeAC.ac_no}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={`
            w-full text-left p-3 rounded-2xl border transition-colors duration-150 cursor-pointer group relative overflow-hidden
            ${
              isOpen
                ? 'bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-slate-900 dark:to-slate-900/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-gradient-to-b from-white to-blue-50/40 dark:from-[#0D1527] dark:to-[#111C35] hover:border-blue-300 dark:hover:border-blue-700/80 border-blue-200/70 dark:border-blue-900/40 shadow-xs'
            }
          `}
        >
          {/* Subtle Decorative Wave Arc in bottom-right corner matching design */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-25 dark:opacity-10 text-blue-600 dark:text-blue-400">
            <svg width="68" height="26" viewBox="0 0 68 26" fill="currentColor">
              <path d="M0 26 C 24 20, 48 8, 68 0 L 68 26 Z" />
            </svg>
          </div>

          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                  Active Constituency
                </p>
              </div>
              <p className="text-slate-900 dark:text-slate-100 font-bold text-[14px] leading-snug truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                AC {activeAC.ac_no} • {activeAC.ac_name}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate font-medium mt-0.5">
                {activeAC.district} • {activeAC.state}
              </p>
            </div>

            <div
              className={`w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-100/80 dark:border-blue-900/60 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 bg-blue-600 text-white border-blue-600' : ''
              }`}
            >
              <ChevronDown size={14} />
            </div>
          </div>
        </button>
      )}

      {/* Floating Popover Menu (Scalable for 100+ Constituencies) */}
      {isOpen && (
        <div className={`absolute ${isCollapsed ? 'left-full ml-2 top-0' : 'left-2 top-full mt-1.5'} bg-white dark:bg-[#08132B] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 z-[100] overflow-hidden w-[270px] sm:w-[290px]`}>
          {/* Header & Search */}
          <div className="p-3 bg-slate-50 dark:bg-[#0B152E] border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Switch Constituency ({allConstituencies.length} Available)
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search AC name, no, district..."
                className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* State filter pills if multiple states exist */}
            {uniqueStates.length > 2 && (
              <div className="flex gap-1 mt-2 overflow-x-auto pb-0.5">
                {uniqueStates.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedState(st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                      selectedState === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Constituencies List */}
          <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 py-1 bg-white dark:bg-[#08132B]">
            {filteredList.length === 0 ? (
              <div className="p-4 text-center text-slate-400 dark:text-slate-500 text-[12px]">
                No constituency found for "{searchTerm}"
              </div>
            ) : (
              filteredList.map((ac) => {
                const isSelected = ac.slug === currentSlug;
                return (
                  <button
                    key={ac.slug}
                    type="button"
                    onClick={() => handleSelect(ac.slug)}
                    className={`w-full text-left p-3 flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-50 dark:hover:bg-blue-900/60'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold tabular-nums ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          AC {ac.ac_no}
                        </span>
                        <p className="font-serif font-bold text-[13.5px] text-slate-900 dark:text-slate-100 truncate">
                          {ac.ac_name}
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                        {ac.district} • {ac.taluka || ac.state}
                      </p>

                      {ac.sitting_mla && (
                        <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 truncate flex items-center gap-1">
                          <User size={10} className="text-slate-400 dark:text-slate-500" />
                          <span>{ac.sitting_mla}</span>
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0 flex flex-col items-end justify-between h-full">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tabular-nums">
                          {ac.total_voters ? `${formatIndianNumber(ac.total_voters)} voters` : ''}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Popover Footer */}
          <div className="p-2 bg-slate-50 dark:bg-[#0B152E] border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Corporate Chanakya • Multi-Constituency Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
