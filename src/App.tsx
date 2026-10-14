/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext';
import { MobileNavProvider } from './context/MobileNavContext';
import { AppLayout } from './components/layout/AppLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { RouteSEO } from './components/seo/RouteSEO';
import { PWAManifestManager } from './components/pwa/PWAManifestManager';
import { Dashboard } from './pages/dashboard';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ensureDefaultPayrollRules } from './data/master';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { SplashScreen } from './components/splash/SplashScreen';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { DesktopNoticeOverlay } from './components/layout/DesktopNoticeOverlay';
import { CompanyBottomSheet } from './pages/daftar/modal-daftar';
import { SitemapViewer, RobotsViewer } from './components/seo/SitemapViewer';
import { PortalProxyClientFallback } from './components/portal/PortalProxyClientFallback';

// Code-split heavy routes with lazyWithRetry to keep initial load lightweight and recover gracefully from chunk errors
const FormDaftar = lazyWithRetry(() => import('./pages/daftar/form-daftar').then(m => ({ default: m.FormDaftar })));
const Employees = lazyWithRetry(() => import('./pages/employees').then(m => ({ default: m.Employees })));
const DatabaseManager = lazyWithRetry(() => import('./pages/database/DatabaseManager').then(m => ({ default: m.DatabaseManager })));
const PayrollList = lazyWithRetry(() => import('./pages/payroll').then(m => ({ default: m.PayrollList })));
const PayrollDetail = lazyWithRetry(() => import('./pages/payroll/payroll-detail').then(m => ({ default: m.PayrollDetail })));
const PayrollEmployeeList = lazyWithRetry(() => import('./pages/payroll/payroll-employee-list').then(m => ({ default: m.PayrollEmployeeList })));
const KompensasiCenter = lazyWithRetry(() => import('./pages/kompensasi').then(m => ({ default: m.KompensasiCenter })));
const PayrollTunjanganPage = lazyWithRetry(() => import('./pages/kompensasi').then(m => ({ default: m.PayrollTunjanganPage })));
const PayrollBPJSPage = lazyWithRetry(() => import('./pages/kompensasi').then(m => ({ default: m.PayrollBPJSPage })));
const PayrollPajakPage = lazyWithRetry(() => import('./pages/kompensasi').then(m => ({ default: m.PayrollPajakPage })));
const PageFormKompensasi = lazyWithRetry(() => import('./pages/kompensasi/page-form-kompensasi').then(m => ({ default: m.PageFormKompensasi })));
const PresensiPage = lazyWithRetry(() => import('./pages/presensi').then(m => ({ default: m.PresensiPage || m.default })));
const JadwalPage = lazyWithRetry(() => import('./pages/jadwal').then(m => ({ default: m.JadwalPage || m.default })));
const CutiPage = lazyWithRetry(() => import('./pages/cuti').then(m => ({ default: m.CutiPage || m.default })));
const Attendance = lazyWithRetry(() => import('./pages/presensi').then(m => ({ default: m.PresensiPage || m.default })));
const KPIList = lazyWithRetry(() => import('./pages/kpi/kpi-list').then(m => ({ default: m.KPIList })));
const KPIGeneralCatalogPage = lazyWithRetry(() => import('./pages/kpi/kpi-general-catalog-page').then(m => ({ default: m.KPIGeneralCatalogPage })));
const JobDesk = lazyWithRetry(() => import('./pages/job-desk/JobDesk'));
const BuatLowonganATS = lazyWithRetry(() => import('./pages/lowongan').then(m => ({ default: m.BuatLowonganATSPage })));
const LowonganDetailATS = lazyWithRetry(() => import('./pages/lowongan/detail').then(m => ({ default: m.VacancyDetailPage })));
const Assessment = lazyWithRetry(() => import('./pages/assessment').then(m => ({ default: m.AssessmentPage })));
const EvaluationPage = lazyWithRetry(() => import('./pages/evaluation').then(m => ({ default: m.EvaluationPage })));
const CandidateDetailPage = lazyWithRetry(() => import('./pages/evaluation/candidate-detail-page').then(m => ({ default: m.CandidateDetailPage })));
const DokumenKontrak = lazyWithRetry(() => import('./pages/kontrak').then(m => ({ default: m.DokumenKontrakPage })));
const SuratResmi = lazyWithRetry(() => import('./pages/surat').then(m => ({ default: m.SuratResmiPage })));
const CheckingToolsPage = lazyWithRetry(() => import('./pages/checking-tools').then(m => ({ default: m.CheckingToolsPage || m.default })));

// Legal Affairs
const RegulasiHukum = lazyWithRetry(() => import('./pages/regulasi').then(m => ({ default: m.RegulasiHukumPage })));
const PeraturanPerusahaanPage = lazyWithRetry(() => import('./pages/regulasi').then(m => ({ default: m.PeraturanPerusahaanPage || m.RegulasiHukumPage })));
const UndangUndangPage = lazyWithRetry(() => import('./pages/regulasi').then(m => ({ default: m.UndangUndangPage || m.RegulasiHukumPage })));
const StandarIsoPage = lazyWithRetry(() => import('./pages/regulasi').then(m => ({ default: m.StandarIsoPage || m.RegulasiHukumPage })));

// General Affairs (GA)
const GADashboardPage = lazyWithRetry(() => import('./pages/ga').then(m => ({ default: m.GeneralAffairsDashboard })));
const AssetManagementPage = lazyWithRetry(() => import('./pages/ga/AssetManagementPage').then(m => ({ default: m.AssetManagementPage })));
const OfficeSuppliesPage = lazyWithRetry(() => import('./pages/ga/OfficeSuppliesPage').then(m => ({ default: m.OfficeSuppliesPage })));
const FacilityMaintenancePage = lazyWithRetry(() => import('./pages/ga/FacilityMaintenancePage').then(m => ({ default: m.FacilityMaintenancePage })));
const VendorPermitsPage = lazyWithRetry(() => import('./pages/ga/VendorPermitsPage').then(m => ({ default: m.VendorPermitsPage })));
const GuestbookMailPage = lazyWithRetry(() => import('./pages/ga/GuestbookMailPage').then(m => ({ default: m.GuestbookMailPage })));

const Reports = lazyWithRetry(() => import('./pages/reports/Reports').then(m => ({ default: m.Reports })));
const EPortalPage = lazyWithRetry(() => import('./pages/reports/e-portal').then(m => ({ default: m.EPortalPage || m.default })));
const SettingsPage = lazyWithRetry(() => import('./pages/settings/Settings').then(m => ({ default: m.SettingsPage })));
const EbookPage = lazyWithRetry(() => import('./pages/ebook').then(m => ({ default: m.EbookPage })));
const TentangPage = lazyWithRetry(() => import('./pages/tentang').then(m => ({ default: m.TentangPage })));
const FaqPage = lazyWithRetry(() => import('./pages/faq').then(m => ({ default: m.FaqPage })));
const NavigasiCepatPage = lazyWithRetry(() => import('./pages/navigasi-cepat').then(m => ({ default: m.NavigasiCepatPage })));
const MyPresensiPage = lazyWithRetry(() => import('./pages/employees/my-presensi').then(m => ({ default: m.MyPresensiPage })));
const PromptPage = lazyWithRetry(() => import('./pages/prompt').then(m => ({ default: m.PromptPage || m.default })));
const PromoPricingPage = lazyWithRetry(() => import('./pages/promo/PromoPricingPage').then(m => ({ default: m.PromoPricingPage })));
const NotFoundPage = lazyWithRetry(() => import('./pages/error/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function PageLoadingFallback() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
      <span className="text-xs font-medium text-slate-500">Memuat halaman...</span>
    </div>
  );
}

function AttendanceRedirect() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  if (tab === 'schedule' || tab === 'jadwal') {
    return <Navigate to="/jadwal" replace />;
  }
  if (tab === 'leave' || tab === 'cuti') {
    return <Navigate to="/cuti" replace />;
  }
  if (tab === 'summary' || tab === 'rekap') {
    return <Navigate to="/presensi?tab=rekap" replace />;
  }
  return <Navigate to="/presensi" replace />;
}

function KompensasiRedirect() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  if (tab === 'jaminan' || tab === 'bpjs') {
    return <Navigate to="/payroll/bpjs" replace />;
  }
  if (tab === 'pajak' || tab === 'tax') {
    return <Navigate to="/payroll/pajak" replace />;
  }
  return <Navigate to="/payroll/tunjangan" replace />;
}

function SPARedirectHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTarget = searchParams.get('redirect') || sessionStorage.getItem('hrmatrix_spa_redirect');
      if (redirectTarget) {
        sessionStorage.removeItem('hrmatrix_spa_redirect');
        const cleanTarget = decodeURIComponent(redirectTarget);
        if (cleanTarget && cleanTarget !== '/' && !cleanTarget.startsWith('/?redirect')) {
          navigate(cleanTarget, { replace: true });
        }
      }
    } catch {}
  }, [navigate]);
  return null;
}

export default function App() {
  // Splash screen hanya muncul saat awal masuk web (sesi awal), tidak muncul setiap kali refresh
  // Dan TIDAK PERNAH muncul untuk sitemap.xml, robots.txt, file XML/TXT, atau endpoint API
  const [showSplash, setShowSplash] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = (window.location.pathname || '').toLowerCase();
        if (
          path.includes('sitemap') ||
          path.includes('robots') ||
          path.endsWith('.xml') ||
          path.endsWith('.txt') ||
          path.startsWith('/api') ||
          path.includes('proxy-portal')
        ) {
          return false;
        }
      }
      const alreadyShown = sessionStorage.getItem('hrmatrix_splash_shown');
      if (alreadyShown) {
        return false;
      }
      sessionStorage.setItem('hrmatrix_splash_shown', 'true');
      return true;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleUrlParams = async () => {
      if (typeof window === 'undefined') return;
      
      const searchParams = new URLSearchParams(window.location.search);
      const currentUrl = new URL(window.location.href);

      // Tangani SPA redirect dari 404.html (contoh: ?redirect=/checking-tools atau ?redirect=/e-portal)
      const redirectTarget = searchParams.get('redirect') || sessionStorage.getItem('hrmatrix_spa_redirect');
      if (redirectTarget) {
        try {
          sessionStorage.removeItem('hrmatrix_spa_redirect');
        } catch {}
        const cleanTarget = decodeURIComponent(redirectTarget);
        if (cleanTarget && cleanTarget !== '/' && !cleanTarget.startsWith('/?redirect')) {
          window.history.replaceState(null, '', cleanTarget);
        }
      }

      // ?data=clear (Hapus semua data)
      if (searchParams.get('data') === 'clear') {
        try {
          const { db } = await import('./db/database');
          await db.clearAllTables();
          localStorage.clear();
          sessionStorage.clear();
          currentUrl.searchParams.delete('data');
          window.location.replace(currentUrl.toString());
          return; // Stop execution to allow reload
        } catch (error) {
          console.error('Failed to clear database via URL:', error);
        }
      }

      // ?data=demo (Muat data demo)
      if (searchParams.get('data') === 'demo') {
        try {
          const { populateSampleCompanyAndEmployees } = await import('./utils/sampleDataGenerator');
          await populateSampleCompanyAndEmployees();
          currentUrl.searchParams.delete('data');
          window.location.replace(currentUrl.toString());
          return;
        } catch (error) {
          console.error('Failed to load demo data via URL:', error);
        }
      }

      // ?user=new (Arahkan ke form daftar)
      if (searchParams.get('user') === 'new') {
        currentUrl.searchParams.delete('user');
        currentUrl.pathname = '/daftar';
        window.location.replace(currentUrl.toString());
        return;
      }

      // ?code=... atau ?qr=... (Arahkan langsung ke /my-presensi?code=... untuk presensi mandiri)
      const codeOrQrParam = searchParams.get('code') || searchParams.get('qr');
      if (codeOrQrParam && (currentUrl.pathname === '/' || currentUrl.pathname === '/employees')) {
        currentUrl.pathname = '/my-presensi';
        if (!searchParams.has('code') && searchParams.has('qr')) {
          currentUrl.searchParams.set('code', searchParams.get('qr')!);
          currentUrl.searchParams.delete('qr');
        }
        window.location.replace(currentUrl.toString());
        return;
      }
    };

    handleUrlParams();
  }, []);

  useEffect(() => {
    ensureDefaultPayrollRules();
  }, []);

  useEffect(() => {
    const handleReplay = () => setShowSplash(true);
    window.addEventListener('hrmatrix_replay_splash', handleReplay);
    return () => window.removeEventListener('hrmatrix_replay_splash', handleReplay);
  }, []);

  return (
    <ErrorBoundary>
      <DesktopNoticeOverlay isSplashActive={showSplash} />
      <OfflineIndicator />
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
          }}
        />
      )}
      <CompanyProvider>
        <BrowserRouter>
          <SPARedirectHandler />
          <ScrollToTop />
          <RouteSEO />
          <PWAManifestManager />
          <MobileNavProvider>
            <CompanyBottomSheet isSplashActive={showSplash} />
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/daftar" element={<FormDaftar />} />
                <Route path="/setup" element={<Navigate to="/daftar" replace />} />
                <Route path="/my-presensi" element={<MyPresensiPage />} />
                
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="presensi" element={<PresensiPage />} />
                  <Route path="jadwal" element={<JadwalPage />} />
                  <Route path="cuti" element={<CutiPage />} />
                  <Route path="attendance" element={<AttendanceRedirect />} />
                  <Route path="payroll" element={<PayrollList />} />
                  <Route path="payroll/tunjangan" element={<PayrollTunjanganPage />} />
                  <Route path="payroll/bpjs" element={<PayrollBPJSPage />} />
                  <Route path="payroll/pajak" element={<PayrollPajakPage />} />
                  <Route path="payroll/:id" element={<PayrollDetail />} />
                  <Route path="payroll/:id/employees" element={<PayrollEmployeeList />} />
                  <Route path="kompensasi" element={<KompensasiRedirect />} />
                  <Route path="kompensasi/add" element={<PageFormKompensasi />} />
                  <Route path="kompensasi/add/:type" element={<PageFormKompensasi />} />
                  <Route path="kompensasi/edit/:id" element={<PageFormKompensasi />} />
                  <Route path="regulation" element={<KompensasiRedirect />} />
                  <Route path="regulation/add" element={<PageFormKompensasi />} />
                  <Route path="regulation/add/:type" element={<PageFormKompensasi />} />
                  <Route path="regulation/edit/:id" element={<PageFormKompensasi />} />
                  <Route path="kpi" element={<KPIList />} />
                  <Route path="kpi/katalog-umum" element={<KPIGeneralCatalogPage />} />
                  <Route path="settings/kpi-umum" element={<KPIGeneralCatalogPage />} />
                  <Route path="job-desk" element={<JobDesk />} />
                  <Route path="screening" element={<BuatLowonganATS />} />
                  <Route path="screening/:id" element={<LowonganDetailATS />} />
                  <Route path="lowongan" element={<BuatLowonganATS />} />
                  <Route path="lowongan/:id" element={<LowonganDetailATS />} />
                  <Route path="ats" element={<BuatLowonganATS />} />
                  <Route path="assessment" element={<Assessment />} />
                  <Route path="assessment/*" element={<Assessment />} />
                  <Route path="interview" element={<Navigate to="/candidate" replace />} />
                  <Route path="interview/*" element={<Navigate to="/candidate" replace />} />
                  <Route path="candidate" element={<EvaluationPage />} />
                  <Route path="candidate/:candidateId" element={<CandidateDetailPage />} />
                  <Route path="kandidat" element={<EvaluationPage />} />
                  <Route path="kandidat/:candidateId" element={<CandidateDetailPage />} />
                  <Route path="evaluation" element={<EvaluationPage />} />
                  <Route path="evaluation/:candidateId" element={<CandidateDetailPage />} />
                  <Route path="evaluasi" element={<EvaluationPage />} />
                  <Route path="evaluasi/:candidateId" element={<CandidateDetailPage />} />
                  
                  {/* Background Checking Tools (Verifikasi Rekrutmen) & URL Aliases */}
                  <Route path="checking-tools" element={<CheckingToolsPage />} />
                  <Route path="checking-tools/:toolId" element={<CheckingToolsPage />} />
                  <Route path="checking-tools/:toolId/panduan" element={<CheckingToolsPage />} />
                  <Route path="checking-tools/*" element={<CheckingToolsPage />} />
                  <Route path="checkingtools" element={<CheckingToolsPage />} />
                  <Route path="checkingtools/:toolId" element={<CheckingToolsPage />} />
                  <Route path="checkingtools/:toolId/panduan" element={<CheckingToolsPage />} />
                  <Route path="checkingtools/*" element={<CheckingToolsPage />} />
                  <Route path="checking-tool" element={<CheckingToolsPage />} />
                  <Route path="checking-tool/:toolId" element={<CheckingToolsPage />} />
                  <Route path="checking" element={<CheckingToolsPage />} />
                  <Route path="checking/:toolId" element={<CheckingToolsPage />} />
                  <Route path="screening/checking-tools" element={<Navigate to="/checking-tools" replace />} />
                  <Route path="screening/checking-tools/:toolId" element={<CheckingToolsPage />} />

                  <Route path="kontrak" element={<DokumenKontrak />} />
                  <Route path="kontrak/:id" element={<DokumenKontrak />} />
                  <Route path="surat" element={<SuratResmi />} />
                  <Route path="surat/:id" element={<SuratResmi />} />
                  <Route path="sk" element={<SuratResmi />} />
                  
                  {/* Legal Affairs Routes */}
                  <Route path="legal" element={<RegulasiHukum />} />
                  <Route path="legal/kontrak" element={<DokumenKontrak />} />
                  <Route path="legal/surat" element={<SuratResmi />} />
                  <Route path="legal/peraturan-perusahaan" element={<PeraturanPerusahaanPage />} />
                  <Route path="legal/undang-undang" element={<UndangUndangPage />} />
                  <Route path="legal/standar-iso" element={<StandarIsoPage />} />
                  <Route path="legal/iso" element={<StandarIsoPage />} />
                  <Route path="regulasi" element={<RegulasiHukum />} />
                  <Route path="regulasi/peraturan-perusahaan" element={<PeraturanPerusahaanPage />} />
                  <Route path="regulasi/undang-undang" element={<UndangUndangPage />} />
                  <Route path="regulasi/standar-iso" element={<StandarIsoPage />} />
                  <Route path="regulasi-hukum" element={<RegulasiHukum />} />
                  <Route path="hukum" element={<RegulasiHukum />} />

                  {/* General Affairs (GA) Routes */}
                  <Route path="ga" element={<GADashboardPage />} />
                  <Route path="ga/dashboard" element={<GADashboardPage />} />
                  <Route path="ga/aset" element={<AssetManagementPage />} />
                  <Route path="ga/asset" element={<AssetManagementPage />} />
                  <Route path="ga/inventaris" element={<AssetManagementPage />} />
                  <Route path="ga/atk" element={<OfficeSuppliesPage />} />
                  <Route path="ga/supplies" element={<OfficeSuppliesPage />} />
                  <Route path="ga/pengadaan" element={<OfficeSuppliesPage />} />
                  <Route path="ga/pr" element={<OfficeSuppliesPage />} />
                  <Route path="ga/fasilitas" element={<FacilityMaintenancePage />} />
                  <Route path="ga/maintenance" element={<FacilityMaintenancePage />} />
                  <Route path="ga/booking" element={<FacilityMaintenancePage />} />
                  <Route path="ga/vendor" element={<VendorPermitsPage />} />
                  <Route path="ga/vendors" element={<VendorPermitsPage />} />
                  <Route path="ga/izin" element={<VendorPermitsPage />} />
                  <Route path="ga/perizinan" element={<VendorPermitsPage />} />
                  <Route path="ga/buku-tamu" element={<GuestbookMailPage />} />
                  <Route path="ga/guestbook" element={<GuestbookMailPage />} />
                  <Route path="ga/surat" element={<GuestbookMailPage />} />
                  <Route path="ga/tamu" element={<GuestbookMailPage />} />

                  <Route path="reports" element={<Reports />} />
                  
                  {/* e-Portal Routes & URL Aliases */}
                  <Route path="e-portal" element={<EPortalPage />} />
                  <Route path="e-portal/:portalId" element={<EPortalPage />} />
                  <Route path="e-portal/:portalId/panduan" element={<EPortalPage />} />
                  <Route path="e-portal/*" element={<EPortalPage />} />
                  <Route path="eportal" element={<EPortalPage />} />
                  <Route path="eportal/:portalId" element={<EPortalPage />} />
                  <Route path="eportal/:portalId/panduan" element={<EPortalPage />} />
                  <Route path="eportal/*" element={<EPortalPage />} />
                  <Route path="portal" element={<EPortalPage />} />
                  <Route path="portal/:portalId" element={<EPortalPage />} />
                  <Route path="portal/:portalId/panduan" element={<EPortalPage />} />
                  <Route path="portal/*" element={<EPortalPage />} />
                  <Route path="e-portals" element={<EPortalPage />} />
                  <Route path="e-portals/:portalId" element={<EPortalPage />} />

                  <Route path="database" element={<DatabaseManager />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="ebook" element={<EbookPage />} />
                  <Route path="navigasi-cepat" element={<NavigasiCepatPage />} />
                  <Route path="navigasi" element={<NavigasiCepatPage />} />
                  <Route path="faq" element={<FaqPage />} />
                  <Route path="bantuan" element={<FaqPage />} />
                  <Route path="tentang" element={<TentangPage />} />
                  <Route path="about" element={<TentangPage />} />
                  <Route path="prompt" element={<PromptPage />} />
                  <Route path="prompts" element={<PromptPage />} />
                  <Route path="poster" element={<PromptPage />} />
                  <Route path="posters" element={<PromptPage />} />
                  <Route path="prompt-poster" element={<PromptPage />} />
                  <Route path="prompts-poster" element={<PromptPage />} />
                  <Route path="promo" element={<PromoPricingPage />} />
                  <Route path="promosi" element={<PromoPricingPage />} />
                  <Route path="pricing" element={<PromoPricingPage />} />
                </Route>

                {/* Sitemap & Robots Routes for Direct Navigation / Crawler handling */}
                <Route path="/sitemap.xml" element={<SitemapViewer />} />
                <Route path="/sitemap" element={<SitemapViewer />} />
                <Route path="/robots.txt" element={<RobotsViewer />} />

                {/* Proxy API Client Fallback Route (Zero 404 inside Iframe on Static Deployments) */}
                <Route path="/api/proxy-portal" element={<PortalProxyClientFallback />} />
                <Route path="/api/*" element={<PortalProxyClientFallback />} />

                {/* Independent Full Screen Error Pages */}
                <Route path="/403" element={<NotFoundPage code={403} />} />
                <Route path="/500" element={<NotFoundPage code={500} />} />
                <Route path="/404" element={<NotFoundPage code={404} />} />
                <Route path="*" element={<NotFoundPage code={404} />} />
              </Routes>
            </Suspense>
          </MobileNavProvider>
        </BrowserRouter>
      </CompanyProvider>
    </ErrorBoundary>
  );
}
