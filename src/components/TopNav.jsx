import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Share2, 
  Download, 
  GitCompare, 
  Check, 
  ExternalLink,
  Users,
  ShieldAlert
} from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function TopNav({ 
  constituencies = [], 
  selectedSlug, 
  onSelectConstituency, 
  currentData 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close dropdown on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    if (dropdownOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [dropdownOpen]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMeta = currentData?.meta || {};
  const totalVoters = currentMeta.total_voters || 0;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-amber-400 font-bold shadow-xs">
                <span className="text-lg tracking-tighter">AC</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-navy-900 tracking-tight text-sm uppercase">
                    AC Dashboard
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    LIVE INTEL
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Electoral Intelligence & Polling Platform
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center text-xs text-slate-400 font-medium pl-3 border-l border-slate-200 space-x-1.5">
              <span>Goa</span>
              <span>/</span>
              <span>North Goa (PC 1)</span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">{currentMeta.ac_name || 'Constituency'}</span>
            </div>
          </div>

          {/* Center Constituency Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 text-navy-900 text-sm font-semibold transition-all shadow-xs"
              aria-label="Select Constituency"
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>
                {currentMeta.ac_name ? `AC ${String(currentMeta.ac_no).padStart(2, '0')} — ${currentMeta.ac_name}` : 'Select Constituency'}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div 
                  className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Assembly Constituency
                </div>
                {constituencies.map((c) => {
                  const isSelected = c.slug === selectedSlug;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => {
                        onSelectConstituency(c.slug);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm flex items-center gap-1.5">
                          <span className="text-slate-500 font-mono text-xs">AC{String(c.ac_no).padStart(2, '0')}</span>
                          <span>{c.ac_name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {c.sitting_mla} • {formatIndianNumber(c.total_voters)} voters
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              </>
            )}
          </div>

          {/* Right Action Pills */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>{formatIndianNumber(totalVoters)} Electors</span>
            </div>

            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors"
              title="Share Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors"
              title="Export / Print Dossier"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
