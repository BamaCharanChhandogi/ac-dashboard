import React, { useMemo } from 'react';
import { formatIndianNumber } from '../utils/formatters';

const SANQUELIM_ASSEMBLY_HISTORY = [
  { year: '2022', party: 'BJP', pct: 48.27, winner: 'Dr. Pramod Sawant', runnerUp: 'Dharmesh Saglani (INC)', margin: '+2.6%' },
  { year: '2017', party: 'BJP', pct: 42.44, winner: 'Dr. Pramod Sawant', runnerUp: 'Dharmesh Saglani (INC)', margin: '+8.5%' },
  { year: '2012', party: 'BJP', pct: 66.10, winner: 'Dr. Pramod Sawant', runnerUp: 'Pratap Gauns (INC)', margin: '+32.1%' },
  { year: '2008*', party: 'INC', pct: 42.78, winner: 'Pratap Gauns', runnerUp: 'BJP', margin: '+4.2%' },
];

const PARLIAMENT_HISTORY = [
  { year: '2024', party: 'BJP', pct: 56.43, winner: 'Shripad Yesso Naik', margin: '+25.44%' },
  { year: '2019', party: 'BJP', pct: 57.12, winner: 'Shripad Yesso Naik', margin: '+23.6%' },
  { year: '2014', party: 'BJP', pct: 58.51, winner: 'Shripad Yesso Naik', margin: '+32.1%' },
  { year: '2009', party: 'BJP', pct: 47.10, winner: 'Shripad Yesso Naik', margin: '+12.4%' },
  { year: '2004', party: 'BJP', pct: 56.84, winner: 'Shripad Yesso Naik', margin: '+15.2%' },
  { year: '1999', party: 'BJP', pct: 54.96, winner: 'Shripad Yesso Naik', margin: '+11.8%' },
];

const SANQUELIM_VOTE_SHARES = [
  {
    type: 'ASSEMBLY ELECTIONS',
    elections: [
      {
        year: '2022 Assembly',
        bars: [
          { name: 'Dr. Pramod Sawant', party: 'BJP', pct: 48.3, color: '#EA580C' },
          { name: 'Dharmesh Saglani', party: 'INC', pct: 45.6, color: '#0284C7' },
          { name: 'Others', party: 'Others', pct: 6.1, color: '#94A3B8' },
        ],
      },
      {
        year: '2017 Assembly',
        bars: [
          { name: 'Dr. Pramod Sawant', party: 'BJP', pct: 43.0, color: '#EA580C' },
          { name: 'Dharmesh Saglani', party: 'INC', pct: 33.9, color: '#0284C7' },
          { name: 'Suresh Amonkar', party: 'GSM', pct: 16.4, color: '#16A34A' },
          { name: 'Others', party: 'Others', pct: 6.7, color: '#94A3B8' },
        ],
      },
      {
        year: '2012 Assembly',
        bars: [
          { name: 'Pramod Sawant', party: 'BJP', pct: 66.0, color: '#EA580C' },
          { name: 'Pratap Gauns', party: 'INC', pct: 34.0, color: '#0284C7' },
        ],
      },
    ],
  },
  {
    type: 'PARLIAMENT (LOK SABHA) ELECTIONS IN CONSTITUENCY BOOTHS',
    elections: [
      {
        year: '2024 Lok Sabha',
        bars: [
          { name: 'Shripad Yesso Naik', party: 'BJP', pct: 80.0, color: '#EA580C' },
          { name: 'Ramakant Khalap', party: 'INC', pct: 15.1, color: '#0284C7' },
          { name: 'Tukaram Bharat Parab', party: 'RGP', pct: 4.0, color: '#7C3AED' },
        ],
      },
      {
        year: '2019 Lok Sabha',
        bars: [
          { name: 'Shripad Yesso Naik', party: 'BJP', pct: 64.9, color: '#EA580C' },
          { name: 'Girish Chodankar', party: 'INC', pct: 33.5, color: '#0284C7' },
          { name: 'Others', party: 'Others', pct: 1.6, color: '#94A3B8' },
        ],
      },
      {
        year: '2014 Lok Sabha',
        bars: [
          { name: 'Shripad Yesso Naik', party: 'BJP', pct: 68.2, color: '#EA580C' },
          { name: 'Ravi Naik', party: 'INC', pct: 26.4, color: '#0284C7' },
          { name: 'Others', party: 'Others', pct: 5.4, color: '#94A3B8' },
        ],
      },
    ],
  },
];

const PARTY_COLORS = {
  BJP: '#EA580C',
  INC: '#0284C7',
  RGP: '#7C3AED',
  GSM: '#16A34A',
  IND: '#10B981',
  AITC: '#0D9488',
  AAP: '#0284C7',
  NOTA: '#64748B',
  Others: '#94A3B8',
};

export default function ElectionResultsView({ data }) {
  const meta = data?.meta || {};
  const leaders = data?.leaders || {};
  const elections = data?.elections || {};
  const mla = leaders.mla;
  const mp = leaders.mp;

  // Assembly historical returns
  const assemblyHistory = useMemo(() => {
    if (meta.slug === 'ac10-aldona' || meta.ac_no === 10) {
      return [
        { year: '2022', party: 'INC', pct: 41.22, winner: 'Adv. Carlos Ferreira', runnerUp: 'Glenn Ticlo (BJP)', margin: '+8.07%' },
        { year: '2017', party: 'BJP', pct: 42.44, winner: 'Glenn Ticlo', runnerUp: 'Amarnath Panjikar (INC)', margin: '+11.1%' },
        { year: '2012', party: 'BJP', pct: 53.60, winner: 'Glenn Ticlo', runnerUp: 'Dayanand Narvekar (INC)', margin: '+16.5%' },
      ];
    }
    if (meta.slug === 'ac09-porvorim' || meta.ac_no === 9) {
      return [
        { year: '2022', party: 'BJP', pct: 55.16, winner: 'Rohan Khaunte', runnerUp: 'Vikas Prabhu (IND)', margin: '+37.44%' },
        { year: '2017', party: 'IND', pct: 47.90, winner: 'Rohan Khaunte', runnerUp: 'Guruprasad Pawaskar (BJP)', margin: '+18.40%' },
        { year: '2012', party: 'IND', pct: 41.20, winner: 'Rohan Khaunte', runnerUp: 'Govind Parvatkar (BJP)', margin: '+4.70%' },
      ];
    }
    return SANQUELIM_ASSEMBLY_HISTORY;
  }, [meta.slug, meta.ac_no]);

  // Candidate vote shares blocks
  const voteShareBlocks = useMemo(() => {
    if (elections?.vote_share_bars) {
      const blocks = [];
      if (elections.vote_share_bars.assembly) {
        blocks.push({
          type: 'ASSEMBLY ELECTIONS',
          elections: elections.vote_share_bars.assembly.map((elec) => ({
            year: elec.election,
            bars: elec.candidates.map((c) => ({
              name: c.name,
              party: c.party,
              pct: c.pct,
              color: PARTY_COLORS[c.party] || '#94A3B8',
            })),
          })),
        });
      }
      if (elections.vote_share_bars.parliament) {
        blocks.push({
          type: `PARLIAMENT (LOK SABHA) ELECTIONS IN ${meta.ac_name ? meta.ac_name.toUpperCase() : 'CONSTITUENCY'} BOOTHS`,
          elections: elections.vote_share_bars.parliament.map((elec) => ({
            year: elec.election,
            bars: elec.candidates.map((c) => ({
              name: c.name,
              party: c.party,
              pct: c.pct,
              color: PARTY_COLORS[c.party] || '#94A3B8',
            })),
          })),
        });
      }
      if (blocks.length > 0) return blocks;
    }
    return SANQUELIM_VOTE_SHARES;
  }, [elections, meta.ac_name]);

  const isIncMla = mla?.party === 'INC';

  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      {/* Title */}
      <div>
        <h2 className="font-serif text-[26px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Current MLA & MP • Election Retrospective
        </h2>
        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Elected leadership dossier, historical state assembly trends, and parliamentary performance across {meta.ac_name || 'Sanquelim'}
        </p>
      </div>

      {/* Sitting MLA & MP Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sitting MLA Card */}
        {mla && (
          <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                SITTING MLA · {meta.ac_name ? meta.ac_name.toUpperCase() : 'SANQUELIM'} AC
              </p>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={mla.photo_url || (isIncMla ? '/images/leaders/carlos-ferreira.jpg' : '/images/leaders/pramod-sawant.jpg')}
                  alt={mla.name}
                  className={`w-16 h-16 rounded-xl object-cover border-2 shadow-xs flex-shrink-0 ${
                    isIncMla ? 'border-sky-500' : 'border-orange-500'
                  }`}
                />
                <div>
                  <h3 className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {mla.name}
                  </h3>
                  <p className={`text-[13px] font-semibold mt-0.5 ${isIncMla ? 'text-sky-700 dark:text-sky-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {mla.party_name || (isIncMla ? 'Indian National Congress (INC)' : 'Bharatiya Janata Party (BJP)')}
                  </p>
                  <p className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {mla.portfolio || (isIncMla ? 'MLA (Former Advocate General of Goa)' : 'Chief Minister of Goa')}
                  </p>
                </div>
              </div>

              {/* Vote share and margin row */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/90 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Vote Share, 2022</p>
                  <p className="text-[22px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums leading-tight mt-0.5">
                    {mla.vote_pct}%
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                    {formatIndianNumber(mla.votes)} votes
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Margin over runner-up</p>
                  <p className="text-[22px] font-extrabold text-teal-700 dark:text-teal-400 tabular-nums leading-tight mt-0.5">
                    +{formatIndianNumber(mla.margin_votes)}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {mla.margin_pct}% · over {mla.runner_up}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sitting MP Card */}
        {mp && (
          <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                SITTING MP · {meta.pc_name ? `${meta.pc_name.toUpperCase()} PC` : 'NORTH GOA PC'}
              </p>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={mp.photo_url || '/images/leaders/shripad-naik.jpg'}
                  alt={mp.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-orange-500 shadow-xs flex-shrink-0"
                />
                <div>
                  <h3 className="font-serif text-[22px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {mp.name}
                  </h3>
                  <p className="text-[13px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
                    {mp.party_name || 'Bharatiya Janata Party (BJP)'}
                  </p>
                  <p className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {mp.portfolio || 'Union Minister of State for Power & New and Renewable Energy'}
                  </p>
                </div>
              </div>

              {/* Vote share and margin row */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/90 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Vote Share, 2024</p>
                  <p className="text-[22px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums leading-tight mt-0.5">
                    {mp.vote_pct}%
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                    {formatIndianNumber(mp.votes)} votes
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Margin over runner-up</p>
                  <p className="text-[22px] font-extrabold text-teal-700 dark:text-teal-400 tabular-nums leading-tight mt-0.5">
                    +{formatIndianNumber(mp.margin_votes)}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {mp.margin_pct}% · over {mp.runner_up}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Vote Share by Election Horizontal Stacked Bars */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
          Candidate Vote Share by Election
        </h3>
        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mb-6">
          AC-wide valid vote share and candidate returns for {meta.ac_name || 'Sanquelim'}. Top candidates by vote share are labelled under each bar.
        </p>

        <div className="space-y-8">
          {voteShareBlocks.map((block, bi) => (
            <div key={bi} className="space-y-4">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {block.type}
              </p>

              <div className="space-y-5">
                {block.elections.map((elec, ei) => (
                  <div key={ei} className="space-y-1.5">
                    <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-[14px]">
                      {elec.year}
                    </p>

                    {/* Stacked Progress Bar */}
                    <div className="h-6 w-full rounded-md overflow-hidden flex bg-slate-100 dark:bg-slate-800 shadow-xs">
                      {elec.bars.map((b, idx) => (
                        <div
                          key={idx}
                          style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                          className="h-full flex items-center justify-center text-[10px] font-bold text-white tabular-nums"
                          title={`${b.name} (${b.party}): ${b.pct}%`}
                        >
                          {b.pct > 12 ? `${b.pct}%` : ''}
                        </div>
                      ))}
                    </div>

                    {/* Candidate Labels */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      {elec.bars.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{b.name}</span>
                          <span className="text-slate-400 dark:text-slate-500">· {b.party} {b.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assembly Across Elections */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
          Assembly — {meta.ac_name || 'Sanquelim'} across elections
        </h3>
        <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium mb-4">
          Winning party's own vote share and victory margin across recent assembly elections in {meta.ac_name || 'Sanquelim'}.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px] text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pr-4">ELECTION</th>
                <th className="pb-3 px-4">WINNING PARTY</th>
                <th className="pb-3 px-4">LEAD CANDIDATE</th>
                <th className="pb-3 px-4 text-right">VOTE SHARE</th>
                <th className="pb-3 pl-4 text-right">VICTORY MARGIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assemblyHistory.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 pr-4 font-bold text-slate-900 dark:text-slate-100">
                    {row.year}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                        row.party === 'BJP'
                          ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300'
                          : row.party === 'INC'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {row.party}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {row.winner}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    {row.pct}%
                  </td>
                  <td className="py-3 pl-4 text-right font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                    {row.margin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parliament Across Elections */}
      <div className="bg-white dark:bg-[#111C35] rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs">
        <h3 className="font-serif text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-1">
          Parliament — North Goa across elections
        </h3>
        <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium mb-4">
          {meta.ac_name || 'Sanquelim'} sits inside the North Goa Lok Sabha constituency (1999–2024 results).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PARLIAMENT_HISTORY.map((item) => (
            <div key={item.year} className="bg-slate-50 dark:bg-slate-900/90 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">{item.year}</p>
              <p className="text-[18px] font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mt-1 leading-none">{item.pct}%</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 mt-2">
                {item.party}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
