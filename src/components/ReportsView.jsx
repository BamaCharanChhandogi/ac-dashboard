import React from 'react';
import { Download, Printer } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function ReportsView({ data }) {
  const meta = data?.meta || {};
  const totalVoters = meta.total_voters || 27265;
  const totalBooths = meta.total_booths || 50;

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-[26px] font-bold text-slate-900 tracking-tight">
            Constituency Intelligence Report
          </h2>
          <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
            Executive dossier for {meta.ac_name || 'Sanquelim'} (AC {meta.ac_no || 17}) • SIR 2026 Revision
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Official Executive Briefing Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <p className="text-[11px] font-bold text-blue-600 tracking-wider uppercase mb-1">
            EXECUTIVE INTELLIGENCE BRIEF
          </p>
          <h3 className="font-serif text-[24px] font-bold text-slate-900">
            {meta.ac_name || 'Sanquelim'} Assembly Constituency • Comprehensive Audit
          </h3>
          <p className="text-[12px] text-slate-500 mt-1">
            Published: Special Summary Revision (SIR 2026) · Status: Complete
          </p>
        </div>

        {/* 4 Summary Points */}
        <div className="space-y-4 text-[13px] text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">1. Electorate Stability</h4>
            <p className="text-slate-600">
              {meta.ac_name} currently commands <strong>{formatIndianNumber(totalVoters)} active electors</strong> across <strong>{totalBooths} polling stations</strong>. Elector roll net growth has stabilized at 0 net change since Supplement-3, indicating low volatile migration and high roll integrity.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">2. Demographic Composition</h4>
            <p className="text-slate-600">
              Female electors constitute <strong>51.0% (13,915 voters)</strong>, yielding an above-average sex ratio of <strong>1,042 females per 1,000 males</strong>. The largest voting cohort is aged 45–54 (21.8%), followed by youth voters aged 25–34 (18.6%).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">3. Polling Booth & Village Fortress</h4>
            <p className="text-slate-600">
              Across all 9 constituent villages, BJP maintains positive historical margins in Form-20 retrospective audits. The strongest strongholds are <strong>Cotombi (+43.4%)</strong>, <strong>Surla (+39.6%)</strong>, and <strong>Navelim (+35.6%)</strong>, with average booth density at 545 voters per EVM station.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">4. Household Clustering & Community Footprint</h4>
            <p className="text-slate-600">
              A total of <strong>{formatIndianNumber(meta.total_families || 6041)} family units</strong> were mapped. The largest joint family compound clusters include the Naik families in Pale (up to 25 electors in a single compound) and the Parab family in Cotombi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
