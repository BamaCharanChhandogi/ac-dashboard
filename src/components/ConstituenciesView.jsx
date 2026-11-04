import React from 'react';
import { formatIndianNumber } from '../utils/formatters';

const CONSTITUENCIES_DATA = [
  {
    slug: 'ac17-sanquelim',
    name: 'AC 17 • Sanquelim',
    mla: 'Dr. Pramod Sawant',
    party: 'BJP',
    margin: '+2.6%',
    voters: 27265,
    booths: 50,
    villages: 9,
    families: 6041,
    status: 'Safe / CM Constituency',
    urbanPct: 31.1,
    ruralPct: 68.9,
  },
  {
    slug: 'ac09-porvorim',
    name: 'AC 09 • Porvorim',
    mla: 'Rohan Khaunte',
    party: 'BJP',
    margin: '+37.4%',
    voters: 23947,
    booths: 39,
    villages: 3,
    families: 5420,
    status: 'Safe / High Margin',
    urbanPct: 65.0,
    ruralPct: 35.0,
  },
  {
    slug: 'ac10-aldona',
    name: 'AC 10 • Aldona',
    mla: 'Carlos Alvares Ferreira',
    party: 'INC',
    margin: '+8.1%',
    voters: 25541,
    booths: 41,
    villages: 10,
    families: 5890,
    status: 'Competitive / Opposition Seat',
    urbanPct: 30.0,
    ruralPct: 70.0,
  },
];

export default function ConstituenciesView({ currentSlug, onSelectAC }) {
  return (
    <div className="px-8 py-7 space-y-6 max-w-[1360px]">
      <div>
        <h2 className="font-serif text-[26px] font-bold text-slate-900 tracking-tight">
          Constituencies Overview • Goa
        </h2>
        <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
          Comparative electoral analysis across assembly segments in North Goa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CONSTITUENCIES_DATA.map((ac) => {
          const isSelected = currentSlug === ac.slug;
          return (
            <div
              key={ac.slug}
              onClick={() => onSelectAC(ac.slug)}
              className={`bg-white rounded-2xl border p-6 shadow-xs cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-100 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  ac.party === 'BJP' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {ac.party}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">{ac.status}</span>
              </div>

              <h3 className="font-serif text-[20px] font-bold text-slate-900 tracking-tight mb-1">
                {ac.name}
              </h3>
              <p className="text-[13px] text-slate-600 font-medium mb-4">
                Sitting MLA: <span className="font-bold text-slate-900">{ac.mla}</span> ({ac.margin})
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-[12px]">
                <div>
                  <p className="text-slate-400 font-semibold text-[10px] uppercase">Active Electors</p>
                  <p className="text-[18px] font-extrabold text-slate-900 tabular-nums">{formatIndianNumber(ac.voters)}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold text-[10px] uppercase">Polling Booths</p>
                  <p className="text-[18px] font-extrabold text-slate-900 tabular-nums">{ac.booths}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold text-[10px] uppercase">Villages / Wards</p>
                  <p className="text-[16px] font-bold text-slate-800 tabular-nums">{ac.villages}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold text-[10px] uppercase">Urban / Rural</p>
                  <p className="text-[14px] font-bold text-slate-800 tabular-nums">{ac.urbanPct}% / {ac.ruralPct}%</p>
                </div>
              </div>

              <button
                className={`w-full mt-5 py-2 rounded-xl text-[12px] font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected ? 'Currently Viewing' : 'Switch to this Constituency'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
