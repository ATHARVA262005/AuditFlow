import React from 'react';
import { LayoutDashboard, BookOpen, Layers, GitCompare, ShieldCheck, FileText, KeyRound, Terminal } from 'lucide-react';

export type TabType = 'overview' | 'library' | 'books' | 'chapters' | 'diff' | 'validation' | 'audit' | 'rbac';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'library', label: 'Feature Shelves', icon: <Layers className="h-4 w-4" /> },
    { id: 'books', label: 'Workflow Books', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'chapters', label: 'Immutable Chapters', icon: <Terminal className="h-4 w-4" /> },
    { id: 'diff', label: 'Semantic Diff', icon: <GitCompare className="h-4 w-4" />, badge: 'v1 ➔ v2' },
    { id: 'validation', label: '4-Layer Validation', icon: <ShieldCheck className="h-4 w-4" />, badge: 'Gates' },
    { id: 'audit', label: 'System Audit Logs', icon: <FileText className="h-4 w-4" /> },
    { id: 'rbac', label: 'RBAC & API Keys', icon: <KeyRound className="h-4 w-4" /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800/80 bg-slate-950/60 p-4">
      <div className="mb-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Platform Navigation
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-semibold ${
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
