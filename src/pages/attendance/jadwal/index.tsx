import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Settings2, 
  CalendarDays, 
  ArrowRightLeft, 
  Layers 
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import { AttendanceConfig, WorkShift } from '../../../types';
import { useMobileNav, HideBottomNav } from '../../../context/MobileNavContext';
import { scrollToTop } from '../../../components/layout/ScrollToTop';
import { JadwalMatriks } from './jadwal-matriks';
import { JadwalPengaturan } from './jadwal-pengaturan';
import { JadwalPertukaran } from './jadwal-pertukaran';
import { JadwalTambahan } from './jadwal-tambahan';

interface Props {
  config: AttendanceConfig | null;
  onSubTabChange?: (subTab: 'matriks' | 'pengaturan' | 'pertukaran' | 'tambahan') => void;
}

export function JadwalContainer({ config, onSubTabChange }: Props) {
  // Navigation sub-tabs within Jadwal Shift
  const [subTab, setSubTab] = useState<'matriks' | 'pengaturan' | 'pertukaran' | 'tambahan'>('matriks');
  const { setHideBottomNav } = useMobileNav();

  React.useEffect(() => {
    if (onSubTabChange) {
      onSubTabChange(subTab);
    }
    setHideBottomNav(subTab !== 'matriks');
    scrollToTop();

    return () => {
      setHideBottomNav(false);
    };
  }, [subTab, onSubTabChange, setHideBottomNav]);

  // Live Config from Dexie settings table
  const dbConfig = useLiveQuery(async () => {
    try {
      const record = await db.settings.get('attendanceConfig');
      return record as unknown as AttendanceConfig;
    } catch {
      return undefined;
    }
  });
  const activeConfig = dbConfig || config;
  const isNormalMode = (activeConfig?.systemType || 'normal') === 'normal';

  // If currently on pertukaran tab in normal mode, automatically fallback to matriks
  React.useEffect(() => {
    if (isNormalMode && subTab === 'pertukaran') {
      setSubTab('matriks');
    }
  }, [isNormalMode, subTab]);

  // Master shifts from config
  const availableShifts = useMemo<WorkShift[]>(() => {
    if (activeConfig?.shifts && activeConfig.shifts.length > 0) {
      return activeConfig.shifts;
    }
    return [
      { id: 'PAGI', code: 'PAGI', name: 'Shift Pagi (07:00 - 16:00)', startTime: '07:00', endTime: '16:00', breakStartTime: '12:00', breakEndTime: '13:00', color: 'blue' },
      { id: 'SIANG', code: 'SIANG', name: 'Shift Siang (15:00 - 00:00)', startTime: '15:00', endTime: '00:00', breakStartTime: '18:00', breakEndTime: '19:00', crossDay: true, color: 'amber' },
      { id: 'MALAM', code: 'MALAM', name: 'Shift Malam (23:00 - 08:00)', startTime: '23:00', endTime: '08:00', breakStartTime: '03:00', breakEndTime: '04:00', crossDay: true, color: 'purple' },
    ];
  }, [activeConfig]);

  // Live badge counts
  const shiftSwaps = useLiveQuery(async () => {
    try {
      if (!db.shiftSwaps) return [];
      return await db.shiftSwaps.toArray();
    } catch {
      return [];
    }
  }) || [];

  const extraShifts = useLiveQuery(async () => {
    try {
      if (!db.extraShifts) return [];
      return await db.extraShifts.toArray();
    } catch {
      return [];
    }
  }) || [];

  // Helper color badge for shifts
  const getShiftBadge = (shiftId: string, shiftNameStr?: string) => {
    // Match in availableShifts by id, code, or name
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

    // Always strip parenthetical notes like (Kantor) or (Office)
    if (codeText && codeText.includes('(')) {
      codeText = codeText.replace(/\s*\(.*?\)/g, '').trim();
    }

    // Fallback if empty
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

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
      {/* Sub Tab Components */}
      {subTab === 'matriks' && (
        <JadwalMatriks 
          activeConfig={activeConfig} 
          availableShifts={availableShifts} 
          getShiftBadge={getShiftBadge} 
          onOpenSettings={() => setSubTab('pengaturan')}
          onOpenLembur={() => setSubTab('tambahan')}
          onOpenTukarShift={() => setSubTab('pertukaran')}
          onOpenTambahShift={() => setSubTab('tambahan')}
        />
      )}

      {subTab === 'pengaturan' && (
        <JadwalPengaturan 
          activeConfig={activeConfig} 
          availableShifts={availableShifts} 
          onBack={() => setSubTab('matriks')}
        />
      )}

      {subTab === 'pertukaran' && (
        <JadwalPertukaran 
          activeConfig={activeConfig}
          availableShifts={availableShifts} 
          getShiftBadge={getShiftBadge} 
          onBack={() => setSubTab('matriks')}
        />
      )}

      {subTab === 'tambahan' && (
        <JadwalTambahan 
          activeConfig={activeConfig}
          availableShifts={availableShifts} 
          getShiftBadge={getShiftBadge} 
          onBack={() => setSubTab('matriks')}
        />
      )}
    </div>
  );
}
