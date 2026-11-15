import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  ChevronLeft, 
  ArrowLeft 
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { IndexJobTemplate } from './types';
import { KatalogCardItem } from './katalog-card-item';

interface ModalTemplateCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  templates: IndexJobTemplate[];
  onSelectTemplate: (template: IndexJobTemplate) => void;
  isLoadingDetail: boolean;
}

export const ModalTemplateCatalog: React.FC<ModalTemplateCatalogProps> = ({
  isOpen,
  onClose,
  onBack,
  templates,
  onSelectTemplate,
  isLoadingDetail,
}) => {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when search mode is activated
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Reset internal states when modal closes/opens
  useEffect(() => {
    if (!isOpen) {
      setIsSearchOpen(false);
      setSearch('');
    }
  }, [isOpen]);

  // Filter templates by search query
  const filteredTemplates = useMemo(() => {
    if (!search.trim()) return templates;
    const q = search.toLowerCase().trim();
    return templates.filter(
      (t) =>
        t.nama.toLowerCase().includes(q) ||
        (t.kategori && t.kategori.toLowerCase().includes(q)) ||
        (t.departemen && t.departemen.toLowerCase().includes(q)) ||
        (t.level && t.level.toLowerCase().includes(q)) ||
        (t.tujuanJabatan && t.tujuanJabatan.toLowerCase().includes(q))
    );
  }, [templates, search]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearch('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-5xl h-[85vh] sm:h-[650px] max-h-[90vh] flex flex-col">
      {/* HEADER SECTION */}
      {!isSearchOpen ? (
        <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Kembali ke Opsi"
                aria-label="Kembali ke Opsi"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate min-w-0">
                  Katalog Master Posisi
                </h3>
                <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shrink-0">
                  <Sparkles className="w-2.5 h-2.5" /> {templates.length} Siap Pakai
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate max-w-[30ch]">
                Standar jobdesk & kompensasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Search Icon Button immediately to the left of X */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={`p-1.5 sm:p-2 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer shrink-0 hover:bg-slate-100 ${
                search ? 'text-blue-600 bg-blue-50' : ''
              }`}
              title="Cari Template"
              aria-label="Cari Template"
            >
              <Search className="w-4.5 h-4.5 stroke-[2]" />
            </button>

            {/* Close Button X */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Tutup Modal"
              aria-label="Tutup Modal"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Header Search Mode (Frameless, Direct on White Background, No Search Icon inside input) */
        <div className="px-3.5 sm:px-5 py-3 border-b border-slate-100 flex items-center gap-2 sm:gap-3 shrink-0 bg-white animate-in fade-in duration-150">
          {/* Tombol ChevronLeft di posisi kiri untuk kembali ke mode normal */}
          <button
            type="button"
            onClick={handleCloseSearch}
            className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
            title="Kembali"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Kolom Input Search Frameless (TANPA ICON SEARCH INTERNAL) */}
          <div className="flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama posisi, divisi, level..."
              className="w-full bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 p-0"
            />
          </div>

          {/* Tombol X di paling kanan: HANYA MUNCUL KETIKA ADA TEKS UNTUK MENGHAPUS TEKS */}
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Hapus Teks Pencarian"
              aria-label="Hapus Teks Pencarian"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      )}

      {/* Regular Template Cards Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70 min-h-0">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl, idx) => (
              <KatalogCardItem
                key={`${tpl.id}-${idx}`}
                template={tpl}
                onSelect={onSelectTemplate}
                disabled={isLoadingDetail}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Template Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tidak ada posisi yang cocok dengan kata kunci "{search}".
            </p>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};


