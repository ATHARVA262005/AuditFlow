import React from 'react';
import { Shelf, Book } from '../../types/audit';
import { Layers, GitBranch, Calendar, BookOpen } from 'lucide-react';

interface ShelfLibraryViewProps {
  shelves: Shelf[];
  books: Book[];
  onSelectBook: (bookId: string) => void;
}

export const ShelfLibraryView: React.FC<ShelfLibraryViewProps> = ({ shelves, books, onSelectBook }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Feature Shelves & Lineage Library</h2>
        <p className="text-xs text-slate-400">Workflow books organized chronologically by feature domain</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shelves.map((shelf) => {
          const featureBooks = books.filter((b) => b.feature === shelf.feature);

          return (
            <div key={shelf.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-bold text-slate-200">{shelf.feature}</h3>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  {shelf.bookCount} Books
                </span>
              </div>

              <div className="space-y-3">
                {featureBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book.id)}
                    className="group cursor-pointer rounded-lg border border-slate-800/80 bg-slate-950/60 p-3.5 transition hover:border-indigo-500/50 hover:bg-slate-800/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">{book.id}</span>
                        <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white">{book.title}</h4>
                      </div>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-300">
                        v{book.version}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <BookOpen className="h-3 w-3 text-slate-400" />
                        {JSON.parse(book.chapterIdsJson || '[]').length} chapters
                      </span>
                      {book.parentBookId && (
                        <span className="flex items-center gap-1 text-slate-400 font-mono">
                          <GitBranch className="h-3 w-3" /> edits {book.parentBookId}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(book.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
