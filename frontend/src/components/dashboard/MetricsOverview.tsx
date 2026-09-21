import React from 'react';
import { GlobalStats } from '../../types/audit';
import { BookOpen, Layers, ShieldCheck, Zap } from 'lucide-react';

export const MetricsOverview: React.FC<{ stats: GlobalStats }> = ({ stats }) => {
  const isHealthy = stats.passRate >= 80;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Books */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur transition hover:border-indigo-500/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Books</span>
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
            <BookOpen className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-100">{stats.totalBooks}</p>
        <p className="mt-1 text-xs text-slate-500">Versioned workflow runs</p>
      </div>

      {/* Total Chapters */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur transition hover:border-indigo-500/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Chapters</span>
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-100">{stats.totalChapters}</p>
        <p className="mt-1 text-xs text-slate-500">Immutable execution steps</p>
      </div>

      {/* Active Shelves */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur transition hover:border-indigo-500/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Shelves</span>
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
            <Layers className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-100">{stats.totalFeatures}</p>
        <p className="mt-1 text-xs text-slate-500">Feature workflow domains</p>
      </div>

      {/* Validation Pass Rate */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur transition hover:border-indigo-500/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gate Pass Rate</span>
          <div className={`rounded-lg p-2 ${isHealthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-bold tracking-tight ${isHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
            {stats.passRate}%
          </span>
          <span className="text-xs text-slate-400">validated</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ width: `${Math.min(100, Math.max(0, stats.passRate))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
