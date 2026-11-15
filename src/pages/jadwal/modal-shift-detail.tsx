import React from 'react';
import { Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { WorkShift } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { getShiftBadgeClasses, getShiftBadgeStyle } from './utils-helper';

export interface ModalShiftDetailProps {
  viewingShift: WorkShift | null;
  onClose: () => void;
  onEdit: (shift: WorkShift) => void;
  onDelete?: (shiftId: string) => void;
}

export function ModalShiftDetail({
  viewingShift,
  onClose,
  onEdit,
  onDelete,
}: ModalShiftDetailProps) {
  return (
    <Modal
      isOpen={Boolean(viewingShift)}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      {viewingShift && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header to the point: Badge Shift kecil & Nama Shift Tebal Besar */}
          <div className="flex justify-between items-start p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="min-w-0 flex-1 pr-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span 
                  style={getShiftBadgeStyle(viewingShift.color)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${getShiftBadgeClasses(viewingShift.color)}`}
                >
                  {viewingShift.code}
                </span>
                {viewingShift.isOff && (
                  <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-rose-200">
                    LIBUR / OFF
                  </span>
                )}
                {viewingShift.crossDay && !viewingShift.isOff && (
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-amber-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Lintas Hari
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug truncate">
                {viewingShift.name}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2 pt-0.5">
              <button 
                type="button"
                onClick={() => {
                  const shiftToEdit = viewingShift;
                  onClose();
                  onEdit(shiftToEdit);
                }} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                title="Edit Shift"
              >
                <Pencil className="w-4 h-4" />
              </button>
              {onDelete && (
                <button 
                  type="button"
                  onClick={() => {
                    const shiftIdToDelete = viewingShift.id;
                    onClose();
                    onDelete(shiftIdToDelete);
                  }} 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Shift"
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
          
          {/* Isi Modal: Langsung Card Jam Kerja dan Jam Istirahat */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs">
            {viewingShift.isOff ? (
              <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-xl text-center">
                <span className="block text-[11px] font-semibold text-rose-600 mb-0.5">Status Operasional</span>
                <span className="text-sm font-bold text-rose-700">Hari Libur / Bebas Tugas</span>
                <p className="text-[11px] text-slate-500 mt-1">Karyawan dengan shift ini tidak memiliki jam kerja wajib.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Card Jam Kerja */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Jam Kerja
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {viewingShift.startTime} - {viewingShift.endTime}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {viewingShift.crossDay ? 'Melewati tengah malam (+1 hari)' : 'Shift hari yang sama'}
                  </span>
                </div>

                {/* Card Jam Istirahat */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Jam Istirahat
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {viewingShift.breakStartTime && viewingShift.breakEndTime ? (
                      `${viewingShift.breakStartTime} - ${viewingShift.breakEndTime}`
                    ) : (
                      '-'
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {viewingShift.breakStartTime && viewingShift.breakEndTime ? 'Waktu istirahat resmi' : 'Tanpa waktu istirahat'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
