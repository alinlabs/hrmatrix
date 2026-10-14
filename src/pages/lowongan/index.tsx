import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Briefcase, 
  Sparkles, 
  Building2, 
  MapPin, 
  Clock, 
  Coins, 
  Trash2, 
  CheckCircle2,
  Eye,
  Navigation,
  ArrowUpRight,
  X
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';
import { JobTemplate } from '../job-desk/types';
import { getStoredCustomTemplates } from '../job-desk/storage-helper';
import { VacancyItem, VacancyStatus } from './types';
import { 
  getStoredVacancies, 
  saveVacancy, 
  deleteVacancy, 
  updateVacancyStatus 
} from './storage-helper';
import { formatRupiah } from './utils-ats';
import { ModalBuatLowongan } from './modal-buat-lowongan';
import { ModalTemplateDetail } from '../job-desk/modal-template-detail';
import { ModalTab } from '../job-desk/types';
import { Modal } from '../../components/ui/Modal';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyJobdeskAnimation from '../../assets/animations/empty-jobdesk.json';

// Helper untuk memvalidasi tanggal batas dibuka
function getDeadlineStatus(deadlineStr?: string, status?: string) {
  if (status === 'Ditutup') {
    return { isExpired: true, text: 'Sudah Melewati Batas Tanggal Dibuka' };
  }

  if (!deadlineStr) {
    return { isExpired: false, text: 'Dibuka Hingga Posisi Terisi' };
  }

  const parts = deadlineStr.split('-');
  let deadlineDate: Date | null = null;

  if (parts.length === 3 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1])) && !isNaN(Number(parts[2]))) {
    deadlineDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 23, 59, 59);
  } else {
    const parsed = new Date(deadlineStr);
    if (!isNaN(parsed.getTime())) {
      deadlineDate = parsed;
      deadlineDate.setHours(23, 59, 59, 999);
    }
  }

  const now = new Date();

  if (deadlineDate && now > deadlineDate) {
    return { isExpired: true, text: 'Sudah Melewati Batas Tanggal Dibuka' };
  }

  let formattedDate = deadlineStr;
  if (deadlineDate) {
    try {
      formattedDate = deadlineDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch(e) {}
  }

  return { isExpired: false, text: `Dibuka Hingga ${formattedDate}` };
}

export function BuatLowonganATSPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'Semua' | VacancyStatus>('Semua');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('Semua');

  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<VacancyItem | null>(null);
  const [viewingVacancy, setViewingVacancy] = useState<VacancyItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>('seputar');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [vacancyToDelete, setVacancyToDelete] = useState<VacancyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Vacancies and Job Templates
  useEffect(() => {
    const loadedVacancies = getStoredVacancies();
    setVacancies(loadedVacancies);

    // Load available jobdesks from custom + sample (now dynamically load all templates)
    const loadTemplates = async () => {
      const custom = getStoredCustomTemplates();
      const map = new Map<string, JobTemplate>();
      (custom || []).forEach(t => map.set(t.id, t));
      
      try {
        const { allTemplates } = await import('../../data/jobs/index');
        (allTemplates || []).forEach(t => {
          if (!map.has(t.id)) map.set(t.id, t);
        });
        setJobTemplates(Array.from(map.values()));
      } catch (err) {
        console.error("Failed to load templates:", err);
      }
    };
    loadTemplates();
  }, []);

  // Filtered Vacancies (Exhaustive Deep Search - Tipe A)
  const filteredVacancies = useMemo(() => {
    return vacancies.filter(v => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q || 
        v.jobTitle.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        (v.division && v.division.toLowerCase().includes(q)) ||
        (v.level && v.level.toLowerCase().includes(q)) ||
        v.companyName.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.workType.toLowerCase().includes(q) ||
        v.workModel.toLowerCase().includes(q) ||
        v.status.toLowerCase().includes(q) ||
        (v.customNotes && v.customNotes.toLowerCase().includes(q)) ||
        (v.contactEmail && v.contactEmail.toLowerCase().includes(q)) ||
        (v.atsBreakdown?.mandatoryQualifications?.hardSkills || []).some(s => s.toLowerCase().includes(q)) ||
        (v.atsBreakdown?.preferredQualifications?.softSkills || []).some(s => s.toLowerCase().includes(q)) ||
        (v.atsBreakdown?.mandatoryQualifications?.education || '').toLowerCase().includes(q) ||
        (v.atsBreakdown?.roleSummary || '').toLowerCase().includes(q);
      
      const matchStatus = statusFilter === 'Semua' || v.status === statusFilter;
      const matchDept = selectedDeptFilter === 'Semua' || v.department === selectedDeptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [vacancies, search, statusFilter, selectedDeptFilter]);

  // Unique departments for filter
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    vacancies.forEach(v => {
      if (v.department) set.add(v.department);
    });
    return Array.from(set);
  }, [vacancies]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = vacancies.length;
    const active = vacancies.filter(v => v.status === 'Aktif').length;
    const draft = vacancies.filter(v => v.status === 'Draft').length;
    const avgScore = total > 0
      ? Math.round(vacancies.reduce((acc, v) => acc + (v.atsBreakdown?.atsScore || 85), 0) / total)
      : 95;

    return { total, active, draft, avgScore };
  }, [vacancies]);

  const handleSaveVacancy = (saved: VacancyItem) => {
    const updated = saveVacancy(saved);
    setVacancies(updated);
    setIsCreateModalOpen(false);
    setEditingVacancy(null);
    setViewingVacancy(saved); // Immediately open ATS breakdown viewer
  };

  const confirmDeleteVacancy = () => {
    if (!vacancyToDelete) return;
    setIsDeleting(true);
    try {
      const updated = deleteVacancy(vacancyToDelete.id);
      setVacancies(updated);
      if (viewingVacancy?.id === vacancyToDelete.id) {
        setViewingVacancy(null);
      }
      setVacancyToDelete(null);
    } catch (err) {
      console.error('Failed to delete vacancy:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = (id: string, status: VacancyStatus) => {
    const updated = updateVacancyStatus(id, status);
    setVacancies(updated);
    if (viewingVacancy && viewingVacancy.id === id) {
      setViewingVacancy(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleCopyAtsText = (v: VacancyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!v.atsBreakdown?.plainTextATS) return;
    navigator.clipboard.writeText(v.atsBreakdown.plainTextATS);
    setCopiedId(v.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          search
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari Lowongan"
      >
        <Search className="w-4 h-4" />
        {search && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          setEditingVacancy(null);
          setIsCreateModalOpen(true);
        }}
        className="h-8 sm:h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-bold"
        title="Buat Lowongan ATS Baru"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Buat Lowongan</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <PageHeaderTitle
        title="Screening Pelamar"
        subtitle="Seleksi & kualifikasi kandidat"
      />

      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={setSearch}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari posisi lowongan, departemen, atau lokasi..."
        />
      )}

      {/* Stats Summary Grid (2 Compact Cards Side-by-Side) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-0.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Lowongan</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-slate-400">Terdaftar di sistem</div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-0.5">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-medium">
            <span>Lowongan Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{stats.active}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Siap menerima pelamar</div>
        </div>
      </div>

      {/* Vacancy Card List Grid or Standardized Empty State (SPEC_CARD_AWAL.md) */}
      {filteredVacancies.length === 0 ? (
        <InitialEmptyCard
          id="empty-lowongan-ats"
          title="Rancang Lowongan Ramah ATS!"
          description="Ekstrak jobdesk menjadi kualifikasi terbaca mesin ATS untuk rekrutmen tim."
          buttonText="Buat Lowongan Pertama"
          ButtonIcon={Briefcase}
          onAction={() => {
            setEditingVacancy(null);
            setIsCreateModalOpen(true);
          }}
          animationData={emptyJobdeskAnimation}
          trustNote="Terhubung otomatis dengan katalog jobdesk • Ekstraksi kata kunci ramah ATS"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVacancies.map((vacancy) => (
            <div
              key={vacancy.id}
              onClick={() => navigate(`/screening/${vacancy.id}`)}
              className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer space-y-3"
            >
              {/* Card Header Top Row */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {/* Teks Status Batas Waktu Lowongan */}
                  {(() => {
                    const deadlineInfo = getDeadlineStatus(vacancy.applicationDeadline, vacancy.status);
                    return (
                      <div className={`text-xs font-normal ${deadlineInfo.isExpired ? 'text-rose-500' : 'text-slate-500'}`}>
                        {deadlineInfo.text}
                      </div>
                    );
                  })()}

                  {/* Action Icons: Delete & Arrow Right Top */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVacancyToDelete(vacancy);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Lowongan"
                      aria-label="Hapus Lowongan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="p-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  {/* Nama Posisi */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {vacancy.jobTitle}
                  </h3>
                  {/* Departemen • Level */}
                  <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                    {vacancy.department} {vacancy.level ? `• ${vacancy.level}` : ''}
                  </p>
                </div>

                {/* 4 Mini Cards Grid (Penempatan, Domisili Kandidat, Jenis Waktu, Model Kerja) */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Card 1: Penempatan */}
                  <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-slate-500">Penempatan</div>
                    <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.location}>
                      {vacancy.location || '-'}
                    </div>
                  </div>

                  {/* Card 2: Domisili Kandidat */}
                  <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-slate-500">Domisili Kandidat</div>
                    <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.candidateDomicile || 'Terbuka Semua Domisili'}>
                      {vacancy.candidateDomicile || 'Terbuka Semua Domisili'}
                    </div>
                  </div>

                  {/* Card 3: Jenis Waktu */}
                  <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-slate-500">Jenis Waktu</div>
                    <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.workType}>
                      {vacancy.workType || '-'}
                    </div>
                  </div>

                  {/* Card 4: Model Kerja */}
                  <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-slate-500">Model Kerja</div>
                    <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.workModel}>
                      {vacancy.workModel || '-'}
                    </div>
                  </div>
                </div>

                {/* Card Rentang Gaji (Hijau Tipis Tanpa Ikon) */}
                {vacancy.salaryDisplay && vacancy.salaryMin ? (
                  <div className="p-3 bg-emerald-50/90 border border-emerald-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-emerald-700/80">
                      Rentang Gaji
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-800">
                      {formatRupiah(vacancy.salaryMin)} - {formatRupiah(vacancy.salaryMax)}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Buat / Edit Lowongan */}
      <ModalBuatLowongan
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingVacancy(null);
        }}
        availableJobTemplates={jobTemplates}
        editingVacancy={editingVacancy}
        onSaveVacancy={handleSaveVacancy}
      />

      {/* Modal Detail Posisi (Template Asli) */}
      <ModalTemplateDetail
        isOpen={!!viewingVacancy && !!viewingVacancy.rawJobTemplate}
        template={viewingVacancy ? viewingVacancy.rawJobTemplate : null}
        onClose={() => setViewingVacancy(null)}
        activeModalTab={activeModalTab}
        setActiveModalTab={setActiveModalTab}
        onUseTemplate={() => {
          if (viewingVacancy) {
            navigate(`/lowongan/${viewingVacancy.id}`);
            setViewingVacancy(null);
          }
        }}
        actionButtonText="Buka Kandidat ATS"
      />

      {/* Modal Konfirmasi Hapus Lowongan (Standar SPEC_MODAL.md) */}
      <Modal
        isOpen={!!vacancyToDelete}
        onClose={() => {
          if (!isDeleting) setVacancyToDelete(null);
        }}
        contentClassName="sm:max-w-md"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header (SPEC_MODAL) */}
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  Hapus Lowongan
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Konfirmasi penghapusan data lowongan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isDeleting) setVacancyToDelete(null);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3 text-xs flex-1 min-h-0">
            <p className="text-slate-700 leading-relaxed">
              Apakah Anda yakin ingin menghapus lowongan pekerjaan untuk posisi{' '}
              <span className="font-bold text-slate-900">{vacancyToDelete?.jobTitle}</span>?
            </p>
            <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-800 text-[11px] leading-normal font-medium">
              Seluruh data kualifikasi dan riwayat pelamar yang terhubung dengan lowongan ini akan dihapus secara permanen.
            </div>
          </div>

          {/* Footer (SPEC_MODAL: Single Full-Width Action) */}
          <div className="p-4 sm:p-6 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={confirmDeleteVacancy}
              disabled={isDeleting}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? 'Menghapus...' : 'Hapus Lowongan Sekarang'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BuatLowonganATSPage;

