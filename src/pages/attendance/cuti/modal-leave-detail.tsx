import React from 'react';
import { X, User, FileText } from 'lucide-react';
import { Leave, Employee } from '../../../types';
import { getLeaveTypeLabel } from './utils-helper';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Modal } from '../../../components/ui/Modal';

interface ModalLeaveDetailProps {
  isOpen: boolean;
  onClose: () => void;
  leave: Leave | null;
  employees: Employee[];
}

export function ModalLeaveDetail({
  isOpen,
  onClose,
  leave,
  employees
}: ModalLeaveDetailProps) {
  const employee = leave ? employees.find(e => e.id === leave.employeeId) : null;

  return (
    <Modal
      isOpen={isOpen && !!leave}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Detail Pengajuan
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Informasi rincian cuti/izin
              </p>
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

        {/* Modal Body */}
        {leave && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3 text-xs">
            {/* Karyawan */}
            <div className="border-b border-slate-100 pb-3">
              <div className="text-[11px] text-slate-500 font-normal mb-1">Karyawan</div>
              <div className="font-semibold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{employee?.fullName || leave.employeeId}</span>
              </div>
            </div>

            {/* Jenis Cuti */}
            <div className="border-b border-slate-100 pb-3">
              <div className="text-[11px] text-slate-500 font-normal mb-1">Jenis Cuti / Izin</div>
              <div className="font-semibold text-xs sm:text-sm text-slate-800">
                {getLeaveTypeLabel(leave.leaveType)}
              </div>
            </div>

            {/* Tanggal Mulai & Selesai */}
            <div className="grid grid-cols-2 gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="text-[11px] text-slate-500 font-normal mb-1">Tanggal Mulai</div>
                <div className="font-semibold text-xs text-slate-800">
                  {format(new Date(leave.startDate), 'dd MMM yyyy', { locale: id })}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-normal mb-1">Tanggal Selesai</div>
                <div className="font-semibold text-xs text-slate-800">
                  {format(new Date(leave.endDate), 'dd MMM yyyy', { locale: id })}
                </div>
              </div>
            </div>

            {/* Durasi */}
            <div className="border-b border-slate-100 pb-3">
              <div className="text-[11px] text-slate-500 font-normal mb-1">Durasi / Lama Cuti</div>
              <div className="font-semibold text-xs sm:text-sm text-slate-800">
                {leave.duration} Hari
              </div>
            </div>

            {/* Keterangan / Alasan */}
            <div className="pt-0.5">
              <div className="text-[11px] text-slate-500 font-normal mb-1">Keterangan / Alasan</div>
              <div className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50 border border-slate-100 rounded-xl p-3">
                {leave.reason || '-'}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer: Single Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
