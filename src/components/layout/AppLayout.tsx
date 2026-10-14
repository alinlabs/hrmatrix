import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { AttendanceConfig } from '../../types';
import { cn } from '../../utils/cn';
import { useCompany } from '../../context/CompanyContext';
import { useMobileNav } from '../../context/MobileNavContext';
import { HRMatrixLogo } from '../ui/Logo';
import { BottomNavigation, isRouteHidingBottomNav } from './BottomNavigation';
import { useScrollLock } from '../../hooks/useScrollLock';
import { PWAInstallModal } from '../pwa/PWAInstallModal';

// Modular Layout Components & Configurations
import {
  NavSubItem,
  NavMainItem,
  getMainNavigation,
  recruitmentNavigation,
  legalNavigation,
  gaNavigation,
  reportsNavigation,
  getFilteredReportsNavigation,
  systemNavigation,
  mobileBottomNavigation,
  infoNavigation,
  isParentItemActive,
  getRouteTitle
} from './navigation-config';
import { useAppModulesConfig } from '../../services/moduleConfigService';
import { DesktopSidebar } from './desktop-sidebar';
import { MobileDrawer } from './mobile-drawer';
import { AppHeader } from './app-header';

// Re-export types and navigation getter for backward compatibility
export type { NavSubItem, NavMainItem };
export { getMainNavigation };

export function AppLayout() {
  const { isLoading, openCompanySetupModal } = useCompany();
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

  // Otomatis buka dropdown kategori navigasi yang sedang aktif sesuai rute
  useEffect(() => {
    [
      ...mainNavigation, 
      ...filteredRecruitmentNav, 
      ...legalNavigation, 
      ...filteredGaNav, 
      ...filteredReportsNav, 
      ...systemNavigation
    ].forEach(item => {
      if (item.hasDropdown && isParentItemActive(item, location.pathname, location.search)) {
        setOpenDropdowns(prev => ({ ...prev, [item.name]: true }));
      }
    });
  }, [mainNavigation, filteredRecruitmentNav, filteredGaNav, filteredReportsNav, location.pathname, location.search]);

  // Kunci scroll body ketika menu mobile terbuka
  useScrollLock(mobileMenuOpen);

  // Jika membuka tautan presensi mandiri /employees?code=... atau ?qr=... maka bypass seluruh layout
  const searchParams = new URLSearchParams(location.search);
  const isEmployeeCodeView = location.pathname.startsWith('/employees') && (searchParams.has('code') || searchParams.has('qr'));

  if (isEmployeeCodeView) {
    return <Outlet />;
  }

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <HRMatrixLogo className="w-12 h-12 animate-pulse mb-3" />
        <span className="text-slate-500 text-sm font-medium">Memuat HRMatrix...</span>
      </div>
    );
  }

  const isEPortalRoute = location.pathname.startsWith('/e-portal') || location.pathname.startsWith('/checking-tools') || location.pathname.startsWith('/screening/checking-tools');
  const isExcludedRoute = isRouteHidingBottomNav(location.pathname);
  const isBottomNavHidden = isExcludedRoute || hideBottomNav || isEPortalRoute;
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
        onDaftarClick={openCompanySetupModal}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 max-w-full bg-white overflow-hidden relative">
        {/* Header (Mobile & Desktop) */}
        <AppHeader
          isEPortalRoute={isEPortalRoute}
          isHeaderSearchActive={isHeaderSearchActive}
          onBackClick={onBackClick}
          hideHamburger={hideHamburger}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          displayTitle={displayTitle}
          displaySubtitle={displaySubtitle}
        />

        {/* Primary Viewport-Clamped Scroll Container */}
        <main 
          id="main-content-scroll" 
          data-scroll-container="true"
          className={cn(
            "flex-1 min-h-0 bg-white flex flex-col",
            isEPortalRoute 
              ? "p-0 pb-0 overflow-hidden" 
              : "overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 md:p-8 pb-8 sm:pb-10 md:pb-12"
          )}
        >
          <div className="flex-1 flex flex-col min-h-0 w-full h-full">
            <Outlet />
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
        onClose={() => setMobileMenuOpen(false)}
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
        onDaftarClick={openCompanySetupModal}
      />

      {/* Global PWA Install Modal / iOS Safari Guide */}
      <PWAInstallModal />
    </div>
  );
}

export default AppLayout;
