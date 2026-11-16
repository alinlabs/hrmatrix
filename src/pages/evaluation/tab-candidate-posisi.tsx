import React from 'react';
import { Calendar, CheckCircle2, Briefcase } from 'lucide-react';
import { VacancyItem } from '../lowongan/types';

export function getDeadlineStatusText(deadlineStr?: string, status?: string) {
  if (status === 'Ditutup') {
    return { isExpired: true, text: 'Sudah Melewati Batas Tanggal Dibuka' };
  }
  if (!deadlineStr) {
    return { isExpired: false, text: 'Dibuka Hingga Posisi Terisi' };
  }
  const parts = deadlineStr.split('-');
  let deadlineDate: Date | null = null;
  if (parts.length === 3 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1])) && !isNaN(Number(parts[2]))) {
    deadlineDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 23, 59, 59);
  } else {
    const parsed = new Date(deadlineStr);
    if (!isNaN(parsed.getTime())) {
      deadlineDate = parsed;
      deadlineDate.setHours(23, 59, 59, 999);
    }
  }
  const now = new Date();
  if (deadlineDate && now > deadlineDate) {
    return { isExpired: true, text: 'Sudah Melewati Batas Tanggal Dibuka' };
  }
  let formattedDate = deadlineStr;
  if (deadlineDate) {
    try {
      formattedDate = deadlineDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      // keep raw string
    }
  }
  return { isExpired: false, text: `Dibuka Hingga ${formattedDate}` };
}

interface TabCandidatePosisiProps {
  activeVacancy: VacancyItem | null;
  vacancyId: string;
  vacancyTitle: string;
  vacancies: VacancyItem[];
  deadlineInfo: { isExpired: boolean; text: string };
  displayLocation: string;
  displayDomicile: string;
  displayWorkType: string;
  displayWorkModel: string;
  displayLevel: string;
  displayDept: string;
  displayDivision: string;
  displaySalary: string;
  displayRoleSummary: string;
  onChangeVacancy: (selectedId: string) => void;
}

export const TabCandidatePosisi: React.FC<TabCandidatePosisiProps> = ({
  activeVacancy,
  vacancyId,
  vacancyTitle,
  vacancies,
  deadlineInfo,
  displayLocation,
  displayDomicile,
  displayWorkType,
  displayWorkModel,
  displayLevel,
  displayDept,
  displayDivision,
  displaySalary,
  displayRoleSummary,
  onChangeVacancy,
}) => {
  return (
    <div className="space-y-5">
      {/* Card Screening Identik Container */}
      <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 sm:p-7 shadow-2xs space-y-5">
        {/* Header Row: Status Batas Tanggal & Badge Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className={`text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            deadlineInfo.isExpired ? 'text-rose-600' : 'text-slate-600'
          }`}>
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{deadlineInfo.text}</span>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Lowongan {activeVacancy?.status || 'Aktif'}</span>
          </span>
        </div>

        {/* Nama Posisi, Departemen & Level */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {vacancyTitle || activeVacancy?.jobTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {displayDept} {displayDivision !== displayDept ? `• ${displayDivision}` : ''} • <strong className="text-slate-700">{displayLevel}</strong>
          </p>
        </div>

        {/* 4 Mini Cards Grid (Penempatan, Domisili Khusus, Jenis Waktu, Model Kerja) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Penempatan */}
          <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
            <div className="text-[11px] font-normal text-slate-500">Penempatan</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={displayLocation}>
              {displayLocation}
            </div>
          </div>

          {/* Card 2: Domisili Kandidat Khusus */}
          <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
            <div className="text-[11px] font-normal text-slate-500">Domisili Kandidat</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={displayDomicile}>
              {displayDomicile}
            </div>
          </div>

          {/* Card 3: Jenis Waktu */}
          <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
            <div className="text-[11px] font-normal text-slate-500">Jenis Waktu</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={displayWorkType}>
              {displayWorkType}
            </div>
          </div>

          {/* Card 4: Model Kerja */}
          <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
            <div className="text-[11px] font-normal text-slate-500">Model Kerja</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={displayWorkModel}>
              {displayWorkModel}
            </div>
          </div>
        </div>

        {/* Card Rentang Gaji (Hijau Tipis Sesuai Spesifikasi) */}
        <div className="p-4 bg-emerald-50/90 border border-emerald-200/80 rounded-xl space-y-1 text-center">
          <div className="text-xs font-semibold text-emerald-800/80">
            Rentang Gaji / Kompensasi Standar Posisi
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-800">
            {displaySalary}
          </div>
        </div>

        {/* Deskripsi & Ringkasan Peran Jabatan */}
        <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
          <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Tujuan & Ringkasan Tanggung Jawab Posisi</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {displayRoleSummary}
          </p>
        </div>
      </div>

      {/* Ganti Lowongan Posisi Quick Selector */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-slate-600 font-medium">
          Ingin memindahkan kandidat ke posisi lowongan lain?
        </div>
        <select
          value={vacancyId}
          onChange={(e) => onChangeVacancy(e.target.value)}
          className="h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value={vacancyId}>{vacancyTitle || 'Pilih Lowongan'}</option>
          {vacancies.filter(v => v.id !== vacancyId).map(v => (
            <option key={v.id} value={v.id}>{v.jobTitle} ({v.department})</option>
          ))}
        </select>
      </div>
    </div>
  );
};
