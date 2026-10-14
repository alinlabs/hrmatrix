import React, { useState } from 'react';
import { 
  Info, 
  BookOpen, 
  ExternalLink,
  X
} from 'lucide-react';
import { PortalMeta } from './e-portal-data';

export interface EPortalFABProps {
  activePortal: PortalMeta;
  onOpenGuide: () => void;
  onOpenNewTab?: () => void;
  onBack?: () => void;
  isGuideView?: boolean;
  className?: string;
}

export const EPortalFAB: React.FC<EPortalFABProps> = ({
  activePortal,
  onOpenGuide,
  onOpenNewTab,
  onBack,
  isGuideView = false,
  className = 'hidden md:flex'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleOpenNewTabAction = () => {
    if (onOpenNewTab) {
      onOpenNewTab();
    } else {
      window.open(activePortal.officialUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* Backdrop overlay for click-outside */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* FAB Floating Container (Desktop only by default: hidden md:flex) */}
      <aside 
        aria-label="Menu Aksi Cepat E-Portal"
        className={`fixed bottom-6 right-6 z-50 flex-col items-end gap-3 select-none ${className}`}
      >
        {/* Speed Dial Options (Appears above the FAB when open) */}
        {isOpen && (
          <div className="flex flex-col items-end gap-3 pb-1 animate-fade-in transition-all">
            {/* 1. Buka Di Tab Baru Option (Di atas Panduan Laporan) */}
            <div className="flex items-center gap-2.5 group">
              <span className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 text-xs font-semibold shadow-lg border border-slate-200/90 whitespace-nowrap pointer-events-none group-hover:scale-105 transition-transform">
                Buka Di Tab Baru
              </span>
              <button
                type="button"
                onClick={() => handleAction(handleOpenNewTabAction)}
                className="w-12 h-12 rounded-full shadow-xl border border-slate-200/90 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                title={`Buka ${activePortal.name} di Tab Baru`}
                aria-label="Buka Di Tab Baru"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Panduan Laporan Option */}
            <div className="flex items-center gap-2.5 group">
              <span className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 text-xs font-semibold shadow-lg border border-slate-200/90 whitespace-nowrap pointer-events-none group-hover:scale-105 transition-transform">
                {isGuideView ? 'Tutup Panduan (Kembali ke Portal)' : 'Panduan Laporan'}
              </span>
              <button
                type="button"
                onClick={() => handleAction(onOpenGuide)}
                className={`w-12 h-12 rounded-full shadow-xl border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                  isGuideView 
                    ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700' 
                    : 'bg-white hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 border-slate-200/90'
                }`}
                title={`Buka Panduan Laporan ${activePortal.shortName}`}
                aria-label="Panduan Laporan"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Primary FAB: Icon 'i' warna biru, atau icon 'X' saat terbuka */}
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-2xl border-2 border-blue-400/40 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
            isOpen ? 'rotate-90 bg-blue-700 shadow-blue-500/30' : ''
          }`}
          title={isOpen ? 'Tutup Menu' : 'Menu Aksi E-Portal'}
          aria-label="Menu Aksi E-Portal"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-200" />
          ) : (
            <Info className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          )}
        </button>
      </aside>
    </>
  );
};
