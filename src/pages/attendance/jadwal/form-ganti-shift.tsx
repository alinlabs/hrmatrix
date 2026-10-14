import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FormGantiShiftProps } from './types';
import { EmployeeCombobox } from './combobox-karyawan-pertukaran';

export function FormGantiShift({
  employees,
  selectedEmp1,
  setSelectedEmp1,
  date1,
  setDate1,
  setGantiShiftTargetDate,
  detectedShift1,
  filteredGantiShifts,
  targetShiftChoice,
  setTargetShiftChoice,
  getShiftBadge,
  isEmp1Locked = false,
}: FormGantiShiftProps) {
  return (
    <div className="space-y-3.5 pt-1">
      <EmployeeCombobox
        label="Pilih Karyawan"
        value={selectedEmp1}
        onChange={(id) => {
          setSelectedEmp1(id);
        }}
        employees={employees}
        placeholder="Pilih karyawan yang jadwalnya akan diubah..."
        disabled={isEmp1Locked}
      />

      <div className="space-y-3">
        {/* Tanggal Input */}
        <div>
          <label className="block text-xs font-normal text-slate-500 mb-1">
            Tanggal Shift yang Akan Diganti <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={date1}
            onChange={(e) => {
              setDate1(e.target.value);
              setGantiShiftTargetDate(e.target.value);
            }}
            className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white box-border"
          />
        </div>

        {/* Card-Card List of Shift Opsi (Directly below date, without showing dates in options) */}
        {selectedEmp1 && date1 && detectedShift1 && (
          <div className="space-y-2">
            <label className="block text-xs font-normal text-slate-500">
              Pilih Opsi Shift Pengganti <span className="text-rose-500">*</span>
            </label>

            {(detectedShift1.isOff || detectedShift1.shiftId === 'OFF') ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-[11px] font-medium leading-relaxed">
                GANTI SHIFT hanya mengubah shift waktu pada hari kerja. Pilih TUKAR OFF untuk menukar dengan jadwal libur.
              </div>
            ) : filteredGantiShifts.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 italic bg-slate-50 border border-slate-200 rounded-xl">
                Tidak ada pilihan shift lain yang tersedia untuk tanggal ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredGantiShifts.map((s) => {
                  const isSelected = targetShiftChoice === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setTargetShiftChoice(isSelected ? '' : s.id)}
                      className={`grid grid-cols-3 items-center p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Kolom 1: Badge Shift Tanggal Dipilih */}
                      <div className="flex justify-start items-center pl-1">
                        {getShiftBadge(detectedShift1.shiftId, detectedShift1.shiftName)}
                      </div>

                      {/* Kolom 2: Panah Kanan */}
                      <div className="flex justify-center items-center">
                        <div className={`p-1 rounded-full ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Kolom 3: Badge Shift Opsi selain Shift tanggal dipilih */}
                      <div className="flex justify-end items-center pr-1">
                        {getShiftBadge(s.id, s.code || s.name)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
