import React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Sparkles,
} from 'lucide-react';
import { VacancyItem } from '../lowongan/types';

interface TabCandidateProfilProps {
  candidateName: string;
  setCandidateName: (val: string) => void;
  candidateEmail: string;
  setCandidateEmail: (val: string) => void;
  candidatePhone: string;
  setCandidatePhone: (val: string) => void;
  candidateAddress: string;
  setCandidateAddress: (val: string) => void;
  vacancyId: string;
  vacancyTitle: string;
  vacancies: VacancyItem[];
  onSelectVacancy: (selectedId: string) => void;
  linkedinUrl: string;
  portfolioUrl: string;
  setLinkedinUrl: (val: string) => void;
  setPortfolioUrl: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
}

export const TabCandidateProfil: React.FC<TabCandidateProfilProps> = ({
  candidateName,
  setCandidateName,
  candidateEmail,
  setCandidateEmail,
  candidatePhone,
  setCandidatePhone,
  candidateAddress,
  setCandidateAddress,
  vacancyId,
  vacancyTitle,
  vacancies,
  onSelectVacancy,
  linkedinUrl,
  portfolioUrl,
  setLinkedinUrl,
  setPortfolioUrl,
  summary,
  setSummary,
}) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nama Lengkap */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Nama Lengkap Kandidat</span>
          </label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Contoh: Ir. Hendra Wijaya, M.M."
            className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Alamat Email</span>
          </label>
          <input
            type="email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            placeholder="nama.kandidat@email.com"
            className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Telepon / WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Nomor Telepon / WhatsApp</span>
          </label>
          <input
            type="text"
            value={candidatePhone}
            onChange={(e) => setCandidatePhone(e.target.value)}
            placeholder="0812-XXXX-XXXX"
            className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Domisili / Alamat */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Domisili / Kota Asal</span>
          </label>
          <input
            type="text"
            value={candidateAddress}
            onChange={(e) => setCandidateAddress(e.target.value)}
            placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
            className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Lowongan / Posisi Dilamar */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Posisi Job Desk yang Dilamar</span>
          </label>
          <select
            value={vacancyId}
            onChange={(e) => onSelectVacancy(e.target.value)}
            className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          >
            <option value={vacancyId}>{vacancyTitle || 'Pilih Posisi Lowongan'}</option>
            {vacancies.filter(v => v.id !== vacancyId).map(v => (
              <option key={v.id} value={v.id}>{v.jobTitle} ({v.department})</option>
            ))}
          </select>
        </div>

        {/* LinkedIn / Portofolio URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Tautan LinkedIn / Portofolio Web</span>
          </label>
          <input
            type="url"
            value={linkedinUrl || portfolioUrl}
            onChange={(e) => {
              setLinkedinUrl(e.target.value);
              setPortfolioUrl(e.target.value);
            }}
            placeholder="https://linkedin.com/in/username"
            className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Ringkasan Profil / Executive Summary */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Ringkasan Profil Kandidat (Executive Summary)</span>
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          placeholder="Ringkasan kualifikasi, pengalaman utama, dan profil profesional..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
        />
      </div>
    </div>
  );
};
