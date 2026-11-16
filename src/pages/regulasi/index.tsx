import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Calculator,
  Copy,
  Check,
  ChevronRight,
  Printer,
  BookOpen,
  Scale,
  Award,
  X,
} from 'lucide-react';
import {
  RegulationMainTab,
  RegulationCategory,
  RegulationItem,
  CompanyRegulationChapter,
  IsoDomainCategory,
  IsoStandardItem,
} from './types';
import { RegulationCalculatorModal } from './regulation-calculator-modal';
import { Modal } from '../../components/ui/modal';
import { RouteLoadingIndicator } from '../../components/ui/route-loading-indicator';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
  PageHeaderSearch,
  PageHeaderSubbar,
} from '../../context/mobile-nav-context';
import { scrollToTop } from '../../components/layout/scroll-to-top';

const REGULATION_CATEGORIES_META: { id: RegulationCategory; label: string }[] = [
  { id: 'ALL', label: 'Semua Regulasi' },
  { id: 'KONTRAK_PKWT_PKWTT', label: 'Kontrak Kerja (PKWT / PKWTT)' },
  { id: 'KOMPENSASI_PESANGON', label: 'Kompensasi PKWT & Pesangon PHK' },
  { id: 'SURAT_PERINGATAN_DISIPLIN', label: 'Surat Peringatan (SP) & Sanksi' },
  { id: 'JAM_KERJA_LEMBUR', label: 'Waktu Kerja & Upah Lembur' },
  { id: 'PENGUPAHAN_THR', label: 'Upah Minimum & THR Keagamaan' },
  { id: 'BPJS_JAMINAN_SOSIAL', label: 'BPJS Ketenagakerjaan & Kesehatan' },
  { id: 'CUTI_ISTIRAHAT_IZIN', label: 'Hak Cuti & Izin Resmi' },
];

const ISO_DOMAINS_META: { id: IsoDomainCategory; label: string }[] = [
  { id: 'ALL', label: 'Semua Standar ISO' },
  { id: 'HRM_TALENT_DIVERSITY', label: 'Human Resource Management & D&I' },
  { id: 'MUTU_OPERASIONAL', label: 'Mutu & Manajemen Organisasi' },
  { id: 'K3_LINGKUNGAN', label: 'K3 & Lingkungan Kerja' },
  { id: 'KEAMANAN_DATA_ETIKA', label: 'Keamanan Informasi & Anti Penyuapan' },
  { id: 'KELANGSUNGAN_BISNIS', label: 'Kelangsungan Bisnis & Resiliensi' },
];

interface RegulasiHukumPageProps {
  initialTab?: RegulationMainTab;
}

export const RegulasiHukumPage: React.FC<RegulasiHukumPageProps> = ({ initialTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const [activeMainTab, setActiveMainTab] = useState<RegulationMainTab>(getInitialTab);

  useEffect(() => {
    setActiveMainTab(getInitialTab());
  }, [location.pathname, searchParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedLawCategory, setSelectedLawCategory] = useState<RegulationCategory>('ALL');
  const [selectedCompanyChapterId, setSelectedCompanyChapterId] = useState<string>('ALL');
  const [selectedIsoDomain, setSelectedIsoDomain] = useState<IsoDomainCategory>('ALL');
  const hasActiveFilter =
    (activeMainTab === 'peraturan_perusahaan' && selectedCompanyChapterId !== 'ALL') ||
    (activeMainTab === 'undang_undang' && selectedLawCategory !== 'ALL') ||
    (activeMainTab === 'standar_iso' && selectedIsoDomain !== 'ALL');

  const [selectedCompanyChapter, setSelectedCompanyChapter] = useState<CompanyRegulationChapter | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<RegulationItem | null>(null);
  const [selectedIso, setSelectedIso] = useState<IsoStandardItem | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCalculator, setActiveCalculator] = useState<'pkwt_compensation' | 'severance' | 'overtime' | 'bpjs' | null>(null);

  const [companyRegulations, setCompanyRegulations] = useState<CompanyRegulationChapter[] | null>(null);
  const [lawRegulations, setLawRegulations] = useState<RegulationItem[] | null>(null);
  const [isoStandards, setIsoStandards] = useState<IsoStandardItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (activeMainTab === 'peraturan_perusahaan' && companyRegulations === null) {
      import('./company-regulation-data').then((m) => {
        if (!cancelled) setCompanyRegulations(m.COMPANY_REGULATION_DATA);
      });
    } else if (activeMainTab === 'undang_undang' && lawRegulations === null) {
      import('./regulation-data').then((m) => {
        if (!cancelled) setLawRegulations(m.REGULATION_DATA);
      });
    } else if (activeMainTab === 'standar_iso' && isoStandards === null) {
      import('./iso-standards-data').then((m) => {
        if (!cancelled) setIsoStandards(m.ISO_STANDARDS_DATA);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [activeMainTab, companyRegulations, lawRegulations, isoStandards]);

  const filteredCompanyRegulations = useMemo(() => {
    if (activeMainTab !== 'peraturan_perusahaan' || !companyRegulations) return [];
    return companyRegulations.filter((chapter) => {
      if (selectedCompanyChapterId !== 'ALL' && chapter.id !== selectedCompanyChapterId) {
        return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchChapterTitle =
        chapter.title.toLowerCase().includes(q) || chapter.chapterNumber.toLowerCase().includes(q);
      const matchDescription = chapter.description.toLowerCase().includes(q);
      const matchArticles = chapter.articles.some(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.content.toLowerCase().includes(q) ||
          (art.legalReference && art.legalReference.toLowerCase().includes(q)) ||
          (art.hrImplementationNote && art.hrImplementationNote.toLowerCase().includes(q))
      );

      return matchChapterTitle || matchDescription || matchArticles;
    });
  }, [activeMainTab, companyRegulations, selectedCompanyChapterId, searchQuery]);

  const filteredLaws = useMemo(() => {
    if (activeMainTab !== 'undang_undang' || !lawRegulations) return [];
    return lawRegulations.filter((item) => {
      const matchCategory = selectedLawCategory === 'ALL' || item.category === selectedLawCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchLawBasis = item.lawBasis.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchArticles = item.articles.some(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.number.toLowerCase().includes(q) ||
          a.fullText.toLowerCase().includes(q)
      );

      return matchTitle || matchCode || matchLawBasis || matchSummary || matchTags || matchArticles;
    });
  }, [activeMainTab, lawRegulations, selectedLawCategory, searchQuery]);

  const filteredIsoStandards = useMemo(() => {
    if (activeMainTab !== 'standar_iso' || !isoStandards) return [];
    return isoStandards.filter((iso) => {
      const matchDomain = selectedIsoDomain === 'ALL' || iso.domain === selectedIsoDomain;
      if (!matchDomain) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchCode = iso.code.toLowerCase().includes(q);
      const matchName = iso.name.toLowerCase().includes(q);
      const matchIdTitle = iso.indonesianTitle.toLowerCase().includes(q);
      const matchSummary = iso.summary.toLowerCase().includes(q);
      const matchHr = iso.hrRelevance.toLowerCase().includes(q);
      const matchClauses = iso.keyClauses.some(
        (c) =>
          c.number.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.requirement.toLowerCase().includes(q) ||
          c.hrAction.toLowerCase().includes(q)
      );
      const matchChecklist = iso.auditChecklist.some((chk) => chk.toLowerCase().includes(q));

      return matchCode || matchName || matchIdTitle || matchSummary || matchHr || matchClauses || matchChecklist;
    });
  }, [activeMainTab, isoStandards, selectedIsoDomain, searchQuery]);

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

  const handleMainTabChange = (tab: RegulationMainTab) => {
    setSearchQuery('');
    setActiveMainTab(tab);

    const path = location.pathname;
    const isLegalPrefix = path.startsWith('/legal');
    const isDedicatedSubroute =
      path.includes('peraturan-perusahaan') ||
      path.includes('undang-undang') ||
      path.includes('standar-iso') ||
      path.includes('/iso');

    if (isDedicatedSubroute) {
      const routeSlug =
        tab === 'peraturan_perusahaan'
          ? 'peraturan-perusahaan'
          : tab === 'undang_undang'
            ? 'undang-undang'
            : 'standar-iso';
      navigate(`${isLegalPrefix ? '/legal' : '/regulasi'}/${routeSlug}`);
    } else {
      const tabSlug =
        tab === 'peraturan_perusahaan' ? 'pp' : tab === 'undang_undang' ? 'uu' : 'iso';
      setSearchParams({ tab: tabSlug }, { replace: true });
    }
    scrollToTop();
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
          searchQuery || hasActiveFilter
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari Regulasi & Standar"
      >
        <Search className="w-4 h-4" />
        {(searchQuery || hasActiveFilter) && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setActiveCalculator('pkwt_compensation')}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Kalkulator Kompensasi PKWT"
      >
        <Calculator className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Kompensasi</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveCalculator('severance')}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Kalkulator Pesangon PHK"
      >
        <Calculator className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Pesangon</span>
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg shadow-2xs flex items-center justify-center transition-all cursor-pointer"
        title="Cetak Regulasi"
      >
        <Printer className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-5">
      <PageHeaderTitle title={headerMeta.title} subtitle={headerMeta.subtitle} />

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
          onFilterClick={() => setIsFilterModalOpen(true)}
          isFilterActive={hasActiveFilter}
        />
      )}

      {/* Top Page Subbar Navigation for Regulasi */}
      <PageHeaderSubbar>
        <div className="flex items-center justify-between w-full px-3.5 md:px-8 overflow-x-auto no-scrollbar">
          {([
            { id: 'peraturan_perusahaan' as const, label: 'Peraturan Perusahaan', icon: BookOpen },
            { id: 'undang_undang' as const, label: 'Undang-Undang', icon: Scale },
            { id: 'standar_iso' as const, label: 'Standar ISO', icon: Award },
          ]).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleMainTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer px-2 text-center shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                    isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
                  }`}
                />
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
                )}
              </button>
            );
          })}
        </div>
      </PageHeaderSubbar>

      {/* Main Content */}
      <div className="space-y-4">
        {/* TAB 1: PERATURAN PERUSAHAAN */}
        {activeMainTab === 'peraturan_perusahaan' && (
          <div className="space-y-4">
            {/* Light Crisp Summary Header Card */}
            <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Format Standar Peraturan Perusahaan (PP)
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Kompilasi Draf Naskah Peraturan Perusahaan untuk HR
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Disusun lengkap 11 Bab memuat 29 Pasal berpedoman pada UU Ketenagakerjaan No. 13/2003 jo. UU Cipta Kerja No. 6/2023 & PP No. 35/2021 sebagai rujukan Employee Handbook.
                </p>
                <div className="pt-1 text-[11px] text-slate-400 font-medium">
                  Wajib bagi perusahaan ≥ 10 pekerja · Masa berlaku pengesahan Disnaker 2 Tahun
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <Link
                  to="/kontrak"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs text-center"
                >
                  Buat Kontrak Kerja Baru
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const fullPPText = (companyRegulations || [])
                      .map(
                        (ch) =>
                          `========================================\n${ch.chapterNumber}: ${ch.title}\n========================================\n${ch.articles
                            .map(
                              (a) =>
                                `PASAL ${a.number}: ${a.title}\n${a.content}\n[Rujukan: ${a.legalReference || '-'}]\n`
                            )
                            .join('\n')}`
                      )
                      .join('\n\n');
                    handleCopyText('full-pp-copy', fullPPText);
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors border border-slate-200 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'full-pp-copy' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Naskah Lengkap Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin Seluruh Naskah PP</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {companyRegulations === null ? (
              <RouteLoadingIndicator showDelayMs={100} />
            ) : filteredCompanyRegulations.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">
                  Tidak ditemukan pasal Peraturan Perusahaan yang cocok
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba kata kunci lain seperti "waktu kerja", "cuti tahunan", "SP 1", "pesangon", atau reset filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCompanyChapterId('ALL');
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredCompanyRegulations.map((chapter) => {
                  const firstPasal = chapter.articles[0]?.number;
                  const lastPasal = chapter.articles[chapter.articles.length - 1]?.number;
                  const pasalRange =
                    firstPasal !== undefined
                      ? lastPasal !== undefined && lastPasal !== firstPasal
                        ? `Pasal ${firstPasal}–${lastPasal}`
                        : `Pasal ${firstPasal}`
                      : `${chapter.articles.length} Pasal`;

                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => setSelectedCompanyChapter(chapter)}
                      className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-4.5 text-left flex items-center justify-between gap-3.5 shadow-2xs hover:border-blue-300 hover:bg-slate-50/50 transition-all cursor-pointer group"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-slate-500 truncate">
                          {chapter.chapterNumber} · {pasalRange}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {chapter.description}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UNDANG-UNDANG & PP */}
        {activeMainTab === 'undang_undang' && (
          <div className="space-y-4">
            {/* Light Crisp Summary Header Card */}
            <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Dasar Hukum Ketenagakerjaan Indonesia
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Kompilasi Undang-Undang & Peraturan Pemerintah Berlaku
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Rujukan UU No. 6/2023 (Cipta Kerja), UU No. 13/2003, PP No. 35/2021 (PKWT & PHK), PP No. 36/2021 (Pengupahan), UU No. 24/2011 (BPJS), serta UU KIA No. 4/2024.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveCalculator('pkwt_compensation')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  Kalkulator Kompensasi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCalculator('overtime')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors border border-slate-200 cursor-pointer"
                >
                  Kalkulator Lembur
                </button>
              </div>
            </div>

            {lawRegulations === null ? (
              <RouteLoadingIndicator showDelayMs={100} />
            ) : filteredLaws.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">
                  Tidak ada topik regulasi UU yang sesuai pencarian
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba kata kunci lain seperti "PKWT", "pesangon", "lembur", "BPJS", atau reset kategori.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLawCategory('ALL');
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredLaws.map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setSelectedLaw(reg)}
                    className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-4.5 text-left flex items-center justify-between gap-3.5 shadow-2xs hover:border-blue-300 hover:bg-slate-50/50 transition-all cursor-pointer group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-slate-500 truncate">
                        {reg.lawBasis}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {reg.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {reg.summary}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STANDAR ISO */}
        {activeMainTab === 'standar_iso' && (
          <div className="space-y-4">
            {/* Light Crisp Summary Header Card */}
            <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Standar Internasional Organisasi & SDM
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Ensiklopedia Standar ISO & Pedoman Audit Kepatuhan HR
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Referensi standar ISO lintas bidang: Manajemen Mutu (9001), K3 (45001), Keamanan Informasi (27001), Diversity & Inclusion (30415), Anti Penyuapan (37001), Rekrutmen (30405), dan Kelangsungan Bisnis (22301).
                </p>
              </div>

              <div className="shrink-0 md:text-right">
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {isoStandards ? isoStandards.length : 11} Standar
                </div>
                <div className="text-[11px] text-slate-400">Tersedia checklist audit HR</div>
              </div>
            </div>

            {isoStandards === null ? (
              <RouteLoadingIndicator showDelayMs={100} />
            ) : filteredIsoStandards.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">
                  Tidak ada Standar ISO yang sesuai pencarian
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba kata kunci lain seperti "9001", "K3", "security", "diversity", atau reset domain.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIsoDomain('ALL');
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredIsoStandards.map((iso) => (
                  <button
                    key={iso.id}
                    type="button"
                    onClick={() => setSelectedIso(iso)}
                    className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-4.5 text-left flex items-center justify-between gap-3.5 shadow-2xs hover:border-blue-300 hover:bg-slate-50/50 transition-all cursor-pointer group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-slate-500 truncate">
                        {iso.code} · {iso.domainLabel}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {iso.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {iso.summary}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Detail Peraturan Perusahaan */}
      <Modal
        isOpen={Boolean(selectedCompanyChapter)}
        onClose={() => setSelectedCompanyChapter(null)}
        contentClassName="sm:max-w-2xl"
      >
        {selectedCompanyChapter && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-start gap-3 p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {selectedCompanyChapter.chapterNumber} · {selectedCompanyChapter.articles.length} Pasal
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mt-0.5">
                  {selectedCompanyChapter.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {selectedCompanyChapter.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompanyChapter(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Tutup"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto min-h-0 space-y-3 text-xs">
              {selectedCompanyChapter.articles.map((art) => {
                const articleCopyId = `art-${selectedCompanyChapter.id}-${art.number}`;
                const isCopied = copiedId === articleCopyId;

                return (
                  <div
                    key={art.number}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Pasal {art.number}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          {art.title}
                        </h4>
                        {art.legalReference && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Rujukan Hukum: {art.legalReference}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const textToCopy = `[KUTIPAN PERATURAN PERUSAHAAN]\n${selectedCompanyChapter.chapterNumber}: ${selectedCompanyChapter.title}\nPASAL ${art.number}: ${art.title}\n\n${art.content}\n\nDasar Rujukan: ${art.legalReference || '-'}`;
                          handleCopyText(articleCopyId, textToCopy);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Salin teks pasal ke clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {art.content}
                    </div>

                    {art.hrImplementationNote && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-600 space-y-0.5">
                        <div className="font-semibold text-slate-800 text-[11px]">
                          Petunjuk Implementasi HR
                        </div>
                        <div className="leading-relaxed">{art.hrImplementationNote}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setSelectedCompanyChapter(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Detail Undang-Undang */}
      <Modal
        isOpen={Boolean(selectedLaw)}
        onClose={() => setSelectedLaw(null)}
        contentClassName="sm:max-w-2xl"
      >
        {selectedLaw && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-start gap-3 p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-medium text-slate-500">
                  {selectedLaw.code} · {selectedLaw.categoryLabel}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mt-0.5">
                  {selectedLaw.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedLaw.lawBasis}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => {
                    const textToCopy = `[DASAR HUKUM HR]\n${selectedLaw.title}\nDasar Regulasi: ${selectedLaw.lawBasis}\n\nPoin Kunci:\n${selectedLaw.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nRujukan Pasal:\n${selectedLaw.articles.map((a) => `${a.number} - ${a.title}:\n"${a.summary}"`).join('\n\n')}\n\nSumber: HRMatrix Legal Compliance Hub`;
                    handleCopyText(selectedLaw.id, textToCopy);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Salin ringkasan dasar hukum"
                >
                  {copiedId === selectedLaw.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                {selectedLaw.calculatorType && (
                  <button
                    type="button"
                    onClick={() => {
                      const calcType = selectedLaw.calculatorType!;
                      setSelectedLaw(null);
                      setActiveCalculator(calcType);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Buka Kalkulator Simulasi"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedLaw(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Tutup"
                  aria-label="Tutup Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto min-h-0 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">{selectedLaw.summary}</p>

              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Poin Kunci Ketentuan Hukum
                </span>
                <ul className="space-y-1.5 text-slate-700">
                  {selectedLaw.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-[11px] text-slate-400 shrink-0 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Bunyi Pasal Resmi & Pedoman Praktis HR
                  </span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {selectedLaw.articles.length} Pasal
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedLaw.articles.map((art, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-4 bg-white rounded-xl border border-slate-200/90 space-y-2.5"
                    >
                      <div>
                        <div className="text-[11px] font-mono font-semibold text-slate-500">
                          {art.number}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                          {art.title}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-slate-700 leading-relaxed whitespace-pre-line">
                        {art.fullText}
                      </div>

                      {(art.importantNote || art.practicalHRTip) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-0.5">
                          {art.importantNote && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-600 space-y-0.5">
                              <strong className="block text-[11px] font-semibold text-slate-800">
                                Catatan Kepatuhan
                              </strong>
                              <span className="leading-snug block">{art.importantNote}</span>
                            </div>
                          )}
                          {art.practicalHRTip && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-600 space-y-0.5">
                              <strong className="block text-[11px] font-semibold text-slate-800">
                                Panduan Praktis HR
                              </strong>
                              <span className="leading-snug block">{art.practicalHRTip}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedLaw.penaltiesOrRisks && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                    Risiko & Sanksi Kepatuhan
                  </span>
                  <p className="leading-relaxed text-slate-600">{selectedLaw.penaltiesOrRisks}</p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setSelectedLaw(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Detail Standar ISO */}
      <Modal
        isOpen={Boolean(selectedIso)}
        onClose={() => setSelectedIso(null)}
        contentClassName="sm:max-w-2xl"
      >
        {selectedIso && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-start gap-3 p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-medium text-slate-500">
                  {selectedIso.code} · {selectedIso.domainLabel}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mt-0.5">
                  {selectedIso.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedIso.indonesianTitle}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => {
                    const textToCopy = `[STANDAR INTERNASIONAL ISO]\n${selectedIso.code}: ${selectedIso.name}\nJudul: ${selectedIso.indonesianTitle}\n\nRingkasan:\n${selectedIso.summary}\n\nRelevansi bagi HR:\n${selectedIso.hrRelevance}\n\nChecklist Audit HR:\n${selectedIso.auditChecklist.map((c) => `[ ] ${c}`).join('\n')}\n\nTips Implementasi:\n${selectedIso.practicalTips}`;
                    handleCopyText(selectedIso.id, textToCopy);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Salin ringkasan standar ISO"
                >
                  {copiedId === selectedIso.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIso(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Tutup"
                  aria-label="Tutup Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto min-h-0 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">{selectedIso.summary}</p>

              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Relevansi & Peran HR / Personalia
                </span>
                <p className="text-slate-600 leading-relaxed">{selectedIso.hrRelevance}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Manfaat Implementasi
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  {selectedIso.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="font-mono text-[11px] text-slate-400 shrink-0 tabular-nums">
                        {String(bIdx + 1).padStart(2, '0')}.
                      </span>
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Klausul Kunci Manajemen SDM
                </span>
                <div className="space-y-2.5">
                  {selectedIso.keyClauses.map((clause, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-2"
                    >
                      <div>
                        <div className="text-[11px] font-mono font-semibold text-slate-500">
                          {clause.number}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                          {clause.name}
                        </div>
                      </div>
                      <div className="text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Persyaratan Standar: </strong>
                        {clause.requirement}
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-200/70 leading-relaxed">
                        <strong className="text-slate-800">Tindakan Konkret HR: </strong>
                        {clause.hrAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Checklist Kesiapan Audit ISO untuk HR
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  {selectedIso.auditChecklist.map((item, chkIdx) => (
                    <li key={chkIdx} className="flex items-start gap-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-400 shrink-0 tabular-nums">
                        {String(chkIdx + 1).padStart(2, '0')}.
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-600 space-y-0.5">
                <strong className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  Tips Praktis Penerapan
                </strong>
                <span className="leading-relaxed block">{selectedIso.practicalTips}</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setSelectedIso(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      <RegulationCalculatorModal
        type={activeCalculator}
        onClose={() => setActiveCalculator(null)}
      />

      {/* Filter Regulasi Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        contentClassName="sm:max-w-md"
        hideBottomNav={false}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0">
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                {activeMainTab === 'peraturan_perusahaan'
                  ? 'Filter Bab Peraturan'
                  : activeMainTab === 'undang_undang'
                    ? 'Filter Kategori Regulasi'
                    : 'Filter Domain Standar ISO'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Saring pasal & standar yang ditampilkan
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-2 text-xs font-semibold">
            {activeMainTab === 'peraturan_perusahaan' && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedCompanyChapterId('ALL')}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedCompanyChapterId === 'ALL'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Semua Bab Peraturan Perusahaan
                </button>
                {(companyRegulations || []).map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedCompanyChapterId(ch.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCompanyChapterId === ch.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {ch.chapterNumber}: {ch.title}
                  </button>
                ))}
              </>
            )}

            {activeMainTab === 'undang_undang' &&
              REGULATION_CATEGORIES_META.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedLawCategory(cat.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedLawCategory === cat.id
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}

            {activeMainTab === 'standar_iso' &&
              ISO_DOMAINS_META.map((dom) => (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => setSelectedIsoDomain(dom.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedIsoDomain === dom.id
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {dom.label}
                </button>
              ))}
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white space-y-2">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Terapkan Filter
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  if (activeMainTab === 'peraturan_perusahaan') setSelectedCompanyChapterId('ALL');
                  else if (activeMainTab === 'undang_undang') setSelectedLawCategory('ALL');
                  else setSelectedIsoDomain('ALL');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </Modal>
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
