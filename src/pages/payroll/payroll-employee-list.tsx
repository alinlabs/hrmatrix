import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { Search, Users, ArrowLeft } from 'lucide-react';
import { processPayrollRecord } from '../../services/payrollCalculator';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch, 
  HideBottomNav 
} from '../../context/MobileNavContext';
import { ExtendedPayrollRecord } from './types';
import { formatRupiah, formatDateRange } from './utils-helper';
import { CardEmployeeSalaryItem } from './card-employee-salary-item';
import { ModalEmployeeDetail } from './modal-employee-detail';
import { ModalPayslip } from './modal-payslip';
import { ModalPayrollAdjustment } from './modal-payroll-adjustment';

export function PayrollEmployeeList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<ExtendedPayrollRecord | null>(null);
  const [selectedPayslipRecord, setSelectedPayslipRecord] = useState<ExtendedPayrollRecord | null>(null);
  const [selectedAdjustmentRecord, setSelectedAdjustmentRecord] = useState<ExtendedPayrollRecord | null>(null);

  const period = useLiveQuery(() => db.payrollPeriods.get(id!));
  const company = useLiveQuery(() => db.company.toCollection().first());

  const records = useLiveQuery(async () => {
    if (!id) return [];
    const payrollRecords = await db.payrollRecords.where('payrollPeriodId').equals(id).toArray();
    
    const employees = await db.employees.toArray();
    const departments = await db.departments.toArray();
    const positions = await db.positions.toArray();

    const empMap = new Map(employees.map(e => [e.id, e]));
    const deptMap = new Map(departments.map(d => [d.id, d.name]));
    const posMap = new Map(positions.map(p => [p.id, p.name]));

    return payrollRecords.map(r => {
      const emp = empMap.get(r.employeeId);
      return {
        ...r,
        employee: emp,
        departmentName: emp ? deptMap.get(emp.departmentId) : undefined,
        positionName: emp ? posMap.get(emp.positionId) : undefined
      } as ExtendedPayrollRecord;
    });
  }, [id]);

  const handleSaveAdjustment = async (recordId: string, adjustedInputs: any) => {
    const existingRec = records?.find(r => r.id === recordId);
    if (!existingRec || !existingRec.employee) return;

    // Merge manual adjustments with existing attendance snapshots
    const mergedInputs = {
      ...adjustedInputs,
      attendanceDays: existingRec.attendanceDays || 0,
      absentDays: existingRec.absentDays || 0,
      leaveDays: existingRec.leaveDays || 0,
      sickDays: existingRec.sickDays || 0,
      overtimeHours: existingRec.overtimeHours || 0,
    };

    const recalculated = await processPayrollRecord(existingRec.employee, mergedInputs, period?.startDate);
    await db.payrollRecords.update(recordId, {
      ...recalculated,
      id: recordId,
      payrollPeriodId: id
    });
  };

  const filteredRecords = useMemo(() => {
    if (!records) return [];
    if (!search.trim()) return records;
    const q = search.toLowerCase().trim();
    return records.filter(r => {
      const name = (r.employee?.fullName || '').toLowerCase();
      const empId = (r.employee?.employeeId || '').toLowerCase();
      const dept = (r.departmentName || '').toLowerCase();
      const pos = (r.positionName || '').toLowerCase();
      return name.includes(q) || empId.includes(q) || dept.includes(q) || pos.includes(q);
    });
  }, [records, search]);

  if (period === undefined) return <div className="p-8 text-center text-slate-500 text-xs">Memuat rincian karyawan...</div>;
  if (period === null) return <div className="p-8 text-center text-rose-500 text-xs">Periode payroll tidak ditemukan.</div>;

  const periodTitle = period.name ? (period.name.toLowerCase().startsWith('payroll') ? period.name : `Payroll ${period.name}`) : `Payroll ${period.month} ${period.year}`;

  const totalEmployees = records?.length || 0;
  const totalNet = records?.reduce((s, r) => s + (r.netSalary || 0), 0) || 0;

  const headerSearchAction = (
    <button
      type="button"
      onClick={() => setIsSearchOpen(true)}
      className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
        search
          ? 'border-blue-300 text-blue-600 bg-blue-50/50'
          : 'border-slate-200 text-slate-700 hover:text-blue-600'
      }`}
      title="Cari Karyawan"
    >
      <Search className="w-4 h-4" />
      {search && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
      )}
    </button>
  );

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full">
      <HideBottomNav />

      {/* Header Bar */}
      <PageHeaderTitle 
        title={periodTitle} 
        subtitle="Rincian Gaji & Slip Karyawan" 
        onBack={() => navigate(`/payroll/${id}`)}
        hideHamburger={true}
      />

      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerSearchAction}</DesktopHeaderActions>
          <MobileHeaderActions>{headerSearchAction}</MobileHeaderActions>
        </>
      )}

      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={setSearch}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari nama karyawan, NIK, jabatan, atau divisi..."
        />
      )}

      {/* Summary Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">{totalEmployees} Karyawan Terdaftar</span>
            <span className="text-[11px] text-slate-500">
              Cut-off: {formatDateRange(period.startDate, period.endDate)}
            </span>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Total Take Home Pay</span>
          <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {formatRupiah(totalNet)}
          </span>
        </div>
      </div>

      {/* Employee List Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-2xs">
          <p className="text-xs text-slate-500">
            {search ? `Tidak ada karyawan yang cocok dengan "${search}".` : 'Belum ada data gaji karyawan untuk periode ini.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {filteredRecords.map(record => (
            <CardEmployeeSalaryItem
              key={record.id}
              record={record}
              onViewDetail={() => setSelectedDetailRecord(record)}
              onOpenPayslip={() => setSelectedPayslipRecord(record)}
              onOpenAdjustment={() => setSelectedAdjustmentRecord(record)}
            />
          ))}
        </div>
      )}

      {/* Modal 1: Rincian Gaji Lengkap */}
      <ModalEmployeeDetail
        isOpen={!!selectedDetailRecord}
        onClose={() => setSelectedDetailRecord(null)}
        record={selectedDetailRecord}
        period={period}
        onOpenAdjustment={(rec) => setSelectedAdjustmentRecord(rec)}
        onOpenPayslip={(rec) => setSelectedPayslipRecord(rec)}
      />

      {/* Modal 2: Slip Gaji PDF / Cetak */}
      <ModalPayslip
        isOpen={!!selectedPayslipRecord}
        onClose={() => setSelectedPayslipRecord(null)}
        record={selectedPayslipRecord}
        period={period}
        company={company}
      />

      {/* Modal 3: Penyesuaian Variabel */}
      <ModalPayrollAdjustment
        isOpen={!!selectedAdjustmentRecord}
        onClose={() => setSelectedAdjustmentRecord(null)}
        record={selectedAdjustmentRecord}
        onSave={handleSaveAdjustment}
      />
    </div>
  );
}
