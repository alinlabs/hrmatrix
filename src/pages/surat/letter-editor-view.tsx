import React, { useState } from 'react';
import { ArrowLeft, Printer, Save } from 'lucide-react';
import { Employee } from '../../types';
import { LetterType, OfficialLetterDocument } from './types';
import { createInitialLetterDraft } from './letter-templates';
import { getDepartmentName, getPositionName } from '../../services/position-service';

interface LetterEditorViewProps {
  document: OfficialLetterDocument;
  isEditingExisting: boolean;
  availableEmployees: Employee[];
  onChange: (updated: OfficialLetterDocument) => void;
  onSave: () => void;
  onBackToList: () => void;
  onOpenPreview: () => void;
}

const ALL_LETTER_TYPES: { type: LetterType; label: string }[] = [
  { type: 'SK_PROMOSI', label: 'SK Promosi Jabatan' },
  { type: 'SK_DEMOSI', label: 'SK Demosi' },
  { type: 'SK_MUTASI', label: 'SK Mutasi / Rotasi' },
  { type: 'SK_PENGANGKATAN', label: 'SK Pengangkatan Tetap (PKWTT)' },
  { type: 'SP1', label: 'Surat Peringatan 1 (SP1)' },
  { type: 'SP2', label: 'Surat Peringatan 2 (SP2)' },
  { type: 'SP3', label: 'Surat Peringatan 3 (SP3)' },
  { type: 'PAKLARING', label: 'Surat Pengalaman Kerja (Paklaring)' },
  { type: 'PHK', label: 'SK Pemutusan Hubungan Kerja (PHK)' },
  { type: 'RESIGN_ACCEPTANCE', label: 'Penerimaan Pengunduran Diri' },
  { type: 'SURAT_TUGAS', label: 'Surat Perintah Tugas / Dinas' },
];

export const LetterEditorView: React.FC<LetterEditorViewProps> = ({
  document,
  availableEmployees,
  onChange,
  onSave,
  onBackToList,
  onOpenPreview,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);

  const handleEmployeeSelect = (empId: string) => {
    const emp = availableEmployees.find((e) => e.id === empId);
    if (!emp) return;

    onChange({
      ...document,
      employee: {
        ...document.employee,
        employeeId: emp.id,
        fullName: emp.fullName,
        nik: emp.employeeId || emp.nik || document.employee.nik,
        positionTitle: getPositionName(emp.positionId) || emp.positionId,
        department: getDepartmentName(emp.departmentId, emp.positionId) || emp.departmentId,
        address: emp.address || document.employee.address,
        phone: emp.phone || document.employee.phone,
        email: emp.email || document.employee.email,
      },
    });
  };

  const handleSaveClick = () => {
    onSave();
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Jenis Surat / SK</label>
            <select
              value={document.letterType}
              onChange={(e) => {
                const nextType = e.target.value as LetterType;
                const fresh = createInitialLetterDraft(nextType);
                onChange({
                  ...fresh,
                  id: document.id,
                  company: document.company,
                  employee: document.employee,
                  signatoryName: document.signatoryName,
                  signatoryTitle: document.signatoryTitle,
                });
              }}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
            >
              {ALL_LETTER_TYPES.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Ambil Data Karyawan
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
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
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

      {/* Form Editor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-5">
        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Surat *</label>
            <input
              type="text"
              value={document.letterNumber}
              onChange={(e) => onChange({ ...document, letterNumber: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Terbit *</label>
            <input
              type="date"
              value={document.issuingDate}
              onChange={(e) => onChange({ ...document, issuingDate: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Kota Penerbitan</label>
            <input
              type="text"
              value={document.issuingCity}
              onChange={(e) => onChange({ ...document, issuingCity: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Judul / Perihal Surat</label>
          <input
            type="text"
            value={document.title}
            onChange={(e) => onChange({ ...document, title: e.target.value })}
            className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900"
          />
        </div>

        {/* Employee Info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Data Karyawan Penerima</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={document.employee.fullName}
                onChange={(e) =>
                  onChange({ ...document, employee: { ...document.employee, fullName: e.target.value } })
                }
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">NIK / ID Karyawan</label>
              <input
                type="text"
                value={document.employee.nik}
                onChange={(e) =>
                  onChange({ ...document, employee: { ...document.employee, nik: e.target.value } })
                }
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan</label>
              <input
                type="text"
                value={document.employee.positionTitle}
                onChange={(e) =>
                  onChange({ ...document, employee: { ...document.employee, positionTitle: e.target.value } })
                }
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Departemen / Divisi</label>
              <input
                type="text"
                value={document.employee.department}
                onChange={(e) =>
                  onChange({ ...document, employee: { ...document.employee, department: e.target.value } })
                }
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Specific Module Fields */}
        {document.careerChange && (
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detail Perubahan Karier / SK</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Lama</label>
                <input
                  type="text"
                  value={document.careerChange.previousPosition}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, previousPosition: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Baru</label>
                <input
                  type="text"
                  value={document.careerChange.newPosition}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, newPosition: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Efektif</label>
                <input
                  type="date"
                  value={document.careerChange.effectiveDate}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      careerChange: { ...document.careerChange!, effectiveDate: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {document.warning && (
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detail Surat Peringatan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori Pelanggaran</label>
                <input
                  type="text"
                  value={document.warning.violationCategory}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      warning: { ...document.warning!, violationCategory: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Berlaku Hingga</label>
                <input
                  type="date"
                  value={document.warning.validUntilDate}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      warning: { ...document.warning!, validUntilDate: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Uraian Pelanggaran</label>
              <textarea
                rows={3}
                value={document.warning.violationDescription}
                onChange={(e) =>
                  onChange({
                    ...document,
                    warning: { ...document.warning!, violationDescription: e.target.value },
                  })
                }
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>
        )}

        {document.certificate && (
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detail Keterangan / Paklaring</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mulai Bekerja</label>
                <input
                  type="date"
                  value={document.certificate.employmentStartDate}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      certificate: { ...document.certificate!, employmentStartDate: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Berakhir</label>
                <input
                  type="date"
                  value={document.certificate.employmentEndDate}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      certificate: { ...document.certificate!, employmentEndDate: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Catatan Kinerja</label>
              <textarea
                rows={3}
                value={document.certificate.recommendationNote}
                onChange={(e) =>
                  onChange({
                    ...document,
                    certificate: { ...document.certificate!, recommendationNote: e.target.value },
                  })
                }
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>
        )}

        {document.assignment && (
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detail Penugasan Dinas</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kota Tujuan</label>
                <input
                  type="text"
                  value={document.assignment.destinationCity}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      assignment: { ...document.assignment!, destinationCity: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Lokasi / Instansi Tujuan</label>
                <input
                  type="text"
                  value={document.assignment.destinationCompanyOrPlace}
                  onChange={(e) =>
                    onChange({
                      ...document,
                      assignment: { ...document.assignment!, destinationCompanyOrPlace: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Agenda / Tujuan Tugas</label>
              <textarea
                rows={2}
                value={document.assignment.purposeOfDuty}
                onChange={(e) =>
                  onChange({
                    ...document,
                    assignment: { ...document.assignment!, purposeOfDuty: e.target.value },
                  })
                }
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>
        )}

        {/* Penandatangan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Pejabat Penandatangan</label>
            <input
              type="text"
              value={document.signatoryName}
              onChange={(e) => onChange({ ...document, signatoryName: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan Penandatangan</label>
            <input
              type="text"
              value={document.signatoryTitle}
              onChange={(e) => onChange({ ...document, signatoryTitle: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
