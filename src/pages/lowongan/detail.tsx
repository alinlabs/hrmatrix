import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  Search, 
  ShieldCheck,
  UserCheck,
  UserPlus,
  Info,
  ChevronDown,
  X,
  AlertCircle,
  Eye,
  Download,
  Award,
  ListChecks,
  Plus,
  Clock,
  Sparkles
} from 'lucide-react';
import { PageHeaderTitle, MobileBottomBar, DesktopHeaderActions, MobileHeaderActions, PageHeaderSubbar } from '../../context/MobileNavContext';
import { VacancyItem, Candidate } from './types';
import { JobTemplate, ModalTab } from '../job-desk/types';
import { ModalTemplateDetail } from '../job-desk/modal-template-detail';
import { ModalCandidateDetail } from './modal-candidate-detail';
import { getStoredVacancies, getStoredCandidates, saveCandidates } from './storage-helper';
import { extractTextFromPdf } from '../../utils/pdf-parser';
import { parseCandidateInfoFromText, evaluateCandidateAgainstVacancy } from './ats-parser-standard';
import { formatRupiah } from './utils-ats';

function createFallbackTemplate(vacancy: VacancyItem): JobTemplate {
  return {
    id: vacancy.jobTemplateId || vacancy.id,
    nama: vacancy.jobTitle,
    kategori: 'Umum',
    departemen: vacancy.department,
    divisi: vacancy.division || vacancy.department,
    level: vacancy.level || 'Staff',
    atasanLangsung: '-',
    tujuanJabatan: vacancy.atsBreakdown?.roleSummary || `Menjalankan fungsi ${vacancy.jobTitle} di departemen ${vacancy.department}.`,
    fungsiUtama: vacancy.atsBreakdown?.coreResponsibilities || [],
    tanggungJawab: vacancy.atsBreakdown?.coreResponsibilities || [],
    wewenang: [],
    kpi: [],
    kualifikasi: {
      pendidikan: vacancy.atsBreakdown?.mandatoryQualifications?.education || '-',
      pengalaman: vacancy.atsBreakdown?.mandatoryQualifications?.experience || '-',
      sertifikasi: vacancy.atsBreakdown?.mandatoryQualifications?.certifications || [],
      syaratKhusus: vacancy.atsBreakdown?.preferredQualifications?.specialRequirements || [],
    },
    kompetensi: {
      teknis: vacancy.atsBreakdown?.mandatoryQualifications?.hardSkills || [],
      nonTeknis: vacancy.atsBreakdown?.preferredQualifications?.softSkills || [],
    },
    hubunganKerja: { internal: [], eksternal: [] },
    outputDiharapkan: [],
    kompensasi: {
      gajiPokok: {
        minimal: vacancy.salaryMin || 0,
        standar: ((vacancy.salaryMin || 0) + (vacancy.salaryMax || 0)) / 2,
        maksimal: vacancy.salaryMax || 0,
      },
      tunjangan: [],
      bpjs: [],
      fasilitas: vacancy.atsBreakdown?.benefitsAndFacilities || [],
    },
    dokumenAdministrasi: {
      wajib: vacancy.atsBreakdown?.mandatoryQualifications?.mandatoryDocs || [],
      pendukung: [],
      khusus: [],
    },
  };
}

export const VacancyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState<VacancyItem | null>(null);
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<JobTemplate | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>('kualifikasi');
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<Candidate | null>(null);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const stored = getStoredVacancies();
      const found = stored.find(v => v.id === id);
      if (found) {
        setVacancy(found);
        const storedCands = getStoredCandidates(id);
        setCandidates(storedCands);
      }
    }
  }, [id]);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const dataUrlToArrayBuffer = (dataUrl: string): ArrayBuffer => {
    const base64 = dataUrl.split(',')[1] || dataUrl;
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !vacancy) return;
    
    const newCandidates: Candidate[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert(`File ${file.name} bukan PDF. Hanya PDF yang didukung.`);
        continue;
      }
      
      try {
        const fileDataUrl = await readFileAsDataUrl(file);
        let extractedText = '';
        try {
          const buffer = await file.arrayBuffer();
          extractedText = await extractTextFromPdf(buffer);
        } catch (e) {
          console.warn('Initial extract failed:', e);
        }

        const fallbackName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        const info = parseCandidateInfoFromText(extractedText, fallbackName);

        const cand: Candidate = {
          id: `CAND-${Date.now()}-${i}`,
          name: info.name,
          contactEmail: info.email,
          contactPhone: info.phone,
          fileName: file.name,
          file,
          fileDataUrl,
          uploadedAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
          matchScore: 0,
          status: 'Pending',
          extractedText,
          matchedKeywords: [],
          missingKeywords: [],
          parsedDetail: {
            address: info.address,
            socialMedia: info.socialMedia,
            summary: info.summary,
            workExperiences: info.workExperiences,
            experienceSummary: info.experienceSummary,
            educationHistory: info.educationHistory
          }
        };
        
        newCandidates.push(cand);
      } catch (err) {
        console.error('Error attaching file:', err);
        alert(`Gagal melampirkan file ${file.name}`);
      }
    }

    setCandidates(prev => {
      const updated = [...prev, ...newCandidates];
      saveCandidates(vacancy.id, updated);
      return updated;
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCandidate = (idToRemove: string) => {
    if (!vacancy) return;
    setCandidates(prev => {
      const updated = prev.filter(c => c.id !== idToRemove);
      saveCandidates(vacancy.id, updated);
      return updated;
    });
  };

  const handleMatchCandidates = async (onlyUnscored: boolean = false) => {
    if (!vacancy || candidates.length === 0) return;
    setIsParsing(true);
    
    try {
      // Extract text for each candidate if not extracted yet, then calculate match score using comprehensive ATS Evaluation
      const processed: Candidate[] = [];

      for (const cand of candidates) {
        // Skip already scored candidates if onlyUnscored is true
        if (onlyUnscored && cand.status === 'Scored') {
          processed.push(cand);
          continue;
        }

        let fullText = cand.extractedText || '';
        
        // If not extracted yet, extract now from file or fileDataUrl
        if (!fullText) {
          try {
            let buffer: ArrayBuffer | null = null;
            if (cand.file) {
              buffer = await cand.file.arrayBuffer();
            } else if (cand.fileDataUrl) {
              buffer = dataUrlToArrayBuffer(cand.fileDataUrl);
            }

            if (buffer) {
              fullText = await extractTextFromPdf(buffer);
            }
          } catch (extErr) {
            console.warn(`Error extracting text for candidate ${cand.fileName}:`, extErr);
          }
        }

        const fallbackName = cand.fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        const info = parseCandidateInfoFromText(fullText, cand.name || fallbackName);

        // Run deep ATS evaluation including Duties, Technical skills, Qualifications, and Soft Skills
        const evaluation = evaluateCandidateAgainstVacancy(vacancy, fullText);

        processed.push({
          ...cand,
          name: info.name,
          contactEmail: info.email,
          contactPhone: info.phone,
          extractedText: fullText,
          matchScore: evaluation.totalScore,
          matchedKeywords: evaluation.matchedKeywords,
          missingKeywords: evaluation.missingKeywords,
          matchedResponsibilities: evaluation.responsibilities,
          atsMatchBreakdown: evaluation,
          status: 'Scored',
          parsedDetail: {
            address: info.address,
            socialMedia: info.socialMedia,
            summary: info.summary,
            workExperiences: info.workExperiences,
            experienceSummary: info.experienceSummary,
            educationHistory: info.educationHistory,
            achievements: info.achievements,
            certifications: info.certifications,
            skillSet: info.skillSet,
            potentialAnalysis: evaluation.potentialAnalysis
          }
        });
      }

      // Sort by highest match score
      processed.sort((a, b) => b.matchScore - a.matchScore);

      setCandidates(processed);
      saveCandidates(vacancy.id, processed);
    } finally {
      setIsParsing(false);
    }
  };

  if (!vacancy) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Lowongan tidak ditemukan</h2>
        <button 
          onClick={() => navigate('/screening')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
      {/* Dynamic Header dengan Icon Chevron Left Kembali & Judul Posisi Adaptif */}
      <PageHeaderTitle
        title={vacancy.jobTitle.length > 20 ? vacancy.jobTitle.slice(0, 19) + '…' : vacancy.jobTitle}
        subtitle="Kualifikasi & evaluasi pelamar"
        onBack={() => navigate('/screening')}
      />

      {/* Hidden File Input for PDF Uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="application/pdf"
        multiple 
        className="hidden" 
      />

      {/* Header Actions: Tombol Lihat Detail Posisi, Tambah Pelamar, & Chevron Toggle Spesifikasi di Paling Kanan */}
      <DesktopHeaderActions>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveModalTab('seputar');
              setSelectedRoleDetail(vacancy.rawJobTemplate || createFallbackTemplate(vacancy));
            }}
            className="h-9 px-3.5 bg-white hover:bg-blue-50/80 border border-slate-200 active:scale-95 text-blue-600 font-semibold text-xs sm:text-sm rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Info className="w-4 h-4 text-blue-600" />
            <span>Lihat Detail Posisi</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Tambah Pelamar</span>
          </button>

          {/* Tombol Chevron Down Paling Kanan untuk Toggle Spesifikasi Lowongan */}
          <button
            type="button"
            onClick={() => setIsSpecsOpen(prev => !prev)}
            className={`h-9 w-9 bg-white hover:bg-slate-50 border border-slate-200 active:scale-95 font-semibold rounded-xl shadow-2xs transition-all flex items-center justify-center cursor-pointer shrink-0 ${
              isSpecsOpen ? 'bg-blue-50/90 border-blue-300 text-blue-600' : 'text-slate-600'
            }`}
            title={isSpecsOpen ? "Sembunyikan Spesifikasi Lowongan" : "Tampilkan Spesifikasi Lowongan"}
            aria-label="Toggle Spesifikasi Lowongan"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSpecsOpen ? 'rotate-180 text-blue-600' : 'text-slate-600'}`} />
          </button>
        </div>
      </DesktopHeaderActions>

      <MobileHeaderActions>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveModalTab('seputar');
              setSelectedRoleDetail(vacancy.rawJobTemplate || createFallbackTemplate(vacancy));
            }}
            className="h-8 px-2.5 bg-white hover:bg-blue-50/80 border border-slate-200 active:scale-95 text-blue-600 font-semibold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Detail Posisi</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
            <span>Tambah Pelamar</span>
          </button>

          {/* Tombol Chevron Down Paling Kanan Mobile */}
          <button
            type="button"
            onClick={() => setIsSpecsOpen(prev => !prev)}
            className={`h-8 w-8 bg-white hover:bg-slate-50 border border-slate-200 active:scale-95 font-semibold rounded-lg shadow-2xs transition-all flex items-center justify-center cursor-pointer shrink-0 ${
              isSpecsOpen ? 'bg-blue-50/90 border-blue-300 text-blue-600' : 'text-slate-600'
            }`}
            title={isSpecsOpen ? "Sembunyikan Spesifikasi" : "Tampilkan Spesifikasi"}
            aria-label="Toggle Spesifikasi Lowongan"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSpecsOpen ? 'rotate-180 text-blue-600' : 'text-slate-600'}`} />
          </button>
        </div>
      </MobileHeaderActions>

      {/* Header Subbar Portal: Ringkasan Spesifikasi Lowongan (Default Disembunyikan, Mungcul/Sembunyi via Chevron) */}
      {isSpecsOpen && (
        <PageHeaderSubbar>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-2 sm:py-2.5 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
              {/* Item 1: Penempatan */}
              <div className="p-2 sm:p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center flex flex-col justify-center">
                <div className="text-[10px] sm:text-[11px] font-normal text-slate-500">Penempatan</div>
                <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.location}>
                  {vacancy.location || '-'}
                </div>
              </div>

              {/* Item 2: Domisili Kandidat */}
              <div className="p-2 sm:p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center flex flex-col justify-center">
                <div className="text-[10px] sm:text-[11px] font-normal text-slate-500">Domisili Kandidat</div>
                <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.candidateDomicile || 'Terbuka Semua Domisili'}>
                  {vacancy.candidateDomicile || 'Terbuka Semua Domisili'}
                </div>
              </div>

              {/* Item 3: Jenis Waktu */}
              <div className="p-2 sm:p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center flex flex-col justify-center">
                <div className="text-[10px] sm:text-[11px] font-normal text-slate-500">Jenis Waktu</div>
                <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.workType}>
                  {vacancy.workType || '-'}
                </div>
              </div>

              {/* Item 4: Model Kerja */}
              <div className="p-2 sm:p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center flex flex-col justify-center">
                <div className="text-[10px] sm:text-[11px] font-normal text-slate-500">Model Kerja</div>
                <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.workModel}>
                  {vacancy.workModel || '-'}
                </div>
              </div>

              {/* Item 5: Rentang Gaji */}
              <div className="p-2 sm:p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-0.5 text-center flex flex-col justify-center col-span-2 sm:col-span-1">
                <div className="text-[10px] sm:text-[11px] font-normal text-slate-500">Rentang Gaji</div>
                <div className="text-xs font-semibold text-slate-800 truncate" title={vacancy.salaryDisplay && vacancy.salaryMin ? `${formatRupiah(vacancy.salaryMin)} - ${formatRupiah(vacancy.salaryMax)}` : 'Dirahasiakan'}>
                  {vacancy.salaryDisplay && vacancy.salaryMin
                    ? `${formatRupiah(vacancy.salaryMin)} - ${formatRupiah(vacancy.salaryMax)}`
                    : 'Dirahasiakan'}
                </div>
              </div>
            </div>
          </div>
        </PageHeaderSubbar>
      )}

      {/* Section Candidate Grid (Tanpa Judul "Daftar Pelamar", Card Hanya Berisi Icon, Nama File & Waktu Diunggah) */}
      {candidates.length === 0 ? (
        /* Empty State: Full-width dashed upload box */
        <div className="pt-2 pb-2 w-full">
          <div 
            className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white rounded-3xl py-12 px-6 sm:py-16 flex flex-col items-center justify-center text-center hover:bg-blue-50/30 transition-all cursor-pointer shadow-2xs group w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-800">Klik untuk upload file CV Pelamar</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Hanya mendukung file .pdf (Bisa pilih multiple file)</p>
          </div>
        </div>
      ) : (
        /* Candidates Grid: 3 cards per row on desktop (lg:grid-cols-3) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
          {candidates.map((cand) => (
            <div 
              key={cand.id} 
              onClick={() => setSelectedCandidateForModal(cand)}
              className="p-3.5 sm:p-4 bg-white border border-slate-200/90 rounded-2xl hover:border-blue-400 hover:shadow-xs transition-all shadow-2xs cursor-pointer group w-full flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors truncate" title={cand.fileName || cand.name}>
                    {cand.fileName || cand.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    Diunggah: {cand.uploadedAt || 'Baru Saja'}
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCandidate(cand.id);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Hapus Kandidat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation Component: Tombol "Dapatkan Kandidat Terbaik" (Hanya muncul jika sudah ada file) */}
      {candidates.length > 0 && (() => {
        const totalCandidates = candidates.length;
        const scoredCount = candidates.filter(c => c.status === 'Scored').length;
        const unscoredCount = totalCandidates - scoredCount;
        const hasScored = scoredCount > 0;
        const isMixed = hasScored && unscoredCount > 0;

        return (
          <MobileBottomBar>
            <div className="flex flex-col items-center justify-center w-full py-1 gap-2.5">
              <button
                type="button"
                onClick={() => handleMatchCandidates(false)}
                disabled={isParsing}
                className="w-full py-3 px-5 active:scale-[0.99] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isParsing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengekstrak & Memindai CV...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>{hasScored ? 'Regenerasi Penilaian' : 'Dapatkan Kandidat Terbaik'}</span>
                  </>
                )}
              </button>

              {isMixed && !isParsing && (
                <button
                  type="button"
                  onClick={() => handleMatchCandidates(true)}
                  className="w-full py-2.5 px-4 active:scale-[0.99] bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs sm:text-sm rounded-xl transition-all focus:outline-none cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  Pertahankan Sebagian & Regenerasi Yang Kosong
                </button>
              )}
            </div>
          </MobileBottomBar>
        );
      })()}
      {/* Modal Detail Job Desk Template */}
      <ModalTemplateDetail
        selectedRoleDetail={selectedRoleDetail}
        onClose={() => setSelectedRoleDetail(null)}
        activeModalTab={activeModalTab}
        setActiveModalTab={setActiveModalTab}
      />

      {/* Modal Candidate Detail (Ringkasan | Kecocokan | Pdf File) */}
      <ModalCandidateDetail
        isOpen={!!selectedCandidateForModal}
        candidate={selectedCandidateForModal}
        vacancy={vacancy}
        onClose={() => setSelectedCandidateForModal(null)}
        onProceedToInterview={(cand) => {
          if (vacancy) {
            setCandidates(prev => {
              const updated = prev.map(c => c.id === cand.id ? { ...c, status: 'Candidate' as any } : c);
              saveCandidates(vacancy.id, updated);
              return updated;
            });
          }
        }}
      />
    </div>
  );
};

