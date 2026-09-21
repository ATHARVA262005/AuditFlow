import React, { useState } from 'react';
import { Chapter } from '../../types/audit';
import { X, Copy, Check, ShieldCheck, ShieldAlert, Cpu, Thermometer, Hash, User, Terminal } from 'lucide-react';

interface ChapterDetailDrawerProps {
  chapter: Chapter | null;
  onClose: () => void;
}

export const ChapterDetailDrawer: React.FC<ChapterDetailDrawerProps> = ({ chapter, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<'prompt' | 'result' | null>(null);

  if (!chapter) return null;

  const handleCopy = (text: string, section: 'prompt' | 'result') => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl border-l border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-indigo-400">Chapter</span>
                <h3 className="text-lg font-bold">{chapter.id}</h3>
              </div>
              <p className="mt-1 text-xs text-slate-400">Logged on {new Date(chapter.timestamp).toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Actor</span>
                <p className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-200">
                  <User className="h-3 w-3 text-slate-400" /> {chapter.actor}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Source</span>
                <p className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-200">
                  <Terminal className="h-3 w-3 text-slate-400" /> {chapter.source}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Model</span>
                <p className="mt-1 flex items-center gap-1 font-mono text-xs text-indigo-300">
                  <Cpu className="h-3 w-3 text-indigo-400" /> {chapter.model || '—'}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Temp / Seed</span>
                <p className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-200">
                  <Thermometer className="h-3 w-3 text-slate-400" /> {chapter.temperature ?? '—'} / <Hash className="h-3 w-3 text-slate-400" /> {chapter.seed ?? '—'}
                </p>
              </div>
            </div>

            {chapter.validationStatus && (
              <div className={`rounded-xl border p-4 ${
                chapter.validationStatus === 'PASSED' ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-rose-500/30 bg-rose-950/20'
              }`}>
                <div className="flex items-center gap-2">
                  {chapter.validationStatus === 'PASSED' ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                  )}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Validation Gate: {chapter.validationStatus}
                  </h4>
                </div>
                <p className="mt-1 text-xs text-slate-300">{chapter.validationMessage}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prompt / Input Instruction</span>
                <button onClick={() => handleCopy(chapter.prompt, 'prompt')} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
                  {copiedSection === 'prompt' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedSection === 'prompt' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap border-l-4 border-l-indigo-500">
                {chapter.prompt}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Execution Result / Output</span>
                <button onClick={() => handleCopy(chapter.result, 'result')} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
                  {copiedSection === 'result' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedSection === 'result' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap border-l-4 border-l-slate-700">
                {chapter.result}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
