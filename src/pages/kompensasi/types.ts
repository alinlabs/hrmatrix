import { PayrollRule } from '../../types';

export type KompensasiTab = 'tunjangan' | 'jaminan' | 'pajak' | 'semua';
export type ViewMode = 'card' | 'table';

export interface KompensasiStats {
  totalRules: number;
  totalTunjangan: number;
  tunjanganTetap: number;
  tunjanganTidakTetap: number;
  insentifCount: number;
  bonusCount: number;
  bonusInsentif: number;
  totalBPJS: number;
  bpjsKesehatan: number;
  bpjsKetenagakerjaan: number;
  totalPajak: number;
}

export interface KompensasiFilterState {
  searchQuery: string;
  selectedGroup: string;
  activeTab: KompensasiTab;
}

export interface CardKompensasiItemProps {
  rule: PayrollRule;
  onOpenDetail: (rule: PayrollRule) => void;
  onEdit: (rule: PayrollRule) => void;
  onDelete: (id: string, name: string) => void;
}

export interface KompensasiCardViewProps {
  rules: PayrollRule[];
  activeTab: KompensasiTab;
  viewMode: ViewMode;
  searchQuery: string;
  onOpenDetail: (rule: PayrollRule) => void;
  onEdit: (rule: PayrollRule) => void;
  onDelete: (id: string, name: string) => void;
  onAddRule?: () => void;
}

export interface KompensasiTableViewProps {
  rules: PayrollRule[];
  activeTab: KompensasiTab;
  viewMode: ViewMode;
  onOpenDetail: (rule: PayrollRule) => void;
  onEdit: (rule: PayrollRule) => void;
  onDelete: (id: string, name: string) => void;
}

export interface ModalAddKompensasiMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalRuleDetailProps {
  isOpen: boolean;
  onClose: () => void;
  rule: PayrollRule | null;
  onEdit?: (rule: PayrollRule) => void;
  onDelete?: (id: string, name: string) => void;
}
