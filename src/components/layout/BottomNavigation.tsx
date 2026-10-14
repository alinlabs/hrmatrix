import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMobileNav } from '../../context/MobileNavContext';

export interface BottomNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  isCenterAccent?: boolean;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
}

/**
 * List of routes that intentionally do not display the 5-tab mobile bottom navigation bar,
 * including during and after modal dialogs or sub-tabs interactions.
 */
export const isRouteHidingBottomNav = (pathname: string): boolean => {
  return (
    pathname.startsWith('/lowongan') ||
    pathname.startsWith('/ats') ||
    pathname.startsWith('/assessment') ||
    pathname.startsWith('/kontrak') ||
    pathname.startsWith('/kompensasi') ||
    pathname.startsWith('/regulation') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/database') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/faq') ||
    pathname.startsWith('/bantuan') ||
    pathname.startsWith('/tentang') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/job-desk') ||
    pathname.startsWith('/ebook') ||
    pathname.startsWith('/guide') ||
    pathname.startsWith('/navigasi') ||
    pathname.startsWith('/payroll/') ||
    pathname.startsWith('/kpi/katalog-umum') ||
    pathname.startsWith('/prompt') ||
    pathname.startsWith('/checking-tools')
  );
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items
}) => {
  const location = useLocation();
  const { isCustomActionActive, hideBottomNav } = useMobileNav();
  const isExcludedRoute = isRouteHidingBottomNav(location.pathname);
  const isHidden = isCustomActionActive || hideBottomNav || isExcludedRoute;

  return (
    <>
      {/* Target Container for Custom Action Portals */}
      <div 
        id="mobile-bottom-action-portal"
        className={cn(
          "w-full bg-white/95 backdrop-blur-md border-t border-slate-100 items-center px-4 py-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.04)] shrink-0",
          isCustomActionActive ? "flex" : "hidden"
        )}
      />

      {/* Standard 5 tabs Navigation */}
      {!isHidden && (
        <nav 
          aria-label="Mobile Navigation Bar"
          id="mobile-bottom-navigation"
          className={cn(
            "w-full bg-white border-t border-slate-200 flex items-center justify-around px-1 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-16 shrink-0 transition-all duration-300 ease-in-out"
          )}
        >
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                id={`bottom-nav-${item.name.toLowerCase()}`}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-1.5 transition-colors text-center',
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 mb-1 transition-transform',
                    isActive ? 'scale-110' : 'hover:scale-105'
                  )}
                />
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </>
  );
};
