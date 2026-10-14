import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Sparkles, 
  Cpu, 
  PieChart, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Activity, 
  Award, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';

// ============================================================================
// BAB 5: 19. AnimSMARTDonutChart (katalog-kpi)
// Donut chart melingkar 5 segmen S-M-A-R-T total bobot 100%
// ============================================================================
export function AnimSMARTDonutChart() {
  const [activeSeg, setActiveSeg] = useState(0);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setActiveSeg(p => (p + 1) % 5)}
    >
      <div className="absolute w-56 h-40 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/25 transition-all duration-500" />

      {/* SVG Donut Chart S-M-A-R-T */}
      <div className="relative z-10 flex items-center justify-center">
        <svg className="w-44 sm:w-52 h-44 sm:h-52 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="12" />
          
          {/* Segmen 1: Specific (Biru) */}
          <motion.circle
            cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="12"
            strokeDasharray="47.7 238" strokeDashoffset="0"
            animate={{ strokeWidth: activeSeg === 0 ? 15 : 12 }}
            transition={{ duration: 0.3 }}
          />
          {/* Segmen 2: Measurable (Indigo) */}
          <motion.circle
            cx="50" cy="50" r="38" fill="none" stroke="#6366f1" strokeWidth="12"
            strokeDasharray="47.7 238" strokeDashoffset="-47.7"
            animate={{ strokeWidth: activeSeg === 1 ? 15 : 12 }}
            transition={{ duration: 0.3 }}
          />
          {/* Segmen 3: Achievable (Emerald) */}
          <motion.circle
            cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12"
            strokeDasharray="47.7 238" strokeDashoffset="-95.4"
            animate={{ strokeWidth: activeSeg === 2 ? 15 : 12 }}
            transition={{ duration: 0.3 }}
          />
          {/* Segmen 4: Relevant (Amber) */}
          <motion.circle
            cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="12"
            strokeDasharray="47.7 238" strokeDashoffset="-143.1"
            animate={{ strokeWidth: activeSeg === 3 ? 15 : 12 }}
            transition={{ duration: 0.3 }}
          />
          {/* Segmen 5: Time-bound (Rose) */}
          <motion.circle
            cx="50" cy="50" r="38" fill="none" stroke="#f43f5e" strokeWidth="12"
            strokeDasharray="47.7 238" strokeDashoffset="-190.8"
            animate={{ strokeWidth: activeSeg === 4 ? 15 : 12 }}
            transition={{ duration: 0.3 }}
          />
        </svg>

        {/* Pusat Target 100% */}
        <motion.div 
          className="absolute z-20 w-16 h-16 rounded-full bg-white shadow-lg border border-slate-200 flex flex-col items-center justify-center text-indigo-600"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Target className="w-6 h-6 text-indigo-600" />
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// BAB 5: 20. AnimPositifNegatifKPI (formula-kpi-positif-negatif)
// Dua pilar perbandingan: Indikator Positif (Naik) vs Indikator Negatif (Turun)
// ============================================================================
export function AnimPositifNegatifKPI() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center gap-6 sm:gap-8 cursor-pointer select-none group"
      onClick={() => setFlipped(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

      {/* Sisi Kiri: Indikator Positif (Maximize / Omset / Output) */}
      <motion.div 
        className="relative z-10 w-28 sm:w-32 h-36 sm:h-40 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border-2 border-emerald-400/80 shadow-xl shadow-emerald-500/20 p-3 flex flex-col justify-between"
        animate={{ y: flipped ? 4 : -6 }}
        transition={{ type: "spring", stiffness: 100, damping: 14 }}
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="flex items-end justify-between h-14 px-1">
          <div className="w-4 h-6 bg-emerald-300 rounded-t-sm" />
          <div className="w-4 h-9 bg-emerald-400 rounded-t-sm" />
          <motion.div 
            className="w-4 bg-emerald-600 rounded-t-sm"
            animate={{ height: ['28px', '48px', '36px'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
        <div className="w-12 h-1 bg-emerald-500/50 rounded-full" />
      </motion.div>

      {/* Sisi Kanan: Indikator Negatif (Minimize / Cacat / Komplain 0%) */}
      <motion.div 
        className="relative z-10 w-28 sm:w-32 h-36 sm:h-40 rounded-2xl bg-gradient-to-br from-rose-50 to-red-100 border-2 border-rose-400/80 shadow-xl shadow-rose-500/20 p-3 flex flex-col justify-between"
        animate={{ y: flipped ? -6 : 4 }}
        transition={{ type: "spring", stiffness: 100, damping: 14 }}
      >
        <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
          <TrendingDown className="w-5 h-5" />
        </div>
        <div className="flex items-end justify-between h-14 px-1">
          <div className="w-4 h-12 bg-rose-300 rounded-t-sm" />
          <div className="w-4 h-7 bg-rose-400 rounded-t-sm" />
          <motion.div 
            className="w-4 bg-rose-600 rounded-t-sm"
            animate={{ height: ['32px', '12px', '20px'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
        <div className="w-12 h-1 bg-rose-500/50 rounded-full" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 6: 23. AnimAnatomiJobDesk (anatomi-job-desk)
// 4 Lembar dokumen isometrik mengambang bertingkat (explode view)
// ============================================================================
export function AnimAnatomiJobDesk() {
  const [exploded, setExploded] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setExploded(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-blue-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/25 transition-all duration-500" />

      {/* Tumpukan Lapisan Dokumen Isometrik */}
      <div className="relative z-10 w-44 sm:w-52 h-40 flex items-center justify-center">
        {[
          { id: 1, color: 'from-blue-600 to-indigo-600', border: 'border-blue-300', yOffset: -24, xOffset: -12 },
          { id: 2, color: 'from-cyan-500 to-blue-500', border: 'border-cyan-300', yOffset: -8, xOffset: -4 },
          { id: 3, color: 'from-teal-500 to-emerald-500', border: 'border-teal-300', yOffset: 8, xOffset: 4 },
          { id: 4, color: 'from-slate-700 to-slate-800', border: 'border-slate-500', yOffset: 24, xOffset: 12 },
        ].map((layer) => (
          <motion.div
            key={layer.id}
            className={`absolute w-36 sm:w-40 h-20 rounded-xl bg-gradient-to-r ${layer.color} border ${layer.border} shadow-lg p-2.5 flex items-center justify-between text-white`}
            animate={{ 
              y: exploded ? layer.yOffset * 1.5 : layer.yOffset,
              x: exploded ? layer.xOffset * 1.8 : layer.xOffset,
              rotateX: 45,
              rotateZ: -20
            }}
            transition={{ type: "spring", stiffness: 90, damping: 12 }}
          >
            <div className="space-y-1">
              <div className="w-12 h-1.5 bg-white/80 rounded-full" />
              <div className="w-20 h-1 bg-white/50 rounded-full" />
            </div>
            <Layers className="w-4 h-4 text-white/80" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BAB 6: 24. AnimRadarKompetensiSpider (job-specification)
// Jaring radar segi-5 kompetensi mengembang
// ============================================================================
export function AnimRadarKompetensiSpider() {
  const [level, setLevel] = useState<'mid' | 'senior'>('mid');

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setLevel(p => p === 'mid' ? 'senior' : 'mid')}
    >
      <div className="absolute w-56 h-40 bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/25 transition-all duration-500" />

      {/* SVG Pentagonal Radar Web */}
      <div className="relative z-10 flex items-center justify-center">
        <svg className="w-44 sm:w-52 h-44 sm:h-52 overflow-visible" viewBox="0 0 100 100">
          {/* Outer Web Pentagon */}
          <polygon
            points="50,10 90,38 75,85 25,85 10,38"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          {/* Inner Web Pentagon */}
          <polygon
            points="50,25 75,42 65,72 35,72 25,42"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />

          {/* Active Skill Area Polygon */}
          <motion.polygon
            points={
              level === 'mid'
                ? "50,25 72,40 60,70 40,68 30,45"
                : "50,12 88,36 72,82 28,80 14,36"
            }
            fill="rgba(20, 184, 166, 0.35)"
            stroke="#0d9488"
            strokeWidth="2.5"
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
          />

          {/* 5 Corner Nodes */}
          {[
            { cx: 50, cy: 10 },
            { cx: 90, cy: 38 },
            { cx: 75, cy: 85 },
            { cx: 25, cy: 85 },
            { cx: 10, cy: 38 },
          ].map((dot, idx) => (
            <circle key={idx} cx={dot.cx} cy={dot.cy} r="3.5" fill="#0f766e" />
          ))}
        </svg>

        {/* Center Indicator */}
        <motion.div 
          className="absolute z-20 w-10 h-10 rounded-xl bg-white shadow-md border border-teal-200 flex items-center justify-center text-teal-700"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Award className="w-5 h-5 text-teal-600" />
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// BAB 6: 25. AnimDualGearsSynergy (integrasi-kpi)
// Dua roda gerigi berputar sinkron dengan petir energi sinergi
// ============================================================================
export function AnimDualGearsSynergy() {
  const [fast, setFast] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setFast(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />

      {/* Gear Kiri (Job Desk) */}
      <motion.div 
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-dashed border-blue-500 bg-blue-50/50 flex items-center justify-center -mr-3"
        animate={{ rotate: 360 }}
        transition={{ duration: fast ? 4 : 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
          <Layers className="w-6 h-6" />
        </div>
      </motion.div>

      {/* Petir Energi di Tengah */}
      <motion.div 
        className="relative z-20 w-9 h-9 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg shadow-amber-400/40 border-2 border-yellow-100"
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <Zap className="w-5 h-5 fill-current" />
      </motion.div>

      {/* Gear Kanan (KPI) */}
      <motion.div 
        className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-dashed border-emerald-500 bg-emerald-50/50 flex items-center justify-center -ml-3"
        animate={{ rotate: -360 }}
        transition={{ duration: fast ? 3.3 : 8.5, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
          <Target className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 7: 28. AnimBoardroomPresentation (presentasi-direksi)
// Layar proyektor eksekutif dengan grafik pertumbuhan laba & podium
// ============================================================================
export function AnimBoardroomPresentation() {
  const [slide, setSlide] = useState(0);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setSlide(p => (p + 1) % 3)}
    >
      <div className="absolute w-56 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all duration-500" />

      {/* Layar Proyektor Direksi 16:9 */}
      <motion.div 
        className="relative z-10 w-56 sm:w-64 h-36 sm:h-40 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-400/50 shadow-2xl p-4 flex flex-col justify-between text-white"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <motion.div 
            className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center text-cyan-300 border border-cyan-400/30"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <PieChart className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Konten Grafik Sesuai Slide */}
        <div className="flex items-end justify-between h-14 px-2 py-1">
          {[35, 55, 75, 95].map((val, idx) => (
            <motion.div
              key={idx}
              className="w-6 rounded-t-md bg-gradient-to-t from-blue-500 to-cyan-400 shadow-xs"
              animate={{ height: `${(val + slide * 15) % 100}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 12 }}
            />
          ))}
        </div>

        <div className="pt-2 border-t border-indigo-800 flex items-center justify-between">
          <div className="w-16 h-1.5 bg-indigo-400/50 rounded-full" />
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 8: 29. AnimBCPDisasterRecovery (konsep-bcp)
// Kubah perisai pelindung bisnis dari badai gangguan
// ============================================================================
export function AnimBCPDisasterRecovery() {
  const [pulse, setPulse] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setPulse(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/25 transition-all duration-500" />

      {/* Kubah Energi BCP */}
      <motion.div 
        className="relative z-10 w-44 sm:w-48 h-44 sm:h-48 rounded-full border-2 border-purple-400/50 bg-gradient-to-b from-purple-500/10 to-transparent flex items-center justify-center p-4"
        animate={{ scale: pulse ? [1, 1.12, 1] : [1, 1.04, 1] }}
        transition={{ duration: pulse ? 0.4 : 3, repeat: pulse ? 0 : Infinity }}
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-950 border-2 border-purple-300 shadow-xl flex flex-col items-center justify-center text-white">
          <ShieldCheck className="w-10 h-10 text-cyan-300" />
          <div className="w-10 h-1 bg-cyan-400 rounded-full mt-2" />
        </div>
      </motion.div>

      {/* Satelit Petir Bahaya yang Dipantulkan (Kiri Atas) */}
      <motion.div 
        className="absolute top-8 left-1/4 -ml-6 z-20 w-10 h-10 rounded-2xl bg-white shadow-lg border border-purple-200 flex items-center justify-center text-purple-600"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <ShieldAlert className="w-5 h-5 text-amber-500" />
      </motion.div>

      {/* Satelit Restore Cepat (Kanan Bawah) */}
      <motion.div 
        className="absolute bottom-8 right-1/4 -mr-6 z-20 w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-white border border-cyan-200"
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
      >
        <RefreshCw className="w-5 h-5" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// BAB 8: 31. AnimRestoreChecksumSync (restore-dan-reset)
// Dua panah rotasi 360° sinkronisasi pemulihan data & validasi checksum
// ============================================================================
export function AnimRestoreChecksumSync() {
  const [spinning, setSpinning] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setSpinning(p => !p)}
    >
      <div className="absolute w-56 h-40 bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/25 transition-all duration-500" />

      {/* Lingkaran Panah Rotasi Sinkronisasi */}
      <motion.div 
        className="relative z-10 w-36 sm:w-40 h-36 sm:h-40 rounded-full border-4 border-dashed border-teal-400/60 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: spinning ? 3 : 12, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -top-3 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md">
          <RefreshCw className="w-3.5 h-3.5" />
        </div>
      </motion.div>

      {/* Lencana Validasi Checksum 100% */}
      <motion.div 
        className="absolute z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-xl shadow-emerald-600/30 border-2 border-emerald-200 flex flex-col items-center justify-center text-white"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <CheckCircle2 className="w-8 h-8 text-white" />
        <div className="w-8 h-1 bg-white/70 rounded-full mt-1.5" />
      </motion.div>
    </div>
  );
}
