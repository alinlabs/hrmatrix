import React from 'react';
import { Employee } from '../../types';
import { getPositionName, getDepartmentName } from '../../services/positionService';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';

export interface CardEmployeeItemProps {
  employee: Employee;
  onViewDetail: (emp: Employee) => void;
  onEdit?: (emp: Employee) => void;
  onDelete?: (id: string) => void;
}

export const CardEmployeeItem: React.FC<CardEmployeeItemProps> = ({
  employee,
  onViewDetail
}) => {
  const positionDisplay = getPositionName(employee.positionId) || 'Staff';
  const deptDisplay = getDepartmentName(employee.departmentId, employee.positionId) || 'Umum';

  return (
    <div
      onClick={() => onViewDetail(employee)}
      className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 flex items-center justify-between gap-2.5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group"
    >
      {/* Left: Avatar + Details (Pure without right action icons) */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        {/* Global Employee Avatar */}
        <EmployeeAvatar employee={employee} size="md" />

        {/* Department, Name, Position */}
        <div className="min-w-0 flex-1">
          {/* Departemen */}
          <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={deptDisplay}>
            {deptDisplay}
          </div>
          {/* Nama Karyawan */}
          <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate group-hover:text-blue-600 transition-colors" title={employee.fullName}>
            {employee.fullName}
          </div>
          {/* Posisi */}
          <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={positionDisplay}>
            {positionDisplay}
          </div>
        </div>
      </div>
    </div>
  );
};
