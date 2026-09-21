import React, { useState } from 'react';
import { Chapter } from '../../types/audit';
import { ChapterDetailDrawer } from './ChapterDetailDrawer';
import { ShieldCheck, ShieldAlert, Cpu, Search, Terminal } from 'lucide-react';

export const ChaptersTableView: React.FC<{ chapters: Chapter[] }> = ({ chapters }) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChapters = chapters.filter(
    (c) =>
      c.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Immutable Execution Chapters</h2>
          <p className="text-xs text-slate-400">Atomic AI workflow steps with full generation telemetry & validation audit logs</p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter chapters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm backdrop-blur">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/80 uppercase tracking-wider text-slate-400 font-mono text-[11px]">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Actor / Source</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Validation Gate</th>
              <th className="px-4 py-3">Prompt Preview</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredChapters.map((ch) => (
              <tr
                key={ch.id}
                onClick={() => setSelectedChapter(ch)}
                className="cursor-pointer transition hover:bg-slate-800/40"
              >
                <td className="px-4 py-3.5 font-mono font-bold text-indigo-400">{ch.id}</td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">{ch.actor}</span>
                    <span className="font-mono text-[10px] text-slate-500">{ch.source}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-400">
                  <span className="inline-flex items-center gap-1 text-[11px] text-indigo-300">
                    <Cpu className="h-3 w-3 text-indigo-500" /> {ch.model || 'default'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {ch.validationStatus === 'PASSED' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3" /> PASSED
                    </span>
                  )}
                  {ch.validationStatus === 'FAILED' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                      <ShieldAlert className="h-3 w-3" /> FAILED
                    </span>
                  )}
                  {ch.validationStatus === 'THREAT_DETECTED' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30 animate-pulse">
                      <ShieldAlert className="h-3 w-3" /> THREAT DETECTED
                    </span>
                  )}
                  {(!ch.validationStatus || ch.validationStatus === 'SKIPPED') && (
                    <span className="text-[10px] font-mono text-slate-500">UNVALIDATED</span>
                  )}
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-300">
                  <span className="truncate max-w-xs block text-[11px]">{ch.prompt}</span>
                </td>
                <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                  {new Date(ch.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedChapter && (
        <ChapterDetailDrawer chapter={selectedChapter} onClose={() => setSelectedChapter(null)} />
      )}
    </div>
  );
};
