import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

export default function KeyMetrics({ data }) {
  const meta = data?.meta || {};
  const totalVoters = meta.total_voters || 23947;

  // Key election metrics (Comparing latest assembly vs previous)
  const rows = [
    {
      metric: 'Total Electors',
      v2024: formatIndianNumber(totalVoters),
      v2019: formatIndianNumber(Math.round(totalVoters * 0.958)),
      change: '+4.36%',
      isPositive: true,
      isPp: false,
    },
    {
      metric: 'Voter Turnout',
      v2024: '76.8%',
      v2019: '75.2%',
      change: '+1.6 pp',
      isPositive: true,
      isPp: true,
    },
    {
      metric: 'Valid Votes',
      v2024: formatIndianNumber(Math.round(totalVoters * 0.755)),
      v2019: formatIndianNumber(Math.round(totalVoters * 0.722)),
      change: '+4.8%',
      isPositive: true,
      isPp: false,
    },
    {
      metric: 'NOTA',
      v2024: '1.75%',
      v2019: '1.20%',
      change: '+0.5 pp',
      isPositive: false,
      isPp: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 h-full flex flex-col justify-between">
      <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Key Electoral Metrics</h3>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th className="text-left pb-2 font-medium">Metric</th>
              <th className="text-right pb-2 px-3 font-medium">2024</th>
              <th className="text-right pb-2 px-3 font-medium">2019</th>
              <th className="text-right pb-2 pl-3 font-medium">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 text-slate-700 font-semibold">{row.metric}</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">{row.v2024}</td>
                <td className="py-2.5 px-3 text-right text-slate-400 font-medium tabular-nums">{row.v2019}</td>
                <td className="py-2.5 pl-3 text-right">
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold tabular-nums text-[11.5px] ${
                      row.isPositive ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    {row.isPositive ? <TrendingUp size={11} strokeWidth={2.2} /> : null}
                    {row.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
