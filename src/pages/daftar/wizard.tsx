import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  WelcomeVisualizer,
  EmployeesVisualizer,
  KpiVisualizer,
  PayrollVisualizer,
  ReadyVisualizer,
} from './wizard-visualizers';

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
    subtitle: 'Sistem Manajemen HR, GA, Payroll & Produktivitas',
    visualizer: <WelcomeVisualizer />,
    description: 'Platform terintegrasi untuk mengelola data karyawan, absensi, perhitungan gaji, aset kantor, dan evaluasi kinerja secara akurat dan modern.',
  },
  {
    id: 'hr-ops',
    title: 'Database SDM & Operasional',
    subtitle: 'Biodata, Presensi QR, Shift Matrix & General Affairs',
    visualizer: <EmployeesVisualizer />,
    description: 'Kelola struktur departemen & jabatan, uraian tugas, presensi harian, penjadwalan shift kerja, cuti, hingga inventaris aset perusahaan.',
  },
  {
    id: 'payroll-reg',
    title: 'Payroll & Kepatuhan Regulasi',
    subtitle: 'Gaji Pokok, Tunjangan, PPh 21 TER & BPJS Resmi',
    visualizer: <PayrollVisualizer />,
    description: 'Kalkulasi penggajian otomatis lengkap dengan formula PPh 21 TER (PP 58/2023), iuran BPJS Kesehatan & Ketenagakerjaan, serta slip gaji PDF.',
  },
  {
    id: 'kpi-analytics',
    title: 'Penilaian Kinerja & Analitik',
    subtitle: 'Katalog KPI Terstandar, Bobot Objektif & Laporan',
    visualizer: <KpiVisualizer />,
    description: 'Susun target kinerja dengan indikator KPI terukur, lakukan evaluasi tim berkala, dan pantau ringkasan performa perusahaan secara real-time.',
  },
  {
    id: 'ready',
    title: 'Siap Kelola Perusahaan Anda?',
    subtitle: 'Privasi Database Lokal IndexedDB & Siap Digunakan',
    visualizer: <ReadyVisualizer />,
    description: 'Seluruh data tersimpan privat di peramban Anda dengan dukungan backup dan restore JSON. Geser ke akhir atau klik tombol di bawah untuk mulai.',
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

  // Re-align scroll position when viewport resizes (e.g. orientation change or window resize)
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      containerRef.current.scrollTo({
        left: activeIndex * containerRef.current.clientWidth,
        behavior: 'auto',
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

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
    const { scrollLeft, clientWidth } = containerRef.current;
    if (clientWidth === 0) return;
    const nearestIndex = Math.round(scrollLeft / clientWidth);
    scrollToSlide(nearestIndex);
  };

  return (
    <div className="relative h-[100dvh] w-full max-w-none bg-white text-slate-900 flex flex-col justify-between items-center overflow-hidden select-none">
      {/* Desktop-only Left & Right Edge Chevron Navigation */}
      <button
        type="button"
        onClick={() => activeIndex > 0 && scrollToSlide(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label="Slide sebelumnya"
        className={`hidden md:flex items-center justify-center absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/95 border border-slate-200/90 shadow-sm transition-all ${
          activeIndex === 0
            ? 'opacity-30 text-slate-300 cursor-not-allowed'
            : 'text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/40 active:scale-95 cursor-pointer'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => activeIndex < totalSlides - 1 && scrollToSlide(activeIndex + 1)}
        disabled={isLastSlide}
        aria-label="Slide berikutnya"
        className={`hidden md:flex items-center justify-center absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/95 border border-slate-200/90 shadow-sm transition-all ${
          isLastSlide
            ? 'opacity-30 text-slate-300 cursor-not-allowed'
            : 'text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/40 active:scale-95 cursor-pointer'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* View Pager Horizontal Slider Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full flex-1 flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing no-scrollbar touch-pan-x"
      >
        {WIZARD_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full min-w-full flex-shrink-0 snap-center snap-always flex items-center justify-center h-full px-5 sm:px-8 md:px-20 lg:px-24 overflow-hidden"
          >
            {/* Mobile: Vertical Centered (Title+Subtitle -> Lottie -> Description)
                Desktop (md+): 2-Column Split (Lottie Left, Title+Subtitle+Description Right) */}
            <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center text-center md:grid md:grid-cols-12 md:gap-x-10 lg:gap-x-16 md:gap-y-3 md:items-center md:text-left">
              {/* Header Text: Top on mobile, Right-top on desktop */}
              <div className="w-full md:col-span-6 md:col-start-7 md:row-start-1 md:self-end">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug px-2 md:px-0">
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-normal md:font-medium text-slate-500 mt-1 md:mt-2 px-3 md:px-0 tracking-normal">
                  {slide.subtitle}
                </p>
              </div>

              {/* Lottie Visualizer: Middle on mobile, Left column spanning 2 rows on desktop */}
              <div className="w-full md:col-span-6 md:col-start-1 md:row-start-1 md:row-span-2 my-3 sm:my-5 md:my-0 flex items-center justify-center shrink-0">
                {slide.visualizer}
              </div>

              {/* Description: Bottom on mobile, Right-bottom on desktop (+ "Mulai Sekarang" button on slide 5 for desktop) */}
              <div className="w-full md:col-span-6 md:col-start-7 md:row-start-2 md:self-start">
                <p className="text-[11px] sm:text-xs md:text-sm lg:text-base font-normal text-slate-600 leading-relaxed max-w-sm sm:max-w-md md:max-w-lg mx-auto md:mx-0 px-4 md:px-0">
                  {slide.description}
                </p>

                {index === totalSlides - 1 && (
                  <div className="hidden md:block mt-6">
                    <button
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={onComplete}
                      className="px-7 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                    >
                      <span>Mulai Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Area:
          - Desktop: 5 Bullets Indicator across all slides ("Mulai Sekarang" is under slide 5 description)
          - Mobile: 5 Bullets Indicator on Slides 1-4, and "Mulai Sekarang" Button on Slide 5 */}
      <div className="w-full max-w-md md:max-w-lg h-16 sm:h-20 flex items-center justify-center px-6 pb-4 sm:pb-6 shrink-0 z-20">
        <div className={`items-center justify-center gap-1.5 sm:gap-2 animate-in fade-in duration-200 ${isLastSlide ? 'hidden md:flex' : 'flex'}`}>
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
                    ? 'w-6 sm:w-8 h-2 bg-blue-600'
                    : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            );
          })}
        </div>

        {isLastSlide && (
          <div className="w-full max-w-xs sm:max-w-sm animate-in fade-in zoom-in-95 duration-200 md:hidden">
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
