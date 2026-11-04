import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  History, 
  Users, 
  UserCheck, 
  BarChart3, 
  Map, 
  Home, 
  Table, 
  PhoneCall 
} from 'lucide-react';

export default function NavPills({ hasSurvey = true }) {
  const [activeSection, setActiveSection] = useState('overview');

  const navItems = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sir-timeline', label: 'SIR Progression', icon: History },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'leadership', label: 'Leaders', icon: UserCheck },
    { id: 'elections', label: 'Elections & Trends', icon: BarChart3 },
    { id: 'spatial-maps', label: 'Spatial Maps', icon: Map },
    { id: 'families', label: 'Family Clusters', icon: Home },
    { id: 'data-tables', label: 'Data Tables', icon: Table },
    { 
      id: 'citizen-survey', 
      label: 'Citizen Survey', 
      icon: PhoneCall,
      badge: hasSurvey ? 'Active' : 'Pending'
    },
  ], [hasSurvey]);

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // offset for sticky nav
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Find the currently visible section using viewport-relative bounding boxes
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom > 140) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <nav className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    item.badge === 'Active'
                      ? (isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')
                      : (isActive ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
