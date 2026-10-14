import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Calendar, 
  PhoneCall, 
  Clock, 
  FileText, 
  HelpCircle,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { CheckingToolMeta } from './checking-data';

export interface CheckingGuideProps {
  tool: CheckingToolMeta;
  onBackToPortal: () => void;
}

export const CheckingGuide: React.FC<CheckingGuideProps> = ({
  tool,
  onBackToPortal
}) => {
  const { guide } = tool;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 select-text">
      {/* Top Banner & Navigation Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToPortal}
              className="p-2 -ml-1 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Kembali ke Tampilan Live Portal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                {tool.logo}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Panduan SOP Verifikasi Resmi
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {tool.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToPortal}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Buka Portal Verifikasi</span>
            </button>
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tab Baru</span>
            </a>
          </div>
        </div>

        {/* Instansi & Legal Foundation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Instansi Resmi</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
              {tool.instansi}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dasar Hukum</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
              {tool.dasarHukum}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kontak Layanan</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              {tool.callCenter}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{tool.callCenterHours}</div>
          </div>
        </div>
      </div>

      {/* Dokumen Wajib & Target Verifikasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dokumen Wajib dari Kandidat</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sebelum menjalankan proses validasi, pastikan tim rekrutmen telah menerima dokumen lengkap berikut:
          </p>
          <ul className="space-y-2 pt-1">
            {guide.dokumenWajib.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Target & Indikator Validasi</span>
          </div>
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
            <div className="text-xs font-bold text-blue-950">Fokus Pemeriksaan:</div>
            <p className="text-xs text-blue-900 leading-relaxed">
              {tool.targetVerifikasi}
            </p>
          </div>
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Tingkat Urgensi Jabatan:</span>
            </div>
            <p className="text-xs text-amber-900 font-medium">
              {tool.urgensi}
            </p>
          </div>
        </div>
      </div>

      {/* Step by step verification procedure */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Alur & Tata Cara Verifikasi (Langkah demi Langkah)
          </h2>
        </div>

        <div className="space-y-3.5 pt-2">
          {guide.tataCara.map((step) => (
            <div key={step.step} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                  {step.step}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pl-8.5">
                {step.desc}
              </p>
              {step.tip && (
                <div className="ml-8.5 text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/70 p-2 rounded-lg flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Tips HR:</strong> {step.tip}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status interpretation table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Panduan Membaca Status Validasi Sistem</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {guide.statusValidasi.map((status) => (
            <div key={status.status} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
              <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${status.badgeClass}`}>
                {status.label}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {status.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance & Data Privacy Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Kepatuhan Regulasi & Perlindungan Data Pribadi (UU PDP)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {guide.catatanKepatuhan}
        </p>
        <p className="text-[11px] text-slate-400 pt-1">
          Semua proses background checking dalam platform HRMatrix dilakukan secara transparan pada portal resmi pemerintah RI tanpa menyimpan data rahasia perbankan atau kredensial pelamar di server luar yang tidak berwenang.
        </p>
      </div>
    </div>
  );
};
