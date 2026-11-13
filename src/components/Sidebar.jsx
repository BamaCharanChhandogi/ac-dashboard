import React, { useState } from 'react';
import {
  LayoutGrid,
  BarChart3,
  FileText,
  Users,
  Briefcase,
  MapPin,
  Layers,
  Globe,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  Check,
  Menu,
  X,
} from 'lucide-react';
import ConstituencySwitcher from './ConstituencySwitcher';
import { useTheme } from '../context/ThemeContext';

const ANALYTICAL_NAV_ITEMS = [
  { id: 'dashboard',    label: 'Overview',             icon: LayoutGrid },
  { id: 'booth',        label: 'Booth Analysis',       icon: BarChart3 },
  { id: 'voter-rolls',  label: 'Voter Rolls',          icon: FileText },
  { id: 'demographics', label: 'Demographics',         icon: Users },
  { id: 'results',      label: 'Election Results',     icon: Briefcase },
  { id: 'insights',     label: 'Village Insights',     icon: MapPin },
  { id: 'reports',      label: 'Intelligence Dossier', icon: Layers },
];

const DIRECTORY_NAV_ITEMS = [
  { id: 'constituencies', label: 'All Constituencies', icon: Globe },
];

export default function Sidebar({
  activeSection = 'dashboard',
  onNavigate,
  currentSlug,
  directory,
  onSelectAC,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clickedItemId, setClickedItemId] = useState(null);
  const { theme, setTheme, isDark } = useTheme();

  const handleNav = (id) => {
    setClickedItemId(id);
    onNavigate?.(id);
    setTimeout(() => {
      setClickedItemId(null);
    }, 280);
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
          bg-white dark:bg-[#08132B]
          border-r border-slate-200/80 dark:border-slate-800/60
          flex flex-col
          transition-[width,transform] duration-300 ease-in-out select-none
          ${isCollapsed ? 'w-[72px]' : 'w-[240px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Heritage Architectural Watermark in Background (Subtle Goan Cathedral & Palms) */}
        {!isCollapsed && (
          <div
            className="absolute top-0 right-0 pointer-events-none opacity-[0.14] dark:opacity-[0.06] overflow-hidden select-none z-0"
            aria-hidden="true"
          >
            <svg
              width="145"
              height="80"
              viewBox="0 0 145 80"
              fill="currentColor"
              className="text-blue-900 dark:text-blue-300"
            >
              {/* Goan Cathedral silhouette with Cross and Palm silhouettes */}
              {/* Left Palm Tree */}
              <path
                d="M48 65 C 50 52, 53 42, 57 34 C 49 33, 40 38, 38 44 C 39 41, 48 34, 56 33 C 51 28, 44 26, 41 27 C 44 25, 52 26, 57 32 C 57 25, 58 18, 61 14 C 61 20, 59 27, 59 32 C 63 26, 69 24, 74 26 C 70 27, 64 30, 60 34 C 66 34, 74 39, 76 44 C 71 40, 63 36, 59 36 C 56 43, 53 53, 51 65 Z"
                opacity="0.5"
              />
              {/* Central Cross */}
              <rect x="94" y="8" width="2" height="10" rx="0.5" />
              <rect x="90" y="11" width="10" height="2" rx="0.5" />
              {/* Baroque curved pediment */}
              <path d="M 87 20 C 90 18, 93 18, 95 18 C 97 18, 100 18, 103 20 C 105 24, 106 28, 106 31 L 84 31 C 84 28, 85 24, 87 20 Z" />
              {/* Belfry arch window */}
              <path d="M 93 23 C 93 21.5, 97 21.5, 97 23 L 97 28 L 93 28 Z" fill="white" />
              {/* Main church body */}
              <rect x="82" y="31" width="26" height="24" />
              {/* Main arched portal */}
              <path d="M 92 42 C 92 39, 98 39, 98 42 L 98 55 L 92 55 Z" fill="white" />
              {/* Twin bell towers */}
              <rect x="74" y="33" width="8" height="22" />
              <rect x="108" y="33" width="8" height="22" />
              {/* Tower belfries */}
              <path d="M 74 33 L 78 28 L 82 33 Z" />
              <path d="M 108 33 L 112 28 L 116 33 Z" />
              {/* Church stepped courtyard terraces */}
              <rect x="70" y="55" width="50" height="3" rx="0.5" />
              <rect x="66" y="58" width="58" height="3" rx="0.5" />
              <rect x="62" y="61" width="66" height="3" rx="0.5" />
              {/* Right Palm Tree */}
              <path
                d="M 124 65 C 125 53, 128 43, 130 37 C 125 36, 120 40, 118 43 C 121 40, 126 37, 129 37 C 127 32, 123 29, 120 29 C 123 29, 127 30, 130 36 C 131 31, 133 25, 136 22 C 135 27, 133 32, 132 36 C 135 32, 140 31, 143 33 C 140 34, 136 36, 133 38 C 137 39, 142 43, 143 47 C 139 44, 134 41, 131 39 C 129 46, 127 54, 126 65 Z"
                opacity="0.5"
              />
            </svg>
          </div>
        )}

        {/* Brand Header */}
        <div className={`relative z-10 flex items-center border-b border-slate-100 dark:border-white/5 flex-shrink-0 ${
          isCollapsed ? 'h-[74px] px-2 justify-center' : 'h-[68px] px-3.5 justify-between'
        }`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center justify-center gap-1.5 w-full">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/90 dark:border-white/20 flex-shrink-0">
                <img
                  src="/images/corporate-chanakya-logo.png"
                  alt="Corporate Chanakya Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                title="Expand sidebar («)"
                className="w-6 h-5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer active:scale-90"
              >
                <ChevronsRight size={13} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Official Corporate Chanakya Insignia Logo */}
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/90 dark:border-white/20 flex-shrink-0">
                  <img
                    src="/images/corporate-chanakya-logo.png"
                    alt="Corporate Chanakya Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-slate-900 dark:text-white font-bold text-[13.5px] leading-[1.15] tracking-tight">
                    Corporate
                    <br />
                    Chanakya
                  </h1>
                  <p className="text-slate-400 dark:text-slate-400 text-[8px] leading-tight font-bold tracking-widest uppercase mt-0.5">
                    ELECTORAL INTELLIGENCE
                  </p>
                </div>
              </div>

              {/* Desktop Collapse Toggle Button « */}
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                title="Collapse sidebar («)"
                className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-150 cursor-pointer active:scale-90 ml-auto"
              >
                <ChevronsLeft size={14} />
              </button>

              {/* Mobile close */}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden ml-auto text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>

        {/* Global Persistent Constituency Switcher Card */}
        <div className="relative z-10 border-b border-slate-100 dark:border-white/5 flex-shrink-0">
          <ConstituencySwitcher
            currentSlug={currentSlug}
            directory={directory}
            onSelectAC={onSelectAC}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Navigation Sections */}
        <nav className="relative z-10 flex-1 py-3 px-2.5 space-y-4 overflow-y-auto overflow-x-hidden">
          {/* Active Constituency Scope */}
          <div>
            {!isCollapsed ? (
              <p className="px-3 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400/80">
                Constituency
              </p>
            ) : (
              <div className="w-8 h-px bg-slate-200/80 dark:bg-white/10 mx-auto my-1" />
            )}
            <div className="space-y-1">
              {ANALYTICAL_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;
                const isJustClicked = clickedItemId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleNav(id)}
                    title={isCollapsed ? label : undefined}
                    className={`
                      w-full relative flex items-center rounded-xl text-[12.5px] font-medium
                      transition-all duration-200 ease-out cursor-pointer outline-none focus:outline-none select-none
                      active:scale-[0.96] active:translate-y-px
                      ${isJustClicked ? 'animate-nav-pop' : ''}
                      ${isCollapsed ? 'justify-center p-2.5 w-11 h-11 mx-auto' : 'px-3 py-2 gap-3'}
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#3B82F6] text-white shadow-md shadow-blue-500/25 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300/80 dark:hover:text-white dark:hover:bg-white/[0.06] hover:translate-x-0.5'
                      }
                    `}
                  >
                    {/* Left vertical indicator pill matching design */}
                    {isActive && (
                      <span className={`absolute ${isCollapsed ? '-left-1' : 'left-0'} top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#3B82F6] rounded-r-full shadow-sm animate-nav-pill`} />
                    )}

                    {/* Subtle Corner Wave SVG decoration inside active button */}
                    {isActive && !isCollapsed && (
                      <svg
                        className="absolute right-0 bottom-0 pointer-events-none opacity-20 text-white animate-in fade-in duration-300"
                        width="54"
                        height="32"
                        viewBox="0 0 54 32"
                        fill="currentColor"
                      >
                        <path d="M0 32 C 18 26, 36 10, 54 0 L 54 32 Z" />
                      </svg>
                    )}

                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      className={`flex-shrink-0 transition-transform duration-200 ${
                        isActive
                          ? 'text-white scale-105'
                          : 'text-slate-400 dark:text-slate-400 group-hover:scale-105'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cross-Constituency Directory */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            {!isCollapsed ? (
              <p className="px-3 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400/80">
                Nationwide Benchmark
              </p>
            ) : (
              <div className="w-8 h-px bg-slate-200/80 dark:bg-white/10 mx-auto my-1" />
            )}
            <div className="space-y-1">
              {DIRECTORY_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;
                const isJustClicked = clickedItemId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleNav(id)}
                    title={isCollapsed ? label : undefined}
                    className={`
                      w-full relative flex items-center rounded-xl text-[12.5px] font-medium
                      transition-all duration-200 ease-out cursor-pointer outline-none focus:outline-none select-none
                      active:scale-[0.96] active:translate-y-px
                      ${isJustClicked ? 'animate-nav-pop' : ''}
                      ${isCollapsed ? 'justify-center p-2.5 w-11 h-11 mx-auto' : 'px-3 py-2 gap-3'}
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#3B82F6] text-white shadow-md shadow-blue-500/25 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300/80 dark:hover:text-white dark:hover:bg-white/[0.06] hover:translate-x-0.5'
                      }
                    `}
                  >
                    {/* Left vertical indicator pill matching design */}
                    {isActive && (
                      <span className={`absolute ${isCollapsed ? '-left-1' : 'left-0'} top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#3B82F6] rounded-r-full shadow-sm animate-nav-pill`} />
                    )}

                    {/* Subtle Corner Wave SVG decoration inside active button */}
                    {isActive && !isCollapsed && (
                      <svg
                        className="absolute right-0 bottom-0 pointer-events-none opacity-20 text-white animate-in fade-in duration-300"
                        width="54"
                        height="32"
                        viewBox="0 0 54 32"
                        fill="currentColor"
                      >
                        <path d="M0 32 C 18 26, 36 10, 54 0 L 54 32 Z" />
                      </svg>
                    )}

                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      className={`flex-shrink-0 transition-transform duration-200 ${
                        isActive
                          ? 'text-white scale-105'
                          : 'text-slate-400 dark:text-slate-400 group-hover:scale-105'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Appearance Switcher (Clean 2-Button Segmented Pill Container) */}
        <div className="relative z-10 px-3 py-2 border-t border-slate-100 dark:border-white/5 flex-shrink-0">
          {!isCollapsed && (
            <p className="px-1 mb-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400/80">
              Appearance
            </p>
          )}

          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-10 h-10 mx-auto rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 cursor-pointer active:scale-95 transition-all"
            >
              {isDark ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-amber-500" />}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-1 bg-slate-100/90 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200/70 dark:border-white/5">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`
                  flex items-center justify-center gap-2 py-1.5 rounded-lg text-[12px] font-semibold
                  transition-all duration-200 ease-out cursor-pointer active:scale-95 select-none
                  ${
                    !isDark
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }
                `}
                title="Light Mode"
              >
                <Sun size={14} className={!isDark ? 'text-blue-600' : 'text-slate-400'} />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`
                  flex items-center justify-center gap-2 py-1.5 rounded-lg text-[12px] font-semibold
                  transition-all duration-200 ease-out cursor-pointer active:scale-95 select-none
                  ${
                    isDark
                      ? 'bg-[#0D1527] text-white shadow-sm border border-blue-500/40 font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }
                `}
                title="Dark Mode"
              >
                <Moon size={14} className={isDark ? 'text-blue-400' : 'text-slate-400'} />
                <span>Dark</span>
              </button>
            </div>
          )}
        </div>

        {/* Ambient Footer Status Badge (Goa Assembly Revision 2026) */}
        <div className="relative z-10 p-2.5 border-t border-slate-100 dark:border-white/5 flex-shrink-0">
          {isCollapsed ? (
            <div
              title="Goa Assembly Revision 2026 • 50 Polling Stations • SIR Synchronized"
              className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs cursor-default"
            >
              <Check size={16} strokeWidth={2.5} />
            </div>
          ) : (
            <div className="bg-[#EBFDF2] dark:bg-emerald-950/30 rounded-xl p-2.5 border border-[#B7F4CA] dark:border-emerald-800/40 flex items-center gap-2.5 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check size={13} strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-800 dark:text-emerald-100 leading-tight truncate">
                  Goa Assembly Revision 2026
                </p>
                <p className="text-[9.5px] font-medium text-slate-500 dark:text-emerald-400/80 leading-tight mt-0.5 truncate">
                  50 Polling Stations • SIR Synchronized
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}