import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { AttendanceConfig } from '../../types';
import { cn } from '../../utils/cn';
import { useCompany } from '../../context/company-context';
import { useMobileNav } from '../../context/mobile-nav-context';
import { RouteLoadingIndicator } from '../ui/route-loading-indicator';
import { BottomNavigation, isRouteHidingBottomNav } from './navigation-bottom';
import { useScrollLock } from '../../hooks/use-scroll-lock';
import { PWAInstallModal } from '../pwa/pwa-install-modal';

// Modular Layout Components & Configurations
import {
  NavSubItem,
  NavMainItem,
  getMainNavigation,
  recruitmentNavigation,
  legalNavigation,
  gaNavigation,
  getFilteredReportsNavigation,
  systemNavigation,
  mobileBottomNavigation,
  infoNavigation,
  isParentItemActive,
  getRouteTitle
} from './navigation-config';
import { useAppModulesConfig } from '../../services/module-config-service';
import { DesktopSidebar } from './desktop-sidebar';
import { MobileDrawer } from './mobile-drawer';
import { AppHeader } from './app-header';

// Re-export types and navigation getter for backward compatibility
export type { NavSubItem, NavMainItem };
export { getMainNavigation };

export function AppLayout() {
  const navigate = useNavigate();
  const { isLoading, closeCompanySetupModal } = useCompany();
  const { 
    pageTitle, 
    pageSubtitle, 
    onBackClick, 
    hideHamburger, 
    hideDesktopSidebar, 
    isHeaderSearchActive, 
    hideBottomNav, 
    isCustomActionActive 
  } = useMobileNav();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const location = useLocation();

  // Reaktif terhadap konfigurasi modul & seekbars (Rekrutmen, GA, E-Portal)
  const { config: modulesConfig } = useAppModulesConfig();

  // Reaktif terhadap konfigurasi presensi shift vs reguler
  const liveAttendanceConfig = useLiveQuery(async () => {
    try {
      return await db.settings.get('attendanceConfig');
    } catch {
      return null;
    }
  });
  const isShiftMode = (liveAttendanceConfig as unknown as AttendanceConfig)?.systemType === 'shift';
  const mainNavigation = useMemo(() => getMainNavigation(isShiftMode), [isShiftMode]);

  // Modul Rekrutmen, GA, dan Laporan dinamis sesuai toggle seekbar
  const filteredRecruitmentNav = useMemo(() => {
    return modulesConfig.enableRecruitment ? recruitmentNavigation : [];
  }, [modulesConfig.enableRecruitment]);

  const filteredGaNav = useMemo(() => {
    return modulesConfig.enableGeneralAffairs ? gaNavigation : [];
  }, [modulesConfig.enableGeneralAffairs]);

  const filteredReportsNav = useMemo(() => {
    return getFilteredReportsNavigation(modulesConfig);
  }, [modulesConfig]);

  // Otomatis buka dropdown kategori navigasi yang sedang aktif sesuai rute tanpa memicu re-render berlebih
  useEffect(() => {
    const allItems = [
      ...mainNavigation,
      ...filteredRecruitmentNav,
      ...legalNavigation,
      ...filteredGaNav,
      ...filteredReportsNav,
      ...systemNavigation,
    ];
    const activeNames = allItems
      .filter(item => item.hasDropdown && isParentItemActive(item, location.pathname, location.search))
      .map(item => item.name);

    if (activeNames.length === 0) return;

    setOpenDropdowns(prev => {
      let changed = false;
      for (const name of activeNames) {
        if (!prev[name]) {
          changed = true;
          break;
        }
      }
      if (!changed) return prev;
      const next = { ...prev };
      for (const name of activeNames) {
        next[name] = true;
      }
      return next;
    });
  }, [mainNavigation, filteredRecruitmentNav, filteredGaNav, filteredReportsNav, location.pathname, location.search]);

  // Kunci scroll body ketika menu mobile terbuka
  useScrollLock(mobileMenuOpen);

  // Jika membuka tautan presensi mandiri /employees?code=... atau ?qr=... maka bypass seluruh layout
  const isEmployeeCodeView = useMemo(() => {
    if (!location.pathname.startsWith('/employees')) return false;
    const searchParams = new URLSearchParams(location.search);
    return searchParams.has('code') || searchParams.has('qr');
  }, [location.pathname, location.search]);

  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  }, []);

  const handleOpenMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const handleCloseMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const handleDaftarClick = useCallback(() => {
    try {
      sessionStorage.setItem('hrmatrix_reg_modal_dismissed', 'true');
      sessionStorage.setItem('hrmatrix_promo_modal_dismissed', 'true');
    } catch {
      // ignore
    }
    closeCompanySetupModal();
    navigate('/daftar');
  }, [closeCompanySetupModal, navigate]);

  const handleAccountSettingsClick = useCallback(() => {
    closeCompanySetupModal();
    navigate('/settings');
  }, [closeCompanySetupModal, navigate]);

  if (isEmployeeCodeView) {
    return (
      <Suspense fallback={<RouteLoadingIndicator fullScreen />}>
        <Outlet />
      </Suspense>
    );
  }

  if (isLoading) {
    return <RouteLoadingIndicator fullScreen label="Memuat HRMatrix..." showDelayMs={0} />;
  }

  const isExcludedRoute = isRouteHidingBottomNav(location.pathname);
  const isBottomNavHidden = isExcludedRoute || hideBottomNav;
  const displayTitle = pageTitle || getRouteTitle(location.pathname);
  const displaySubtitle = pageSubtitle || 'Human Resource Matrix';

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-white flex flex-col md:flex-row w-full max-w-full overflow-hidden">
      {/* Sidebar Desktop */}
      <DesktopSidebar
        hideDesktopSidebar={hideDesktopSidebar}
        mainNavigation={mainNavigation}
        recruitmentNavigation={filteredRecruitmentNav}
        legalNavigation={legalNavigation}
        gaNavigation={filteredGaNav}
        reportsNavigation={filteredReportsNav}
        systemNavigation={systemNavigation}
        infoNavigation={infoNavigation}
        openDropdowns={openDropdowns}
        toggleDropdown={toggleDropdown}
        currentPathname={location.pathname}
        currentSearch={location.search}
        onDaftarClick={handleDaftarClick}
        onAccountClick={handleAccountSettingsClick}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 max-w-full bg-white overflow-hidden relative">
        {/* Header (Mobile & Desktop) */}
        <AppHeader
          isHeaderSearchActive={isHeaderSearchActive}
          onBackClick={onBackClick}
          hideHamburger={hideHamburger}
          onOpenMobileMenu={handleOpenMobileMenu}
          displayTitle={displayTitle}
          displaySubtitle={displaySubtitle}
        />

        {/* Primary Viewport-Clamped Scroll Container */}
        <main 
          id="main-content-scroll" 
          data-scroll-container="true"
          className="flex-1 min-h-0 bg-white flex flex-col overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] px-3.5 md:pl-8 md:pr-[calc(2rem-5px)] py-4 md:py-6"
        >
          <div className="flex-1 flex flex-col min-h-full w-full">
            <Suspense fallback={<RouteLoadingIndicator />}>
              <Outlet />
            </Suspense>
          </div>
        </main>

        {/* Mobile / Custom Bottom Navigation Component */}
        <div className={cn(
          "shrink-0 w-full z-40 relative",
          isCustomActionActive ? "block" : "md:hidden",
          isBottomNavHidden && !isCustomActionActive ? "hidden" : "bg-white"
        )}>
          <BottomNavigation
            items={mobileBottomNavigation}
          />
        </div>
      </div>

      {/* Mobile Drawer Sidebar */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        mainNavigation={mainNavigation}
        recruitmentNavigation={filteredRecruitmentNav}
        legalNavigation={legalNavigation}
        gaNavigation={filteredGaNav}
        reportsNavigation={filteredReportsNav}
        systemNavigation={systemNavigation}
        infoNavigation={infoNavigation}
        openDropdowns={openDropdowns}
        toggleDropdown={toggleDropdown}
        currentPathname={location.pathname}
        currentSearch={location.search}
        onDaftarClick={handleDaftarClick}
        onAccountClick={handleAccountSettingsClick}
      />

      {/* Global PWA Install Modal / iOS Safari Guide */}
      <PWAInstallModal />
    </div>
  );
}

export default AppLayout;
