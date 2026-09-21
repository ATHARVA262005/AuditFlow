import React from 'react';
import { Book } from '../../types/audit';
import { BookOpen, Download, FileText, GitBranch } from 'lucide-react';

interface BooksTableViewProps {
  books: Book[];
  onSelectBook: (bookId: string) => void;
}

export const BooksTableView: React.FC<BooksTableViewProps> = ({ books, onSelectBook }) => {
  const handleExport = (bookId: string, format: 'json' | 'markdown') => {
    window.open(`/api/v1/export/book/${bookId}?format=${format}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Workflow Books</h2>
          <p className="text-xs text-slate-400">Bundled execution sequences preserving workflow lineage</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm backdrop-blur">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/80 uppercase tracking-wider text-slate-400 font-mono text-[11px]">
            <tr>
              <th className="px-4 py-3">Book ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Feature Shelf</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Lineage</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {books.map((book) => {
              const chaptersCount = JSON.parse(book.chapterIdsJson || '[]').length;

              return (
                <tr key={book.id} className="transition hover:bg-slate-800/40">
                  <td className="px-4 py-3.5 font-bold text-indigo-400">{book.id}</td>
                  <td className="px-4 py-3.5 font-sans font-medium text-slate-100">
                    <button onClick={() => onSelectBook(book.id)} className="hover:text-indigo-400 hover:underline">
                      {book.title}
                    </button>
                    <span className="ml-2 text-[10px] text-slate-500 font-mono">({chaptersCount} ch)</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">{book.feature}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 font-bold text-indigo-400 border border-indigo-500/20">
                      v{book.version}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {book.parentBookId ? (
                      <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <GitBranch className="h-3 w-3 text-slate-500" /> {book.parentBookId}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px]">Root (v1)</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                    {new Date(book.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2 font-sans">
                    <button
                      onClick={() => handleExport(book.id, 'markdown')}
                      className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      <FileText className="h-3 w-3" /> MD
                    </button>
                    <button
                      onClick={() => handleExport(book.id, 'json')}
                      className="inline-flex items-center gap-1 rounded bg-indigo-600/20 border border-indigo-500/30 px-2 py-1 text-[11px] font-medium text-indigo-300 hover:bg-indigo-600/40 transition"
                    >
                      <Download className="h-3 w-3" /> JSON
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
