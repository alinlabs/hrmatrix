import React from 'react';
import { Zap, X, Plus, Minus, ArrowRight, Check, Calendar } from 'lucide-react';
import { EmployeeCombobox } from './combobox-karyawan';
import { Button } from '../../../components/ui';
import { Modal } from '../../../components/ui/Modal';

const formatShortDateIndo = (dateStr?: string) => {
  if (!dateStr) return '';
  const cleanStr = dateStr.split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const y = parts[0];
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(m) && !isNaN(d) && months[m]) {
      return `${d} ${months[m]} ${y}`;
    }
  }
  return dateStr;
};

export function FormJadwalTambahan(props: any) {
  const { isExtraModalOpen, setIsExtraModalOpen, handleSaveExtra, extraEmp, setExtraEmp, employees, extraWorkDate, setExtraWorkDate, durationHours, setDurationHours, selectedEmpObj, isNonShiftEmployee, getShiftBadge, detectedMandatoryShift, availableShifts, selectedExtraShiftId, setSelectedExtraShiftId, extraReason, setExtraReason, isSubmitting } = props;
  return (
    <>
      
        
      <Modal
        isOpen={isExtraModalOpen}
        onClose={() => setIsExtraModalOpen(false)}
        contentClassName="sm:max-w-xl"
      >

            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-none">Penjadwalan Shift Tambahan / Lembur</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Penetapan lemburan murni untuk konversi upah lembur karyawan</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsExtraModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveExtra} className="flex flex-col flex-1 min-h-0">
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 w-full text-xs">
                
                {/* 1. Pilih Karyawan (Combobox) */}
                <EmployeeCombobox
                  label="Nama Karyawan"
                  value={extraEmp}
                  onChange={(id) => setExtraEmp(id)}
                  employees={employees}
                  placeholder="Ketik nama atau NIK karyawan..."
                />

                {/* 2. Tanggal Lembur & Durasi (Grid 2 Kolom Horizontal) */}
                <div className="grid grid-cols-2 gap-3.5 min-w-0">
                  <div className="min-w-0">
                    <label className="block text-xs font-normal text-slate-500 mb-1">
                      Tanggal Lembur <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white flex items-center justify-between text-xs font-medium cursor-pointer group-hover:border-slate-400 transition-colors">
                        <span className={extraWorkDate ? "text-slate-800" : "text-slate-400"}>
                          {extraWorkDate ? formatShortDateIndo(extraWorkDate) : "Pilih tanggal..."}
                        </span>
                        <Calendar className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                      </div>
                      <input
                        type="date"
                        required
                        value={extraWorkDate}
                        onChange={(e) => setExtraWorkDate(e.target.value)}
                        onClick={(e) => {
                          try {
                            e.currentTarget.showPicker?.();
                          } catch {}
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-normal text-slate-500 mb-1">
                      Durasi <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center h-9 rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setDurationHours((prev: number) => Math.max(1, (Number(prev) || 1) - 1))}
                        disabled={durationHours <= 1}
                        className="w-9 h-full flex items-center justify-center bg-slate-100/90 text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:hover:bg-slate-100/90 cursor-pointer disabled:cursor-not-allowed border-r border-slate-200 transition-colors shrink-0 select-none"
                        title="Kurangi Durasi"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <div className="relative flex-1 h-full min-w-0 flex items-center justify-center">
                        <input
                          type="number"
                          required
                          min={1}
                          step={1}
                          value={durationHours}
                          onChange={(e) => setDurationHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-full h-full text-center text-xs font-bold text-slate-900 bg-transparent outline-none pr-8 pl-3 box-border"
                        />
                        <span className="absolute right-2.5 text-xs font-semibold text-slate-400 pointer-events-none select-none">
                          Jam
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDurationHours((prev: number) => (Number(prev) || 0) + 1)}
                        className="w-9 h-full flex items-center justify-center bg-slate-100/90 text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:bg-slate-300 cursor-pointer border-l border-slate-200 transition-colors shrink-0 select-none"
                        title="Tambah Durasi"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Card List Opsi Shift Tambahan (Tampak hanya jika Karyawan & Tanggal Lembur sudah ditentukan) */}
                {extraEmp && extraWorkDate ? (
                  <div className="space-y-2 min-w-0 animate-in fade-in duration-200">
                    <label className="block text-xs font-normal text-slate-500">
                      Pilihan Shift Tambahan <span className="text-rose-500">*</span>
                    </label>

                    {selectedEmpObj && isNonShiftEmployee ? (
                      /* Non-Shift Employee Card */
                      <div className="p-3 rounded-xl border border-blue-500 bg-blue-50/40 ring-1 ring-blue-400/50 shadow-xs grid grid-cols-3 items-center min-w-0">
                        <div className="flex justify-start items-center min-w-0">
                          {detectedMandatoryShift?.isOff ? (
                            getShiftBadge('shift-off', 'Libur (OFF)')
                          ) : (
                            getShiftBadge('NORMAL', detectedMandatoryShift?.shiftName || 'Jam Kerja Normal')
                          )}
                        </div>
                        <div className="flex justify-center items-center">
                          {detectedMandatoryShift?.isOff ? (
                            <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </div>
                        <div className="flex justify-end items-center min-w-0">
                          {getShiftBadge('HOURLY', `Lembur (${Math.round(durationHours)} Jam)`)}
                        </div>
                      </div>
                    ) : (
                      /* Shift Employee / Default Card List (Exclude OFF shift options) */
                      <div className="space-y-2 min-w-0">
                        {(() => {
                          const shiftList = availableShifts
                            .filter(s => s.id !== 'OFF' && s.code !== 'OFF' && !s.isOff && s.name?.toUpperCase() !== 'OFF')
                            .filter(s => !detectedMandatoryShift || detectedMandatoryShift.isOff || s.id !== detectedMandatoryShift.shiftId);
                          
                          const displayList = selectedExtraShiftId
                            ? shiftList.filter(s => s.id === selectedExtraShiftId)
                            : shiftList;

                          if (shiftList.length === 0) {
                            return (
                              <div className="p-3 text-center text-xs text-slate-400 italic bg-slate-50 border border-slate-200 rounded-xl">
                                Tidak ada pilihan shift tambahan yang tersedia.
                              </div>
                            );
                          }

                          return (
                            <>
                              {displayList.map((s) => {
                                const isSelected = selectedExtraShiftId === s.id;
                                const isOffDate = !detectedMandatoryShift || detectedMandatoryShift.isOff || detectedMandatoryShift.shiftId === 'OFF';

                                return (
                                  <div
                                    key={s.id}
                                    onClick={() => setSelectedExtraShiftId(isSelected ? '' : s.id)}
                                    className={`grid grid-cols-3 items-center p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer min-w-0 box-border ${
                                      isSelected
                                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-400/50 shadow-xs font-semibold'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                                    }`}
                                  >
                                    <div className="flex justify-start items-center gap-1.5 min-w-0 truncate">
                                      {isOffDate ? (
                                        getShiftBadge('OFF', 'OFF')
                                      ) : (
                                        getShiftBadge(detectedMandatoryShift.shiftId, detectedMandatoryShift.shiftName)
                                      )}
                                    </div>

                                    <div className="flex justify-center items-center shrink-0">
                                      {isOffDate ? (
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      ) : (
                                        <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                      )}
                                    </div>

                                    <div className="flex justify-end items-center gap-1.5 min-w-0 truncate">
                                      {getShiftBadge(s.id, s.code || s.name)}
                                    </div>
                                  </div>
                                );
                              })}
                              {selectedExtraShiftId && (
                                <p className="text-[11px] text-slate-500 italic mt-2 text-center leading-relaxed">
                                  Klik ulang pilihan untuk membatalkan dan menampilkan ulang daftar pilihan lengkap
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : null}

                {/* 4. Keterangan */}
                <div className="min-w-0">
                  <label className="block text-xs font-normal text-slate-500 mb-1">
                    Keterangan
                  </label>
                  <textarea
                    value={extraReason}
                    onChange={(e) => setExtraReason(e.target.value)}
                    rows={2}
                    placeholder="Contoh: Backup operasional mendesak / lonjakan beban kerja"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white box-border"
                  />
                </div>

              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white w-full">
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isSubmitting || !extraEmp || !extraWorkDate || (!isNonShiftEmployee && !selectedExtraShiftId)}
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Buat Jadwal Tambahan'}
                </Button>
              </div>
            </form>
      </Modal>
    </>
  );
}
