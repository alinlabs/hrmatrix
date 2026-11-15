import React, { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card } from '../../components/ui';
import { UserCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { db } from '../../db/database';
import { samplePositions } from '../../data/sampleDb/posisi';
import { Employee } from '../../types';

interface RecentEmployeesProps {
  employees: Employee[];
}

export function RecentEmployees({ employees }: RecentEmployeesProps) {
  const dbPositions = useLiveQuery(() => db.positions.toArray(), [], []);
  const [fallbackNames, setFallbackNames] = useState<Record<string, string>>({});

  const knownPositionMap = useMemo(() => {
    const map = new Map<string, string>();
    samplePositions.forEach((p) => map.set(p.id, p.name));
    dbPositions.forEach((p) => map.set(p.id, p.name));
    try {
      const raw = localStorage.getItem('hrmatrix_custom_job_templates');
      if (raw) {
        const parsed = JSON.parse(raw) as Array<{ id?: string; nama?: string }>;
        if (Array.isArray(parsed)) {
          parsed.forEach((tpl) => {
            if (tpl?.id && tpl?.nama) map.set(tpl.id, tpl.nama);
          });
        }
      }
    } catch {
      // Ignore storage errors
    }
    return map;
  }, [dbPositions]);

  useEffect(() => {
    const missingIds = employees
      .map((emp) => emp.positionId)
      .filter((id): id is string => Boolean(id) && !knownPositionMap.has(id) && !fallbackNames[id]);

    if (missingIds.length === 0) return;

    let cancelled = false;
    import('../../services/positionService').then(({ getPositionName }) => {
      if (cancelled) return;
      const resolved: Record<string, string> = {};
      missingIds.forEach((id) => {
        resolved[id] = getPositionName(id);
      });
      setFallbackNames((prev) => ({ ...prev, ...resolved }));
    });

    return () => {
      cancelled = true;
    };
  }, [employees, knownPositionMap, fallbackNames]);

  const resolvePositionName = (positionId?: string) => {
    if (!positionId) return 'Staff';
    return knownPositionMap.get(positionId) || fallbackNames[positionId] || positionId;
  };

  return (
    <Card className="lg:col-span-2">
      <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="font-semibold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-600" />
          Karyawan Terbaru
        </div>
        <Link to="/employees" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center">
          Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {employees.map((emp) => {
          const positionDisplay = resolvePositionName(emp.positionId);
          const deptDisplay = emp.departmentId || 'Umum';

          return (
            <div key={emp.id} className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <EmployeeAvatar employee={emp} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={deptDisplay}>
                    {deptDisplay}
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate" title={emp.fullName}>
                    {emp.fullName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={positionDisplay}>
                    {positionDisplay}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-slate-700">
                  Rp {new Intl.NumberFormat('id-ID').format(emp.basicSalary || 0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
