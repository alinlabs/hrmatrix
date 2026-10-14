import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Cpu, 
  Sparkles, 
  Database, 
  Lock, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Award, 
  Sun, 
  Moon, 
  AlertTriangle, 
  Zap, 
  ShieldAlert, 
  Layers 
} from 'lucide-react';

// ============================================================================
// BAB 1: 1. AnimTransformasiHRIS (konsep-hris-modern)
// Transformasi berkas kertas manual ke digital chip & cloud rocket
// ============================================================================
export function AnimTransformasiHRIS() {
  const [tapped, setTapped] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setTapped(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

      {/* Kiri: Tumpukan Berkas Manual Bergeser */}
      <motion.div 
        className="relative z-10 w-20 h-24 sm:w-24 sm:h-28 bg-gradient-to-br from-amber-100 to-amber-200/80 rounded-xl shadow-md border border-amber-300/70 p-2.5 flex flex-col justify-between -mr-3"
        animate={{ 
          x: tapped ? [-10, 0] : [-5, 0, -5],
          rotate: [-4, -2, -4],
          opacity: tapped ? 0.7 : 0.95
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-800">
          <FileText className="w-4 h-4" />
        </div>
        <div className="space-y-1.5">
          <div className="w-12 h-1.5 bg-amber-400/60 rounded-full" />
          <div className="w-8 h-1 bg-amber-300/60 rounded-full" />
        </div>
      </motion.div>

      {/* Tengah: Portal Laser Transformasi */}
      <div className="relative z-20 flex flex-col items-center justify-center mx-2">
        <motion.div 
          className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-300/40"
          animate={{ rotate: 360, scale: tapped ? [1, 1.25, 1] : [1, 1.05, 1] }}
          transition={{ rotate: { duration: 12, repeat: Infinity, ease: "linear" }, scale: { duration: 0.5 } }}
        >
          <Sparkles className="w-5 h-5 text-cyan-200" />
        </motion.div>
        <motion.div 
          className="w-1 h-12 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
          animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </div>

      {/* Kanan: Chip Cerdas & Platform Digital Modern */}
      <motion.div 
        className="relative z-10 w-24 h-28 sm:w-28 sm:h-32 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-2xl shadow-xl shadow-indigo-500/20 border border-indigo-400/50 p-3 flex flex-col justify-between -ml-3 text-white"
        animate={{ 
          y: tapped ? [-6, 2, 0] : [-4, 4, -4],
          rotate: [3, 0, 3]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-cyan-300 border border-cyan-400/30">
            <Cpu className="w-4 h-4" />
          </div>
          <motion.div 
            className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-300"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="space-y-1.5">
          <motion.div 
            className="h-1.5 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full"
            animate={{ width: ["40%", "90%", "65%"] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="w-12 h-1 bg-indigo-400/40 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 1: 2. AnimIndexedDBKedaulatan (konsep-indexeddb)
// Silinder database lokal, offline first 100%, gembok keamanan
// ============================================================================
export function AnimIndexedDBKedaulatan() {
  const [locked, setLocked] = useState(true);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setLocked(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-400/25 transition-all duration-500" />
      <div className="absolute w-48 h-48 rounded-full border border-emerald-300/30 animate-[spin_25s_linear_infinite]" />

      {/* Silinder Database Lokal 3 Tingkat */}
      <motion.div 
        className="relative z-10 w-28 h-32 sm:w-32 sm:h-36 flex flex-col items-center justify-center"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Lapisan Atas Silinder */}
        <div className="w-24 sm:w-28 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 border border-emerald-200 shadow-md flex items-center justify-center">
          <Database className="w-4 h-4 text-white" />
        </div>
        {/* Lapisan Tengah */}
        <div className="w-24 sm:w-28 h-8 -mt-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 border border-emerald-300/60 shadow-inner flex items-center justify-center">
          <div className="w-8 h-1 bg-emerald-200/50 rounded-full" />
        </div>
        {/* Lapisan Dasar */}
        <div className="w-24 sm:w-28 h-9 -mt-3 rounded-full bg-gradient-to-r from-slate-800 to-emerald-900 border border-emerald-400/40 shadow-lg flex items-center justify-center">
          <motion.div 
            className="w-12 h-1 bg-cyan-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Satelit Gembok Privasi (Orbit Kiri) */}
      <motion.div 
        className="absolute top-8 left-1/4 -ml-6 z-20 w-11 h-11 rounded-2xl bg-white shadow-lg border border-emerald-200 flex items-center justify-center text-emerald-700"
        animate={{ y: [-5, 5, -5], scale: locked ? 1 : 1.15 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Lock className="w-5 h-5 text-emerald-600" />
      </motion.div>

      {/* Satelit Perisai Terverifikasi (Orbit Kanan) */}
      <motion.div 
        className="absolute bottom-8 right-1/4 -mr-6 z-20 w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white border border-emerald-200"
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <ShieldCheck className="w-5 h-5" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 2: 6. AnimPKWTvsPKWTT (data-personal-kontrak)
// Dua kartu dokumen berdampingan: PKWT (Waktu Tertentu) vs PKWTT (Tetap)
// ============================================================================
export function AnimPKWTvsPKWTT() {
  const [activeTab, setActiveTab] = useState<'pkwt' | 'pkwtt'>('pkwt');

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center gap-4 sm:gap-6 cursor-pointer select-none group"
      onClick={() => setActiveTab(p => p === 'pkwt' ? 'pkwtt' : 'pkwt')}
    >
      <div className="absolute w-56 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/20 transition-all duration-500" />

      {/* Kartu PKWT (Oranye / Waktu Tertentu) */}
      <motion.div 
        className={`relative z-10 w-28 sm:w-32 h-36 sm:h-40 rounded-2xl p-3 flex flex-col justify-between border-2 transition-all duration-400 ${
          activeTab === 'pkwt'
            ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-400 shadow-xl shadow-amber-500/20'
            : 'bg-white/80 border-slate-200 opacity-60'
        }`}
        animate={{ y: activeTab === 'pkwt' ? -6 : 4, scale: activeTab === 'pkwt' ? 1.05 : 0.95 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
        <div className="space-y-1.5 py-1">
          <div className="w-14 h-1.5 bg-amber-400/70 rounded-full" />
          <div className="w-10 h-1 bg-amber-300/70 rounded-full" />
          <div className="w-16 h-1 bg-slate-300/60 rounded-full" />
        </div>
        <div className="pt-1.5 border-t border-amber-200 flex items-center justify-end">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
        </div>
      </motion.div>

      {/* Kartu PKWTT (Biru / Karyawan Tetap) */}
      <motion.div 
        className={`relative z-10 w-28 sm:w-32 h-36 sm:h-40 rounded-2xl p-3 flex flex-col justify-between border-2 transition-all duration-400 ${
          activeTab === 'pkwtt'
            ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-500 shadow-xl shadow-blue-500/20'
            : 'bg-white/80 border-slate-200 opacity-60'
        }`}
        animate={{ y: activeTab === 'pkwtt' ? -6 : 4, scale: activeTab === 'pkwtt' ? 1.05 : 0.95 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div className="w-2 h-2 rounded-full bg-blue-600" />
        </div>
        <div className="space-y-1.5 py-1">
          <div className="w-14 h-1.5 bg-blue-500/70 rounded-full" />
          <div className="w-10 h-1 bg-blue-300/70 rounded-full" />
          <div className="w-16 h-1 bg-slate-300/60 rounded-full" />
        </div>
        <div className="pt-1.5 border-t border-blue-200 flex items-center justify-end">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 2: 7. AnimPTKPKalibrator (data-gaji-ptkp)
// Kartu identitas NIK/NPWP holografik & slider batas bebas pajak
// ============================================================================
export function AnimPTKPKalibrator() {
  const [level, setLevel] = useState(1);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setLevel(p => (p % 4) + 1)}
    >
      <div className="absolute w-56 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />

      {/* Kartu NIK/NPWP Digital */}
      <motion.div 
        className="relative z-10 w-56 sm:w-64 h-36 sm:h-40 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 border border-indigo-400/40 shadow-2xl p-4 flex flex-col justify-between text-white"
        animate={{ rotateX: [0, 5, 0], rotateY: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="w-7 h-5 rounded-sm bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-xs" />
          <CreditCard className="w-4 h-4 text-indigo-300" />
        </div>

        {/* Nomor NIK 16 digit masked */}
        <div className="flex items-center gap-1.5 py-1">
          <div className="w-8 h-1.5 bg-slate-300 rounded-full" />
          <div className="w-8 h-1.5 bg-slate-300 rounded-full" />
          <div className="w-8 h-1.5 bg-slate-300 rounded-full" />
          <div className="w-8 h-1.5 bg-amber-400 rounded-full" />
        </div>

        {/* Progress Bar Ambang Batas PTKP */}
        <div className="space-y-1 pt-1 border-t border-indigo-800/80">
          <div className="flex items-center justify-between text-indigo-300 text-xs">
            <div className="w-12 h-1 bg-indigo-400/60 rounded-full" />
            <motion.div 
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-indigo-700/50">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 rounded-full"
              animate={{ width: `${level * 25}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 2: 8. AnimJenjangKarirPiramida (jenjang-jabatan)
// Tangga piramida 4 tingkat bertingkat dengan avatar melangkah
// ============================================================================
export function AnimJenjangKarirPiramida() {
  const [step, setStep] = useState(2);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setStep(p => (p % 4) + 1)}
    >
      <div className="absolute w-56 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

      {/* Piramida Bertingkat 4 Level */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        {[
          { level: 4, width: 'w-20 sm:w-24', color: 'from-amber-400 to-yellow-500', border: 'border-amber-300' },
          { level: 3, width: 'w-32 sm:w-36', color: 'from-blue-600 to-indigo-600', border: 'border-blue-400' },
          { level: 2, width: 'w-44 sm:w-48', color: 'from-indigo-500 to-teal-500', border: 'border-indigo-300' },
          { level: 1, width: 'w-56 sm:w-60', color: 'from-slate-400 to-slate-500', border: 'border-slate-300' },
        ].map(item => (
          <motion.div
            key={item.level}
            className={`h-7 sm:h-8 rounded-xl bg-gradient-to-r ${item.color} ${item.width} border ${item.border} shadow-md flex items-center justify-center text-white`}
            animate={{ 
              scale: step === item.level ? 1.08 : 1,
              opacity: step === item.level ? 1 : 0.85
            }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          >
            {step === item.level && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Award className="w-4 h-4 text-white drop-shadow-xs" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BAB 3: 11. AnimPolaShiftRotasi (pola-shift)
// Cincin siklus 3 shift 360° (Pagi, Siang, Malam - Matahari & Bulan)
// ============================================================================
export function AnimPolaShiftRotasi() {
  const [speed, setSpeed] = useState(1);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setSpeed(p => p === 1 ? 2.5 : 1)}
    >
      <div className="absolute w-56 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
      <div className="absolute w-44 h-44 rounded-full border border-dashed border-amber-300/40" />

      {/* Orbit Rotasi Shift 360 */}
      <motion.div 
        className="relative z-10 w-44 h-44 rounded-full flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 18 / speed, repeat: Infinity, ease: "linear" }}
      >
        {/* Node Shift 1: Matahari Pagi (Top) */}
        <div className="absolute -top-4 w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-lg shadow-amber-400/30 flex items-center justify-center text-amber-900 border border-yellow-100">
          <Sun className="w-6 h-6 text-amber-600" />
        </div>

        {/* Node Shift 2: Senja / Siang (Bottom Right) */}
        <div className="absolute -bottom-2 -right-2 w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 shadow-lg shadow-orange-500/30 flex items-center justify-center text-white border border-orange-200">
          <Zap className="w-5 h-5 text-yellow-100" />
        </div>

        {/* Node Shift 3: Bulan Malam (Bottom Left) */}
        <div className="absolute -bottom-2 -left-2 w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-900 via-slate-800 to-blue-900 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-cyan-200 border border-indigo-400/50">
          <Moon className="w-5 h-5 text-cyan-300" />
        </div>
      </motion.div>

      {/* Pusat Poros Jam Kerja */}
      <motion.div 
        className="absolute z-20 w-12 h-12 rounded-2xl bg-white shadow-xl border-2 border-slate-200 flex items-center justify-center text-slate-700"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Clock className="w-6 h-6 text-blue-600" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 3: 12. AnimDendaKeterlambatan (formula-denda-telat)
// Stopwatch digital toleransi vs denda keterlambatan
// ============================================================================
export function AnimDendaKeterlambatan() {
  const [minutesLate, setMinutesLate] = useState(15);

  const toggleLate = () => {
    setMinutesLate(p => p === 0 ? 15 : p === 15 ? 30 : 0);
  };

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={toggleLate}
    >
      <div className="absolute w-56 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/20 transition-all duration-500" />

      {/* Stopwatch Shell */}
      <motion.div 
        className="relative z-10 w-44 sm:w-48 h-44 sm:h-48 rounded-full bg-gradient-to-br from-white via-slate-50 to-rose-50/40 border-4 border-slate-200 shadow-2xl p-4 flex flex-col items-center justify-center"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Tombol Atas Stopwatch */}
        <div className="absolute -top-3 w-6 h-3 bg-slate-400 rounded-t-sm" />

        {/* Jarum Menit */}
        <div className="relative w-32 h-32 rounded-full border border-slate-200 flex items-center justify-center">
          <motion.div 
            className="absolute w-1 h-14 bg-rose-500 rounded-full origin-bottom"
            style={{ bottom: '50%' }}
            animate={{ rotate: minutesLate === 0 ? 0 : minutesLate === 15 ? 90 : 180 }}
            transition={{ type: "spring", stiffness: 90, damping: 12 }}
          />
          <div className="w-3 h-3 rounded-full bg-slate-800 z-10" />

          {/* Ikon Peringatan / Koin Denda */}
          {minutesLate > 0 ? (
            <motion.div 
              className="absolute bottom-2 z-20 w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </motion.div>
          ) : (
            <motion.div 
              className="absolute bottom-2 z-20 w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 3: 13. AnimKalkulatorLembur173 (lembur-depnaker)
// Dial jam lembur malam dengan formula 1/173 & multiplier 1.5x & 2x
// ============================================================================
export function AnimKalkulatorLembur173() {
  const [multiplier, setMultiplier] = useState<'1.5x' | '2x'>('1.5x');

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setMultiplier(p => p === '1.5x' ? '2x' : '1.5x')}
    >
      <div className="absolute w-56 h-40 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/25 transition-all duration-500" />

      {/* Poros Formula 1/173 */}
      <motion.div 
        className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 border-2 border-indigo-400/60 shadow-2xl flex flex-col items-center justify-center text-white"
        animate={{ rotate: multiplier === '1.5x' ? 0 : 15, scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Moon className="w-7 h-7 text-cyan-300" />
        <div className="w-12 h-1 bg-cyan-400 rounded-full mt-2" />
      </motion.div>

      {/* Lencana Multiplier 1.5x (Kiri) */}
      <motion.div 
        className={`absolute top-10 left-1/4 -ml-6 z-20 w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
          multiplier === '1.5x' 
            ? 'bg-amber-400 text-amber-950 border-yellow-100 shadow-lg shadow-amber-400/30 scale-110' 
            : 'bg-white text-slate-400 border-slate-200'
        }`}
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Zap className="w-5 h-5 fill-current" />
      </motion.div>

      {/* Lencana Multiplier 2.0x (Kanan) */}
      <motion.div 
        className={`absolute bottom-10 right-1/4 -mr-6 z-20 w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
          multiplier === '2x' 
            ? 'bg-rose-500 text-white border-rose-200 shadow-lg shadow-rose-500/30 scale-110' 
            : 'bg-white text-slate-400 border-slate-200'
        }`}
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <Sparkles className="w-5 h-5 fill-current" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 4: 15. AnimEmpatPerisaiBPJS (skema-bpjs)
// 4 Emblem perisai perlindungan (JKK, JKM, JHT, JP + BPJS Kesehatan)
// ============================================================================
export function AnimEmpatPerisaiBPJS() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setActiveIdx(p => (p + 1) % 4)}
    >
      <div className="absolute w-56 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />

      {/* Grid 4 Perisai BPJS */}
      <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4">
        {[
          { id: 0, color: 'from-emerald-500 to-teal-600', border: 'border-emerald-300' },
          { id: 1, color: 'from-blue-600 to-cyan-600', border: 'border-blue-300' },
          { id: 2, color: 'from-indigo-600 to-purple-600', border: 'border-indigo-300' },
          { id: 3, color: 'from-amber-500 to-orange-600', border: 'border-amber-300' },
        ].map((item) => (
          <motion.div
            key={item.id}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${item.color} border-2 ${item.border} shadow-lg flex items-center justify-center text-white transition-transform duration-300`}
            animate={{ 
              scale: activeIdx === item.id ? 1.15 : 1,
              rotate: activeIdx === item.id ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 0.4 }}
          >
            <ShieldCheck className="w-6 h-6 text-white" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BAB 4: 16. AnimPPh21TERMatrix (pajak-pph21-ter)
// Matrix grid visual TER Kategori A, B, C dengan kalkulator persentase pajak
// ============================================================================
export function AnimPPh21TERMatrix() {
  const [category, setCategory] = useState<'A' | 'B' | 'C'>('A');

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setCategory(p => p === 'A' ? 'B' : p === 'B' ? 'C' : 'A')}
    >
      <div className="absolute w-56 h-40 bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/25 transition-all duration-500" />

      {/* Kartu Kalkulator Pajak TER */}
      <motion.div 
        className="relative z-10 w-52 sm:w-60 h-36 sm:h-40 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-teal-50/40 border border-teal-200/80 shadow-xl p-4 flex flex-col justify-between"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            {['A', 'B', 'C'].map(cat => (
              <div 
                key={cat}
                className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                  category === cat ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Bar Persentase Pajak */}
        <div className="space-y-2 py-1">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-teal-500 rounded-full"
              animate={{ width: category === 'A' ? '30%' : category === 'B' ? '55%' : '75%' }}
              transition={{ type: "spring", stiffness: 90, damping: 14 }}
            />
          </div>
          <div className="w-16 h-1.5 bg-slate-300 rounded-full" />
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          <div className="w-12 h-1 bg-slate-400 rounded-full" />
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 4: 17. AnimTHRKeagamaanProrata (formula-thr-keagamaan)
// Ketupat emas bercahaya, amplop THR, pita kado bertabur bintang
// ============================================================================
export function AnimTHRKeagamaanProrata() {
  const [opened, setOpened] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setOpened(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/30 transition-all duration-500" />

      {/* Ketupat Emas Berputar Melayang */}
      <motion.div 
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-2xl shadow-amber-500/40 border-2 border-yellow-100 flex items-center justify-center text-amber-950"
        animate={{ 
          rotate: opened ? 45 : [40, 50, 40],
          scale: opened ? [1, 1.15, 1] : [1, 1.05, 1]
        }}
        transition={{ duration: opened ? 0.4 : 4, repeat: opened ? 0 : Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-10 h-10 text-amber-900" />
      </motion.div>

      {/* Satelit Koin Kado THR (Kiri) */}
      <motion.div 
        className="absolute top-8 left-1/4 -ml-6 z-20 w-11 h-11 rounded-2xl bg-white shadow-lg border border-yellow-200 flex items-center justify-center text-amber-600"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Award className="w-6 h-6 text-amber-500" />
      </motion.div>

      {/* Satelit Amplop THR (Kanan) */}
      <motion.div 
        className="absolute bottom-8 right-1/4 -mr-6 z-20 w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white border border-emerald-200"
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <CheckCircle2 className="w-6 h-6" />
      </motion.div>
    </div>
  );
}
