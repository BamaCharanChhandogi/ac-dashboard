import React from 'react';
import { MapPin } from 'lucide-react';

const COLOR_THEMES = {
  blue: {
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200/80 dark:border-blue-800/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    accentBorder: 'border-l-blue-600 dark:border-l-blue-500',
  },
  indigo: {
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200/80 dark:border-indigo-800/60',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    accentBorder: 'border-l-indigo-600 dark:border-l-indigo-500',
  },
  teal: {
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
    badgeText: 'text-teal-800 dark:text-teal-300',
    badgeBorder: 'border-teal-200/80 dark:border-teal-800/60',
    iconColor: 'text-teal-600 dark:text-teal-400',
    accentBorder: 'border-l-teal-600 dark:border-l-teal-500',
  },
  purple: {
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-200/80 dark:border-purple-800/60',
    iconColor: 'text-purple-600 dark:text-purple-400',
    accentBorder: 'border-l-purple-600 dark:border-l-purple-500',
  },
  orange: {
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-200/80 dark:border-amber-800/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    accentBorder: 'border-l-amber-600 dark:border-l-amber-500',
  },
  emerald: {
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200/80 dark:border-emerald-800/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    accentBorder: 'border-l-emerald-600 dark:border-l-emerald-500',
  },
  slate: {
    badgeBg: 'bg-slate-100 dark:bg-slate-800/80',
    badgeText: 'text-slate-800 dark:text-slate-200',
    badgeBorder: 'border-slate-300/80 dark:border-slate-700',
    iconColor: 'text-slate-700 dark:text-slate-300',
    accentBorder: 'border-l-slate-700 dark:border-l-slate-400',
  },
};

export default function PageHeader({
  badgeLabel,
  badgeIcon: BadgeIcon,
  badgeColor = 'blue',
  title,
  subtitle,
  meta,
  actions,
}) {
  const theme = COLOR_THEMES[badgeColor] || COLOR_THEMES.blue;
  const acNumber = meta?.ac_no ? `AC ${String(meta.ac_no).padStart(2, '0')}` : null;
  const acName = meta?.ac_name || null;
  const district = meta?.district || 'North Goa';
  const state = meta?.state || 'Goa';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/70">
      <div className="space-y-1.5 min-w-0">
        {/* Color-Coded Distinct Module Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
          >
            {BadgeIcon && <BadgeIcon size={12} className={theme.iconColor} />}
            <span>{badgeLabel}</span>
          </div>

          {/* Quick Breadcrumb Trail */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            <span>{state.toUpperCase()}</span>
            <span className="opacity-40">/</span>
            <span>{district.toUpperCase()}</span>
            {meta?.taluka && (
              <>
                <span className="opacity-40">/</span>
                <span>{meta.taluka.toUpperCase()}</span>
              </>
            )}
          </div>
        </div>

        {/* Clear Editorial Page Title */}
        <h1 className="font-serif text-[28px] md:text-[32px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {title}
        </h1>

        {/* Informative Subtitle */}
        {subtitle && (
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Side: Constituency Context Chip or Custom Actions */}
      <div className="flex items-center gap-2.5 flex-shrink-0 self-start sm:self-center">
        {actions}

        {acName && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800/80 shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
              <MapPin size={12} />
            </div>
            <div className="text-left">
              <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                Active Seat
              </p>
              <p className="text-[12px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {acNumber} • {acName}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
