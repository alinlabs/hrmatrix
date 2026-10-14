import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { Calculator, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DesktopHeaderActions } from '../../context/MobileNavContext';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyDashboardAnimation from '../../assets/animations/empty-dashboard.json';

import { StatsSummary } from './stats-summary';
import { RecentEmployees } from './recent-employees';
import { QuickActions } from './quick-actions';

export function Dashboard() {
  const navigate = useNavigate();
  const employeesCount = useLiveQuery(() => db.employees.count());
  const activeEmployees = useLiveQuery(() => db.employees.where('status').equals('Active').count());
  const payrollCount = useLiveQuery(() => db.payrollRecords.count());
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendanceCount = useLiveQuery(() => db.attendance.where('date').equals(todayStr).count());
  
  // Ambil 5 karyawan terbaru (dari id terbaru)
  const employees = useLiveQuery(() => db.employees.reverse().limit(5).toArray()) || [];
  
  if (employeesCount === undefined) return <div className="p-4 text-slate-500 text-sm">Memuat data dashboard...</div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DesktopHeaderActions>
        <Link to="/employees" className="inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 shadow-xs">
          <Plus className="w-3.5 h-3.5 mr-1" /> Karyawan
        </Link>
        <Link to="/payroll" className="inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200 h-8 px-3 border border-slate-200">
          <Calculator className="w-3.5 h-3.5 mr-1" /> Payroll
        </Link>
      </DesktopHeaderActions>

      {employeesCount === 0 ? (
        <InitialEmptyCard
          title="Ayo, Mulai Bangun Team Hebat!"
          description="Tambahkan karyawan pertama Anda untuk memulai pengelolaan data dan penggajian tim."
          buttonText="Tambah Karyawan Pertama"
          ButtonIcon={Plus}
          onAction={() => navigate('/employees')}
          animationData={emptyDashboardAnimation}
        />
      ) : (
        <StatsSummary 
          employeesCount={employeesCount}
          activeEmployees={activeEmployees || 0}
          payrollCount={payrollCount || 0}
          todayAttendanceCount={todayAttendanceCount}
        />
      )}

      {employeesCount > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          <RecentEmployees employees={employees} />
          <QuickActions />
        </div>
      )}
    </div>
  );
}
