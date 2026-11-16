import React from 'react';
import { ArrowRight, Plus, Info } from 'lucide-react';
import { FormTukarOffProps } from './types';
import { EmployeeCombobox } from './combobox-karyawan-pertukaran';

export function FormTukarOff({
  employees,
  selectedEmp1,
  setSelectedEmp1,
  date1,
  setDate1,
  date2,
  setDate2,
  detectedShift1,
  detectedShift2Self,
  showTukarOffRules,
  setShowTukarOffRules,
  tukarOffShiftList,
  targetShiftChoice,
  setTargetShiftChoice,
  getShiftBadge,
  isEmp1Locked = false,
}: FormTukarOffProps) {
  return (
    <div className="space-y-3.5 pt-1">
      <EmployeeCombobox
        label="Pilih Karyawan"
        value={selectedEmp1}
        onChange={(id) => setSelectedEmp1(id)}
        employees={employees}
        placeholder="Pilih karyawan yang akan menukar hari OFF..."
        disabled={isEmp1Locked}
        rightAction={
          <button
            type="button"
            onClick={() => setShowTukarOffRules(prev => !prev)}
            className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors shrink-0 flex items-center justify-center rounded-md hover:bg-slate-100"
            title={showTukarOffRules ? "Sembunyikan Aturan Tukar OFF" : "Lihat Aturan Tukar OFF"}
          >
            <Info className={`w-4 h-4 ${showTukarOffRules ? 'text-blue-600' : 'text-slate-400'}`} />
          </button>
        }
      />

      {showTukarOffRules && (
        <div className="p-3.5 bg-slate-100/90 border border-slate-200/80 rounded-xl text-[11px] text-slate-700 space-y-1.5 leading-relaxed animate-in fade-in duration-200">
          <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
            Aturan Tukar OFF
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-600">
            <li>Penukaran hari OFF menjadi hari kerja dan sebaliknya harus dalam pekan (minggu) yang sama dan salah satu tanggal harus merupakan hari OFF.</li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Tanggal 1 */}
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-normal text-slate-500 mb-1">
              Tanggal Diganti <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white box-border"
            />
          </div>

          {date1 && (
            <div className="space-y-2">
              {!detectedShift1 ? (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 min-h-[42px] flex items-center justify-between gap-2 min-w-0">
                  <span className="text-slate-400 italic text-[11px]">Pilih karyawan terlebih dahulu...</span>
                </div>
              ) : (
                (!detectedShift1.isOff && detectedShift1.shiftId !== 'OFF') ? (
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 min-h-[42px] flex items-center justify-between gap-2 min-w-0">
                    <>
                      <div className="shrink-0">
                        {getShiftBadge(detectedShift1.shiftId, detectedShift1.shiftName)}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="shrink-0">
                        {getShiftBadge('OFF', 'OFF')}
                      </div>
                    </>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {tukarOffShiftList.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400 italic bg-slate-50 border border-slate-200 rounded-xl">
                        Tidak ada pilihan shift yang tersedia.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(targetShiftChoice
                          ? tukarOffShiftList.filter(s => s.id === targetShiftChoice)
                          : tukarOffShiftList
                        ).map((s) => {
                          const isSelected = targetShiftChoice === s.id;
                          return (
                            <div
                              key={s.id}
                              onClick={() => setTargetShiftChoice(isSelected ? '' : s.id)}
                              className={`grid grid-cols-3 items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-400/50 shadow-xs'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex justify-start">
                                {getShiftBadge('OFF', 'OFF')}
                              </div>
                              <div className="flex justify-center">
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                              </div>
                              <div className="flex justify-end">
                                {getShiftBadge(s.id, s.code || s.name)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {targetShiftChoice && (
                      <p className="text-[11px] text-slate-500 italic mt-2 text-center leading-relaxed">
                        Klik ulang pilihan untuk membatalkan dan menampilkan ulang daftar pilihan lengkap
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Tanggal 2 */}
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-normal text-slate-500 mb-1">
              Tanggal Pengganti <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white box-border"
            />
          </div>

          {selectedEmp1 && date1 && date2 && (
            <div className="min-w-0">
              {!detectedShift2Self ? (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 min-h-[42px] flex items-center justify-between gap-2 min-w-0">
                  <span className="text-slate-400 italic text-[11px]">Pilih karyawan terlebih dahulu...</span>
                </div>
              ) : (
                (!detectedShift1?.isOff && detectedShift1?.shiftId !== 'OFF') ? (
                  <div className="space-y-2 pt-1">
                    {tukarOffShiftList.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400 italic bg-slate-50 border border-slate-200 rounded-xl">
                        Tidak ada pilihan shift yang tersedia.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(targetShiftChoice
                          ? tukarOffShiftList.filter(s => s.id === targetShiftChoice)
                          : tukarOffShiftList
                        ).map((s) => {
                          const isSelected = targetShiftChoice === s.id;
                          const isDate2Working = !detectedShift2Self.isOff && detectedShift2Self.shiftId !== 'OFF';
                          return (
                            <div
                              key={s.id}
                              onClick={() => setTargetShiftChoice(isSelected ? '' : s.id)}
                              className={`grid grid-cols-3 items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-400/50 shadow-xs'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              {isDate2Working ? (
                                <>
                                  <div className="flex justify-start">
                                    {getShiftBadge(detectedShift2Self.shiftId, detectedShift2Self.shiftName)}
                                  </div>
                                  <div className="flex justify-center">
                                    <Plus className="w-3.5 h-3.5 text-amber-600" />
                                  </div>
                                  <div className="flex justify-end">
                                    {getShiftBadge(s.id, s.code || s.name)}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-start">
                                    {getShiftBadge('OFF', 'OFF')}
                                  </div>
                                  <div className="flex justify-center">
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                  </div>
                                  <div className="flex justify-end">
                                    {getShiftBadge(s.id, s.code || s.name)}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {targetShiftChoice && (
                      <p className="text-[11px] text-slate-500 italic mt-2 text-center leading-relaxed">
                        Klik ulang pilihan untuk membatalkan dan menampilkan ulang daftar pilihan lengkap
                      </p>
                    )}
                  </div>
                ) : (
                  (detectedShift2Self.isOff || detectedShift2Self.shiftId === 'OFF') ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-[11px] font-medium leading-relaxed">
                      Tanggal pengganti tidak boleh jadwal OFF.
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 min-h-[42px] flex items-center justify-between gap-2 min-w-0">
                      <div className="shrink-0">
                        {getShiftBadge(detectedShift2Self.shiftId, detectedShift2Self.shiftName)}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="shrink-0">
                        {getShiftBadge('OFF', 'OFF')}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
