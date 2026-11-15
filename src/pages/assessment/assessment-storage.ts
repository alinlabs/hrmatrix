import { TestPackage, TestQuestion } from './types';
import { assessmentPackages as defaultPackages } from './test-packages-data';
import { getAllUnifiedQuestions } from './banks';

const STORAGE_KEY_CUSTOM_PACKAGES = 'hrmatrix_assessment_custom_packages_v2';
const STORAGE_KEY_QUESTION_BANK = 'hrmatrix_assessment_question_bank_v3';
const STORAGE_KEY_ALL_PACKAGES = 'hrmatrix_assessment_packages_v3';

export interface PackageCustomization {
  packageId: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  targetAudience?: string;
  instructions?: string[];
  durationMinutes: number;
  selectedQuestionIds: string[];
  randomizePerCandidate?: boolean;
  subsetCount?: number;
  maxSessionExits?: number;
  updatedAt: string;
}

/**
 * Retrieves all stored packages from local storage.
 * Seeds with default packages on first load, and keeps question banks in sync.
 */
export function getStoredPackages(): TestPackage[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return defaultPackages.map((pkg) => getPackageWithBank(pkg));
    }
    const raw = localStorage.getItem(STORAGE_KEY_ALL_PACKAGES);
    if (!raw) {
      const defaults = defaultPackages.map((pkg) => getPackageWithBank(pkg));
      localStorage.setItem(STORAGE_KEY_ALL_PACKAGES, JSON.stringify(defaults));
      return defaults;
    }
    const parsed: TestPackage[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaults = defaultPackages.map((pkg) => getPackageWithBank(pkg));
      localStorage.setItem(STORAGE_KEY_ALL_PACKAGES, JSON.stringify(defaults));
      return defaults;
    }

    // Ensure questions and questionBanks stay synced with current getStoredQuestionBank()
    const currentBank = getStoredQuestionBank();
    const bankMap = new Map<string, TestQuestion>();
    currentBank.forEach((q) => bankMap.set(q.id, q));

    return parsed.map((pkg) => {
      const activeIds = pkg.selectedQuestionIds && pkg.selectedQuestionIds.length > 0
        ? pkg.selectedQuestionIds
        : pkg.questions ? pkg.questions.map((q) => q.id) : [];

      const activeQuestions = activeIds
        .map((id) => bankMap.get(id))
        .filter((q): q is TestQuestion => !!q)
        .map((q, idx) => ({ ...q, number: idx + 1 }));

      return {
        ...pkg,
        questionBank: currentBank,
        questions: activeQuestions,
        totalQuestions: activeQuestions.length,
        selectedQuestionIds: activeQuestions.map((q) => q.id)
      };
    });
  } catch (e) {
    console.error('Failed to load stored packages:', e);
    return defaultPackages.map((pkg) => getPackageWithBank(pkg));
  }
}

/**
 * Saves or updates an assessment package in local storage.
 */
export function savePackage(pkgToSave: TestPackage): TestPackage[] {
  try {
    const current = getStoredPackages();
    const idx = current.findIndex((p) => p.id === pkgToSave.id);
    let updated: TestPackage[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = pkgToSave;
    } else {
      updated = [...current, pkgToSave];
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ALL_PACKAGES, JSON.stringify(updated));
    }

    // Save customization mapping
    savePackageCustomization(pkgToSave.id, {
      title: pkgToSave.title,
      shortDescription: pkgToSave.shortDescription,
      fullDescription: pkgToSave.fullDescription,
      targetAudience: pkgToSave.targetAudience,
      instructions: pkgToSave.instructions,
      durationMinutes: pkgToSave.durationMinutes,
      selectedQuestionIds: pkgToSave.selectedQuestionIds || pkgToSave.questions.map((q) => q.id),
      randomizePerCandidate: pkgToSave.randomizePerCandidate,
      subsetCount: pkgToSave.subsetCount,
      maxSessionExits: pkgToSave.maxSessionExits
    });

    return updated;
  } catch (e) {
    console.error('Failed to save package:', e);
    return getStoredPackages();
  }
}

/**
 * Deletes an assessment package permanently from local storage.
 */
export function deletePackage(pkgId: string): TestPackage[] {
  try {
    const current = getStoredPackages();
    const updated = current.filter((p) => p.id !== pkgId);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ALL_PACKAGES, JSON.stringify(updated));
    }
    resetPackageCustomization(pkgId);
    return updated;
  } catch (e) {
    console.error('Failed to delete package:', e);
    return getStoredPackages();
  }
}

/**
 * Resets stored packages back to developer defaults.
 */
export function resetPackagesToDefault(): TestPackage[] {
  try {
    const defaults = defaultPackages.map((pkg) => getPackageWithBank(pkg));
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ALL_PACKAGES, JSON.stringify(defaults));
      localStorage.removeItem(STORAGE_KEY_CUSTOM_PACKAGES);
    }
    return defaults;
  } catch (e) {
    console.error('Failed to reset packages to default:', e);
    return defaultPackages.map((pkg) => getPackageWithBank(pkg));
  }
}

/**
 * Retrieves all stored question bank questions from local storage.
 * If no bank exists in local storage yet (first load), seeds it with the developer default questions.
 */
export function getStoredQuestionBank(): TestQuestion[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return getAllUnifiedQuestions();
    }
    const raw = localStorage.getItem(STORAGE_KEY_QUESTION_BANK);
    if (!raw) {
      const defaults = getAllUnifiedQuestions();
      localStorage.setItem(STORAGE_KEY_QUESTION_BANK, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaults = getAllUnifiedQuestions();
      localStorage.setItem(STORAGE_KEY_QUESTION_BANK, JSON.stringify(defaults));
      return defaults;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load stored question bank:', e);
    return getAllUnifiedQuestions();
  }
}

/**
 * Alias for backward compatibility
 */
export function getStoredCustomQuestions(packageId?: string): TestQuestion[] {
  return getStoredQuestionBank();
}

/**
 * Saves or updates a question in the local storage question bank.
 * Works for both newly created custom questions and edited developer questions.
 */
export function saveQuestionToBank(question: TestQuestion): TestQuestion[] {
  try {
    const current = getStoredQuestionBank();
    const idx = current.findIndex((q) => q.id === question.id);
    let updated: TestQuestion[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = question;
    } else {
      updated = [...current, question];
    }
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_QUESTION_BANK, JSON.stringify(updated));
    }
    return updated;
  } catch (e) {
    console.error('Failed to save question to bank:', e);
    return getStoredQuestionBank();
  }
}

/**
 * Alias for backward compatibility
 */
export function saveCustomQuestionToBank(packageId: string, question: TestQuestion): TestQuestion[] {
  return saveQuestionToBank(question);
}

/**
 * Deletes a question permanently from the local storage question bank.
 */
export function deleteQuestionFromBank(questionId: string): void {
  try {
    const current = getStoredQuestionBank();
    const updated = current.filter((q) => q.id !== questionId);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_QUESTION_BANK, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to delete question from bank:', e);
  }
}

/**
 * Resets the local storage question bank back to developer default questions.
 */
export function resetQuestionBankToDefault(): TestQuestion[] {
  try {
    const defaults = getAllUnifiedQuestions();
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_QUESTION_BANK, JSON.stringify(defaults));
    }
    return defaults;
  } catch (e) {
    console.error('Failed to reset question bank:', e);
    return getAllUnifiedQuestions();
  }
}

/**
 * Returns questions for a specific package category or all bank questions if requested
 */
export function getQuestionBankForPackage(packageId: string): TestQuestion[] {
  const bank = getStoredQuestionBank();
  switch (packageId) {
    case 'disc-personality':
    case 'disc':
    case 'pkg-sales-bizdev':
      return bank.filter((q) => q.category === 'personality');
    case 'cognitive-tpa':
    case 'kognitif':
    case 'pkg-it-engineering':
      return bank.filter((q) => q.category === 'cognitive');
    case 'situational-sjt':
    case 'sjt':
    case 'pkg-admin-ops':
      return bank.filter((q) => q.category === 'situational');
    case 'business-english':
    case 'english':
      return bank.filter((q) => q.category === 'language');
    case 'leadership-management':
    case 'leadership':
    case 'pkg-mt-leadership':
      return bank.filter((q) => q.category === 'leadership');
    default:
      return bank;
  }
}

// Get stored customizations map: packageId -> PackageCustomization
export function getStoredCustomizations(): Record<string, PackageCustomization> {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PACKAGES);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored package customizations:', e);
    return {};
  }
}

// Save package customization (selected question IDs, duration, title, descriptions, and anti-cheat randomization)
export function savePackageCustomization(
  packageId: string,
  customization: {
    title?: string;
    shortDescription?: string;
    fullDescription?: string;
    targetAudience?: string;
    instructions?: string[];
    durationMinutes: number;
    selectedQuestionIds: string[];
    randomizePerCandidate?: boolean;
    subsetCount?: number;
    maxSessionExits?: number;
  }
): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    const current = getStoredCustomizations();
    current[packageId] = {
      packageId,
      title: customization.title,
      shortDescription: customization.shortDescription,
      fullDescription: customization.fullDescription,
      targetAudience: customization.targetAudience,
      instructions: customization.instructions,
      durationMinutes: customization.durationMinutes,
      selectedQuestionIds: customization.selectedQuestionIds,
      randomizePerCandidate: customization.randomizePerCandidate ?? false,
      subsetCount: customization.subsetCount,
      maxSessionExits: customization.maxSessionExits ?? 0,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_CUSTOM_PACKAGES, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save package customization:', e);
  }
}

// Reset package to default questions & duration
export function resetPackageCustomization(packageId: string): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    const current = getStoredCustomizations();
    delete current[packageId];
    localStorage.setItem(STORAGE_KEY_CUSTOM_PACKAGES, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to reset package customization:', e);
  }
}

// Get a full package with its complete Question Bank and active selected questions
export function getPackageWithBank(pkg: TestPackage): TestPackage {
  // Complete Question Bank from local storage (or developer defaults if fresh)
  const fullQuestionBank = getStoredQuestionBank();

  // Check if HR has saved customization for this package
  const customizations = getStoredCustomizations();
  const customConfig = customizations[pkg.id] || customizations[pkg.slug];

  let title = pkg.title;
  let shortDescription = pkg.shortDescription;
  let fullDescription = pkg.fullDescription;
  let targetAudience = pkg.targetAudience;
  let instructions = pkg.instructions;
  let durationMinutes = pkg.durationMinutes;
  let activeQuestions = fullQuestionBank;
  let isCustomized = false;
  let randomizePerCandidate = false;
  let subsetCount: number | undefined = undefined;
  let maxSessionExits: number = pkg.maxSessionExits ?? 0;

  if (customConfig) {
    if (customConfig.title) title = customConfig.title;
    if (customConfig.shortDescription) shortDescription = customConfig.shortDescription;
    if (customConfig.fullDescription) fullDescription = customConfig.fullDescription;
    if (customConfig.targetAudience) targetAudience = customConfig.targetAudience;
    if (customConfig.instructions && customConfig.instructions.length > 0) instructions = customConfig.instructions;
    durationMinutes = customConfig.durationMinutes || pkg.durationMinutes;
    randomizePerCandidate = !!customConfig.randomizePerCandidate;
    subsetCount = customConfig.subsetCount;
    if (customConfig.maxSessionExits !== undefined) maxSessionExits = customConfig.maxSessionExits;

    if (customConfig.selectedQuestionIds && customConfig.selectedQuestionIds.length > 0) {
      const selectedSet = new Set(customConfig.selectedQuestionIds);
      const selected = fullQuestionBank.filter((q) => selectedSet.has(q.id));
      if (selected.length > 0) {
        activeQuestions = selected.map((q, idx) => ({ ...q, number: idx + 1 }));
        isCustomized = true;
      }
    }
  } else {
    // Fallback: match by default selectedQuestionIds or questions IDs if present
    if (pkg.selectedQuestionIds && pkg.selectedQuestionIds.length > 0) {
      const defaultSet = new Set(pkg.selectedQuestionIds);
      const matched = fullQuestionBank.filter((q) => defaultSet.has(q.id));
      if (matched.length > 0) {
        activeQuestions = matched.map((q, idx) => ({ ...q, number: idx + 1 }));
      }
    } else if (pkg.questions && pkg.questions.length > 0) {
      const defaultSet = new Set(pkg.questions.map((q) => q.id));
      const matched = fullQuestionBank.filter((q) => defaultSet.has(q.id));
      if (matched.length > 0) {
        activeQuestions = matched.map((q, idx) => ({ ...q, number: idx + 1 }));
      }
    }
  }

  return {
    ...pkg,
    title,
    shortDescription,
    fullDescription,
    targetAudience,
    instructions,
    durationMinutes,
    totalQuestions: activeQuestions.length,
    questions: activeQuestions,
    questionBank: fullQuestionBank,
    selectedQuestionIds: activeQuestions.map((q) => q.id),
    isCustomized,
    randomizePerCandidate,
    subsetCount,
    maxSessionExits
  };
}

// Get all packages with customization applied
export function getAllPackagesWithBank(): TestPackage[] {
  return getStoredPackages();
}

// Shuffle array utility (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Prepare candidate test questions (randomizes question order or picks subset if enabled)
export function prepareCandidateQuestions(pkg: TestPackage): TestQuestion[] {
  const pool = pkg.questions && pkg.questions.length > 0 
    ? pkg.questions 
    : (pkg.questionBank || []);

  let working = [...pool];

  if (pkg.randomizePerCandidate) {
    working = shuffleArray(working);
    if (pkg.subsetCount && pkg.subsetCount > 0 && pkg.subsetCount < working.length) {
      working = working.slice(0, pkg.subsetCount);
    }
  }

  // Re-number sequentially
  return working.map((q, idx) => ({
    ...q,
    number: idx + 1
  }));
}

// Parse URL params for candidates (handles custom questions, duration, and randomization)
export function resolvePackageFromParams(
  testSlugOrId: string,
  searchParams: URLSearchParams
): TestPackage | null {
  const basePackages = getAllPackagesWithBank();
  let base = basePackages.find(
    (p) => p.slug === testSlugOrId || p.id === testSlugOrId
  );
  if (!base && basePackages.length > 0) {
    base = basePackages[0];
  }
  if (!base) return null;

  // Check URL overrides
  const urlDuration = searchParams.get('dur');
  const urlQuestionIds = searchParams.get('qids');
  const urlRandomize = searchParams.get('rand');
  const urlSubset = searchParams.get('sub');

  let activeDuration = base.durationMinutes;
  let activeQuestions = base.questions;
  let randomizePerCandidate = base.randomizePerCandidate ?? false;
  let subsetCount = base.subsetCount;

  if (urlDuration) {
    const parsedDur = parseInt(urlDuration, 10);
    if (!isNaN(parsedDur) && parsedDur > 0) {
      activeDuration = parsedDur;
    }
  }

  if (urlRandomize === '1' || urlRandomize === 'true') {
    randomizePerCandidate = true;
  }

  if (urlSubset) {
    const parsedSub = parseInt(urlSubset, 10);
    if (!isNaN(parsedSub) && parsedSub > 0) {
      subsetCount = parsedSub;
    }
  }

  if (urlQuestionIds && base.questionBank) {
    const idList = urlQuestionIds.split(',').map((s) => s.trim()).filter(Boolean);
    if (idList.length > 0) {
      const idSet = new Set(idList);
      const selected = base.questionBank.filter((q) => idSet.has(q.id));
      if (selected.length > 0) {
        activeQuestions = selected.map((q, idx) => ({ ...q, number: idx + 1 }));
      }
    }
  }

  return {
    ...base,
    durationMinutes: activeDuration,
    totalQuestions: activeQuestions.length,
    questions: activeQuestions,
    randomizePerCandidate,
    subsetCount
  };
}

