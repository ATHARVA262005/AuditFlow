import React, { useState, useEffect } from 'react';
import { DiffResult, Book } from '../../types/audit';
import { apiService } from '../../services/api';
import { ChevronRight, Cpu, Thermometer, Hash, CheckCircle2, AlertCircle, GitCompare } from 'lucide-react';

export const SemanticDiffViewer: React.FC<{ books: Book[] }> = ({ books }) => {
  const [bookIdA, setBookIdA] = useState<string>(books[0]?.id || 'b_001');
  const [bookIdB, setBookIdB] = useState<string>(books[1]?.id || 'b_002');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (bookIdA && bookIdB) {
      setLoading(true);
      apiService.getDiff(bookIdA, bookIdB).then((res) => {
        setDiffResult(res);
        setLoading(false);
      });
    }
  }, [bookIdA, bookIdB]);

  const renderDiffLines = (lines: string[]) => {
    const cleanLines = lines.filter((line) => !line.startsWith('?'));

    return cleanLines.map((line, idx) => {
      const type = line.slice(0, 2);
      const text = line.slice(2);

      if (type === '+ ') {
        return (
          <div key={idx} className="flex border-l-2 border-emerald-500 bg-emerald-950/20 px-2 py-0.5 font-mono text-xs text-emerald-300">
            <span className="mr-3 select-none text-emerald-600">+</span>
            <span className="whitespace-pre-wrap">{text || ' '}</span>
          </div>
        );
      }
      if (type === '- ') {
        return (
          <div key={idx} className="flex border-l-2 border-rose-500 bg-rose-950/20 px-2 py-0.5 font-mono text-xs text-rose-300">
            <span className="mr-3 select-none text-rose-600">-</span>
            <span className="whitespace-pre-wrap">{text || ' '}</span>
          </div>
        );
      }
      return (
        <div key={idx} className="flex px-2 py-0.5 font-mono text-xs text-slate-400">
          <span className="mr-3 select-none text-slate-700">&nbsp;</span>
          <span className="whitespace-pre-wrap">{text || ' '}</span>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Semantic Edition Diff Engine</h2>
          <p className="text-xs text-slate-400">Side-by-side prompt and output comparison across workflow versions</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={bookIdA}
            onChange={(e) => setBookIdA(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-indigo-400"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} ({b.title} v{b.version})
              </option>
            ))}
          </select>

          <GitCompare className="h-4 w-4 text-slate-500" />

          <select
            value={bookIdB}
            onChange={(e) => setBookIdB(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-indigo-400"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} ({b.title} v{b.version})
              </option>
            ))}
          </select>
        </div>
      </div>

      {diffResult && (
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-indigo-400">
            Kept: {diffResult.kept.length}
          </span>
          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-emerald-400">
            + Added: {diffResult.added.length}
          </span>
          <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-rose-400">
            - Removed: {diffResult.removed.length}
          </span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Computing edition diff...</div>
      ) : (
        <div className="space-y-6">
          {diffResult?.stepComparisons.map((step) => (
            <div key={step.stepNumber} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400 border border-indigo-500/30">
                    {step.stepNumber}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-200">
                    Step {step.stepNumber}: <span className="font-mono text-slate-400">{step.chapterA?.id}</span>
                    <ChevronRight className="inline mx-1 h-3.5 w-3.5 text-slate-600" />
                    <span className="font-mono text-indigo-400">{step.chapterB?.id}</span>
                  </h4>
                </div>

                <div>
                  {step.areIdentical ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> IDENTICAL
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                      <AlertCircle className="h-3 w-3" /> MODIFIED
                    </span>
                  )}
                </div>
              </div>

              {!step.areIdentical ? (
                <div className="grid grid-cols-1 divide-y divide-slate-800 lg:grid-cols-2 lg:divide-x lg:divide-y-0 p-4 gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Prompt Delta</span>
                    <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3">
                      {renderDiffLines(step.promptDiff)}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Output Delta</span>
                    <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3">
                      {renderDiffLines(step.resultDiff)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 italic">
                  Prompt and execution outputs are identical.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
