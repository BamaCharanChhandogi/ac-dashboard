import React from 'react';
import { UserCheck, Building2, MapPin, Scale, Building, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

function KPICard({ icon: Icon, label, value, subText, badgeText, badgePositive = true, iconBg, iconColor }) {
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
        <div className="flex items-center gap-1.5 mt-1.5">
          {badgeText && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums ${badgePositive ? 'text-emerald-600' : 'text-rose-500'}`}>
              {badgePositive ? <TrendingUp size={11} strokeWidth={2.2} /> : <TrendingDown size={11} strokeWidth={2.2} />}
              {badgeText}
            </span>
          )}
          {subText && (
            <span className="text-[11px] text-slate-400 font-medium truncate">
              {subText}
            </span>
          )}
        </div>
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
  const areasCount = meta.constituent_areas?.length || 0;
  const sexRatio = gender.sex_ratio || 0;
  const urbanPct = urban.urban_pct ?? null;
  const ruralPct = urban.rural_pct ?? null;

  const added = meta.sir_added || 0;
  const deleted = meta.sir_deleted || 0;
  const netChurn = added - deleted;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 px-6 lg:px-8 py-4">
      {/* 1. Total Electors */}
      <KPICard
        icon={UserCheck}
        label="Total Electors"
        value={totalVoters > 0 ? formatIndianNumber(totalVoters) : '—'}
        badgeText="+4.36%"
        badgePositive={true}
        subText="vs 2019"
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />

      {/* 2. Total Polling Booths */}
      <KPICard
        icon={Building2}
        label="Total Booths"
        value={totalBooths > 0 ? totalBooths.toLocaleString('en-IN') : '—'}
        subText="100% EVM coverage"
        iconBg="bg-cyan-50"
        iconColor="text-cyan-600"
      />

      {/* 3. Constituent Villages / Wards */}
      <KPICard
        icon={MapPin}
        label="Constituent Areas"
        value={areasCount > 0 ? `${areasCount} Areas` : '—'}
        subText={meta.taluka ? `${meta.taluka} Taluka` : 'Panchayats & Wards'}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
      />

      {/* 4. Gender Sex Ratio */}
      <KPICard
        icon={Scale}
        label="Sex Ratio"
        value={sexRatio > 0 ? `${sexRatio}` : '—'}
        subText="♀ per 1,000 ♂"
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
      />

      {/* 5. Urban / Rural Demographic Split */}
      <KPICard
        icon={Building}
        label="Urban / Rural"
        value={urbanPct !== null ? `${urbanPct}% / ${ruralPct}%` : '—'}
        subText="Mixed classification"
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
      />

      {/* 6. SIR 2026 Revision Net Growth */}
      <KPICard
        icon={RefreshCw}
        label="SIR 2026 Churn"
        value={netChurn !== 0 ? `${netChurn > 0 ? '+' : ''}${formatIndianNumber(netChurn)}` : '0'}
        badgeText={`+${formatIndianNumber(added)}`}
        badgePositive={true}
        subText={`/ -${formatIndianNumber(deleted)}`}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />
    </div>
  );
}
