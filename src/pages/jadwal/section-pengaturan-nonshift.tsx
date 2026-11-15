import React from 'react';
import { Clock, Layers } from 'lucide-react';
import { AttendanceConfig } from '../../types';
import { FIVE_DEFAULT_SHIFTS } from '../../services/attendanceConfigService';

export const DAYS_OF_WEEK = [
  { key: 'senin', label: 'Senin' },
  { key: 'selasa', label: 'Selasa' },
  { key: 'rabu', label: 'Rabu' },
  { key: 'kamis', label: 'Kamis' },
  { key: 'jumat', label: 'Jumat' },
  { key: 'sabtu', label: 'Sabtu' },
  { key: 'minggu', label: 'Minggu' },
] as const;

export function getDayScheduleConfig(config: AttendanceConfig | null, dayKey: string) {
  const custom = config?.normalDailySchedules?.[dayKey];
  if (custom) return custom;

  const workDays = config?.normalWorkDays ?? 5;
  const isDefaultActive = dayKey === 'sabtu' ? workDays === 6 : dayKey !== 'minggu';

  return {
    active: isDefaultActive,
    startTime: config?.normalStartTime || '08:00',
    endTime: config?.normalEndTime || '17:00',
    breakStartTime: config?.normalBreakStartTime || '12:00',
    breakEndTime: config?.normalBreakEndTime || '13:00',
  };
}

interface SectionPengaturanNonShiftProps {
  activeConfig: AttendanceConfig | null;
  systemType: AttendanceConfig['systemType'];
  showNormalHours: boolean;
  onSaveConfig: (newCfg: AttendanceConfig) => Promise<void>;
  onToggleDayActive: (dayKey: string) => Promise<void>;
  onUpdateDayTime: (
    dayKey: string,
    field: 'startTime' | 'endTime' | 'breakStartTime' | 'breakEndTime',
    value: string
  ) => Promise<void>;
}

export function SectionPengaturanNonShift({
  activeConfig,
  systemType,
  showNormalHours,
  onSaveConfig,
  onToggleDayActive,
  onUpdateDayTime,
}: SectionPengaturanNonShiftProps) {
  return (
    <>
      {/* 0. SELEKSI MODEL KERJA UTAMA */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          Model Kerja Utama
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'normal' as const, title: 'Non Shift' },
            { id: 'shift' as const, title: 'Shift' },
          ].map((m) => {
            const isSelected = systemType === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={async () => {
                  if (!activeConfig) return;
                  const currentShifts = [...(activeConfig.shifts || [])];
                  if (m.id === 'shift') {
                    // Ensure all 5 default shifts exist (NON SHIFT, Pagi, Siang, Malam, Off)
                    const hasReguler = currentShifts.some(s => s.code === 'REGULER' || s.id === 'shift-reguler');
                    const hasPagi = currentShifts.some(s => s.code === 'PAGI' || s.id === 'shift-1-pagi');
                    const hasSiang = currentShifts.some(s => s.code === 'SIANG' || s.id === 'shift-2-siang');
                    const hasMalam = currentShifts.some(s => s.code === 'MALAM' || s.id === 'shift-3-malam');
                    const hasOff = currentShifts.some(s => s.code === 'OFF' || s.id === 'shift-off' || s.isOff);

                    if (!hasReguler) currentShifts.unshift(FIVE_DEFAULT_SHIFTS[0]);
                    if (!hasPagi) currentShifts.push(FIVE_DEFAULT_SHIFTS[1]);
                    if (!hasSiang) currentShifts.push(FIVE_DEFAULT_SHIFTS[2]);
                    if (!hasMalam) currentShifts.push(FIVE_DEFAULT_SHIFTS[3]);
                    if (!hasOff) currentShifts.push(FIVE_DEFAULT_SHIFTS[4]);
                  }
                  await onSaveConfig({ ...activeConfig, systemType: m.id, shifts: currentShifts });
                }}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs sm:text-sm flex items-center justify-center ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Pengaturan Jam Kerja NON SHIFT / Normal (Office) */}
      {showNormalHours && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              Pengaturan Jam Kerja
            </h3>
          </div>

          <div className="space-y-2.5">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule = getDayScheduleConfig(activeConfig, day.key);
              const isDayActive = daySchedule.active;

              return (
                <div
                  key={day.key}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs transition-all"
                >
                  {/* Baris Atas: Nama Hari (Kiri) & Seekbar (Kanan) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${isDayActive ? 'bg-blue-600' : 'bg-rose-500'}`} />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {day.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {!isDayActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-500 text-white border border-rose-600/20 tracking-wide">
                          OFF DAY
                        </span>
                      )}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isDayActive}
                        onClick={() => onToggleDayActive(day.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isDayActive ? 'bg-blue-600' : 'bg-rose-500'
                        }`}
                        title={isDayActive ? `Nonaktifkan ${day.label}` : `Aktifkan ${day.label}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            isDayActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Baris Bawah (Jika Aktif): Teks Label & 4 Kolom Jam */}
                  {isDayActive && (
                    <div className="mt-3.5 space-y-1.5">
                      {/* Label Teks di Atas Kelompok Card Jam */}
                      <div className="grid grid-cols-2 gap-3 px-0.5 text-[11px] font-semibold text-slate-500">
                        <span>Jam Masuk & Pulang Kerja</span>
                        <span>Jam Istirahat & Selesai</span>
                      </div>

                      {/* 4 Kolom Input Jam */}
                      <div className="flex items-center gap-1.5 sm:gap-2.5 w-full">
                        {/* Jam Masuk Kerja */}
                        <div className="relative flex-1 min-w-0">
                          <div className="w-full h-10 px-2 sm:px-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-colors">
                            {(daySchedule.startTime || '08:00').replace(':', '.')}
                          </div>
                          <input
                            type="time"
                            value={daySchedule.startTime || '08:00'}
                            onChange={(e) => onUpdateDayTime(day.key, 'startTime', e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                        </div>

                        <span className="text-slate-400 font-bold shrink-0 text-xs sm:text-sm">-</span>

                        {/* Jam Pulang Kerja */}
                        <div className="relative flex-1 min-w-0">
                          <div className="w-full h-10 px-2 sm:px-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-colors">
                            {(daySchedule.endTime || '17:00').replace(':', '.')}
                          </div>
                          <input
                            type="time"
                            value={daySchedule.endTime || '17:00'}
                            onChange={(e) => onUpdateDayTime(day.key, 'endTime', e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                        </div>

                        <div className="w-1 sm:w-2 shrink-0" />

                        {/* Jam Mulai Istirahat */}
                        <div className="relative flex-1 min-w-0">
                          <div className="w-full h-10 px-2 sm:px-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-colors">
                            {(daySchedule.breakStartTime || activeConfig?.normalBreakStartTime || '12:00').replace(':', '.')}
                          </div>
                          <input
                            type="time"
                            value={daySchedule.breakStartTime || activeConfig?.normalBreakStartTime || '12:00'}
                            onChange={(e) => onUpdateDayTime(day.key, 'breakStartTime', e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                        </div>

                        <span className="text-slate-400 font-bold shrink-0 text-xs sm:text-sm">-</span>

                        {/* Jam Selesai Istirahat */}
                        <div className="relative flex-1 min-w-0">
                          <div className="w-full h-10 px-2 sm:px-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-colors">
                            {(daySchedule.breakEndTime || activeConfig?.normalBreakEndTime || '13:00').replace(':', '.')}
                          </div>
                          <input
                            type="time"
                            value={daySchedule.breakEndTime || activeConfig?.normalBreakEndTime || '13:00'}
                            onChange={(e) => onUpdateDayTime(day.key, 'breakEndTime', e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
