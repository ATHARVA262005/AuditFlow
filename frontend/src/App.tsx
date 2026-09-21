import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { MetricsOverview } from './components/dashboard/MetricsOverview';
import { ShelfLibraryView } from './components/dashboard/ShelfLibraryView';
import { BooksTableView } from './components/dashboard/BooksTableView';
import { ChaptersTableView } from './components/dashboard/ChaptersTableView';
import { SemanticDiffViewer } from './components/dashboard/SemanticDiffViewer';
import { ValidationTester } from './components/dashboard/ValidationTester';
import { UserManagement } from './components/dashboard/UserManagement';
import { AuditLogView } from './components/dashboard/AuditLogView';
import { apiService } from './services/api';
import { Book, Chapter, Shelf, GlobalStats } from './types/audit';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<GlobalStats>({ totalBooks: 2, totalChapters: 5, totalFeatures: 3, passRate: 80 });
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const b = await apiService.getBooks();
      const c = await apiService.getChapters();
      const s = await apiService.getShelves();
      const st = await apiService.getGlobalStats();

      setBooks(b);
      setChapters(c);
      setShelves(s);
      setStats(st);
    }
    loadData();
  }, []);

  const handleSelectBook = (bookId: string) => {
    setActiveTab('diff');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar onSearchClick={() => setSearchOpen(true)} />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <MetricsOverview stats={stats} />
              <ShelfLibraryView shelves={shelves} books={books} onSelectBook={handleSelectBook} />
            </div>
          )}

          {activeTab === 'library' && (
            <ShelfLibraryView shelves={shelves} books={books} onSelectBook={handleSelectBook} />
          )}

          {activeTab === 'books' && (
            <BooksTableView books={books} onSelectBook={handleSelectBook} />
          )}

          {activeTab === 'chapters' && (
            <ChaptersTableView chapters={chapters} />
          )}

          {activeTab === 'diff' && (
            <SemanticDiffViewer books={books} />
          )}

          {activeTab === 'validation' && (
            <ValidationTester />
          )}

          {activeTab === 'audit' && (
            <AuditLogView />
          )}

          {activeTab === 'rbac' && (
            <UserManagement />
          )}
        </main>
      </div>

      <AuthModal />

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              autoFocus
              placeholder="Search chapters, books, or feature shelves..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            <p className="mt-2 text-right text-[10px] font-mono text-slate-500">Press ESC to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
