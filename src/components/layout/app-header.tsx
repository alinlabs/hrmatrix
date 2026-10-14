import React from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import { HRMatrixLogo } from '../ui/Logo';

interface AppHeaderProps {
  isEPortalRoute: boolean;
  isHeaderSearchActive: boolean;
  onBackClick?: (() => void) | null;
  hideHamburger?: boolean;
  onOpenMobileMenu: () => void;
  displayTitle: string;
  displaySubtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isEPortalRoute,
  isHeaderSearchActive,
  onBackClick,
  hideHamburger,
  onOpenMobileMenu,
  displayTitle,
  displaySubtitle
}) => {
  return (
    <>
      {/* Mobile Top Header */}
      <div className={cn("md:hidden shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs flex flex-col", isEPortalRoute && "hidden")}>
        <header className="h-[calc(3.5rem-1px)] flex items-center justify-between px-3.5">
          <div className={isHeaderSearchActive ? 'hidden' : 'flex items-center gap-2 min-w-0 flex-1'}>
            {onBackClick ? (
              <button
                type="button"
                onClick={onBackClick}
                className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                aria-label="Kembali"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
              </button>
            ) : !hideHamburger ? (
              <button 
                type="button" 
                onClick={onOpenMobileMenu}
                className="text-slate-700 hover:text-slate-900 p-1.5 -ml-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Buka Menu Navigasi"
                id="mobile-header-hamburger-btn"
              >
                <Menu className="w-5 h-5 text-slate-800" />
              </button>
            ) : null}
            <HRMatrixLogo className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-extrabold text-slate-900 text-base tracking-tight leading-tight truncate">
                {displayTitle}
              </span>
              {displaySubtitle && (
                <div className="text-[11px] text-slate-500 font-medium leading-none truncate mt-1">
                  {displaySubtitle}
                </div>
              )}
            </div>
          </div>
          
          <div className={isHeaderSearchActive ? 'hidden' : 'flex items-center gap-1 shrink-0'}>
            <div id="mobile-header-action-portal" className="flex items-center gap-1" />
          </div>

          <div id="mobile-header-search-portal" className={isHeaderSearchActive ? 'w-full h-full flex items-center' : 'hidden'} />
        </header>

        {/* Mobile Subbar Portal (e.g. Tab Bar in Header) */}
        <div id="page-header-subbar-portal-mobile" className="w-full empty:hidden" />
      </div>

      {/* Desktop Header */}
      <div className={cn("hidden md:flex shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs flex-col", isEPortalRoute && "md:hidden")}>
        <header className="h-[calc(4rem-1px)] flex items-center justify-between px-8">
          <div className={isHeaderSearchActive ? 'hidden' : 'flex items-center gap-2.5 min-w-0 flex-1'}>
            {onBackClick && (
              <button
                type="button"
                onClick={onBackClick}
                className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                aria-label="Kembali"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
              </button>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-tight truncate">
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <div className="text-[11px] text-slate-500 font-medium leading-none mt-1 truncate">
                  {displaySubtitle}
                </div>
              )}
            </div>
          </div>
          
          <div className={isHeaderSearchActive ? 'hidden' : 'flex items-center gap-2'}>
            {/* Desktop Action Portal */}
            <div id="desktop-header-action-portal" className="flex items-center gap-2" />
          </div>

          <div id="desktop-header-search-portal" className={isHeaderSearchActive ? 'w-full h-full flex items-center' : 'hidden'} />
        </header>

        {/* Desktop Subbar Portal (e.g. Tab Bar in Header) */}
        <div id="page-header-subbar-portal-desktop" className="w-full empty:hidden" />
      </div>
    </>
  );
};
