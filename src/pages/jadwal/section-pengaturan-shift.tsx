import React from 'react';
import {
  Plus,
  PlusCircle,
  X,
  CalendarDays,
  Users,
  Building2,
  BookmarkCheck,
  Bookmark,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import {
  AttendanceConfig,
  WorkShift,
  ShiftPattern,
  SavedSchedulePattern,
  ShiftGroup,
  Employee,
  Department,
} from '../../types';
import { Button } from '../../components/ui';
import { getShiftBadgeClasses, getShiftBadgeStyle } from '../../services/attendanceConfigService';

interface SectionPengaturanShiftProps {
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
  nonOffShifts: WorkShift[];
  employees: Employee[];
  departments: Department[];
  savedPatternsList: SavedSchedulePattern[];
  toastNotification: { text: string; type: 'success' | 'info' } | null;
  onDismissToast: () => void;
  onOpenShiftModal: (shift?: WorkShift) => void;
  onViewShift: (shift: WorkShift) => void;
  onOpenPatternModal: (pattern?: ShiftPattern) => void;
  onViewPattern: (pattern: ShiftPattern) => void;
  onOpenCreateMasterGroup: () => void;
  onViewGroup: (group: ShiftGroup) => void;
  onOpenCreateSchedulePattern: () => void;
  onViewSavedPattern: (pattern: SavedSchedulePattern) => void;
}

const formatIndoDate = (isoStr?: string) => {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
};

export function SectionPengaturanShift({
  activeConfig,
  availableShifts,
  nonOffShifts,
  employees,
  departments,
  savedPatternsList,
  toastNotification,
  onDismissToast,
  onOpenShiftModal,
  onViewShift,
  onOpenPatternModal,
  onViewPattern,
  onOpenCreateMasterGroup,
  onViewGroup,
  onOpenCreateSchedulePattern,
  onViewSavedPattern,
}: SectionPengaturanShiftProps) {
  return (
    <>
      {/* 2. Shift Master Card List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Shift Master
          </h3>
          <button
            onClick={() => onOpenShiftModal()}
            title="Tambah Shift"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Shift</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {nonOffShifts.length === 0 ? (
            <div className="col-span-full text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500">Belum ada master shift operasional yang dibuat.</p>
            </div>
          ) : (
            nonOffShifts.map((shift) => (
              <div
                key={shift.id}
                onClick={() => onViewShift(shift)}
                className="relative group bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] text-slate-400 font-normal leading-tight">Nama Shift</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors mt-0.5">
                      {shift.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      style={getShiftBadgeStyle(shift.color)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shrink-0 ${getShiftBadgeClasses(shift.color)}`}
                    >
                      {shift.code}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>

                {/* 2 Card Terpisah: Jam Kerja & Jam Istirahat (Hanya untuk shift kerja, disembunyikan untuk OFF/Libur) */}
                {!shift.isOff && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 sm:p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col items-center justify-center text-center min-w-0">
                      <span className="block text-[10px] text-slate-400 font-normal leading-tight">Jam Kerja</span>
                      <span className="block text-xs font-bold text-slate-800 truncate mt-0.5 w-full">
                        {shift.startTime} - {shift.endTime}
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col items-center justify-center text-center min-w-0">
                      <span className="block text-[10px] text-slate-400 font-normal leading-tight">Jam Istirahat</span>
                      <span className="block text-xs font-bold text-slate-800 truncate mt-0.5 w-full">
                        {shift.breakStartTime ? `${shift.breakStartTime} - ${shift.breakEndTime}` : '-'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Pola Rotasi Shift (Cycle Roster) Master */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600 shrink-0" />
            Pola Rotasi Shift
          </h3>
          <button
            onClick={() => onOpenPatternModal()}
            title="Buat Master Pola"
            className="p-0 border-none bg-transparent hover:opacity-80 transition-all cursor-pointer outline-none focus:outline-none"
          >
            <PlusCircle className="w-6 h-6 fill-blue-600 text-white shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(activeConfig?.shiftPatterns || []).length === 0 ? (
            <div className="col-span-2 text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500">Belum ada master pola rotasi shift yang dibuat.</p>
            </div>
          ) : (
            activeConfig?.shiftPatterns?.map((pattern) => (
              <div
                key={pattern.id}
                onClick={() => onViewPattern(pattern)}
                className="relative group bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] text-slate-400 font-normal leading-tight">
                      Siklus {pattern.cycle.length} Hari
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors mt-0.5">
                      {pattern.name}
                    </h4>
                  </div>
                  <div className="flex items-center shrink-0 pt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pattern.cycle.map((sId, idx) => {
                    if (sId === 'OFF') {
                      return (
                        <span key={idx} className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-rose-50 text-rose-700 border-rose-200">
                          OFF
                        </span>
                      );
                    }
                    const s = (activeConfig?.shifts || availableShifts).find(x => x.id === sId);
                    if (!s) return null;
                    const isOffShift = s.isOff || s.code?.toUpperCase() === 'OFF';
                    const color = isOffShift ? 'rose' : s.color;
                    return (
                      <span
                        key={idx}
                        style={getShiftBadgeStyle(color)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getShiftBadgeClasses(color)}`}
                      >
                        {s.code}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Master Group / Regu Shift */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 shrink-0" />
            Group / Regu Shift
          </h3>
          <button
            onClick={onOpenCreateMasterGroup}
            title="Tambah Group Shift"
            className="p-0 border-none bg-transparent hover:opacity-80 transition-all cursor-pointer outline-none focus:outline-none"
          >
            <PlusCircle className="w-6 h-6 fill-blue-600 text-white shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(!activeConfig?.shiftGroups || activeConfig.shiftGroups.length === 0) ? (
            <div className="col-span-full text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500">Belum ada group karyawan yang dibuat.</p>
            </div>
          ) : (
            activeConfig.shiftGroups.map((group, groupIdx) => {
              const palette = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#0EA5E9', '#EC4899'];
              const groupColor = (group.color && group.color.startsWith('#'))
                ? group.color
                : (group.id?.includes('regu-a') ? '#2563EB' : group.id?.includes('regu-b') ? '#10B981' : group.id?.includes('it-') ? '#8B5CF6' : palette[groupIdx % palette.length]);

              return (
                <div
                  key={group.id}
                  onClick={() => onViewGroup(group)}
                  className="relative group bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      style={{ backgroundColor: `${groupColor}18`, color: groupColor, borderColor: `${groupColor}40` }}
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs uppercase border shrink-0"
                    >
                      {group.name.substring(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {group.name}
                      </h4>
                      {group.description ? (
                        <p className="text-[10.5px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                          {group.description}
                        </p>
                      ) : (
                        <p className="text-[10.5px] sm:text-[11px] text-slate-400 italic truncate mt-0.5">
                          Tanpa keterangan tambahan
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {group.employeeIds.slice(0, 4).map((empId, i) => {
                        const emp = employees.find(e => e.id === empId);
                        return (
                          <div
                            key={i}
                            title={emp?.fullName || empId}
                            className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-blue-600 text-[9px] font-extrabold shadow-2xs shrink-0"
                          >
                            {emp ? emp.fullName.trim().charAt(0).toUpperCase() : '?'}
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {group.employeeIds.length} Karyawan
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Pola Jadwal Tersimpan (Penugasan) */}
      <div className="space-y-4 pt-2">
        {/* Toast Notification */}
        {toastNotification && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-2 text-xs font-semibold text-blue-900 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{toastNotification.text}</span>
            </div>
            <button
              onClick={onDismissToast}
              className="text-blue-500 hover:text-blue-800 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-600 shrink-0" />
            Pola Jadwal Tersimpan
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              {savedPatternsList.length} Pola
            </span>
            <button
              onClick={onOpenCreateSchedulePattern}
              title="Tambah Pola Jadwal"
              className="p-0 border-none bg-transparent hover:opacity-80 transition-all cursor-pointer outline-none focus:outline-none ml-1"
            >
              <PlusCircle className="w-6 h-6 fill-blue-600 text-white shrink-0" />
            </button>
          </div>
        </div>

        {savedPatternsList.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Belum Ada Pola Jadwal Tersimpan</div>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1">
                Klik tombol tambah (+) di kanan atas atau tombol di bawah untuk membuat pola jadwal dan menetapkan pola shift serta tanggal mulai per departemen.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onOpenCreateSchedulePattern}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pola Jadwal</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {savedPatternsList.map((saved) => {
              const isActive = !!saved.isActive;
              return (
                <div
                  key={saved.id}
                  onClick={() => onViewSavedPattern(saved)}
                  className={`relative group p-4 rounded-xl border border-slate-200 transition-all duration-200 space-y-3 bg-white cursor-pointer select-none hover:border-blue-400 hover:shadow-md ${
                    isActive
                      ? 'opacity-100'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-slate-400 font-normal leading-tight">
                        Terakhir Diperbarui: {formatIndoDate(saved.updatedAt || saved.createdAt)}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mt-0.5">
                        {saved.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      {isActive && (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white shadow-2xs">
                          Aktif
                        </span>
                      )}
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>

                  {saved.description && (
                    <p className="text-xs text-slate-600 font-normal leading-relaxed w-full line-clamp-2">
                      {saved.description}
                    </p>
                  )}

                  {/* Summary Strip: Departments & Groups */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 group-hover:bg-blue-50/30 group-hover:border-blue-100 transition-colors">
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{(saved.departmentAssignments || []).length || departments.length} Departemen</span>
                    </div>

                    {(saved.groupAssignments && saved.groupAssignments.length > 0) ? (
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{saved.groupAssignments.length} Group ({saved.groupAssignments.reduce((acc, g) => acc + (g.employeeIds?.length || 0), 0)} Org)</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Pola Seluruh Departemen</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
