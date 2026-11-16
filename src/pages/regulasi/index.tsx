import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Search,
  Calculator,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Printer,
} from 'lucide-react';
import {
  RegulationMainTab,
  RegulationCategory,
  RegulationItem,
  CompanyRegulationChapter,
  IsoDomainCategory,
  IsoStandardItem,
} from './types';
import { RegulationCalculatorModal } from './modal-kalkulator-regulasi';
import { RouteLoadingIndicator } from '../../components/ui/route-loading-indicator';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
  PageHeaderSearch,
} from '../../context/mobile-nav-context';

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

  const [activeMainTab, setActiveMainTab] = useState<RegulationMainTab>(getInitialTab);

  useEffect(() => {
    setActiveMainTab(getInitialTab());
  }, [location.pathname, searchParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLawCategory, setSelectedLawCategory] = useState<RegulationCategory>('ALL');
  const [selectedCompanyChapterId, setSelectedCompanyChapterId] = useState<string>('ALL');
  const [selectedIsoDomain, setSelectedIsoDomain] = useState<IsoDomainCategory>('ALL');

  const [expandedLawId, setExpandedLawId] = useState<string | null>('reg-pkwt-rules');
  const [expandedCompanyChapterId, setExpandedCompanyChapterId] = useState<string | null>('bab-1');
  const [expandedIsoId, setExpandedIsoId] = useState<string | null>('iso-30415-2021');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCalculator, setActiveCalculator] = useState<'pkwt_compensation' | 'severance' | 'overtime' | 'bpjs' | null>(null);

  const [companyRegulations, setCompanyRegulations] = useState<CompanyRegulationChapter[] | null>(null);
  const [lawRegulations, setLawRegulations] = useState<RegulationItem[] | null>(null);
  const [isoStandards, setIsoStandards] = useState<IsoStandardItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (activeMainTab === 'peraturan_perusahaan' && companyRegulations === null) {
      import('./data-peraturan-perusahaan').then((m) => {
        if (!cancelled) setCompanyRegulations(m.COMPANY_REGULATION_DATA);
      });
    } else if (activeMainTab === 'undang_undang' && lawRegulations === null) {
      import('./data-regulasi').then((m) => {
        if (!cancelled) setLawRegulations(m.REGULATION_DATA);
      });
    } else if (activeMainTab === 'standar_iso' && isoStandards === null) {
      import('./data-standar-iso').then((m) => {
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
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari Regulasi & Standar"
      >
        <Search className="w-4 h-4" />
        {searchQuery && (
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
        />
      )}

      {/* Primary Underline Tabs & Sub-Filter Strip */}
      <div className="space-y-3">
        <div className="flex border-b border-slate-200 gap-5 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('peraturan_perusahaan');
              setSearchQuery('');
            }}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeMainTab === 'peraturan_perusahaan'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Peraturan Perusahaan
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('undang_undang');
              setSearchQuery('');
            }}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeMainTab === 'undang_undang'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Undang-Undang
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('standar_iso');
              setSearchQuery('');
            }}
            className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeMainTab === 'standar_iso'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Standar ISO
          </button>
        </div>

        {/* Sub-Filter Horizontal Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {activeMainTab === 'peraturan_perusahaan' && (
            <>
              <button
                type="button"
                onClick={() => setSelectedCompanyChapterId('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap border ${
                  selectedCompanyChapterId === 'ALL'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                Semua Bab
              </button>
              {(companyRegulations || []).map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedCompanyChapterId(ch.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap border ${
                    selectedCompanyChapterId === ch.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {ch.chapterNumber}: {ch.title.split('&')[0]}
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap border ${
                  selectedLawCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap border ${
                  selectedIsoDomain === dom.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {dom.label}
              </button>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* TAB 1: PERATURAN PERUSAHAAN */}
        {activeMainTab === 'peraturan_perusahaan' && (
          <div className="space-y-4">
            {/* Light Crisp Summary Header Card */}
            <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                  Format Standar Peraturan Perusahaan (PP)
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Kompilasi Draf Naskah Peraturan Perusahaan untuk HR
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Disusun lengkap 11 Bab memuat 29 Pasal berpedoman pada UU Ketenagakerjaan No. 13/2003 jo. UU Cipta Kerja No. 6/2023 & PP No. 35/2021 sebagai rujukan Employee Handbook.
                </p>
                <div className="pt-1 text-[11px] text-slate-500 font-medium">
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
              <div className="space-y-3">
                {filteredCompanyRegulations.map((chapter) => {
                  const isExpanded = expandedCompanyChapterId === chapter.id;

                  return (
                    <div
                      key={chapter.id}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs ${
                        isExpanded ? 'border-blue-300' : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedCompanyChapterId(isExpanded ? null : chapter.id)}
                        className="w-full text-left p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium text-blue-600">
                            {chapter.chapterNumber} · {chapter.articles.length} Pasal
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 leading-snug">
                            {chapter.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {chapter.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center text-xs font-semibold text-blue-600">
                          <span>{isExpanded ? 'Tutup Bab' : 'Buka Pasal'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40 space-y-3">
                          {chapter.articles.map((art) => {
                            const articleCopyId = `art-${chapter.id}-${art.number}`;
                            const isCopied = copiedId === articleCopyId;

                            return (
                              <div
                                key={art.number}
                                className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-3"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                                  <div>
                                    <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                                      Pasal {art.number}
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                                      {art.title}
                                    </h4>
                                    {art.legalReference && (
                                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                        Rujukan Hukum: {art.legalReference}
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textToCopy = `[KUTIPAN PERATURAN PERUSAHAAN]\n${chapter.chapterNumber}: ${chapter.title}\nPASAL ${art.number}: ${art.title}\n\n${art.content}\n\nDasar Rujukan: ${art.legalReference || '-'}`;
                                      handleCopyText(articleCopyId, textToCopy);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer self-start shrink-0"
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
                                        <span>Kutip Pasal</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                                  {art.content}
                                </div>

                                {art.hrImplementationNote && (
                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 text-xs space-y-0.5">
                                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                                      Petunjuk Implementasi HR
                                    </div>
                                    <div className="leading-relaxed">{art.hrImplementationNote}</div>
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
            )}
          </div>
        )}

        {/* TAB 2: UNDANG-UNDANG & PP */}
        {activeMainTab === 'undang_undang' && (
          <div className="space-y-4">
            {/* Light Crisp Summary Header Card */}
            <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
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
              <div className="space-y-4">
                {filteredLaws.map((reg) => {
                  const isExpanded = expandedLawId === reg.id;
                  const isCopied = copiedId === reg.id;

                  return (
                    <div
                      key={reg.id}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs ${
                        isExpanded ? 'border-blue-300' : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <div className="p-4 sm:p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-[11px] font-medium text-slate-500">
                            <span className="font-mono font-semibold text-blue-600">{reg.code}</span>
                            {' · '}
                            {reg.categoryLabel}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const textToCopy = `[DASAR HUKUM HR]\n${reg.title}\nDasar Regulasi: ${reg.lawBasis}\n\nPoin Kunci:\n${reg.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nRujukan Pasal:\n${reg.articles.map((a) => `${a.number} - ${a.title}:\n"${a.summary}"`).join('\n\n')}\n\nSumber: HRMatrix Legal Compliance Hub`;
                                handleCopyText(reg.id, textToCopy);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                              title="Salin ringkasan dasar hukum ke clipboard"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Tersalin</span>
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
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Calculator className="w-3.5 h-3.5" />
                                <span>Simulasi</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                            {reg.title}
                          </h3>
                          <p className="text-xs text-blue-600 font-medium mt-0.5">{reg.lawBasis}</p>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{reg.summary}</p>

                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2">
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                            Poin Kunci Ketentuan Hukum
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {reg.keyPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                                <span className="leading-snug">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                          <div className="text-[11px] text-slate-400 truncate max-w-full">
                            {reg.tags.join(' · ')}
                          </div>

                          <button
                            type="button"
                            onClick={() => setExpandedLawId(isExpanded ? null : reg.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer shrink-0"
                          >
                            <span>
                              {isExpanded
                                ? 'Tutup Teks Pasal'
                                : `Lihat ${reg.articles.length} Rujukan Pasal`}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 sm:px-5 pb-5 pt-3 bg-slate-50/60 border-t border-slate-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                              Bunyi Pasal Resmi & Pedoman Praktis HR
                            </span>
                            <span className="text-[11px] text-slate-500 tabular-nums">
                              {reg.articles.length} Pasal Terdaftar
                            </span>
                          </div>

                          <div className="space-y-3">
                            {reg.articles.map((art, aIdx) => (
                              <div
                                key={aIdx}
                                className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2.5"
                              >
                                <div>
                                  <div className="text-[11px] font-mono font-semibold text-blue-600">
                                    {art.number}
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                                    {art.title}
                                  </div>
                                </div>

                                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                                  {art.fullText}
                                </div>

                                {(art.importantNote || art.practicalHRTip) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                                    {art.importantNote && (
                                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 space-y-0.5">
                                        <strong className="block text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                                          Catatan Kritis Kepatuhan
                                        </strong>
                                        <span className="leading-snug block">{art.importantNote}</span>
                                      </div>
                                    )}
                                    {art.practicalHRTip && (
                                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 space-y-0.5">
                                        <strong className="block text-[11px] font-bold text-blue-700 uppercase tracking-wider">
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
                      )}
                    </div>
                  );
                })}
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
                <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
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
              <div className="space-y-4">
                {filteredIsoStandards.map((iso) => {
                  const isExpanded = expandedIsoId === iso.id;
                  const isCopied = copiedId === iso.id;

                  return (
                    <div
                      key={iso.id}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs ${
                        isExpanded ? 'border-blue-300' : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <div className="p-4 sm:p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-[11px] font-medium text-slate-500">
                            <span className="font-mono font-semibold text-blue-600">{iso.code}</span>
                            {' · '}
                            {iso.domainLabel}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const textToCopy = `[STANDAR INTERNASIONAL ISO]\n${iso.code}: ${iso.name}\nJudul: ${iso.indonesianTitle}\n\nRingkasan:\n${iso.summary}\n\nRelevansi bagi HR:\n${iso.hrRelevance}\n\nChecklist Audit HR:\n${iso.auditChecklist.map((c) => `[ ] ${c}`).join('\n')}\n\nTips Implementasi:\n${iso.practicalTips}`;
                              handleCopyText(iso.id, textToCopy);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                            title="Salin ringkasan standar ISO ke clipboard"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Tersalin</span>
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
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                            {iso.name}
                          </h3>
                          <p className="text-xs text-blue-600 font-medium mt-0.5">
                            {iso.indonesianTitle}
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{iso.summary}</p>

                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1">
                          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                            Relevansi & Peran HR / Personalia
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">{iso.hrRelevance}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-0.5">
                          {iso.benefits.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                              <span className="leading-snug">{b}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2.5 flex items-center justify-between border-t border-slate-100">
                          <span className="text-[11px] text-slate-400 font-medium tabular-nums">
                            {iso.keyClauses.length} Klausul · {iso.auditChecklist.length} Poin Audit
                          </span>

                          <button
                            type="button"
                            onClick={() => setExpandedIsoId(isExpanded ? null : iso.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <span>
                              {isExpanded
                                ? 'Tutup Rincian Klausul'
                                : 'Lihat Klausul & Checklist Audit'}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 sm:px-5 pb-5 pt-3 bg-slate-50/60 border-t border-slate-100 space-y-4">
                          <div className="space-y-2.5">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Klausul Kunci Manajemen SDM
                            </span>

                            <div className="grid grid-cols-1 gap-2.5">
                              {iso.keyClauses.map((clause, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2"
                                >
                                  <div>
                                    <div className="text-[11px] font-mono font-semibold text-blue-600">
                                      {clause.number}
                                    </div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                                      {clause.name}
                                    </div>
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    <strong className="text-slate-800">Persyaratan Standar: </strong>
                                    {clause.requirement}
                                  </div>
                                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200/70">
                                    <strong className="text-slate-900">Tindakan Konkret HR: </strong>
                                    {clause.hrAction}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2.5">
                            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                              Checklist Kesiapan Audit ISO untuk HR
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                              {iso.auditChecklist.map((item, chkIdx) => (
                                <li
                                  key={chkIdx}
                                  className="flex items-start gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100"
                                >
                                  <span className="font-mono text-[11px] font-semibold text-blue-600 shrink-0 tabular-nums">
                                    {String(chkIdx + 1).padStart(2, '0')}.
                                  </span>
                                  <span className="leading-snug">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 text-slate-700 text-xs space-y-0.5">
                            <strong className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                              Tips Praktis Penerapan
                            </strong>
                            <span className="leading-relaxed block">{iso.practicalTips}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

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
