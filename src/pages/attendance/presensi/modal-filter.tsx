import React from 'react';
import { Filter, Building2, UserCheck, X } from 'lucide-react';
import { Button, Select } from '../../../components/ui';
import { Modal } from '../../../components/ui/Modal';
import { Department } from '../../../types';

interface ModalFilterProps {
  isOpen: boolean;
  onClose: () => void;
  departmentFilter: string;
  setDepartmentFilter: (dept: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  departments: Department[];
  onResetFilter: () => void;
}

export function ModalFilter({
  isOpen,
  onClose,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  departments,
  onResetFilter,
}: ModalFilterProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
      hideBottomNav={false}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Filter Data Absensi
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Saring data kehadiran karyawan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Filter Departemen */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Departemen
            </label>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs sm:text-sm bg-white"
              options={[
                { value: 'ALL', label: 'Semua Departemen' },
                ...departments.map(d => ({ value: d.id, label: d.name }))
              ]}
            />
          </div>

          {/* Filter Status */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              Status Kehadiran
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs sm:text-sm bg-white"
              options={[
                { value: 'ALL', label: 'Semua Status' },
                { value: 'NotSet', label: 'Belum Presensi' },
                { value: 'Present', label: 'Hadir Tepat Waktu' },
                { value: 'Late', label: 'Terlambat' },
                { value: 'LeaveGroup', label: 'Cuti / Sakit' },
                { value: 'WFH', label: 'Work From Home' },
                { value: 'Absent', label: 'Alpa / Tidak Hadir' },
              ]}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
          <Button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            onClick={onClose}
          >
            Terapkan Filter
          </Button>
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={onResetFilter}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
