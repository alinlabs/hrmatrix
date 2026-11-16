import React, { useMemo } from 'react';
import {
  Edit3,
  Eye,
  Copy,
  Trash2,
  Plus,
  ArrowUpRight,
  Files,
  Award,
  AlertTriangle,
  FileCheck,
  UserX,
  Briefcase,
} from 'lucide-react';
import { LetterCategory, LetterType, OfficialLetterDocument } from './types';
import { formatIndonesianDate } from './template-surat';
import { PageHeaderSubbar } from '../../context/mobile-nav-context';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyCompanyAnimation from '../../assets/animations/empty-company.json';

interface LetterListViewProps {
  documents: OfficialLetterDocument[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: LetterCategory | 'ALL';
  setSelectedCategory: (cat: LetterCategory | 'ALL') => void;
  sortBy: 'newest' | 'oldest' | 'name';
  setSortBy: (sort: 'newest' | 'oldest' | 'name') => void;
  onCreateNew: (type: LetterType) => void;
  onEditDocument: (doc: OfficialLetterDocument) => void;
  onPreviewDocument: (doc: OfficialLetterDocument) => void;
  onDuplicateDocument: (docId: string) => void;
  onDeleteDocument: (docId: string) => void;
}

const LETTER_PRESETS: { type: LetterType; label: string; desc: string }[] = [
  { type: 'SK_PROMOSI', label: 'SK Promosi', desc: 'Kenaikan jabatan & penyesuaian gaji' },
  { type: 'SK_MUTASI', label: 'SK Mutasi', desc: 'Rotasi unit kerja atau penempatan cabang' },
  { type: 'SP1', label: 'Surat Peringatan', desc: 'Penerbitan SP 1, SP 2, atau SP 3' },
  { type: 'PAKLARING', label: 'Paklaring', desc: 'Surat keterangan pengalaman kerja' },
  { type: 'SURAT_TUGAS', label: 'Surat Tugas', desc: 'Penugasan resmi & perjalanan dinas' },
];

const CATEGORY_TABS: {
  id: LetterCategory | 'ALL';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'ALL', label: 'Semua', icon: Files },
  { id: 'SK_KEPUTUSAN', label: 'SK Direksi', icon: Award },
  { id: 'PERINGATAN', label: 'Surat Peringatan', icon: AlertTriangle },
  { id: 'KETERANGAN', label: 'Paklaring & Keterangan', icon: FileCheck },
  { id: 'PENGAKHIRAN', label: 'PHK & Resign', icon: UserX },
  { id: 'PENUGASAN', label: 'Surat Tugas', icon: Briefcase },
];

export const LetterListView: React.FC<LetterListViewProps> = ({
  documents,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  onCreateNew,
  onEditDocument,
  onPreviewDocument,
  onDuplicateDocument,
  onDeleteDocument,
}) => {
  const filteredDocs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = documents.filter((d) => {
      if (selectedCategory !== 'ALL' && d.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        d.letterNumber.toLowerCase().includes(q) ||
        d.employee.fullName.toLowerCase().includes(q) ||
        d.employee.positionTitle.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.employee.fullName.localeCompare(b.employee.fullName);
      if (sortBy === 'oldest') return (a.updatedAt || '').localeCompare(b.updatedAt || '');
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });
  }, [documents, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Subbar Navigation: Kategori Surat */}
      <PageHeaderSubbar>
        <div className="flex items-center justify-between w-full px-3.5 md:px-8 overflow-x-auto no-scrollbar">
          {CATEGORY_TABS.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === 'ALL'
                ? documents.length
                : documents.filter((d) => d.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer px-2.5 sm:px-3 text-center shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
                <span>{cat.label} ({count})</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
                )}
              </button>
            );
          })}
        </div>
      </PageHeaderSubbar>

      {/* Quick Presets */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Template Surat & SK Resmi</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih jenis naskah dinas untuk membuat surat resmi baru
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {LETTER_PRESETS.map((p) => (
            <button
              key={p.type}
              type="button"
              onClick={() => onCreateNew(p.type)}
              className="text-left p-3 rounded-xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                  {p.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {p.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      {filteredDocs.length === 0 ? (
        documents.length === 0 ? (
          <InitialEmptyCard
            id="empty-surat-resmi"
            title="Buat Surat & SK Resmi!"
            description="Terbitkan SK Promosi, Mutasi, Paklaring, hingga Surat Peringatan secara terstruktur."
            buttonText="Buat Surat Pertama"
            ButtonIcon={Plus}
            onAction={() => onCreateNew('SK_PROMOSI')}
            animationData={emptyCompanyAnimation}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-2 shadow-2xs">
            <h4 className="text-sm font-bold text-slate-900">Tidak ada surat yang ditemukan</h4>
            <p className="text-xs text-slate-500">
              Ubah filter pencarian atau pilih kategori lain.
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onEditDocument(doc)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between gap-3 hover:border-blue-400 hover:shadow-xs transition-all shadow-2xs cursor-pointer group"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-slate-400 block truncate">
                  {doc.letterType} · {doc.letterNumber}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {doc.employee.fullName}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-1">{doc.title}</p>
                <p className="text-[11px] text-slate-400 font-medium truncate pt-0.5">
                  {doc.employee.positionTitle} · {formatIndonesianDate(doc.issuingDate)}
                </p>
              </div>

              <div
                className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditDocument(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onPreviewDocument(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Pratinjau
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onDuplicateDocument(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Duplikat Surat"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Surat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
