import React from 'react';
import { CalendarDays, Pencil, Trash2, X } from 'lucide-react';
import { ShiftPattern, AttendanceConfig, WorkShift } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { getShiftBadgeClasses, getShiftBadgeStyle } from './utils-helper';

export interface ModalPatternDetailProps {
  viewingPattern: ShiftPattern | null;
  onClose: () => void;
  onEdit: (pattern: ShiftPattern) => void;
  onDelete?: (patternId: string) => void;
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
}

export function ModalPatternDetail({
  viewingPattern,
  onClose,
  onEdit,
  onDelete,
  activeConfig,
  availableShifts,
}: ModalPatternDetailProps) {
  return (
    <Modal
      isOpen={Boolean(viewingPattern)}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      {viewingPattern && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Modal */}
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <CalendarDays className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-400 font-normal leading-tight">
                  Siklus {viewingPattern.cycle.length} Hari
                </span>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug truncate mt-0.5">
                  {viewingPattern.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button 
                type="button"
                onClick={() => {
                  const patternToEdit = viewingPattern;
                  onClose();
                  onEdit(patternToEdit);
                }} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                title="Edit Pola"
              >
                <Pencil className="w-4 h-4" />
              </button>
              {onDelete && (
                <button 
                  type="button"
                  onClick={() => {
                    const patternIdToDelete = viewingPattern.id;
                    onClose();
                    onDelete(patternIdToDelete);
                  }} 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Pola"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="w-px h-4 bg-slate-200 mx-0.5" />
              <button 
                type="button"
                onClick={onClose} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Isi Modal: Kolom Sejajar Bullets | Hari Ke-X | Label Shift */}
          <div className="p-4 sm:p-5 overflow-y-auto text-xs">
            <h5 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Urutan Siklus Rotasi
            </h5>
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-2.5 pb-1">
              {viewingPattern.cycle.map((sId, index) => {
                const isOff = sId === 'OFF';
                const s = (activeConfig?.shifts || availableShifts).find(x => x.id === sId);
                const shiftCode = isOff ? 'OFF' : (s?.code || sId);
                const isActualOff = isOff || s?.isOff || s?.code?.toUpperCase() === 'OFF';
                const color = isActualOff ? 'rose' : (s?.color || 'blue');

                return (
                  <div key={index} className="relative pl-5 flex items-center justify-between py-0.5">
                    <div className={`absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white ring-1 ${isActualOff ? 'bg-rose-500 ring-rose-200' : 'bg-blue-500 ring-blue-200'}`} />
                    <span className="text-xs font-semibold text-slate-800">
                      Hari Ke-{index + 1}
                    </span>
                    <span 
                      style={getShiftBadgeStyle(color)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getShiftBadgeClasses(color)}`}
                    >
                      {shiftCode}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
