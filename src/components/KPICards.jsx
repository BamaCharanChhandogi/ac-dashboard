import React from 'react';
import { Users, UserCheck, Building2, Scale, Building, Trees, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

function KPICard({ icon: Icon, label, value, badgeText, badgeType = 'neutral', iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 card-hover flex items-start gap-3.5 min-w-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={19} className={iconColor} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider leading-tight mb-1 truncate">
          {label}
        </p>
        <p className="text-[21px] font-bold text-slate-900 tabular-nums leading-none tracking-tight">
          {value}
        </p>
        {badgeText && (
          <div className="flex items-center gap-1 mt-1.5">
            {badgeType === 'positive' && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
                <TrendingUp size={12} strokeWidth={2.2} />
                {badgeText}
              </span>
            )}
            {badgeType === 'negative' && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-rose-500">
                <TrendingDown size={12} strokeWidth={2.2} />
                {badgeText}
              </span>
            )}
            {badgeType === 'neutral' && (
              <span className="text-[11px] text-slate-400 font-medium truncate">
                {badgeText}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function KPICards({ data }) {
  const meta = data?.meta || {};
  const demo = data?.demographics || {};
  const gender = demo?.gender || {};
  const urban = meta?.urban_rural_split || {};

  const totalVoters = meta.total_voters || 0;
  const totalBooths = meta.total_booths || 0;
  const sexRatio = gender.sex_ratio || 0;
  const urbanPct = urban.urban_pct ?? null;
  const ruralPct = urban.rural_pct ?? null;

  // Population estimation
  const estPopulation = totalVoters > 0 ? Math.round(totalVoters / 0.70) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 px-6 lg:px-8 py-4">
      <KPICard
        icon={Users}
        label="Total Population"
        value={estPopulation > 0 ? formatIndianNumber(estPopulation) : '—'}
        badgeText="+1.92% vs 2011"
        badgeType="positive"
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
      />
      <KPICard
        icon={UserCheck}
        label="Total Electors"
        value={totalVoters > 0 ? formatIndianNumber(totalVoters) : '—'}
        badgeText="+4.36% vs 2019"
        badgeType="positive"
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
      <KPICard
        icon={Building2}
        label="Total Booths"
        value={totalBooths > 0 ? totalBooths.toLocaleString('en-IN') : '—'}
        badgeText="No change"
        badgeType="neutral"
        iconBg="bg-cyan-50"
        iconColor="text-cyan-600"
      />
      <KPICard
        icon={Scale}
        label="Gender Ratio"
        value={sexRatio > 0 ? `${sexRatio} ♀ / 1,000 ♂` : '—'}
        badgeText="(per 1,000 males)"
        badgeType="neutral"
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
      />
      <KPICard
        icon={Building}
        label="Urban Population"
        value={urbanPct !== null ? `${urbanPct}%` : '—'}
        badgeText="+5.1 pp"
        badgeType="positive"
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
      />
      <KPICard
        icon={Trees}
        label="Rural Population"
        value={ruralPct !== null ? `${ruralPct}%` : '—'}
        badgeText="-5.1 pp"
        badgeType="negative"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />
    </div>
  );
}
