import React, { useState } from 'react';
import { 
  Search, 
  X, 
  ListOrdered, 
  ArrowUpRight, 
  CheckCircle2 
} from 'lucide-react';
import { Chapter } from './ebook-types';
import { PANDUAN_CHAPTERS } from './ebook-data';
import { Modal } from '../../components/ui/Modal';

interface ModalTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  activeMainTab: 'buku' | 'rumus' | 'glosarium' | 'faq' | 'regulasi';
  isCoverMode: boolean;
  activeChapterId: string;
  completedChapters: string[];
  onSelectCoverMode: () => void;
  onSelectMainTab: (tab: 'buku' | 'rumus' | 'glosarium' | 'faq' | 'regulasi') => void;
  onSelectChapter: (chapterId: string) => void;
}

export function ModalTableOfContents({
  isOpen,
  onClose,
  activeMainTab,
  isCoverMode,
  activeChapterId,
  completedChapters,
  onSelectCoverMode,
  onSelectMainTab,
  onSelectChapter,
}: ModalTableOfContentsProps) {
  const [isTocHeaderSearchOpen, setIsTocHeaderSearchOpen] = useState(false);
  const [tocSearch, setTocSearch] = useState('');

  const handleClose = () => {
    setIsTocHeaderSearchOpen(false);
    setTocSearch('');
    onClose();
  };

  // Filter TOC Chapters
  const filteredTocChapters = React.useMemo(() => {
    if (!tocSearch.trim()) return PANDUAN_CHAPTERS;
    const q = tocSearch.toLowerCase();
    return PANDUAN_CHAPTERS.filter(ch => 
      ch.title.toLowerCase().includes(q) ||
      ch.subtitle.toLowerCase().includes(q) ||
      ch.subsections.some(sub => sub.title.toLowerCase().includes(q))
    );
  }, [tocSearch]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      contentClassName="sm:max-w-md"
    >
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 shrink-0">
        {isTocHeaderSearchOpen ? (
          <div className="flex items-center gap-2.5 w-full">
            {/* Icon X di paling kiri untuk close searchbar mode */}
            <button
              type="button"
              onClick={() => {
                setIsTocHeaderSearchOpen(false);
                setTocSearch('');
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
              title="Tutup Pencarian"
              aria-label="Tutup Pencarian"
            >
              <X className="w-4 h-4 text-slate-700" />
            </button>

            {/* Frameless Input (tanpa card/border) */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={tocSearch}
                onChange={(e) => setTocSearch(e.target.value)}
                placeholder="Ketik kata kunci bab atau topik..."
                autoFocus
                className="w-full bg-transparent border-none outline-hidden focus:outline-hidden focus:ring-0 text-slate-900 font-medium text-xs sm:text-sm placeholder:text-slate-400"
              />
            </div>

            {/* Clear text button if search has value */}
            {tocSearch && (
              <button
                type="button"
                onClick={() => setTocSearch('')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-1 shrink-0 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <ListOrdered className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  Daftar Isi &amp; Modul EBook
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Pilih modul, rumus, glosarium, FAQ, atau bab operasional
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setIsTocHeaderSearchOpen(true)}
                className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-all"
                title="Cari dalam Daftar Isi"
                aria-label="Cari dalam Daftar Isi"
              >
                <Search className="w-4 h-4 text-blue-600" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs max-h-[70vh]">
        {/* Module Selector Navigation inside Daftar Isi Modal */}
        <div className="space-y-2 pb-3 border-b border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pilih Modul / Halaman EBook
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onSelectCoverMode();
                handleClose();
              }}
              className={`p-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isCoverMode
                  ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-500/20 font-bold text-blue-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold truncate">Cover E-Book</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectMainTab('buku');
                handleClose();
              }}
              className={`p-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                activeMainTab === 'buku' && !isCoverMode
                  ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-500/20 font-bold text-blue-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold truncate">Isi E-Book</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectMainTab('rumus');
                handleClose();
              }}
              className={`p-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                activeMainTab === 'rumus' && !isCoverMode
                  ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-500/20 font-bold text-blue-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold truncate">Kamus Rumus</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectMainTab('glosarium');
                handleClose();
              }}
              className={`p-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                activeMainTab === 'glosarium' && !isCoverMode
                  ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-500/20 font-bold text-blue-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold truncate">Glosarium</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectMainTab('faq');
                handleClose();
              }}
              className={`p-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                activeMainTab === 'faq' && !isCoverMode
                  ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-500/20 font-bold text-blue-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold truncate">FAQ &amp; Solusi</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectMainTab('regulasi');
                handleClose();
              }}
              className={`p-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                activeMainTab === 'regulasi' && !isCoverMode
                  ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-500/20 font-bold text-blue-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold truncate">Regulasi &amp; UU</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Section Header for Chapters */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Daftar Bab EBook
          </div>
        </div>

        {filteredTocChapters.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            Tidak ada bab yang cocok dengan pencarian "{tocSearch}".
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredTocChapters.map((ch) => {
              const isActive = activeChapterId === ch.id && activeMainTab === 'buku' && !isCoverMode;
              const isCompleted = completedChapters.includes(ch.id);
              const originalIndex = PANDUAN_CHAPTERS.findIndex(c => c.id === ch.id);
              const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
              const romanNum = romanNumerals[originalIndex] || ch.number;

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    onSelectChapter(ch.id);
                    handleClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 border border-blue-300/80 text-blue-900 shadow-2xs ring-1 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-medium tracking-wider text-slate-400 uppercase leading-none mb-1">
                      BAB {romanNum}
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug truncate">
                      {ch.title}
                    </div>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Selesai
                    </span>
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[1.5]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
