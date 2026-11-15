import { VacancyItem, Candidate } from './types';
import { sampleVacancies, createSampleVacancies } from '../../data/sampleDb/lowongan';

const VACANCY_STORAGE_KEY = 'hrmatrix_vacancies_records_v1';
const CANDIDATE_STORAGE_PREFIX = 'hrmatrix_vacancy_candidates_';

export function getStoredCandidates(vacancyId: string): Candidate[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(`${CANDIDATE_STORAGE_PREFIX}${vacancyId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load candidate records:', e);
    return [];
  }
}

export function saveCandidates(vacancyId: string, candidates: Candidate[]): Candidate[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return candidates;
    const serializable = candidates.map(({ file, ...rest }) => rest);
    localStorage.setItem(`${CANDIDATE_STORAGE_PREFIX}${vacancyId}`, JSON.stringify(serializable));
    return candidates;
  } catch (e) {
    console.error('Failed to save candidate records:', e);
    return candidates;
  }
}

export function getInitialSampleVacancies(companyName?: string): VacancyItem[] {
  return createSampleVacancies(companyName);
}

export function getStoredVacancies(): VacancyItem[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(VACANCY_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load stored vacancies:', e);
    return [];
  }
}

export function saveVacancy(vacancy: VacancyItem): VacancyItem[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [vacancy];
    const current = getStoredVacancies();
    const existingIndex = current.findIndex(v => v.id === vacancy.id);
    let updated: VacancyItem[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = {
        ...vacancy,
        updatedAt: new Date().toISOString().split('T')[0],
      };
    } else {
      updated = [
        {
          ...vacancy,
          createdAt: vacancy.createdAt || new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        },
        ...current,
      ];
    }

    localStorage.setItem(VACANCY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save vacancy:', e);
    return [];
  }
}

export function deleteVacancy(id: string): VacancyItem[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const current = getStoredVacancies();
    const updated = current.filter(v => v.id !== id);
    localStorage.setItem(VACANCY_STORAGE_KEY, JSON.stringify(updated));
    try {
      localStorage.removeItem(`${CANDIDATE_STORAGE_PREFIX}${id}`);
    } catch (cleanErr) {
      // ignore
    }
    return updated;
  } catch (e) {
    console.error('Failed to delete vacancy:', e);
    return [];
  }
}

export function updateVacancyStatus(id: string, newStatus: VacancyItem['status']): VacancyItem[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const current = getStoredVacancies();
    const updated = current.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status: newStatus,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return v;
    });
    localStorage.setItem(VACANCY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update vacancy status:', e);
    return [];
  }
}
