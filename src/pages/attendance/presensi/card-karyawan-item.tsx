import React from 'react';
import { EmployeeAttendanceItem, QuickUpdatePayload } from './types';
import { EmployeeAvatar } from '../../../components/ui/EmployeeAvatar';
import { getPositionName, getDepartmentName } from '../../../services/positionService';

export interface CardKaryawanItemProps {
  key?: string;
  item: EmployeeAttendanceItem;
  onQuickUpdate: (employeeId: string, updates: QuickUpdatePayload) => void;
}

export function CardKaryawanItem({ item, onQuickUpdate }: CardKaryawanItemProps) {
  const { employee, departmentName, positionName, checkIn, checkOut } = item;
  const dept = getDepartmentName(departmentName || employee.departmentId, employee.positionId) || 'Umum';
  const posDisplay = getPositionName(positionName || employee.positionId) || 'Staff';

  return (
    <div 
      className="p-3 sm:p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between gap-2.5 group"
    >
      {/* Avatar + Info */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        {/* Standardized Employee Avatar */}
        <EmployeeAvatar employee={employee} size="md" />

        {/* Department, Name, Position */}
        <div className="min-w-0 flex-1">
          {/* Departemen (Kecil tipis, tidak kapital) */}
          <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={dept}>
            {dept}
          </div>
          {/* Nama Karyawan (Tebal) */}
          <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate group-hover:text-blue-600 transition-colors" title={employee.fullName}>
            {employee.fullName}
          </div>
          {/* Posisi (Kecil) */}
          <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={posDisplay}>
            {posDisplay}
          </div>
        </div>
      </div>

      {/* 2 Interactive Time Cards: IN | OUT */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* IN Card */}
        <div className="relative bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-center min-w-[56px] hover:border-blue-400 hover:shadow-2xs transition-all cursor-pointer group">
          <input 
            type="time" 
            value={checkIn || ''}
            onChange={(e) => onQuickUpdate(employee.id, { checkIn: e.target.value })}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker?.();
              } catch (err) {
                // fallback
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            title="Klik untuk memilih jam masuk"
          />
          <div className="text-[9px] font-normal text-slate-400 uppercase tracking-tight group-hover:text-slate-600">IN</div>
          <div className={`text-[11px] font-bold mt-0.5 ${checkIn && checkIn !== '--:--' ? 'text-emerald-600' : 'text-slate-400'}`}>
            {checkIn || '--:--'}
          </div>
        </div>

        {/* OUT Card */}
        <div className="relative bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-center min-w-[56px] hover:border-blue-400 hover:shadow-2xs transition-all cursor-pointer group">
          <input 
            type="time" 
            value={checkOut || ''}
            onChange={(e) => onQuickUpdate(employee.id, { checkOut: e.target.value })}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker?.();
              } catch (err) {
                // fallback
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            title="Klik untuk memilih jam pulang"
          />
          <div className="text-[9px] font-normal text-slate-400 uppercase tracking-tight group-hover:text-slate-600">OUT</div>
          <div className={`text-[11px] font-bold mt-0.5 ${checkOut && checkOut !== '--:--' ? 'text-red-600' : 'text-slate-400'}`}>
            {checkOut || '--:--'}
          </div>
        </div>
      </div>
    </div>
  );
}
