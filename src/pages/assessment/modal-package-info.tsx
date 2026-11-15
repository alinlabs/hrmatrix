import React from 'react';
import { 
  X, 
  Share2, 
  Play, 
  Pencil, 
  Clock, 
  ListChecks, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { TestPackage } from './types';
import { Modal } from '../../components/ui/Modal';

interface ModalPackageInfoProps {
  testPackage: TestPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (pkg: TestPackage) => void;
  onStartSimulation: (pkg: TestPackage) => void;
  onCustomize: (pkg: TestPackage) => void;
}

export const ModalPackageInfo: React.FC<ModalPackageInfoProps> = ({
  testPackage: pkg,
  isOpen,
  onClose,
  onShare,
  onStartSimulation,
  onCustomize
}) => {
  if (!pkg) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-2xl max-h-[90vh] flex flex-col"
    >
      <div 
        className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-900 leading-snug truncate">{pkg.title}</h3>
              <p className="text-xs text-slate-500 font-medium truncate">Informasi &amp; Spesifikasi Paket Tes Asesmen</p>
            </div>
          </div>

          {/* Action Icons: Edit, Share, and Close X */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onCustomize(pkg);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Paket / Soal"
            >
              <Pencil className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onShare(pkg);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Bagikan Link Asesmen"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body (Information Only - Without Individual Questions) */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Deskripsi Paket */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Deskripsi Asesmen
            </span>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
              {pkg.fullDescription || pkg.shortDescription}
            </p>
          </div>

          {/* Target Kandidat (Full Width) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Sasaran Posisi / Target Kandidat
            </span>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
              {pkg.targetAudience || 'Semua level calon karyawan & staf'}
            </p>
          </div>

          {/* Grid Spesifikasi Utama (Durasi, Jumlah Soal, Batas Keluar, Urutan Soal) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block font-medium mb-0.5">Durasi Tes</span>
              <span className="font-bold text-slate-900 text-sm">{pkg.durationMinutes} Menit</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block font-medium mb-0.5">Jumlah Soal</span>
              <span className="font-bold text-slate-900 text-sm">{pkg.totalQuestions} Butir</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block font-medium mb-0.5">Batas Keluar Sesi</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                {pkg.maxSessionExits === undefined 
                  ? 'Tidak Dibatasi' 
                  : pkg.maxSessionExits === 0 
                  ? '0x (Ketat)' 
                  : `${pkg.maxSessionExits}x Toleransi`}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block font-medium mb-0.5">Urutan Soal</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                {pkg.randomizePerCandidate ? 'Diacak Otomatis' : 'Sesuai Urutan'}
              </span>
            </div>
          </div>

          {/* Dimensi Pengukuran */}
          {pkg.measuringPoints && pkg.measuringPoints.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Dimensi & Elemen Pengukuran Utama
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.measuringPoints.map((point, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-700 leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Petunjuk Pengerjaan */}
          {pkg.instructions && pkg.instructions.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Petunjuk Pengerjaan untuk Kandidat
              </span>
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                {pkg.instructions.map((inst, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-slate-400 w-4 shrink-0">{idx + 1}.</span>
                    <span className="text-slate-600 leading-relaxed">{inst}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sistem Keamanan Anti-Contek */}
          <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-xl flex items-start gap-3 text-slate-700">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="font-bold text-blue-950 text-xs">Sistem Evaluasi Terstandar HRMatrix</h5>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Hasil asesmen dihitung secara otomatis dan akurat. Menyediakan visualisasi grafik kuadran DISC, skor potensi kognitif, dan laporan rekomendasi rekrutmen siap pakai.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-center shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartSimulation(pkg);
            }}
            className="w-full sm:w-auto px-8 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-xs text-center"
          >
            Uji &amp; Simulasi Test
          </button>
        </div>
      </div>
    </Modal>
  );
};
