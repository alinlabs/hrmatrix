import React from 'react';
import { CalendarDays, Pencil, X } from 'lucide-react';
import { Employee } from '../../types';
import { Modal } from '../../components/ui/Modal';

export interface MatrixCellDetailData {
  employee: Employee;
  date: string;
  shiftId: string;
  shiftName: string;
  cellInfo: any;
}

export interface ModalMatrixCellDetailProps {
  isOpen: boolean;
  viewCellDetail: MatrixCellDetailData | null;
  onClose: () => void;
  onOpenSwapFromView: () => void;
  deptMap: Map<string, string>;
  posMap: Map<string, string>;
  getShiftBadge: (shiftId: string, shiftName: string) => React.ReactNode;
  formatHariTanggalIndo: (dateStr: string) => string;
}

export function ModalMatrixCellDetail({
  isOpen,
  viewCellDetail,
  onClose,
  onOpenSwapFromView,
  deptMap,
  posMap,
  getShiftBadge,
  formatHariTanggalIndo,
}: ModalMatrixCellDetailProps) {
  return (
    <Modal
      isOpen={isOpen && !!viewCellDetail}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      {viewCellDetail && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <CalendarDays className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-none">Detail Jadwal Shift</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Informasi rincian jadwal kerja karyawan</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={onOpenSwapFromView}
                title="Tukar / Ubah Shift"
                className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content: Static View Text */}
          <div className="p-5 space-y-3.5 text-xs">
            {/* Karyawan Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="font-bold text-slate-900 text-sm truncate">
                {viewCellDetail.employee.fullName}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                <span>NIK: {viewCellDetail.employee.employeeId || '-'}</span>
                <span>•</span>
                <span>{deptMap.get(viewCellDetail.employee.departmentId) || viewCellDetail.employee.departmentId || 'Departemen'}</span>
              </div>
            </div>

            {/* Tanggal & Jabatan */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-medium mb-0.5">Tanggal</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {formatHariTanggalIndo(viewCellDetail.date)}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-medium mb-0.5">Posisi / Jabatan</span>
                <span className="font-semibold text-slate-800 text-xs truncate block">
                  {posMap.get(viewCellDetail.employee.positionId) || viewCellDetail.employee.positionId || 'Staff'}
                </span>
              </div>
            </div>

            {/* Shift Terjadwal Card */}
            <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">Shift Terjadwal</span>
                <div>
                  {getShiftBadge(viewCellDetail.shiftId, viewCellDetail.shiftName)}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-slate-700">
                <span className="text-[11px] text-slate-500">Nama Shift</span>
                <span className="font-bold text-slate-900 text-xs">{viewCellDetail.shiftName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-[11px] text-slate-500">Jam Kerja</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {viewCellDetail.cellInfo.isOff 
                    ? 'Hari Libur / Bebas Tugas' 
                    : (viewCellDetail.cellInfo.startTime && viewCellDetail.cellInfo.endTime 
                        ? `${viewCellDetail.cellInfo.startTime} - ${viewCellDetail.cellInfo.endTime} WIB`
                        : 'Jam Normal Office')}
                </span>
              </div>
            </div>

            {/* Sumber Jadwal & Catatan */}
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Tipe Penjadwalan</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {viewCellDetail.cellInfo.sched?.notes?.includes('Tukar') 
                    ? 'Pertukaran Shift' 
                    : viewCellDetail.cellInfo.sched?.isOvershift 
                    ? 'Overshift' 
                    : viewCellDetail.cellInfo.sched 
                    ? 'Penyesuaian Manual' 
                    : 'Pola Roster Otomatis'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-medium mb-1">Catatan / Keterangan</span>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {viewCellDetail.cellInfo.sched?.notes || 'Tidak ada catatan khusus.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
