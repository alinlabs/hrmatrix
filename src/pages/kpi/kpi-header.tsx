import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings, Plus, Wrench } from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';
import { KPIHeaderProps } from './types';

export function KPIHeader({
  title,
  subtitle = 'Standar & Evaluasi Kinerja Karyawan Bulanan',
  onBack,
  hideHamburger,
  search,
  onSearchChange,
  onOpenGeneralCatalog,
  onOpenSettings,
  onAddPeriod,
  showAddPeriod = true,
  showSettings = true,
  showGeneralCatalog = true,
  showLightbulb = false,
  showSearch = true,
  onOpenLightbulb,
  searchPlaceholder = 'Cari karyawan, periode...'
}: KPIHeaderProps) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* 1. Card Icon Search */}
      {showSearch && (
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
            search
              ? 'border-blue-300 text-blue-600 bg-blue-50/50'
              : 'border-slate-200 text-slate-700 hover:text-blue-600'
          }`}
          title="Cari Karyawan / Periode"
        >
          <Search className="w-4 h-4" />
          {search && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          )}
        </button>
      )}

      {/* 3. Card Icon Setting - Konfigurasi & Aturan Penilaian KPI (Hanya di Header Awal) */}
      {showSettings && onOpenSettings && (
        <button
          type="button"
          onClick={onOpenSettings}
          className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative"
          title="Konfigurasi & Aturan Penilaian KPI"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}

      {/* 4. Card Icon Plus - Buka Periode KPI Baru (Hanya di Header Awal) */}
      {showAddPeriod && onAddPeriod && (
        <button
          type="button"
          onClick={onAddPeriod}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
          title="Buka Periode KPI Baru"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}

      {/* 5. Card Icon Wrench/Tools - Asisten & Mode Penilaian KPI (Di Halaman Detail KPI) */}
      {showLightbulb && onOpenLightbulb && (
        <button
          type="button"
          onClick={onOpenLightbulb}
          className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative"
          title="Asisten & Mode Penilaian KPI"
        >
          <Wrench className="w-4 h-4" />
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

      {/* Expanded Header Search - only rendered when user clicks search icon */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={onSearchChange}
          onClose={() => {
            setIsSearchOpen(false);
            onSearchChange('');
          }}
          placeholder={searchPlaceholder}
          onFilterClick={onOpenSettings}
        />
      )}
    </>
  );
}
