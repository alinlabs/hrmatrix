import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { v4 as uuidv4 } from 'uuid';
import { processPayrollRecord } from '../../services/payrollCalculator';
import { PeriodStats } from './types';
import { INDO_MONTHS_FULL } from './utils-helper';
import { PayrollHeader } from './payroll-header';
import { PayrollNavCards } from './payroll-nav-cards';
import { PayrollCardView } from './payroll-card-view';
import { ModalCreatePeriod } from './modal-create-period';

export function PayrollList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. Live Query: Periods & Records
  const periods = useLiveQuery(() => db.payrollPeriods.orderBy('year').reverse().toArray());
  const allRecords = useLiveQuery(() => db.payrollRecords.toArray());

  // 2. Aggregate statistics per period (count of employees & total net salary)
  const statsByPeriod = useMemo(() => {
    const map = new Map<string, PeriodStats>();
    if (!allRecords) return map;
    allRecords.forEach(r => {
      const cur = map.get(r.payrollPeriodId) || { count: 0, totalNet: 0 };
      cur.count += 1;
      cur.totalNet += (r.netSalary || 0);
      map.set(r.payrollPeriodId, cur);
    });
    return map;
  }, [allRecords]);

  // 3. Filter logic by search query
  const filteredPeriods = useMemo(() => {
    if (!periods) return [];
    if (!search.trim()) return periods;
    const q = search.toLowerCase().trim();
    return periods.filter(p => {
      const name = (p.name || '').toLowerCase();
      const month = (p.month || '').toLowerCase();
      const year = String(p.year || '');
      const status = (p.status || '').toLowerCase();
      return name.includes(q) || month.includes(q) || year.includes(q) || status.includes(q);
    });
  }, [periods, search]);

  // 4. Handle creation of new payroll period
  const handleCreatePeriod = async (name: string, startDate: string, endDate: string) => {
    const newId = uuidv4();
    const startParts = startDate.split('-');
    const year = parseInt(startParts[0], 10) || new Date().getFullYear();
    const monthIndex = parseInt(startParts[1], 10) - 1;
    const monthName = INDO_MONTHS_FULL[monthIndex] || 'Januari';

    await db.payrollPeriods.add({
      id: newId,
      name,
      month: monthName,
      year,
      startDate,
      endDate,
      status: 'Draft'
    });

    // Populate initial draft records for active employees
    const activeEmployees = await db.employees.where('status').equals('Active').toArray();
    const initialRecords = await Promise.all(
      activeEmployees.map(async emp => {
        const record = await processPayrollRecord(emp, {}, startDate);
        return {
          ...record,
          id: uuidv4(),
          payrollPeriodId: newId,
        } as any;
      })
    );

    if (initialRecords.length > 0) {
      await db.payrollRecords.bulkAdd(initialRecords);
    }

    navigate(`/payroll/${newId}`);
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full">
      {/* 1. Header with Search and Add Period Action */}
      <PayrollHeader
        search={search}
        onSearchChange={setSearch}
        onAddPeriod={() => setIsCreateModalOpen(true)}
      />

      {/* 2. Top 3 Navigation Cards: Tunjangan | BPJS | Pajak */}
      <PayrollNavCards />

      {/* Section Divider & Title for Periode Payroll */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Daftar Periode Penggajian
          </h2>
          {filteredPeriods && filteredPeriods.length > 0 && (
            <span className="text-[11px] font-semibold text-slate-500">
              ({filteredPeriods.length} Periode)
            </span>
          )}
        </div>
      </div>

      {/* 3. Main Card Grid View for Periods */}
      <PayrollCardView
        periods={periods}
        filteredPeriods={filteredPeriods}
        statsByPeriod={statsByPeriod}
        search={search}
        onResetSearch={() => setSearch('')}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onSelectPeriod={(id) => navigate(`/payroll/${id}`)}
      />

      {/* 4. Modal Buat Periode Baru */}
      <ModalCreatePeriod
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePeriod}
      />
    </div>
  );
}

export default PayrollList;
