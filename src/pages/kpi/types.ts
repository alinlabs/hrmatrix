import React from 'react';
import { 
  KPIRuleConfig, 
  KPIGradeRule,
  KPIResult, 
  KPITemplate, 
  Employee, 
  KPIPeriod, 
  KPIScoringAssistantConfig, 
  KPIScoringInputType, 
  KPIGradeStrategy,
  KPIItemResult,
  Department,
  Position
} from '../../types';

export type KPIViewMode = 'periods' | 'detail' | 'config';

export type {
  KPIRuleConfig, 
  KPIGradeRule,
  KPIResult, 
  KPITemplate, 
  Employee, 
  KPIPeriod, 
  KPIScoringAssistantConfig, 
  KPIScoringInputType, 
  KPIGradeStrategy,
  KPIItemResult,
  Department,
  Position
};

export interface KPIHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hideHamburger?: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  onOpenGeneralCatalog?: () => void;
  onOpenSettings?: () => void;
  onAddPeriod?: () => void;
  showAddPeriod?: boolean;
  showSettings?: boolean;
  showGeneralCatalog?: boolean;
  showLightbulb?: boolean;
  showSearch?: boolean;
  onOpenLightbulb?: () => void;
  searchPlaceholder?: string;
}

export interface KPIPeriodCardViewProps {
  periods: KPIPeriod[];
  results: KPIResult[];
  employees: Employee[];
  onSelectPeriod: (period: KPIPeriod) => void;
  onDeletePeriod?: (periodId: string, periodName: string) => void;
  onAddPeriod?: () => void;
  onOpenGeneralCatalog?: () => void;
}

export interface KPIPeriodDetailProps {
  period: KPIPeriod;
  periods: KPIPeriod[];
  results: KPIResult[];
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  templates: KPITemplate[];
  rules: KPIRuleConfig;
  scoringConfig?: KPIScoringAssistantConfig;
  globalSearch?: string;
  onBack: () => void;
  onSelectPeriod: (period: KPIPeriod) => void;
  onSaveResult: (result: KPIResult) => Promise<void>;
  onDeleteResult: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export interface CardKPIEmployeeItemProps {
  key?: React.Key;
  employee: Employee;
  result: KPIResult | null;
  isEvaluated: boolean;
  department?: Department;
  position?: Position;
  templates: KPITemplate[];
  rules: KPIRuleConfig;
  onClick: () => void;
}

export interface ModalCreateKPIPeriodProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, startDate: string, endDate: string) => Promise<void>;
}

export interface ModalKPIScoringAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  config: KPIScoringAssistantConfig;
  rules: KPIRuleConfig;
  pendingEmployeeCount: number;
  totalEmployeeCount: number;
  onSaveConfig: (config: KPIScoringAssistantConfig) => void;
  onAutoFillAverage: (targetScore: number) => Promise<void>;
  onAutoSyncAttendance?: () => Promise<void>;
}

export interface ModalDetailKPIProps {
  isOpen: boolean;
  onClose: () => void;
  result: KPIResult | null;
  employee: Employee | null;
  period: KPIPeriod | null;
  department?: Department;
  position?: Position;
  rules: KPIRuleConfig;
  onEdit?: () => void;
}

export interface ModalInputKPIProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  period: KPIPeriod | null;
  existingResult: KPIResult | null;
  templates: KPITemplate[];
  rules: KPIRuleConfig;
  department?: Department;
  position?: Position;
  scoringConfig?: KPIScoringAssistantConfig;
  onSave: (result: KPIResult) => Promise<void>;
}

export interface KPIConfigViewProps {
  config: KPIRuleConfig;
  onUpdate: () => void;
}

export interface KPIConfigurationPageProps {
  rules: KPIRuleConfig;
  templates?: any[];
  onBack?: () => void;
  onRefresh: () => void;
}

export interface CardKPICatalogItemProps {
  key?: React.Key;
  template: KPITemplate;
  onEdit: (tpl: KPITemplate) => void;
}

export interface ModalKPICatalogProps {
  isOpen: boolean;
  onClose: () => void;
  editingTemplate: KPITemplate | null;
  onSave: (templateData: {
    name: string;
    description: string;
    minimumScore: number;
    weight: number;
    measurementBase: string;
  }) => Promise<void>;
  onDelete?: (id: string, name: string) => Promise<void>;
}

