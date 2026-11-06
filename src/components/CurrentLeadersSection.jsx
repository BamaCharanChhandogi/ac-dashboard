import React, { useState } from 'react';
import {
  Landmark,
  MapPin,
  Award,
  FileText,
  BarChart3,
  PieChart,
  ArrowRight,
  X,
  Info,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Calendar,
  GraduationCap,
  Vote
} from 'lucide-react';
import { formatIndianNumber } from '../utils/formatters';

function PartyBadge({ party, role }) {
  const isBjp = party === 'BJP';
  const isInc = party === 'INC';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-extrabold tracking-wide ${
        isBjp
          ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60'
          : isInc
          ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60'
          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
      <span>{party}</span>
      <span className="opacity-40">|</span>
      <span className="font-semibold text-[10.5px]">{role}</span>
    </div>
  );
}

function CircularProgress({ pct, color = '#2563EB' }) {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg className="w-5 h-5 -rotate-90 flex-shrink-0" viewBox="0 0 28 28">
      <circle
        cx="14"
        cy="14"
        r={radius}
        stroke="currentColor"
        strokeWidth="3.5"
        fill="transparent"
        className="text-slate-200 dark:text-slate-800"
      />
      <circle
        cx="14"
        cy="14"
        r={radius}
        stroke={color}
        strokeWidth="3.5"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
      />
    </svg>
  );
}

export default function CurrentLeadersSection({ data }) {
  const meta = data?.meta || {};
  const leaders = data?.leaders || {};
  const mla = leaders.mla;
  const mp = leaders.mp;

  const [activeModalLeader, setActiveModalLeader] = useState(null);

  if (!mla && !mp) return null;

  const acName = meta.ac_name || 'Constituency';
  const pcName = meta.pc_name || 'North Goa';

  return (
    <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 md:p-7 shadow-xs space-y-6">
      {/* Header with Landmark Icon */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-2xs">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-[24px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              Current MLA & MP
            </h2>
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              {acName} Constituency • {pcName} (Lok Sabha)
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          Sitting Representatives Dossier
        </span>
      </div>

      {/* Two-Column Grid: MLA (Left) & MP (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===================== LEFT: CURRENT MLA ===================== */}
        {mla && (
          <div className="bg-slate-50/60 dark:bg-slate-900/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 md:p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Top Location & Term Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  {mla.constituency || `${acName} (AC ${meta.ac_no || '—'})`}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {mla.terms_summary || mla.tenure || 'Sitting MLA'}
                </span>
              </div>

              {/* Leader Profile Card */}
              <div className="flex items-start gap-4">
                <img
                  src={mla.photo_url || '/images/leaders/pramod-sawant.jpg'}
                  alt={mla.name}
                  className="w-20 h-20 min-w-[80px] max-w-[80px] rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-800/60">
                      CURRENT MLA
                    </span>
                  </div>
                  <h3 className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight truncate">
                    {mla.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <PartyBadge party={mla.party || 'BJP'} role="MLA" />
                  </div>
                </div>
              </div>

              {/* Ministerial Portfolio / Office (if available) */}
              {mla.portfolio && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 text-blue-900 dark:text-blue-300 text-[11.5px] font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">{mla.portfolio}</span>
                </div>
              )}

              {/* Metadata line (Age | Education | First elected) */}
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Age: <strong className="text-slate-700 dark:text-slate-200">{mla.age || 51} years</strong>
                <span className="mx-2 opacity-40">|</span>
                Education: <strong className="text-slate-700 dark:text-slate-200">{mla.education || 'Graduate'}</strong>
                <span className="mx-2 opacity-40">|</span>
                First elected: <strong className="text-slate-700 dark:text-slate-200">{mla.first_elected || '2012'}</strong>
              </p>

              {/* Latest Assembly Election Performance */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Latest Assembly Election (2022)</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Metric 1: Vote Share */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Vote share</span>
                      <CircularProgress pct={mla.vote_pct || 48.3} color="#2563EB" />
                    </div>
                    <div>
                      <p className="text-[19px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                        {mla.vote_pct}%
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums mt-0.5">
                        {formatIndianNumber(mla.votes)} votes
                      </p>
                    </div>
                  </div>

                  {/* Metric 2: Victory Margin */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Victory margin</span>
                      <BarChart3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-[19px] font-extrabold text-[#0D9488] dark:text-teal-400 tabular-nums leading-none">
                        +{formatIndianNumber(mla.margin_votes)}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums mt-0.5">
                        +{mla.margin_pct}% lead
                      </p>
                    </div>
                  </div>

                  {/* Metric 3: Runner-up */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Runner-up</span>
                    <div className="mt-1">
                      <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight truncate" title={mla.runner_up}>
                        {mla.runner_up ? mla.runner_up.split('(')[0].trim() : 'Runner Up'}
                      </p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-extrabold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {mla.runner_up && mla.runner_up.includes('(') ? mla.runner_up.split('(')[1].replace(')', '') : 'OPP'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Dossier */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>About</span>
                </div>
                <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {mla.about || `${mla.name} represents ${acName} in the Goa Legislative Assembly.`}
                </p>
              </div>
            </div>

            {/* Profile Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalLeader({ ...mla, type: 'MLA', constituencyLabel: `${acName} (AC ${meta.ac_no})` })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== RIGHT: CURRENT MP ===================== */}
        {mp && (
          <div className="bg-slate-50/60 dark:bg-slate-900/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 md:p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Top Location & Term Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  {mp.constituency || `${pcName} (Lok Sabha)`}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {mp.terms_summary || mp.tenure || 'Sitting MP'}
                </span>
              </div>

              {/* Leader Profile Card */}
              <div className="flex items-start gap-4">
                <img
                  src={mp.photo_url || '/images/leaders/shripad-naik.jpg'}
                  alt={mp.name}
                  className="w-20 h-20 min-w-[80px] max-w-[80px] rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-300/70 dark:border-blue-800/60">
                      CURRENT MP
                    </span>
                  </div>
                  <h3 className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight truncate">
                    {mp.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <PartyBadge party={mp.party || 'BJP'} role="MP" />
                  </div>
                </div>
              </div>

              {/* Ministerial Portfolio / Office (if available) */}
              {mp.portfolio && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 text-blue-900 dark:text-blue-300 text-[11.5px] font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">{mp.portfolio}</span>
                </div>
              )}

              {/* Metadata line (Age | Education | First elected) */}
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Age: <strong className="text-slate-700 dark:text-slate-200">{mp.age || 71} years</strong>
                <span className="mx-2 opacity-40">|</span>
                Education: <strong className="text-slate-700 dark:text-slate-200">{mp.education || 'Graduate'}</strong>
                <span className="mx-2 opacity-40">|</span>
                First elected: <strong className="text-slate-700 dark:text-slate-200">{mp.first_elected || '1999'}</strong>
              </p>

              {/* Latest Parliamentary Election Performance */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Latest Lok Sabha Election (2024)</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Metric 1: Vote Share */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Vote share</span>
                      <CircularProgress pct={mp.vote_pct || 56.4} color="#2563EB" />
                    </div>
                    <div>
                      <p className="text-[19px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                        {mp.vote_pct}%
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums mt-0.5">
                        {formatIndianNumber(mp.votes)} votes
                      </p>
                    </div>
                  </div>

                  {/* Metric 2: Victory Margin */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Victory margin</span>
                      <BarChart3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-[19px] font-extrabold text-[#0D9488] dark:text-teal-400 tabular-nums leading-none">
                        +{formatIndianNumber(mp.margin_votes)}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums mt-0.5">
                        +{mp.margin_pct}% lead
                      </p>
                    </div>
                  </div>

                  {/* Metric 3: Runner-up */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/80 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Runner-up</span>
                    <div className="mt-1">
                      <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight truncate" title={mp.runner_up}>
                        {mp.runner_up ? mp.runner_up.split('(')[0].trim() : 'Runner Up'}
                      </p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-extrabold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {mp.runner_up && mp.runner_up.includes('(') ? mp.runner_up.split('(')[1].replace(')', '') : 'OPP'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Dossier */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>About</span>
                </div>
                <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {mp.about || `${mp.name} represents ${pcName} in the Lok Sabha.`}
                </p>
              </div>
            </div>

            {/* Profile Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalLeader({ ...mp, type: 'MP', constituencyLabel: `${pcName} (Lok Sabha)` })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Legal / Electoral Roll Disclaimer */}
      <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
        <Info className="w-3.5 h-3.5 flex-shrink-0" />
        <span>
          Biographical and portfolio details reflect publicly available records as of October 2026 and may change with any future reshuffle or election.
        </span>
      </div>

      {/* Interactive Leader Dossier Modal */}
      {activeModalLeader && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setActiveModalLeader(null)}
        >
          <div
            className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeModalLeader.photo_url}
                  alt={activeModalLeader.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {activeModalLeader.type === 'MLA' ? 'SITTING MLA' : 'SITTING MP'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      {activeModalLeader.constituencyLabel}
                    </span>
                  </div>
                  <h3 className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {activeModalLeader.name}
                  </h3>
                  <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    {activeModalLeader.party_name || activeModalLeader.party}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalLeader(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Portfolio pill */}
            {activeModalLeader.portfolio && (
              <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 text-[12px] font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>{activeModalLeader.portfolio}</span>
              </div>
            )}

            {/* Quick Details Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Education</span>
                </div>
                <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                  {activeModalLeader.education || 'Graduate'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Tenure</span>
                </div>
                <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                  {activeModalLeader.terms_summary ? activeModalLeader.terms_summary.split('(')[0].trim() : activeModalLeader.tenure}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
                  <Vote className="w-3.5 h-3.5" />
                  <span>Vote Share</span>
                </div>
                <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                  {activeModalLeader.vote_pct}% ({formatIndianNumber(activeModalLeader.votes)} votes)
                </p>
              </div>
            </div>

            {/* Full Biography */}
            <div className="space-y-1.5">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Full Profile & Legislative Track Record
              </p>
              <p className="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModalLeader.about}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveModalLeader(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
