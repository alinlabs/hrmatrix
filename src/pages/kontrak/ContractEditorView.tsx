import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  FileCheck2, 
  AlertTriangle, 
  LogOut, 
  Check, 
  ShieldCheck,
  Scale,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContractDocument, ContractType, ContractCategory, ContractLanguageMode } from './types';
import { CONTRACT_CATEGORIES, CONTRACT_PRESETS, getCategoryForType, generateDefaultClauses, createInitialContractDraft } from './contract-templates';
import { ContractForm } from './ContractForm';
import { Employee } from '../../types';

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
  document: doc,
  isEditingExisting,
  availableEmployees,
  onChange,
  onSave,
  onBackToList,
  onOpenPreview
}) => {
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const activeCategory = doc.category || getCategoryForType(doc.contractType);

  // Handler: Switch Category & Default Contract Type
  const handleSelectCategory = (category: ContractCategory) => {
    const meta = CONTRACT_CATEGORIES.find(c => c.id === category);
    if (!meta) return;
    handleSwitchType(meta.defaultType);
  };

  // Handler: Switch specific Contract Type
  const handleSwitchType = (newType: ContractType) => {
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
      contractNumber: doc.contractNumber ? doc.contractNumber : `${randomNum}/HRM-${prefixes[newType]}/${currentMonthRoman}/${currentYear}`,
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
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = CONTRACT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    handleSwitchType(preset.type);
    setShowPresetMenu(false);
  };

  const handleSaveClick = () => {
    onSave();
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  return (
    <div className="space-y-4">
      
      {/* 1. TOP NAVIGATION & ACTION BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            title="Kembali ke Daftar Berkas"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
              {isEditingExisting ? 'Mode Edit Dokumen:' : 'Pembuatan Dokumen Baru:'} <span className="text-blue-700">{doc.contractNumber}</span>
            </span>
          </div>
        </div>

        {/* Right: Quick Tools (Presets, Save, Preview) */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Quick Presets */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Pilih contoh draf dokumen siap pakai"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Muat Contoh</span>
            </button>

            {showPresetMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowPresetMenu(false)} 
                />
                <div className="absolute right-0 mt-1.5 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                      Pilih Contoh Template:
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Klik untuk mengisi data otomatis sesuai skenario.
                    </span>
                  </div>

                  <div className="space-y-1">
                    {CONTRACT_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleLoadPreset(preset.id)}
                        className="w-full text-left p-2 rounded-xl hover:bg-blue-50/80 transition-colors flex items-start gap-2.5 cursor-pointer group"
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          preset.category === 'KONTRAK_BARU' ? 'bg-blue-600' :
                          preset.category === 'PERPANJANG_KONTRAK' ? 'bg-emerald-600' :
                          preset.category === 'SURAT_PERINGATAN' ? 'bg-amber-600' : 'bg-rose-600'
                        }`} />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block truncate">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-slate-500 line-clamp-1 leading-tight mt-0.5">
                            {preset.description}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tombol Simpan Dokumen */}
          <button
            type="button"
            onClick={handleSaveClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs ${
              saveSuccessNotice 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
            title="Simpan perubahan berkas ke database lokal"
          >
            {saveSuccessNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Dokumen</span>
              </>
            )}
          </button>

          {/* Tombol Pratinjau & Cetak PDF */}
          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-xs"
            title="Buka pratinjau dokumen PDF resmi"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>

        </div>

      </div>

      {/* 2. 5 TEMPLATE MASTER CARDS (NORMAL SCROLLING) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-2.5">
        
        {/* 5 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          {/* Card 1: Template Kontrak Baru */}
          <div 
            onClick={() => handleSelectCategory('KONTRAK_BARU')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              activeCategory === 'KONTRAK_BARU'
                ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  activeCategory === 'KONTRAK_BARU' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeCategory === 'KONTRAK_BARU' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                }`}>
                  4 Tipe
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  1. Kontrak Baru
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  PKWT, SK Pengangkatan (PKWTT), Magang, & Freelance.
                </p>
              </div>
            </div>

            {/* Sub-pills */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
              {[
                { type: 'PKWT' as ContractType, label: 'PKWT' },
                { type: 'PKWTT' as ContractType, label: 'PKWTT' },
                { type: 'INTERNSHIP' as ContractType, label: 'Magang' },
                { type: 'FREELANCE' as ContractType, label: 'Freelance' }
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwitchType(item.type);
                  }}
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    doc.contractType === item.type
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Template Perpanjangan Kontrak */}
          <div 
            onClick={() => handleSelectCategory('PERPANJANG_KONTRAK')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              activeCategory === 'PERPANJANG_KONTRAK'
                ? 'bg-emerald-50/70 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  activeCategory === 'PERPANJANG_KONTRAK' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeCategory === 'PERPANJANG_KONTRAK' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                }`}>
                  Addendum PKWT
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  2. Perpanjangan
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  Addendum Perpanjangan Kontrak PKWT.
                </p>
              </div>
            </div>

            {/* Sub-pills */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwitchType('RENEWAL_PKWT');
                }}
                className={`text-[9px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  doc.contractType === 'RENEWAL_PKWT'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Addendum PKWT
              </button>
            </div>
          </div>

          {/* Card 3: Template SK Promosi Jabatan */}
          <div 
            onClick={() => handleSelectCategory('PROMOSI')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              activeCategory === 'PROMOSI'
                ? 'bg-purple-50/70 border-purple-600 shadow-sm ring-2 ring-purple-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  activeCategory === 'PROMOSI' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                }`}>
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeCategory === 'PROMOSI' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                }`}>
                  SK Resmi
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  3. Promosi Jabatan
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  SK Promosi Jabatan & Penyesuaian Upah.
                </p>
              </div>
            </div>

            {/* Sub-pills */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwitchType('SK_PROMOSI');
                }}
                className={`text-[9px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  doc.contractType === 'SK_PROMOSI'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                SK Promosi
              </button>
            </div>
          </div>

          {/* Card 4: Template Surat Peringatan */}
          <div 
            onClick={() => handleSelectCategory('SURAT_PERINGATAN')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              activeCategory === 'SURAT_PERINGATAN'
                ? 'bg-amber-50/70 border-amber-600 shadow-sm ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  activeCategory === 'SURAT_PERINGATAN' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700'
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeCategory === 'SURAT_PERINGATAN' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}>
                  SP 1 / 2 / 3
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  4. Surat Peringatan
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  Surat teguran resmi indisipliner.
                </p>
              </div>
            </div>

            {/* Sub-pills */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
              {[
                { type: 'SP1' as ContractType, label: 'SP 1' },
                { type: 'SP2' as ContractType, label: 'SP 2' },
                { type: 'SP3' as ContractType, label: 'SP 3' }
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwitchType(item.type);
                  }}
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    doc.contractType === item.type
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card 5: Template Pemberhentian / PHK */}
          <div 
            onClick={() => handleSelectCategory('PEMBERHENTIAN')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              activeCategory === 'PEMBERHENTIAN'
                ? 'bg-rose-50/70 border-rose-600 shadow-sm ring-2 ring-rose-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  activeCategory === 'PEMBERHENTIAN' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'
                }`}>
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeCategory === 'PEMBERHENTIAN' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}>
                  3 Opsi
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  5. Pemberhentian / PHK
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  Selesai PKWT, PHK, Resign.
                </p>
              </div>
            </div>

            {/* Sub-pills */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
              {[
                { type: 'END_CONTRACT' as ContractType, label: 'Selesai PKWT' },
                { type: 'PHK' as ContractType, label: 'PHK' },
                { type: 'RESIGN_ACCEPTANCE' as ContractType, label: 'Resign' }
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwitchType(item.type);
                  }}
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    doc.contractType === item.type
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Active Document Status Strip */}
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-700">Format Dokumen:</span>
            <span className="font-semibold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              {doc.titleId}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">
              No: <strong className="text-slate-900">{doc.contractNumber}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <span>{doc.clauses.filter(c => c.isEnabled).length} Klausul Aktif</span>
            <span>·</span>
            <span className="capitalize">Bahasa: {doc.languageMode === 'bilingual' ? '2 Bahasa' : doc.languageMode}</span>
          </div>
        </div>

      </div>

      {/* 3. FORMULIR PENGISIAN LENGKAP */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs">
        <ContractForm
          document={doc}
          onChange={onChange}
          availableEmployees={availableEmployees}
          onOpenPreview={onOpenPreview}
        />
      </div>

    </div>
  );
};
