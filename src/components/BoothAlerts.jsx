import React from 'react';
import { ArrowRight } from 'lucide-react';

const ALERTS_DATA = [
  { booth: '0022', location: 'Penha-de-Franca', status: 'Sensitive', issue: 'Auxiliary clubbed (22+22A)' },
  { booth: '0002', location: 'Socorro - North',  status: 'Watchlist', issue: 'Voter list additions (+22)' },
  { booth: '0039', location: 'Salvador do Mundo', status: 'Watchlist', issue: 'Address rectification surge' },
  { booth: '0001', location: 'Govt. Primary',    status: 'Normal',    issue: 'High voter density checked' },
];

export default function BoothAlerts({ data }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-slate-900">Recent Booth Alerts</h3>
        <button className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View All <ArrowRight size={12} />
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-[11.5px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th className="text-left pb-2 pr-2 font-medium">Booth No.</th>
              <th className="text-left pb-2 px-2 font-medium">Location</th>
              <th className="text-left pb-2 px-2 font-medium">Status</th>
              <th className="text-left pb-2 pl-2 font-medium">Issue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ALERTS_DATA.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 pr-2 font-bold text-slate-900 tabular-nums">
                  {item.booth}
                </td>
                <td className="py-2.5 px-2 text-slate-600 font-medium">
                  {item.location}
                </td>
                <td className="py-2.5 px-2">
                  {item.status === 'Sensitive' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Sensitive
                    </span>
                  )}
                  {item.status === 'Watchlist' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Watchlist
                    </span>
                  )}
                  {item.status === 'Normal' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Normal
                    </span>
                  )}
                </td>
                <td className="py-2.5 pl-2 text-slate-500 font-medium truncate max-w-[140px]">
                  {item.issue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
