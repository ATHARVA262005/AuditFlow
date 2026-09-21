import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { ValidationResult } from '../../types/audit';
import { ShieldCheck, ShieldAlert, Play, CheckCircle, AlertTriangle } from 'lucide-react';

export const ValidationTester: React.FC = () => {
  const [prompt, setPrompt] = useState('Summarize user feedback for Q1 report');
  const [resultText, setResultText] = useState('{\n  "status": "success",\n  "summary": "Feedback is 80% positive. Contact support@auditflow.ai for details."\n}');
  const [regexPattern, setRegexPattern] = useState('^\\{\\s*"status"');
  const [keywords, setKeywords] = useState('positive, support');
  const [jsonFormat, setJsonFormat] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunValidation = async () => {
    setLoading(true);
    const kwList = keywords ? keywords.split(',').map((k) => k.trim()) : [];
    const res = await apiService.validateTest({
      prompt,
      result: resultText,
      regexPattern,
      requiredKeywords: kwList,
      jsonFormat,
    });
    setValidationResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">4-Layer Validation Gate Harness</h2>
        <p className="text-xs text-slate-400">Test AI workflow inputs against Schema (L1), ReDoS Regex (L2), PII (L3), and Prompt Injection (L4) gates</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Test Inputs */}
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Prompt Input (Evaluates L3 PII & L4 Security)
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Model Completion Output (Evaluates L1 Schema & L2 Regex)
            </label>
            <textarea
              rows={4}
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                L2 ReDoS Regex Pattern
              </label>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                L1 Required Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <input
                type="checkbox"
                checked={jsonFormat}
                onChange={(e) => setJsonFormat(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              Enforce Strict Layer 1 JSON Structure Check
            </label>

            <button
              onClick={handleRunValidation}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" /> {loading ? 'Evaluating...' : 'Run 4-Layer Scan'}
            </button>
          </div>
        </div>

        {/* Evaluation Output */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Gate Evaluation Diagnostic Report</h3>

            {validationResult ? (
              <div className="space-y-4">
                <div className={`rounded-xl border p-4 ${
                  validationResult.passed ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-rose-500/30 bg-rose-950/20'
                }`}>
                  <div className="flex items-center gap-2">
                    {validationResult.passed ? (
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-rose-400" />
                    )}
                    <span className="font-bold text-sm text-slate-100">
                      Overall Status: {validationResult.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300">{validationResult.message}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Layer Audit Trace</span>
                  {validationResult.layerResults.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded bg-slate-950 p-2.5 font-mono text-xs text-slate-300 border border-slate-800">
                      <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-xs text-slate-500">
                <AlertTriangle className="h-8 w-8 text-slate-700 mb-2" />
                Click "Run 4-Layer Scan" to evaluate prompt & output parameters against validation gates.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
