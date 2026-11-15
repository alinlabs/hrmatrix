import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lottie } from 'lottie-react';
import { 
  TrendingUp, 
  Award, 
  Star, 
  Users, 
  Network, 
  Scale, 
  FileText, 
  Cpu, 
  Layers, 
  Sparkles 
} from 'lucide-react';

// Import Lottie JSON animation assets as fallback/centerpieces
import attendanceAnim from '../../assets/animations/empty-attendance.json';
import companyAnim from '../../assets/animations/empty-company.json';
import compensationAnim from '../../assets/animations/empty-compensation.json';
import dashboardAnim from '../../assets/animations/empty-dashboard.json';
import databaseAnim from '../../assets/animations/empty-database.json';
import employeesAnim from '../../assets/animations/empty-employees.json';
import jobdeskAnim from '../../assets/animations/empty-jobdesk.json';
import kpiAnim from '../../assets/animations/empty-kpi.json';
import payrollAnim from '../../assets/animations/empty-payroll.json';
import recapAnim from '../../assets/animations/empty-recap.json';
import scheduleAnim from '../../assets/animations/empty-schedule.json';
import settingsAnim from '../../assets/animations/empty-settings.json';

// Import Chapter 1-4 Modular Visual Animations
import {
  AnimTransformasiHRIS,
  AnimIndexedDBKedaulatan,
  AnimPKWTvsPKWTT,
  AnimPTKPKalibrator,
  AnimJenjangKarirPiramida,
  AnimPolaShiftRotasi,
  AnimDendaKeterlambatan,
  AnimKalkulatorLembur173,
  AnimEmpatPerisaiBPJS,
  AnimPPh21TERMatrix,
  AnimTHRKeagamaanProrata,
} from './animations/chapter-1-4-animations';

// Import Chapter 5-8 Modular Visual Animations
import {
  AnimSMARTDonutChart,
  AnimPositifNegatifKPI,
  AnimAnatomiJobDesk,
  AnimRadarKompetensiSpider,
  AnimDualGearsSynergy,
  AnimBoardroomPresentation,
  AnimBCPDisasterRecovery,
  AnimRestoreChecksumSync,
} from './animations/chapter-5-8-animations';

// Import Chapter 9-12 Modular Visual Animations
import {
  AnimManpowerFunnel,
  AnimMetodeSTAR,
  AnimOfferingLetterSignature,
  AnimBukuPeraturanPP,
  AnimTigaTingkatSP,
  AnimPerundinganBipartit,
  AnimTNAEducation,
  AnimeNPSCulturePulse,
  AnimHRBPChessMastery,
  AnimFiveExecutiveMetrics,
} from './animations/chapter-9-12-animations';

// ============================================================================
// 1. INTERACTIVE KPI & PERFORMANCE GAUGE VISUALIZER
// ============================================================================
function InteractiveKpiVisualizer() {
  const [scoreLevel, setScoreLevel] = useState<number>(100);

  const toggleScore = () => {
    setScoreLevel(prev => (prev === 100 ? 115 : prev === 115 ? 90 : 100));
  };

  // Needle angle: 90% -> -35deg, 100% -> 0deg, 115% -> 40deg
  const needleAngle = scoreLevel === 90 ? -35 : scoreLevel === 100 ? 5 : 42;

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={toggleScore}
    >
      {/* Ambient background glow */}
      <div className="absolute w-56 h-40 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-400/25 transition-all duration-500" />

      {/* Speedometer Arc SVG */}
      <div className="relative z-10 flex flex-col items-center">
        <svg className="w-52 sm:w-60 h-32 sm:h-36 overflow-visible" viewBox="0 0 200 120">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Active Gradient Arc */}
          <motion.path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251"
            animate={{ 
              strokeDashoffset: scoreLevel === 90 ? 70 : scoreLevel === 100 ? 30 : 0 
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />

          {/* Dynamic Needle */}
          <motion.g
            animate={{ rotate: needleAngle }}
            transition={{ type: "spring", stiffness: 70, damping: 12 }}
            style={{ transformOrigin: "100px 110px" }}
          >
            <line x1="100" y1="110" x2="100" y2="40" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="110" r="8" fill="#1e293b" />
            <circle cx="100" cy="110" r="4" fill="#38bdf8" />
          </motion.g>
        </svg>

        {/* Central Indicator Capsule */}
        <motion.div 
          className="relative -mt-4 px-4 py-1.5 rounded-full bg-white shadow-lg border border-slate-200/80 flex items-center gap-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </motion.div>
      </div>

      {/* Orbiting Milestone Star 1 (Left) */}
      <motion.div 
        className="absolute top-8 left-1/4 -ml-4 z-20 w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-md shadow-amber-400/20 flex items-center justify-center text-amber-900 border border-yellow-100"
        animate={{ y: [-6, 6, -6], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-5 h-5 fill-amber-500 text-amber-600" />
      </motion.div>

      {/* Orbiting Milestone Target 2 (Right) */}
      <motion.div 
        className="absolute top-8 right-1/4 -mr-4 z-20 w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md shadow-emerald-400/20 flex items-center justify-center text-white border border-emerald-200"
        animate={{ y: [6, -6, 6], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <TrendingUp className="w-5 h-5" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// 4. INTERACTIVE ORG HIERARCHY & JOB SYNERGY VISUALIZER
// ============================================================================
function InteractiveOrgHierarchyVisualizer() {
  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
    >
      {/* Ambient background glow */}
      <div className="absolute w-56 h-40 bg-blue-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/25 transition-all duration-500" />

      {/* Network Tree Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Leader / Crown Node */}
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white border-2 border-blue-200/80"
          animate={{ scale: [1, 1.06, 1], y: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Users className="w-7 h-7" />
        </motion.div>

        {/* Connecting Animated Laser Branches */}
        <div className="relative w-48 sm:w-56 h-8 flex items-center justify-between -my-3">
          {/* SVG Connector Branch Lines */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 200 32">
            <path
              d="M 100 0 L 100 16 L 30 16 L 30 32"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 100 0 L 100 16 L 170 16 L 170 32"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <motion.circle 
              r="3.5" 
              fill="#3b82f6"
              animate={{ 
                cx: [100, 100, 30, 30],
                cy: [0, 16, 16, 32] 
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle 
              r="3.5" 
              fill="#6366f1"
              animate={{ 
                cx: [100, 100, 170, 170],
                cy: [0, 16, 16, 32] 
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </svg>
        </div>

        {/* Lower Branch Nodes (Specialist & Operational) */}
        <div className="flex items-center justify-between gap-12 sm:gap-16">
          {/* Left Node */}
          <motion.div 
            className="w-12 h-12 rounded-xl bg-white shadow-lg border-2 border-blue-200 flex items-center justify-center text-blue-600"
            animate={{ y: [3, -3, 3] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Network className="w-6 h-6" />
          </motion.div>

          {/* Middle Pulse Hub */}
          <motion.div 
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-100 to-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700"
            animate={{ scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Layers className="w-4 h-4 text-indigo-600" />
          </motion.div>

          {/* Right Node */}
          <motion.div 
            className="w-12 h-12 rounded-xl bg-white shadow-lg border-2 border-indigo-200 flex items-center justify-center text-indigo-600"
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <Cpu className="w-6 h-6" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. INTERACTIVE LEGAL BALANCE & COMPLIANCE SCALE VISUALIZER
// ============================================================================
function InteractiveLegalBalanceVisualizer() {
  const [tilt, setTilt] = useState<'neutral' | 'left' | 'right'>('neutral');

  const toggleTilt = () => {
    setTilt(prev => (prev === 'neutral' ? 'left' : prev === 'left' ? 'right' : 'neutral'));
  };

  const angle = tilt === 'left' ? -8 : tilt === 'right' ? 8 : 0;

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={toggleTilt}
    >
      {/* Ambient background glow */}
      <div className="absolute w-56 h-40 bg-amber-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/25 transition-all duration-500" />

      {/* SVG Balance Scale of Justice */}
      <div className="relative z-10 flex flex-col items-center">
        <svg className="w-56 sm:w-64 h-36 overflow-visible" viewBox="0 0 200 120">
          {/* Base Stand & Pillar */}
          <rect x="96" y="20" width="8" height="85" rx="4" fill="#64748b" />
          <path d="M 70 105 L 130 105 L 120 115 L 80 115 Z" fill="#475569" />
          <circle cx="100" cy="22" r="7" fill="#f59e0b" />

          {/* Tilting Beam & Hanging Plates */}
          <motion.g
            animate={{ rotate: angle }}
            transition={{ type: "spring", stiffness: 60, damping: 10 }}
            style={{ transformOrigin: "100px 22px" }}
          >
            {/* Horizontal Crossbeam */}
            <line x1="30" y1="22" x2="170" y2="22" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            
            {/* Left Pan Strings & Plate */}
            <line x1="30" y1="22" x2="15" y2="65" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="30" y1="22" x2="45" y2="65" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 10 65 Q 30 80 50 65 Z" fill="#d97706" />

            {/* Right Pan Strings & Plate */}
            <line x1="170" y1="22" x2="155" y2="65" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="170" y1="22" x2="185" y2="65" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 150 65 Q 170 80 190 65 Z" fill="#0284c7" />
          </motion.g>
        </svg>

        {/* Floating Legal Seal / Shield Badge */}
        <motion.div 
          className="relative -mt-2 w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-lg shadow-amber-500/30 flex items-center justify-center text-amber-950 border border-yellow-100"
          animate={{ scale: [1, 1.1, 1], y: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Scale className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Floating Document with Check (Right Top) */}
      <motion.div 
        className="absolute top-6 right-1/4 -mr-6 z-20 w-10 h-10 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700"
        animate={{ y: [-5, 5, -5], rotate: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <FileText className="w-5 h-5 text-blue-600" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// 4. INTERACTIVE EXECUTIVE ANALYTICS & GROWTH GRAPH VISUALIZER
// ============================================================================
function InteractiveAnalyticsVisualizer() {
  const [boost, setBoost] = useState(false);

  return (
    <div 
      className="relative w-full h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group"
      onClick={() => setBoost(prev => !prev)}
    >
      {/* Ambient background glow */}
      <div className="absolute w-56 h-40 bg-blue-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/25 transition-all duration-500" />

      {/* Animated Multi-Bar Chart with Bezier Curve */}
      <div className="relative z-10 w-52 sm:w-64 h-36 flex flex-col justify-end">
        {/* SVG Trend Line Overlaid */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-20">
          <motion.path
            d="M 10 110 Q 50 60 90 80 T 170 30 T 230 15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.circle 
            cx="230" 
            cy="15" 
            r="5" 
            fill="#3b82f6" 
            stroke="#ffffff" 
            strokeWidth="2"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>

        {/* 5 Vertical Animated Gradient Bars */}
        <div className="flex items-end justify-between h-28 px-4 z-10">
          {[
            { h: '45%', delay: 0 },
            { h: '75%', delay: 0.2 },
            { h: '60%', delay: 0.4 },
            { h: '90%', delay: 0.6 },
            { h: '100%', delay: 0.8 },
          ].map((bar, index) => (
            <motion.div
              key={index}
              className="w-5 sm:w-6 rounded-t-xl bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400 shadow-md shadow-blue-500/20"
              initial={{ height: '20%' }}
              animate={{ 
                height: boost 
                  ? ['30%', '95%', bar.h] 
                  : [bar.h, `${Math.min(100, parseInt(bar.h) + 15)}%`, bar.h] 
              }}
              transition={{ 
                duration: boost ? 0.8 : 3, 
                repeat: boost ? 0 : Infinity, 
                ease: "easeInOut",
                delay: bar.delay 
              }}
            />
          ))}
        </div>

        {/* Base Axis Line */}
        <div className="w-full h-1 bg-slate-200 rounded-full mt-1" />
      </div>

      {/* Orbiting Satellite: Growth Arrow (Right Top) */}
      <motion.div 
        className="absolute top-6 right-1/4 -mr-6 z-20 w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white border border-cyan-200"
        animate={{ y: [-6, 6, -6], scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <TrendingUp className="w-6 h-6" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// 9. CENTERPIECE LOTTIE ANIMATION (WIDE, CENTERED, BORDERLESS)
// ============================================================================
interface CenteredLottieProps {
  animationData: object;
}

function CenteredLottieCenterpiece({ animationData }: CenteredLottieProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-56 sm:h-64 flex items-center justify-center select-none">
      {/* Ambient background glow */}
      <div className="absolute w-56 h-56 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {!hasError ? (
        <motion.div 
          className="relative z-10 w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Lottie
            src={animationData}
            loop={true}
            autoplay={true}
            className="w-full h-full object-contain pointer-events-none select-none"
            subscriptions={{
              error: () => setHasError(true)
            }}
          />
        </motion.div>
      ) : (
        /* Fallback if Lottie engine fails */
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-md animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DISPATCHER: MAPS SUB-CHAPTER CONTEXT TO APPROPRIATE INTERACTIVE ANIMATION
// ============================================================================
interface SubChapterAnimationProps {
  chapterId: string;
  subId: string;
  title: string;
}

export const SubChapterAnimation: React.FC<SubChapterAnimationProps> = ({ subId }) => {
  const renderVisualizer = () => {
    switch (subId) {
      // ======================================================================
      // BAB 1: ARSITEKTUR & PONDASI UTAMA SISTEM HR (4 Sub Bab)
      // ======================================================================
      case 'konsep-hris-modern':
        return <AnimTransformasiHRIS />;
      case 'konsep-indexeddb':
        return <AnimIndexedDBKedaulatan />;
      case 'dashboard-sections':
        return <CenteredLottieCenterpiece animationData={dashboardAnim} />;
      case 'setup-perusahaan':
        return <CenteredLottieCenterpiece animationData={companyAnim} />;

      // ======================================================================
      // BAB 2: DATA KARYAWAN & ADMINISTRASI PERSONALIA (5 Sub Bab)
      // ======================================================================
      case 'konsep-manajemen-data':
        return <CenteredLottieCenterpiece animationData={employeesAnim} />;
      case 'data-personal-kontrak':
        return <AnimPKWTvsPKWTT />;
      case 'data-gaji-ptkp':
        return <AnimPTKPKalibrator />;
      case 'jenjang-jabatan':
        return <AnimJenjangKarirPiramida />;
      case 'kompensasi-pkwt-karyawan':
        return <CenteredLottieCenterpiece animationData={compensationAnim} />;

      // ======================================================================
      // BAB 3: KEDISIPLINAN, POLA SHIFT & SISTEM LEMBUR (4 Sub Bab)
      // ======================================================================
      case 'konsep-kedisiplinan':
        return <CenteredLottieCenterpiece animationData={attendanceAnim} />;
      case 'pola-shift':
        return <AnimPolaShiftRotasi />;
      case 'formula-denda-telat':
        return <AnimDendaKeterlambatan />;
      case 'lembur-depnaker':
        return <AnimKalkulatorLembur173 />;

      // ======================================================================
      // BAB 4: REMUNERASI, PAYROLL, BPJS & PAJAK PPH 21 (4 Sub Bab)
      // ======================================================================
      case 'komponen-gaji-dasar':
        return <CenteredLottieCenterpiece animationData={payrollAnim} />;
      case 'skema-bpjs':
        return <AnimEmpatPerisaiBPJS />;
      case 'pajak-pph21-ter':
        return <AnimPPh21TERMatrix />;
      case 'formula-thr-keagamaan':
        return <AnimTHRKeagamaanProrata />;

      // ======================================================================
      // BAB 5: MANAJEMEN KINERJA & EVALUASI KPI (4 Sub Bab)
      // ======================================================================
      case 'konsep-kpi':
        return <CenteredLottieCenterpiece animationData={kpiAnim} />;
      case 'katalog-kpi':
        return <AnimSMARTDonutChart />;
      case 'formula-kpi-positif-negatif':
        return <AnimPositifNegatifKPI />;
      case 'skala-predikat-grading':
        return <InteractiveKpiVisualizer />;

      // ======================================================================
      // BAB 6: JOB DESCRIPTION & SPESIFIKASI JABATAN (4 Sub Bab)
      // ======================================================================
      case 'konsep-job-description':
        return <CenteredLottieCenterpiece animationData={jobdeskAnim} />;
      case 'anatomi-job-desk':
        return <AnimAnatomiJobDesk />;
      case 'job-specification':
        return <AnimRadarKompetensiSpider />;
      case 'integrasi-kpi':
        return <AnimDualGearsSynergy />;

      // ======================================================================
      // BAB 7: LAPORAN EKSEKUTIF & HR ANALYTICS (3 Sub Bab)
      // ======================================================================
      case 'konsep-hr-analytics':
        return <CenteredLottieCenterpiece animationData={recapAnim} />;
      case 'laporan-eksekutif':
        return <InteractiveAnalyticsVisualizer />;
      case 'presentasi-direksi':
        return <AnimBoardroomPresentation />;

      // ======================================================================
      // BAB 8: KEAMANAN DATABASE, BACKUP & PEMULIHAN (3 Sub Bab)
      // ======================================================================
      case 'konsep-bcp':
        return <AnimBCPDisasterRecovery />;
      case 'backup-json':
        return <CenteredLottieCenterpiece animationData={databaseAnim} />;
      case 'restore-dan-reset':
        return <AnimRestoreChecksumSync />;

      // ======================================================================
      // BAB 9: REKRUTMEN EFEKTIF & ONBOARDING KARYAWAN (4 Sub Bab)
      // ======================================================================
      case 'perencanaan-rekrutmen':
        return <AnimManpowerFunnel />;
      case 'teknik-wawancara-star':
        return <AnimMetodeSTAR />;
      case 'offering-letter-legal':
        return <AnimOfferingLetterSignature />;
      case 'onboarding-90-hari':
        return <CenteredLottieCenterpiece animationData={scheduleAnim} />;

      // ======================================================================
      // BAB 10: HUBUNGAN INDUSTRIAL, SP & TATA CARA PHK (4 Sub Bab)
      // ======================================================================
      case 'peraturan-perusahaan-pkb':
        return <AnimBukuPeraturanPP />;
      case 'mekanisme-surat-peringatan':
        return <AnimTigaTingkatSP />;
      case 'penyelesaian-perselisihan-bipartit':
        return <AnimPerundinganBipartit />;
      case 'etika-proses-phk-pesangon':
        return <InteractiveLegalBalanceVisualizer />;

      // ======================================================================
      // BAB 11: PENGEMBANGAN TALENTA & BUDAYA ORGANISASI (3 Sub Bab)
      // ======================================================================
      case 'training-needs-analysis':
        return <AnimTNAEducation />;
      case 'career-path-succession':
        return <InteractiveOrgHierarchyVisualizer />;
      case 'employee-engagement-enps':
        return <AnimeNPSCulturePulse />;

      // ======================================================================
      // BAB 12: STRATEGI HR MODERN & ROADMAP MASA DEPAN (3 Sub Bab)
      // ======================================================================
      case 'peran-hrbp-strategic':
        return <AnimHRBPChessMastery />;
      case 'metrik-utama-hr':
        return <AnimFiveExecutiveMetrics />;
      case 'efisiensi-otomasi-hrmatrix':
        return <CenteredLottieCenterpiece animationData={settingsAnim} />;

      default:
        return <CenteredLottieCenterpiece animationData={companyAnim} />;
    }
  };

  return (
    <div className="w-full my-4 sm:my-6 flex items-center justify-center">
      {renderVisualizer()}
    </div>
  );
};
