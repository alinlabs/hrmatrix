import { TestQuestion } from '../types';
import { discQuestionBank } from './disc-personality';
import { cognitiveQuestionBank } from './cognitive-tpa';
import { situationalQuestionBank } from './situational-sjt';
import { englishQuestionBank } from './business-english';
import { leadershipQuestionBank } from './leadership-management';

export * from './disc-personality';
export * from './cognitive-tpa';
export * from './situational-sjt';
export * from './business-english';
export * from './leadership-management';

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
