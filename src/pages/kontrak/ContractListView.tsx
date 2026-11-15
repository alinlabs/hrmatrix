import React, { useState, useMemo } from 'react';
import { 
  FileSignature, 
  Plus, 
  Search, 
  FileText, 
  FileCheck2, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Sparkles,
  Award,
  Briefcase
} from 'lucide-react';
import { ContractDocument, ContractCategory, ContractType } from './types';
import { formatIndonesianDate, formatRupiah } from './contract-templates';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';

interface ContractListViewProps {
  documents: ContractDocument[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategory?: ContractCategory | 'ALL';
  setSelectedCategory?: (cat: ContractCategory | 'ALL') => void;
  sortBy?: 'newest' | 'oldest' | 'name';
  setSortBy?: (sort: 'newest' | 'oldest' | 'name') => void;
  onCreateNew: (type?: ContractType) => void;
  onEditDocument: (doc: ContractDocument) => void;
  onPreviewDocument: (doc: ContractDocument) => void;
  onDuplicateDocument: (docId: string) => void;
  onDeleteDocument: (docId: string) => void;
}

export const ContractListView: React.FC<ContractListViewProps> = ({
  documents,
  searchQuery = '',
  onSearchChange,
  selectedCategory: externalCategory,
  setSelectedCategory: externalSetCategory,
  sortBy: externalSortBy,
  setSortBy: externalSetSortBy,
  onCreateNew,
  onEditDocument,
  onPreviewDocument,
  onDuplicateDocument,
  onDeleteDocument
}) => {
  const [localCategory, setLocalCategory] = useState<ContractCategory | 'ALL'>('ALL');
  const [localSortBy, setLocalSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const selectedCategory = externalCategory !== undefined ? externalCategory : localCategory;
  const setSelectedCategory = externalSetCategory || setLocalCategory;
  const sortBy = externalSortBy !== undefined ? externalSortBy : localSortBy;
  const setSortBy = externalSetSortBy || setLocalSortBy;

  // Contracts Statistics
  const stats = useMemo(() => {
    const pkwtCount = documents.filter(d => d.contractType === 'PKWT').length;
    const pkwttCount = documents.filter(d => d.contractType === 'PKWTT').length;
    const renewalCount = documents.filter(d => d.contractType === 'RENEWAL_PKWT').length;
    const internshipFreelanceCount = documents.filter(d => d.contractType === 'INTERNSHIP' || d.contractType === 'FREELANCE').length;

    return { pkwtCount, pkwttCount, renewalCount, internshipFreelanceCount };
  }, [documents]);

  // Filtered & Sorted list
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Category filter
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = doc.contractNumber?.toLowerCase().includes(q);
        const matchTitle = doc.titleId?.toLowerCase().includes(q) || doc.titleEn?.toLowerCase().includes(q);
        const matchEmployee = doc.employee?.fullName?.toLowerCase().includes(q) || doc.employee?.nik?.toLowerCase().includes(q);
        const matchPosition = doc.job?.positionTitle?.toLowerCase().includes(q) || doc.job?.department?.toLowerCase().includes(q);
        return matchNumber || matchTitle || matchEmployee || matchPosition;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || b.signingDate).getTime() - new Date(a.createdAt || a.signingDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || a.signingDate).getTime() - new Date(b.createdAt || b.signingDate).getTime();
      }
      if (sortBy === 'name') {
        return (a.employee?.fullName || '').localeCompare(b.employee?.fullName || '');
      }
      return 0;
    });
  }, [documents, selectedCategory, searchQuery, sortBy]);

  const getCategoryBadge = (type: ContractType) => {
    switch (type) {
      case 'PKWT':
        return {
          label: 'PKWT (Kontrak)',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
          icon: FileText
        };
      case 'PKWTT':
        return {
          label: 'PKWTT (Tetap)',
          badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          icon: Award
        };
      case 'RENEWAL_PKWT':
        return {
          label: 'Addendum PKWT',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          icon: FileCheck2
        };
      case 'INTERNSHIP':
        return {
          label: 'Perjanjian Magang',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          icon: Briefcase
        };
      case 'FREELANCE':
        return {
          label: 'SPK Freelance',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
          icon: Briefcase
        };
      default:
        return {
          label: 'Perjanjian Kerja',
          badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: FileSignature
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP SUMMARY STAT CARDS (EXACTLY 4 CARDS FOR CONTRACTS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: PKWT */}
        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'KONTRAK_BARU' ? 'ALL' : 'KONTRAK_BARU')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 sm:gap-3 ${
            selectedCategory === 'KONTRAK_BARU'
              ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl font-black text-blue-700 shrink-0 leading-none">
              {stats.pkwtCount}
            </span>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">
                PKWT
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Kontrak Tertentu
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: PKWTT */}
        <div 
          className="p-3.5 sm:p-4 rounded-2xl border transition-all bg-white border-slate-200 hover:border-slate-300 flex items-center justify-between gap-2.5 sm:gap-3"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl font-black text-indigo-700 shrink-0 leading-none">
              {stats.pkwttCount}
            </span>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">
                PKWTT
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Karyawan Tetap
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Perpanjangan Addendum */}
        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'PERPANJANG_KONTRAK' ? 'ALL' : 'PERPANJANG_KONTRAK')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 sm:gap-3 ${
            selectedCategory === 'PERPANJANG_KONTRAK'
              ? 'bg-emerald-50/80 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 shrink-0 leading-none">
              {stats.renewalCount}
            </span>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">
                Perpanjangan
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Addendum PKWT
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Magang & Freelance */}
        <div 
          className="p-3.5 sm:p-4 rounded-2xl border transition-all bg-white border-slate-200 hover:border-slate-300 flex items-center justify-between gap-2.5 sm:gap-3"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl font-black text-purple-700 shrink-0 leading-none">
              {stats.internshipFreelanceCount}
            </span>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">
                Magang & FL
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Internship & Freelance
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* 2. QUICK TEMPLATE SELECTION FOR CONTRACTS */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-5 rounded-2xl text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h3 className="font-bold text-sm tracking-tight">Pilih Template Kontrak Kerja Baru</h3>
          </div>
          <span className="text-[11px] text-blue-200 font-medium">Sesuai UU Cipta Kerja & PP 35/2021</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => onCreateNew('PKWT')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">PKWT</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Kontrak Waktu Tertentu</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('PKWTT')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">PKWTT</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Karyawan Tetap (Permanen)</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('RENEWAL_PKWT')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">Addendum PKWT</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Perpanjangan Masa Kerja</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('INTERNSHIP')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">Magang</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Internship Agreement</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('FREELANCE')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">Freelance</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Kontrak Jasa & Proyek</div>
          </button>
        </div>
      </div>

      {/* 3. CARD-CARD DAFTAR BERKAS KONTRAK */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map((doc) => {
            const badge = getCategoryBadge(doc.contractType);
            const isDeleting = deleteConfirmId === doc.id;

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs transition-all hover:shadow-md flex flex-col justify-between"
              >
                {/* Top Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.badgeBg}`}>
                      {badge.label}
                    </span>

                    <span className="text-xs font-medium text-slate-500 shrink-0">
                      {formatIndonesianDate(doc.signingDate)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                      {doc.titleId}
                    </h3>
                    {doc.titleEn && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5">
                        {doc.titleEn}
                      </p>
                    )}
                  </div>

                  {/* Employee Profile */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <EmployeeAvatar 
                        name={doc.employee.fullName || 'Karyawan'} 
                        employee={doc.employee as any}
                        size="md" 
                      />

                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] text-slate-400 font-medium leading-tight truncate">
                          {doc.job.department || 'Umum'}
                        </div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate">
                          {doc.employee.fullName || 'Nama Karyawan Belum Diisi'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium leading-tight truncate mt-0.5">
                          {doc.job.positionTitle || 'Staf'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-700 uppercase">
                      {doc.languageMode === 'bilingual' ? '2 Bahasa' : doc.languageMode}
                    </span>
                    <span>·</span>
                    <span>{doc.clauses.filter(c => c.isEnabled).length} Klausul</span>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onPreviewDocument(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Pratinjau & Cetak Dokumen"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditDocument(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Dokumen"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateDocument(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Duplikasi Dokumen"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteDocument(doc.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold text-white bg-rose-600 rounded-md cursor-pointer"
                        >
                          Hapus
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 text-[10px] text-slate-600 cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Dokumen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-2xs space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <FileSignature className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {searchQuery ? 'Tidak Ada Berkas Kontrak yang Cocok' : 'Belum Ada Berkas Kontrak Kerja'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Mulai buat draf Perjanjian Kerja Waktu Tertentu (PKWT), PKWTT, Addendum Perpanjangan, atau Magang berstandar UU Cipta Kerja & PP 35/2021.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onCreateNew('PKWT')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Kontrak PKWT Sekarang</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
