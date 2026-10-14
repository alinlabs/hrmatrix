import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, X, Search, Check, ChevronDown } from 'lucide-react';
import { Button, Input, Select } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { AttendanceConfig, Attendance, Employee } from '../../types';
import { PresensiFormData } from './types';
import { db } from '../../db/database';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDropdownPlacement } from '../../utils/useDropdownPlacement';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';

interface ModalPresensiManualProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  editingAttendance: Attendance | null;
  activeEmployees: Employee[];
  selectedEmployee: Employee | undefined;
  attendanceConfig: AttendanceConfig | null;
  formData: PresensiFormData;
  setFormData: React.Dispatch<React.SetStateAction<PresensiFormData>>;
  onEmployeeChange: (empId: string) => void;
  onShiftChange: (shiftId: string) => void;
  onCheckInChange: (time: string) => void;
  onSave: (e: React.FormEvent) => void;
}

// Custom Searchable Combobox for Employee Selection
interface EmployeeComboboxProps {
  employees: Employee[];
  selectedEmployeeId: string;
  onSelect: (employeeId: string) => void;
  deptMap: Map<string, string>;
  posMap: Map<string, string>;
}

function EmployeeCombobox({
  employees,
  selectedEmployeeId,
  onSelect,
  deptMap,
  posMap,
}: EmployeeComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { maxHeight, dropdownClasses } = useDropdownPlacement({
    isOpen,
    containerRef,
    defaultMaxHeight: 260,
  });

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const q = searchQuery.toLowerCase().trim();
    return employees.filter(emp => {
      const nameMatch = emp.fullName.toLowerCase().includes(q);
      const idMatch = emp.employeeId.toLowerCase().includes(q);
      const nickMatch = emp.nickname?.toLowerCase().includes(q);
      const deptName = (deptMap.get(emp.departmentId) || '').toLowerCase();
      const posName = (posMap.get(emp.positionId) || '').toLowerCase();
      return nameMatch || idMatch || nickMatch || deptName.includes(q) || posName.includes(q);
    });
  }, [employees, searchQuery, deptMap, posMap]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 sm:p-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all text-left shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      >
        {selectedEmployee ? (
          <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
            <EmployeeAvatar employee={selectedEmployee} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                {selectedEmployee.fullName}
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate">
                {selectedEmployee.employeeId} {posMap.get(selectedEmployee.positionId) ? `• ${posMap.get(selectedEmployee.positionId)}` : ''}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-xs sm:text-sm text-slate-400 font-medium">
            Pilih Karyawan...
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div 
          style={{ maxHeight: `${maxHeight}px` }}
          className={`absolute z-50 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${dropdownClasses}`}
        >
          {/* Search Input Bar */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIK, divisi..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden py-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100/80 overscroll-contain">
            {filteredEmployees.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                Tidak ada karyawan yang cocok.
              </div>
            ) : (
              filteredEmployees.map((emp) => {
                const isSelected = emp.id === selectedEmployeeId;
                const posName = posMap.get(emp.positionId);
                const deptName = deptMap.get(emp.departmentId);

                return (
                  <div
                    key={emp.id}
                    onClick={() => {
                      onSelect(emp.id);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 sm:p-3 flex items-center justify-between gap-2.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <EmployeeAvatar employee={emp} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {emp.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          {emp.employeeId} {posName ? `• ${posName}` : (deptName ? `• ${deptName}` : '')}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ModalPresensiManual({
  isOpen,
  onClose,
  onBack,
  editingAttendance,
  activeEmployees,
  selectedEmployee,
  attendanceConfig,
  formData,
  setFormData,
  onEmployeeChange,
  onCheckInChange,
  onSave,
}: ModalPresensiManualProps) {
  // Live queries for Schedule, Swaps, Overtime (Extra Shifts), and Leaves
  const shiftSchedules = useLiveQuery(
    () => (formData.date ? db.shiftSchedules.where('date').equals(formData.date).toArray() : []),
    [formData.date]
  );

  const shiftSwaps = useLiveQuery(
    () => db.shiftSwaps.filter(s => s.status === 'Approved').toArray(),
    []
  );

  const extraShifts = useLiveQuery(
    () => (formData.date ? db.extraShifts.filter(e => e.workDate === formData.date && e.status === 'Approved').toArray() : []),
    [formData.date]
  );

  const leaves = useLiveQuery(
    () => (formData.date ? db.leaves.filter(l => l.startDate <= formData.date && l.endDate >= formData.date && l.status === 'Approved').toArray() : []),
    [formData.date]
  );

  const departments = useLiveQuery(() => db.departments.toArray(), []);
  const positions = useLiveQuery(() => db.positions.toArray(), []);

  const deptMap = useMemo(() => {
    const map = new Map<string, string>();
    departments?.forEach(d => map.set(d.id, d.name));
    return map;
  }, [departments]);

  const posMap = useMemo(() => {
    const map = new Map<string, string>();
    positions?.forEach(p => map.set(p.id, p.name));
    return map;
  }, [positions]);

  // Resolve Shift Details for Selected Employee & Date
  const resolvedShiftInfo = useMemo(() => {
    if (!formData.employeeId || !formData.date) return null;

    // 1. Check Leave
    const leave = leaves?.find(l => l.employeeId === formData.employeeId);
    if (leave) {
      return {
        type: 'leave' as const,
        badge: 'CUTI / IZIN',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        title: leave.leaveType,
        timeText: 'Izin / Cuti Terjadwal',
        reason: leave.reason,
      };
    }

    // 2. Check Shift Swaps
    const swap = shiftSwaps?.find(
      s => (s.requesterEmployeeId === formData.employeeId && s.requesterDate === formData.date) ||
           (s.targetEmployeeId === formData.employeeId && s.targetDate === formData.date)
    );

    // 3. Check Base Shift Schedule from Roster
    const sched = shiftSchedules?.find(s => s.employeeId === formData.employeeId);
    
    // 4. Check Extra Shift / Lembur
    const extra = extraShifts?.find(e => e.employeeId === formData.employeeId);

    // Determine main shift
    let mainShiftBadge = 'NON SHIFT';
    let mainStartTime = attendanceConfig?.normalStartTime || '08:00';
    let mainEndTime = attendanceConfig?.normalEndTime || '17:00';
    let isOff = false;

    if (sched) {
      if (sched.shiftId === 'OFF' || sched.shiftId === 'shift-off') {
        isOff = true;
        mainShiftBadge = 'OFF';
        mainStartTime = '';
        mainEndTime = '';
      } else {
        const shiftObj = attendanceConfig?.shifts?.find(s => s.id === sched.shiftId);
        if (shiftObj) {
          mainShiftBadge = shiftObj.code ? shiftObj.code.toUpperCase() : shiftObj.name.toUpperCase();
          mainStartTime = shiftObj.startTime;
          mainEndTime = shiftObj.endTime;
        } else {
          mainShiftBadge = sched.shiftName.toUpperCase();
          mainStartTime = sched.startTime || '08:00';
          mainEndTime = sched.endTime || '16:00';
        }
      }
    } else if (attendanceConfig?.systemType === 'shift') {
      const defaultShift = attendanceConfig.shifts?.find(s => s.isDefault) || attendanceConfig.shifts?.[0];
      if (defaultShift) {
        mainShiftBadge = defaultShift.code ? defaultShift.code.toUpperCase() : defaultShift.name.toUpperCase();
        mainStartTime = defaultShift.startTime;
        mainEndTime = defaultShift.endTime;
      }
    }

    // Format badge text e.g. "SHIFT SIANG", "SIANG", "PAGI"
    const formattedMainBadge = mainShiftBadge.startsWith('SHIFT ') 
      ? mainShiftBadge 
      : (mainShiftBadge === 'OFF' || mainShiftBadge === 'NON SHIFT' ? mainShiftBadge : `SHIFT ${mainShiftBadge}`);

    // Helper color
    const getBadgeColor = (badgeText: string, isOffDay: boolean) => {
      if (isOffDay) return 'bg-rose-100 text-rose-800 border-rose-200';
      const lower = badgeText.toLowerCase();
      if (lower.includes('pagi')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      if (lower.includes('siang')) return 'bg-blue-100 text-blue-800 border-blue-200';
      if (lower.includes('malam')) return 'bg-purple-100 text-purple-800 border-purple-200';
      if (lower.includes('non shift')) return 'bg-slate-100 text-slate-800 border-slate-200';
      return 'bg-blue-100 text-blue-800 border-blue-200';
    };

    const mainCard = {
      badge: formattedMainBadge,
      badgeColor: getBadgeColor(formattedMainBadge, isOff),
      timeText: isOff ? 'Libur Terjadwal' : `${mainStartTime} - ${mainEndTime}`,
      isOff,
      isSwap: !!swap,
      swapNote: swap ? (swap.swapType === 'tukar_shift' ? 'Tukar Shift' : 'Ganti Shift') : undefined,
    };

    // If there is an overtime / extra shift
    let overtimeCard = null;
    if (extra) {
      const otShift = attendanceConfig?.shifts?.find(s => s.id === extra.shiftId);
      const otStartTime = extra.customStartTime || otShift?.startTime || '16:00';
      const otEndTime = extra.customEndTime || otShift?.endTime || '20:00';
      const otBadge = extra.shiftName ? extra.shiftName.toUpperCase() : 'LEMBUR';
      
      overtimeCard = {
        badge: otBadge.includes('LEMBUR') ? otBadge : `LEMBUR (${otBadge})`,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        timeText: extra.customStartTime && extra.customEndTime 
          ? `${otStartTime} - ${otEndTime}` 
          : `${extra.durationHours || 4} Jam Kerja`,
        durationHours: extra.durationHours || 4,
        reason: extra.reason,
      };
    }

    return {
      type: 'shift' as const,
      mainCard,
      overtimeCard,
    };
  }, [formData.employeeId, formData.date, leaves, shiftSwaps, shiftSchedules, extraShifts, attendanceConfig]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-lg p-4 sm:p-6">
      {/* Modal Header */}
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 shrink-0 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onBack || onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors shrink-0"
              title="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
              {editingAttendance ? 'Edit Kehadiran Karyawan' : 'Input Presensi Manual'}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4 flex flex-col flex-1 overflow-hidden overflow-x-hidden min-h-0 w-full mt-3">
          <div className="space-y-3.5 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 flex-1 py-1 w-full touch-pan-y">
            
            {/* 1. Pilih Karyawan (Combobox) */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Pilih Karyawan
              </label>
              <EmployeeCombobox
                employees={activeEmployees}
                selectedEmployeeId={formData.employeeId}
                onSelect={(empId) => onEmployeeChange(empId)}
                deptMap={deptMap}
                posMap={posMap}
              />
            </div>

            {/* 2. Tanggal */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Tanggal
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="text-xs sm:text-sm"
              />
            </div>

            {/* 3. Tampilan Shift Kerja (Informasi Berdasarkan Roster, Swaps, Overtime & Leave) */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Shift Kerja
              </label>

              {!formData.employeeId ? (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center text-slate-400 text-xs font-medium">
                  Pilih karyawan untuk melihat jadwal shift kerja
                </div>
              ) : resolvedShiftInfo?.type === 'leave' ? (
                <div className="p-3 bg-amber-50/60 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-amber-100 text-amber-800 border-amber-200 tracking-wide uppercase">
                    {resolvedShiftInfo.badge}
                  </span>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">{resolvedShiftInfo.title}</div>
                    <div className="text-[11px] text-amber-700 font-medium">{resolvedShiftInfo.timeText}</div>
                  </div>
                </div>
              ) : resolvedShiftInfo?.type === 'shift' ? (
                <div className="space-y-2">
                  {/* Card 1: Shift Utama (Roster / Regular) */}
                  <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border tracking-wide uppercase ${resolvedShiftInfo.mainCard.badgeColor}`}>
                        {resolvedShiftInfo.mainCard.badge}
                      </span>
                      {resolvedShiftInfo.mainCard.isSwap && (
                        <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-medium px-1.5 py-0.5 rounded">
                          {resolvedShiftInfo.mainCard.swapNote}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                      {resolvedShiftInfo.mainCard.timeText}
                    </div>
                  </div>

                  {/* Card 2: Shift Lembur / Overtime (Jika Ada) */}
                  {resolvedShiftInfo.overtimeCard && (
                    <>
                      <div className="p-3 bg-amber-50/60 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border tracking-wide uppercase ${resolvedShiftInfo.overtimeCard.badgeColor}`}>
                          {resolvedShiftInfo.overtimeCard.badge}
                        </span>
                        <div className="text-xs sm:text-sm font-bold text-amber-900">
                          {resolvedShiftInfo.overtimeCard.timeText}
                        </div>
                      </div>

                      {/* Catatan Teks Durasi Lembur */}
                      <div className="text-[11px] font-medium text-amber-800 bg-amber-50/90 px-3 py-1.5 rounded-lg border border-amber-200/80 flex items-center justify-between">
                        <span>Durasi Lembur: {resolvedShiftInfo.overtimeCard.durationHours} Jam</span>
                        {resolvedShiftInfo.overtimeCard.reason && (
                          <span className="text-amber-700 truncate max-w-[200px]">
                            {resolvedShiftInfo.overtimeCard.reason}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            {/* 4. Jam Masuk & Jam Pulang (Satu Baris Horizontal, Card Teks Statis Click-to-Pick) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Jam Masuk */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Jam Masuk</label>
                  <span className="text-[10px] text-slate-400 font-medium select-none">
                    Klik Untuk Atur Jam
                  </span>
                </div>
                <div className="relative group">
                  <div className="w-full py-3 px-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-2xs group-hover:border-slate-300">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-wider text-center select-none">
                      {formData.checkIn || '08:00'}
                    </div>
                  </div>
                  <input
                    type="time"
                    value={formData.checkIn || ''}
                    onChange={(e) => onCheckInChange(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Klik untuk memilih jam masuk"
                  />
                </div>
              </div>

              {/* Jam Pulang */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Jam Pulang</label>
                  <span className="text-[10px] text-slate-400 font-medium select-none">
                    Klik Untuk Atur Jam
                  </span>
                </div>
                <div className="relative group">
                  <div className="w-full py-3 px-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-2xs group-hover:border-slate-300">
                    <div className="text-xl sm:text-2xl font-bold text-rose-600 tracking-wider text-center select-none">
                      {formData.checkOut || '17:00'}
                    </div>
                  </div>
                  <input
                    type="time"
                    value={formData.checkOut || ''}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Klik untuk memilih jam pulang"
                  />
                </div>
              </div>
            </div>

            {/* 5. Status Kehadiran */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Status Kehadiran
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                options={[
                  { value: 'Present', label: 'Hadir Tepat Waktu (Present)' },
                  { value: 'Late', label: 'Terlambat (Late)' },
                  { value: 'WFH', label: 'Work From Home (WFH)' },
                  { value: 'Sick', label: 'Sakit (Sick)' },
                  { value: 'Leave', label: 'Cuti / Izin (Leave)' },
                  { value: 'Absent', label: 'Alpa / Tidak Hadir (Absent)' }
                ]}
              />
            </div>

            {/* 6. Keterangan */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Keterangan
              </label>
              <Input
                type="text"
                placeholder="Tambahkan catatan jika diperlukan..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Sticky Bottom Action Button */}
          <div className="pt-3 border-t border-slate-100 mt-auto shrink-0">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl cursor-pointer shadow-2xs transition-all"
            >
              {editingAttendance ? 'Simpan Perubahan' : 'Buat Presensi'}
            </Button>
          </div>
        </form>
    </Modal>
  );
}
