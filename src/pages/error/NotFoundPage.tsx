import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lottie } from 'lottie-react';
import { motion } from 'motion/react';
import { 
  Home, 
  HelpCircle, 
  BookOpen, 
  ArrowLeft,
  Search,
  Compass,
  Lock,
  ServerCrash,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import error404Animation from '../../assets/animations/error-404.json';
import error403Animation from '../../assets/animations/error-403.json';
import error500Animation from '../../assets/animations/error-500.json';

interface NotFoundPageProps {
  code?: 404 | 403 | 500;
}

export function NotFoundPage({ code = 404 }: NotFoundPageProps) {
  const navigate = useNavigate();

  // Configuration map for different error types
  const errorConfigs = {
    404: {
      animation: error404Animation,
      title: 'Waduh, Halamannya Hilang!',
      description: 'Halaman yang Anda cari tidak ditemukan atau mungkin telah dipindahkan ke rute lain di sistem HRMatrix.',
      badgeText: 'ERROR 404',
      themeColor: 'rose',
      badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-200/50',
      gradientFrom: 'from-rose-50/40',
      gradientTo: 'to-rose-100/30',
      glowColor: 'bg-rose-400/20',
      illustration: (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Animated 404 Floating Elements */}
          <motion.div 
            initial={{ y: 15, rotate: -3 }}
            animate={{ y: -15, rotate: 3 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 3, ease: "easeInOut" }}
            className="text-7xl font-black text-rose-500/20 select-none tracking-wider absolute"
          >
            404
          </motion.div>
          {/* Search Scope Animation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute w-36 h-36 rounded-full border-2 border-dashed border-rose-400/30 flex items-center justify-center"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute -top-1.5" />
          </motion.div>
        </div>
      )
    },
    403: {
      animation: error403Animation,
      title: 'Ups, Akses Ditolak!',
      description: 'Anda tidak memiliki hak akses yang cukup atau izin khusus untuk membuka halaman aman ini.',
      badgeText: 'FORBIDDEN 403',
      themeColor: 'amber',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
      gradientFrom: 'from-amber-50/40',
      gradientTo: 'to-amber-100/30',
      glowColor: 'bg-amber-400/20',
      illustration: (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Animated Lock Shield */}
          <motion.div 
            initial={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: 1.05, rotate: 5 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5, ease: "easeInOut" }}
            className="absolute text-amber-500/20"
          >
            <Lock className="w-28 h-28" />
          </motion.div>
          {/* Warning Rings */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-full border border-amber-400/40"
          />
        </div>
      )
    },
    500: {
      animation: error500Animation,
      title: 'Sistem Sedang Istirahat...',
      description: 'Terjadi gangguan internal pada koneksi database lokal atau modul server utama HRMatrix.',
      badgeText: 'SERVER ERROR 500',
      themeColor: 'red',
      badgeColor: 'bg-red-500/10 text-red-600 border-red-200/50',
      gradientFrom: 'from-red-50/40',
      gradientTo: 'to-red-100/30',
      glowColor: 'bg-red-400/20',
      illustration: (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Spinning Gears */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute text-red-500/10 -ml-10 -mt-10"
          >
            <ServerCrash className="w-28 h-28" />
          </motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute text-red-400/15 ml-14 mt-12"
          >
            <AlertTriangle className="w-16 h-16" />
          </motion.div>
        </div>
      )
    }
  };

  const config = errorConfigs[code] || errorConfigs[404];

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8 select-none relative overflow-hidden">
      {/* Immersive Immersive Ambient Glow Circles */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr ${config.gradientFrom} ${config.gradientTo} blur-[120px] pointer-events-none z-0`} />
      <div className={`absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full ${config.glowColor} blur-[100px] pointer-events-none z-0`} />

      <div className="relative z-10 max-w-lg w-full text-center space-y-7 px-2">
        
        {/* Dynamic Visual Indicator & Lottie Wrapper */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center bg-white/70 rounded-3xl border border-slate-200/60 p-5 shadow-lg shadow-slate-100/50 backdrop-blur-md">
          {/* Interactive Graphic Element Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {config.illustration}
          </div>

          {/* Lottie Animation Layer */}
          <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            <Lottie
              src={config.animation}
              loop={true}
              autoplay={true}
              className="w-full h-full drop-shadow-md pointer-events-none"
            />
          </div>

          {/* Absolute Status Badge */}
          <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider shadow-sm backdrop-blur-md ${config.badgeColor} animate-pulse`}>
            {config.badgeText}
          </div>
        </div>

        {/* Informative Error Copywriting */}
        <div className="space-y-3 pt-2">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            {config.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed"
          >
            {config.description}
          </motion.p>
        </div>

        {/* Quick Search Informational Banner */}
        <div className="max-w-xs mx-auto relative bg-white/50 border border-slate-200/50 rounded-2xl py-2 px-3 text-left flex items-center gap-2.5 shadow-3xs backdrop-blur-xs">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium truncate">
            Butuh bantuan cepat? Gunakan menu navigasi...
          </span>
        </div>

        {/* Immersive Action Button Hub */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Ke Dashboard</span>
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 active:scale-[0.98] rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        {/* Visual Map / Helpful Directories */}
        <div className="pt-5 border-t border-slate-200/70 max-w-md mx-auto">
          <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-3">
            Menu Bantuan & Direktori Penting
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/faq')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/70 border border-slate-200/60 hover:border-blue-400 hover:bg-blue-50/10 hover:text-blue-600 transition-all text-slate-600 text-center cursor-pointer shadow-3xs"
            >
              <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
              <span className="text-[10px] font-bold leading-tight">Pusat Bantuan</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/ebook')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/70 border border-slate-200/60 hover:border-blue-400 hover:bg-blue-50/10 hover:text-blue-600 transition-all text-slate-600 text-center cursor-pointer shadow-3xs"
            >
              <BookOpen className="w-4.5 h-4.5 text-slate-400" />
              <span className="text-[10px] font-bold leading-tight">EBook Manual</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/navigasi-cepat')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/70 border border-slate-200/60 hover:border-blue-400 hover:bg-blue-50/10 hover:text-blue-600 transition-all text-slate-600 text-center cursor-pointer shadow-3xs"
            >
              <Compass className="w-4.5 h-4.5 text-slate-400" />
              <span className="text-[10px] font-bold leading-tight">Peta Fitur</span>
            </button>
          </div>
        </div>

        {/* Brand footer watermark with build information */}
        <div className="pt-4 text-[10px] text-slate-400 font-semibold tracking-wide flex items-center justify-center gap-1.5">
          <span>HRMatrix Secure Gateway v2.5</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>Keamanan Terjamin</span>
        </div>
      </div>
    </div>
  );
}
