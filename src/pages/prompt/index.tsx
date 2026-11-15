import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronRight
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';
import { DAFTAR_PROMPT_HALAMAN, PagePromptItem } from './prompt-data';
import { PromptModal } from './prompt-modal';

export function PromptPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<PagePromptItem | null>(null);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    return DAFTAR_PROMPT_HALAMAN.filter((item) => {
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.namaHalaman.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q) ||
        item.rute.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const headerActionsContent = (
    <button
      type="button"
      onClick={() => setIsSearchOpen(true)}
      className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all ${
        searchQuery
          ? 'border-blue-300 text-blue-600 bg-blue-50/50'
          : 'border-slate-200 text-slate-700 hover:text-blue-600'
      }`}
      aria-label="Cari"
      title="Cari modul atau halaman"
    >
      <Search className="w-4 h-4 stroke-[1.8]" />
      {searchQuery && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
      )}
    </button>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Top Header Title */}
      <PageHeaderTitle 
        title="Direktori Prompt" 
        subtitle="Prompt visual 3D & halaman" 
      />

      {/* Standard Header Actions */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {/* Header Search Mode */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari modul atau halaman..."
        />
      )}

      {/* Grid of Clean Minimal Cards (Only Group & Page Name) */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-slate-200 shadow-2xs mt-4">
          <h3 className="text-sm font-semibold text-slate-800">Tidak ada halaman yang sesuai</h3>
          <p className="text-xs text-slate-500 mt-1">
            Coba ubah kata kunci pencarian.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            Tampilkan Semua
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all duration-150 flex items-center justify-between cursor-pointer group"
            >
              <div className="min-w-0 pr-3 flex-1">
                {/* 1. Group Halaman Mana */}
                <div className="text-[11px] font-semibold text-blue-600 tracking-wide mb-1 truncate">
                  {item.kategori}
                </div>
                {/* 2. Nama Halaman */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {item.namaHalaman}
                </h3>
              </div>

              {/* Action Indicator */}
              <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Prompt Detail */}
      <PromptModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

export default PromptPage;
