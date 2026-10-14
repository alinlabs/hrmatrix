import { PayrollPeriod, PayrollRecord, Employee, Company } from '../../types';

export interface PeriodStats {
  count: number;
  totalNet: number;
}

export type PeriodStatusFilter = 'ALL' | 'Draft' | 'Calculating' | 'Approved' | 'Closed' | 'Paid';

export interface PayrollHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  onAddPeriod?: () => void;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  hideHamburger?: boolean;
  searchPlaceholder?: string;
}

export interface CardPeriodItemProps {
  period: PayrollPeriod;
  stat?: PeriodStats;
  onClick: () => void;
}

export interface PayrollCardViewProps {
  periods: PayrollPeriod[] | undefined;
  filteredPeriods: PayrollPeriod[];
  statsByPeriod: Map<string, PeriodStats>;
  search: string;
  onResetSearch: () => void;
  onOpenCreateModal: () => void;
  onSelectPeriod: (id: string) => void;
}

export interface ModalCreatePeriodProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (periodName: string, startDate: string, endDate: string) => Promise<void>;
}

export interface ModalDetailSettingProps {
  isOpen: boolean;
  onClose: () => void;
  period: PayrollPeriod;
  onSaveCutOff: (newStartDate: string, newEndDate: string, newName?: string) => Promise<void>;
  onToggleRule: (ruleId: string, isNowDisabled: boolean) => Promise<void>;
  onToggleAllRules: (ruleIds: string[], isNowDisabled: boolean) => Promise<void>;
  onExportCSV?: () => void;
  onDeletePeriod: () => Promise<void>;
  totalEmployees: number;
}

export interface ExtendedPayrollRecord extends PayrollRecord {
  employee?: Employee;
  departmentName?: string;
  positionName?: string;
}

export interface ModalEmployeeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  record: ExtendedPayrollRecord | null;
  period?: PayrollPeriod | null;
  onOpenAdjustment?: (record: ExtendedPayrollRecord) => void;
  onOpenPayslip?: (record: ExtendedPayrollRecord) => void;
}

export interface ModalPayrollAdjustmentProps {
  isOpen: boolean;
  onClose: () => void;
  record: (PayrollRecord & { employee?: Employee }) | null;
  onSave: (recordId: string, adjustedInputs: any) => Promise<void>;
}

export interface ModalPayslipProps {
  isOpen: boolean;
  onClose: () => void;
  record: ExtendedPayrollRecord | null;
  period: PayrollPeriod | null;
  company?: Company;
}

export interface CardEmployeeSalaryItemProps {
  record: ExtendedPayrollRecord;
  onViewDetail: () => void;
  onOpenPayslip: () => void;
  onOpenAdjustment: () => void;
}
