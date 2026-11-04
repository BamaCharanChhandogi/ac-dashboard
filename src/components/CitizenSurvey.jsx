import React from 'react';
import { 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ThumbsUp, 
  BarChart, 
  Info,
  ShieldAlert 
} from 'lucide-react';
import { formatIndianNumber, formatPercentage } from '../utils/formatters';

export default function CitizenSurvey({ data }) {
  const survey = data?.survey;
  const meta = data?.meta || {};

  // Graceful Empty State for Aldona (AC10) or missing survey
  if (!survey || survey.has_data === false) {
    return (
      <section id="citizen-survey" className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
          <Clock className="w-7 h-7" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            Survey Pending / Field Operations In Progress
          </span>
          <h3 className="text-xl font-black text-navy-900 tracking-tight">
            IVRS Citizen Sentiment Polling Not Yet Conducted
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {survey?.message || `Interactive voice response (IVRS) sample polling has not yet been deployed for ${meta.ac_name || 'this constituency'} (AC ${meta.ac_no}). Quantitative sentiment tracking will be integrated upon completion of field calling rounds.`}
          </p>
        </div>

        <div className="pt-4 max-w-sm mx-auto flex items-center justify-center gap-3 text-xs text-slate-400 border-t border-slate-100">
          <span>Target Sample: 5,000+ Calls</span>
          <span>•</span>
          <span>Method: Automated IVRS</span>
        </div>
      </section>
    );
  }

  // Active Survey Module for Sanquelim & Porvorim
  const ratings = survey.ratings || {};
  const issues = survey.issues || [];

  return (
    <section id="citizen-survey" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              Citizen Sentiment & Community Grievance Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {formatIndianNumber(survey.total_calls)} real answered campaign IVRS calls mapped to constituency polling booths
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
          <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
          <span>Automated IVRS Survey Engine</span>
        </div>
      </div>

      {/* 3 Call Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Answered Calls
          </div>
          <div className="text-3xl font-black text-navy-900 tabular-nums">
            {formatIndianNumber(survey.total_calls)}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Campaign-wide, all picked-up calls
          </div>
        </div>

        <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Linked to Constituency Booths
          </div>
          <div className="text-3xl font-black text-emerald-900 tabular-nums">
            {formatIndianNumber(survey.linked_calls)}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            {formatPercentage(survey.link_rate_pct)} of total picked-up calls
          </div>
        </div>

        <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
            Average MLA Rating
          </div>
          <div className="text-3xl font-black text-amber-900 tabular-nums">
            {survey.avg_mla_rating ? Number(survey.avg_mla_rating).toFixed(2) : 'N/A'} / 5.0
          </div>
          <div className="text-xs text-amber-700 font-medium mt-1">
            {formatIndianNumber(survey.mla_rated_count)} answered performance ratings
          </div>
        </div>

      </div>

      {/* Ratings Comparison: Govt vs CM vs MLA */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-navy-900 text-sm uppercase tracking-wider">
            Performance Rating Distribution (Govt vs CM vs MLA)
          </h3>
          <span className="text-xs text-slate-600">Non-respondents excluded</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ratings).map(([key, item], idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-navy-900 text-xs">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {item.answered_count} answered
                  </span>
                </div>

                {/* Rating stacked bars */}
                <div className="w-full h-5 bg-slate-200 rounded-md overflow-hidden flex my-3 shadow-inner">
                  {item.categories?.map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                      title={`${cat.label}: ${cat.pct}%`}
                      className="h-full hover:opacity-85 transition-opacity"
                    />
                  ))}
                </div>

                {/* Rating breakdown details */}
                <div className="space-y-1.5 text-xs pt-1">
                  {item.categories?.map((cat, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-slate-700 font-medium">{cat.label}</span>
                      </div>
                      <span className="font-mono font-bold text-navy-900 tabular-nums">
                        {formatPercentage(cat.pct)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Grievances Reported */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-extrabold text-navy-900 text-sm uppercase tracking-wider">
              Top Community Grievances & Priority Issues
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Breakdown among respondents who cited a specific civic or policy issue
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Civic Priorities
          </span>
        </div>

        {issues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {issues.map((iss, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{iss.issue}</span>
                  <span className="font-mono font-bold text-navy-900 tabular-nums">
                    {formatPercentage(iss.pct)} ({iss.count} calls)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 
                        ? 'bg-rose-500' 
                        : idx === 1 
                        ? 'bg-amber-500' 
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(iss.pct * 3, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            No specific community grievances recorded in this survey cycle.
          </div>
        )}
      </div>

    </section>
  );
}
