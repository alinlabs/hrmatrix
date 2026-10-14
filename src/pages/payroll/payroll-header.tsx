import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';
import { PayrollHeaderProps } from './types';

export const PayrollHeader: React.FC<PayrollHeaderProps> = ({
  search,
  onSearchChange,
  onAddPeriod,
  title = "Periode Payroll",
  subtitle = "Standar & Pemrosesan Gaji Karyawan",
  onBack,
  hideHamburger,
  searchPlaceholder = "Cari nama periode, bulan, tahun, status...",
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* 1. Card Icon Search */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          search
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari Periode Payroll"
      >
        <Search className="w-4 h-4" />
        {search && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {/* 2. Card Icon Plus - Buat Periode */}
      {onAddPeriod && (
        <button
          type="button"
          onClick={onAddPeriod}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
          title="Buat Periode Baru"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageHeaderTitle 
        title={title} 
        subtitle={subtitle} 
        onBack={onBack}
        hideHamburger={hideHamburger}
      />

      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={onSearchChange}
          onClose={() => setIsSearchOpen(false)}
          placeholder={searchPlaceholder}
        />
      )}
    </>
  );
};

