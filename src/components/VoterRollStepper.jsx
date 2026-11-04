import React from 'react';
import { Check, Circle, ArrowRight, Info } from 'lucide-react';

export default function VoterRollStepper({ data }) {
  const stages = data?.roll_progression || [];
  const meta = data?.meta || {};

  // Standard 5-stage progression matching PolIntel
  const displayStages = [
    { name: 'Draft Roll', date: 'Dec 2025', completed: true },
    { name: 'Claims & Objections', date: 'Jan 2026', completed: true },
    { name: 'Final Roll', date: '30 Jan 2026', completed: true },
    { name: 'Revision', date: 'Apr 2026', completed: false },
    { name: 'Supplementary', date: 'Jul 2026', completed: false },
  ];

  const totalVoters = meta.total_voters || 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-[14px] font-semibold text-slate-900">Voter Roll Status (2026)</h3>
        <Info size={14} className="text-slate-400 cursor-pointer" />
      </div>

      {/* Stepper track */}
      <div className="flex items-center px-2 my-2">
        {displayStages.map((stage, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all
                  ${stage.completed
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-300 text-slate-300'
                  }
                `}
              >
                {stage.completed ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  <Circle size={6} className="fill-slate-300 text-slate-300" />
                )}
              </div>
              <p className={`text-[10.5px] mt-2 font-semibold text-center leading-tight ${stage.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                {stage.name}
              </p>
              <p className="text-[9.5px] text-slate-400 text-center font-medium mt-0.5">
                ({stage.date})
              </p>
            </div>

            {idx < displayStages.length - 1 && (
              <div
                className={`h-0.5 flex-1 -mt-7 mx-1 ${
                  displayStages[idx + 1].completed ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Footer Info & Link */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] mt-2">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Info size={13} className="text-blue-600 flex-shrink-0" />
          <span>Final electoral roll published for {totalVoters.toLocaleString('en-IN')} electors.</span>
        </div>
        <button className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 transition-colors flex-shrink-0">
          View Details <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
