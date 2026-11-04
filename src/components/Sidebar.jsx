import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  ScrollText,
  Users,
  Vote,
  FileText,
  Lightbulb,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import ConstituencySwitcher from './ConstituencySwitcher';

const ANALYTICAL_NAV_ITEMS = [
  { id: 'dashboard',   label: 'Overview',            icon: LayoutDashboard },
  { id: 'booth',       label: 'Booth Analysis',      icon: BarChart3 },
  { id: 'voter-rolls', label: 'Voter Rolls',         icon: ScrollText },
  { id: 'demographics',label: 'Demographics',        icon: Users },
  { id: 'results',     label: 'Election Results',    icon: Vote },
  { id: 'insights',    label: 'Village Insights',    icon: Lightbulb },
  { id: 'reports',     label: 'Intelligence Dossier',icon: FileText },
];

const DIRECTORY_NAV_ITEMS = [
  { id: 'constituencies', label: 'All Constituencies', icon: Compass },
];

export default function Sidebar({
  activeSection = 'dashboard',
  onNavigate,
  currentSlug,
  directory,
  onSelectAC,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate?.(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#08132B] text-white p-2.5 rounded-lg shadow-lg border border-slate-700/50"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-gradient-to-b from-[#08132B] via-[#0A1633] to-[#0E1E42]
          border-r border-slate-800/40
          flex flex-col w-[240px]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-200
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center px-5 h-[72px] border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Red CC Badge */}
            <div className="w-8 h-8 rounded-xl bg-[#D32F2F] flex items-center justify-center shadow-md shadow-red-900/30 flex-shrink-0">
              <span className="text-white font-extrabold text-[12px] tracking-tight">CC</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-[12.5px] leading-tight tracking-wider uppercase">
                CORPORATE
                <br />
                CHANAKYA
              </h1>
              <p className="text-slate-400 text-[8px] leading-tight font-semibold tracking-widest uppercase mt-0.5">
                ELECTORAL INTELLIGENCE
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Persistent Constituency Switcher (Searchable 100+ Seats) */}
        <div className="border-b border-white/5 flex-shrink-0">
          <ConstituencySwitcher
            currentSlug={currentSlug}
            directory={directory}
            onSelectAC={onSelectAC}
          />
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
          {/* Active Constituency Scope */}
          <div>
            <p className="px-3 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400/70">
              Constituency Scope
            </p>
            <div className="space-y-1">
              {ANALYTICAL_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`
                      w-full flex items-center gap-3 rounded-xl text-[12.5px] font-medium
                      transition-all duration-150 px-3 py-2 cursor-pointer
                      ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 font-semibold'
                          : 'text-slate-300/80 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      className={isActive ? 'text-white' : 'text-slate-400'}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cross-Constituency Directory */}
          <div className="pt-2 border-t border-white/5">
            <p className="px-3 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400/70">
              Nationwide Benchmark
            </p>
            <div className="space-y-1">
              {DIRECTORY_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`
                      w-full flex items-center gap-3 rounded-xl text-[12.5px] font-medium
                      transition-all duration-150 px-3 py-2 cursor-pointer
                      ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 font-semibold'
                          : 'text-slate-300/80 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      className={isActive ? 'text-white' : 'text-slate-400'}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Ambient Footer */}
        <div className="p-3 border-t border-white/5 flex-shrink-0">
          <div className="bg-white/[0.04] rounded-xl p-2.5 border border-white/5 text-center">
            <p className="text-[10px] font-semibold text-slate-300">
              Goa Assembly Revision 2026
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5">
              50 Polling Stations • SIR Synchronized
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
