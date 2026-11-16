import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileSignature, FileText } from 'lucide-react';
import { PageHeaderSubbar } from '../../context/mobile-nav-context';
import { scrollToTop } from './scroll-to-top';

export type DokumenTab = 'kontrak' | 'surat';

interface DokumenHeaderProps {
  activeTab: DokumenTab;
}

export const DokumenHeader: React.FC<DokumenHeaderProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLegalRoute = location.pathname.startsWith('/legal');

  const tabs = [
    {
      id: 'kontrak' as const,
      label: 'Kontrak Kerja',
      icon: FileSignature,
      href: isLegalRoute ? '/legal/kontrak' : '/kontrak',
    },
    {
      id: 'surat' as const,
      label: 'Surat & SK Resmi',
      icon: FileText,
      href: isLegalRoute ? '/legal/surat' : '/surat',
    },
  ];

  const handleTabClick = (tab: (typeof tabs)[number]) => {
    if (tab.id !== activeTab) {
      navigate(tab.href);
    }
    scrollToTop();
  };

  return (
    <PageHeaderSubbar>
      <div className="flex items-center justify-between w-full px-3.5 md:px-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer px-2 text-center shrink-0 whitespace-nowrap ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
                }`}
              />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
              )}
            </button>
          );
        })}
      </div>
    </PageHeaderSubbar>
  );
};
