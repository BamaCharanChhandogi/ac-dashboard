import React from 'react';
import { 
  Hash, 
  MapPin, 
  Landmark, 
  Globe2, 
  TrendingUp, 
  Award 
} from 'lucide-react';
import { getPartyTheme, formatPercentage } from '../utils/formatters';

export default function KPIGrid({ data }) {
  if (!data) return null;
  const { kpis, meta } = data;

  const acPartyTheme = getPartyTheme(kpis?.best_ac_party?.party);
  const pcPartyTheme = getPartyTheme(kpis?.best_pc_party?.party);

  const urbanStr = meta?.urban_rural_split?.urban_pct != null ? formatPercentage(meta.urban_rural_split.urban_pct) : '0.0%';
  const ruralStr = meta?.urban_rural_split?.rural_pct != null ? formatPercentage(meta.urban_rural_split.rural_pct) : '0.0%';

  const cards = [
    {
      title: 'AC NUMBER',
      value: `AC ${String(meta?.ac_no ?? '00').padStart(2, '0')}`,
      subtitle: meta?.reservation ? `${meta.reservation} Category` : 'General Category',
      icon: Hash,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'SEGMENT / TALUKA',
      value: meta?.taluka || kpis?.segment || 'Constituency',
      subtitle: `${meta?.district || 'District'} Administrative District`,
      icon: MapPin,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'PARLIAMENTARY CONSTITUENCY',
      value: meta?.pc_name || kpis?.pc_info || 'PC 1',
      subtitle: `North Goa Parliamentary Seat (${meta?.pc_no ?? 1})`,
      icon: Landmark,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'STATE JURISDICTION',
      value: meta?.state || 'Goa',
      subtitle: `${urbanStr} Urban · ${ruralStr} Rural`,
      icon: Globe2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'PEAK AC PARTY VOTE %',
      value: kpis?.best_ac_party?.party
        ? `${kpis.best_ac_party.party} · ${formatPercentage(kpis.best_ac_party.pct)}`
        : 'N/A',
      subtitle: kpis?.best_ac_party?.year || 'Assembly Record',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      highlightBadge: kpis?.best_ac_party?.party,
      badgeColor: acPartyTheme.badgeClass,
    },
    {
      title: 'PEAK PC PARTY VOTE %',
      value: kpis?.best_pc_party?.party
        ? `${kpis.best_pc_party.party} · ${formatPercentage(kpis.best_pc_party.pct)}`
        : 'N/A',
      subtitle: kpis?.best_pc_party?.year || 'Lok Sabha Record',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      highlightBadge: kpis?.best_pc_party?.party,
      badgeColor: pcPartyTheme.badgeClass,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                  {c.title}
                </span>
                <div className={`w-7 h-7 rounded-lg ${c.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${c.color}`} />
                </div>
              </div>

              <div className="text-base sm:text-lg font-black text-navy-900 tracking-tight tabular-nums flex items-center gap-1.5 flex-wrap">
                <span>{c.value}</span>
                {c.highlightBadge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${c.badgeColor}`}>
                    {c.highlightBadge}
                  </span>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-600 mt-2 font-medium truncate">
              {c.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
