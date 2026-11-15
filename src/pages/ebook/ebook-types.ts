export interface SubSection {
  id: string;
  title: string;
  description: string;
  uiLocation: string;
  details: string[];
  formulaId?: string;
  formula?: {
    expression: string;
    explanation: string;
    variables: { name: string; desc: string }[];
    regulationBasis?: string;
    exampleCase?: {
      scenario: string;
      calculationSteps: string[];
      finalResult: string;
    };
  };
  keyTips?: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  iconName: string;
  category: 'Dasar' | 'Operasional' | 'Kompensasi' | 'Performa' | 'Administrasi' | 'Teknis' | 'Strategi & Talent' | 'Legal & Hubungan Industrial';
  readingTime: string;
  summary: string;
  primaryPath: string;
  subsections: SubSection[];
}
