import React from 'react';
import { X, User, Zap, ArrowRight, Pencil, Plus } from 'lucide-react';
import { isShiftOff, resolveWageCategory } from '../../../services/shiftService';
import { AttendanceConfig } from '../../../types';
import { Modal } from '../../../components/ui/Modal';

interface ModalDetailProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (selectedExtra: any) => void;
  selectedExtra: any;
  empMap: Map<string, any>;
  posMap: Map<string, any>;
  getShiftBadge: (shiftId: string, customName?: string) => React.ReactNode;
  deleteExtraShift?: (id: string) => Promise<void>;
  activeConfig?: AttendanceConfig | null;
  dayMode?: 'separate' | 'unified';
  offdayCalcType?: string;
  offdayCalcBasis?: string;
  offdayMultFirst?: number;
  offdayMultNext?: number;
  offdayStaticRate?: number;
  offdayFlatMult?: number;
  normalCalcType?: string;
  normalCalcBasis?: string;
  normalMultFirst?: number;
  normalMultNext?: number;
  normalStaticRate?: number;
  normalFlatMult?: number;
  normalBaseDivider?: number;
  offdayBaseDivider?: number;
}

export function ModalDetail({
  isOpen,
  onClose,
  onEdit,
  selectedExtra,
  empMap,
  posMap,
  getShiftBadge,
  activeConfig,
  dayMode,
  offdayCalcType,
  offdayCalcBasis,
  offdayMultFirst,
  offdayMultNext,
  offdayStaticRate,
  offdayFlatMult,
  normalCalcType,
  normalCalcBasis,
  normalMultFirst,
  normalMultNext,
  normalStaticRate,
  normalFlatMult,
  normalBaseDivider,
  offdayBaseDivider,
}: ModalDetailProps) {
  if (!selectedExtra) return null;

  const emp = empMap.get(selectedExtra.employeeId);
  const posName = emp?.positionId && posMap.get(emp.positionId)?.name ? posMap.get(emp.positionId)?.name : 'Staff';

  // Format Date (2 lines)
  const dateObj = new Date(selectedExtra.workDate);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  let dayName = '-';
  let dateFormatted = selectedExtra.workDate || '-';
  if (!isNaN(dateObj.getTime())) {
    dayName = days[dateObj.getDay()];
    dateFormatted = `${dateObj.getDate()} ${shortMonths[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  }

  // Duration
  let rawHours = 0;
  if (selectedExtra.extraType === 'full_shift') {
    rawHours = selectedExtra.durationHours || 8;
  } else if (selectedExtra.extraType === 'half_shift') {
    rawHours = selectedExtra.durationHours || 4;
  } else {
    rawHours = selectedExtra.durationHours || 0;
  }
  const hoursNumber = Math.round(Number(rawHours) || 0);

  // Strict & Robust Wage Category Determination
  const categoryCode = selectedExtra.wageCategory 
    ? String(selectedExtra.wageCategory).toUpperCase() 
    : resolveWageCategory(selectedExtra, activeConfig, dayMode);

  // Check if mandatory shift (left side) is OFF
  const isMandatoryOff = isShiftOff(selectedExtra.mandatoryShiftId, selectedExtra.mandatoryShiftName);

  // Category Color
  const getCategoryColorClass = (code: string) => {
    switch (code) {
      case 'OFFDAY':
        return 'text-rose-600';
      case 'SERAGAM':
        return 'text-emerald-600';
      case 'NORMAL':
      default:
        return 'text-blue-600';
    }
  };

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
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Detail Shift Tambahan
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Informasi lengkap jadwal lembur karyawan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => {
                if (onEdit) onEdit(selectedExtra);
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Shift Tambahan"
            >
              <Pencil className="w-4 h-4" />
            </button>
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Card Karyawan */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
              {emp?.fullName ? emp.fullName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-900 text-sm truncate">
                {emp?.fullName || selectedExtra.employeeId}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {posName}
              </div>
            </div>
          </div>

          {/* Tanggal & Durasi (Tanpa Header Teks, Rata Tengah & 2 Line) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-center flex flex-col justify-center min-h-[60px]">
              <div className="font-bold text-slate-900 text-sm leading-tight">{dayName}</div>
              <div className="font-semibold text-slate-600 text-[11px] mt-0.5">{dateFormatted}</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-center flex flex-col justify-center min-h-[60px]">
              <div className="font-bold text-slate-900 text-sm leading-tight">{hoursNumber}</div>
              <div className="font-semibold text-slate-600 text-[11px] mt-0.5">Jam</div>
            </div>
          </div>

          {/* Card Perubahan Shift */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-3">
            <div className={`text-center text-sm font-extrabold uppercase tracking-wide ${getCategoryColorClass(categoryCode)}`}>
              {categoryCode}
            </div>
            <div className="grid grid-cols-3 items-center justify-items-center gap-2">
              <div className="flex justify-center w-full">
                {selectedExtra.mandatoryShiftId ? (
                  getShiftBadge(selectedExtra.mandatoryShiftId, selectedExtra.mandatoryShiftName)
                ) : (
                  <span className="text-slate-400 font-medium text-xs">-</span>
                )}
              </div>

              <div className="flex justify-center">
                {isMandatoryOff ? (
                  <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-blue-500 shrink-0" />
                )}
              </div>

              <div className="flex justify-center w-full">
                {getShiftBadge(
                  selectedExtra.shiftId === 'HOURLY' ? 'shift-reguler' : selectedExtra.shiftId,
                  selectedExtra.shiftId === 'HOURLY' ? 'Non-Shift' : selectedExtra.shiftName
                )}
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-center">
            <div className="text-xs text-slate-500 font-normal">
              Keterangan
            </div>
            <div className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap font-medium">
              {selectedExtra.reason || 'Tidak ada keterangan tambahan.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl cursor-pointer transition-colors text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}

