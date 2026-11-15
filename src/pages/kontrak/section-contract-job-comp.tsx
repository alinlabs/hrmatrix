import React from 'react';
import { ContractDocument } from './types';
import { generateDefaultClauses, formatRupiah } from './contract-templates';

interface SectionContractJobProps {
  doc: ContractDocument;
  onChange: (updated: ContractDocument) => void;
}

export const SectionContractJob: React.FC<SectionContractJobProps> = ({ doc, onChange }) => {
  return (
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
                job: { ...doc.job, workLocationType: e.target.value as ContractDocument['job']['workLocationType'] }
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
                const newType = e.target.value as ContractDocument['job']['workScheduleType'];
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
  );
};

interface SectionContractCompProps {
  doc: ContractDocument;
  onChange: (updated: ContractDocument) => void;
}

export const SectionContractComp: React.FC<SectionContractCompProps> = ({ doc, onChange }) => {
  return (
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
  );
};
