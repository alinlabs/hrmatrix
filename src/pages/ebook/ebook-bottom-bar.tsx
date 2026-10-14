import React from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  ArrowRight 
} from 'lucide-react';
import { Chapter } from './ebook-types';
import { toRoman } from './utils-helper';
import { MobileBottomBar } from '../../context/MobileNavContext';

interface EbookBottomBarProps {
  isCoverMode: boolean;
  activeMainTab: 'buku' | 'rumus' | 'glosarium' | 'faq' | 'regulasi';
  readMode: 'slide' | 'scroll';
  activeChapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  onStartLearning: () => void;
  onSetReadMode: (mode: 'slide' | 'scroll') => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onOpenSummaryModal: () => void;
}

export function EbookBottomBar({
  isCoverMode,
  activeMainTab,
  readMode,
  activeChapter,
  prevChapter,
  nextChapter,
  onStartLearning: _,
  onSetReadMode,
  onPrevChapter,
  onNextChapter,
  onOpenSummaryModal,
}: EbookBottomBarProps) {
  const showSlide = !isCoverMode && activeMainTab === 'buku' && readMode === 'slide';

  if (!showSlide) {
    return null;
  }

  return (
    <MobileBottomBar>
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 text-slate-800 bg-transparent p-0 border-none shadow-none">
        {/* 1. Icon Model Tampilan / Switch ke Mode Scroll (Paling Kiri) */}
          <button
            type="button"
            onClick={() => onSetReadMode('scroll')}
            className="p-1.5 flex flex-col items-center justify-center shrink-0 min-w-[42px] hover:bg-slate-100/80 rounded-lg transition-all cursor-pointer active:scale-95"
            title="Ganti ke Mode Scroll"
          >
            <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
            <span className="text-[9px] font-medium text-slate-600 mt-0.5 leading-none">Scroll</span>
          </button>

          {/* 2. Tombol Bab Sebelumnya (Chevron Left - Abu-abu) */}
          <button
            type="button"
            onClick={onPrevChapter}
            disabled={!prevChapter}
            className={`p-2 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              prevChapter 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95' 
                : 'bg-slate-100/50 text-slate-300 cursor-not-allowed'
            }`}
            title="Bab Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* 3. Middle Bab Slide Indicator & Title */}
          <div className="flex-1 flex flex-col items-center min-w-0 px-2 sm:px-4">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              BAB {toRoman(activeChapter.number)}
            </span>
            <div className="text-xs font-bold text-slate-800 truncate mt-0.5 text-center w-full max-w-[200px] sm:max-w-md">
              {activeChapter.title}
            </div>
          </div>

          {/* 4. Tombol Bab Selanjutnya (Chevron Right - Abu-abu) */}
          <button
            type="button"
            onClick={onNextChapter}
            disabled={!nextChapter}
            className={`p-2 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              nextChapter 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95' 
                : 'bg-slate-100/50 text-slate-300 cursor-not-allowed'
            }`}
            title="Bab Selanjutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 5. Icon Lampu Tanpa Card (Paling Kanan) */}
          <button
            type="button"
            onClick={onOpenSummaryModal}
            className="p-2 flex items-center justify-center shrink-0 hover:bg-slate-100/80 text-slate-500 hover:text-slate-700 rounded-lg transition-all cursor-pointer active:scale-95"
            title="Tujuan Modul & Ringkasan Bab"
          >
            <Lightbulb className="w-5 h-5 text-slate-500" />
          </button>
        </div>
    </MobileBottomBar>
  );
}
