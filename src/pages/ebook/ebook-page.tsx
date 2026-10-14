import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  ListOrdered
} from 'lucide-react';
import { PANDUAN_CHAPTERS } from './ebook-data';
import { EbookCoverView } from './ebook-cover-view';
import { EbookBookView } from './ebook-book-view';
import { FormulaCompendium } from './formula-compendium';
import { EbookGlossaryView } from './ebook-glossary-view';
import { EbookFaqView } from './ebook-faq-view';
import { EbookRegulasiView } from './ebook-regulasi-view';
import { EbookBottomBar } from './ebook-bottom-bar';
import { ModalForeword } from './modal-foreword';
import { ModalChapterSummary } from './modal-chapter-summary';
import { ModalTableOfContents } from './modal-table-of-contents';
import { 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch,
  PageHeaderTitle,
  HideBottomNav,
  useMobileNav
} from '../../context/MobileNavContext';
import { scrollToTop } from '../../components/layout/ScrollToTop';

export function EbookPage() {
  const navigate = useNavigate();
  const { setHideDesktopSidebar } = useMobileNav();

  // URL Parameter Detection for Reading Mode
  const [isReadParam, setIsReadParam] = useState(false);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('read') === 'true') {
      setIsReadParam(true);
      setIsCoverMode(false);
    }
  }, []);

  // Mode Cover Awal (Saat awal masuk: full cover + animasi morphing + tombol "Mulai Belajar")
  const [isCoverMode, setIsCoverMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('read') !== 'true';
    }
    return true;
  });

  // Header Search, TOC Modal, & Summary Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTocModalOpen, setIsTocModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isForewordModalOpen, setIsForewordModalOpen] = useState(false);

  // Top Active Section: 'buku' | 'rumus' | 'glosarium' | 'faq' | 'regulasi'
  const [activeMainTab, setActiveMainTab] = useState<'buku' | 'rumus' | 'glosarium' | 'faq' | 'regulasi'>('buku');

  // EBook HRMatrix State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeChapterId, setActiveChapterId] = useState<string>(PANDUAN_CHAPTERS[0].id);

  // Mode Baca: 'slide' (Page slide per bab) vs 'scroll' (Mode baca full ke bawah / Mode Fokus)
  const [readMode, setReadMode] = useState<'slide' | 'scroll'>('slide');

  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Bedah Rumus Active Formula State
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('');

  // Reading Progress State (Stored in localStorage)
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hrmatrix_ebook_read');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync scroll mode (Mode Fokus) dan parameter ?read=true dengan desktop sidebar
  useEffect(() => {
    const isScrollMode = readMode === 'scroll';
    setHideDesktopSidebar(isScrollMode || isReadParam);

    return () => {
      setHideDesktopSidebar(false);
    };
  }, [readMode, isReadParam, setHideDesktopSidebar]);

  // Reset scroll ke paling atas setiap kali berpindah modul/tab utama, bab, mode cover, atau mode baca
  useEffect(() => {
    scrollToTop(false);
  }, [activeMainTab, activeChapterId, isCoverMode, readMode, selectedFormulaId, selectedCategory]);

  // Kunci scroll saat berada di Mode Cover Awal agar pas 1 halaman penuh tanpa scrollbar
  useEffect(() => {
    if (isCoverMode) {
      document.body.style.overflow = 'hidden';
      const mainScroll = document.getElementById('main-content-scroll');
      if (mainScroll) {
        const originalOverflow = mainScroll.style.overflow;
        const originalPadding = mainScroll.style.padding;
        mainScroll.style.overflow = 'hidden';
        mainScroll.style.padding = '0';
        mainScroll.scrollTop = 0;
        return () => {
          document.body.style.overflow = '';
          mainScroll.style.overflow = originalOverflow;
          mainScroll.style.padding = originalPadding;
        };
      }
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isCoverMode]);

  // Persist completed chapters
  useEffect(() => {
    try {
      localStorage.setItem('hrmatrix_ebook_read', JSON.stringify(completedChapters));
    } catch {
      // Ignore localStorage errors in sandboxed iframes
    }
  }, [completedChapters]);

  const toggleChapterCompleted = (id: string) => {
    setCompletedChapters((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter chapters based on search query and category
  const filteredChapters = useMemo(() => {
    return PANDUAN_CHAPTERS.filter((ch) => {
      const matchCategory = selectedCategory === 'Semua' || ch.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = ch.title.toLowerCase().includes(q) || ch.subtitle.toLowerCase().includes(q) || ch.summary.toLowerCase().includes(q);
      const matchSubsections = ch.subsections.some((sub) => 
        sub.title.toLowerCase().includes(q) ||
        sub.description.toLowerCase().includes(q) ||
        sub.details.some(d => d.toLowerCase().includes(q)) ||
        (sub.formula && (
          sub.formula.expression.toLowerCase().includes(q) ||
          sub.formula.explanation.toLowerCase().includes(q)
        ))
      );

      return matchTitle || matchSubsections;
    });
  }, [searchQuery, selectedCategory]);

  const activeChapter = useMemo(() => {
    return PANDUAN_CHAPTERS.find(c => c.id === activeChapterId) || PANDUAN_CHAPTERS[0];
  }, [activeChapterId]);

  const currentIndex = PANDUAN_CHAPTERS.findIndex(c => c.id === activeChapter.id);
  const prevChapter = currentIndex > 0 ? PANDUAN_CHAPTERS[currentIndex - 1] : null;
  const nextChapter = currentIndex < PANDUAN_CHAPTERS.length - 1 ? PANDUAN_CHAPTERS[currentIndex + 1] : null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleJumpToFormula = (formulaId?: string) => {
    setActiveMainTab('rumus');
    if (formulaId) {
      setSelectedFormulaId(formulaId);
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleStartLearning = () => {
    setIsCoverMode(false);
    setActiveMainTab('buku');
    setReadMode('slide');
    scrollToTop(false);
  };

  return (
    <div className={isCoverMode ? "w-full h-full flex-1 flex flex-col overflow-hidden select-none" : "w-full max-w-7xl mx-auto space-y-4 pb-20 sm:pb-16"}>
      {/* Hide standard mobile bottom navigation */}
      <HideBottomNav id="ebook-page-nav" />

      {/* Header Title & Navigation Controls */}
      {isCoverMode ? (
        <PageHeaderTitle 
          title="EBook HRMatrix"
          subtitle="Digital HR Architecture & Strategy"
          hideHamburger={isReadParam}
        />
      ) : activeMainTab === 'rumus' ? (
        <PageHeaderTitle 
          title="Kamus Rumus"
          subtitle="Bedah Rumus & Formula Resmi"
          onBack={() => {
            setActiveMainTab('buku');
            setIsCoverMode(false);
            scrollToTop(false);
          }}
          hideHamburger={true}
        />
      ) : activeMainTab === 'glosarium' ? (
        <PageHeaderTitle 
          title="Glosarium"
          subtitle="Kamus Istilah HR Ketenagakerjaan"
          onBack={() => {
            setActiveMainTab('buku');
            setIsCoverMode(false);
            scrollToTop(false);
          }}
          hideHamburger={true}
        />
      ) : activeMainTab === 'faq' ? (
        <PageHeaderTitle 
          title="Solusi & FAQ"
          subtitle="FAQ Operasional & Kepatuhan Hukum"
          onBack={() => {
            setActiveMainTab('buku');
            setIsCoverMode(false);
            scrollToTop(false);
          }}
          hideHamburger={true}
        />
      ) : activeMainTab === 'regulasi' ? (
        <PageHeaderTitle 
          title="Regulasi & UU"
          subtitle="Peraturan Perundang-undangan"
          onBack={() => {
            setActiveMainTab('buku');
            setIsCoverMode(false);
            scrollToTop(false);
          }}
          hideHamburger={true}
        />
      ) : (
        <PageHeaderTitle 
          title={readMode === 'scroll' ? 'Isi E-Book (Mode Fokus)' : `Bab ${activeChapter.number}: ${activeChapter.title}`}
          subtitle={readMode === 'scroll' ? 'EBook HRMatrix Indonesia' : activeChapter.subtitle}
          onBack={readMode === 'scroll' ? () => { setReadMode('slide'); scrollToTop(false); } : () => { setIsCoverMode(true); scrollToTop(false); }}
          hideHamburger={true}
        />
      )}

      {/* 1. Header Action Cards saat Mode Cover: Card Icon Kata Pengantar di Paling Kanan */}
      {isCoverMode && (
        <>
          <DesktopHeaderActions>
            <button
              type="button"
              onClick={() => setIsForewordModalOpen(true)}
              className="h-9 px-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-200 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Kata Pengantar Penulis"
            >
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Kata Pengantar</span>
            </button>
          </DesktopHeaderActions>

          <MobileHeaderActions>
            <button
              type="button"
              onClick={() => setIsForewordModalOpen(true)}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs active:scale-95"
              title="Kata Pengantar Penulis"
              aria-label="Kata Pengantar Penulis"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
            </button>
          </MobileHeaderActions>
        </>
      )}

      {/* 2. Header Action Cards (Search & Daftar Isi Modal) - Disembunyikan saat Mode Cover Awal */}
      {!isCoverMode && !isSearchOpen && (
        <>
          <DesktopHeaderActions>
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="h-9 w-9 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              title="Cari EBook"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* List Icon for Daftar Isi Modal (Hidden in Scroll Mode) */}
            {readMode !== 'scroll' && (
              <button
                type="button"
                onClick={() => setIsTocModalOpen(true)}
                className="h-9 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Daftar Isi EBook HRMatrix"
              >
                <ListOrdered className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Daftar Isi</span>
              </button>
            )}
          </DesktopHeaderActions>

          <MobileHeaderActions>
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs"
              title="Cari EBook"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* List Icon for Daftar Isi (Hidden in Scroll Mode) */}
            {readMode !== 'scroll' && (
              <button
                type="button"
                onClick={() => setIsTocModalOpen(true)}
                className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs"
                title="Daftar Isi"
              >
                <ListOrdered className="w-4 h-4 text-slate-600" />
              </button>
            )}
          </MobileHeaderActions>
        </>
      )}

      {/* Expanded Inline Header Searchbar */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari topik, bab, PPh 21 TER, lembur, BPJS, THR, KPI..."
        />
      )}

      {/* ================= COVER MODE SCREEN (AWAL MASUK) ================= */}
      {isCoverMode ? (
        <EbookCoverView onStartLearning={handleStartLearning} />
      ) : (
        <>
          {/* ================= TAB 1: EBook HRMatrix & MODUL ================= */}
          {activeMainTab === 'buku' && (
            <EbookBookView
              readMode={readMode}
              activeChapter={activeChapter}
              filteredChapters={filteredChapters}
              completedChapters={completedChapters}
              copiedFormula={copiedFormula}
              onCopy={handleCopy}
              onNavigatePage={(path) => navigate(path)}
              onToggleCompleted={toggleChapterCompleted}
              onJumpToFormula={handleJumpToFormula}
            />
          )}

          {/* ================= TAB 2: BEDAH RUMUS & FORMULA RESMI ================= */}
          {activeMainTab === 'rumus' && (
            <FormulaCompendium
              selectedFormulaId={selectedFormulaId}
              onSelectFormula={(id) => setSelectedFormulaId(id)}
              onCopyFormula={handleCopy}
              copiedFormula={copiedFormula}
            />
          )}

          {/* ================= TAB 3: KAMUS & GLOSARIUM HR ================= */}
          {activeMainTab === 'glosarium' && (
            <EbookGlossaryView />
          )}

          {/* ================= TAB 4: FAQ PERTANYAAN PRAKTIS ================= */}
          {activeMainTab === 'faq' && (
            <EbookFaqView />
          )}

          {/* ================= TAB 5: DAFTAR REGULASI & UU ================= */}
          {activeMainTab === 'regulasi' && (
            <EbookRegulasiView />
          )}
        </>
      )}

      {/* Custom Bottom Navigation Bar */}
      <EbookBottomBar
        isCoverMode={isCoverMode}
        activeMainTab={activeMainTab}
        readMode={readMode}
        activeChapter={activeChapter}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        onStartLearning={handleStartLearning}
        onSetReadMode={(mode) => setReadMode(mode)}
        onPrevChapter={() => {
          if (prevChapter) {
            setActiveChapterId(prevChapter.id);
            scrollToTop(false);
          }
        }}
        onNextChapter={() => {
          if (nextChapter) {
            setActiveChapterId(nextChapter.id);
            scrollToTop(false);
          }
        }}
        onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
      />

      {/* Floating Action Button (FAB) untuk beralih kembali ke Mode Slide saat berada di Mode Scroll */}
      <AnimatePresence>
        {!isCoverMode && activeMainTab === 'buku' && readMode === 'scroll' && (
          <motion.button
            key="fab-slide-mode"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            type="button"
            onClick={() => {
              setReadMode('slide');
              scrollToTop(false);
            }}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-4 py-3 rounded-full shadow-xl hover:shadow-2xl flex items-center gap-2 transition-all cursor-pointer ring-4 ring-blue-600/20"
            title="Kembali ke Mode Slide"
          >
            <BookOpen className="w-5 h-5 shrink-0 text-white" />
            <span className="text-xs font-bold tracking-wide">Slide</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ================= MODAL TUJUAN MODUL & RINGKASAN BAB ================= */}
      <ModalChapterSummary 
        isOpen={isSummaryModalOpen} 
        onClose={() => setIsSummaryModalOpen(false)}
        chapter={activeChapter}
      />

      {/* ================= MODAL KATA PENGANTAR PENULIS ================= */}
      <ModalForeword 
        isOpen={isForewordModalOpen} 
        onClose={() => setIsForewordModalOpen(false)}
      />

      {/* ================= MODAL DAFTAR ISI & MODUL ================= */}
      <ModalTableOfContents 
        isOpen={isTocModalOpen} 
        onClose={() => setIsTocModalOpen(false)}
        activeMainTab={activeMainTab}
        isCoverMode={isCoverMode}
        activeChapterId={activeChapter.id}
        completedChapters={completedChapters}
        onSelectCoverMode={() => {
          setIsCoverMode(true);
          scrollToTop(false);
        }}
        onSelectMainTab={(tab) => {
          setActiveMainTab(tab);
          setIsCoverMode(false);
        }}
        onSelectChapter={(chapterId) => {
          setActiveChapterId(chapterId);
          setActiveMainTab('buku');
          setIsCoverMode(false);
          if (readMode === 'scroll') {
            setTimeout(() => {
              const el = document.getElementById(`chapter-${chapterId}`);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            scrollToTop(false);
          }
        }}
      />
    </div>
  );
}
