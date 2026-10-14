import React, { useMemo } from 'react';
import { CalendarRange, X } from 'lucide-react';
import { Employee, Department, Leave, LeaveTypePolicy } from '../../../types';
import { EmployeeLeaveSummary } from '../../../services/leaveService';
import { Modal } from '../../../components/ui/Modal';
import { DatePickerInput, Select, Input } from '../../../components/ui';
import { LeaveEmployeeCombobox } from './combobox-karyawan';
import { calculateDuration } from './utils-helper';

interface ModalFormPengajuanProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  editingLeave: Leave | null;
  employees: Employee[];
  departments: Department[];
  leavePolicies: LeaveTypePolicy[];
  employeeLeaveSummaries: EmployeeLeaveSummary[];
  selectedYear: number;
  handleSaveLeave: (e: React.FormEvent) => Promise<void>;
}

export function ModalFormPengajuan({
  isOpen,
  onClose,
  formData,
  setFormData,
  editingLeave,
  employees,
  departments,
  leavePolicies,
  employeeLeaveSummaries,
  selectedYear,
  handleSaveLeave
}: ModalFormPengajuanProps) {
  const departmentMap = useMemo(() => new Map(departments.map(d => [d.id, d.name])), [departments]);

  const selectedEmpSummary = useMemo(() => {
    if (!formData.employeeId) return null;
    return employeeLeaveSummaries.find(s => s.employeeId === formData.employeeId);
  }, [formData.employeeId, employeeLeaveSummaries]);

  const policyOptions = useMemo(() => {
    return leavePolicies.map((p) => ({
      value: p.name,
      label: `${p.name} (${p.code})`,
      subLabel: p.defaultQuota > 0 ? `${p.defaultQuota} Hari` : 'Fleksibel'
    }));
  }, [leavePolicies]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-md">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <CalendarRange className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
              {editingLeave ? 'Edit Pengajuan Cuti / Izin' : 'Form Pengajuan Cuti / Izin'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Lengkapi formulir permohonan cuti resmi</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={onClose} 
          title="Tutup"
          aria-label="Tutup"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSaveLeave} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Employee Combobox Selection */}
          <LeaveEmployeeCombobox
            label="Nama Karyawan"
            value={formData.employeeId}
            onChange={(id) => setFormData({ ...formData, employeeId: id })}
            employees={employees}
            departmentsMap={departmentMap}
            placeholder=""
          />

          {/* Sisa Kuota Banner */}
          {selectedEmpSummary && (
            <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-600 text-xs font-normal">Sisa Kuota Cuti Tahunan:</span>
                <div className="text-[10px] text-slate-400 font-normal">Tahun {selectedYear}</div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-blue-700">
                  {selectedEmpSummary.remainingAnnual} Hari
                </span>
                <div className="text-[10px] text-slate-500 font-normal">
                  dari total {selectedEmpSummary.totalEntitlement} hari
                </div>
              </div>
            </div>
          )}

          <Select 
            label="Jenis Cuti / Izin"
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            options={policyOptions}
          />

          <div className="grid grid-cols-2 gap-3">
            <DatePickerInput
              label="Tanggal Mulai"
              required
              value={formData.startDate}
              onChange={(newStart) => {
                const newDur = calculateDuration(newStart, formData.endDate);
                setFormData({
                  ...formData, 
                  startDate: newStart, 
                  duration: newStart <= formData.endDate ? newDur : 1
                });
              }}
            />
            <DatePickerInput
              label="Tanggal Selesai"
              required
              min={formData.startDate}
              value={formData.endDate}
              onChange={(newEnd) => {
                const newDur = calculateDuration(formData.startDate, newEnd);
                setFormData({ ...formData, endDate: newEnd, duration: newDur });
              }}
            />
          </div>

          <Input 
            label="Durasi (Jumlah Hari Kerja)"
            type="number"
            required
            min={1}
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
          />

          <div>
            <label className="block text-[11px] font-normal text-slate-600 mb-1">
              Keterangan / Alasan
            </label>
            <textarea 
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full text-xs font-normal rounded-xl border border-slate-200/90 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none min-h-[64px]"
              rows={2}
              placeholder=""
            />
          </div>
        </div>
        
        {/* Modal Footer: Single Primary Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            {editingLeave ? 'Simpan Perubahan' : 'Ajukan Cuti'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
