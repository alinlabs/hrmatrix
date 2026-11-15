import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Star, 
  FileText, 
  CheckCircle2, 
  BookOpen, 
  AlertTriangle, 
  GraduationCap, 
  Lightbulb, 
  Heart, 
  Smile, 
  Compass, 
  Activity, 
  Sparkles, 
  Award,
  Layers
} from 'lucide-react';

// ============================================================================
// BAB 9: 32. AnimManpowerFunnel (perencanaan-rekrutmen)
// Corong seleksi talent funnel vertikal (100 -> 20 -> 3 -> 1 terpilih)
// ============================================================================
export function AnimManpowerFunnel() {
  const [funnelWave, setFunnelWave] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setFunnelWave(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/25 transition-all duration-500" />

      {/* Corong Bertingkat 3D */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        {/* Tingkat 1: Applicant Pool (Terlebar) */}
        <motion.div 
          className="w-48 sm:w-56 h-7 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 shadow-sm flex items-center justify-center text-white"
          animate={{ scaleX: funnelWave ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex gap-1.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/80" />
            ))}
          </div>
        </motion.div>

        {/* Tingkat 2: Screening & Test */}
        <motion.div 
          className="w-36 sm:w-44 h-7 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 shadow-sm flex items-center justify-center text-white"
          animate={{ scaleX: funnelWave ? [1, 1.06, 1] : 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/90" />
            ))}
          </div>
        </motion.div>

        {/* Tingkat 3: Final Interview */}
        <motion.div 
          className="w-24 sm:w-28 h-7 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-700 shadow-sm flex items-center justify-center text-white"
          animate={{ scaleX: funnelWave ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        </motion.div>

        {/* Hasil Bawah: 1 Talenta Juara */}
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-lg shadow-amber-400/40 border-2 border-yellow-100 flex items-center justify-center text-amber-950 mt-1"
          animate={{ y: [-3, 3, -3], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Star className="w-7 h-7 fill-amber-500 text-amber-950" />
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// BAB 9: 33. AnimMetodeSTAR (teknik-wawancara-star)
// Bintang emas 4 penjuru (Situation, Task, Action, Result)
// ============================================================================
export function AnimMetodeSTAR() {
  const [phase, setPhase] = useState(0);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setPhase(p => (p + 1) % 4)}
    >
      <div className="absolute w-56 h-40 bg-amber-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/25 transition-all duration-500" />
      <div className="absolute w-44 h-44 rounded-full border border-dashed border-amber-300/40" />

      {/* Poros Bintang Tengah */}
      <motion.div 
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-2xl shadow-amber-500/30 border-2 border-yellow-100 flex items-center justify-center text-amber-950"
        animate={{ scale: [1, 1.06, 1], rotate: [0, 4, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-12 h-12 fill-amber-950 text-amber-950" />
      </motion.div>

      {/* 4 Satelit Fase S-T-A-R */}
      {[
        { id: 0, pos: 'top-4', label: 'S', color: 'bg-blue-600' },
        { id: 1, pos: 'right-1/4 -mr-10', label: 'T', color: 'bg-indigo-600' },
        { id: 2, pos: 'bottom-4', label: 'A', color: 'bg-emerald-600' },
        { id: 3, pos: 'left-1/4 -ml-10', label: 'R', color: 'bg-amber-500' },
      ].map((sat) => (
        <motion.div
          key={sat.id}
          className={`absolute ${sat.pos} z-20 w-8 h-8 rounded-xl ${sat.color} text-white text-xs font-bold flex items-center justify-center shadow-md transition-all duration-300 ${
            phase === sat.id ? 'ring-4 ring-yellow-300 scale-125' : 'opacity-80'
          }`}
          animate={{ y: phase === sat.id ? [-3, 3, -3] : 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {sat.label}
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// BAB 9: 34. AnimOfferingLetterSignature (offering-letter-legal)
// Berkas penawaran kerja resmi dengan goresan pena tanda tangan emas
// ============================================================================
export function AnimOfferingLetterSignature() {
  const [signed, setSigned] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setSigned(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

      {/* Berkas Dokumen Formal */}
      <motion.div 
        className="relative z-10 w-44 sm:w-52 h-44 sm:h-48 rounded-2xl bg-white border-2 border-slate-200 shadow-2xl p-4 flex flex-col justify-between"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-4 h-4" />
          </div>
          {/* Cap Stempel Merah Resmi */}
          <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          </div>
        </div>

        <div className="space-y-1.5 py-1">
          <div className="w-full h-1.5 bg-slate-200 rounded-full" />
          <div className="w-3/4 h-1.5 bg-slate-200 rounded-full" />
          <div className="w-5/6 h-1 bg-slate-100 rounded-full" />
        </div>

        {/* Garis Tanda Tangan */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <motion.div 
            className="h-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
            animate={{ width: signed ? '70%' : '35%' }}
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
          />
          {signed && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 10: 36. AnimBukuPeraturanPP (peraturan-perusahaan-pkb)
// Kitab pedoman PP/PKB membuka lembaran dengan kilauan hukum
// ============================================================================
export function AnimBukuPeraturanPP() {
  const [opened, setOpened] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setOpened(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/25 transition-all duration-500" />

      {/* Kitab Peraturan Perusahaan (PP / PKB) */}
      <motion.div 
        className="relative z-10 w-44 sm:w-52 h-36 sm:h-40 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 border-2 border-indigo-400/50 shadow-2xl p-4 flex flex-col justify-between text-white"
        animate={{ rotateY: opened ? [-10, 10, -10] : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <BookOpen className="w-7 h-7 text-amber-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
        </div>

        <div className="space-y-1.5 py-1">
          <div className="w-24 h-1.5 bg-indigo-300/60 rounded-full" />
          <div className="w-32 h-1 bg-indigo-400/40 rounded-full" />
          <div className="w-20 h-1 bg-indigo-400/30 rounded-full" />
        </div>

        <div className="pt-2 border-t border-indigo-700/60 flex items-center justify-end">
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 10: 37. AnimTigaTingkatSP (mekanisme-surat-peringatan)
// 3 Kartu bertingkat SP1 (Kuning), SP2 (Oranye), SP3 (Merah)
// ============================================================================
export function AnimTigaTingkatSP() {
  const [level, setLevel] = useState(1);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setLevel(p => (p % 3) + 1)}
    >
      <div className="absolute w-56 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/20 transition-all duration-500" />

      {/* 3 Kartu Bertingkat SP 1, 2, 3 */}
      <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4">
        {[
          { id: 1, title: 'SP 1', color: 'from-amber-400 to-yellow-500', border: 'border-yellow-200' },
          { id: 2, title: 'SP 2', color: 'from-orange-500 to-amber-600', border: 'border-orange-300' },
          { id: 3, title: 'SP 3', color: 'from-rose-600 to-red-700', border: 'border-red-300' },
        ].map((item) => (
          <motion.div
            key={item.id}
            className={`w-20 sm:w-24 h-28 sm:h-32 rounded-2xl bg-gradient-to-b ${item.color} border-2 ${item.border} shadow-lg p-2.5 flex flex-col justify-between text-white transition-all duration-300`}
            animate={{ 
              y: level === item.id ? -10 : 4,
              scale: level === item.id ? 1.08 : 0.95
            }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-4 h-4 text-white" />
              <div className="text-[11px] font-bold">{item.title}</div>
            </div>
            <div className="space-y-1">
              <div className="w-12 h-1 bg-white/70 rounded-full" />
              <div className="w-8 h-1 bg-white/50 rounded-full" />
            </div>
            <div className="text-[9px] text-white/80 font-medium text-center">6 Bulan</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BAB 10: 38. AnimPerundinganBipartit (penyelesaian-perselisihan-bipartit)
// Meja perundingan bundar bipartit dengan jabat tangan mufakat
// ============================================================================
export function AnimPerundinganBipartit() {
  const [agreed, setAgreed] = useState(true);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setAgreed(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />

      {/* Meja Perundingan Bundar */}
      <motion.div 
        className="relative z-10 w-44 sm:w-52 h-44 sm:h-52 rounded-full border-4 border-emerald-400/50 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-2xl flex items-center justify-center p-4"
        animate={{ rotate: agreed ? 0 : 45 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        {/* Simbol Jabat Tangan / Mufakat */}
        <motion.div 
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-xl shadow-emerald-500/30 flex items-center justify-center text-white"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Users className="w-8 h-8 text-white" />
        </motion.div>
      </motion.div>

      {/* Satelit Perwakilan Pekerja (Kiri) */}
      <motion.div 
        className="absolute top-10 left-1/4 -ml-6 z-20 w-10 h-10 rounded-2xl bg-white shadow-md border border-blue-200 flex items-center justify-center text-blue-600"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <FileText className="w-5 h-5 text-blue-600" />
      </motion.div>

      {/* Satelit Perwakilan Manajemen (Kanan) */}
      <motion.div 
        className="absolute bottom-10 right-1/4 -mr-6 z-20 w-10 h-10 rounded-2xl bg-white shadow-md border border-emerald-200 flex items-center justify-center text-emerald-600"
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 11: 40. AnimTNAEducation (training-needs-analysis)
// Lampu bohlam ide besar dengan topi toga sarjana & tangga skill
// ============================================================================
export function AnimTNAEducation() {
  const [glow, setGlow] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setGlow(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/30 transition-all duration-500" />

      {/* Bohlam Inovasi Pelatihan */}
      <motion.div 
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-100 shadow-2xl shadow-amber-400/40 border-2 border-yellow-200 flex items-center justify-center text-amber-950"
        animate={{ scale: glow ? [1, 1.15, 1] : [1, 1.04, 1] }}
        transition={{ duration: glow ? 0.4 : 3, repeat: glow ? 0 : Infinity }}
      >
        <Lightbulb className="w-12 h-12 text-amber-900" />
      </motion.div>

      {/* Topi Toga Mengambang di Atas Bohlam */}
      <motion.div 
        className="absolute top-4 z-20 w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 to-blue-600 shadow-lg shadow-indigo-600/30 flex items-center justify-center text-white border border-indigo-200"
        animate={{ y: [-5, 5, -5], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <GraduationCap className="w-6 h-6 text-white" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 11: 42. AnimeNPSCulturePulse (employee-engagement-enps)
// Jantung detak kepuasan kerja dengan meteran eNPS & senyum bahagia
// ============================================================================
export function AnimeNPSCulturePulse() {
  const [pulseSpeed, setPulseSpeed] = useState(1);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setPulseSpeed(p => p === 1 ? 2.2 : 1)}
    >
      <div className="absolute w-56 h-40 bg-rose-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-400/25 transition-all duration-500" />

      {/* Jantung Detak Kepuasan Kerja */}
      <motion.div 
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 shadow-2xl shadow-rose-500/40 border-2 border-rose-200 flex items-center justify-center text-white"
        animate={{ scale: [1, 1.14, 1] }}
        transition={{ duration: 1.2 / pulseSpeed, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="w-12 h-12 fill-white text-white" />
      </motion.div>

      {/* Satelit Emoji Senyum (Kiri) */}
      <motion.div 
        className="absolute top-8 left-1/4 -ml-6 z-20 w-11 h-11 rounded-2xl bg-white shadow-lg border border-amber-200 flex items-center justify-center text-amber-500"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Smile className="w-6 h-6" />
      </motion.div>

      {/* Satelit Bintang Kepuasan (Kanan) */}
      <motion.div 
        className="absolute bottom-8 right-1/4 -mr-6 z-20 w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-lg shadow-amber-400/30 flex items-center justify-center text-amber-950 border border-yellow-100"
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.2 }}
      >
        <Star className="w-6 h-6 fill-amber-950 text-amber-950" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 12: 43. AnimHRBPChessMastery (peran-hrbp-strategic)
// Bidak catur emas strategis bertengger di atas papan navigasi catur futuristik
// ============================================================================
export function AnimHRBPChessMastery() {
  const [turn, setTurn] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setTurn(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-500" />

      {/* Papan Kompas Catur Strategis */}
      <motion.div 
        className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400/60 shadow-2xl flex flex-col items-center justify-center text-amber-400"
        animate={{ rotate: turn ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 12 }}
      >
        <Compass className="w-12 h-12 text-amber-400" />
        <div className="w-10 h-1 bg-amber-400/60 rounded-full mt-2" />
      </motion.div>

      {/* Mahkota Juara Strategi (Atas) */}
      <motion.div 
        className="absolute top-6 z-20 w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-lg shadow-amber-400/40 flex items-center justify-center text-amber-950 border border-yellow-100"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Award className="w-6 h-6 text-amber-900" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 12: 44. AnimFiveExecutiveMetrics (metrik-utama-hr)
// Cincin heksagonal 5 node metrik utama HR dengan koneksi laser
// ============================================================================
export function AnimFiveExecutiveMetrics() {
  const [activeNode, setActiveNode] = useState(0);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setActiveNode(p => (p + 1) % 5)}
    >
      <div className="absolute w-56 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/25 transition-all duration-500" />

      {/* Cincin Orbital Metrik */}
      <div className="relative z-10 w-44 sm:w-52 h-44 sm:h-52 rounded-full border border-blue-300/40 flex items-center justify-center">
        {/* Pusat Komando */}
        <motion.div 
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white border border-cyan-200"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Activity className="w-8 h-8 text-white" />
        </motion.div>

        {/* 5 Node Metrik di Sekeliling */}
        {[
          { id: 0, top: 'top-1', left: 'left-1/2 -ml-3', color: 'bg-indigo-500' },
          { id: 1, top: 'top-1/4', left: 'right-1', color: 'bg-teal-500' },
          { id: 2, top: 'bottom-6', left: 'right-6', color: 'bg-emerald-500' },
          { id: 3, top: 'bottom-6', left: 'left-6', color: 'bg-amber-500' },
          { id: 4, top: 'top-1/4', left: 'left-1', color: 'bg-rose-500' },
        ].map(node => (
          <motion.div
            key={node.id}
            className={`absolute ${node.top} ${node.left} w-6 h-6 rounded-full ${node.color} shadow-md transition-all duration-300 ${
              activeNode === node.id ? 'ring-4 ring-white scale-125' : 'opacity-80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
