import React from 'react';
import { X, Bookmark, Copy, Trash2, Download } from 'lucide-react';
import { SavedMessage } from '../types';

interface SavedFavoritesModalProps {
  favorites: SavedMessage[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export const SavedFavoritesModal: React.FC<SavedFavoritesModalProps> = ({
  favorites,
  onRemove,
  onClear,
  onClose
}) => {
  const handleExport = () => {
    const text = favorites
      .map((f, i) => `${i + 1}. [${f.tag}] ${f.text}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'icebreaker-favorites.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Saved Openers & Replies</h3>
              <p className="text-xs text-slate-400">{favorites.length} saved messages</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <>
                <button
                  onClick={handleExport}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  title="Export to text file"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={onClear}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-300"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No saved messages yet. Tap the bookmark icon on any opener to save it here!
            </div>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id}
                className="glass-card p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                      {fav.tag}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(fav.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-medium">“{fav.text}”</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigator.clipboard.writeText(fav.text)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemove(fav.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
