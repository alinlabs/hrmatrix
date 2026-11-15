import { TestQuestion } from '../types';

// ============================================================================
// BANK SOAL: BAHASA INGGRIS BISNIS (BUSINESS ENGLISH & CORPORATE COMMUNICATION)
// SEMUA SOAL MENGGUNAKAN STANDAR PILIHAN GANDA 4 OPSI (A, B, C, D)
// ============================================================================
export const englishQuestionBank: TestQuestion[] = [
  {
    id: 'eng-1',
    number: 1,
    questionText: 'Choose the most professional opening sentence for an email replying to an important corporate client inquiry:',
    questionType: 'multiple_choice_4',
    category: 'language',
    correctOptionId: 'e1-c',
    tags: ['Business Email', 'Etiquette', 'Customer Relations'],
    explanation: 'Option C is polite, formal, and adheres strictly to corporate business communication standards.',
    options: [
      { id: 'e1-a', label: 'A', text: 'Hey there! Thanks for writing to us yesterday.', score: 0 },
      { id: 'e1-b', label: 'B', text: 'I am writing because you asked questions about our products.', score: 0 },
      { id: 'e1-c', label: 'C', text: 'Thank you for contacting us. We appreciate your inquiry regarding our services.', score: 10 },
      { id: 'e1-d', label: 'D', text: 'Replying to your email as requested by my manager.', score: 0 }
    ]
  },
  {
    id: 'eng-2',
    number: 2,
    questionText: 'Complete the sentence with the correct grammatical form:\n"The quarterly financial audit ________ by an external independent accounting firm next Monday."',
    questionType: 'multiple_choice_4',
    category: 'language',
    correctOptionId: 'e2-d',
    tags: ['Passive Voice', 'Grammar', 'Tenses'],
    explanation: 'Future passive voice requires "will be conducted".',
    options: [
      { id: 'e2-a', label: 'A', text: 'conducts', score: 0 },
      { id: 'e2-b', label: 'B', text: 'is conducting', score: 0 },
      { id: 'e2-c', label: 'C', text: 'has been conducted', score: 0 },
      { id: 'e2-d', label: 'D', text: 'will be conducted', score: 10 }
    ]
  },
  {
    id: 'eng-3',
    number: 3,
    questionText: 'Which word best replaces the underlined phrase to sound more concise and professional in a board meeting memo?\n"We need to <u>put off</u> the strategic planning meeting until next Thursday."',
    questionType: 'multiple_choice_4',
    category: 'language',
    correctOptionId: 'e3-b',
    tags: ['Corporate Vocabulary', 'Formal Synonyms'],
    explanation: '"Postpone" or "defer" is the formal corporate synonym for the phrasal verb "put off".',
    options: [
      { id: 'e3-a', label: 'A', text: 'terminate', score: 0 },
      { id: 'e3-b', label: 'B', text: 'postpone', score: 10 },
      { id: 'e3-c', label: 'C', text: 'accelerate', score: 0 },
      { id: 'e3-d', label: 'D', text: 'dismiss', score: 0 }
    ]
  },
  {
    id: 'eng-4',
    number: 4,
    questionText: 'Identify the sentence with the correct corporate grammatical structure and subject-verb agreement:',
    questionType: 'multiple_choice_4',
    category: 'language',
    correctOptionId: 'e4-b',
    tags: ['Subject-Verb Agreement', 'Grammar Precision'],
    explanation: '"Neither of the candidates has" is grammatically correct because "neither" takes a singular verb in formal English.',
    options: [
      { id: 'e4-a', label: 'A', text: 'Neither of the job candidates have submitted their portfolio yet.', score: 0 },
      { id: 'e4-b', label: 'B', text: 'Neither of the job candidates has submitted their portfolio yet.', score: 10 },
      { id: 'e4-c', label: 'C', text: 'Neither of the job candidates are submitting their portfolio yet.', score: 0 },
      { id: 'e4-d', label: 'D', text: 'Neither of the job candidates were submit their portfolio yet.', score: 0 }
    ]
  },
  {
    id: 'eng-5',
    number: 5,
    scenario: 'You are writing an official announcement about a temporary server maintenance downtime during business hours.',
    questionText: 'Which closing sentence expresses the highest level of corporate diplomacy and courtesy?',
    questionType: 'multiple_choice_4',
    category: 'language',
    correctOptionId: 'e5-a',
    tags: ['Customer Empathy', 'Diplomacy', 'Corporate Notice'],
    explanation: 'Option A acknowledges the inconvenience, maintains professionalism, and offers constructive assistance.',
    options: [
      { id: 'e5-a', label: 'A', text: 'We sincerely apologize for any inconvenience caused and greatly appreciate your patience and understanding.', score: 10 },
      { id: 'e5-b', label: 'B', text: 'Hope you don\'t mind the downtime as we have to fix things immediately.', score: 0 },
      { id: 'e5-c', label: 'C', text: 'Do not submit any tickets during maintenance because we won\'t reply.', score: 0 },
      { id: 'e5-d', label: 'D', text: 'Maintenance is inevitable so please adjust your schedule accordingly.', score: 0 }
    ]
  },
  {
    id: 'eng-6',
    number: 6,
    scenario: 'Memo Excerpt: "Effective next month, all expense reimbursement requests must be submitted within 14 calendar days of receipt issuance, accompanied by original tax invoices. Late submissions will be subject to managerial review and may result in forfeiture of reimbursement."',
    questionText: 'According to the memo, what will happen if an employee submits a claim 20 days after receipt issuance?',
    questionType: 'multiple_choice_4',
    category: 'language',
    correctOptionId: 'e6-c',
    tags: ['Reading Comprehension', 'Corporate Policy SLA'],
    explanation: 'The policy states that late submissions (>14 days) will undergo managerial review and may be forfeited.',
    options: [
      { id: 'e6-a', label: 'A', text: 'The claim will be approved automatically with a 10% penalty deduction.', score: 0 },
      { id: 'e6-b', label: 'B', text: 'The employee will immediately receive a formal disciplinary letter from HR.', score: 0 },
      { id: 'e6-c', label: 'C', text: 'The request requires managerial review and might not be reimbursed.', score: 10 },
      { id: 'e6-d', label: 'D', text: 'The finance department will process the payment in the following calendar year.', score: 0 }
    ]
  }
];
