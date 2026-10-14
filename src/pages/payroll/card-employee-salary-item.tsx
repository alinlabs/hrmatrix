import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CardEmployeeSalaryItemProps } from './types';
import { formatRupiah } from './utils-helper';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { getPositionName, getDepartmentName } from '../../services/positionService';

export const CardEmployeeSalaryItem: React.FC<CardEmployeeSalaryItemProps> = ({
  record,
  onViewDetail
}) => {
  const emp = record.employee;
  if (!emp) return null;

  const basic = record.basicSalary || 0;
  const gross = record.grossSalary || 0;
  const allowances = Math.max(0, gross - basic);
  const deductions = record.totalDeduction || 0;
  const net = record.netSalary || 0;

  const deptDisplay = getDepartmentName(record.departmentName || (emp as any).department || (emp as any).departmentId, (emp as any).positionId) || 'Divisi';
  const posDisplay = getPositionName(record.positionName || (emp as any).position || (emp as any).positionId) || 'Staff';

  return (
    <div 
      onClick={onViewDetail}
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

      {/* 2. Take Home Pay Section */}
      <div className="flex items-center justify-between pt-0.5">
        <h5 className="text-[10px] font-bold tracking-wider text-slate-900 uppercase">
          TAKE HOME PAY
        </h5>
        <span className="font-extrabold text-slate-900 text-xs sm:text-[13px]">
          {formatRupiah(net)}
        </span>
      </div>

      {/* 3. Financial Metrics Breakdown Chips */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50/80 py-2 px-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center min-w-0">
          <span className="text-[10px] text-slate-400 font-normal block mb-0.5 truncate w-full">Gaji & Upah</span>
          <span className="font-bold text-slate-800 text-[11px] block truncate w-full">
            {basic > 0 ? formatRupiah(basic) : '-'}
          </span>
        </div>
        <div className="bg-slate-50/80 py-2 px-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center min-w-0">
          <span className="text-[10px] text-slate-400 font-normal block mb-0.5 truncate w-full">Tunjangan</span>
          <span className={`font-bold text-[11px] block truncate w-full ${allowances > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
            {allowances > 0 ? formatRupiah(allowances) : '-'}
          </span>
        </div>
        <div className="bg-slate-50/80 py-2 px-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center min-w-0">
          <span className="text-[10px] text-slate-400 font-normal block mb-0.5 truncate w-full">Potongan</span>
          <span className={`font-bold text-[11px] block truncate w-full ${deductions > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
            {deductions > 0 ? formatRupiah(deductions) : '-'}
          </span>
        </div>
      </div>
    </div>
  );
};
