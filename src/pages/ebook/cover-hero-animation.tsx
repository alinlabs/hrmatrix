import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lottie } from 'lottie-react';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Users, 
  Calculator, 
  Clock, 
  Award,
  Database
} from 'lucide-react';

// Import Lottie animation assets
import logoAnimationData from '../../assets/animations/logo-hrmatrix.json';
import companyAnim from '../../assets/animations/empty-company.json';
import employeesAnim from '../../assets/animations/empty-employees.json';
import attendanceAnim from '../../assets/animations/empty-attendance.json';
import payrollAnim from '../../assets/animations/empty-payroll.json';
import kpiAnim from '../../assets/animations/empty-kpi.json';
import databaseAnim from '../../assets/animations/empty-database.json';
import dashboardAnim from '../../assets/animations/empty-dashboard.json';

interface SceneItem {
  id: string;
  badge: string;
  label: string;
  anim: any;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  radialGlow: string;
}

const SCENES: SceneItem[] = [
  {
    id: 'logo',
    badge: 'Core Engine',
    label: 'HRMatrix System',
    anim: logoAnimationData,
    icon: Sparkles,
    accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
    radialGlow: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.22) 0%, rgba(99, 102, 241, 0.12) 35%, rgba(147, 197, 253, 0.05) 55%, transparent 72%)'
  },
  {
    id: 'company',
    badge: 'Struktur',
    label: 'Organisasi & Jabatan',
    anim: companyAnim,
    icon: Layers,
    accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    radialGlow: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.20) 0%, rgba(59, 130, 246, 0.10) 35%, rgba(199, 210, 254, 0.05) 55%, transparent 72%)'
  },
  {
    id: 'employees',
    badge: 'Personalia',
    label: 'Karyawan & Kontrak',
    anim: employeesAnim,
    icon: Users,
    accentColor: 'text-sky-600 bg-sky-50 border-sky-200',
    radialGlow: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.22) 0%, rgba(6, 182, 212, 0.10) 35%, rgba(186, 230, 253, 0.05) 55%, transparent 72%)'
  },
  {
    id: 'attendance',
    badge: 'Presensi',
    label: 'Kehadiran & Shift',
    anim: attendanceAnim,
    icon: Clock,
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    radialGlow: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.22) 0%, rgba(20, 184, 166, 0.10) 35%, rgba(167, 243, 208, 0.05) 55%, transparent 72%)'
  },
  {
    id: 'payroll',
    badge: 'Penggajian',
    label: 'Payroll & Pajak PPh 21',
    anim: payrollAnim,
    icon: Calculator,
    accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    radialGlow: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.22) 0%, rgba(249, 115, 22, 0.10) 35%, rgba(254, 215, 170, 0.05) 55%, transparent 72%)'
  },
  {
    id: 'kpi',
    badge: 'Kinerja',
    label: 'KPI & Evaluasi SMART',
    anim: kpiAnim,
    icon: Award,
    accentColor: 'text-rose-600 bg-rose-50 border-rose-200',
    radialGlow: 'radial-gradient(circle at center, rgba(244, 63, 94, 0.20) 0%, rgba(236, 72, 153, 0.10) 35%, rgba(254, 205, 211, 0.05) 55%, transparent 72%)'
  },
  {
    id: 'database',
    badge: 'Kedaulatan Data',
    label: 'Disaster Recovery & Vault',
    anim: databaseAnim,
    icon: Database,
    accentColor: 'text-violet-600 bg-violet-50 border-violet-200',
    radialGlow: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.20) 0%, rgba(168, 85, 247, 0.10) 35%, rgba(233, 213, 255, 0.05) 55%, transparent 72%)'
  },
  {
    id: 'dashboard',
    badge: 'Analitik',
    label: 'Executive Intelligence',
    anim: dashboardAnim,
    icon: Cpu,
    accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
    radialGlow: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.22) 0%, rgba(14, 165, 233, 0.10) 35%, rgba(191, 219, 254, 0.05) 55%, transparent 72%)'
  }
];

export function CoverHeroAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState<Record<string, boolean>>({});

  // Auto-morphing smoothly every 3.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SCENES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const currentScene = SCENES[currentIndex];
  const Icon = currentScene.icon;

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-center select-none py-1 sm:py-2">
      {/* Background Animated Concentric Rings & Soft Seamless Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Ambient Gradient Glow - Fading seamlessly to transparent without clipping */}
        <motion.div 
          key={currentScene.id + '-glow'}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
          style={{ background: currentScene.radialGlow }}
          className="w-72 h-72 xs:w-80 xs:h-80 sm:w-96 sm:h-96 rounded-full pointer-events-none"
        />

        {/* Outer Rotating Dashed Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute w-56 h-56 xs:w-64 xs:h-64 sm:w-76 sm:h-76 rounded-full border border-dashed border-slate-300/60 pointer-events-none"
        />

        {/* Middle Counter-Rotating Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute w-44 h-44 xs:w-52 xs:h-52 sm:w-60 sm:h-60 rounded-full border border-dotted border-blue-400/40 pointer-events-none"
        />

        {/* Inner Subtle Ring */}
        <div className="absolute w-34 h-34 xs:w-40 xs:h-40 sm:w-48 sm:h-48 rounded-full border border-slate-200/50 pointer-events-none" />
      </div>

      {/* Centerpiece Morphing Lottie Animation Container */}
      <div className="relative z-10 w-44 h-44 xs:w-52 xs:h-52 sm:w-60 sm:h-60 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.88, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(4px)' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex items-center justify-center relative cursor-pointer"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % SCENES.length)}
            title="Klik untuk melihat animasi berikutnya"
          >
            {!hasError[currentScene.id] ? (
              <Lottie
                src={currentScene.anim}
                loop={true}
                autoplay={true}
                className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                subscriptions={{
                  error: () => setHasError(prev => ({ ...prev, [currentScene.id]: true }))
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-md">
                <Icon className="w-10 h-10" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Floating Pill Indicator (2-line without icon) */}
        <motion.div
          key={currentScene.id + '-badge'}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          transition={{ duration: 0.35 }}
          className={`absolute -bottom-4 sm:-bottom-5 z-20 px-4 py-1.5 sm:px-5 sm:py-2 rounded-2xl border text-center shadow-xs flex flex-col items-center justify-center backdrop-blur-md ${currentScene.accentColor}`}
        >
          <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-tight">
            {currentScene.badge}
          </span>
          <span className="text-[9px] sm:text-[10px] font-medium opacity-90 leading-tight mt-0.5 whitespace-nowrap">
            {currentScene.label}
          </span>
        </motion.div>
      </div>

      {/* Bottom Scene Indicators (Clickable Morph Dots) */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 mt-6 sm:mt-7">
        {SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex 
                ? 'w-6 bg-blue-600' 
                : 'w-1.5 bg-slate-200 hover:bg-slate-300'
            }`}
            title={scene.label}
            aria-label={scene.label}
          />
        ))}
      </div>
    </div>
  );
}
