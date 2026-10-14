import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Search,
  RotateCw,
  Lock,
  ExternalLink,
  LayoutGrid
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { CHECKING_TOOLS_CONFIG, CheckingToolMeta, CheckingCategory } from './checking-data';
import { CheckingToolsFAB } from './checking-tools-fab';
import { CheckingGuide } from './checking-guide';

export { CHECKING_TOOLS_CONFIG };
export type { CheckingToolMeta, CheckingCategory };

interface CheckingToolsMobileBottomNavProps {
  onBack: () => void;
  onOpenNewTab: () => void;
  onOpenGuide: () => void;
  onOpenDirectory: () => void;
  isGuideView: boolean;
  isDirectoryView: boolean;
}

export const CheckingToolsMobileBottomNav: React.FC<CheckingToolsMobileBottomNavProps> = ({
  onBack,
  onOpenNewTab,
  onOpenGuide,
  onOpenDirectory,
  isGuideView,
  isDirectoryView,
}) => {
  return (
    <nav
      aria-label="Navigasi Checking Tools Mobile"
      id="checking-tools-mobile-bottom-navigation"
      className="md:hidden w-full bg-white border-t border-slate-200 flex items-center justify-around px-1 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-16 shrink-0 transition-all duration-300 ease-in-out z-40 select-none"
    >
      {/* 1. Kembali (Ke Halaman Rekrutmen) */}
      <button
        type="button"
        onClick={onBack}
        id="bottom-nav-kembali-rekrutmen"
        className="flex flex-col items-center justify-center flex-1 py-1.5 transition-colors text-center cursor-pointer text-slate-500 hover:text-slate-900 active:text-blue-600 group"
        title="Kembali ke Rekrutmen"
      >
        <ArrowLeft className="w-5 h-5 mb-1 transition-transform group-hover:scale-105 active:-translate-x-0.5" />
        <span className="text-[10px] tracking-tight font-medium">Kembali</span>
      </button>

      {/* 2. Katalog Semua Alat */}
      <button
        type="button"
        onClick={onOpenDirectory}
        id="bottom-nav-katalog-alat"
        className={cn(
          "flex flex-col items-center justify-center flex-1 py-1.5 transition-colors text-center cursor-pointer group",
          isDirectoryView
            ? "text-blue-600 font-semibold"
            : "text-slate-500 hover:text-blue-600 active:text-blue-700"
        )}
        title="Pilih Alat Verifikasi Lainnya"
      >
        <LayoutGrid className={cn("w-5 h-5 mb-1 transition-transform", isDirectoryView ? "scale-110" : "group-hover:scale-105 active:scale-95")} />
        <span className="text-[10px] tracking-tight font-medium">Alat</span>
      </button>

      {/* 3. Buka di Tab Baru */}
      <button
        type="button"
        onClick={onOpenNewTab}
        id="bottom-nav-tab-baru-cek"
        className="flex flex-col items-center justify-center flex-1 py-1.5 transition-colors text-center cursor-pointer text-slate-500 hover:text-blue-600 active:text-blue-700 group"
        title="Buka Portal Resmi di Tab Baru"
      >
        <ExternalLink className="w-5 h-5 mb-1 transition-transform group-hover:scale-105 active:scale-95" />
        <span className="text-[10px] tracking-tight font-medium">Tab Baru</span>
      </button>

      {/* 4. Panduan SOP Verifikasi */}
      <button
        type="button"
        onClick={onOpenGuide}
        id="bottom-nav-panduan-cek"
        className={cn(
          "flex flex-col items-center justify-center flex-1 py-1.5 transition-colors text-center cursor-pointer group",
          isGuideView 
            ? "text-blue-600 font-semibold" 
            : "text-slate-500 hover:text-blue-600 active:text-blue-700"
        )}
        title={isGuideView ? "Kembali ke Tampilan Web" : "Panduan SOP"}
      >
        <BookOpen className={cn("w-5 h-5 mb-1 transition-transform", isGuideView ? "scale-110" : "group-hover:scale-105 active:scale-95")} />
        <span className="text-[10px] tracking-tight font-medium">Panduan</span>
      </button>
    </nav>
  );
};

export const CheckingToolsPage: React.FC = () => {
  const { toolId } = useParams<{ toolId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const allToolsList = useMemo(() => Object.values(CHECKING_TOOLS_CONFIG), []);

  // Determine current active tool
  const activeToolKey = useMemo(() => {
    if (toolId && CHECKING_TOOLS_CONFIG[toolId.toLowerCase()]) {
      return toolId.toLowerCase();
    }
    
    // Check path matches
    for (const key of Object.keys(CHECKING_TOOLS_CONFIG)) {
      if (location.pathname.includes(`/checking-tools/${key}`) || location.pathname.includes(`/screening/checking-tools/${key}`)) {
        return key;
      }
    }

    // Default to 'sivil' (Perguruan Tinggi) or first tool
    return 'sivil';
  }, [toolId, location.pathname]);

  const [activeKey, setActiveKey] = useState<string>(activeToolKey);

  useEffect(() => {
    setActiveKey(activeToolKey);
  }, [activeToolKey]);

  const activeTool = CHECKING_TOOLS_CONFIG[activeKey] || allToolsList[0];

  // View mode: 'portal' (live embedded iframe) | 'guide' (full-page intensive TSX guide) | 'directory' (clean directory of tools)
  const [viewMode, setViewMode] = useState<'portal' | 'guide' | 'directory'>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('view') === 'panduan' || searchParams.get('guide') === 'true' || window.location.pathname.endsWith('/panduan')) {
      return 'guide';
    }
    if (window.location.pathname === '/checking-tools' && !toolId && searchParams.get('dir') === 'true') {
      return 'directory';
    }
    return 'portal';
  });

  // Keep viewMode synced with search parameters if user navigates
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('view') === 'panduan' || searchParams.get('guide') === 'true' || location.pathname.endsWith('/panduan')) {
      setViewMode('guide');
    }
  }, [location.search, location.pathname]);

  // Iframe states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Search in directory view
  const [dirSearchQuery, setDirSearchQuery] = useState('');
  const [dirCategoryFilter, setDirCategoryFilter] = useState<'all' | CheckingCategory>('all');

  // Compute live proxy URL to bypass X-Frame-Options and CORS limitations
  const proxyUrl = useMemo(() => {
    return `/api/proxy-portal?portal=${encodeURIComponent(activeKey)}`;
  }, [activeKey]);

  // When active checking tool changes, reset iframe loading & error states
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(false);
    setIframeKey(prev => prev + 1);

    // Probe if proxy is responding with real portal or if it's falling back to SPA html (e.g. static host without serverless proxy)
    const checkProxy = async () => {
      try {
        const res = await fetch(proxyUrl, { method: 'GET', headers: { 'Accept': 'text/html' } });
        if (!isMounted) return;
        if (!res.ok) {
          setLoadError(true);
          setIsLoading(false);
          return;
        }
        const text = await res.text();
        if (!isMounted) return;
        // If the response is the SPA's index.html (e.g. static hosting rewrite returning 404)
        if (text.includes('id="root"') && (text.includes('/src/main.tsx') || text.includes('dist/assets') || text.includes('Tidak Ditemukan') || text.includes('404'))) {
          setLoadError(true);
          setIsLoading(false);
          return;
        }
        // Proxy is active and responding
        setIsLoading(false);
      } catch {
        if (!isMounted) return;
        setLoadError(true);
        setIsLoading(false);
      }
    };

    checkProxy();

    // Timeout safety for iframe response
    const timer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 4500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [proxyUrl]);

  const handleSelectTool = (key: string, targetView: 'portal' | 'guide' = 'portal') => {
    setActiveKey(key);
    setViewMode(targetView);
    navigate(`/checking-tools/${key}`, { replace: true });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setLoadError(false);
    setIframeKey(prev => prev + 1);
    if (iframeRef.current) {
      iframeRef.current.src = proxyUrl;
    }
  };

  const handleOpenNewTab = () => {
    window.open(activeTool.officialUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGuide = () => {
    if (viewMode === 'guide') {
      setViewMode('portal');
    } else {
      setViewMode('guide');
    }
  };

  const handleOpenDirectory = () => {
    if (viewMode === 'directory') {
      setViewMode('portal');
    } else {
      setViewMode('directory');
    }
  };

  const handleBack = () => {
    navigate('/screening');
  };

  // Filter tools for directory mode
  const filteredToolsForDirectory = useMemo(() => {
    const q = dirSearchQuery.toLowerCase().trim();
    return allToolsList.filter(t => {
      if (dirCategoryFilter !== 'all' && t.category !== dirCategoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.instansi.toLowerCase().includes(q) ||
        t.targetVerifikasi.toLowerCase().includes(q) ||
        t.keywords.some(k => k.toLowerCase().includes(q))
      );
    });
  }, [allToolsList, dirSearchQuery, dirCategoryFilter]);

  // 1. TAMPILAN PANDUAN SOP VERIFIKASI (Full-Page TSX Berdasarkan Tool Aktif - Clean & Headerless)
  if (viewMode === 'guide') {
    return (
      <div className="w-full h-full overflow-hidden bg-slate-50 relative select-auto flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <CheckingGuide
            tool={activeTool}
            onBackToPortal={() => setViewMode('portal')}
          />
        </div>

        {/* Floating Action Button (FAB) - Desktop only */}
        <CheckingToolsFAB
          activeTool={activeTool}
          isGuideView={true}
          isDirectoryView={false}
          onOpenGuide={handleOpenGuide}
          onOpenNewTab={handleOpenNewTab}
          onOpenDirectory={handleOpenDirectory}
          onBack={handleBack}
          className="hidden md:flex"
        />

        {/* Mobile Bottom Navigation */}
        <CheckingToolsMobileBottomNav
          onBack={handleBack}
          onOpenNewTab={handleOpenNewTab}
          onOpenGuide={handleOpenGuide}
          onOpenDirectory={handleOpenDirectory}
          isGuideView={true}
          isDirectoryView={false}
        />
      </div>
    );
  }

  // 2. TAMPILAN DIREKTORI KATALOG (Clean Headerless Portal Hub)
  if (viewMode === 'directory') {
    return (
      <div className="w-full h-full overflow-hidden bg-slate-50 select-auto flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 pb-10">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Card (Clean Content Box, Not a Sticky Nav Header) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider border border-blue-200">
                    Checking Tools Hub
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {allToolsList.length} Lembaga Resmi Terintegrasi
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Pilih Alat Verifikasi & Background Checking
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                  Validasi keaslian ijazah, riwayat kredit SLIK OJK, sertifikat BNSP, status NIK, SKCK, hingga perkara hukum calon kandidat.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTool(activeTool.id, 'portal')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Sematan ({activeTool.shortName})</span>
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto">
                {[
                  { id: 'all', label: `Semua (${allToolsList.length})` },
                  { id: 'akademik', label: 'Pendidikan & Profesi' },
                  { id: 'finansial', label: 'Finansial & Kredit' },
                  { id: 'identitas', label: 'Identitas & Pajak' },
                  { id: 'hukum', label: 'Hukum & Perkara' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDirCategoryFilter(cat.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap",
                      dirCategoryFilter === cat.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={dirSearchQuery}
                  onChange={(e) => setDirSearchQuery(e.target.value)}
                  placeholder="Cari alat / instansi / nomor..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200/90 rounded-2xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Grid Cards of Checking Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredToolsForDirectory.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                          {tool.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 leading-snug">
                            {tool.name}
                          </h3>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {tool.instansi}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                        {tool.categoryLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tool.deskripsi}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] space-y-1 text-slate-600">
                      <div className="text-blue-700 font-semibold leading-relaxed">
                        Validasi Resmi Berdasarkan {tool.dasarHukum}
                      </div>
                      <div>
                        <strong className="text-slate-800">Target Validasi:</strong> {tool.targetVerifikasi}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this tool card */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleSelectTool(tool.id, 'portal')}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
                    >
                      Buka di Sematan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTool(tool.id, 'guide')}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>SOP Panduan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Button (FAB) - Desktop only */}
        <CheckingToolsFAB
          activeTool={activeTool}
          isGuideView={false}
          isDirectoryView={true}
          onOpenGuide={handleOpenGuide}
          onOpenNewTab={handleOpenNewTab}
          onOpenDirectory={handleOpenDirectory}
          onBack={handleBack}
          className="hidden md:flex"
        />

        {/* Mobile Bottom Navigation */}
        <CheckingToolsMobileBottomNav
          onBack={handleBack}
          onOpenNewTab={handleOpenNewTab}
          onOpenGuide={handleOpenGuide}
          onOpenDirectory={handleOpenDirectory}
          isGuideView={false}
          isDirectoryView={true}
        />
      </div>
    );
  }

  // 3. TAMPILAN UTAMA CHECKING TOOLS SEMATAN (100% CLEAN, ZERO HEADER, ZERO TABS, FULL-BLEED VIEWPORT PERSIS SEPERTI EPORTAL)
  return (
    <div className="relative w-full h-full min-h-full flex-1 flex flex-col bg-slate-900 overflow-hidden select-none">
      {/* 
        NO HEADER BAR AT ALL!
        NO TABS!
        Directly the full live web page inside iframe, matching e-portal mechanism.
      */}

      {/* Main Full Web View Container (Optimized for Mobile Touch & Desktop) */}
      <div className="relative flex-1 w-full h-full bg-white overflow-hidden flex flex-col">
        {/* Loading Indicator Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center space-y-4 pointer-events-none transition-opacity duration-300">
            {/* Logo instansi di tengah dan diam */}
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/90 p-3 shadow-md flex items-center justify-center shrink-0 [&>svg]:w-9 [&>svg]:h-9 [&>img]:w-9 [&>img]:h-9">
              {activeTool.logo}
            </div>

            <div className="text-center px-4 max-w-lg space-y-1">
              <span className="text-sm font-bold text-slate-900 block">
                Membuka {activeTool.name}...
              </span>
              <span className="text-xs text-slate-500 block">
                Menghubungkan langsung ke sistem resmi {activeTool.instansi}
              </span>
              <span className="text-[11px] text-blue-700 font-semibold block pt-1 max-w-md mx-auto leading-relaxed">
                Verifikasi resmi berdasarkan {activeTool.dasarHukum}
              </span>
            </div>

            {/* Progress loading line warna biru di paling bawah halaman */}
            <div className="fixed bottom-0 left-0 right-0 z-50 h-1 sm:h-1.5 bg-blue-100/70 overflow-hidden pointer-events-none">
              <div 
                key={`progress-${activeKey}-${iframeKey}`}
                className="h-full bg-blue-600 animate-portal-progress-line rounded-r-full" 
              />
            </div>
          </div>
        )}

        {/* The Live Full-Page Iframe (Using Secure Proxy for CORS & Frame Protection Neutralization) */}
        <div className="relative flex-1 w-full h-full overflow-auto [-webkit-overflow-scrolling:touch]">
          <iframe
            key={`${activeKey}-${iframeKey}`}
            ref={iframeRef}
            src={proxyUrl}
            title={activeTool.name}
            className="w-full h-full min-w-full min-h-full border-0 select-auto bg-white block"
            style={{ width: '100%', height: '100%', minHeight: '100%' }}
            onLoad={() => {
              setIsLoading(false);
              try {
                const doc = iframeRef.current?.contentDocument;
                if (doc) {
                  const title = doc.title || '';
                  if (title.includes('404') || title.includes('Tidak Ditemukan') || !!doc.getElementById('root')) {
                    setLoadError(true);
                    return;
                  }
                }
              } catch {
                // Cross origin document, valid
              }
              setLoadError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setLoadError(true);
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>

        {/* High-Fidelity Portal Bridge Card (If external site restricts framing or encounters network issues) */}
        {loadError && (
          <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 select-auto animate-fade-in">
            <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xl space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 p-2.5 flex items-center justify-center mx-auto shadow-xs">
                {activeTool.logo}
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  <Lock className="w-3 h-3 text-blue-600" />
                  Situs Resmi {activeTool.instansi}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeTool.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Situs resmi ini mewajibkan koneksi autentikasi langsung atau membatasi protokol penyematan bingkai.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-left text-xs text-slate-600 space-y-1.5">
                <div className="text-[11px] text-blue-700 font-semibold leading-relaxed">
                  Verifikasi resmi berdasarkan {activeTool.dasarHukum}
                </div>
                <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-slate-200/60">
                  <span className="font-semibold text-slate-700">Target Validasi:</span>
                  <span className="font-bold text-blue-600 truncate max-w-[200px]">{activeTool.targetVerifikasi}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Tingkat Urgensi:</span>
                  <span className="font-medium text-slate-800">{activeTool.urgensi}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setViewMode('guide')}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Panduan SOP</span>
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Coba Lagi</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  className="w-full py-2 px-3 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Langsung di Tab Baru</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) - Desktop only */}
      <CheckingToolsFAB
        activeTool={activeTool}
        isGuideView={false}
        isDirectoryView={false}
        onOpenGuide={handleOpenGuide}
        onOpenNewTab={handleOpenNewTab}
        onOpenDirectory={handleOpenDirectory}
        onBack={handleBack}
        className="hidden md:flex"
      />

      {/* Mobile Bottom Navigation (Kembali | Alat | Tab Baru | Panduan) */}
      <CheckingToolsMobileBottomNav
        onBack={handleBack}
        onOpenNewTab={handleOpenNewTab}
        onOpenGuide={handleOpenGuide}
        onOpenDirectory={handleOpenDirectory}
        isGuideView={false}
        isDirectoryView={false}
      />
    </div>
  );
};

export default CheckingToolsPage;
