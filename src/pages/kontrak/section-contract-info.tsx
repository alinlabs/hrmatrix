import React from 'react';
import { ContractDocument } from './types';

interface SectionContractInfoProps {
  doc: ContractDocument;
  onChange: (updated: ContractDocument) => void;
}

export const SectionContractInfo: React.FC<SectionContractInfoProps> = ({ doc, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Nomor & Tanggal Surat */}
      <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Nomor & Pengesahan Dokumen
        </span>

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
      <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Pihak Pertama (Perusahaan / Pemberi Kerja)
        </span>

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
      <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Pihak Kedua (Karyawan / Pekerja)
        </span>

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
  );
};
