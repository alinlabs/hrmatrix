import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  CalendarDays, 
  ArrowRightLeft, 
  Layers 
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { AttendanceConfig, WorkShift } from '../../types';
import { useMobileNav, PageHeaderSubbar } from '../../context/MobileNavContext';
import { scrollToTop } from '../../components/layout/ScrollToTop';
import { getAttendanceConfig, FIVE_DEFAULT_SHIFTS } from '../../services/attendanceConfigService';
import { JadwalMatriks } from './jadwal-matriks';
import { JadwalPengaturan } from './jadwal-pengaturan';
import { JadwalPertukaran } from './jadwal-pertukaran';
import { JadwalTambahan } from './jadwal-tambahan';

interface Props {
  config?: AttendanceConfig | null;
  onSubTabChange?: (subTab: 'matriks' | 'pengaturan' | 'pertukaran' | 'tambahan') => void;
}

export function JadwalContainer({ config, onSubTabChange }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Live Config from Dexie settings table
  const dbConfig = useLiveQuery(async () => {
    return await getAttendanceConfig();
  });
  const activeConfig = dbConfig || config;
  const isNormalMode = (activeConfig?.systemType || 'normal') === 'normal';

  const parseTab = (param: string | null): 'matriks' | 'pengaturan' | 'pertukaran' | 'tambahan' => {
    if (param === 'pertukaran' || param === 'tukar-shift') {
      return isNormalMode ? 'matriks' : 'pertukaran';
    }
    if (param === 'tambahan' || param === 'lembur') return 'tambahan';
    if (param === 'pengaturan') return 'pengaturan';
    return 'matriks';
  };

  // Navigation sub-tabs within Jadwal Shift
  const [subTab, setSubTab] = useState<'matriks' | 'pengaturan' | 'pertukaran' | 'tambahan'>(() => parseTab(tabParam));
  const { setHideBottomNav } = useMobileNav();

  useEffect(() => {
    const valid = parseTab(tabParam);
    if (valid !== subTab) {
      setSubTab(valid);
    }
  }, [tabParam, isNormalMode]);

  useEffect(() => {
    if (onSubTabChange) {
      onSubTabChange(subTab);
    }
    setHideBottomNav(subTab !== 'matriks' && subTab !== 'tambahan');
    scrollToTop();

    return () => {
      setHideBottomNav(false);
    };
  }, [subTab, onSubTabChange, setHideBottomNav]);

  // If currently on pertukaran tab in normal mode, automatically fallback to matriks
  useEffect(() => {
    if (isNormalMode && subTab === 'pertukaran') {
      handleTabChange('matriks');
    }
  }, [isNormalMode, subTab]);

  const handleTabChange = (newSubTab: 'matriks' | 'pengaturan' | 'pertukaran' | 'tambahan') => {
    setSubTab(newSubTab);
    const paramVal = newSubTab === 'matriks' ? 'kalender' : newSubTab === 'pertukaran' ? 'tukar-shift' : newSubTab === 'tambahan' ? 'lembur' : 'pengaturan';
    setSearchParams({ tab: paramVal }, { replace: true });
    scrollToTop();
  };

  // Master shifts from config
  const availableShifts = useMemo<WorkShift[]>(() => {
    if (activeConfig?.shifts && activeConfig.shifts.length > 0) {
      return activeConfig.shifts;
    }
    return FIVE_DEFAULT_SHIFTS;
  }, [activeConfig]);

  // Helper color badge for shifts
  const getShiftBadge = (shiftId: string, shiftNameStr?: string) => {
    const found = availableShifts.find(s => 
      s.id === shiftId || 
      s.code === shiftId || 
      (s.name && s.name.toLowerCase() === shiftId?.toLowerCase())
    );

    let codeText = found?.code;

    if (!codeText) {
      if (!shiftId || shiftId === 'OFF' || shiftId === 'LIBUR' || shiftId === 'shift-off') {
        codeText = 'OFF';
      } else if (shiftId === 'NORMAL' || shiftId === 'REGULER' || shiftId === 'shift-reguler' || shiftId === 'NON SHIFT') {
        codeText = 'NON SHIFT';
      } else if (shiftNameStr) {
        const uppercaseStr = shiftNameStr.toUpperCase();
        if (uppercaseStr.includes('NON SHIFT')) {
          codeText = 'NON SHIFT';
        } else if (uppercaseStr.includes('OFF') || uppercaseStr.includes('LIBUR')) {
          codeText = 'OFF';
        } else if (uppercaseStr.includes('PAGI')) {
          codeText = 'PAGI';
        } else if (uppercaseStr.includes('SIANG')) {
          codeText = 'SIANG';
        } else if (uppercaseStr.includes('MALAM')) {
          codeText = 'MALAM';
        } else if (uppercaseStr.includes('MIDDLE')) {
          codeText = 'MIDDLE';
        } else {
          codeText = shiftNameStr;
        }
      } else {
        codeText = shiftId;
      }
    }

    if (codeText && codeText.includes('(')) {
      codeText = codeText.replace(/\s*\(.*?\)/g, '').trim();
    }

    if (!codeText) codeText = 'NON SHIFT';

    const isOff = codeText === 'OFF' || found?.isOff || shiftId === 'OFF' || shiftId === 'shift-off';
    const isNonShift = codeText === 'NON SHIFT' || shiftId === 'shift-reguler' || shiftId === 'REGULER';
    
    const color = found?.color || (isOff ? 'rose' : isNonShift ? 'emerald' : 'blue');

    if (color && color.startsWith('#')) {
      return (
        <span 
          style={{
            backgroundColor: `${color}18`,
            color: color,
            borderColor: `${color}40`,
          }}
          className="px-1.5 py-0.5 rounded text-[10px] font-bold border block text-center truncate"
        >
          {codeText}
        </span>
      );
    }

    const colorClasses: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      gray: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    const finalClass = colorClasses[color] || (isOff ? colorClasses.rose : isNonShift ? colorClasses.emerald : colorClasses.blue);

    return (
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border block text-center truncate ${finalClass}`}>
        {codeText}
      </span>
    );
  };

  const navTabs = isNormalMode
    ? [
        { id: 'matriks' as const, label: 'Kalender', icon: CalendarDays },
        { id: 'tambahan' as const, label: 'Lembur', icon: Layers },
      ]
    : [
        { id: 'matriks' as const, label: 'Kalender', icon: CalendarDays },
        { id: 'pertukaran' as const, label: 'Tukar Shift', icon: ArrowRightLeft },
        { id: 'tambahan' as const, label: 'Lembur', icon: Layers },
      ];

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-150">
      {/* Top Page Subbar Navigation for Jadwal */}
      {subTab !== 'pengaturan' && (
        <PageHeaderSubbar>
          <div className="flex items-center justify-between w-full px-3 sm:px-8 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
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
      )}

      {/* Sub Tab Components */}
      {subTab === 'matriks' && (
        <JadwalMatriks 
          activeConfig={activeConfig} 
          availableShifts={availableShifts} 
          getShiftBadge={getShiftBadge} 
          onOpenSettings={() => handleTabChange('pengaturan')}
          onOpenLembur={() => handleTabChange('tambahan')}
          onOpenTukarShift={() => handleTabChange('pertukaran')}
          onOpenTambahShift={() => handleTabChange('tambahan')}
        />
      )}

      {subTab === 'pengaturan' && (
        <JadwalPengaturan 
          activeConfig={activeConfig} 
          availableShifts={availableShifts} 
          onBack={() => handleTabChange('matriks')}
        />
      )}

      {subTab === 'pertukaran' && !isNormalMode && (
        <JadwalPertukaran 
          activeConfig={activeConfig}
          availableShifts={availableShifts} 
          getShiftBadge={getShiftBadge} 
          onBack={() => handleTabChange('matriks')}
        />
      )}

      {subTab === 'tambahan' && (
        <JadwalTambahan 
          activeConfig={activeConfig}
          availableShifts={availableShifts} 
          getShiftBadge={getShiftBadge} 
          onBack={() => handleTabChange('matriks')}
        />
      )}
    </div>
  );
}

export { JadwalContainer as default, JadwalContainer as JadwalPage };
