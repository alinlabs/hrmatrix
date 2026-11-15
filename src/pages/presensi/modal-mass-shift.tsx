import React from 'react';
import { Layers, X } from 'lucide-react';
import { Button, Select } from '../../components/ui';
import { AttendanceConfig } from '../../types';
import { Modal } from '../../components/ui/Modal';

interface ModalMassShiftProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceConfig: AttendanceConfig | null;
  activeEmployeesCount: number;
  filterDate: string;
  massShiftId: string;
  setMassShiftId: (id: string) => void;
  onApplyMassShift: (e: React.FormEvent) => void;
}

export function ModalMassShift({
  isOpen,
  onClose,
  attendanceConfig,
  activeEmployeesCount,
  filterDate,
  massShiftId,
  setMassShiftId,
  onApplyMassShift,
}: ModalMassShiftProps) {
  if (attendanceConfig?.systemType !== 'shift') return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
      hideBottomNav={false}
    >
      <form onSubmit={onApplyMassShift} className="flex flex-col flex-1 min-h-0">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Tetapkan Shift Massal Tanggal Ini
              </h3>
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
          <p className="text-xs text-slate-600 leading-relaxed">
            Pilihan shift ini akan diterapkan ke <strong>seluruh {activeEmployeesCount} karyawan aktif</strong> untuk tanggal <strong>{filterDate}</strong>.
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Pilih Shift Kerja Massal</label>
            <Select
              value={massShiftId}
              onChange={(e) => setMassShiftId(e.target.value)}
              options={attendanceConfig.shifts?.map(s => ({
                value: s.id,
                label: `${s.name} (${s.startTime} - ${s.endTime})`
              })) || []}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer text-center"
          >
            Terapkan Shift ke Semua
          </button>
        </div>
      </form>
    </Modal>
  );
}
