import React from 'react';
import { Check, Plus, Pencil } from 'lucide-react';
import { 
  JobTemplate, 
  WorkScheduleConfig, 
  WorkPatternType, 
  WorkDaysOption 
} from './types';
import { 
  ShiftPatternOption, 
  resolveJobWorkSchedule, 
  getShiftBadgeInfo 
} from './utils-helper';
import { WorkShift } from '../../types';
import { 
  getShiftBadgeStyle, 
  getShiftBadgeClasses 
} from '../../services/attendanceConfigService';
import { ToggleSwitch } from './section-compensation';

export const format4DigitTime = (prevVal: string, rawInput: string): string => {
  if (rawInput === prevVal) return rawInput;

  let digits = rawInput.replace(/\D/g, '');

  if (rawInput.length < prevVal.length) {
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  }

  if (digits.length > 4) digits = digits.slice(0, 4);

  if (digits.length >= 2) {
    let hhStr = digits.slice(0, 2);
    let hh = parseInt(hhStr, 10);
    if (isNaN(hh)) hh = 0;
    if (hh > 23) hh = 23;
    hhStr = hh.toString().padStart(2, '0');

    let mmStr = digits.slice(2);
    if (mmStr.length === 2) {
      let mm = parseInt(mmStr, 10);
      if (isNaN(mm)) mm = 0;
      if (mm > 59) mm = 59;
      mmStr = mm.toString().padStart(2, '0');
    } else if (mmStr.length === 1) {
      let m1 = parseInt(mmStr, 10);
      if (m1 > 5) m1 = 5;
      mmStr = m1.toString();
    }

    return `${hhStr}:${mmStr}`;
  }

  let h1 = parseInt(digits, 10);
  if (h1 > 2) h1 = 2;
  return h1.toString();
};

interface SectionWorkScheduleProps {
  formData: JobTemplate;
  setFormData: React.Dispatch<React.SetStateAction<JobTemplate>>;
  availableShiftPatterns: ShiftPatternOption[];
  nonOffShifts: WorkShift[];
  openShiftModal: (shift?: WorkShift) => void;
  openPatternModal: () => void;
  isPatternModalOpen: boolean;
}

export const SectionWorkSchedule: React.FC<SectionWorkScheduleProps> = ({
  formData,
  setFormData,
  availableShiftPatterns,
  nonOffShifts,
  openShiftModal,
  openPatternModal,
  isPatternModalOpen
}) => {
  const currentSchedule = formData.waktuKerja || resolveJobWorkSchedule(formData);
  const polaKerjaVal: WorkPatternType = currentSchedule.polaKerja || (currentSchedule.scheduleType === 'SHIFT' ? 'Shift' : 'Non Shift');
  const hariKerjaVal: WorkDaysOption = currentSchedule.hariKerja || (currentSchedule.scheduleType === '6_HARI' ? '6 Hari' : currentSchedule.scheduleType === 'SHIFT' ? '6 Hari' : '5 Hari');

  const defaultDays = hariKerjaVal === '7 Hari'
    ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    : hariKerjaVal === '6 Hari'
    ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const activeDaysList: string[] = currentSchedule.hariKerjaList && currentSchedule.hariKerjaList.length > 0
    ? currentSchedule.hariKerjaList
    : defaultDays;

  const jamMasukVal = currentSchedule.jamMasuk || (polaKerjaVal === 'Shift' ? '07:00' : hariKerjaVal === '6 Hari' ? '08:00' : '08:30');
  const jamPulangVal = currentSchedule.jamPulang || (polaKerjaVal === 'Shift' ? '16:00' : hariKerjaVal === '6 Hari' ? '16:00' : '17:30');
  const istirahatMulaiVal = currentSchedule.jamIstirahatMulai || (polaKerjaVal === 'Shift' ? '12:00' : '12:00');
  const istirahatSelesaiVal = currentSchedule.jamIstirahatSelesai || (polaKerjaVal === 'Shift' ? '13:00' : '13:00');

  const ALL_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const handleUpdateSchedule = (updates: Partial<WorkScheduleConfig>) => {
    setFormData(prev => {
      const base = prev.waktuKerja || resolveJobWorkSchedule(prev);
      return {
        ...prev,
        waktuKerja: {
          ...base,
          ...updates
        }
      };
    });
  };

  const calculateMinutesBetween = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const [h1, m1] = startTime.split(':').map(Number);
    const [h2, m2] = endTime.split(':').map(Number);
    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return 0;
    let startM = h1 * 60 + m1;
    let endM = h2 * 60 + m2;
    if (endM < startM) endM += 24 * 60;
    return Math.max(0, endM - startM);
  };

  const calculateScheduleMetrics = (masuk: string, pulang: string, restMulai: string, restSelesai: string, daysCount: number) => {
    const restDurationMins = calculateMinutesBetween(restMulai, restSelesai) || 60;
    const grossDurationMins = calculateMinutesBetween(masuk, pulang) || 540;
    const netDurationMins = Math.max(0, grossDurationMins - restDurationMins);
    const daily = Math.round((netDurationMins / 60) * 10) / 10;
    const weekly = Math.round(daily * daysCount * 10) / 10;
    return { restDurationMins, daily, weekly };
  };

  const calcMetrics = calculateScheduleMetrics(
    jamMasukVal,
    jamPulangVal,
    istirahatMulaiVal,
    istirahatSelesaiVal,
    activeDaysList.length
  );

  const handleTimeInputsChange = (masuk: string, pulang: string, restMulai: string, restSelesai: string) => {
    const metrics = calculateScheduleMetrics(masuk, pulang, restMulai, restSelesai, activeDaysList.length);
    const jamIstirahatRange = `${restMulai} - ${restSelesai}`;
    const workingHoursText = `${masuk} - ${pulang} WIB (${metrics.daily} Jam Kerja Efektif)`;
    const restHoursText = `${jamIstirahatRange} WIB (${metrics.restDurationMins} Menit - Tidak Dihitung Jam Kerja)`;

    handleUpdateSchedule({
      jamMasuk: masuk,
      jamPulang: pulang,
      jamIstirahatMulai: restMulai,
      jamIstirahatSelesai: restSelesai,
      jamIstirahat: jamIstirahatRange,
      waktuIstirahatMenit: metrics.restDurationMins,
      workingHours: workingHoursText,
      restHours: restHoursText,
      totalJamKerja: metrics.weekly,
      totalHoursPerWeek: metrics.weekly
    });
  };

  const handleToggleDay = (day: string) => {
    let updatedDays: string[];
    if (activeDaysList.includes(day)) {
      if (activeDaysList.length <= 1) return;
      updatedDays = activeDaysList.filter(d => d !== day);
    } else {
      const nextSet = new Set([...activeDaysList, day]);
      updatedDays = ALL_DAYS.filter(d => nextSet.has(d));
    }

    let newHariOption: WorkDaysOption = '5 Hari';
    if (updatedDays.length >= 7) newHariOption = '7 Hari';
    else if (updatedDays.length === 6) newHariOption = '6 Hari';
    else newHariOption = '5 Hari';

    const newMetrics = calculateScheduleMetrics(
      jamMasukVal,
      jamPulangVal,
      istirahatMulaiVal,
      istirahatSelesaiVal,
      updatedDays.length
    );
    const workDaysText = `${updatedDays.join(', ')} (${updatedDays.length} Hari Kerja per Minggu)`;

    handleUpdateSchedule({
      hariKerjaList: updatedDays,
      hariKerja: newHariOption,
      workDays: workDaysText,
      totalJamKerja: newMetrics.weekly,
      totalHoursPerWeek: newMetrics.weekly
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Pola Kerja Selection (Non Shift vs Shift) - Direct on Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            const defDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
            const newCalc = calculateScheduleMetrics('08:30', '17:30', '12:00', '13:00', defDays.length);
            handleUpdateSchedule({
              polaKerja: 'Non Shift',
              scheduleType: '5_HARI',
              hariKerja: '5 Hari',
              hariKerjaList: defDays,
              jamMasuk: '08:30',
              jamPulang: '17:30',
              jamIstirahatMulai: '12:00',
              jamIstirahatSelesai: '13:00',
              jamIstirahat: '12:00 - 13:00',
              waktuIstirahatMenit: 60,
              totalJamKerja: newCalc.weekly,
              totalHoursPerWeek: newCalc.weekly,
              workDays: 'Senin s/d Jumat (5 Hari Kerja per Minggu)',
              workingHours: '08:30 - 17:30 WIB (8 Jam Kerja Efektif)',
              restHours: '12:00 - 13:00 WIB (60 Menit - Tidak Dihitung Jam Kerja)',
              shiftDescription: 'Non-Shift (Reguler Office Hours)'
            });
          }}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
            polaKerjaVal === 'Non Shift'
              ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
              : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Non Shift</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-bold">Reguler</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Jam kerja tetap operasional harian (kantor / non-rotasi), waktu kerja standar dengan jam masuk, istirahat, dan jam pulang teratur.
            </p>
          </div>
          {polaKerjaVal === 'Non Shift' && (
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            const defaultPat = availableShiftPatterns.find(p => p.id === currentSchedule.polaShiftId) || availableShiftPatterns[0];
            const defDays = defaultPat.defaultDays || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const newCalc = calculateScheduleMetrics(
              defaultPat.jamMasuk,
              defaultPat.jamPulang,
              defaultPat.jamIstirahatMulai,
              defaultPat.jamIstirahatSelesai,
              defDays.length
            );
            handleUpdateSchedule({
              polaKerja: 'Shift',
              scheduleType: 'SHIFT',
              polaShiftId: defaultPat.id,
              polaShiftName: defaultPat.name,
              polaShiftCycle: defaultPat.cycle,
              hariKerja: defaultPat.defaultHariKerja,
              hariKerjaList: defDays,
              jamMasuk: defaultPat.jamMasuk,
              jamPulang: defaultPat.jamPulang,
              jamIstirahatMulai: defaultPat.jamIstirahatMulai,
              jamIstirahatSelesai: defaultPat.jamIstirahatSelesai,
              jamIstirahat: `${defaultPat.jamIstirahatMulai} - ${defaultPat.jamIstirahatSelesai}`,
              waktuIstirahatMenit: newCalc.restDurationMins,
              totalJamKerja: newCalc.weekly,
              totalHoursPerWeek: newCalc.weekly,
              workDays: defaultPat.workDays,
              workingHours: defaultPat.workingHours,
              shiftDescription: defaultPat.shiftDescription
            });
          }}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
            polaKerjaVal === 'Shift'
              ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/20 shadow-2xs'
              : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Shift</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10px] font-bold">Roster / Bergilir</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Sistem kerja bergilir / roster rotasi (Pagi, Siang, Malam) untuk operasional berkelanjutan atau 24 jam.
            </p>
          </div>
          {polaKerjaVal === 'Shift' && (
            <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </button>
      </div>

      {/* Pilihan Cepat Pola Roster ketika PolaKerja === Shift */}
      {polaKerjaVal === 'Shift' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* SHIFT MASTER */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-900">
                Shift Master
              </label>
              <button
                type="button"
                onClick={() => openShiftModal()}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Shift</span>
              </button>
            </div>

            {/* List Kartu Master Shift */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {nonOffShifts.map((shift) => (
                <div
                  key={shift.id}
                  onClick={() => openShiftModal(shift)}
                  className="p-3 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs rounded-xl transition-all flex flex-col justify-between gap-2 cursor-pointer group select-none"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-slate-400 font-normal leading-tight">Nama Shift</span>
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors mt-0.5">
                        {shift.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        style={getShiftBadgeStyle(shift.color)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${getShiftBadgeClasses(shift.color)}`}
                      >
                        {shift.code}
                      </span>
                      <div className="p-1 rounded text-slate-400 group-hover:text-blue-600 transition-colors">
                        <Pencil className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {!shift.isOff && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                      <div className="p-1.5 bg-slate-50 border border-slate-200/70 rounded-lg text-center min-w-0">
                        <span className="block text-[9px] text-slate-400 leading-tight">Jam Kerja</span>
                        <span className="block text-[11px] font-bold text-slate-800 truncate mt-0.5">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>
                      <div className="p-1.5 bg-slate-50 border border-slate-200/70 rounded-lg text-center min-w-0">
                        <span className="block text-[9px] text-slate-400 leading-tight">Jam Istirahat</span>
                        <span className="block text-[11px] font-bold text-slate-800 truncate mt-0.5">
                          {shift.breakStartTime ? `${shift.breakStartTime} - ${shift.breakEndTime}` : '-'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* POLA SHIFT KERJA */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-900">
                Pola shift kerja <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={openPatternModal}
                className={`text-xs font-semibold transition-colors cursor-pointer ${
                  isPatternModalOpen
                    ? 'text-purple-700 font-bold underline'
                    : 'text-blue-600 hover:text-blue-700 hover:underline'
                }`}
              >
                Buat Customisasi Shift
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {availableShiftPatterns.filter(pat => !pat.isCustom && pat.id !== 'pat-custom').map((pat) => {
                const isSelected = (currentSchedule.polaShiftId === pat.id) || 
                  (!currentSchedule.polaShiftId && pat.id === 'pat-3shift-4group');
                return (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => {
                      const daysList = pat.defaultDays || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                      const newMetrics = calculateScheduleMetrics(
                        pat.jamMasuk,
                        pat.jamPulang,
                        pat.jamIstirahatMulai,
                        pat.jamIstirahatSelesai,
                        daysList.length
                      );
                      handleUpdateSchedule({
                        polaShiftId: pat.id,
                        polaShiftName: pat.name,
                        polaShiftCycle: pat.cycle,
                        hariKerja: pat.defaultHariKerja,
                        hariKerjaList: daysList,
                        jamMasuk: pat.jamMasuk,
                        jamPulang: pat.jamPulang,
                        jamIstirahatMulai: pat.jamIstirahatMulai,
                        jamIstirahatSelesai: pat.jamIstirahatSelesai,
                        jamIstirahat: `${pat.jamIstirahatMulai} - ${pat.jamIstirahatSelesai}`,
                        waktuIstirahatMenit: newMetrics.restDurationMins,
                        totalJamKerja: newMetrics.weekly,
                        totalHoursPerWeek: newMetrics.weekly,
                        workDays: pat.workDays,
                        workingHours: pat.workingHours,
                        shiftDescription: pat.shiftDescription
                      });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-2 relative ${
                      isSelected
                        ? 'bg-purple-50/60 border-purple-600 ring-2 ring-purple-500/30 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 leading-snug block">
                          {pat.name}
                        </span>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                          {pat.description}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-purple-600 text-white' : 'border border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>

                    {/* Cycle Badges Visual */}
                    {pat.cycle && pat.cycle.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5 border-t border-slate-100">
                        {pat.cycle.map((shiftCode, idx) => {
                          const badge = getShiftBadgeInfo(shiftCode);
                          return (
                            <span
                              key={`${pat.id}-c-${idx}`}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${badge.colorClass}`}
                              title={`${badge.label}: ${badge.timeRange}`}
                            >
                              {badge.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. NON-SHIFT MODE: RINCIAN JAM KERJA & ISTIRAHAT */}
      {polaKerjaVal !== 'Shift' && (
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* KELOMPOK 1: MASUK KERJA [Masuk] [Pulang] [Durasi (Jam)] */}
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-900">
                  Masuk Kerja
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center">
                    Masuk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    required
                    placeholder="08:00"
                    value={jamMasukVal}
                    onChange={(e) => {
                      const formatted = format4DigitTime(jamMasukVal, e.target.value);
                      handleTimeInputsChange(formatted, jamPulangVal, istirahatMulaiVal, istirahatSelesaiVal);
                    }}
                    className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center">
                    Pulang <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    required
                    placeholder="20:00"
                    value={jamPulangVal}
                    onChange={(e) => {
                      const formatted = format4DigitTime(jamPulangVal, e.target.value);
                      handleTimeInputsChange(jamMasukVal, formatted, istirahatMulaiVal, istirahatSelesaiVal);
                    }}
                    className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center">
                    Durasi (Jam) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={calcMetrics.daily}
                    onFocus={(e) => e.target.blur()}
                    onKeyDown={(e) => e.preventDefault()}
                    className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-center focus:outline-none focus:ring-0 shadow-2xs select-none cursor-default caret-transparent pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* KELOMPOK 2: ISTIRAHAT [Mulai] [Selesai] [Durasi (Menit)] */}
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-900">
                  Istirahat
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center">
                    Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    required
                    placeholder="12:00"
                    value={istirahatMulaiVal}
                    onChange={(e) => {
                      const formatted = format4DigitTime(istirahatMulaiVal, e.target.value);
                      handleTimeInputsChange(jamMasukVal, jamPulangVal, formatted, istirahatSelesaiVal);
                    }}
                    className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center">
                    Selesai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    required
                    placeholder="13:00"
                    value={istirahatSelesaiVal}
                    onChange={(e) => {
                      const formatted = format4DigitTime(istirahatSelesaiVal, e.target.value);
                      handleTimeInputsChange(jamMasukVal, jamPulangVal, istirahatMulaiVal, formatted);
                    }}
                    className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center">
                    Durasi (Menit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={calcMetrics.restDurationMins}
                    onFocus={(e) => e.target.blur()}
                    onKeyDown={(e) => e.preventDefault()}
                    className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-center focus:outline-none focus:ring-0 shadow-2xs select-none cursor-default caret-transparent pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. NON-SHIFT MODE: Hari Kerja Selector & Pilihan Hari Senin s/d Minggu */}
      {polaKerjaVal !== 'Shift' && (
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Hari Kerja <span className="text-rose-500">*</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
            {ALL_DAYS.map(day => {
              const isActive = activeDaysList.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(day)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <span>{day}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SHIFT MODE: Durasi Kerja per Hari & Kompensasi Lembur Sejajar (Side-by-Side) */}
      {polaKerjaVal === 'Shift' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 items-stretch pt-1 border-t border-slate-100 animate-in fade-in duration-200">
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center">
                  Jam Kerja / Shift (Jam) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  step={0.5}
                  required
                  value={currentSchedule.jamKerjaShift ?? (calcMetrics.daily || 8)}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    const totalWeekly = val * (currentSchedule.hariKerjaList?.length || 6);
                    handleUpdateSchedule({
                      jamKerjaShift: val,
                      totalJamKerja: totalWeekly,
                      totalHoursPerWeek: totalWeekly,
                      workingHours: `Rotasi Shift (${val} Jam Kerja / Shift)`
                    });
                  }}
                  placeholder="8"
                  className="w-full text-xs font-bold p-2.5 text-center border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 text-center">
                  Durasi Istirahat (Menit) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={240}
                  step={5}
                  required
                  value={currentSchedule.waktuIstirahatMenit ?? 60}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    handleUpdateSchedule({
                      waktuIstirahatMenit: val
                    });
                  }}
                  placeholder="60"
                  className="w-full text-xs font-bold p-2.5 text-center border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-center justify-between gap-3">
            <div className="pr-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Kompensasi Upah Lembur
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Aktivasi verifikasi kelayakan pengajuan lembur operasional posisi ini sesuai ketentuan PP No. 35/2021.
              </p>
            </div>
            <ToggleSwitch
              checked={currentSchedule.overtimeEligible ?? true}
              onChange={() => {
                const nextState = !(currentSchedule.overtimeEligible ?? true);
                handleUpdateSchedule({ 
                  overtimeEligible: nextState,
                  overtimeClause: nextState 
                    ? 'Dapat ditugaskan lembur operasional sesuai instruksi atasan dengan kompensasi resmi PP 35/2021'
                    : 'Posisi ini dikategorikan Non-Overtime (Kompensasi lembur tidak berlaku / melekat pada Tunjangan Jabatan).'
                });
              }}
              activeColor="bg-blue-600"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Kompensasi Upah Lembur
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Aktivasi verifikasi kelayakan pengajuan lembur operasional posisi ini sesuai ketentuan PP No. 35/2021.
              </p>
            </div>
            <ToggleSwitch
              checked={currentSchedule.overtimeEligible ?? true}
              onChange={() => {
                const nextState = !(currentSchedule.overtimeEligible ?? true);
                handleUpdateSchedule({ 
                  overtimeEligible: nextState,
                  overtimeClause: nextState 
                    ? 'Dapat ditugaskan lembur operasional sesuai instruksi atasan dengan kompensasi resmi PP 35/2021'
                    : 'Posisi ini dikategorikan Non-Overtime (Kompensasi lembur tidak berlaku / melekat pada Tunjangan Jabatan).'
                });
              }}
              activeColor="bg-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};
