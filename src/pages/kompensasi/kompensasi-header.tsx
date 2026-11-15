import React from 'react';
import { Tag, ShieldCheck, Calculator } from 'lucide-react';
import { PageHeaderSubbar } from '../../context/MobileNavContext';
import { KompensasiTab } from './types';

interface KompensasiHeaderProps {
  activeTab: KompensasiTab;
  onTabChange: (tab: KompensasiTab) => void;
}

export const KompensasiHeader: React.FC<KompensasiHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'tunjangan' as const, label: 'Tunjangan', icon: Tag },
    { id: 'jaminan' as const, label: 'BPJS', icon: ShieldCheck },
    { id: 'pajak' as const, label: 'Pajak', icon: Calculator },
  ];

  return (
    <PageHeaderSubbar>
      <div className="flex items-center justify-between w-full px-3 sm:px-8 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer px-2 text-center shrink-0 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
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

