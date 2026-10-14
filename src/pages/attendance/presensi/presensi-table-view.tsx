import React from 'react';
import { Users, Edit, RotateCcw } from 'lucide-react';
import { AttendanceConfig } from '../../../types';
import { EmployeeAttendanceItem, QuickUpdatePayload, ViewMode } from './types';
import { EmployeeAvatar } from '../../../components/ui/EmployeeAvatar';

interface PresensiTableViewProps {
  items: EmployeeAttendanceItem[];
  viewMode: ViewMode;
  attendanceConfig: AttendanceConfig | null;
  onQuickUpdate: (employeeId: string, updates: QuickUpdatePayload) => void;
  onOpenEditModal: (employeeId: string) => void;
  onDeleteRecord: (attendanceId: string) => void;
}

export function PresensiTableView({
  items,
  viewMode,
  attendanceConfig,
  onQuickUpdate,
  onOpenEditModal,
  onDeleteRecord,
}: PresensiTableViewProps) {
  if (viewMode !== 'table') return null;

  return (
    <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase font-semibold">
          <tr>
            <th className="px-4 py-3">Karyawan</th>
            <th className="px-3 py-3">Departemen</th>
            {attendanceConfig?.systemType === 'shift' && (
              <th className="px-3 py-3">Shift Kerja</th>
            )}
            <th className="px-3 py-3">Jam Masuk / Pulang</th>
            <th className="px-3 py-3">Status Kehadiran</th>
            <th className="px-3 py-3">Catatan</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={attendanceConfig?.systemType === 'shift' ? 7 : 6} className="px-6 py-12 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Users className="w-10 h-10 text-slate-200 mb-1" />
                  <p className="text-sm font-medium text-slate-700">Tidak ada karyawan yang sesuai filter.</p>
                  <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter departemen.</p>
                </div>
              </td>
            </tr>
          ) : (
            items.map(({ employee, departmentName, positionName, attendance, hasRecord, status, checkIn, checkOut, shiftId, notes }) => {
              const defaultShift = attendanceConfig?.shifts?.find(s => s.isDefault) || attendanceConfig?.shifts?.[0];
              const activeShiftId = shiftId || defaultShift?.id || '';

              return (
                <tr key={employee.id} className={`hover:bg-slate-50/70 transition-colors ${!hasRecord ? 'bg-amber-50/20' : ''}`}>
                  {/* Karyawan Name & Position */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <EmployeeAvatar employee={employee} size="md" />
                      <div>
                        <div className="font-bold text-slate-900 leading-snug">{employee.fullName}</div>
                        <div className="text-xs text-slate-500 font-medium">{positionName}</div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-3 py-3 text-xs text-slate-600 font-medium">
                    {departmentName}
                  </td>

                  {/* Shift Selector */}
                  {attendanceConfig?.systemType === 'shift' && (
                    <td className="px-3 py-3">
                      <select
                        value={activeShiftId}
                        onChange={(e) => onQuickUpdate(employee.id, { shiftId: e.target.value })}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-800 focus:outline-hidden focus:border-purple-500 cursor-pointer max-w-[150px]"
                      >
                        <option value="">-- Pilih Shift --</option>
                        {attendanceConfig.shifts?.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.startTime} - {s.endTime})
                          </option>
                        ))}
                      </select>
                    </td>
                  )}

                  {/* Check-In / Check-Out */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <input 
                        type="time" 
                        value={checkIn}
                        placeholder="08:00"
                        onChange={(e) => onQuickUpdate(employee.id, { checkIn: e.target.value })}
                        className="w-20 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs font-semibold bg-white focus:border-blue-500"
                      />
                      <span className="text-slate-300">-</span>
                      <input 
                        type="time" 
                        value={checkOut}
                        placeholder="17:00"
                        onChange={(e) => onQuickUpdate(employee.id, { checkOut: e.target.value })}
                        className="w-20 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs font-semibold bg-white focus:border-blue-500"
                      />
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-3 py-3">
                    <select
                      value={status}
                      onChange={(e) => onQuickUpdate(employee.id, { status: e.target.value as any })}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                        status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        status === 'Late' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        status === 'Leave' || status === 'Sick' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        status === 'WFH' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        status === 'Absent' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-slate-100 text-slate-500 border-slate-200 font-normal'
                      }`}
                    >
                      <option value="NotSet" disabled>-- Belum Presensi --</option>
                      <option value="Present">Hadir Tepat Waktu</option>
                      <option value="Late">Terlambat (Late)</option>
                      <option value="WFH">Work From Home (WFH)</option>
                      <option value="Sick">Sakit</option>
                      <option value="Leave">Cuti / Izin</option>
                      <option value="Absent">Alpa / Tanpa Ket.</option>
                    </select>
                  </td>

                  {/* Notes */}
                  <td className="px-3 py-3 text-xs">
                    <input 
                      type="text"
                      placeholder="Keterangan..."
                      value={notes}
                      onChange={(e) => onQuickUpdate(employee.id, { notes: e.target.value })}
                      className="w-full text-xs px-2 py-1 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded bg-transparent focus:bg-white transition-colors"
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(employee.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="Edit Detail Jam & Shift"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {hasRecord && attendance && (
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(attendance.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Reset Presensi"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
