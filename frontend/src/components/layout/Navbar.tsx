import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/audit';
import { Shield, Search, UserCheck, Activity, LogIn, LogOut, ChevronDown, User, KeyRound, Sparkles } from 'lucide-react';

export const Navbar: React.FC<{ onSearchClick: () => void }> = ({ onSearchClick }) => {
  const { user, isAuthenticated, openLoginModal, openRegisterModal, switchRolePreset, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roleColors: Record<Role, string> = {
    ADMIN: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    DEVELOPER: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    AUDITOR: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    VIEWER: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  const handleRoleSelect = (role: Role) => {
    switchRolePreset(role);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">AuditFlow</h1>
            <p className="text-[10px] font-mono text-slate-400">Enterprise Versioning & Audit Platform</p>
          </div>
        </div>

        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 sm:inline-flex">
          <Activity className="h-3 w-3 animate-pulse" /> Live Engine Online
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
        >
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <span>Quick Search...</span>
          <kbd className="hidden rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Auth User & Role Dropdown */}
        <div className="relative">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 transition hover:border-slate-700"
              >
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs font-bold text-slate-200">{user?.username}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[10px] font-mono font-bold ${
                      roleColors[user?.role || 'ADMIN']
                    }`}
                  >
                    <UserCheck className="h-2.5 w-2.5" /> {user?.role}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl shadow-black/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-b border-slate-800 px-3 py-2">
                    <p className="text-xs font-bold text-slate-200">{user?.username}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <p className="px-3 text-[10px] font-mono uppercase text-slate-500 mb-1">Switch Preset Role</p>
                    <button
                      onClick={() => handleRoleSelect('ADMIN')}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-rose-400 hover:bg-slate-900 font-mono"
                    >
                      <span>ADMIN</span>
                      {user?.role === 'ADMIN' && <Sparkles className="h-3 w-3 text-rose-400" />}
                    </button>
                    <button
                      onClick={() => handleRoleSelect('DEVELOPER')}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-indigo-400 hover:bg-slate-900 font-mono"
                    >
                      <span>DEVELOPER</span>
                      {user?.role === 'DEVELOPER' && <Sparkles className="h-3 w-3 text-indigo-400" />}
                    </button>
                    <button
                      onClick={() => handleRoleSelect('AUDITOR')}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-emerald-400 hover:bg-slate-900 font-mono"
                    >
                      <span>AUDITOR</span>
                      {user?.role === 'AUDITOR' && <Sparkles className="h-3 w-3 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => handleRoleSelect('VIEWER')}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-900 font-mono"
                    >
                      <span>VIEWER</span>
                      {user?.role === 'VIEWER' && <Sparkles className="h-3 w-3 text-slate-400" />}
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => { setDropdownOpen(false); openLoginModal(); }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-900"
                    >
                      <User className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Switch Account / Modal</span>
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openLoginModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign In
              </button>
              <button
                onClick={openRegisterModal}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
