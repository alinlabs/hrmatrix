import React from 'react';
import { Users } from 'lucide-react';
import { EmployeeAttendanceItem, QuickUpdatePayload, ViewMode } from './types';
import { CardKaryawanItem } from './card-karyawan-item';

interface PresensiCardViewProps {
  items: EmployeeAttendanceItem[];
  viewMode: ViewMode;
  onQuickUpdate: (employeeId: string, updates: QuickUpdatePayload) => void;
}

export function PresensiCardView({ items, viewMode, onQuickUpdate }: PresensiCardViewProps) {
  return (
    <div className={viewMode === 'table' ? 'md:hidden' : 'block'}>
      {items.length === 0 ? (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500">
          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold">Tidak ada karyawan yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {items.map((item) => (
            <CardKaryawanItem
              key={item.employee.id}
              item={item}
              onQuickUpdate={onQuickUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
