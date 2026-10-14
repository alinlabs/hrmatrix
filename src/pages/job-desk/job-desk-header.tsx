import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Settings, Sparkles } from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';

interface JobDeskHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  onAddPosition?: () => void;
  onOpenSettings?: () => void;
}

export const JobDeskHeader: React.FC<JobDeskHeaderProps> = ({
  search,
  onSearchChange,
  onAddPosition,
  onOpenSettings,
}) => {
  const navigate = useNavigate();
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
        title="Cari Posisi / Jabatan"
      >
        <Search className="w-4 h-4" />
        {search && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {/* 2. Card Icon Setting (jika tersedia handler atau navigasi) */}
      {onOpenSettings && (
        <button
          type="button"
          onClick={onOpenSettings}
          className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center"
          title="Pengaturan Posisi"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}

      {/* 3. Card Icon Plus */}
      {onAddPosition && (
        <button
          type="button"
          onClick={onAddPosition}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
          title="Tambah Posisi Baru"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageHeaderTitle 
        title="Katalog Job Desk" 
        subtitle="Standar & Template Posisi / Jabatan" 
        onBack={() => navigate('/employees')}
        hideHamburger={true}
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
          placeholder="Cari posisi atau jabatan..."
          onFilterClick={onOpenSettings}
        />
      )}
    </>
  );
};
