/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { CompanyProvider } from './context/company-context';
import { MobileNavProvider } from './context/mobile-nav-context';
import { AppLayout } from './components/layout/app-layout';
import { ScrollToTop } from './components/layout/scroll-to-top';
import { RouteSEO } from './components/seo/route-seo';
import { PWAManifestManager } from './components/pwa/pwa-manifest-manager';
import { ErrorBoundary } from './components/ui/error-boundary';
import { lazyWithRetry } from './utils/lazy-with-retry';
import { routeLoaders, scheduleIdlePrefetch } from './utils/route-prefetch';
import { RouteLoadingIndicator } from './components/ui/route-loading-indicator';
import { SplashScreen } from './pages/splash';
import { OfflineIndicator } from './components/pwa/offline-indicator';
import { DesktopNoticeOverlay } from './components/layout/desktop-notice-overlay';
import { CompanyBottomSheet } from './pages/daftar/modal-daftar';
import { SitemapViewer, RobotsViewer } from './components/seo/sitemap-viewer';

// Code-split heavy routes with lazyWithRetry backed by shared routeLoaders for instant hover/idle prefetching
const Dashboard = lazyWithRetry(routeLoaders.dashboard);
const FormDaftar = lazyWithRetry(routeLoaders.daftar);
const Employees = lazyWithRetry(routeLoaders.employees);
const DatabaseManager = lazyWithRetry(routeLoaders.database);
const PayrollList = lazyWithRetry(routeLoaders.payroll);
const PayrollDetail = lazyWithRetry(routeLoaders.payrollDetail);
const PayrollEmployeeList = lazyWithRetry(routeLoaders.payrollEmployees);
const PayrollTunjanganPage = lazyWithRetry(routeLoaders.kompensasiTunjangan);
const PayrollBPJSPage = lazyWithRetry(routeLoaders.kompensasiBpjs);
const PayrollPajakPage = lazyWithRetry(routeLoaders.kompensasiPajak);
const PageFormKompensasi = lazyWithRetry(routeLoaders.kompensasiForm);
const PresensiPage = lazyWithRetry(routeLoaders.presensi);
const JadwalPage = lazyWithRetry(routeLoaders.jadwal);
const CutiPage = lazyWithRetry(routeLoaders.cuti);
const KPIList = lazyWithRetry(routeLoaders.kpi);
const KPIGeneralCatalogPage = lazyWithRetry(routeLoaders.kpiCatalog);
const JobDesk = lazyWithRetry(routeLoaders.jobDesk);
const BuatLowonganATS = lazyWithRetry(routeLoaders.lowongan);
const LowonganDetailATS = lazyWithRetry(routeLoaders.lowonganDetail);
const Assessment = lazyWithRetry(routeLoaders.assessment);
const EvaluationPage = lazyWithRetry(routeLoaders.evaluation);
const CandidateDetailPage = lazyWithRetry(routeLoaders.candidateDetail);
const DokumenKontrak = lazyWithRetry(routeLoaders.kontrak);
const SuratResmi = lazyWithRetry(routeLoaders.surat);

// Legal Affairs
const RegulasiHukum = lazyWithRetry(routeLoaders.regulasi);
const PeraturanPerusahaanPage = lazyWithRetry(routeLoaders.regulasiPerusahaan);
const UndangUndangPage = lazyWithRetry(routeLoaders.regulasiUndangUndang);
const StandarIsoPage = lazyWithRetry(routeLoaders.regulasiIso);

// General Affairs (GA)
const GADashboardPage = lazyWithRetry(routeLoaders.gaDashboard);
const AssetManagementPage = lazyWithRetry(routeLoaders.gaAset);
const OfficeSuppliesPage = lazyWithRetry(routeLoaders.gaSupplies);
const FacilityMaintenancePage = lazyWithRetry(routeLoaders.gaFacility);
const VendorPermitsPage = lazyWithRetry(routeLoaders.gaVendor);
const GuestbookMailPage = lazyWithRetry(routeLoaders.gaGuestbook);

const Reports = lazyWithRetry(routeLoaders.reports);
const SettingsPage = lazyWithRetry(routeLoaders.settings);
const EbookPage = lazyWithRetry(routeLoaders.ebook);
const TentangPage = lazyWithRetry(routeLoaders.tentang);
const FaqPage = lazyWithRetry(routeLoaders.faq);
const NavigasiCepatPage = lazyWithRetry(routeLoaders.navigasiCepat);
const MyPresensiPage = lazyWithRetry(routeLoaders.myPresensi);
const PromptPage = lazyWithRetry(routeLoaders.prompt);
const PromoPricingPage = lazyWithRetry(routeLoaders.promo);
const NotFoundPage = lazyWithRetry(routeLoaders.notFound);

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
  const location = useLocation();
  const tab = searchParams.get('tab');
  if (tab === 'jaminan' || tab === 'bpjs') {
    return <Navigate to="/payroll/bpjs" state={location.state} replace />;
  }
  if (tab === 'pajak' || tab === 'tax') {
    return <Navigate to="/payroll/pajak" state={location.state} replace />;
  }
  return <Navigate to="/payroll/tunjangan" state={location.state} replace />;
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
          path.startsWith('/api')
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

      // Tangani SPA redirect dari 404.html (contoh: ?redirect=/employees)
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
          const { populateSampleCompanyAndEmployees } = await import('./utils/sample-data-generator');
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
    import('./data/master/aturan-penggajian').then(({ ensureDefaultPayrollRules }) => {
      ensureDefaultPayrollRules();
    });
  }, []);

  useEffect(() => {
    const handleReplay = () => setShowSplash(true);
    window.addEventListener('hrmatrix_replay_splash', handleReplay);
    return () => window.removeEventListener('hrmatrix_replay_splash', handleReplay);
  }, []);

  useEffect(() => {
    if (showSplash) return;
    return scheduleIdlePrefetch(['/', '/employees', '/presensi', '/payroll', '/kpi', '/reports']);
  }, [showSplash]);

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
            <Suspense fallback={<RouteLoadingIndicator fullScreen />}>
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
