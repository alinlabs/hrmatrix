import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  WelcomeVisualizer,
  EmployeesVisualizer,
  AttendanceVisualizer,
  KpiVisualizer,
  PayrollVisualizer,
  RegulationsVisualizer,
  DatabaseVisualizer,
  ReadyVisualizer,
} from './components/WizardVisualizers';

export interface WizardSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  visualizer: React.ReactNode;
}

const WIZARD_SLIDES: WizardSlide[] = [
  {
    id: 'welcome',
    title: 'Selamat Datang di HRMatrix',
    subtitle: 'Sistem Manajemen HR, Payroll & Produktivitas',
    visualizer: <WelcomeVisualizer />,
    description: 'Platform terintegrasi untuk mengelola data karyawan, absensi, perhitungan gaji, dan evaluasi kinerja secara akurat, modern, dan mudah.',
  },
  {
    id: 'employees',
    title: 'Database Karyawan',
    subtitle: 'Biodata, Jobdesk & Struktur Kompensasi Lengkap',
    visualizer: <EmployeesVisualizer />,
    description: 'Kelola data induk karyawan, struktur departemen & jabatan, rincian uraian tugas (jobdesk), serta skema kompensasi & riwayat gaji secara terpadu.',
  },
  {
    id: 'attendance',
    title: 'Presensi & Manajemen Shift',
    subtitle: 'Shift Matrix, Lembur, Pertukaran Shift & Cuti',
    visualizer: <AttendanceVisualizer />,
    description: 'Pencatatan kehadiran harian, pengaturan shift kerja & overshift (lembur), formulir pertukaran shift, pengajuan cuti, hingga rekapitulasi presensi otomatis.',
  },
  {
    id: 'kpi',
    title: 'Penilaian Kinerja (KPI)',
    subtitle: 'Pembuatan KPI, Bobot Penilaian & Evaluasi Berkala',
    visualizer: <KpiVisualizer />,
    description: 'Susun target kinerja dengan katalog KPI terstandarisasi, tentukan bobot penilaian objektif, dan lakukan evaluasi berkala capaian tim dengan akurat.',
  },
  {
    id: 'payroll',
    title: 'Penggajian Lengkap (Payroll)',
    subtitle: 'Kalkulasi Otomatis Gaji, Tunjangan & Potongan',
    visualizer: <PayrollVisualizer />,
    description: 'Mekanisme penggajian komprehensif mulai dari gaji pokok, tunjangan jabatan, uang lembur, potongan keterlambatan, hingga penerbitan slip gaji digital.',
  },
  {
    id: 'regulations',
    title: 'Regulasi & Hukum Terintegrasi',
    subtitle: 'Kepatuhan BPJS Ketenagakerjaan, Kesehatan & Pajak PPh 21 TER',
    visualizer: <RegulationsVisualizer />,
    description: 'Dilengkapi formula perhitungan BPJS Ketenagakerjaan, BPJS Kesehatan, PPh 21 TER resmi pemerintah, serta rujukan dasar hukum ketenagakerjaan RI.',
  },
  {
    id: 'database',
    title: 'Sistem Database Lokal & Ekspor-Impor',
    subtitle: 'Privasi Terjamin, Bebas Ketergantungan Server, & Backup Mudah',
    visualizer: <DatabaseVisualizer />,
    description: 'Data tersimpan aman di peramban Anda melalui IndexedDB. Nikmati kebebasan pencadangan (backup) dan pemulihan (restore) data kapan saja via format JSON.',
  },
  {
    id: 'ready',
    title: 'Siap Kelola HR Perusahaan?',
    subtitle: 'Solusi Terpadu Menuju Efisiensi & Produktivitas Maksimal',
    visualizer: <ReadyVisualizer />,
    description: 'Seluruh instrumen HR, presensi, KPI, dan payroll siap digunakan. Geser sampai akhir atau klik tombol di bawah untuk langsung mulai.',
  },
];

interface WizardProps {
  onComplete: () => void;
}

export function Wizard({ onComplete }: WizardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = WIZARD_SLIDES.length;
  const isLastSlide = activeIndex === totalSlides - 1;

  // Mouse Drag to Slide support for desktop
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Update active slide index on scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    if (clientWidth === 0) return;
    const newIndex = Math.round(scrollLeft / clientWidth);
    if (newIndex >= 0 && newIndex < totalSlides && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, totalSlides]);

  const scrollToSlide = useCallback((index: number) => {
    if (!containerRef.current) return;
    const targetLeft = index * containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  }, []);

  // Keyboard left/right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (activeIndex < totalSlides - 1) {
          scrollToSlide(activeIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeIndex > 0) {
          scrollToSlide(activeIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, scrollToSlide, totalSlides]);

  // Mouse Drag Events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current || !containerRef.current) return;
    isDraggingRef.current = false;
    // Snap to nearest page
    const { scrollLeft, clientWidth } = containerRef.current;
    const nearestIndex = Math.round(scrollLeft / clientWidth);
    scrollToSlide(nearestIndex);
  };

  return (
    <div className="h-[100dvh] w-full max-w-none bg-white text-slate-900 flex flex-col justify-between items-center overflow-hidden select-none">
      {/* View Pager Horizontal Slider Container (Full Gestural Swipe & Snap) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full flex-1 flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x my-auto"
      >
        {WIZARD_SLIDES.map((slide) => (
          <div
            key={slide.id}
            className="w-full min-w-full flex-shrink-0 snap-center snap-always flex flex-col items-center justify-center h-full px-4 sm:px-6 text-center my-auto"
          >
            <div className="max-w-md w-full flex flex-col items-center justify-center my-auto">
              {/* Judul Utama (Tebal Besar) */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug px-2">
                {slide.title}
              </h1>

              {/* Sub Judul (Kecil Tipis) */}
              <p className="text-xs sm:text-sm font-normal text-slate-500 mt-1 px-3 tracking-normal">
                {slide.subtitle}
              </p>

              {/* Visualizer Interaktif Mikro-UI (Tengah, Ukuran Pas Tanpa Scroll) */}
              <div className="w-full max-w-[340px] sm:max-w-[380px] my-3 sm:my-5 flex items-center justify-center shrink-0">
                {slide.visualizer}
              </div>

              {/* Deskripsi (Kecil Tipis Ringkas) */}
              <p className="text-[11px] sm:text-xs md:text-sm font-normal text-slate-600 leading-relaxed max-w-sm sm:max-w-md px-4">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Area: Bullets Indicator on Slides 1 to N-1, and "Mulai Sekarang" Button on the Last Slide Only */}
      <div className="w-full max-w-md h-16 sm:h-20 flex items-center justify-center px-6 pb-4 sm:pb-6 shrink-0 z-20">
        {!isLastSlide ? (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 animate-in fade-in duration-200">
            {WIZARD_SLIDES.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollToSlide(index)}
                  aria-label={`Halaman ${index + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-6 sm:w-7 h-2 bg-blue-600'
                      : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full max-w-xs sm:max-w-sm animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={onComplete}
              className="w-full h-11 sm:h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wizard;
