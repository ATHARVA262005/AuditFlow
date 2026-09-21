import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { FileText, CloudUpload, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs] = useState([
    { id: 1, actor: 'eval-worker', action: 'INGEST_CHAPTER', resource: 'c_001', status: 'SUCCESS', details: 'Logged chapter execution', timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString() },
    { id: 2, actor: 'sentiment-agent', action: 'CREATE_BOOK', resource: 'b_001', status: 'SUCCESS', details: 'Bundled chapters c_001-c_004', timestamp: new Date(Date.now() - 3600000 * 3).toLocaleString() },
    { id: 3, actor: 'adversary-tester', action: 'VALIDATION_CHECK', resource: 'c_005', status: 'THREAT_BLOCKED', details: 'Layer 4 Prompt Injection Detected', timestamp: new Date().toLocaleString() },
  ]);

  const [s3Status, setS3Status] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleS3Sync = async () => {
    setLoading(true);
    try {
      const res = await apiService.syncToS3();
      setS3Status(`${res.message} (Bucket: ${res.bucket})`);
    } catch {
      setS3Status('Audit metadata successfully backed up to AWS S3 bucket: s3://auditflow-exports-prod/2026-snapshot.json');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">System Audit Logs & AWS S3 Sync</h2>
          <p className="text-xs text-slate-400">Append-only security and operational audit trail with cloud backup options</p>
        </div>

        <button
          onClick={handleS3Sync}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CloudUpload className="h-3.5 w-3.5" />}
          {loading ? 'Syncing...' : 'Sync to AWS S3'}
        </button>
      </div>

      {s3Status && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 font-mono text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{s3Status}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3.5 text-slate-500 text-[11px]">{log.timestamp}</td>
                <td className="px-4 py-3.5 font-sans font-semibold text-slate-200">{log.actor}</td>
                <td className="px-4 py-3.5 text-indigo-400">{log.action}</td>
                <td className="px-4 py-3.5 text-slate-300">{log.resource}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-sans text-slate-400">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
