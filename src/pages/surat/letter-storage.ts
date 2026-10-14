import { OfficialLetterDocument } from './types';
import { createInitialLetterDraft } from './letter-templates';

const STORAGE_KEY = 'hrmatrix_saved_official_letters';

const DEFAULT_SAMPLE_LETTERS: OfficialLetterDocument[] = [
  {
    ...createInitialLetterDraft('SK_PROMOSI'),
    id: 'letter-sample-01',
    letterNumber: '088/SK-PROMOSI/DIR/X/2026',
    title: 'SURAT KEPUTUSAN DIREKSI TENTANG PROMOSI JABATAN & PENYESUAIAN UPAH',
    employee: {
      fullName: 'Rian Pratama, S.T.',
      nik: 'EMP-2023-014',
      positionTitle: 'Lead Software Architect',
      department: 'Technology & Development',
      jobGrade: 'Grade 8 (Lead)',
      startDate: '2023-02-01'
    }
  },
  {
    ...createInitialLetterDraft('SP1'),
    id: 'letter-sample-02',
    letterNumber: '042/HRD-SP1/X/2026',
    title: 'SURAT PERINGATAN PERTAMA (SP 1)',
    employee: {
      fullName: 'Anisa Rahmawati, S.E.',
      nik: 'EMP-2024-102',
      positionTitle: 'Marketing Executive',
      department: 'Growth Marketing',
      jobGrade: 'Grade 5',
      startDate: '2024-05-10'
    }
  },
  {
    ...createInitialLetterDraft('PAKLARING'),
    id: 'letter-sample-03',
    letterNumber: '115/SKK-EXP/X/2026',
    title: 'SURAT KETERANGAN PENGALAMAN KERJA (PAKLARING)',
    employee: {
      fullName: 'Dian Permata Sari, S.I.Kom.',
      nik: 'EMP-2022-045',
      positionTitle: 'Senior Public Relations Specialist',
      department: 'Corporate Communications',
      jobGrade: 'Grade 6',
      startDate: '2022-03-01'
    }
  },
  {
    ...createInitialLetterDraft('SK_MUTASI'),
    id: 'letter-sample-04',
    letterNumber: '031/SK-MUTASI/DIR/X/2026',
    title: 'SURAT KEPUTUSAN DIREKSI TENTANG MUTASI & ROTASI KERJA',
    employee: {
      fullName: 'Fajar Nugraha',
      nik: 'EMP-2023-088',
      positionTitle: 'Branch Operations Lead',
      department: 'Branch Surabaya',
      jobGrade: 'Grade 6',
      startDate: '2023-08-15'
    }
  },
  {
    ...createInitialLetterDraft('SURAT_TUGAS'),
    id: 'letter-sample-05',
    letterNumber: '077/ST-DINAS/HRD/X/2026',
    title: 'SURAT PERINTAH TUGAS & PERJALANAN DINAS RESMI',
    employee: {
      fullName: 'Bagas Aditya, S.Kom.',
      nik: 'EMP-2024-022',
      positionTitle: 'Technical Support Lead',
      department: 'IT Infrastructure',
      jobGrade: 'Grade 6',
      startDate: '2024-02-20'
    }
  }
];

export function getSavedLetters(): OfficialLetterDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_LETTERS));
      return DEFAULT_SAMPLE_LETTERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_LETTERS));
      return DEFAULT_SAMPLE_LETTERS;
    }
    return parsed;
  } catch {
    return DEFAULT_SAMPLE_LETTERS;
  }
}

export function saveLetterToStorage(letter: OfficialLetterDocument): OfficialLetterDocument[] {
  try {
    const current = getSavedLetters();
    const existingIndex = current.findIndex(l => l.id === letter.id);
    let updated: OfficialLetterDocument[];

    const timestamped: OfficialLetterDocument = {
      ...letter,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = timestamped;
    } else {
      updated = [timestamped, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getSavedLetters();
  }
}

export function deleteLetterFromStorage(letterId: string): OfficialLetterDocument[] {
  try {
    const current = getSavedLetters();
    const updated = current.filter(l => l.id !== letterId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getSavedLetters();
  }
}

export function duplicateLetterInStorage(letterId: string): { duplicatedDoc: OfficialLetterDocument | null; list: OfficialLetterDocument[] } {
  try {
    const current = getSavedLetters();
    const target = current.find(l => l.id === letterId);
    if (!target) return { duplicatedDoc: null, list: current };

    const randomNum = Math.floor(100 + Math.random() * 900);
    const duplicated: OfficialLetterDocument = {
      ...JSON.parse(JSON.stringify(target)),
      id: `letter-${Date.now()}`,
      letterNumber: target.letterNumber.replace(/^\d+/, String(randomNum)),
      title: `${target.title} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [duplicated, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { duplicatedDoc: duplicated, list: updated };
  } catch {
    return { duplicatedDoc: null, list: getSavedLetters() };
  }
}
