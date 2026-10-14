import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { AllowanceTemplate } from './templates-tunjangan';
import { 
  Gift, 
  Percent,
  ChevronRight,
  ChevronLeft,
  X,
  Tag,
  Search
} from 'lucide-react';

interface ModalTemplateTunjanganProps {
  isOpen: boolean;
  onClose: () => void;
  templates: AllowanceTemplate[];
  onSelectTemplate: (tpl: AllowanceTemplate) => void;
}

export const ModalTemplateTunjangan: React.FC<ModalTemplateTunjanganProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectTemplate
}) => {
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplateCat, setSelectedTemplateCat] = useState<'all' | 'jabatan' | 'keahlian' | 'operasional' | 'bonus'>('all');

  const handleClose = () => {
    setIsHeaderSearchOpen(false);
    setTemplateSearch('');
    onClose();
  };

  const filteredList = templates.filter((tpl) => {
    const matchesSearch =
      templateSearch.trim() === '' ||
      tpl.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tpl.subtitle.toLowerCase().includes(templateSearch.toLowerCase()) ||
      (tpl.data.nama || '').toLowerCase().includes(templateSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTemplateCat === 'all') return true;
    const idLower = tpl.id.toLowerCase();
    const titleLower = tpl.title.toLowerCase();
    if (selectedTemplateCat === 'jabatan') {
      return idLower.includes('jabatan') || titleLower.includes('jabatan');
    }
    if (selectedTemplateCat === 'keahlian') {
      return idLower.includes('keahlian') || idLower.includes('k3') || idLower.includes('sio') || idLower.includes('iso') || titleLower.includes('keahlian') || titleLower.includes('k3');
    }
    if (selectedTemplateCat === 'operasional') {
      return idLower.includes('makan') || idLower.includes('operasional') || idLower.includes('shift') || idLower.includes('mobilitas') || idLower.includes('kendaraan') || idLower.includes('komunikasi') || idLower.includes('housing') || idLower.includes('keluarga');
    }
    if (selectedTemplateCat === 'bonus') {
      return idLower.includes('insentif') || idLower.includes('bonus') || idLower.includes('thr') || idLower.includes('kelipatan');
    }
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      contentClassName="sm:max-w-2xl h-[85vh] sm:h-[620px] max-h-[90vh] flex flex-col"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* 1. Modal Header (Directly integrates Search Bar mechanism per SPEC_HEADER.md) */}
        {isHeaderSearchOpen ? (
          <div className="flex items-center gap-2 p-3.5 sm:p-4 border-b border-slate-100 shrink-0 bg-white animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => {
                setIsHeaderSearchOpen(false);
                setTemplateSearch('');
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Kembali"
              aria-label="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Cari template tunjangan, jabatan, shift..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 p-0"
              />
            </div>

            {templateSearch ? (
              <button
                type="button"
                onClick={() => setTemplateSearch('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Hapus Teks Pencarian"
                aria-label="Hapus Teks Pencarian"
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  Pilih Template Tunjangan
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Template tunjangan & insentif siap pakai
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setIsHeaderSearchOpen(true)}
                className={`p-1.5 sm:p-2 text-slate-500 hover:text-blue-600 active:scale-95 transition-all cursor-pointer flex items-center justify-center relative rounded-lg hover:bg-slate-100 ${
                  templateSearch ? 'text-blue-600 bg-blue-50' : ''
                }`}
                title="Cari Template"
                aria-label="Cari Template"
              >
                <Search className="w-4.5 h-4.5 stroke-[2]" />
                {templateSearch && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup"
                aria-label="Tutup"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}

        {/* Sub-bar Filter Chips */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {[
              { id: 'all', label: 'Semua Template' },
              { id: 'jabatan', label: 'Jabatan & Level' },
              { id: 'keahlian', label: 'Keahlian & K3' },
              { id: 'operasional', label: 'Operasional & Shift' },
              { id: 'bonus', label: 'Bonus & Insentif' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedTemplateCat(cat.id as any)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTemplateCat === cat.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 min-h-0 flex-1">
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-400">
              <Search className="w-10 h-10 stroke-[1.5] mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Tidak ada template yang ditemukan</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Coba kata kunci lain atau pilih kategori yang berbeda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredList.map((tpl, idx) => {
                let CardIcon = Tag;
                const nameLower = (tpl.title + ' ' + (tpl.data.nama || '')).toLowerCase();
                if (nameLower.includes('bonus') || nameLower.includes('thr')) {
                  CardIcon = Gift;
                } else if (nameLower.includes('insentif')) {
                  CardIcon = Percent;
                } else if (nameLower.includes('tunjangan')) {
                  CardIcon = Tag;
                }

                return (
                  <button
                    key={`${tpl.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSelectTemplate(tpl);
                      handleClose();
                    }}
                    className="p-3.5 bg-white border border-slate-200/90 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl text-left transition-all group flex flex-col justify-between shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors shadow-2xs">
                        <CardIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors">
                          {tpl.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                          {tpl.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                        {tpl.badge}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 shrink-0">
                        <span>Gunakan Template</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
