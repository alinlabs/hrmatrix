import React from 'react';
import { Employee } from '../../types';
import { ComboboxOption } from '../../components/ui';

export type EmployeeViewMode = 'card' | 'table';

export interface EmployeesContainerProps {
  // Optional container props if any
}

export interface EmployeeFormProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  editingEmployeeId: string | null;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  collapsedSections: Record<string, boolean>;
  toggleSection: (sectionKey: string) => void;
  allowanceOptions: ComboboxOption[];
  documentOptions: ComboboxOption[];
  departmentOptions?: ComboboxOption[];
  positionOptions?: ComboboxOption[];
  bankOptions?: ComboboxOption[];
  bpjsOptions?: ComboboxOption[];
  taxOptions?: ComboboxOption[];
}

export interface EmployeeListProps {
  employees: Employee[];
  allEmployees?: Employee[];
  selectedEmployeeId?: string | null;
  onSelectEmployee?: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onToggleStatus: (employee: Employee) => void;
  onAddNewEmployee: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (dept: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  departments: string[];
  viewMode: EmployeeViewMode;
  setViewMode: (mode: EmployeeViewMode) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCSV: () => void;
  onImportCSV?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportOrgChart?: () => void;
}

export interface EmployeeItemProps {
  employee: Employee;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onViewDocuments?: () => void;
}

export interface EmployeeHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: EmployeeViewMode;
  onOpenSettings: () => void;
  onOpenStructure: () => void;
  onAddNewEmployee: () => void;
}

export interface EmployeeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: EmployeeViewMode;
  setViewMode: (mode: EmployeeViewMode) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCSV: () => void;
  onImportCSV?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface EmployeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSelectEmployee?: (employee: Employee) => void;
}

export interface EmployeeDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}
