import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { calculateGrade } from '../../services/kpiService';
import { CardKPIEmployeeItemProps } from './types';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { getPositionName, getDepartmentName } from '../../services/positionService';

export function CardKPIEmployeeItem({
  employee: emp,
  result,
  isEvaluated,
  department,
  position,
  templates,
  rules,
  onClick
}: CardKPIEmployeeItemProps) {
  const gradeRule = result ? calculateGrade(result.score, rules.grades) : null;
  const activeTemplatesCount = templates.filter((t: any) => t.isActive !== false).length || 5;
  const indicatorCount = result ? result.items.length : activeTemplatesCount;
  const avgScore = result && result.items && result.items.length > 0
    ? Math.round((result.items.reduce((sum, item) => sum + (item.score || 0), 0) / result.items.length) * 100) / 100
    : (result ? result.score : null);

  const deptDisplay = getDepartmentName(department?.name || (emp as any)?.departmentId || (emp as any)?.department, (emp as any)?.positionId) || 'Divisi';
  const posDisplay = getPositionName(position?.name || (emp as any)?.positionId || (emp as any)?.position) || 'Staff';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-3 group cursor-pointer"
    >
      {/* 1. Header: Avatar, Name, Department, Position & Top Right Arrow */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <EmployeeAvatar
            employee={emp as any}
            name={emp.fullName}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-normal text-slate-400 truncate leading-tight">
              {deptDisplay}
            </p>
            <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-blue-600 transition-colors truncate mt-0.5 leading-tight">
              {emp.fullName}
            </h4>
            <p className="text-[11px] font-normal text-slate-400 truncate mt-0.5 leading-tight">
              {posDisplay}
            </p>
          </div>
        </div>

        {/* Top Right Arrow Icon */}
        <div className="text-slate-300 group-hover:text-slate-500 transition-colors pt-0.5 shrink-0">
          <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
        </div>
      </div>

      {/* 2. Performance Score Section */}
      <div className="flex items-center justify-between pt-0.5">
        <h5 className="text-[10px] font-bold tracking-wider text-slate-900 uppercase">
          SKOR PERFORMA
        </h5>
        <span className="font-extrabold text-slate-900 text-xs sm:text-[13px]">
          {isEvaluated && result ? `${result.score} Skor` : '0 Skor'}
        </span>
      </div>

      {/* 3. Performance Metrics Breakdown Chips */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50/80 py-2 px-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center min-w-0">
          <span className="text-[10px] text-slate-400 font-normal block mb-0.5 truncate w-full">Grade</span>
          <span className={`font-bold text-[11px] block truncate w-full ${isEvaluated && result ? 'text-blue-600' : 'text-slate-800'}`}>
            {isEvaluated && result && gradeRule ? `Grade ${result.grade || gradeRule.grade}` : '-'}
          </span>
        </div>
        <div className="bg-slate-50/80 py-2 px-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center min-w-0">
          <span className="text-[10px] text-slate-400 font-normal block mb-0.5 truncate w-full">Indikator</span>
          <span className="font-bold text-slate-800 text-[11px] block truncate w-full">
            {indicatorCount > 0 ? `${indicatorCount} Item` : '-'}
          </span>
        </div>
        <div className="bg-slate-50/80 py-2 px-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center min-w-0">
          <span className="text-[10px] text-slate-400 font-normal block mb-0.5 truncate w-full">Rata-rata</span>
          <span className="font-bold text-slate-800 text-[11px] block truncate w-full">
            {isEvaluated && avgScore !== null ? avgScore : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
