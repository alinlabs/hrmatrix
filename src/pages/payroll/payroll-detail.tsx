import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { Settings, Printer } from 'lucide-react';
import { Card } from '../../components/ui';
import { processPayrollRecord, calculateOvertimeAmountForShift } from '../../services/payrollCalculator';
import { getAttendanceConfig } from '../../services/attendanceConfigService';
import { calculateAttendance, calculateLateDeductionAmount } from '../../services/attendanceCalculator';
import { v4 as uuidv4 } from 'uuid';
import { 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderTitle, 
  HideBottomNav 
} from '../../context/MobileNavContext';
import { ModalDetailSetting } from './modal-detail-setting';
import { formatRupiah, formatSimpleDateIndo, exportPayrollRecordsToCSV } from './utils-helper';

export function PayrollDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const autoCalculatedRef = useRef(false);

  const period = useLiveQuery(() => db.payrollPeriods.get(id!));
  const company = useLiveQuery(() => db.company.toCollection().first());
  
  const records = useLiveQuery(async () => {
    if (!id) return [];
    return await db.payrollRecords.where('payrollPeriodId').equals(id).toArray();
  }, [id]);

  const handleCalculate = async (customStartDate?: string, customEndDate?: string, overrideDisabledRuleIds?: string[]) => {
    if (!id || !period) return;
    setIsCalculating(true);
    try {
      const activePeriod = await db.payrollPeriods.get(id);
      const startDate = customStartDate || activePeriod?.startDate || period.startDate;
      const endDate = customEndDate || activePeriod?.endDate || period.endDate;
      const disabledRuleIds = overrideDisabledRuleIds !== undefined 
        ? overrideDisabledRuleIds 
        : (activePeriod?.disabledRuleIds || period.disabledRuleIds || []);

      const activeEmployees = await db.employees.where('status').equals('Active').toArray();
      const config = await getAttendanceConfig();
      const overtimeConfig = config?.overtimeConfig;

      const newRecordsPromises = activeEmployees.map(async emp => {
        let absentDays = 0;
        let totalOvertimeHours = 0;
        let totalOvertimeAmount = 0;
        let totalLateDeductionAmount = 0;

        const attendances = await db.attendance
          .where('employeeId')
          .equals(emp.id)
          .toArray();
          
        const allLeaves = await db.leaves
          .where('employeeId')
          .equals(emp.id)
          .toArray();

        const periodAttendances = attendances.filter(a => a.date >= startDate && a.date <= endDate);
        const periodLeaves = allLeaves.filter(l => l.status === 'Approved' && l.startDate <= endDate && l.endDate >= startDate);

        absentDays = periodAttendances.filter(a => a.status === 'Absent').length;
        
        let leaveDays = periodAttendances.filter(a => a.status === 'Leave').length;
        let sickDays = periodAttendances.filter(a => a.status === 'Sick').length;

        // Iterate through each day in period to see if there's a leave from db.leaves that isn't in db.attendance
        const [sy, sm, sd] = startDate.split('-');
        const [ey, em, ed] = endDate.split('-');
        const sDate = new Date(parseInt(sy, 10), parseInt(sm, 10) - 1, parseInt(sd, 10));
        const eDate = new Date(parseInt(ey, 10), parseInt(em, 10) - 1, parseInt(ed, 10));

        for (let d = new Date(sDate); d <= eDate; d.setDate(d.getDate() + 1)) {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const dStr = `${y}-${m}-${day}`;
          const hasAtt = periodAttendances.some(a => a.date === dStr);
          if (!hasAtt) {
            const hasLeave = periodLeaves.find(l => dStr >= l.startDate && dStr <= l.endDate);
            if (hasLeave) {
              leaveDays++;
            }
          }
        }

        // Calculate Late Deductions across period attendances
        if (config?.lateDeductionConfig?.enabled) {
          for (const att of periodAttendances) {
            if (att.checkIn && (att.status === 'Late' || att.status === 'Present')) {
              let lateMins = att.lateMinutes;
              if (lateMins === undefined) {
                const shiftObj = config.shifts?.find(s => s.id === att.shiftId) || config.shifts?.find(s => s.isDefault) || config.shifts?.[0];
                const calc = calculateAttendance(att.checkIn, att.checkOut || (shiftObj?.endTime || '17:00'), config, shiftObj);
                lateMins = calc.lateMinutes;
              }
              if (lateMins > (config.lateToleranceMinutes || 0)) {
                const deductionResult = calculateLateDeductionAmount(lateMins, emp.basicSalary || 0, config);
                totalLateDeductionAmount += deductionResult.amount;
              }
            }
          }
        }
        
        const allExtraShifts = await db.extraShifts.where('employeeId').equals(emp.id).toArray();
        const periodExtraShifts = allExtraShifts.filter(e => e.workDate >= startDate && e.workDate <= endDate && e.status === 'Approved');

        for (const extra of periodExtraShifts) {
           const duration = extra.durationHours || 0;
           totalOvertimeHours += duration;
           const amount = calculateOvertimeAmountForShift(duration, String(extra.wageCategory || 'NORMAL'), emp, overtimeConfig);
           totalOvertimeAmount += amount;
        }

        let attendanceDays = periodAttendances.filter(a => a.status === 'Present' || a.status === 'Late' || (a.status as string) === 'Half Day').length;

        const inputs = {
          attendanceDays,
          absentDays,
          leaveDays,
          sickDays,
          overtimeHours: totalOvertimeHours,
          overtime: totalOvertimeAmount,
          lateDeduction: totalLateDeductionAmount,
        };

        const record = await processPayrollRecord(emp, inputs, startDate, disabledRuleIds);
        return {
          ...record,
          id: uuidv4(),
          payrollPeriodId: id,
        } as any;
      });
      
      const newRecords = await Promise.all(newRecordsPromises);

      await db.transaction('rw', db.payrollPeriods, db.payrollRecords, async () => {
        const oldRecords = await db.payrollRecords.where('payrollPeriodId').equals(id).toArray();
        if (oldRecords.length > 0) {
          const oldIds = oldRecords.map(r => r.id);
          await db.payrollRecords.bulkDelete(oldIds);
        }
        
        await db.payrollRecords.bulkAdd(newRecords);
        if (customStartDate || customEndDate) {
          await db.payrollPeriods.update(id, { 
            startDate: startDate,
            endDate: endDate
          });
        }
      });
      
    } catch (error) {
      console.error('Failed to calculate payroll:', error);
    }
    setIsCalculating(false);
  };

  const handleToggleRule = async (ruleId: string, isNowDisabled: boolean) => {
    if (!id || !period) return;
    const currentDisabled = period.disabledRuleIds || [];
    let nextDisabled: string[];
    if (isNowDisabled) {
      nextDisabled = Array.from(new Set([...currentDisabled, ruleId]));
    } else {
      nextDisabled = currentDisabled.filter(rId => rId !== ruleId);
    }
    await db.payrollPeriods.update(id, { disabledRuleIds: nextDisabled });
    await handleCalculate(period.startDate, period.endDate, nextDisabled);
  };

  const handleToggleAllRules = async (ruleIds: string[], isNowDisabled: boolean) => {
    if (!id || !period) return;
    const currentDisabled = new Set(period.disabledRuleIds || []);
    if (isNowDisabled) {
      ruleIds.forEach(rId => currentDisabled.add(rId));
    } else {
      ruleIds.forEach(rId => currentDisabled.delete(rId));
    }
    const nextDisabled = Array.from(currentDisabled);
    await db.payrollPeriods.update(id, { disabledRuleIds: nextDisabled });
    await handleCalculate(period.startDate, period.endDate, nextDisabled);
  };

  // Perhitungan otomatis saat halaman pertama kali dimuat jika belum ada record
  useEffect(() => {
    if (!id || !period) return;
    if (records !== undefined && records.length === 0 && !autoCalculatedRef.current && !isCalculating) {
      autoCalculatedRef.current = true;
      handleCalculate();
    }
  }, [id, period, records, isCalculating]);

  const handleSaveCutOff = async (newStartDate: string, newEndDate: string, newName?: string) => {
    if (!id || !period) return;
    await db.payrollPeriods.update(id, {
      startDate: newStartDate,
      endDate: newEndDate,
      ...(newName ? { name: newName } : {})
    });
    await handleCalculate(newStartDate, newEndDate);
  };

  const handleExportCSV = async () => {
    if (!records || records.length === 0) return;
    const employees = await db.employees.toArray();
    exportPayrollRecordsToCSV(records, period, employees);
  };

  const handleDeletePeriod = async () => {
    if (!id) return;
    await db.transaction('rw', db.payrollPeriods, db.payrollRecords, async () => {
      await db.payrollRecords.where('payrollPeriodId').equals(id).delete();
      await db.payrollPeriods.delete(id);
    });
    navigate('/payroll');
  };

  if (period === undefined) return <div className="p-8 text-center text-slate-500 text-xs">Memuat data payroll...</div>;
  if (period === null) return <div className="p-8 text-center text-rose-500 text-xs">Periode payroll tidak ditemukan.</div>;

  // 1. Total Karyawan
  const totalEmployees = records?.length || 0;

  // 2. Total Gaji Pokok & Tunjangan
  const totalBasic = records?.reduce((s, r) => s + (r.basicSalary || 0), 0) || 0;
  const totalGross = records?.reduce((s, r) => s + (r.grossSalary || 0), 0) || 0;
  const totalAllowances = Math.max(0, totalGross - totalBasic);

  // 3. Total Pajak Penghasilan (PPh 21)
  const totalTax = records?.reduce((s, r) => s + (r.tax || 0), 0) || 0;

  // 4. Total BPJS Kesehatan
  const totalBpjsKesehatan = records?.reduce((sum, r) => {
    const health = r.deductionsBreakdown?.find(d => 
      d.id === 'ded_bpjs_kesehatan' || 
      d.name.toLowerCase().includes('bpjs kesehatan')
    );
    return sum + (health?.amount || 0);
  }, 0) || 0;

  // 5. Total BPJS Ketenagakerjaan
  const totalBpjsTk = records?.reduce((sum, r) => {
    const tkDeductions = r.deductionsBreakdown?.filter(d => 
      d.id === 'ded_bpjs_jht' || 
      d.id === 'ded_bpjs_jp' || 
      d.name.toLowerCase().includes('bpjs ketenagakerjaan') ||
      d.name.toLowerCase().includes('jht') ||
      d.name.toLowerCase().includes('jp')
    ) || [];
    const sub = tkDeductions.reduce((acc, d) => acc + (d.amount || 0), 0);
    if (sub === 0 && (r.bpjs || 0) > 0) {
      const healthAmt = r.deductionsBreakdown?.find(d => 
        d.id === 'ded_bpjs_kesehatan' || 
        d.name.toLowerCase().includes('bpjs kesehatan')
      )?.amount || 0;
      return sum + Math.max(0, (r.bpjs || 0) - healthAmt);
    }
    return sum + sub;
  }, 0) || 0;

  // 6. Total Pemotongan & Total Take Home Pay
  const totalDeductions = records?.reduce((s, r) => s + (r.totalDeduction || 0), 0) || 0;
  const totalNet = records?.reduce((s, r) => s + (r.netSalary || 0), 0) || 0;
  const totalOtherDeductions = Math.max(0, totalDeductions - totalTax - totalBpjsKesehatan - totalBpjsTk);

  const periodTitle = period.name ? (period.name.toLowerCase().startsWith('payroll') ? period.name : `Payroll ${period.name}`) : `Payroll ${period.month} ${period.year}`;

  const renderHeaderButtons = () => (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => window.print()}
        className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center shrink-0"
        title="Cetak Ringkasan Payroll"
      >
        <Printer className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setIsSettingModalOpen(true)}
        className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center shrink-0"
        title="Pengaturan Periode Payroll"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <HideBottomNav />

      {/* Tombol Back di Header */}
      <PageHeaderTitle 
        title={periodTitle} 
        subtitle="Gambaran Umum & Informasi Payroll" 
        onBack={() => navigate('/payroll')}
        hideHamburger={true}
      />

      <DesktopHeaderActions>
        {renderHeaderButtons()}
      </DesktopHeaderActions>
      <MobileHeaderActions>
        {renderHeaderButtons()}
      </MobileHeaderActions>

      {/* 5 KARTU FINANSIAL UTAMA */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Baris 1: Total Gaji Di Bayarkan | Pajak PPh */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
          <span className="text-xs text-slate-500 font-normal block">
            Total gaji dibayarkan
          </span>
          <div className="text-base sm:text-lg font-bold text-emerald-600 tracking-tight mt-1">
            {formatRupiah(totalGross)}
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
          <span className="text-xs text-slate-500 font-normal block">
            Pajak PPh
          </span>
          <div className="text-base sm:text-lg font-bold text-amber-600 tracking-tight mt-1">
            {formatRupiah(totalTax)}
          </div>
        </div>

        {/* Baris 2: Bpjs Ketenagakerjaan | Bpjs Kesehatan */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
          <span className="text-xs text-slate-500 font-normal block">
            BPJS ketenagakerjaan
          </span>
          <div className="text-base sm:text-lg font-bold text-indigo-700 tracking-tight mt-1">
            {formatRupiah(totalBpjsTk)}
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-cyan-300 transition-colors">
          <span className="text-xs text-slate-500 font-normal block">
            BPJS kesehatan
          </span>
          <div className="text-base sm:text-lg font-bold text-cyan-700 tracking-tight mt-1">
            {formatRupiah(totalBpjsKesehatan)}
          </div>
        </div>

        {/* Baris 3: Take Home Pay */}
        <div className="col-span-2 p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
          <span className="text-xs text-slate-500 font-normal block">
            Take home pay
          </span>
          <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
            {formatRupiah(totalNet)}
          </div>
        </div>
      </div>

      {/* DETAIL SEPUTAR GAMBARAN UMUM PERIODE PAYROLL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Kolom Kiri: Informasi Parameter Payroll */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">Parameter Payroll</h4>
            <button
              type="button"
              onClick={() => navigate(`/payroll/${id}/employees`)}
              className="text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
            >
              Lihat Rincian
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Rentang Cut Off Awal</span>
              <span className="font-semibold text-slate-800">{formatSimpleDateIndo(period.startDate)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Rentang Cut Off Akhir</span>
              <span className="font-semibold text-slate-800">{formatSimpleDateIndo(period.endDate)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 font-medium">Jumlah Karyawan</span>
              <span className="font-bold text-blue-600">{totalEmployees} Orang</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Agregat Tunjangan & Pemotongan */}
        <div className="lg:col-span-2 space-y-3">
          <div className="pb-2.5 border-b border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">Rekapitulasi</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Komponen Penghasilan / Gaji */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="text-xs font-bold text-emerald-600">
                Gaji & Tunjangan
              </div>
              <div className="space-y-1.5 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1 font-medium text-slate-700">
                  <span>Total Gaji Pokok</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(totalBasic)}</span>
                </div>
                <div className="flex justify-between py-1 font-medium text-slate-700">
                  <span>Total Seluruh Tunjangan & Lembur</span>
                  <span className="font-semibold text-emerald-700">+{formatRupiah(totalAllowances)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-900">
                <span>Total Gaji Bruto Dibayarkan</span>
                <span>{formatRupiah(totalGross)}</span>
              </div>
            </div>

            {/* Box Komponen Pemotongan */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="text-xs font-bold text-rose-600">
                Potongan
              </div>
              <div className="space-y-1.5 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1 font-medium text-slate-700">
                  <span>Pajak Penghasilan (PPh 21)</span>
                  <span className="font-semibold text-rose-600">-{formatRupiah(totalTax)}</span>
                </div>
                <div className="flex justify-between py-1 font-medium text-slate-700">
                  <span>BPJS Kesehatan (1%)</span>
                  <span className="font-semibold text-rose-600">-{formatRupiah(totalBpjsKesehatan)}</span>
                </div>
                <div className="flex justify-between py-1 font-medium text-slate-700">
                  <span>BPJS Ketenagakerjaan (JHT + JP)</span>
                  <span className="font-semibold text-rose-600">-{formatRupiah(totalBpjsTk)}</span>
                </div>
                {totalOtherDeductions > 0 && (
                  <div className="flex justify-between py-1 font-medium text-slate-700">
                    <span>Potongan Lainnya (Absen, Denda, dll)</span>
                    <span className="font-semibold text-rose-600">-{formatRupiah(totalOtherDeductions)}</span>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-900">
                <span>Total Pemotongan Gaji</span>
                <span className="text-rose-600">-{formatRupiah(totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Progress / Ratio Bar */}
          <div className="pt-2 space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-600">
              <span>Rasio Bersih: Gaji Bersih vs Pemotongan</span>
              <span>{totalGross > 0 ? ((totalNet / totalGross) * 100).toFixed(1) : 0}% Diterima Karyawan</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-blue-600 h-full transition-all duration-500" 
                style={{ width: `${totalGross > 0 ? (totalNet / totalGross) * 100 : 0}%` }}
                title="Take Home Pay"
              />
              <div 
                className="bg-red-400 h-full transition-all duration-500" 
                style={{ width: `${totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0}%` }}
                title="Total Potongan"
              />
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                Take Home Pay ({formatRupiah(totalNet)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                Potongan Pajak & BPJS ({formatRupiah(totalDeductions)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pengaturan Periode Payroll */}
      <ModalDetailSetting
        isOpen={isSettingModalOpen}
        onClose={() => setIsSettingModalOpen(false)}
        period={period}
        onSaveCutOff={handleSaveCutOff}
        onToggleRule={handleToggleRule}
        onToggleAllRules={handleToggleAllRules}
        onExportCSV={handleExportCSV}
        onDeletePeriod={handleDeletePeriod}
        totalEmployees={totalEmployees}
      />
    </div>
  );
}
