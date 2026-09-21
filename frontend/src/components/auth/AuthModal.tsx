import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/audit';
import { Shield, Lock, Mail, User, KeyRound, X, AlertCircle, Zap, UserCheck, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    login,
    register,
    switchRolePreset,
  } = useAuth();

  const [tab, setTab] = useState<'login' | 'register' | 'preset'>(authModalMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('DEVELOPER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        if (!username || !password) {
          throw new Error('Please enter both username and password.');
        }
        await login({ username, password });
      } else if (tab === 'register') {
        if (!username || !email || !password) {
          throw new Error('Please fill out all required fields.');
        }
        await register({ username, email, password, role });
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = async (targetRole: Role) => {
    setLoading(true);
    setError(null);
    try {
      await switchRolePreset(targetRole);
    } catch (err: any) {
      setError('Failed to switch role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-indigo-950/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">AuditFlow Authentication</h2>
              <p className="text-xs text-slate-400">JWT Token Security & Role-Based Access Control</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="my-4 flex rounded-xl border border-slate-800 bg-slate-900/60 p-1 font-mono text-xs">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 rounded-lg py-2 font-semibold transition ${
              tab === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 rounded-lg py-2 font-semibold transition ${
              tab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('preset'); setError(null); }}
            className={`flex-1 rounded-lg py-2 font-semibold transition flex items-center justify-center gap-1 ${
              tab === 'preset' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3 w-3 text-amber-400 fill-amber-400" /> Presets
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Content: Login & Register */}
        {(tab === 'login' || tab === 'register') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter username (e.g. admin, developer)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {tab === 'register' && (
              <>
                <div>
                  <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="user@auditflow.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    Assign System Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-xs text-indigo-400 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="ADMIN">ADMIN — Full system access & RBAC controls</option>
                    <option value="DEVELOPER">DEVELOPER — Workflow & Validation testing</option>
                    <option value="AUDITOR">AUDITOR — Compliance inspection & Diff viewer</option>
                    <option value="VIEWER">VIEWER — Read-only observation</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-xs text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{tab === 'login' ? 'Authenticate & Issue JWT' : 'Create Account & Login'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab Content: Presets */}
        {tab === 'preset' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-2">
              Select a pre-seeded account profile to test real-time Role-Based Access Control:
            </p>

            <button
              onClick={() => handlePresetSelect('ADMIN')}
              disabled={loading}
              className="w-full flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-left transition hover:bg-rose-950/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs">
                  A
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Admin Account</h4>
                  <p className="text-[10px] text-slate-400 font-mono">admin / admin123 (Full RBAC + Management)</p>
                </div>
              </div>
              <UserCheck className="h-4 w-4 text-rose-400" />
            </button>

            <button
              onClick={() => handlePresetSelect('DEVELOPER')}
              disabled={loading}
              className="w-full flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3 text-left transition hover:bg-indigo-950/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs">
                  D
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Developer Account</h4>
                  <p className="text-[10px] text-slate-400 font-mono">developer / dev123 (API Keys & Validation)</p>
                </div>
              </div>
              <UserCheck className="h-4 w-4 text-indigo-400" />
            </button>

            <button
              onClick={() => handlePresetSelect('AUDITOR')}
              disabled={loading}
              className="w-full flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-left transition hover:bg-emerald-950/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                  AU
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Auditor Account</h4>
                  <p className="text-[10px] text-slate-400 font-mono">auditor / audit123 (Diffs & Audit Logs)</p>
                </div>
              </div>
              <UserCheck className="h-4 w-4 text-emerald-400" />
            </button>

            <button
              onClick={() => handlePresetSelect('VIEWER')}
              disabled={loading}
              className="w-full flex items-center justify-between rounded-xl border border-slate-500/30 bg-slate-900/40 p-3 text-left transition hover:bg-slate-900/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500/20 text-slate-400 font-bold text-xs">
                  V
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Viewer Account</h4>
                  <p className="text-[10px] text-slate-400 font-mono">viewer / viewer123 (Read-Only access)</p>
                </div>
              </div>
              <UserCheck className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
