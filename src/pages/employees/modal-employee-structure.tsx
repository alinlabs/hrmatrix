import React from 'react';
import { Network, X, Building2, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { Employee } from '../../types';
import { getPositionName } from '../../services/positionService';

export interface EmployeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentGroups: Record<string, Employee[]>;
  onSelectEmployee: (emp: Employee) => void;
}

export function EmployeeStructureModal({
  isOpen,
  onClose,
  departmentGroups,
  onSelectEmployee
}: EmployeeStructureModalProps) {
  const departments = Object.keys(departmentGroups);

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-2xl p-0 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Struktur Organisasi & Tim</h3>
              <p className="text-xs text-slate-500">Pemetaan hierarki berdasarkan departemen dan posisi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {departments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Belum ada data departemen.
            </div>
          ) : (
            departments.map((dept) => {
              const members = departmentGroups[dept] || [];
              return (
                <div key={dept} className="border border-slate-200/90 rounded-xl overflow-hidden bg-slate-50/50">
                  <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">{dept}</span>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {members.length} Karyawan
                    </span>
                  </div>

                  <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {members.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => {
                          onClose();
                          onSelectEmployee(emp);
                        }}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {emp.fullName ? emp.fullName.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{emp.fullName}</p>
                            <p className="text-[11px] text-slate-500 truncate">{getPositionName(emp.positionId) || 'Staff'} • {emp.employeeId}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button size="sm" onClick={onClose} className="h-8 text-xs">
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
