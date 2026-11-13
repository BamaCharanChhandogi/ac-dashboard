import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  actions,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
      <div className="space-y-1 min-w-0">
        {/* Editorial Page Title */}
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

      {/* Right Side: Only Render Custom Actions if Explicitly Provided */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}
