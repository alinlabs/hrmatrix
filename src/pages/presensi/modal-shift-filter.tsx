import React from 'react';
import { Layers, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { AttendanceConfig } from '../../types';
import { shiftColorClasses } from './utils-helper';

interface ModalShiftFilterProps {
  isOpen: boolean;
  onClose: () => void;
  shiftFilter: string;
  setShiftFilter: (shiftId: string) => void;
  attendanceConfig: AttendanceConfig | null;
}

export function ModalShiftFilter({
  isOpen,
  onClose,
  shiftFilter,
  setShiftFilter,
  attendanceConfig,
}: ModalShiftFilterProps) {
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
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Filter Shift Kerja
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Pilih jenis shift untuk memfilter daftar presensi
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between text-xs px-0.5 shrink-0">
            <span className="font-semibold text-slate-500">Pilih Shift Kerja</span>
            {shiftFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  setShiftFilter('ALL');
                  onClose();
                }}
                className="text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer"
              >
                Hapus Filter
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {attendanceConfig?.shifts && attendanceConfig.shifts.length > 0 ? (
              attendanceConfig.shifts.map((s) => {
                const shiftIdentifier = s.id || s.code;
                const isSelected = shiftFilter === shiftIdentifier || shiftFilter === s.code || shiftFilter === s.id;
                const colorClass = shiftColorClasses[s.color] || shiftColorClasses.indigo;

                return (
                  <div
                    key={shiftIdentifier}
                    onClick={() => {
                      if (isSelected) {
                        setShiftFilter('ALL');
                      } else {
                        setShiftFilter(shiftIdentifier);
                      }
                      onClose();
                    }}
                    className={`p-3 border rounded-xl cursor-pointer transition-all shadow-2xs ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200/90 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="grid grid-cols-12 items-center gap-2 w-full text-xs">
                      {/* Kiri: Badge Code Shift */}
                      <div className="col-span-4 flex items-center min-w-0">
                        <span className={`px-2.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-md border truncate block ${colorClass}`}>
                          {s.code || s.name}
                        </span>
                      </div>

                      {/* Tengah: Nama Shift */}
                      <div className="col-span-4 font-bold text-slate-800 truncate text-left px-1">
                        {s.name}
                      </div>

                      {/* Kanan: Jam Kerja Shift */}
                      <div className="col-span-4 text-right text-slate-600 font-semibold whitespace-nowrap">
                        {s.startTime} - {s.endTime}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                Belum ada master shift kerja yang dikonfigurasi pada sistem.
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
