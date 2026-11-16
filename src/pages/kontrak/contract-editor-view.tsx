import React, { useState } from 'react';
import { Employee } from '../../types';
import { ContractClause, ContractDocument } from './types';
import { SectionContractInfo } from './section-contract-info';
import { SectionContractJob, SectionContractComp } from './section-contract-job-comp';
import { SectionContractLifecycle } from './section-contract-lifecycle';
import { SectionContractClauses } from './section-contract-clauses';
import { CONTRACT_PRESETS, createInitialContractDraft, generateDefaultClauses } from './contract-templates';
import { getDepartmentName, getPositionName } from '../../services/position-service';
import { Save, Printer, ArrowLeft } from 'lucide-react';

interface ContractEditorViewProps {
  document: ContractDocument;
  isEditingExisting: boolean;
  availableEmployees: Employee[];
  onChange: (updated: ContractDocument) => void;
  onSave: () => void;
  onBackToList: () => void;
  onOpenPreview: () => void;
}

export const ContractEditorView: React.FC<ContractEditorViewProps> = ({
  document,
  availableEmployees,
  onChange,
  onSave,
  onBackToList,
  onOpenPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'job' | 'comp' | 'lifecycle' | 'clauses'>('info');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(
    document.clauses?.[0]?.id || null
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const lifecycleTabKey =
    document.contractType === 'RENEWAL_PKWT'
      ? 'renewal'
      : document.contractType === 'SK_PROMOSI'
        ? 'promotion'
        : document.contractType === 'SP1' ||
            document.contractType === 'SP2' ||
            document.contractType === 'SP3'
          ? 'warning'
          : document.contractType === 'END_CONTRACT' ||
              document.contractType === 'PHK' ||
              document.contractType === 'RESIGN_ACCEPTANCE'
            ? 'termination'
            : null;

  const handleEmployeeSelect = (empId: string) => {
    const emp = availableEmployees.find((e) => e.id === empId);
    if (!emp) return;

    const posName = getPositionName(emp.positionId) || emp.positionId;
    const deptName = getDepartmentName(emp.departmentId, emp.positionId) || emp.departmentId;

    const updated: ContractDocument = {
      ...document,
      employee: {
        ...document.employee,
        employeeId: emp.id,
        fullName: emp.fullName,
        nik: emp.nik || emp.employeeId,
        birthPlace: emp.birthPlace || document.employee.birthPlace,
        birthDate: emp.birthDate || document.employee.birthDate,
        gender: emp.gender === 'Female' ? 'Perempuan' : 'Laki-laki',
        address: emp.address || document.employee.address,
        city: emp.city || document.employee.city,
        phone: emp.phone || document.employee.phone,
        email: emp.email || document.employee.email,
        npwp: emp.npwp || document.employee.npwp,
        bpjsKesehatanNo: emp.bpjsKesehatan || document.employee.bpjsKesehatanNo,
        bpjsKetenagakerjaanNo: emp.bpjsKetenagakerjaan || document.employee.bpjsKetenagakerjaanNo,
      },
      job: {
        ...document.job,
        positionTitle: posName,
        department: deptName,
      },
      compensation: {
        ...document.compensation,
        basicSalary: emp.basicSalary || document.compensation.basicSalary,
        fixedAllowance: emp.fixedAllowance || document.compensation.fixedAllowance,
        variableAllowance: document.compensation.variableAllowance,
        bankName: emp.bankName || document.compensation.bankName,
        bankAccountNumber: emp.bankAccount || document.compensation.bankAccountNumber,
        bankAccountHolder: emp.bankAccountHolder || emp.fullName,
      },
    };
    updated.clauses = generateDefaultClauses(updated.contractType, updated);
    onChange(updated);
  };

  const handleToggleClause = (clauseId: string) => {
    const nextClauses = document.clauses.map((c) =>
      c.id === clauseId ? { ...c, isEnabled: !c.isEnabled } : c
    );
    onChange({ ...document, clauses: nextClauses });
  };

  const handleUpdateClause = (clauseId: string, updates: Partial<ContractClause>) => {
    const nextClauses = document.clauses.map((c) =>
      c.id === clauseId ? { ...c, ...updates } : c
    );
    onChange({ ...document, clauses: nextClauses });
  };

  const handleSaveClick = () => {
    onSave();
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-4">
      {/* Top Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Jenis Dokumen</label>
            <select
              value={document.contractType}
              onChange={(e) => {
                const nextType = e.target.value as ContractDocument['contractType'];
                const fresh = createInitialContractDraft(nextType);
                onChange({
                  ...fresh,
                  id: document.id,
                  company: document.company,
                  employee: document.employee,
                });
              }}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
            >
              {CONTRACT_PRESETS.map((p) => (
                <option key={p.id} value={p.type}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Isi Otomatis dari Data Karyawan
            </label>
            <select
              value={document.employee.employeeId || ''}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
            >
              <option value="">-- Pilih Karyawan (Opsional) --</option>
              {availableEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onBackToList}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Daftar
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {savedNotice ? 'Tersimpan!' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Pratinjau
          </button>
        </div>
      </div>

      {/* Section Tabs (Underline Style) */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto no-scrollbar">
        {[
          { id: 'info' as const, label: 'Para Pihak' },
          { id: 'job' as const, label: 'Jabatan & Jadwal' },
          { id: 'comp' as const, label: 'Kompensasi' },
          ...(lifecycleTabKey ? [{ id: 'lifecycle' as const, label: 'Detail Khusus' }] : []),
          { id: 'clauses' as const, label: 'Pasal Kontrak' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === t.id
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active Form Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
        {activeTab === 'info' && <SectionContractInfo doc={document} onChange={onChange} />}
        {activeTab === 'job' && <SectionContractJob doc={document} onChange={onChange} />}
        {activeTab === 'comp' && <SectionContractComp doc={document} onChange={onChange} />}
        {activeTab === 'lifecycle' && lifecycleTabKey && (
          <SectionContractLifecycle doc={document} onChange={onChange} activeTab={lifecycleTabKey} />
        )}
        {activeTab === 'clauses' && (
          <SectionContractClauses
            doc={document}
            onChange={onChange}
            expandedClauseId={expandedClauseId}
            setExpandedClauseId={setExpandedClauseId}
            onToggleClause={handleToggleClause}
            onUpdateClause={handleUpdateClause}
          />
        )}
      </div>
    </div>
  );
};
