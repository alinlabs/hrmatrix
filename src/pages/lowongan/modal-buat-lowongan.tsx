import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Briefcase, 
  ChevronRight,
  ChevronLeft,
  Search,
  Database,
  Building2,
  Calendar
} from 'lucide-react';
import { JobTemplate, ModalTab } from '../job-desk/types';
import { 
  VacancyItem, 
  CreateVacancyFormState
} from './types';
import { generateAtsBreakdown } from './utils-ats';
import { useCompany } from '../../context/CompanyContext';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/index';
import { ModalTemplateDetail } from '../job-desk/modal-template-detail';

// Helper for displaying date in Indonesian format (SPEC_INPUT_TYPE)
const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parseInt(m, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(d, 10)} ${months[mIdx]} ${y}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

interface ModalBuatLowonganProps {
  isOpen: boolean;
  onClose: () => void;
  availableJobTemplates: JobTemplate[];
  editingVacancy?: VacancyItem | null;
  onSaveVacancy: (vacancy: VacancyItem) => void;
}

export const ModalBuatLowongan: React.FC<ModalBuatLowonganProps> = ({
  isOpen,
  onClose,
  availableJobTemplates,
  onSaveVacancy,
}) => {
  const { company } = useCompany();
  
  // Step State: 1 = Pilih Job Desk, 2 = Penyesuaian Detail Lowongan
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedJob, setSelectedJob] = useState<JobTemplate | null>(null);

  const [activeTab, setActiveTab] = useState<'my_positions' | 'catalog'>('my_positions');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>('overview');
  const [selectedPreview, setSelectedPreview] = useState<JobTemplate | null>(null);

  // Form State for Step 2
  const [location, setLocation] = useState('Jakarta Pusat');
  const [candidateDomicile, setCandidateDomicile] = useState('Terbuka Semua Domisili');
  const [workType, setWorkType] = useState('Penuh Waktu (Full-Time)');
  const [workModel, setWorkModel] = useState('On-site (WFO)');
  const [applicationDeadline, setApplicationDeadline] = useState<string>('');

  const dateInputRef = useRef<HTMLInputElement>(null);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedJob(null);
      setSelectedPreview(null);
      setSearchQuery('');
      setIsSearchActive(false);
      setCandidateDomicile('Terbuka Semua Domisili');
      setApplicationDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [isOpen]);

  // Custom positions from localStorage
  const myPositions = useMemo(() => {
    try {
      const raw = localStorage.getItem('job_desk_custom_templates_v2');
      if (raw) {
        return JSON.parse(raw) as JobTemplate[];
      }
    } catch(e) {}
    return [];
  }, [isOpen]);

  const catalogPositions = useMemo(() => {
    // We use availableJobTemplates passed from parent, which dynamically loads all 500+ templates.
    // Filter out strictly custom ones if they don't have a known category from allTemplates, 
    // or just return all of them since it's a catalog. To avoid duplicates with myPositions, 
    // we can filter out templates that exist in myPositions if they are purely custom, 
    // but the easiest is just using the ones that come from the system.
    // For now, return availableJobTemplates.
    return availableJobTemplates || [];
  }, [availableJobTemplates]);

  const currentList = activeTab === 'my_positions' ? myPositions : catalogPositions;
  
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return currentList;
    const q = searchQuery.toLowerCase();
    return currentList.filter(job => 
      job.nama.toLowerCase().includes(q) ||
      (job.departemen && job.departemen.toLowerCase().includes(q)) ||
      (job.level && job.level.toLowerCase().includes(q))
    );
  }, [currentList, searchQuery]);

  // Handle selecting a position and proceeding to Step 2
  const handleSelectJobForAdjustment = (job: JobTemplate) => {
    setSelectedJob(job);
    setLocation(company?.kabupaten ? `${company.kabupaten}, ${company.provinsi || 'Indonesia'}` : 'Jakarta Pusat');
    setCandidateDomicile(company?.kabupaten ? company.kabupaten : 'Terbuka Semua Domisili');
    setSelectedPreview(null);
    setIsSearchActive(false);
    setStep(2);
  };

  // Safe container click to trigger date picker
  const handleDateContainerClick = () => {
    if (dateInputRef.current && typeof dateInputRef.current.showPicker === 'function') {
      try {
        dateInputRef.current.showPicker();
      } catch {
        // Fallback to native click
      }
    }
  };

  // Handle final submission in Step 2
  const handleFinalCreateVacancy = () => {
    if (!selectedJob) return;

    // Extract salary directly from job desk template
    const salaryMin = selectedJob.kompensasi?.gajiPokok?.minimal || 5000000;
    const salaryMax = selectedJob.kompensasi?.gajiPokok?.maksimal || 10000000;

    const formState: CreateVacancyFormState = {
      jobTemplateId: selectedJob.id,
      jobTitle: selectedJob.nama,
      department: selectedJob.departemen || '',
      division: selectedJob.divisi || selectedJob.departemen || '',
      level: selectedJob.level || '',
      companyName: company?.nama || 'PT Perusahaan Solusi',
      location: location.trim() || 'Jakarta Pusat',
      candidateDomicile: candidateDomicile.trim() || 'Terbuka Semua Domisili',
      workType: workType as any,
      workModel: workModel as any,
      salaryDisplay: true,
      salaryMin,
      salaryMax,
      applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contactEmail: company?.email || 'recruitment@perusahaan.co.id',
      status: 'Aktif',
      customNotes: '',
    };

    const breakdown = generateAtsBreakdown(selectedJob, formState);

    const newVacancy: VacancyItem = {
      id: `VAC-${Date.now().toString().slice(-5)}`,
      jobTemplateId: selectedJob.id,
      jobTitle: formState.jobTitle,
      department: formState.department,
      division: formState.division,
      level: formState.level,
      companyName: formState.companyName,
      location: formState.location,
      candidateDomicile: formState.candidateDomicile,
      workType: formState.workType,
      workModel: formState.workModel,
      salaryDisplay: formState.salaryDisplay,
      salaryMin: formState.salaryMin,
      salaryMax: formState.salaryMax,
      applicationDeadline: formState.applicationDeadline,
      contactEmail: formState.contactEmail,
      status: formState.status,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      rawJobTemplate: selectedJob,
      atsBreakdown: breakdown,
    };

    onSaveVacancy(newVacancy);
    setStep(1);
    setSelectedJob(null);
    setSelectedPreview(null);
    setIsSearchActive(false);
    onClose();
  };

  // Previewing position details before choosing
  if (selectedPreview) {
    return (
      <ModalTemplateDetail 
        selectedRoleDetail={selectedPreview}
        onClose={() => setSelectedPreview(null)}
        activeModalTab={activeModalTab}
        setActiveModalTab={setActiveModalTab}
        onUseTemplate={(job) => handleSelectJobForAdjustment(job)}
        actionButtonText="Buat Lowongan Ini"
      />
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      fixedHeight 
      contentClassName="sm:max-w-xl flex flex-col overflow-hidden"
    >
      {/* Header Modal (Standard SPEC_MODAL & SPEC_HEADER_PAGE) */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        {isSearchActive ? (
          /* Header Morphing Search Mode */
          <div className="flex items-center gap-2 w-full animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => {
                setIsSearchActive(false);
                setSearchQuery('');
              }}
              className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
              title="Kembali"
              aria-label="Tutup pencarian"
            >
              <ChevronLeft className="w-5 h-5 text-slate-800" />
            </button>
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama jabatan atau departemen..."
                className="w-full h-9 p-0 text-xs sm:text-sm bg-transparent border-none outline-none ring-0 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0 mr-1"
                  title="Hapus kata kunci"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Tutup modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Normal Header Mode */
          <>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-1.5 -ml-1 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                  title="Kembali ke pilih job desk"
                  aria-label="Kembali ke langkah 1"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : null}
              
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                {step === 1 ? <Sparkles className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  {step === 1 ? 'Pilih Job Desk' : 'Detail Lowongan'}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5 truncate">
                  {step === 1 
                    ? 'Pilih dari posisi tersimpan atau katalog template' 
                    : `${selectedJob?.nama} • ${selectedJob?.departemen || 'Umum'}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {step === 1 && (
                <button
                  type="button"
                  onClick={() => setIsSearchActive(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Cari Job Desk"
                  aria-label="Cari Job Desk"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Body Modal */}
      {step === 1 ? (
        /* STEP 1: PILIH JOB DESK */
        <div className="flex flex-col flex-1 min-h-0 overflow-x-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('my_positions')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === 'my_positions' 
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50 font-semibold' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Posisi Saya ({myPositions.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === 'catalog' 
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50 font-semibold' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Katalog Template ({catalogPositions.length})</span>
            </button>
          </div>

          {/* List Job Desks */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-50/50">
            {filteredList.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                Tidak ada data ditemukan.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredList.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJobForAdjustment(job)}
                    className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-2xs rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* Posisi (tebal besar) */}
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                          {job.nama}
                        </h4>
                        {/* Departemen • Level (kecil tipis) */}
                        <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                          {job.departemen || 'Umum'} {job.level ? `• ${job.level}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Chevron Right di paling kanan */}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STEP 2: PENYESUAIAN ISI LOWONGAN */
        <div className="flex flex-col flex-1 min-h-0 overflow-x-hidden">
          {/* Form Content Area (Scrollable, Clean Flat Layout, No Cards, Full Normal Weight Labels) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 bg-white">
            
            {/* Posisi Penempatan / Area Kota */}
            <div className="w-full">
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Posisi Penempatan / Area Kota <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Jakarta Pusat, Surabaya, atau Bandung"
                className="flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent box-border min-h-[36px] leading-5"
              />
            </div>

            {/* Opsi Domisili Kandidat */}
            <div className="w-full">
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Target Domisili Pelamar (Tracking Domisili)
              </label>
              <input 
                type="text" 
                value={candidateDomicile}
                onChange={(e) => setCandidateDomicile(e.target.value)}
                placeholder="Contoh: Jabodetabek, Jawa Barat, atau Terbuka Semua Domisili"
                className="flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent box-border min-h-[36px] leading-5"
              />
            </div>

            {/* Jenis Waktu Kerja */}
            <div className="w-full">
              <Select
                label="Jenis Waktu Kerja"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                options={[
                  { value: 'Penuh Waktu (Full-Time)', label: 'Penuh Waktu (Full-Time)' },
                  { value: 'Paruh Waktu (Part-Time)', label: 'Paruh Waktu (Part-Time)' },
                  { value: 'Kontrak (PKWT)', label: 'Kontrak (PKWT)' },
                  { value: 'Magang (Internship)', label: 'Magang (Internship)' },
                  { value: 'Freelance / Proyek', label: 'Freelance / Proyek' },
                ]}
              />
            </div>

            {/* Model Kerja */}
            <div className="w-full">
              <Select
                label="Model Kerja"
                value={workModel}
                onChange={(e) => setWorkModel(e.target.value)}
                options={[
                  { value: 'On-site (WFO)', label: 'On-site (WFO)' },
                  { value: 'Hybrid', label: 'Hybrid' },
                  { value: 'Remote (WFH)', label: 'Remote (WFH)' },
                ]}
              />
            </div>

            {/* Batas Akhir Lamaran (Ghost Date Picker with Static Formatted Text - SPEC_INPUT_TYPE) */}
            <div className="w-full">
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Batas Akhir Pendaftaran <span className="text-red-500">*</span>
              </label>
              <div 
                onClick={handleDateContainerClick}
                className="relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px] transition-all focus-within:border-blue-500 focus-within:ring-1 cursor-pointer"
              >
                {/* Teks statis terformat rapi sesuai tanggal yang dipilih */}
                <span className={`flex-1 text-xs truncate select-none ${applicationDeadline ? 'text-slate-900 font-normal' : 'text-slate-400 font-normal'}`}>
                  {applicationDeadline ? formatDateDisplay(applicationDeadline) : 'Pilih batas waktu pendaftaran...'}
                </span>
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 ml-2" />

                {/* Input Date Transparan Menutupi Seluruh Area Kotak */}
                <input 
                  ref={dateInputRef}
                  type="date" 
                  value={applicationDeadline || ''}
                  onChange={(e) => {
                    if (e.target.value) setApplicationDeadline(e.target.value);
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base"
                />
              </div>
            </div>

          </div>

          {/* Modal Footer (Standard SPEC_MODAL, Single Action, Full Width, No Cancel Button) */}
          <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={handleFinalCreateVacancy}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Buat Lowongan Sekarang
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
