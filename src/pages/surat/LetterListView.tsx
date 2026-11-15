import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Award, 
  AlertTriangle, 
  LogOut, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Sparkles,
  User,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { OfficialLetterDocument, LetterType, LetterCategory } from './types';
import { formatIndonesianDate } from './letter-templates';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';

interface LetterListViewProps {
  documents: OfficialLetterDocument[];
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  selectedCategory?: LetterCategory | 'ALL';
  setSelectedCategory?: (cat: LetterCategory | 'ALL') => void;
  sortBy?: 'newest' | 'oldest' | 'name';
  setSortBy?: (sort: 'newest' | 'oldest' | 'name') => void;
  onCreateNew: (type?: LetterType) => void;
  onEditDocument: (doc: OfficialLetterDocument) => void;
  onPreviewDocument: (doc: OfficialLetterDocument) => void;
  onDuplicateDocument: (docId: string) => void;
  onDeleteDocument: (docId: string) => void;
}

export const LetterListView: React.FC<LetterListViewProps> = ({
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
  const [localCategory, setLocalCategory] = useState<LetterCategory | 'ALL'>('ALL');
  const [localSortBy, setLocalSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const selectedCategory = externalCategory !== undefined ? externalCategory : localCategory;
  const setSelectedCategory = externalSetCategory || setLocalCategory;
  const sortBy = externalSortBy !== undefined ? externalSortBy : localSortBy;
  const setSortBy = externalSetSortBy || setLocalSortBy;

  // Stats
  const stats = useMemo(() => {
    const skCount = documents.filter(d => d.category === 'SK_KEPUTUSAN').length;
    const spCount = documents.filter(d => d.category === 'PERINGATAN').length;
    const paklaringCount = documents.filter(d => d.category === 'KETERANGAN').length;
    const phkCount = documents.filter(d => d.category === 'PENGAKHIRAN').length;
    const tugasCount = documents.filter(d => d.category === 'PENUGASAN').length;

    return { skCount, spCount, paklaringCount, phkCount, tugasCount };
  }, [documents]);

  // Filtered documents
  const filtered = useMemo(() => {
    return documents.filter(doc => {
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = doc.letterNumber.toLowerCase().includes(q);
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchEmp = doc.employee.fullName.toLowerCase().includes(q) || doc.employee.nik.toLowerCase().includes(q);
        const matchDept = doc.employee.department.toLowerCase().includes(q);
        return matchNum || matchTitle || matchEmp || matchDept;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || b.issuingDate).getTime() - new Date(a.createdAt || a.issuingDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || a.issuingDate).getTime() - new Date(b.createdAt || b.issuingDate).getTime();
      }
      if (sortBy === 'name') {
        return (a.employee.fullName || '').localeCompare(b.employee.fullName || '');
      }
      return 0;
    });
  }, [documents, selectedCategory, searchQuery, sortBy]);

  const getBadgeInfo = (cat: LetterCategory) => {
    switch (cat) {
      case 'SK_KEPUTUSAN':
        return { label: 'SK Keputusan', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Award };
      case 'PERINGATAN':
        return { label: 'Surat Peringatan', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle };
      case 'KETERANGAN':
        return { label: 'Paklaring / Ket.', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FileText };
      case 'PENGAKHIRAN':
        return { label: 'PHK / Resign', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: LogOut };
      case 'PENUGASAN':
        return { label: 'Surat Tugas', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Compass };
      default:
        return { label: 'Surat Resmi', bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: FileText };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'SK_KEPUTUSAN' ? 'ALL' : 'SK_KEPUTUSAN')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            selectedCategory === 'SK_KEPUTUSAN'
              ? 'bg-purple-50/80 border-purple-600 shadow-sm ring-2 ring-purple-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-2xl sm:text-3xl font-black text-purple-700 block leading-none">{stats.skCount}</span>
            <span className="text-xs font-bold text-slate-900 uppercase mt-1 block">SK Direksi</span>
            <span className="text-[11px] text-slate-500">Promosi, Demosi & Mutasi</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'PERINGATAN' ? 'ALL' : 'PERINGATAN')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            selectedCategory === 'PERINGATAN'
              ? 'bg-amber-50/80 border-amber-600 shadow-sm ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-700 block leading-none">{stats.spCount}</span>
            <span className="text-xs font-bold text-slate-900 uppercase mt-1 block">Surat Peringatan</span>
            <span className="text-[11px] text-slate-500">SP 1, SP 2, SP 3</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'KETERANGAN' ? 'ALL' : 'KETERANGAN')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            selectedCategory === 'KETERANGAN'
              ? 'bg-emerald-50/80 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 block leading-none">{stats.paklaringCount}</span>
            <span className="text-xs font-bold text-slate-900 uppercase mt-1 block">Paklaring</span>
            <span className="text-[11px] text-slate-500">Keterangan Pengalaman</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'PENGAKHIRAN' ? 'ALL' : 'PENGAKHIRAN')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            selectedCategory === 'PENGAKHIRAN'
              ? 'bg-rose-50/80 border-rose-600 shadow-sm ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <span className="text-2xl sm:text-3xl font-black text-rose-700 block leading-none">{stats.phkCount}</span>
            <span className="text-xs font-bold text-slate-900 uppercase mt-1 block">PHK & Resign</span>
            <span className="text-[11px] text-slate-500">Pengakhiran Kerja</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. QUICK TEMPLATE CARDS */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-5 rounded-2xl text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h3 className="font-bold text-sm tracking-tight">Pilih Template Surat & SK Resmi</h3>
          </div>
          <span className="text-[11px] text-blue-200 font-medium">Klik untuk langsung buat draf</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            type="button"
            onClick={() => onCreateNew('SK_PROMOSI')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">SK Promosi</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Kenaikan Jabatan & Gaji</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('SK_DEMOSI')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">SK Demosi</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Penyesuaian Posisi</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('SK_MUTASI')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">SK Mutasi</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Rotasi Cabang/Divisi</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('SK_PENGANGKATAN')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">SK Pengangkatan</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Karyawan Tetap PKWTT</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('SP1')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">Surat SP</div>
            <div className="text-[10px] text-slate-300 mt-0.5">SP 1, SP 2 & SP 3</div>
          </button>

          <button
            type="button"
            onClick={() => onCreateNew('PAKLARING')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">Paklaring</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Pengalaman Kerja</div>
          </button>
        </div>
      </div>

      {/* 3. CARD LIST DOKUMEN SURAT */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(doc => {
            const badge = getBadgeInfo(doc.category);
            const isDeleting = deleteConfirmId === doc.id;

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {formatIndonesianDate(doc.issuingDate)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{doc.letterNumber}</p>
                  </div>

                  {/* Employee card snippet */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <EmployeeAvatar name={doc.employee.fullName} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] text-slate-400 font-medium truncate">
                          {doc.employee.department}
                        </div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {doc.employee.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {doc.employee.positionTitle} ({doc.employee.nik})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">
                    Ditandatangani: <span className="font-bold text-slate-700">{doc.signatoryName}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onPreviewDocument(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Pratinjau & Cetak"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditDocument(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Surat"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateDocument(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Duplikasi"
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
                          className="px-2 py-0.5 text-[10px] font-bold text-white bg-rose-600 rounded cursor-pointer"
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
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-900 text-sm">Tidak Ada Dokumen Surat / SK yang Sesuai</h4>
          <p className="text-xs text-slate-500">Mulai buat SK Promosi, SP, Paklaring, atau Surat Tugas baru.</p>
          <button
            type="button"
            onClick={() => onCreateNew('SK_PROMOSI')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Surat Resmi Sekarang</span>
          </button>
        </div>
      )}

    </div>
  );
};
