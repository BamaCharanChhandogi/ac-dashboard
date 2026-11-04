import React from 'react';
import { ShieldCheck, Info, Database, Compass } from 'lucide-react';

export default function Footer({ data }) {
  const meta = data?.meta || {};

  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-slate-800 text-xs py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm tracking-tight">
              <div className="w-7 h-7 rounded-lg bg-navy-900 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                AC
              </div>
              <span>AC DASHBOARD PLATFORM</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Universal electoral analytics and constituency intelligence engine. Standardized data schemas, zero-server Jamstack architecture, and verified electoral roll audit logs across Indian constituencies.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy Certified • Zero Personal Phone Numbers Exported</span>
            </div>
          </div>

          {/* Data Sources & Methodology */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block">
              Official Data Governance
            </span>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• <strong>Electoral Roll:</strong> SIR 2026 Supplement-3 Verified Records</li>
              <li>• <strong>Election Returns:</strong> Official Form 20 (Vidhan Sabha & Lok Sabha)</li>
              <li>• <strong>Auxiliary Stations:</strong> Consolidated 1:1 with map polygons (e.g. 22 + 22A)</li>
              <li>• <strong>Spatial Boundaries:</strong> Standard SVG Vector Viewports</li>
            </ul>
          </div>

          {/* Quick Context */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block">
              Active Constituency
            </span>
            <div className="bg-navy-900 rounded-xl p-3 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="text-amber-400 font-bold">AC {meta.ac_no} — {meta.ac_name}</div>
              <div>District: {meta.district}</div>
              <div>Taluka: {meta.taluka}</div>
              <div>PC: {meta.pc_no} - {meta.pc_name}</div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Electoral Intelligence Platform. Developed for Public Analytics & Research.
          </div>
          <div className="flex items-center gap-4">
            <span>Serverless Jamstack</span>
            <span>•</span>
            <span>Static CDN Ready</span>
            <span>•</span>
            <span>Inter Typography System</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
