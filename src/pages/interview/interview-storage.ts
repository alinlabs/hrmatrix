import { InterviewChecklistItem, InterviewRecord, RecommendationStatus, SampleCandidateProfile } from './types';
import { getStoredVacancies } from '../lowongan/storage-helper';
import { getStoredCandidates } from '../lowongan/storage-helper';

const INTERVIEW_STORAGE_KEY = 'hrmatrix_interview_records_v1';

export const DEFAULT_CHECKLIST_ITEMS: InterviewChecklistItem[] = [
  {
    id: 'chk-tech-1',
    category: 'Kompetensi Teknis & Pengalaman',
    label: 'Kesesuaian Pengalaman Kerja & Portofolio',
    description: 'Pemahaman mendalam tentang tanggung jawab utama, proyek masa lalu, dan rekam jejak hasil kerja.',
    score: 4,
    notes: 'Pengalaman sangat relevan dengan kebutuhan divisi.'
  },
  {
    id: 'chk-tech-2',
    category: 'Kompetensi Teknis & Pengalaman',
    label: 'Penguasaan Tools, Hard Skills & Metodologi',
    description: 'Tingkat akurasi teknis, keahlian software/sistem, dan standar kerja profesional.',
    score: 4,
    notes: 'Menguasai instrumen dan tools teknis standar industri.'
  },
  {
    id: 'chk-tech-3',
    category: 'Kompetensi Teknis & Pengalaman',
    label: 'Metode Problem Solving & Analisa Masalah',
    description: 'Pendekatan logis, terstruktur, dan efektif dalam menyelesaikan kendala operasional.',
    score: 4,
    notes: 'Mampu memberikan contoh konkret penyelesaian insiden kerja.'
  },
  {
    id: 'chk-soft-1',
    category: 'Soft Skills & Perilaku',
    label: 'Kejelasan & Kemampuan Komunikasi',
    description: 'Kemampuan menyampaikan gagasan secara terstruktur, percaya diri, dan mendengarkan dengan baik.',
    score: 4,
    notes: 'Penyampaian jawaban jelas dan langsung pada poin utama.'
  },
  {
    id: 'chk-soft-2',
    category: 'Soft Skills & Perilaku',
    label: 'Kerja Sama Tim & Adaptabilitas',
    description: 'Gaya berkolaborasi lintas tim, keterbukaan terhadap masukan, dan penyesuaian budaya kerja.',
    score: 5,
    notes: 'Memiliki mindset kolaboratif yang kuat.'
  },
  {
    id: 'chk-soft-3',
    category: 'Soft Skills & Perilaku',
    label: 'Inisiatif & Resiliensi',
    description: 'Sikap proaktif mencari solusi mandiri dan ketahanan mental di bawah tekanan kerja.',
    score: 4,
    notes: 'Proaktif dan siap menghadapi tantangan dinamis.'
  },
  {
    id: 'chk-cult-1',
    category: 'Culture Fit & Motivasi',
    label: 'Motivasi Melamar & Antusiasme',
    description: 'Pemahaman tentang produk/bisnis perusahaan dan dorongan internal untuk berkembang.',
    score: 5,
    notes: 'Riset perusahaan dengan baik sebelum sesi wawancara.'
  },
  {
    id: 'chk-cult-2',
    category: 'Culture Fit & Motivasi',
    label: 'Kesesuaian Ekspektasi Gaji & Tanggal Mulai',
    description: 'Fleksibilitas paket kompensasi dan kepastian tanggal efektif siap bergabung.',
    score: 4,
    notes: 'Ekspektasi gaji sesuai anggaran dan siap join 2 minggu Notice Period.'
  },
  {
    id: 'chk-cult-3',
    category: 'Culture Fit & Motivasi',
    label: 'Integritas, Etika & Profesionalisme',
    description: 'Gestur sopan, kejujuran penyampaian fakta, dan reputasi profesional.',
    score: 5,
    notes: 'Menunjukkan etika wawancara yang sangat matang.'
  },
  {
    id: 'chk-lead-1',
    category: 'Kepemimpinan & Problem Solving',
    label: 'Manajemen Tugas & Skala Prioritas',
    description: 'Kapasitas mengelola alokasi waktu dan multinegosiasi tenggat pekerjaan.',
    score: 4,
    notes: 'Terbiasa mengatur jadwal kerja dengan sistemik.'
  }
];

export function calculateScoreFromChecklist(items: InterviewChecklistItem[]): number {
  if (!items || items.length === 0) return 0;
  const maxPossible = items.length * 5;
  const totalEarned = items.reduce((acc, curr) => acc + (curr.score || 0), 0);
  return Math.round((totalEarned / maxPossible) * 100);
}

export const SAMPLE_CANDIDATES: SampleCandidateProfile[] = [
  {
    id: 'CAND-101',
    vacancyId: 'VAC-1001',
    vacancyTitle: 'Direktur Operasional',
    name: 'Ir. Hendra Wijaya, M.M.',
    email: 'hendra.wijaya@gmail.com',
    phone: '0812-9876-5432',
    atsScore: 88,
    testScore: 85,
    testPackageName: 'Kepemimpinan & Manajemen Strategis'
  },
  {
    id: 'CAND-102',
    vacancyId: 'VAC-1001',
    vacancyTitle: 'Direktur Operasional',
    name: 'Budi Santoso, S.T.',
    email: 'budi.santoso@yahoo.com',
    phone: '0813-1122-3344',
    atsScore: 82,
    testScore: 78,
    testPackageName: 'Kepemimpinan & Manajemen Strategis'
  },
  {
    id: 'CAND-103',
    vacancyId: 'VAC-1002',
    vacancyTitle: 'Senior Software Engineer',
    name: 'Anisa Rahma, S.Kom.',
    email: 'anisa.rahma@devmail.com',
    phone: '0857-4433-2211',
    atsScore: 92,
    testScore: 90,
    testPackageName: 'Potensi Akademik & Penalaran Logis'
  },
  {
    id: 'CAND-104',
    vacancyId: 'VAC-1002',
    vacancyTitle: 'Senior Software Engineer',
    name: 'Dimas Pratama',
    email: 'dimas.pratama@tech.id',
    phone: '0818-7788-9900',
    atsScore: 80,
    testScore: 82,
    testPackageName: 'Potensi Akademik & Penalaran Logis'
  },
  {
    id: 'CAND-105',
    vacancyId: 'VAC-1003',
    vacancyTitle: 'Staff SDM & Remunerasi',
    name: 'Citra Dewi, S.Psi.',
    email: 'citra.dewi@hrportal.org',
    phone: '0811-2233-4455',
    atsScore: 85,
    testScore: 88,
    testPackageName: 'DISC Profil Kepribadian Kerja'
  }
];

export function getSampleInterviewRecords(): InterviewRecord[] {
  return [
    {
      id: 'INT-001',
      vacancyId: 'VAC-1001',
      vacancyTitle: 'Direktur Operasional',
      candidateId: 'CAND-101',
      candidateName: 'Ir. Hendra Wijaya, M.M.',
      candidateEmail: 'hendra.wijaya@gmail.com',
      candidatePhone: '0812-9876-5432',
      interviewerName: 'Tim Board of Directors',
      interviewDate: '2026-10-02',
      interviewStage: 'User / Technical Interview',
      checklists: DEFAULT_CHECKLIST_ITEMS.map((item, idx) => ({
        ...item,
        score: idx % 3 === 0 ? 5 : 4
      })),
      calculatedScore: 88,
      strengths: ['Pengalaman manajerial > 10 tahun', 'Visi strategi ekspansi operasional jelas', 'Gaya komunikasi tenang dan persuasif'],
      areasToProbe: ['Ekspektasi insentif kinerja tahunan'],
      generalNotes: 'Kandidat menunjukkan penguasaan eksekutif yang matang. Sangat direkomendasikan untuk posisi Direktur Operasional.',
      recommendation: 'Sangat Direkomendasikan',
      createdAt: '2026-10-02',
      updatedAt: '2026-10-02'
    },
    {
      id: 'INT-002',
      vacancyId: 'VAC-1002',
      vacancyTitle: 'Senior Software Engineer',
      candidateId: 'CAND-103',
      candidateName: 'Anisa Rahma, S.Kom.',
      candidateEmail: 'anisa.rahma@devmail.com',
      candidatePhone: '0857-4433-2211',
      interviewerName: 'VP of Engineering & HR Lead',
      interviewDate: '2026-10-03',
      interviewStage: 'User / Technical Interview',
      checklists: DEFAULT_CHECKLIST_ITEMS.map((item) => ({
        ...item,
        score: item.id.includes('soft') ? 5 : 4
      })),
      calculatedScore: 86,
      strengths: ['Kemampuan koding dan arsitektur mikroservis prima', 'Portofolio aplikasi skala besar lengkap', 'Komunikasi teknis sangat runut'],
      areasToProbe: ['Ketersediaan tanggal bergabung'],
      generalNotes: 'Sangat kuat secara teknis dan budaya kerja fit dengan tim engineering.',
      recommendation: 'Sangat Direkomendasikan',
      createdAt: '2026-10-03',
      updatedAt: '2026-10-03'
    }
  ];
}

export function getStoredInterviewRecords(): InterviewRecord[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return getSampleInterviewRecords();
    }
    const raw = localStorage.getItem(INTERVIEW_STORAGE_KEY);
    if (!raw) {
      const samples = getSampleInterviewRecords();
      localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(samples));
      return samples;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load interview records:', e);
    return getSampleInterviewRecords();
  }
}

export function saveInterviewRecord(record: InterviewRecord): InterviewRecord[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [record];
    const current = getStoredInterviewRecords();
    const existingIdx = current.findIndex(r => r.id === record.id || (r.candidateId === record.candidateId && r.interviewStage === record.interviewStage));
    let updated: InterviewRecord[];

    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = {
        ...record,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    } else {
      updated = [
        {
          ...record,
          createdAt: record.createdAt || new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        },
        ...current
      ];
    }

    localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save interview record:', e);
    return [];
  }
}

export function deleteInterviewRecord(id: string): InterviewRecord[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const current = getStoredInterviewRecords();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete interview record:', e);
    return [];
  }
}

// Fetch candidates list from stored vacancies or default sample candidates
export function getAllCandidatesForInterview(): SampleCandidateProfile[] {
  const resultList: SampleCandidateProfile[] = [...SAMPLE_CANDIDATES];

  // Try fetching dynamic candidates from localStorage stored vacancies
  try {
    const vacancies = getStoredVacancies();
    vacancies.forEach(vac => {
      const candidates = getStoredCandidates(vac.id);
      candidates.forEach(cand => {
        if (!resultList.some(r => r.id === cand.id || (r.email === cand.contactEmail && r.vacancyId === vac.id))) {
          resultList.push({
            id: cand.id,
            vacancyId: vac.id,
            vacancyTitle: vac.jobTitle,
            name: cand.name,
            email: cand.contactEmail || 'candidate@mail.com',
            phone: cand.contactPhone || '0812-0000-0000',
            atsScore: cand.matchScore || 75,
            testScore: 80,
            testPackageName: 'Potensi Akademik & Profil Kerja'
          });
        }
      });
    });
  } catch (e) {
    // fallback
  }

  return resultList;
}
