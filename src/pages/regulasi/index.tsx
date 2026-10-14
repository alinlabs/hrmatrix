import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Scale, 
  Search, 
  BookOpenCheck, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Info, 
  FileSignature, 
  Clock, 
  DollarSign, 
  Users, 
  RotateCcw, 
  Printer,
  Building2,
  Globe2,
  Layers,
  Award,
  BookOpen,
  BookmarkCheck,
  Briefcase,
  Shield,
  HeartHandshake,
  Lock,
  Leaf,
  Activity,
  UserCheck
} from 'lucide-react';
import { 
  REGULATION_DATA, 
  REGULATION_CATEGORIES_META 
} from './regulation-data';
import { COMPANY_REGULATION_DATA } from './company-regulation-data';
import { ISO_STANDARDS_DATA, ISO_DOMAINS_META } from './iso-standards-data';
import { 
  RegulationMainTab, 
  RegulationCategory, 
  RegulationItem, 
  CompanyRegulationChapter,
  CompanyRegulationArticle,
  IsoDomainCategory, 
  IsoStandardItem 
} from './types';
import { RegulationCalculatorModal } from './RegulationCalculatorModal';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';

interface RegulasiHukumPageProps {
  initialTab?: RegulationMainTab;
}

export const RegulasiHukumPage: React.FC<RegulasiHukumPageProps> = ({ initialTab }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getInitialTab = (): RegulationMainTab => {
    if (initialTab) return initialTab;
    const path = location.pathname;
    if (path.includes('peraturan-perusahaan')) return 'peraturan_perusahaan';
    if (path.includes('undang-undang')) return 'undang_undang';
    if (path.includes('standar-iso') || path.includes('iso')) return 'standar_iso';
    
    const tabParam = searchParams.get('tab');
    if (tabParam === 'pp' || tabParam === 'peraturan_perusahaan' || tabParam === 'peraturan-perusahaan') return 'peraturan_perusahaan';
    if (tabParam === 'uu' || tabParam === 'undang_undang' || tabParam === 'undang-undang') return 'undang_undang';
    if (tabParam === 'iso' || tabParam === 'standar_iso' || tabParam === 'standar-iso') return 'standar_iso';

    return 'peraturan_perusahaan';
  };

  // 1. TOP-LEVEL 3 TABS: 'peraturan_perusahaan' | 'undang_undang' | 'standar_iso'
  const [activeMainTab, setActiveMainTab] = useState<RegulationMainTab>(getInitialTab);

  useEffect(() => {
    const tab = getInitialTab();
    setActiveMainTab(tab);
  }, [location.pathname, searchParams]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLawCategory, setSelectedLawCategory] = useState<RegulationCategory>('ALL');
  const [selectedCompanyChapterId, setSelectedCompanyChapterId] = useState<string>('ALL');
  const [selectedIsoDomain, setSelectedIsoDomain] = useState<IsoDomainCategory>('ALL');

  // Expanded Accordion States
  const [expandedLawId, setExpandedLawId] = useState<string | null>('reg-pkwt-rules');
  const [expandedCompanyChapterId, setExpandedCompanyChapterId] = useState<string | null>('bab-1');
  const [expandedIsoId, setExpandedIsoId] = useState<string | null>('iso-30415-2021');

  // Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCalculator, setActiveCalculator] = useState<'pkwt_compensation' | 'severance' | 'overtime' | null>(null);

  // -----------------------------------------------------------------
  // 1. FILTERED DATA: PERATURAN PERUSAHAAN (TAB 1)
  // -----------------------------------------------------------------
  const filteredCompanyRegulations = useMemo(() => {
    return COMPANY_REGULATION_DATA.filter((chapter) => {
      // Chapter filter
      if (selectedCompanyChapterId !== 'ALL' && chapter.id !== selectedCompanyChapterId) {
        return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchChapterTitle = chapter.title.toLowerCase().includes(q) || chapter.chapterNumber.toLowerCase().includes(q);
      const matchDescription = chapter.description.toLowerCase().includes(q);
      const matchArticles = chapter.articles.some(art => 
        art.title.toLowerCase().includes(q) || 
        art.content.toLowerCase().includes(q) ||
        (art.legalReference && art.legalReference.toLowerCase().includes(q)) ||
        (art.hrImplementationNote && art.hrImplementationNote.toLowerCase().includes(q))
      );

      return matchChapterTitle || matchDescription || matchArticles;
    });
  }, [selectedCompanyChapterId, searchQuery]);

  // -----------------------------------------------------------------
  // 2. FILTERED DATA: UNDANG-UNDANG & PP (TAB 2)
  // -----------------------------------------------------------------
  const filteredLaws = useMemo(() => {
    return REGULATION_DATA.filter((item) => {
      const matchCategory = selectedLawCategory === 'ALL' || item.category === selectedLawCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchLawBasis = item.lawBasis.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      const matchArticles = item.articles.some(a => 
        a.title.toLowerCase().includes(q) || 
        a.number.toLowerCase().includes(q) || 
        a.fullText.toLowerCase().includes(q)
      );

      return matchTitle || matchCode || matchLawBasis || matchSummary || matchTags || matchArticles;
    });
  }, [selectedLawCategory, searchQuery]);

  // -----------------------------------------------------------------
  // 3. FILTERED DATA: STANDAR ISO (TAB 3)
  // -----------------------------------------------------------------
  const filteredIsoStandards = useMemo(() => {
    return ISO_STANDARDS_DATA.filter((iso) => {
      const matchDomain = selectedIsoDomain === 'ALL' || iso.domain === selectedIsoDomain;
      if (!matchDomain) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchCode = iso.code.toLowerCase().includes(q);
      const matchName = iso.name.toLowerCase().includes(q);
      const matchIdTitle = iso.indonesianTitle.toLowerCase().includes(q);
      const matchSummary = iso.summary.toLowerCase().includes(q);
      const matchHr = iso.hrRelevance.toLowerCase().includes(q);
      const matchClauses = iso.keyClauses.some(c => 
        c.number.toLowerCase().includes(q) || 
        c.name.toLowerCase().includes(q) || 
        c.requirement.toLowerCase().includes(q) ||
        c.hrAction.toLowerCase().includes(q)
      );
      const matchChecklist = iso.auditChecklist.some(chk => chk.toLowerCase().includes(q));

      return matchCode || matchName || matchIdTitle || matchSummary || matchHr || matchClauses || matchChecklist;
    });
  }, [selectedIsoDomain, searchQuery]);

  // Copy helper for generic texts
  const handleCopyText = async (id: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const headerMeta = useMemo(() => {
    switch (activeMainTab) {
      case 'peraturan_perusahaan':
        return {
          title: 'Peraturan Kantor',
          subtitle: 'Klausul PP & tata tertib',
        };
      case 'undang_undang':
        return {
          title: 'Regulasi & UU',
          subtitle: 'UU Cipta Kerja & PP 35/2021',
        };
      case 'standar_iso':
        return {
          title: 'Standar ISO',
          subtitle: 'Audit & kepatuhan mutu ISO',
        };
    }
  }, [activeMainTab]);

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          searchQuery
            ? 'border-indigo-300 text-indigo-600 bg-indigo-50/50'
            : 'border-slate-200 text-slate-700 hover:text-indigo-600'
        }`}
        title="Cari Regulasi & Standar"
      >
        <Search className="w-4 h-4" />
        {searchQuery && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setActiveCalculator('pkwt_compensation')}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Kalkulator Kompensasi PKWT"
      >
        <Calculator className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Kompensasi</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveCalculator('severance')}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Kalkulator Pesangon PHK"
      >
        <Calculator className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">Pesangon</span>
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg shadow-2xs flex items-center justify-center transition-all cursor-pointer"
        title="Cetak Regulasi"
      >
        <Printer className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={headerMeta.title}
        subtitle={headerMeta.subtitle}
      />

      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          placeholder="Cari pasal peraturan, undang-undang, atau standar ISO..."
        />
      )}

      {/* 2. PRIMARY TABS & FILTER BAR */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs space-y-3">
        {/* Main Tabs Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('peraturan_perusahaan');
              setSearchQuery('');
            }}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'peraturan_perusahaan'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Peraturan Perusahaan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('undang_undang');
              setSearchQuery('');
            }}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'undang_undang'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Undang-Undang</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('standar_iso');
              setSearchQuery('');
            }}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'standar_iso'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Standar ISO</span>
          </button>
        </div>

        {/* Sub-Filters Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100">
          {activeMainTab === 'peraturan_perusahaan' && (
            <>
              <button
                type="button"
                onClick={() => setSelectedCompanyChapterId('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCompanyChapterId === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Semua Bab
              </button>
              {COMPANY_REGULATION_DATA.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedCompanyChapterId(ch.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCompanyChapterId === ch.id
                      ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {ch.chapterNumber}: {ch.title.split('&')[0]}
                </button>
              ))}
            </>
          )}

          {activeMainTab === 'undang_undang' && (
            <>
              {REGULATION_CATEGORIES_META.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedLawCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedLawCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </>
          )}

          {activeMainTab === 'standar_iso' && (
            <>
              {ISO_DOMAINS_META.map((dom) => (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => setSelectedIsoDomain(dom.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedIsoDomain === dom.id
                      ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {dom.label}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="space-y-4">
        
        {/* ========================================================================= */}
        {/* TAB 1 CONTENT: PERATURAN PERUSAHAAN                                       */}
        {/* ========================================================================= */}
        {activeMainTab === 'peraturan_perusahaan' && (
          <div className="space-y-6">
            
            {/* PP Disnaker Compliance Notice Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Format Standar Peraturan Perusahaan (PP) Resmi
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Kompilasi Draf Naskah Peraturan Perusahaan Siap Pakai untuk HR
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Disusun lengkap 11 Bab memuat 29 Pasal komprehensif berpedoman pada UU Ketenagakerjaan No. 13/2003 jo. UU Cipta Kerja No. 6/2023 & PP No. 35/2021. HR dapat langsung mengutip pasal atau menjadikannya rujukan pembuatan Buku Pedoman Karyawan (Employee Handbook).
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-indigo-200">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Wajib bagi perusahaan dengan ≥ 10 pekerja
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Masa berlaku pengesahan Disnaker: 2 Tahun
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <Link
                  to="/kontrak"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  <span>Buat Kontrak Kerja Baru</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const fullPPText = COMPANY_REGULATION_DATA.map(ch => 
                      `========================================\n${ch.chapterNumber}: ${ch.title}\n========================================\n${ch.articles.map(a => `PASAL ${a.number}: ${a.title}\n${a.content}\n[Rujukan: ${a.legalReference || '-'}]\n`).join('\n')}`
                    ).join('\n\n');
                    handleCopyText('full-pp-copy', fullPPText);
                  }}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'full-pp-copy' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Naskah Lengkap Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Salin Seluruh Naskah PP</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Empty Search */}
            {filteredCompanyRegulations.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tidak ditemukan pasal Peraturan Perusahaan yang cocok
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba gunakan kata kunci lain seperti "waktu kerja", "cuti tahunan", "SP 1", "pesangon", atau reset filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCompanyChapterId('ALL');
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            )}

            {/* Chapter List Accordion Cards */}
            <div className="space-y-4">
              {filteredCompanyRegulations.map((chapter) => {
                const isExpanded = expandedCompanyChapterId === chapter.id;

                return (
                  <div
                    key={chapter.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs ${
                      isExpanded ? 'border-indigo-300 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Chapter Header Card */}
                    <div 
                      onClick={() => setExpandedCompanyChapterId(isExpanded ? null : chapter.id)}
                      className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 hover:bg-indigo-50/30 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
                          {chapter.chapterNumber.replace('BAB ', '')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                              {chapter.chapterNumber}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {chapter.articles.length} Pasal Termuat
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                            {chapter.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {chapter.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="text-xs font-bold text-indigo-700">
                          {isExpanded ? 'Tutup Bab' : 'Buka & Baca Pasal'}
                        </span>
                        <div className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Chapter Articles Body */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 border-t border-slate-200 bg-white space-y-4">
                        {chapter.articles.map((art) => {
                          const articleCopyId = `art-${chapter.id}-${art.number}`;
                          const isCopied = copiedId === articleCopyId;

                          return (
                            <div 
                              key={art.number}
                              className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-white bg-indigo-600 px-2.5 py-0.5 rounded-md">
                                      PASAL {art.number}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900">
                                      {art.title}
                                    </h4>
                                  </div>
                                  {art.legalReference && (
                                    <span className="text-[11px] text-indigo-700 font-medium flex items-center gap-1 mt-1">
                                      <BookOpenCheck className="w-3.5 h-3.5" />
                                      Rujukan Hukum: {art.legalReference}
                                    </span>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const textToCopy = `[KUTIPAN PERATURAN PERUSAHAAN]\n${chapter.chapterNumber}: ${chapter.title}\nPASAL ${art.number}: ${art.title}\n\n${art.content}\n\nDasar Rujukan: ${art.legalReference || '-'}`;
                                    handleCopyText(articleCopyId, textToCopy);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
                                  title="Salin teks pasal ke clipboard"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-700 font-bold">Pasal Tersalin!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Kutip Teks Pasal</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Article Full Text */}
                              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans bg-white p-3.5 rounded-xl border border-slate-200/70">
                                {art.content}
                              </div>

                              {/* HR Implementation Note */}
                              {art.hrImplementationNote && (
                                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/70 text-emerald-950 text-[11px] flex items-start gap-2">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="block font-bold">Petunjuk Implementasi & Kepatuhan HR:</strong>
                                    <span className="leading-snug">{art.hrImplementationNote}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2 CONTENT: UNDANG UNDANG & PERATURAN PEMERINTAH (PP)                   */}
        {/* ========================================================================= */}
        {activeMainTab === 'undang_undang' && (
          <div className="space-y-6">
            
            {/* Law Header Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  Dasar Hukum Positif Ketenagakerjaan Indonesia
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Kompilasi Undang-Undang & Peraturan Pemerintah (PP) Berlaku
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rujukan resmi UU No. 6/2023 (Cipta Kerja), UU No. 13/2003, PP No. 35/2021 (PKWT & PHK), PP No. 36/2021 (Pengupahan), UU No. 24/2011 (BPJS), serta UU KIA No. 4/2024 beserta kalkulator simulasi hukum interaktif.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveCalculator('pkwt_compensation')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Kalkulator Kompensasi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCalculator('overtime')}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Kalkulator Lembur</span>
                </button>
              </div>
            </div>

            {/* Empty Search */}
            {filteredLaws.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tidak ada topik regulasi UU yang sesuai pencarian
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba gunakan kata kunci lain seperti "PKWT", "pesangon", "lembur", "BPJS", atau reset kategori.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLawCategory('ALL');
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            )}

            {/* List of Law Cards */}
            <div className="space-y-5">
              {filteredLaws.map((reg) => {
                const isExpanded = expandedLawId === reg.id;
                const isCopied = copiedId === reg.id;

                return (
                  <div 
                    key={reg.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs ${
                      isExpanded ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Header Card */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60">
                            {reg.code}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {reg.categoryLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const textToCopy = `[DASAR HUKUM HR]\n${reg.title}\nDasar Regulasi: ${reg.lawBasis}\n\nPoin Kunci:\n${reg.keyPoints.map(p => `• ${p}`).join('\n')}\n\nRujukan Pasal:\n${reg.articles.map(a => `${a.number} - ${a.title}:\n"${a.summary}"`).join('\n\n')}\n\nSumber: HRMatrix Legal Compliance Hub`;
                              handleCopyText(reg.id, textToCopy);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Salin ringkasan dasar hukum ke clipboard"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Kutip Dasar Hukum</span>
                              </>
                            )}
                          </button>

                          {reg.calculatorType && (
                            <button
                              type="button"
                              onClick={() => setActiveCalculator(reg.calculatorType!)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Calculator className="w-3.5 h-3.5 text-blue-600" />
                              <span>Simulasi Hitung</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {reg.title}
                        </h3>
                        <p className="text-xs text-blue-700 font-medium mt-0.5 flex items-center gap-1">
                          <BookOpenCheck className="w-3.5 h-3.5" />
                          {reg.lawBasis}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {reg.summary}
                      </p>

                      {/* Key Points Bullet */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                          Poin Kunci Ketentuan Hukum:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {reg.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tags and Accordion Toggle */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {reg.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedLawId(isExpanded ? null : reg.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Tutup Teks Pasal & Rujukan' : `Lihat ${reg.articles.length} Rujukan Pasal`}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Articles Section */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 bg-blue-50/30 border-t border-blue-100/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-blue-600" />
                            Bunyi Pasal Resmi & Pedoman Praktis HR:
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {reg.articles.length} Pasal Terdaftar
                          </span>
                        </div>

                        <div className="space-y-3">
                          {reg.articles.map((art, aIdx) => (
                            <div key={aIdx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                  {art.number}
                                </span>
                                <span className="text-xs font-bold text-slate-900">
                                  {art.title}
                                </span>
                              </div>

                              {/* Full Law Text Quote */}
                              <div className="p-3 bg-slate-50 rounded-xl border-l-3 border-blue-500 font-mono text-[11px] text-slate-800 leading-relaxed whitespace-pre-line">
                                {art.fullText}
                              </div>

                              {/* Important Note & Practical HR Tip */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                                {art.importantNote && (
                                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/70 text-amber-950 flex items-start gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="block font-bold">Catatan Kritis Kepatuhan:</strong>
                                      <span className="leading-snug">{art.importantNote}</span>
                                    </div>
                                  </div>
                                )}

                                {art.practicalHRTip && (
                                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/70 text-emerald-950 flex items-start gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="block font-bold">Tips Praktis Operasional HR:</strong>
                                      <span className="leading-snug">{art.practicalHRTip}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Penalty Risk Notice */}
                        {reg.penaltiesOrRisks && (
                          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-950 text-xs flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-bold">Risiko Hukum & Sanksi Pelanggaran:</strong>
                              <span className="leading-snug">{reg.penaltiesOrRisks}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3 CONTENT: STANDAR ISO (INTERNATIONAL STANDARDS ENCYCLOPEDIA)         */}
        {/* ========================================================================= */}
        {activeMainTab === 'standar_iso' && (
          <div className="space-y-6">
            
            {/* ISO Header Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-900 rounded-3xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                  Standar Internasional Organisasi & Human Resources (ISO)
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Ensiklopedia Standar ISO & Pedoman Kepatuhan Audit HR
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Referensi lengkap standar ISO lintas bidang: Manajemen Mutu (9001), K3 (45001), Keamanan Informasi (27001), Diversity & Inclusion (30415), Anti Penyuapan (37001), Rekrutmen (30405), dan Kelangsungan Bisnis (22301) dilengkapi checklist audit personalia.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3.5 py-2 bg-emerald-600/80 text-white font-bold text-xs rounded-xl border border-emerald-400/40 inline-flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>11 Standar Internasional</span>
                </span>
              </div>
            </div>

            {/* Empty Search */}
            {filteredIsoStandards.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tidak ada Standar ISO yang sesuai pencarian
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba gunakan kata kunci lain seperti "9001", "K3", "security", "diversity", "recruitment", atau reset domain.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIsoDomain('ALL');
                  }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            )}

            {/* List of ISO Cards */}
            <div className="space-y-5">
              {filteredIsoStandards.map((iso) => {
                const isExpanded = expandedIsoId === iso.id;
                const isCopied = copiedId === iso.id;

                const getBadgeBg = (color: string) => {
                  switch (color) {
                    case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200';
                    case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200';
                    case 'amber': return 'bg-amber-50 text-amber-700 border-amber-200';
                    case 'rose': return 'bg-rose-50 text-rose-700 border-rose-200';
                    case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
                  }
                };

                return (
                  <div
                    key={iso.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs ${
                      isExpanded ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* ISO Header Card */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getBadgeBg(iso.badgeColor)}`}>
                            {iso.code}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {iso.domainLabel}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const textToCopy = `[STANDAR INTERNASIONAL ISO]\n${iso.code}: ${iso.name}\nJudul: ${iso.indonesianTitle}\n\nRingkasan:\n${iso.summary}\n\nRelevansi bagi HR:\n${iso.hrRelevance}\n\nChecklist Audit HR:\n${iso.auditChecklist.map(c => `[ ] ${c}`).join('\n')}\n\nTips Implementasi:\n${iso.practicalTips}`;
                            handleCopyText(iso.id, textToCopy);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                          title="Salin ringkasan standar ISO ke clipboard"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Salin Referensi ISO</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {iso.name}
                        </h3>
                        <p className="text-xs text-emerald-700 font-medium mt-0.5">
                          {iso.indonesianTitle}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {iso.summary}
                      </p>

                      {/* HR Relevance Box */}
                      <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          Relevansi & Peran Kunci HR / Personalia:
                        </span>
                        <p className="text-xs text-emerald-900 leading-relaxed">
                          {iso.hrRelevance}
                        </p>
                      </div>

                      {/* Benefits Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                        {iso.benefits.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{b}</span>
                          </div>
                        ))}
                      </div>

                      {/* Toggle Details */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {iso.keyClauses.length} Klausul Spesifik & {iso.auditChecklist.length} Poin Audit
                        </span>

                        <button
                          type="button"
                          onClick={() => setExpandedIsoId(isExpanded ? null : iso.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Tutup Rincian Klausul' : 'Lihat Klausul & Checklist Audit'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded ISO Details Section */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-3 bg-emerald-50/20 border-t border-emerald-100 space-y-5">
                        
                        {/* 1. Key Clauses */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                            Klausul Kunci Terkait Manajemen SDM:
                          </span>

                          <div className="grid grid-cols-1 gap-2.5">
                            {iso.keyClauses.map((clause, cIdx) => (
                              <div key={cIdx} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                                    {clause.number}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900">
                                    {clause.name}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600">
                                  <strong className="text-slate-800">Persyaratan Standar: </strong>
                                  {clause.requirement}
                                </div>
                                <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-indigo-900 border border-slate-100">
                                  <strong>Tindakan Konkret HR: </strong>
                                  {clause.hrAction}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Audit Checklist */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            Checklist Kesiapan Audit Sertifikasi ISO untuk HR:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {iso.auditChecklist.map((item, chkIdx) => (
                              <li key={chkIdx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 3. Practical Tips */}
                        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/70 text-amber-950 text-xs flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block font-bold">Tips Praktis Penerapan di Perusahaan:</strong>
                            <span className="leading-snug">{iso.practicalTips}</span>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* 5. MODAL KALKULATOR REGULASI */}
      <RegulationCalculatorModal
        type={activeCalculator}
        onClose={() => setActiveCalculator(null)}
      />

    </div>
  );
};

export const PeraturanPerusahaanPage: React.FC = () => (
  <RegulasiHukumPage initialTab="peraturan_perusahaan" />
);

export const UndangUndangPage: React.FC = () => (
  <RegulasiHukumPage initialTab="undang_undang" />
);

export const StandarIsoPage: React.FC = () => (
  <RegulasiHukumPage initialTab="standar_iso" />
);

