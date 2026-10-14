import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Briefcase, 
  Calculator, 
  ScrollText, 
  ChevronDown, 
  ChevronUp,
  Languages,
  Sparkles,
  FileText,
  FileCheck2,
  AlertTriangle,
  LogOut,
  Calendar,
  DollarSign,
  ShieldAlert,
  Award,
  Layers,
  Printer,
  Eye
} from 'lucide-react';
import { 
  ContractDocument, 
  ContractType, 
  ContractCategory,
  ContractLanguageMode,
  ContractClause 
} from './types';
import { 
  generateDefaultClauses, 
  getCategoryForType,
  formatRupiah 
} from './contract-templates';
import { resolveJobWorkSchedule } from '../job-desk/utils-helper';
import { Employee } from '../../types';

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
      nama: emp.position,
      departemen: emp.department
    });

    const updated: ContractDocument = {
      ...doc,
      employee: {
        ...doc.employee,
        employeeId: emp.id,
        fullName: emp.name || doc.employee.fullName,
        nik: emp.nik || doc.employee.nik,
        phone: emp.phone || doc.employee.phone,
        email: emp.email || doc.employee.email,
        address: emp.address || doc.employee.address,
        gender: emp.gender === 'female' ? 'Perempuan' : 'Laki-laki',
        city: emp.address ? emp.address.split(',').pop()?.trim() || doc.employee.city : doc.employee.city
      },
      job: {
        ...doc.job,
        positionTitle: emp.position || doc.job.positionTitle,
        positionTitleEn: emp.position || doc.job.positionTitleEn,
        department: emp.department || doc.job.department,
        departmentEn: emp.department || doc.job.departmentEn,
        startDate: emp.joinDate || doc.job.startDate,
        workingDaysPerWeek: schedule.scheduleType === '6_HARI' ? 6 : 5,
        workingHoursPerDay: schedule.scheduleType === '6_HARI' ? 7 : 8,
        workingHoursSchedule: schedule.workingHours,
        restHoursSchedule: schedule.restHours,
        workDaysDetail: schedule.workDays,
        workScheduleType: schedule.scheduleType,
        shiftDetails: schedule.shiftDescription,
        isOvertimeApplicable: schedule.overtimeEligible,
        overtimeNotes: schedule.overtimeClause
      },
      compensation: {
        ...doc.compensation,
        basicSalary: emp.baseSalary || doc.compensation.basicSalary,
        bankName: emp.bankName || doc.compensation.bankName,
        bankAccountNumber: emp.bankAccount || doc.compensation.bankAccountNumber,
        bankAccountHolder: emp.name || doc.compensation.bankAccountHolder
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
                  {emp.name} ({emp.position || 'Staf'} - {emp.department || 'Umum'})
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
          <div className="space-y-4">
            {/* Nomor & Tanggal Surat */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Nomor & Pengesahan Dokumen
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nomor Resmi Surat / Dokumen *
                  </label>
                  <input
                    type="text"
                    value={doc.contractNumber}
                    onChange={(e) => onChange({ ...doc, contractNumber: e.target.value })}
                    placeholder="001/HRM-PKWT/X/2026"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tanggal Penandatanganan *
                  </label>
                  <input
                    type="date"
                    value={doc.signingDate}
                    onChange={(e) => onChange({ ...doc, signingDate: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Kota Penandatanganan Dokumen
                </label>
                <input
                  type="text"
                  value={doc.signingCity}
                  onChange={(e) => onChange({ ...doc, signingCity: e.target.value })}
                  placeholder="Jakarta Selatan"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Identitas Pihak Pertama (Perusahaan) */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pihak Pertama (Perusahaan / Pemberi Kerja)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Perusahaan *</label>
                  <input
                    type="text"
                    value={doc.company.companyName}
                    onChange={(e) => onChange({
                      ...doc,
                      company: { ...doc.company, companyName: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Bentuk Badan Hukum</label>
                  <input
                    type="text"
                    value={doc.company.legalEntity}
                    onChange={(e) => onChange({
                      ...doc,
                      company: { ...doc.company, legalEntity: e.target.value }
                    })}
                    placeholder="PT, CV, Yayasan"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Pejabat Penandatangan *</label>
                  <input
                    type="text"
                    value={doc.company.representativeName}
                    onChange={(e) => onChange({
                      ...doc,
                      company: { ...doc.company, representativeName: e.target.value }
                    })}
                    placeholder="Nama Direktur / HR Manager"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Pejabat *</label>
                  <input
                    type="text"
                    value={doc.company.representativePosition}
                    onChange={(e) => onChange({
                      ...doc,
                      company: { ...doc.company, representativePosition: e.target.value }
                    })}
                    placeholder="Direktur Utama / HR Director"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Alamat Kantor Perusahaan</label>
                <input
                  type="text"
                  value={doc.company.address}
                  onChange={(e) => onChange({
                    ...doc,
                    company: { ...doc.company, address: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Identitas Pihak Kedua (Karyawan) */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pihak Kedua (Karyawan / Pekerja)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap Karyawan *</label>
                  <input
                    type="text"
                    value={doc.employee.fullName}
                    onChange={(e) => onChange({
                      ...doc,
                      employee: { ...doc.employee, fullName: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Induk Kependudukan (NIK KTP) *</label>
                  <input
                    type="text"
                    value={doc.employee.nik}
                    onChange={(e) => onChange({
                      ...doc,
                      employee: { ...doc.employee, nik: e.target.value }
                    })}
                    placeholder="16 Digit NIK KTP"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={doc.employee.birthPlace}
                    onChange={(e) => onChange({
                      ...doc,
                      employee: { ...doc.employee, birthPlace: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={doc.employee.birthDate}
                    onChange={(e) => onChange({
                      ...doc,
                      employee: { ...doc.employee, birthDate: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={doc.employee.gender}
                    onChange={(e) => onChange({
                      ...doc,
                      employee: { ...doc.employee, gender: e.target.value as ('Laki-laki' | 'Perempuan') }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Alamat Domisili Karyawan</label>
                <input
                  type="text"
                  value={doc.employee.address}
                  onChange={(e) => onChange({
                    ...doc,
                    employee: { ...doc.employee, address: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={doc.employee.phone}
                    onChange={(e) => onChange({
                      ...doc,
                      employee: { ...doc.employee, phone: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Karyawan</label>
                  <input
                    type="email"
                    value={doc.employee.email}
                    onChange={(e) => onChange({
                      ...doc,
                      employee: { ...doc.employee, email: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JABATAN & LOKASI (KONTRAK BARU) */}
        {activeTab === 'job' && currentCategory === 'KONTRAK_BARU' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Posisi, Departemen & Atasan
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Posisi (ID) *</label>
                  <input
                    type="text"
                    value={doc.job.positionTitle}
                    onChange={(e) => onChange({
                      ...doc,
                      job: { ...doc.job, positionTitle: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Departemen / Divisi *</label>
                  <input
                    type="text"
                    value={doc.job.department}
                    onChange={(e) => onChange({
                      ...doc,
                      job: { ...doc.job, department: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Atasan Langsung (Direct Supervisor)</label>
                  <input
                    type="text"
                    value={doc.job.directSupervisor}
                    onChange={(e) => onChange({
                      ...doc,
                      job: { ...doc.job, directSupervisor: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Skema Lokasi Kerja</label>
                  <select
                    value={doc.job.workLocationType}
                    onChange={(e) => onChange({
                      ...doc,
                      job: { ...doc.job, workLocationType: e.target.value as any }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  >
                    <option value="WFO (Kantor)">WFO (Kantor)</option>
                    <option value="WFH (Remote)">WFH (Remote)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-Site Lapangan">On-Site Lapangan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Alamat / Keterangan Penempatan</label>
                <input
                  type="text"
                  value={doc.job.workLocationAddress}
                  onChange={(e) => onChange({
                    ...doc,
                    job: { ...doc.job, workLocationAddress: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Durasi & Waktu Kerja */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Masa Kontrak & Jadwal Kerja
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Mulai Kerja *</label>
                  <input
                    type="date"
                    value={doc.job.startDate}
                    onChange={(e) => onChange({
                      ...doc,
                      job: { ...doc.job, startDate: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                {doc.contractType !== 'PKWTT' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Selesai Kontrak *</label>
                    <input
                      type="date"
                      value={doc.job.endDate || ''}
                      onChange={(e) => onChange({
                        ...doc,
                        job: { ...doc.job, endDate: e.target.value }
                      })}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Pola Hari Kerja</label>
                  <select
                    value={doc.job.workScheduleType || (doc.job.workingDaysPerWeek === 6 ? '6_HARI' : '5_HARI')}
                    onChange={(e) => {
                      const newType = e.target.value as any;
                      let days = doc.job.workDaysDetail;
                      let hrs = doc.job.workingHoursSchedule;
                      let rest = doc.job.restHoursSchedule;
                      let daysPerWeek = doc.job.workingDaysPerWeek;
                      let hoursPerDay = doc.job.workingHoursPerDay;
                      let shiftDesc = doc.job.shiftDetails;

                      if (newType === '5_HARI') {
                        days = 'Senin s/d Jumat (5 hari kerja)';
                        hrs = '08:30 - 17:30 WIB';
                        rest = '12:00 - 13:00 WIB (60 Menit - Tidak Dihitung Jam Kerja)';
                        daysPerWeek = 5;
                        hoursPerDay = 8;
                      } else if (newType === '6_HARI') {
                        days = 'Senin s/d Sabtu (6 hari kerja)';
                        hrs = '08:00 - 16:00 WIB (Senin-Jumat 7 Jam, Sabtu 5 Jam)';
                        rest = '12:00 - 13:00 WIB (60 Menit)';
                        daysPerWeek = 6;
                        hoursPerDay = 7;
                      } else if (newType === 'SHIFT') {
                        days = 'Roster Jadwal Shift Bergilir (6 Hari Kerja / 1 Hari Libur Roster)';
                        hrs = 'Rotasi Shift 8 Jam Kerja (Pagi: 07:00-16:00 / Siang: 15:00-00:00 / Malam: 23:00-08:00)';
                        rest = '60 Menit per giliran shift kerja (12:00 - 13:00 / 18:00 - 19:00 / 03:00 - 04:00)';
                        shiftDesc = 'Shift 1: 07.00 - 16.00 WIB | Shift 2: 15.00 - 00.00 WIB | Shift 3: 23.00 - 08.00 WIB';
                      }

                      const updatedJob = {
                        ...doc.job,
                        workScheduleType: newType,
                        workDaysDetail: days,
                        workingHoursSchedule: hrs,
                        restHoursSchedule: rest,
                        workingDaysPerWeek: daysPerWeek,
                        workingHoursPerDay: hoursPerDay,
                        shiftDetails: shiftDesc
                      };
                      const updatedDoc = { ...doc, job: updatedJob };
                      updatedDoc.clauses = generateDefaultClauses(updatedDoc.contractType, updatedDoc);
                      onChange(updatedDoc);
                    }}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  >
                    <option value="5_HARI">5 Hari Kerja (Senin - Jumat / 8 Jam Kerja)</option>
                    <option value="6_HARI">6 Hari Kerja (Senin - Sabtu / 7 Jam Kerja)</option>
                    <option value="SHIFT">Sistem Roster Shift Bergilir</option>
                    <option value="FLEKSIBEL">Fleksibel / Remote (40 Jam/Minggu)</option>
                    <option value="CUSTOM">Kustom / Penugasan Khusus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Rincian Hari Kerja Resmi</label>
                  <input
                    type="text"
                    value={doc.job.workDaysDetail || (doc.job.workingDaysPerWeek === 6 ? 'Senin s/d Sabtu (6 hari kerja)' : 'Senin s/d Jumat (5 hari kerja)')}
                    onChange={(e) => {
                      const updatedDoc = {
                        ...doc,
                        job: { ...doc.job, workDaysDetail: e.target.value }
                      };
                      updatedDoc.clauses = generateDefaultClauses(updatedDoc.contractType, updatedDoc);
                      onChange(updatedDoc);
                    }}
                    placeholder="Senin s/d Jumat (5 hari kerja)"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jadwal Jam Masuk &amp; Pulang Kerja</label>
                  <input
                    type="text"
                    value={doc.job.workingHoursSchedule}
                    onChange={(e) => {
                      const updatedDoc = {
                        ...doc,
                        job: { ...doc.job, workingHoursSchedule: e.target.value }
                      };
                      updatedDoc.clauses = generateDefaultClauses(updatedDoc.contractType, updatedDoc);
                      onChange(updatedDoc);
                    }}
                    placeholder="08:30 - 17:30 WIB"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jadwal Jam Istirahat Harian</label>
                  <input
                    type="text"
                    value={doc.job.restHoursSchedule || '12:00 - 13:00 WIB (60 Menit - Tidak Dihitung Jam Kerja)'}
                    onChange={(e) => {
                      const updatedDoc = {
                        ...doc,
                        job: { ...doc.job, restHoursSchedule: e.target.value }
                      };
                      updatedDoc.clauses = generateDefaultClauses(updatedDoc.contractType, updatedDoc);
                      onChange(updatedDoc);
                    }}
                    placeholder="12:00 - 13:00 WIB (60 Menit)"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              {doc.job.workScheduleType === 'SHIFT' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Rincian Pembagian Shift Kerja (Roster)</label>
                  <input
                    type="text"
                    value={doc.job.shiftDetails || ''}
                    onChange={(e) => {
                      const updatedDoc = {
                        ...doc,
                        job: { ...doc.job, shiftDetails: e.target.value }
                      };
                      updatedDoc.clauses = generateDefaultClauses(updatedDoc.contractType, updatedDoc);
                      onChange(updatedDoc);
                    }}
                    placeholder="Shift 1: 07.00-15.00 | Shift 2: 15.00-23.00 | Shift 3: 23.00-07.00 WIB"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GAJI & BENEFIT (KONTRAK BARU) */}
        {activeTab === 'comp' && currentCategory === 'KONTRAK_BARU' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Komponen Remunerasi Bulanan
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Gaji Pokok (Basic Salary) *</label>
                  <input
                    type="number"
                    value={doc.compensation.basicSalary}
                    onChange={(e) => onChange({
                      ...doc,
                      compensation: { ...doc.compensation, basicSalary: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tunjangan Tetap (Fixed Allowance)</label>
                  <input
                    type="number"
                    value={doc.compensation.fixedAllowance}
                    onChange={(e) => onChange({
                      ...doc,
                      compensation: { ...doc.compensation, fixedAllowance: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tunjangan Variabel (Makan / Transport / KPI)</label>
                <input
                  type="number"
                  value={doc.compensation.variableAllowance}
                  onChange={(e) => onChange({
                    ...doc,
                    compensation: { ...doc.compensation, variableAllowance: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Total Upah Bruto Bulanan:</span>
                <span className="font-black text-emerald-800 text-sm">
                  {formatRupiah(doc.compensation.basicSalary + doc.compensation.fixedAllowance + doc.compensation.variableAllowance)}
                </span>
              </div>
            </div>

            {/* Rekening Pembayaran */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Rekening Payroll & Tanggal Penggajian
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={doc.compensation.bankName}
                    onChange={(e) => onChange({
                      ...doc,
                      compensation: { ...doc.compensation, bankName: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    value={doc.compensation.bankAccountNumber}
                    onChange={(e) => onChange({
                      ...doc,
                      compensation: { ...doc.compensation, bankAccountNumber: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Gajian (Tgl)</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={doc.compensation.paydayDate}
                    onChange={(e) => onChange({
                      ...doc,
                      compensation: { ...doc.compensation, paydayDate: parseInt(e.target.value) || 25 }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB KHUSUS: PERPANJANGAN KONTRAK (RENEWAL_PKWT) */}
        {activeTab === 'renewal' && currentCategory === 'PERPANJANG_KONTRAK' && doc.renewal && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                Detail Kontrak Sebelumnya & Masa Perpanjangan Baru
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Kontrak Sebelumnya *</label>
                  <input
                    type="text"
                    value={doc.renewal.previousContractNumber}
                    onChange={(e) => onChange({
                      ...doc,
                      renewal: { ...doc.renewal!, previousContractNumber: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mulai Perpanjangan Baru *</label>
                  <input
                    type="date"
                    value={doc.renewal.renewalStartDate}
                    onChange={(e) => onChange({
                      ...doc,
                      renewal: { ...doc.renewal!, renewalStartDate: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Akhir Perpanjangan Baru *</label>
                  <input
                    type="date"
                    value={doc.renewal.renewalEndDate}
                    onChange={(e) => onChange({
                      ...doc,
                      renewal: { ...doc.renewal!, renewalEndDate: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Alasan Pertimbangan Perpanjangan</label>
                <textarea
                  rows={2}
                  value={doc.renewal.renewalReason}
                  onChange={(e) => onChange({
                    ...doc,
                    renewal: { ...doc.renewal!, renewalReason: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-emerald-200">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Gaji Pokok Baru pada Masa Perpanjangan (Rp)</label>
                <input
                  type="number"
                  value={doc.renewal.newBasicSalary || doc.compensation.basicSalary}
                  onChange={(e) => onChange({
                    ...doc,
                    renewal: { ...doc.renewal!, newBasicSalary: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB KHUSUS: PROMOSI JABATAN (SK_PROMOSI) */}
        {activeTab === 'promotion' && currentCategory === 'PROMOSI' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3">
              <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">
                Detail Jabatan Baru & Penyesuaian Upah Promosi
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Lama</label>
                  <input
                    type="text"
                    value={doc.promotion?.previousPositionTitle || doc.job.positionTitle}
                    onChange={(e) => {
                      const updatedPromo = {
                        ...(doc.promotion || {
                          previousPositionTitle: doc.job.positionTitle,
                          newPositionTitle: 'Senior Manager',
                          previousDepartment: doc.job.department,
                          newDepartment: doc.job.department,
                          effectiveDate: doc.signingDate,
                          considerations: [],
                          legalReferences: [],
                          observations: [],
                          decisions: []
                        }),
                        previousPositionTitle: e.target.value
                      };
                      onChange({ ...doc, promotion: updatedPromo });
                    }}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Baru (Promosi) *</label>
                  <input
                    type="text"
                    value={doc.promotion?.newPositionTitle || 'Senior Software Engineer'}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updatedPromo = {
                        ...(doc.promotion || {
                          previousPositionTitle: doc.job.positionTitle,
                          newPositionTitle: val,
                          previousDepartment: doc.job.department,
                          newDepartment: doc.job.department,
                          effectiveDate: doc.signingDate,
                          considerations: [],
                          legalReferences: [],
                          observations: [],
                          decisions: []
                        }),
                        newPositionTitle: val
                      };
                      const updatedDoc = {
                        ...doc,
                        job: { ...doc.job, positionTitle: val },
                        promotion: updatedPromo
                      };
                      updatedDoc.clauses = generateDefaultClauses('SK_PROMOSI', updatedDoc);
                      onChange(updatedDoc);
                    }}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Efektif Promosi *</label>
                  <input
                    type="date"
                    value={doc.promotion?.effectiveDate || doc.signingDate}
                    onChange={(e) => {
                      const updatedPromo = {
                        ...(doc.promotion || {
                          previousPositionTitle: doc.job.positionTitle,
                          newPositionTitle: doc.job.positionTitle,
                          previousDepartment: doc.job.department,
                          newDepartment: doc.job.department,
                          effectiveDate: e.target.value,
                          considerations: [],
                          legalReferences: [],
                          observations: [],
                          decisions: []
                        }),
                        effectiveDate: e.target.value
                      };
                      onChange({ ...doc, promotion: updatedPromo });
                    }}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Gaji Pokok Baru (Rp)</label>
                  <input
                    type="number"
                    value={doc.promotion?.newBasicSalary || doc.compensation.basicSalary}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const updatedPromo = {
                        ...(doc.promotion || {
                          previousPositionTitle: doc.job.positionTitle,
                          newPositionTitle: doc.job.positionTitle,
                          previousDepartment: doc.job.department,
                          newDepartment: doc.job.department,
                          effectiveDate: doc.signingDate,
                          considerations: [],
                          legalReferences: [],
                          observations: [],
                          decisions: []
                        }),
                        newBasicSalary: val
                      };
                      const updatedDoc = {
                        ...doc,
                        compensation: { ...doc.compensation, basicSalary: val },
                        promotion: updatedPromo
                      };
                      updatedDoc.clauses = generateDefaultClauses('SK_PROMOSI', updatedDoc);
                      onChange(updatedDoc);
                    }}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB KHUSUS: SURAT PERINGATAN (SP1, SP2, SP3) */}
        {activeTab === 'warning' && currentCategory === 'SURAT_PERINGATAN' && doc.warning && (
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                Detail Kronologi Pelanggaran & Dasar Sanksi SP
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Terjadinya Kejadian *</label>
                  <input
                    type="date"
                    value={doc.warning.incidentDate}
                    onChange={(e) => onChange({
                      ...doc,
                      warning: { ...doc.warning!, incidentDate: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Masa Berlaku SP Hingga (Standar 6 Bulan) *</label>
                  <input
                    type="date"
                    value={doc.warning.validUntilDate}
                    onChange={(e) => onChange({
                      ...doc,
                      warning: { ...doc.warning!, validUntilDate: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori Pelanggaran Disiplin</label>
                <input
                  type="text"
                  value={doc.warning.violationCategory}
                  onChange={(e) => onChange({
                    ...doc,
                    warning: { ...doc.warning!, violationCategory: e.target.value }
                  })}
                  placeholder="Keterlambatan, Kelalaian SOP, Indisipliner Presensi"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Rujukan Pasal Peraturan Perusahaan / PKB</label>
                <input
                  type="text"
                  value={doc.warning.violationClauseReference}
                  onChange={(e) => onChange({
                    ...doc,
                    warning: { ...doc.warning!, violationClauseReference: e.target.value }
                  })}
                  placeholder="Pasal 18 ayat 3 Peraturan Perusahaan mengenai Disiplin Jam Kerja"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi Fakta & Kronologi Pelanggaran *</label>
                <textarea
                  rows={3}
                  value={doc.warning.violationDescription}
                  onChange={(e) => onChange({
                    ...doc,
                    warning: { ...doc.warning!, violationDescription: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kewajiban Tindakan Perbaikan bagi Karyawan</label>
                <textarea
                  rows={2}
                  value={doc.warning.correctiveActions}
                  onChange={(e) => onChange({
                    ...doc,
                    warning: { ...doc.warning!, correctiveActions: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB KHUSUS: PEMBERHENTIAN / PHK / RESIGN */}
        {activeTab === 'termination' && currentCategory === 'PEMBERHENTIAN' && doc.termination && (
          <div className="space-y-4">
            <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 space-y-3">
              <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">
                Tanggal Efektif & Alasan Pengakhiran Hubungan Kerja
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Efektif Berakhir *</label>
                  <input
                    type="date"
                    value={doc.termination.effectiveDate}
                    onChange={(e) => onChange({
                      ...doc,
                      termination: { ...doc.termination!, effectiveDate: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Hari Kerja Terakhir (Last Working Day) *</label>
                  <input
                    type="date"
                    value={doc.termination.lastWorkingDay}
                    onChange={(e) => onChange({
                      ...doc,
                      termination: { ...doc.termination!, lastWorkingDay: e.target.value }
                    })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Alasan Resmi Pengakhiran Hubungan Kerja</label>
                <textarea
                  rows={2}
                  value={doc.termination.terminationReason}
                  onChange={(e) => onChange({
                    ...doc,
                    termination: { ...doc.termination!, terminationReason: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Hak Finansial & Kompensasi */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Penyelesaian Hak Finansial (Pesangon, Kompensasi, Hak)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Uang Kompensasi Selesai PKWT (PP 35/2021)</label>
                  <input
                    type="number"
                    value={doc.termination.pkwtCompensationPay}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const total = val + (doc.termination?.severancePay || 0) + (doc.termination?.serviceAwardPay || 0) + (doc.termination?.rightsCompensationPay || 0);
                      onChange({
                        ...doc,
                        termination: { ...doc.termination!, pkwtCompensationPay: val, totalFinancialSettlement: total }
                      });
                    }}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Uang Pesangon (Jika PHK)</label>
                  <input
                    type="number"
                    value={doc.termination.severancePay}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const total = (doc.termination?.pkwtCompensationPay || 0) + val + (doc.termination?.serviceAwardPay || 0) + (doc.termination?.rightsCompensationPay || 0);
                      onChange({
                        ...doc,
                        termination: { ...doc.termination!, severancePay: val, totalFinancialSettlement: total }
                      });
                    }}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-xs flex items-center justify-between">
                <span className="font-semibold text-rose-950">Total Penyelesaian Finansial Bersih:</span>
                <span className="font-black text-rose-850 text-sm">
                  {formatRupiah(doc.termination.totalFinancialSettlement)}
                </span>
              </div>
            </div>

            {/* Paklaring / Surat Pengalaman Kerja */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Surat Keterangan / Pengalaman Kerja (Paklaring)
              </span>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Surat Paklaring</label>
                <input
                  type="text"
                  value={doc.termination.paklaringReferenceNumber}
                  onChange={(e) => onChange({
                    ...doc,
                    termination: { ...doc.termination!, paklaringReferenceNumber: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kesan & Penilaian Kinerja Selama Pengabdian</label>
                <textarea
                  rows={2}
                  value={doc.termination.employmentConductDescription}
                  onChange={(e) => onChange({
                    ...doc,
                    termination: { ...doc.termination!, employmentConductDescription: e.target.value }
                  })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB KLAUSUL PASAL DOKUMEN (SEMUA TIPE) */}
        {activeTab === 'clauses' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daftar Pasal & Ketentuan Dokumen
              </span>
              <button
                type="button"
                onClick={() => {
                  const refreshed = generateDefaultClauses(doc.contractType, doc);
                  onChange({ ...doc, clauses: refreshed });
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Reset Pasal Standar
              </button>
            </div>

            <div className="space-y-2.5">
              {doc.clauses.map((clause, idx) => {
                const isExpanded = expandedClauseId === clause.id;

                return (
                  <div 
                    key={clause.id}
                    className={`rounded-xl border transition-all ${
                      clause.isEnabled 
                        ? 'border-slate-200 bg-white' 
                        : 'border-slate-200/60 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={clause.isEnabled}
                          onChange={() => handleToggleClause(clause.id)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-900 truncate">
                          Pasal {idx + 1}: {clause.titleId}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-3 pb-3.5 pt-1 border-t border-slate-100 space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Judul Pasal (Bahasa Indonesia):
                          </label>
                          <input
                            type="text"
                            value={clause.titleId}
                            onChange={(e) => handleUpdateClause(clause.id, { titleId: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Isi Teks Pasal (Bahasa Indonesia):
                          </label>
                          <textarea
                            rows={4}
                            value={clause.contentId}
                            onChange={(e) => handleUpdateClause(clause.id, { contentId: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 leading-relaxed font-sans"
                          />
                        </div>

                        {doc.languageMode !== 'id' && (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              Isi Teks Pasal (English Translation):
                            </label>
                            <textarea
                              rows={4}
                              value={clause.contentEn}
                              onChange={(e) => handleUpdateClause(clause.id, { contentEn: e.target.value })}
                              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 leading-relaxed font-sans"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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
