import React, { useState } from 'react';
import {
  Building2,
  User,
  Briefcase,
  Calculator,
  ScrollText,
  FileText,
  FileCheck2,
  AlertTriangle,
  LogOut,
  Calendar,
  ShieldAlert,
  Award,
  Layers,
  Eye
} from 'lucide-react';
import {
  ContractDocument,
  ContractType,
  ContractLanguageMode,
  ContractClause
} from './types';
import {
  generateDefaultClauses,
  getCategoryForType
} from './contract-templates';
import { resolveJobWorkSchedule } from '../job-desk/utils-helper';
import { Employee } from '../../types';
import { SectionContractInfo } from './section-contract-info';
import { SectionContractJob, SectionContractComp } from './section-contract-job-comp';
import { SectionContractLifecycle } from './section-contract-lifecycle';
import { SectionContractClauses } from './section-contract-clauses';

interface ContractFormProps {
  document: ContractDocument;
  onChange: (updated: ContractDocument) => void;
  availableEmployees: Employee[];
  onOpenPreview?: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({
  document: doc,
  onChange,
  availableEmployees,
  onOpenPreview
}) => {
  const currentCategory = doc.category || getCategoryForType(doc.contractType);
  const [activeTab, setActiveTab] = useState<string>('info');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(null);

  // Switch Contract Type & Category
  const handleTypeChange = (newType: ContractType) => {
    const titlesId: Record<ContractType, string> = {
      PKWT: 'SURAT PERJANJIAN KERJA WAKTU TERTENTU (PKWT)',
      PKWTT: 'SURAT PERJANJIAN KERJA WAKTU TIDAK TERTENTU (PKWTT)',
      INTERNSHIP: 'SURAT PERJANJIAN PEMAGANGAN (INTERNSHIP AGREEMENT)',
      FREELANCE: 'SURAT PERJANJIAN KERJASAMA JASA KONTRAK LEPAS (SPK FREELANCE)',
      RENEWAL_PKWT: 'SURAT PERJANJIAN PERPANJANGAN MASA KERJA PKWT (ADDENDUM)',
      SK_PROMOSI: 'SURAT KEPUTUSAN PROMOSI JABATAN & PENYESUAIAN UPAH',
      SP1: 'SURAT PERINGATAN PERTAMA (SP 1)',
      SP2: 'SURAT PERINGATAN KEDUA (SP 2)',
      SP3: 'SURAT PERINGATAN KETIGA & TERAKHIR (SP 3)',
      END_CONTRACT: 'SURAT PEMBERITAHUAN BERAKHIRNYA MASA KONTRAK KERJA (PKWT)',
      PHK: 'SURAT PEMUTUSAN HUBUNGAN KERJA (PHK)',
      RESIGN_ACCEPTANCE: 'SURAT PENERIMAAN PENGUNDURAN DIRI & PENGALAMAN KERJA (PAKLARING)'
    };

    const titlesEn: Record<ContractType, string> = {
      PKWT: 'FIXED-TERM EMPLOYMENT AGREEMENT (PKWT)',
      PKWTT: 'PERMANENT EMPLOYMENT AGREEMENT (PKWTT)',
      INTERNSHIP: 'APPRENTICESHIP & INTERNSHIP AGREEMENT',
      FREELANCE: 'INDEPENDENT CONTRACTOR & PROFESSIONAL SERVICES AGREEMENT',
      RENEWAL_PKWT: 'AMENDMENT & EMPLOYMENT EXTENSION AGREEMENT (ADDENDUM)',
      SK_PROMOSI: 'DECREE OF JOB PROMOTION AND SALARY ADJUSTMENT',
      SP1: 'FIRST WARNING LETTER (SP 1)',
      SP2: 'SECOND WARNING LETTER (SP 2)',
      SP3: 'THIRD & FINAL WARNING LETTER (SP 3)',
      END_CONTRACT: 'NOTICE OF CONTRACT COMPLETION & COMPENSATION (PKWT)',
      PHK: 'EMPLOYMENT TERMINATION NOTICE (PHK)',
      RESIGN_ACCEPTANCE: 'RESIGNATION ACCEPTANCE & CERTIFICATE OF EMPLOYMENT'
    };

    const prefixes: Record<ContractType, string> = {
      PKWT: 'PKWT',
      PKWTT: 'PKWTT',
      INTERNSHIP: 'MAGANG',
      FREELANCE: 'SPK-FL',
      RENEWAL_PKWT: 'ADD-PKWT',
      SK_PROMOSI: 'SK-PROMOSI',
      SP1: 'SP-1',
      SP2: 'SP-2',
      SP3: 'SP-3',
      END_CONTRACT: 'END-PKWT',
      PHK: 'PHK',
      RESIGN_ACCEPTANCE: 'SKK-RESIGN'
    };

    const currentYear = new Date().getFullYear();
    const currentMonthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const category = getCategoryForType(newType);

    const updated: ContractDocument = {
      ...doc,
      contractType: newType,
      category,
      titleId: titlesId[newType],
      titleEn: titlesEn[newType],
      contractNumber: `${randomNum}/HRM-${prefixes[newType]}/${currentMonthRoman}/${currentYear}`,
      job: {
        ...doc.job,
        contractDurationMonths: newType === 'INTERNSHIP' ? 3 : 12,
        probationDurationMonths: newType === 'PKWTT' ? 3 : 0,
        endDate: newType === 'PKWTT' ? undefined : doc.job.endDate
      },
      compensation: {
        ...doc.compensation,
        hasPkwtCompensation: newType === 'PKWT' || newType === 'END_CONTRACT'
      }
    };

    if (newType === 'SP1' || newType === 'SP2' || newType === 'SP3') {
      const lvl = newType === 'SP1' ? 1 : (newType === 'SP2' ? 2 : 3);
      if (updated.warning) {
        updated.warning.warningLevel = lvl as (1 | 2 | 3);
      }
    }

    if (newType === 'END_CONTRACT' || newType === 'PHK' || newType === 'RESIGN_ACCEPTANCE') {
      if (updated.termination) {
        updated.termination.terminationType = newType === 'END_CONTRACT' ? 'SELESAI_PKWT' : (newType === 'PHK' ? 'PHK' : 'RESIGN_ACCEPTANCE');
      }
    }

    updated.clauses = generateDefaultClauses(newType, updated);
    onChange(updated);

    if (category === 'SURAT_PERINGATAN') {
      setActiveTab('warning');
    } else if (category === 'PERPANJANG_KONTRAK') {
      setActiveTab('renewal');
    } else if (category === 'PROMOSI') {
      setActiveTab('promotion');
    } else if (category === 'PEMBERHENTIAN') {
      setActiveTab('termination');
    } else {
      setActiveTab('info');
    }
  };

  // Switch Language Mode
  const handleLanguageChange = (mode: ContractLanguageMode) => {
    onChange({
      ...doc,
      languageMode: mode
    });
  };

  // Autofill from existing Employee selection
  const handleSelectEmployee = (empId: string) => {
    if (!empId) return;
    const emp = availableEmployees.find(e => e.id === empId);
    if (!emp) return;

    const schedule = resolveJobWorkSchedule({
      nama: emp.positionId,
      departemen: emp.departmentId
    });

    const updated: ContractDocument = {
      ...doc,
      employee: {
        ...doc.employee,
        employeeId: emp.id,
        fullName: emp.fullName || doc.employee.fullName,
        nik: emp.nik || doc.employee.nik,
        phone: emp.phone || doc.employee.phone,
        email: emp.email || doc.employee.email,
        address: emp.address || doc.employee.address,
        gender: emp.gender === 'Female' ? 'Perempuan' : 'Laki-laki',
        city: emp.address ? emp.address.split(',').pop()?.trim() || doc.employee.city : doc.employee.city
      },
      job: {
        ...doc.job,
        positionTitle: emp.positionId || doc.job.positionTitle,
        positionTitleEn: emp.positionId || doc.job.positionTitleEn,
        department: emp.departmentId || doc.job.department,
        departmentEn: emp.departmentId || doc.job.departmentEn,
        startDate: emp.joinDate || doc.job.startDate,
        workingDaysPerWeek: schedule.scheduleType === '6_HARI' ? 6 : 5,
        workingHoursPerDay: schedule.scheduleType === '6_HARI' ? 7 : 8,
        workingHoursSchedule: schedule.workingHours || '',
        restHoursSchedule: schedule.restHours,
        workDaysDetail: schedule.workDays,
        workScheduleType: schedule.scheduleType,
        shiftDetails: schedule.shiftDescription,
        isOvertimeApplicable: Boolean(schedule.overtimeEligible),
        overtimeNotes: schedule.overtimeClause
      },
      compensation: {
        ...doc.compensation,
        basicSalary: emp.basicSalary || doc.compensation.basicSalary,
        bankName: emp.bankName || doc.compensation.bankName,
        bankAccountNumber: emp.bankAccount || doc.compensation.bankAccountNumber,
        bankAccountHolder: emp.fullName || doc.compensation.bankAccountHolder
      }
    };

    updated.clauses = generateDefaultClauses(updated.contractType, updated);
    onChange(updated);
  };

  // Clause Toggle / Edit
  const handleToggleClause = (clauseId: string) => {
    const updatedClauses = doc.clauses.map(c => 
      c.id === clauseId ? { ...c, isEnabled: !c.isEnabled } : c
    );
    onChange({ ...doc, clauses: updatedClauses });
  };

  const handleUpdateClause = (clauseId: string, updates: Partial<ContractClause>) => {
    const updatedClauses = doc.clauses.map(c => 
      c.id === clauseId ? { ...c, ...updates } : c
    );
    onChange({ ...doc, clauses: updatedClauses });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      
      {/* 1. KATEGORI TEMPLATE DOKUMEN HR (4 PILIHAN UTAMA) */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/90 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Pilih Kategori Template Dokumen HR:
          </span>

          {/* Bahasa Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => handleLanguageChange('id')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                doc.languageMode === 'id' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Indonesia
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                doc.languageMode === 'en' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('bilingual')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                doc.languageMode === 'bilingual' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Dua bahasa berdampingan (Bilingual 2 kolom)"
            >
              2 Bahasa
            </button>
          </div>
        </div>

        {/* 5 Main Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Category 1: Kontrak Baru */}
          <button
            type="button"
            onClick={() => handleTypeChange('PKWT')}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              currentCategory === 'KONTRAK_BARU'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileText className={`w-4 h-4 ${currentCategory === 'KONTRAK_BARU' ? 'text-blue-200' : 'text-blue-600'}`} />
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                currentCategory === 'KONTRAK_BARU' ? 'bg-blue-500/50 text-white' : 'bg-blue-50 text-blue-700'
              }`}>
                4 Tipe
              </span>
            </div>
            <div className="mt-1.5">
              <span className="text-xs font-bold block leading-tight">Kontrak Baru</span>
              <span className={`text-[10px] block truncate mt-0.5 ${currentCategory === 'KONTRAK_BARU' ? 'text-blue-100' : 'text-slate-500'}`}>
                PKWT, Tetap, Magang
              </span>
            </div>
          </button>

          {/* Category 2: Perpanjangan Kontrak */}
          <button
            type="button"
            onClick={() => handleTypeChange('RENEWAL_PKWT')}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              currentCategory === 'PERPANJANG_KONTRAK'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileCheck2 className={`w-4 h-4 ${currentCategory === 'PERPANJANG_KONTRAK' ? 'text-emerald-200' : 'text-emerald-600'}`} />
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                currentCategory === 'PERPANJANG_KONTRAK' ? 'bg-emerald-600/50 text-white' : 'bg-emerald-50 text-emerald-700'
              }`}>
                Addendum
              </span>
            </div>
            <div className="mt-1.5">
              <span className="text-xs font-bold block leading-tight">Perpanjangan</span>
              <span className={`text-[10px] block truncate mt-0.5 ${currentCategory === 'PERPANJANG_KONTRAK' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Addendum PKWT
              </span>
            </div>
          </button>

          {/* Category 3: Promosi Jabatan */}
          <button
            type="button"
            onClick={() => handleTypeChange('SK_PROMOSI')}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              currentCategory === 'PROMOSI'
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs ring-2 ring-purple-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <Award className={`w-4 h-4 ${currentCategory === 'PROMOSI' ? 'text-purple-200' : 'text-purple-600'}`} />
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                currentCategory === 'PROMOSI' ? 'bg-purple-600/50 text-white' : 'bg-purple-50 text-purple-700'
              }`}>
                SK Resmi
              </span>
            </div>
            <div className="mt-1.5">
              <span className="text-xs font-bold block leading-tight">Promosi Jabatan</span>
              <span className={`text-[10px] block truncate mt-0.5 ${currentCategory === 'PROMOSI' ? 'text-purple-100' : 'text-slate-500'}`}>
                SK Promosi
              </span>
            </div>
          </button>

          {/* Category 4: Surat Peringatan */}
          <button
            type="button"
            onClick={() => handleTypeChange('SP1')}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              currentCategory === 'SURAT_PERINGATAN'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <AlertTriangle className={`w-4 h-4 ${currentCategory === 'SURAT_PERINGATAN' ? 'text-amber-200' : 'text-amber-600'}`} />
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                currentCategory === 'SURAT_PERINGATAN' ? 'bg-amber-500/50 text-white' : 'bg-amber-50 text-amber-700'
              }`}>
                SP 1, 2, 3
              </span>
            </div>
            <div className="mt-1.5">
              <span className="text-xs font-bold block leading-tight">Surat Peringatan</span>
              <span className={`text-[10px] block truncate mt-0.5 ${currentCategory === 'SURAT_PERINGATAN' ? 'text-amber-100' : 'text-slate-500'}`}>
                Disiplin & Sanksi
              </span>
            </div>
          </button>

          {/* Category 5: Pemberhentian / PHK / Resign */}
          <button
            type="button"
            onClick={() => handleTypeChange('END_CONTRACT')}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              currentCategory === 'PEMBERHENTIAN'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs ring-2 ring-rose-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <LogOut className={`w-4 h-4 ${currentCategory === 'PEMBERHENTIAN' ? 'text-rose-200' : 'text-rose-600'}`} />
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                currentCategory === 'PEMBERHENTIAN' ? 'bg-rose-600/50 text-white' : 'bg-rose-50 text-rose-700'
              }`}>
                3 Opsi
              </span>
            </div>
            <div className="mt-1.5">
              <span className="text-xs font-bold block leading-tight">Pemberhentian</span>
              <span className={`text-[10px] block truncate mt-0.5 ${currentCategory === 'PEMBERHENTIAN' ? 'text-rose-100' : 'text-slate-500'}`}>
                Selesai, PHK, Resign
              </span>
            </div>
          </button>
        </div>

        {/* Sub-type Selectors inside active category */}
        {currentCategory === 'KONTRAK_BARU' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Tipe:</span>
            {[
              { type: 'PKWT' as ContractType, label: 'PKWT (Kontrak Waktu Tertentu)' },
              { type: 'PKWTT' as ContractType, label: 'PKWTT (Karyawan Tetap)' },
              { type: 'INTERNSHIP' as ContractType, label: 'Magang (Internship)' },
              { type: 'FREELANCE' as ContractType, label: 'SPK Freelance' },
            ].map(item => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleTypeChange(item.type)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                  doc.contractType === item.type
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {currentCategory === 'SURAT_PERINGATAN' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Tingkat:</span>
            {[
              { type: 'SP1' as ContractType, label: 'SP 1 (Peringatan Pertama)' },
              { type: 'SP2' as ContractType, label: 'SP 2 (Peringatan Kedua)' },
              { type: 'SP3' as ContractType, label: 'SP 3 (Peringatan Terakhir)' },
            ].map(item => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleTypeChange(item.type)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                  doc.contractType === item.type
                    ? 'bg-amber-700 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {currentCategory === 'PEMBERHENTIAN' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Jenis:</span>
            {[
              { type: 'END_CONTRACT' as ContractType, label: 'Selesai Kontrak PKWT + Kompensasi' },
              { type: 'PHK' as ContractType, label: 'Surat PHK (Efisiensi / Disiplin)' },
              { type: 'RESIGN_ACCEPTANCE' as ContractType, label: 'Penerimaan Resign & Paklaring' },
            ].map(item => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleTypeChange(item.type)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                  doc.contractType === item.type
                    ? 'bg-rose-800 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Quick Employee Autofill Selector */}
        {availableEmployees.length > 0 && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Pilih Karyawan:
            </span>
            <select
              value={doc.employee.employeeId || ''}
              onChange={(e) => handleSelectEmployee(e.target.value)}
              className="flex-1 text-xs p-1.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Pilih dari Database Karyawan (Autofill Otomatis) --</option>
              {availableEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.positionId || 'Staf'} - {emp.departmentId || 'Umum'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. TAB NAVIGATOR SESUAI KATEGORI */}
      <div className="flex items-center border-b border-slate-200 px-4 bg-white overflow-x-auto shrink-0 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'info'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Identitas & Nomor Surat</span>
        </button>

        {currentCategory === 'KONTRAK_BARU' && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('job')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'job'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Jabatan & Lokasi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('comp')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'comp'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Gaji & Benefit</span>
            </button>
          </>
        )}

        {currentCategory === 'PERPANJANG_KONTRAK' && (
          <button
            type="button"
            onClick={() => setActiveTab('renewal')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'renewal'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Masa & Gaji Perpanjangan</span>
          </button>
        )}

        {currentCategory === 'PROMOSI' && (
          <button
            type="button"
            onClick={() => setActiveTab('promotion')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'promotion'
                ? 'border-purple-600 text-purple-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Jabatan Baru & Konsideran SK</span>
          </button>
        )}

        {currentCategory === 'SURAT_PERINGATAN' && (
          <button
            type="button"
            onClick={() => setActiveTab('warning')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'warning'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Kronologi & Sanksi SP</span>
          </button>
        )}

        {currentCategory === 'PEMBERHENTIAN' && (
          <button
            type="button"
            onClick={() => setActiveTab('termination')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'termination'
                ? 'border-rose-600 text-rose-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Hak Pesangon & Paklaring</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('clauses')}
          className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'clauses'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ScrollText className="w-3.5 h-3.5" />
          <span>Klausul Dokumen ({doc.clauses.filter(c => c.isEnabled).length})</span>
        </button>
      </div>

      {/* 3. FORM BODY CONTAINER */}
      <div className="p-5 overflow-y-auto flex-1 space-y-5">
        
        {/* TAB 1: IDENTITAS PERUSAHAAN & KARYAWAN */}
        {activeTab === 'info' && (
          <SectionContractInfo doc={doc} onChange={onChange} />
        )}

        {/* TAB 2: JABATAN & LOKASI (KONTRAK BARU) */}
        {activeTab === 'job' && currentCategory === 'KONTRAK_BARU' && (
          <SectionContractJob doc={doc} onChange={onChange} />
        )}

        {/* TAB 3: GAJI & BENEFIT (KONTRAK BARU) */}
        {activeTab === 'comp' && currentCategory === 'KONTRAK_BARU' && (
          <SectionContractComp doc={doc} onChange={onChange} />
        )}

        {/* TAB KHUSUS LIFECYCLE: PERPANJANGAN, PROMOSI, SP, PEMBERHENTIAN */}
        {((activeTab === 'renewal' && currentCategory === 'PERPANJANG_KONTRAK') ||
          (activeTab === 'promotion' && currentCategory === 'PROMOSI') ||
          (activeTab === 'warning' && currentCategory === 'SURAT_PERINGATAN') ||
          (activeTab === 'termination' && currentCategory === 'PEMBERHENTIAN')) && (
          <SectionContractLifecycle
            doc={doc}
            onChange={onChange}
            activeTab={activeTab}
          />
        )}

        {/* TAB KLAUSUL PASAL DOKUMEN (SEMUA TIPE) */}
        {activeTab === 'clauses' && (
          <SectionContractClauses
            doc={doc}
            onChange={onChange}
            expandedClauseId={expandedClauseId}
            setExpandedClauseId={setExpandedClauseId}
            onToggleClause={handleToggleClause}
            onUpdateClause={handleUpdateClause}
          />
        )}

        {/* Bottom Form Action Bar */}
        {onOpenPreview && (
          <div className="pt-4 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 text-center sm:text-left">
              Data formulir otomatis tersinkronisasi. Klik tombol untuk melihat pratinjau surat resmi & mencetak.
            </div>
            <button
              type="button"
              onClick={onOpenPreview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Pratinjau & Cetak Dokumen (PDF)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
