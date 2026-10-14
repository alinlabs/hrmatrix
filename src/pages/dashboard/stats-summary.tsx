import React from 'react';
import { Card, CardContent } from '../../components/ui';
import { Users, Activity, Calculator, Clock } from 'lucide-react';

interface StatsSummaryProps {
  employeesCount: number;
  activeEmployees: number;
  payrollCount: number;
  todayAttendanceCount: number | undefined;
}

export function StatsSummary({ 
  employeesCount, 
  activeEmployees, 
  payrollCount, 
  todayAttendanceCount 
}: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      <Card className="hover:border-blue-200 transition-colors shadow-xs">
        <CardContent className="p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-2 sm:mb-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Total Karyawan</p>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">{employeesCount}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:border-emerald-200 transition-colors shadow-xs">
        <CardContent className="p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-2 sm:mb-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Karyawan Aktif</p>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">{activeEmployees || 0}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:border-blue-200 transition-colors shadow-xs">
        <CardContent className="p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-2 sm:mb-0">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Data Payroll</p>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">{payrollCount || 0}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:border-amber-200 transition-colors shadow-xs">
        <CardContent className="p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="p-2 sm:p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-2 sm:mb-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Hadir Hari Ini</p>
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">
              {todayAttendanceCount !== undefined && todayAttendanceCount > 0 ? todayAttendanceCount : '-'}
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
