import React, { useMemo } from 'react';
import {
  Edit3,
  Eye,
  Copy,
  Trash2,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { ContractCategory, ContractDocument, ContractType } from './types';
import { CONTRACT_PRESETS, formatIndonesianDate } from './contract-templates';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyCompanyAnimation from '../../assets/animations/empty-company.json';

interface ContractListViewProps {
  documents: ContractDocument[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ContractCategory | 'ALL';
  setSelectedCategory: (cat: ContractCategory | 'ALL') => void;
  sortBy: 'newest' | 'oldest' | 'name';
  setSortBy: (sort: 'newest' | 'oldest' | 'name') => void;
  onCreateNew: (type?: ContractType) => void;
  onEditDocument: (doc: ContractDocument) => void;
  onPreviewDocument: (doc: ContractDocument) => void;
  onDuplicateDocument: (docId: string) => void;
  onDeleteDocument: (docId: string) => void;
}

export const ContractListView: React.FC<ContractListViewProps> = ({
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
    const list = documents.filter((doc) => {
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        doc.contractNumber.toLowerCase().includes(q) ||
        doc.employee.fullName.toLowerCase().includes(q) ||
        doc.job.positionTitle.toLowerCase().includes(q) ||
        doc.titleId.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'name') {
        return a.employee.fullName.localeCompare(b.employee.fullName);
      }
      if (sortBy === 'oldest') {
        return (a.updatedAt || '').localeCompare(b.updatedAt || '');
      }
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });
  }, [documents, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 sm:space-y-5">
      {/* Quick Presets */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Template Dokumen Kontrak</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih jenis perjanjian kerja untuk membuat draf baru
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CONTRACT_PRESETS.slice(0, 5).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onCreateNew(preset.type)}
              className="text-left p-3 rounded-xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                  {preset.name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Document Cards */}
      {filteredDocs.length === 0 ? (
        documents.length === 0 ? (
          <InitialEmptyCard
            id="empty-kontrak-kerja"
            title="Buat Kontrak Kerja Resmi!"
            description="Susun perjanjian PKWT, PKWTT, Addendum, maupun surat keterangan dengan cepat."
            buttonText="Buat Kontrak Pertama"
            ButtonIcon={Plus}
            onAction={() => onCreateNew('PKWT')}
            animationData={emptyCompanyAnimation}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-2 shadow-2xs">
            <h4 className="text-sm font-bold text-slate-900">Tidak ada berkas kontrak yang cocok</h4>
            <p className="text-xs text-slate-500">
              Ubah kata kunci pencarian atau pilih kategori lain untuk melihat dokumen.
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
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-400 truncate">
                    {doc.contractType} · {doc.contractNumber}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 shrink-0">
                    {doc.languageMode === 'bilingual' ? 'ID / EN' : doc.languageMode.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {doc.employee.fullName}
                </h4>

                <p className="text-xs text-slate-500 truncate">
                  {doc.job.positionTitle} · {formatIndonesianDate(doc.signingDate)}
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
                    title="Duplikat Dokumen"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Dokumen"
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
