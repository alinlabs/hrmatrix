import React from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  Clock, 
  Calculator, 
  Target, 
  FileText, 
  Briefcase, 
  Database,
  UserPlus,
  ShieldAlert,
  Award,
  TrendingUp
} from 'lucide-react';

/**
 * Konversi angka ke Romawi untuk nomor Bab (1 -> I, 12 -> XII)
 */
export const toRoman = (num: number): string => {
  const romanMap: Record<number, string> = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
    10: 'X',
    11: 'XI',
    12: 'XII',
  };
  return romanMap[num] || String(num);
};

/**
 * Map icon names to Lucide icon components
 */
export const renderChapterIcon = (name: string, className: string = 'w-5 h-5'): React.ReactNode => {
  switch (name) {
    case 'LayoutDashboard': return <LayoutDashboard className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Calculator': return <Calculator className={className} />;
    case 'Target': return <Target className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Database': return <Database className={className} />;
    case 'UserPlus': return <UserPlus className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Award': return <Award className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    default: return <BookOpen className={className} />;
  }
};
