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
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import ConstituencySwitcher from './ConstituencySwitcher';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, setTheme } = useTheme();

  const handleNav = (id) => {
    onNavigate?.(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-[#08132B] text-slate-800 dark:text-white p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50"
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
          bg-white dark:bg-gradient-to-b dark:from-[#08132B] dark:via-[#0A1633] dark:to-[#0E1E42]
          border-r border-slate-200 dark:border-slate-800/40
          flex flex-col w-[240px]
          transition-colors duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center px-5 h-[72px] border-b border-slate-100 dark:border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Official Corporate Chanakya Insignia Logo */}
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/90 dark:border-white/20 flex-shrink-0">
              <img
                src="/images/corporate-chanakya-logo.png"
                alt="Corporate Chanakya Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-slate-900 dark:text-white font-bold text-[12.5px] leading-tight tracking-wider uppercase">
                CORPORATE
                <br />
                CHANAKYA
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-[8px] leading-tight font-semibold tracking-widest uppercase mt-0.5">
                ELECTORAL INTELLIGENCE
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Persistent Constituency Switcher (Searchable 100+ Seats) */}
        <div className="border-b border-slate-100 dark:border-white/5 flex-shrink-0">
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
            <p className="px-3 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400/70">
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
                      transition-all duration-150 px-3 py-2 cursor-pointer outline-none focus:outline-none focus:ring-0 select-none
                      ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 font-semibold ring-0'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300/80 dark:hover:text-white dark:hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cross-Constituency Directory */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            <p className="px-3 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400/70">
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
                      transition-all duration-150 px-3 py-2 cursor-pointer outline-none focus:outline-none focus:ring-0 select-none
                      ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 font-semibold ring-0'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300/80 dark:hover:text-white dark:hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Theme Mode Segmented Switcher */}
        <div className="px-3 py-2 border-t border-slate-100 dark:border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 px-1 font-medium">
            <span>Appearance</span>
            <span className="capitalize text-[10px] text-slate-400 font-semibold">{theme}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl border border-slate-200/80 dark:border-white/5">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Light Mode"
            >
              <Sun size={13} />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Dark Mode"
            >
              <Moon size={13} />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-transparent'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="System Preference"
            >
              <Monitor size={13} />
              <span>Auto</span>
            </button>
          </div>
        </div>

        {/* Ambient Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-white/5 flex-shrink-0">
          <div className="bg-slate-50 dark:bg-white/[0.04] rounded-xl p-2.5 border border-slate-100 dark:border-white/5 text-center">
            <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
              Goa Assembly Revision 2026
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
              50 Polling Stations • SIR Synchronized
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
