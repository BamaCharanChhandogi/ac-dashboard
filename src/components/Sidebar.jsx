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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'constituencies', label: 'Constituencies',    icon: MapPin },
  { id: 'booth',          label: 'Booth Analysis',    icon: BarChart3 },
  { id: 'voter-rolls',    label: 'Voter Rolls',        icon: ScrollText },
  { id: 'demographics',   label: 'Demographics',       icon: Users },
  { id: 'results',        label: 'Election Results',   icon: Vote },
  { id: 'reports',        label: 'Reports',             icon: FileText },
  { id: 'insights',       label: 'Insights',            icon: Lightbulb },
];

export default function Sidebar({ activeSection = 'dashboard', onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
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
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#0C1838] text-white p-2.5 rounded-lg shadow-lg border border-slate-700/50"
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
          bg-[#0C1838] border-r border-slate-800/40
          flex flex-col sidebar-transition
          ${collapsed ? 'w-[72px]' : 'w-[230px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Brand Header */}
        <div className={`flex items-center px-4 h-[72px] ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#991B1B] flex items-center justify-center shadow-md shadow-red-900/30 flex-shrink-0">
                <span className="text-white font-extrabold text-[13px] tracking-tighter">CC</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-white font-bold text-[13.5px] leading-tight tracking-tight uppercase truncate">
                  Corporate Chanakya
                </h1>
                <p className="text-slate-400 text-[9px] leading-tight font-medium truncate mt-0.5 tracking-wider uppercase">
                  Electoral Intelligence
                </p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-[#991B1B] flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-[13px]">CC</span>
            </div>
          )}

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                title={collapsed ? label : undefined}
                className={`
                  w-full flex items-center gap-3 rounded-xl text-[13px] font-medium
                  transition-all duration-150
                  ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3.5 py-2.5'}
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300/80 hover:text-white hover:bg-white/6'
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className={isActive ? 'text-white' : 'text-slate-400'}
                />
                {!collapsed && <span className="truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Parliament Branding (Real Image from User Reference) */}
        <div className="mt-auto p-3 pt-2">
          {!collapsed ? (
            <div className="rounded-xl overflow-hidden bg-[#0A1530] border border-slate-800/60 shadow-inner">
              <img
                src="/images/bharat-election-intelligence.png"
                alt="India Election Intelligence • Data • People • Outcomes"
                className="w-full h-auto block select-none pointer-events-none"
              />
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-lg overflow-hidden bg-[#0A1530] flex items-center justify-center border border-slate-800/60">
              <img
                src="/images/bharat-election-intelligence.png"
                alt="India Election Intelligence"
                className="w-8 h-8 object-contain opacity-80"
              />
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-[#0C1838] border border-slate-700 rounded-full items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 transition-colors shadow-md z-10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}
