import React from 'react';
import { Clock, Tag, Shield, UserCheck } from 'lucide-react';
import { BillingMode } from './types';
import { PROMO_BILLING_TABS } from './utils-helper';

interface PromoBillingSwitcherProps {
  billingMode: BillingMode;
  onBillingModeChange: (mode: BillingMode) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Clock,
  Tag,
  Shield,
  UserCheck
};

export function PromoBillingSwitcher({ billingMode, onBillingModeChange }: PromoBillingSwitcherProps) {
  return (
    <div className="w-full p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-2xs">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 w-full">
        {PROMO_BILLING_TABS.map((tab) => {
          const Icon = ICON_MAP[tab.iconName] || Tag;
          const isActive = billingMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onBillingModeChange(tab.id)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? (tab.id === 'agent' 
                      ? 'bg-linear-to-r from-violet-600 to-blue-600 text-white shadow-xs' 
                      : 'bg-blue-600 text-white shadow-xs')
                  : 'text-slate-400 opacity-60 hover:opacity-100 hover:text-slate-600 hover:bg-white/70'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PromoBillingSwitcher;
