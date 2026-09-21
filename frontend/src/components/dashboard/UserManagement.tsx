import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/audit';
import { KeyRound, Shield, UserCheck, Plus, Trash2, AlertCircle, Sparkles, Lock } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { user, switchRolePreset } = useAuth();
  const currentRole = user?.role || 'ADMIN';

  const isAllowedToCreateKey = currentRole === 'ADMIN' || currentRole === 'DEVELOPER';
  const isAllowedToManageRoles = currentRole === 'ADMIN';

  const [keys, setKeys] = useState([
    { id: 1, name: 'Staging Pipeline Key', prefix: 'af_live_a1b2c3', role: 'DEVELOPER' as Role, active: true, createdAt: new Date().toLocaleDateString() },
    { id: 2, name: 'Production Auditor Key', prefix: 'af_live_x9y8z7', role: 'AUDITOR' as Role, active: true, createdAt: new Date().toLocaleDateString() },
  ]);

  const [users, setUsers] = useState([
    { id: 1, username: 'admin', email: 'admin@auditflow.io', role: 'ADMIN' as Role },
    { id: 2, username: 'developer', email: 'developer@auditflow.io', role: 'DEVELOPER' as Role },
    { id: 3, username: 'auditor', email: 'auditor@auditflow.io', role: 'AUDITOR' as Role },
  ]);

  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRole, setNewKeyRole] = useState<Role>('DEVELOPER');
  const [generatedRawKey, setGeneratedRawKey] = useState<string | null>(null);

  const handleCreateKey = () => {
    if (!newKeyName || !isAllowedToCreateKey) return;
    const rawKey = `af_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newEntry = {
      id: Date.now(),
      name: newKeyName,
      prefix: rawKey.substring(0, 12),
      role: newKeyRole,
      active: true,
      createdAt: new Date().toLocaleDateString(),
    };
    setKeys([newEntry, ...keys]);
    setGeneratedRawKey(rawKey);
    setNewKeyName('');
  };

  const handleRevokeKey = (id: number) => {
    if (!isAllowedToCreateKey) return;
    setKeys(keys.filter((k) => k.id !== id));
  };

  const handleUserRoleChange = (userId: number, newRole: Role) => {
    if (!isAllowedToManageRoles) return;
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">RBAC & API Key Management</h2>
          <p className="text-xs text-slate-400">Manage 4-tier Role-Based Access Control (Admin, Developer, Auditor, Viewer) and project API keys</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
          <UserCheck className="h-4 w-4 text-indigo-400" />
          <span>Active Role: <strong className="text-indigo-400 font-mono">{currentRole}</strong></span>
        </div>
      </div>

      {!isAllowedToCreateKey && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Your current role (<strong>{currentRole}</strong>) has read-only access. Switch to <strong>ADMIN</strong> or <strong>DEVELOPER</strong> to generate API keys.
            </span>
          </div>
          <button
            onClick={() => switchRolePreset('ADMIN')}
            className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1 font-bold text-black hover:bg-amber-500 transition"
          >
            <Sparkles className="h-3 w-3" /> Elevate to Admin
          </button>
        </div>
      )}

      {/* API Key Generation */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <KeyRound className="h-4 w-4 text-indigo-400" />
          <h3 className="font-bold text-slate-200 text-sm">Create New Ingestion API Key</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            disabled={!isAllowedToCreateKey}
            placeholder="Key Description (e.g. Staging-Agent)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="flex-1 rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-sans text-xs text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
          />

          <select
            disabled={!isAllowedToCreateKey}
            value={newKeyRole}
            onChange={(e) => setNewKeyRole(e.target.value as Role)}
            className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-indigo-400 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="DEVELOPER">DEVELOPER</option>
            <option value="AUDITOR">AUDITOR</option>
            <option value="VIEWER">VIEWER</option>
          </select>

          <button
            onClick={handleCreateKey}
            disabled={!isAllowedToCreateKey || !newKeyName}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {isAllowedToCreateKey ? <Plus className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />} Generate Key
          </button>
        </div>

        {generatedRawKey && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 font-mono text-xs text-emerald-300">
            <span className="font-bold text-white block mb-1">Generated Secret API Key (Copy Now - Won't Be Shown Again):</span>
            <span className="bg-slate-950 p-2 rounded block border border-slate-800 text-indigo-300 select-all">{generatedRawKey}</span>
          </div>
        )}

        {/* Existing Keys Table */}
        <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Key Prefix</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Created</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {keys.map((k) => (
                <tr key={k.id}>
                  <td className="px-4 py-3 font-sans font-medium text-slate-200">{k.name}</td>
                  <td className="px-4 py-3 text-indigo-400">{k.prefix}...</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      {k.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{k.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      disabled={!isAllowedToCreateKey}
                      className="text-rose-400 hover:text-rose-300 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC User Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <UserCheck className="h-4 w-4 text-indigo-400" />
          <h3 className="font-bold text-slate-200 text-sm">Active User Role Assignments</h3>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Username</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Role Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-sans font-medium text-slate-100">{u.username}</td>
                  <td className="px-4 py-3 text-slate-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      disabled={!isAllowedToManageRoles}
                      value={u.role}
                      onChange={(e) => handleUserRoleChange(u.id, e.target.value as Role)}
                      className="rounded bg-slate-900 border border-slate-800 px-2 py-1 text-xs text-indigo-400 font-mono disabled:opacity-50"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="DEVELOPER">DEVELOPER</option>
                      <option value="AUDITOR">AUDITOR</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
