import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  UserCheck, 
  Building2, 
  Calendar, 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Award,
  AlertTriangle,
  LogOut,
  Compass
} from 'lucide-react';
import { OfficialLetterDocument, LetterType } from './types';
import { Employee } from '../../types';
import { createInitialLetterDraft, formatIndonesianDate } from './letter-templates';

interface LetterEditorViewProps {
  document: OfficialLetterDocument;
  isEditingExisting: boolean;
  availableEmployees: Employee[];
  onChange: (doc: OfficialLetterDocument) => void;
  onSave: () => void;
  onBackToList: () => void;
  onOpenPreview: () => void;
}

export const LetterEditorView: React.FC<LetterEditorViewProps> = ({
  document,
  isEditingExisting,
  availableEmployees,
  onChange,
  onSave,
  onBackToList,
  onOpenPreview
}) => {
  const [selectedTemplateType, setSelectedTemplateType] = useState<LetterType>(document.letterType);

  const handleTemplateSwitch = (newType: LetterType) => {
    setSelectedTemplateType(newType);
    const fresh = createInitialLetterDraft(newType);
    fresh.id = document.id;
    fresh.company = { ...document.company };
    if (document.employee.fullName) {
      fresh.employee = { ...document.employee };
    }
    onChange(fresh);
  };

  const handleSelectEmployee = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = e.target.value;
    if (!empId) return;
    const emp = availableEmployees.find(item => item.id === empId);
    if (!emp) return;

    onChange({
      ...document,
      employee: {
        ...document.employee,
        employeeId: emp.id,
        fullName: `${emp.firstName} ${emp.lastName || ''}`.trim(),
        nik: emp.nik || emp.id,
        positionTitle: emp.position || document.employee.positionTitle,
        department: emp.department || document.employee.department,
        startDate: emp.joinDate || document.employee.startDate,
        phone: emp.phone || document.employee.phone,
        email: emp.email || document.employee.email,
        address: emp.address || document.employee.address
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar Header Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToList}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Kembali ke Daftar Surat"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              {isEditingExisting ? 'Edit Surat & SK Resmi' : 'Buat Surat & SK Resmi Baru'}
            </h2>
            <p className="text-xs text-slate-500">{document.letterNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Simpan Draf</span>
          </button>

          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Pratinjau / Cetak</span>
          </button>
        </div>
      </div>

      {/* 1. SELEKTOR TEMPLATE SURAT & SK */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Pilih Jenis Format Surat / SK Resmi</span>
          </h3>
          <span className="text-xs text-slate-400">Template Terstandar Regulasi HR</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            { type: 'SK_PROMOSI' as LetterType, label: 'SK Promosi', desc: 'Kenaikan Jabatan' },
            { type: 'SK_DEMOSI' as LetterType, label: 'SK Demosi', desc: 'Penyesuaian Posisi' },
            { type: 'SK_MUTASI' as LetterType, label: 'SK Mutasi', desc: 'Rotasi Cabang/Divisi' },
            { type: 'SK_PENGANGKATAN' as LetterType, label: 'SK Tetap', desc: 'Pengangkatan PKWTT' },
            { type: 'SP1' as LetterType, label: 'Surat SP 1', desc: 'Peringatan Pertama' },
            { type: 'SP2' as LetterType, label: 'Surat SP 2', desc: 'Peringatan Kedua' },
            { type: 'SP3' as LetterType, label: 'Surat SP 3', desc: 'Peringatan Terakhir' },
            { type: 'PAKLARING' as LetterType, label: 'Paklaring', desc: 'Surat Pengalaman' },
            { type: 'PHK' as LetterType, label: 'Surat PHK', desc: 'Pemutusan Kerja' },
            { type: 'RESIGN_ACCEPTANCE' as LetterType, label: 'Persetujuan Resign', desc: 'Terima Resign' },
            { type: 'SURAT_TUGAS' as LetterType, label: 'Surat Tugas', desc: 'Perjalanan Dinas' },
          ].map(item => (
            <button
              key={item.type}
              type="button"
              onClick={() => handleTemplateSwitch(item.type)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                document.letterType === item.type
                  ? 'bg-blue-50/80 border-blue-600 text-blue-900 font-bold shadow-2xs ring-1 ring-blue-500/20'
                  : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
              }`}
            >
              <div className="text-xs font-bold leading-tight">{item.label}</div>
              <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Identitas Berkas & Profil Karyawan */}
        <div className="space-y-6">
          
          {/* Box 1: Nomor & Tanggal Surat */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Informasi Nomor Berkas
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Surat / SK Resmi</label>
                <input
                  type="text"
                  value={document.letterNumber}
                  onChange={e => onChange({ ...document, letterNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kota Diterbitkan</label>
                  <input
                    type="text"
                    value={document.issuingCity}
                    onChange={e => onChange({ ...document, issuingCity: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Terbit</label>
                  <input
                    type="date"
                    value={document.issuingDate}
                    onChange={e => onChange({ ...document, issuingDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Pilih Karyawan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Penerima Surat / Karyawan
              </h4>
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>

            {availableEmployees.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih dari Database Karyawan</label>
                <select
                  onChange={handleSelectEmployee}
                  defaultValue=""
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="" disabled>-- Pilih Karyawan (Auto-Fill) --</option>
                  {availableEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.nik || emp.id}) - {emp.position}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={document.employee.fullName}
                  onChange={e => onChange({
                    ...document,
                    employee: { ...document.employee, fullName: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Induk (NIK)</label>
                  <input
                    type="text"
                    value={document.employee.nik}
                    onChange={e => onChange({
                      ...document,
                      employee: { ...document.employee, nik: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Departemen</label>
                  <input
                    type="text"
                    value={document.employee.department}
                    onChange={e => onChange({
                      ...document,
                      employee: { ...document.employee, department: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Penandatangan / Otorisator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Penandatangan Surat
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pejabat</label>
              <input
                type="text"
                value={document.signatoryName}
                onChange={e => onChange({ ...document, signatoryName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Penandatangan</label>
              <input
                type="text"
                value={document.signatoryTitle}
                onChange={e => onChange({ ...document, signatoryTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Right Column (2 Cols): Dynamic Content Editor Based on Template */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. EDITOR SK (Promosi / Demosi / Mutasi / Pengangkatan) */}
          {document.category === 'SK_KEPUTUSAN' && document.careerChange && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Rincian Keputusan & Perubahan Jabatan
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Semula</label>
                  <input
                    type="text"
                    value={document.careerChange.previousPosition}
                    onChange={e => onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, previousPosition: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Baru</label>
                  <input
                    type="text"
                    value={document.careerChange.newPosition}
                    onChange={e => onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, newPosition: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-blue-400 bg-blue-50/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Divisi Semula</label>
                  <input
                    type="text"
                    value={document.careerChange.previousDepartment}
                    onChange={e => onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, previousDepartment: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Divisi Baru</label>
                  <input
                    type="text"
                    value={document.careerChange.newDepartment}
                    onChange={e => onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, newDepartment: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Upah Pokok Baru (Opsional)</label>
                  <input
                    type="number"
                    value={document.careerChange.newSalary || ''}
                    onChange={e => onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, newSalary: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: 15000000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Berlaku Efektif</label>
                  <input
                    type="date"
                    value={document.careerChange.effectiveDate}
                    onChange={e => onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, effectiveDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Konsiderans Menimbang */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-900">Konsiderans Menimbang (Alasan Keputusan)</label>
                {document.careerChange.considerations.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">{String.fromCharCode(97 + idx)}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        const updated = [...document.careerChange!.considerations];
                        updated[idx] = e.target.value;
                        onChange({
                          ...document,
                          careerChange: { ...document.careerChange!, considerations: updated }
                        });
                      }}
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. EDITOR SURAT PERINGATAN (SP 1, SP 2, SP 3) */}
          {document.category === 'PERINGATAN' && document.warning && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Rincian Pelanggaran & Sanksi Peringatan
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Surat Peringatan</label>
                  <select
                    value={document.warning.warningLevel}
                    onChange={e => onChange({
                      ...document,
                      warning: { ...document.warning!, warningLevel: Number(e.target.value) as 1 | 2 | 3 }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-bold"
                  >
                    <option value={1}>SP 1 (Peringatan Pertama)</option>
                    <option value={2}>SP 2 (Peringatan Kedua)</option>
                    <option value={3}>SP 3 (Peringatan Terakhir)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kejadian Pelanggaran</label>
                  <input
                    type="date"
                    value={document.warning.incidentDate}
                    onChange={e => onChange({
                      ...document,
                      warning: { ...document.warning!, incidentDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rujukan Pasal PP / PKB yang Dilanggar</label>
                  <input
                    type="text"
                    value={document.warning.violationClauseReference}
                    onChange={e => onChange({
                      ...document,
                      warning: { ...document.warning!, violationClauseReference: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    placeholder="Contoh: Peraturan Perusahaan Bab VII Pasal 18 ayat (3)"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Kronologi Pelanggaran</label>
                  <textarea
                    rows={4}
                    value={document.warning.violationDescription}
                    onChange={e => onChange({
                      ...document,
                      warning: { ...document.warning!, violationDescription: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tindakan Perbaikan yang Wajib Dilakukan</label>
                  <textarea
                    rows={2}
                    value={document.warning.correctiveActions}
                    onChange={e => onChange({
                      ...document,
                      warning: { ...document.warning!, correctiveActions: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. EDITOR PAKLARING & RESIGN */}
          {document.category === 'KETERANGAN' && document.certificate && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Rincian Surat Keterangan Kerja (Paklaring)
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai Bekerja</label>
                  <input
                    type="date"
                    value={document.certificate.employmentStartDate}
                    onChange={e => onChange({
                      ...document,
                      certificate: { ...document.certificate!, employmentStartDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Terakhir Bekerja</label>
                  <input
                    type="date"
                    value={document.certificate.employmentEndDate}
                    onChange={e => onChange({
                      ...document,
                      certificate: { ...document.certificate!, employmentEndDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Terakhir</label>
                  <input
                    type="text"
                    value={document.certificate.lastPosition}
                    onChange={e => onChange({
                      ...document,
                      certificate: { ...document.certificate!, lastPosition: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Penilaian Kinerja / Etos Kerja</label>
                  <select
                    value={document.certificate.conductRating}
                    onChange={e => onChange({
                      ...document,
                      certificate: { ...document.certificate!, conductRating: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-bold"
                  >
                    <option value="Sangat Baik">Sangat Baik</option>
                    <option value="Baik">Baik</option>
                    <option value="Cukup">Cukup</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Apresiasi & Rekomendasi</label>
                  <textarea
                    rows={4}
                    value={document.certificate.recommendationNote}
                    onChange={e => onChange({
                      ...document,
                      certificate: { ...document.certificate!, recommendationNote: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. EDITOR SURAT PHK */}
          {document.category === 'PENGAKHIRAN' && document.termination && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <LogOut className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Rincian Pemutusan Hubungan Kerja (PHK) & Kompensasi
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dasar & Alasan PHK</label>
                  <input
                    type="text"
                    value={document.termination.terminationReason}
                    onChange={e => onChange({
                      ...document,
                      termination: { ...document.termination!, terminationReason: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Uang Pesangon (UP)</label>
                  <input
                    type="number"
                    value={document.termination.severancePay}
                    onChange={e => {
                      const v = Number(e.target.value);
                      const total = v + document.termination!.serviceAwardPay + document.termination!.rightsCompensationPay;
                      onChange({
                        ...document,
                        termination: { ...document.termination!, severancePay: v, totalSettlement: total }
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Uang Penghargaan Masa Kerja (UPMK)</label>
                  <input
                    type="number"
                    value={document.termination.serviceAwardPay}
                    onChange={e => {
                      const v = Number(e.target.value);
                      const total = document.termination!.severancePay + v + document.termination!.rightsCompensationPay;
                      onChange({
                        ...document,
                        termination: { ...document.termination!, serviceAwardPay: v, totalSettlement: total }
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Uang Penggantian Hak (UPH)</label>
                  <input
                    type="number"
                    value={document.termination.rightsCompensationPay}
                    onChange={e => {
                      const v = Number(e.target.value);
                      const total = document.termination!.severancePay + document.termination!.serviceAwardPay + v;
                      onChange({
                        ...document,
                        termination: { ...document.termination!, rightsCompensationPay: v, totalSettlement: total }
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Kompensasi Akhir</label>
                  <div className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-300 rounded-xl font-bold text-rose-700">
                    Rp {document.termination.totalSettlement.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. EDITOR SURAT TUGAS & DINAS */}
          {document.category === 'PENUGASAN' && document.assignment && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Rincian Penugasan & Perjalanan Dinas
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Lokasi Tujuan</label>
                  <input
                    type="text"
                    value={document.assignment.destinationCity}
                    onChange={e => onChange({
                      ...document,
                      assignment: { ...document.assignment!, destinationCity: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instansi / Lokasi Kerja</label>
                  <input
                    type="text"
                    value={document.assignment.destinationCompanyOrPlace}
                    onChange={e => onChange({
                      ...document,
                      assignment: { ...document.assignment!, destinationCompanyOrPlace: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai Tugas</label>
                  <input
                    type="date"
                    value={document.assignment.departureDate}
                    onChange={e => onChange({
                      ...document,
                      assignment: { ...document.assignment!, departureDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Selesai Tugas</label>
                  <input
                    type="date"
                    value={document.assignment.returnDate}
                    onChange={e => onChange({
                      ...document,
                      assignment: { ...document.assignment!, returnDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Moda Transportasi</label>
                  <select
                    value={document.assignment.transportationType}
                    onChange={e => onChange({
                      ...document,
                      assignment: { ...document.assignment!, transportationType: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="Pesawat">Pesawat Udara</option>
                    <option value="Kereta Api">Kereta Api</option>
                    <option value="Mobil Dinas">Mobil Operasional Kantor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Uang Harian / Saku</label>
                  <input
                    type="number"
                    value={document.assignment.dailyAllowance}
                    onChange={e => onChange({
                      ...document,
                      assignment: { ...document.assignment!, dailyAllowance: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda & Keperluan Dinas</label>
                  <textarea
                    rows={3}
                    value={document.assignment.purposeOfDuty}
                    onChange={e => onChange({
                      ...document,
                      assignment: { ...document.assignment!, purposeOfDuty: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
