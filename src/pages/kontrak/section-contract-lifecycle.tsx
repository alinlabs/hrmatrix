import React from 'react';
import { ContractDocument } from './types';
import { generateDefaultClauses, formatRupiah } from './contract-templates';

interface SectionContractLifecycleProps {
  doc: ContractDocument;
  onChange: (updated: ContractDocument) => void;
  activeTab: string;
}

export const SectionContractLifecycle: React.FC<SectionContractLifecycleProps> = ({
  doc,
  onChange,
  activeTab,
}) => {
  if (activeTab === 'renewal' && doc.renewal) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
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

          <div className="pt-2 border-t border-slate-200">
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
    );
  }

  if (activeTab === 'promotion') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
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
    );
  }

  if (activeTab === 'warning' && doc.warning) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
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
    );
  }

  if (activeTab === 'termination' && doc.termination) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
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

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-700">Total Penyelesaian Finansial Bersih:</span>
            <span className="font-bold text-rose-600 text-sm">
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
    );
  }

  return null;
};
