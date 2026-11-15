import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { GoogleIcon, AppleIcon } from '../ui';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'badge' | 'sidebar' | 'icon' | 'nav-item';
  onItemClick?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'icon',
  onItemClick,
}) => {
  const { isInstalled, isAppleOrSafari, handleInstallAction } = usePWAInstall();

  // If already running as an installed PWA, do not show install prompt on standalone floating buttons
  if (isInstalled && variant !== 'nav-item') {
    return null;
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Jalankan callback penutup menu/drawer (jika ada) terlebih dahulu
    if (onItemClick) {
      onItemClick();
    }

    // Jalankan alur instalasi / pembukaan modal global
    await handleInstallAction();
  };

  if (variant === 'nav-item') {
    return (
      <button
        type="button"
        onClick={handleClick}
        id="sidebar-nav-install-app-btn"
        className={`w-full group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
          isInstalled
            ? 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/60'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        } ${className}`}
        title={isAppleOrSafari ? 'Install HRMatrix di Apple / iOS' : 'Install HRMatrix sebagai Aplikasi'}
      >
        {isInstalled ? (
          <CheckCircle2
            className="mr-3 flex-shrink-0 h-5 w-5 text-emerald-600"
            aria-hidden="true"
          />
        ) : isAppleOrSafari ? (
          <AppleIcon
            className="mr-3 flex-shrink-0 h-5 w-5 text-slate-800 group-hover:text-black transition-colors"
            aria-hidden="true"
          />
        ) : (
          <GoogleIcon
            className="mr-3 flex-shrink-0 h-5 w-5"
            aria-hidden="true"
          />
        )}
        <span className="truncate flex-1">
          {isInstalled ? 'Aplikasi Terpasang' : 'Install Aplikasi'}
        </span>
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer ${className}`}
        aria-label="Install HRMatrix PWA"
        title={isAppleOrSafari ? 'Install HRMatrix (Apple Safari / iOS)' : 'Install HRMatrix sebagai Aplikasi (Desktop & HP)'}
      >
        <Download className="w-4 h-4 shrink-0" />
      </button>
    );
  }

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center justify-between p-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-all shadow-2xs group cursor-pointer ${className}`}
        title="Install HRMatrix sebagai Aplikasi"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform p-1">
            {isAppleOrSafari ? (
              <AppleIcon className="w-4 h-4 text-slate-800" />
            ) : (
              <GoogleIcon className="w-4 h-4" />
            )}
          </div>
          <div className="text-left min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">Install HRMatrix</div>
            <div className="text-[10px] text-slate-500 truncate">
              {isAppleOrSafari ? 'Aplikasi Apple / iOS' : 'Aplikasi desktop & HP'}
            </div>
          </div>
        </div>
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium transition-colors cursor-pointer shadow-2xs ${className}`}
        title="Install HRMatrix PWA"
      >
        {isAppleOrSafari ? (
          <AppleIcon className="w-3.5 h-3.5 text-slate-800" />
        ) : (
          <GoogleIcon className="w-3.5 h-3.5" />
        )}
        <span>Install App</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer ${className}`}
      title="Install HRMatrix sebagai Aplikasi"
    >
      {isAppleOrSafari ? (
        <AppleIcon className="w-3.5 h-3.5 text-white" />
      ) : (
        <GoogleIcon className="w-3.5 h-3.5" />
      )}
      <span>Install Aplikasi</span>
    </button>
  );
};




