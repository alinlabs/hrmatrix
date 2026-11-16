import { TestQuestion } from '../types';
import { discQuestionBank } from './kepribadian-disc';
import { cognitiveQuestionBank } from './kognitif-tpa';
import { situationalQuestionBank } from './situasional-sjt';
import { englishQuestionBank } from './bahasa-inggris-bisnis';
import { leadershipQuestionBank } from './kepemimpinan-manajemen';

export * from './kepribadian-disc';
export * from './kognitif-tpa';
export * from './situasional-sjt';
export * from './bahasa-inggris-bisnis';
export * from './kepemimpinan-manajemen';

// Get unified questions across all categories
export function getAllUnifiedQuestions(): TestQuestion[] {
  const all: TestQuestion[] = [
    ...discQuestionBank.map(q => ({ ...q, category: 'personality' as const })),
    ...cognitiveQuestionBank.map(q => ({ ...q, category: 'cognitive' as const })),
    ...situationalQuestionBank.map(q => ({ ...q, category: 'situational' as const })),
    ...englishQuestionBank.map(q => ({ ...q, category: 'language' as const })),
    ...leadershipQuestionBank.map(q => ({ ...q, category: 'leadership' as const }))
  ];

  // Renumber sequentially 1..N
  return all.map((q, idx) => ({
    ...q,
    number: idx + 1
  }));
}

export function getQuestionBankForPackage(packageId: string): TestQuestion[] {
  switch (packageId) {
    case 'unified-assessment':
    case 'terpadu':
    case 'unified':
      return getAllUnifiedQuestions();
    case 'disc-personality':
    case 'disc':
      return discQuestionBank;
    case 'cognitive-tpa':
    case 'kognitif':
      return cognitiveQuestionBank;
    case 'situational-sjt':
    case 'sjt':
      return situationalQuestionBank;
    case 'business-english':
    case 'english':
      return englishQuestionBank;
    case 'leadership-management':
    case 'leadership':
      return leadershipQuestionBank;
    default:
      return getAllUnifiedQuestions();
  }
}
