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
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'constituencies', label: 'Constituencies',   icon: MapPin },
  { id: 'booth',          label: 'Booth Analysis',   icon: BarChart3 },
  { id: 'voter-rolls',    label: 'Voter Rolls',      icon: ScrollText },
  { id: 'demographics',   label: 'Demographics',     icon: Users },
  { id: 'results',        label: 'Election Results', icon: Vote },
  { id: 'reports',        label: 'Reports',          icon: FileText },
  { id: 'insights',       label: 'Insights',         icon: Lightbulb },
];

export default function Sidebar({ activeSection = 'dashboard', onNavigate }) {
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

      {/* Sidebar Container matching media_1793789065466_25ac374c.png */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-gradient-to-b from-[#08132B] via-[#0A1633] to-[#0E1E42]
          border-r border-slate-800/40
          flex flex-col w-[230px]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-200
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center px-5 h-[76px] border-b border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Red CC Badge */}
            <div className="w-9 h-9 rounded-xl bg-[#D32F2F] flex items-center justify-center shadow-md shadow-red-900/30 flex-shrink-0">
              <span className="text-white font-extrabold text-[13px] tracking-tight">CC</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-[13px] leading-tight tracking-wider uppercase">
                CORPORATE
                <br />
                CHANAKYA
              </h1>
              <p className="text-slate-400 text-[8.5px] leading-tight font-semibold tracking-widest uppercase mt-0.5">
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

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`
                  w-full flex items-center gap-3 rounded-xl text-[13px] font-medium
                  transition-all duration-150 px-3.5 py-2.5
                  ${isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300/80 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className={isActive ? 'text-white' : 'text-slate-400'}
                />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Subtle Wave Graphics / Ambient Glow at bottom */}
        <div className="mt-auto p-4 opacity-40 pointer-events-none select-none">
          <svg viewBox="0 0 200 40" className="w-full h-8">
            <path
              d="M0 25 Q 50 10, 100 25 T 200 25 L 200 40 L 0 40 Z"
              fill="#1E40AF"
              fillOpacity="0.4"
            />
            <path
              d="M0 30 Q 60 18, 120 30 T 200 30 L 200 40 L 0 40 Z"
              fill="#3B82F6"
              fillOpacity="0.3"
            />
          </svg>
        </div>
      </aside>
    </>
  );
}
