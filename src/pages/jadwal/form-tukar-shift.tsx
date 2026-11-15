import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FormTukarShiftProps } from './types';
import { EmployeeCombobox } from './combobox-karyawan-pertukaran';

export function FormTukarShift({
  employees,
  employeesForEmp2,
  selectedEmp1,
  setSelectedEmp1,
  selectedEmp2,
  setSelectedEmp2,
  date1,
  setDate1,
  date2,
  setDate2,
  isSameDateTukarShift,
  setIsSameDateTukarShift,
  detectedShift1,
  detectedShift2Peer,
  isHasIdenticalShiftError,
  getShiftBadge,
  isEmp1Locked = false,
}: FormTukarShiftProps) {
  return (
    <div className="w-full min-w-0 pt-1 space-y-3.5">
      {/* Mode: Dalam Tanggal Yang Sama */}
      {isSameDateTukarShift ? (
        <div className="space-y-3.5 w-full min-w-0">
          {/* 1. Tanggal Shift (Tunggal dengan Toggle On/Off) */}
          <div className="min-w-0">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-normal text-slate-500">
                Tanggal Shift <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsSameDateTukarShift(false);
                }}
                className="flex items-center gap-1.5 cursor-pointer select-none group"
              >
                <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  Dalam Tanggal Yang Sama
                </span>
                <div className="w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 bg-blue-600">
                  <div className="w-3 h-3 rounded-full bg-white transition-transform shadow-xs translate-x-3" />
                </div>
              </button>
            </div>
            <input
              type="date"
              required
              value={date1}
              onChange={(e) => {
                setDate1(e.target.value);
                setDate2(e.target.value);
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white box-border"
            />
          </div>

          {/* 2. Kolom Karyawan Pemohon & Karyawan Pengganti + Card Shift di Bawahnya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full min-w-0">
            {/* Sisi Karyawan Pemohon */}
            <div className="space-y-3 min-w-0">
              <EmployeeCombobox
                label="Karyawan Pemohon"
                value={selectedEmp1}
                onChange={(id) => setSelectedEmp1(id)}
                employees={employees}
                excludeId={selectedEmp2}
                placeholder="Pilih atau cari Karyawan Pemohon..."
                disabled={isEmp1Locked}
              />

              {/* Card Shift Karyawan Pemohon (3 Kolom Presisi) */}
              {date1 && (
                <div className="p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/80 min-h-[46px] flex items-center justify-between min-w-0">
                  {detectedShift1 ? (
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2 min-w-0">
                      <div className="flex justify-start items-center min-w-0 truncate">
                        {getShiftBadge(detectedShift1.shiftId, detectedShift1.shiftName)}
                      </div>
                      <div className="flex justify-center items-center px-1 shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="flex justify-end items-center min-w-0 truncate">
                        {detectedShift2Peer ? (
                          getShiftBadge(detectedShift2Peer.shiftId, detectedShift2Peer.shiftName)
                        ) : (
                          <span className="text-[11px] text-slate-400 italic truncate">Shift Pengganti</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px] w-full text-center">Pilih Karyawan Pemohon...</span>
                  )}
                </div>
              )}
            </div>

            {/* Sisi Karyawan Pengganti */}
            <div className="space-y-3 min-w-0">
              <EmployeeCombobox
                label="Karyawan Pengganti"
                value={selectedEmp2}
                onChange={(id) => setSelectedEmp2(id)}
                employees={employeesForEmp2}
                excludeId={selectedEmp1}
                placeholder="Pilih atau cari Karyawan Pengganti..."
              />

              {/* Card Shift Karyawan Pengganti (3 Kolom Presisi) */}
              {date2 && (
                <div className="p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/80 min-h-[46px] flex items-center justify-between min-w-0">
                  {detectedShift2Peer ? (
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2 min-w-0">
                      <div className="flex justify-start items-center min-w-0 truncate">
                        {getShiftBadge(detectedShift2Peer.shiftId, detectedShift2Peer.shiftName)}
                      </div>
                      <div className="flex justify-center items-center px-1 shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="flex justify-end items-center min-w-0 truncate">
                        {detectedShift1 ? (
                          getShiftBadge(detectedShift1.shiftId, detectedShift1.shiftName)
                        ) : (
                          <span className="text-[11px] text-slate-400 italic truncate">Shift Pemohon</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px] w-full text-center">Pilih Karyawan Pengganti...</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Mode: Berbeda Tanggal */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full min-w-0">
          {/* Sisi Karyawan Pemohon */}
          <div className="space-y-3 min-w-0">
            <EmployeeCombobox
              label="Karyawan Pemohon"
              value={selectedEmp1}
              onChange={(id) => setSelectedEmp1(id)}
              employees={employees}
              excludeId={selectedEmp2}
              placeholder="Pilih atau cari Karyawan Pemohon..."
              disabled={isEmp1Locked}
            />

            <div className="min-w-0">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-normal text-slate-500">
                  Tanggal Shift <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSameDateTukarShift(true);
                    setDate2(date1);
                  }}
                  className="flex items-center gap-1.5 cursor-pointer select-none group"
                >
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                    Dalam Tanggal Yang Sama
                  </span>
                  <div className="w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 bg-slate-300">
                    <div className="w-3 h-3 rounded-full bg-white transition-transform shadow-xs translate-x-0" />
                  </div>
                </button>
              </div>
              <input
                type="date"
                required
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white box-border"
              />
            </div>

            {/* Card Shift Karyawan Pemohon (3 Kolom Presisi) */}
            {date1 && (
              <div className="p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/80 min-h-[46px] flex items-center justify-between min-w-0">
                {detectedShift1 ? (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2 min-w-0">
                    <div className="flex justify-start items-center min-w-0 truncate">
                      {getShiftBadge(detectedShift1.shiftId, detectedShift1.shiftName)}
                    </div>
                    <div className="flex justify-center items-center px-1 shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex justify-end items-center min-w-0 truncate">
                      {detectedShift2Peer ? (
                        getShiftBadge(detectedShift2Peer.shiftId, detectedShift2Peer.shiftName)
                      ) : (
                        <span className="text-[11px] text-slate-400 italic truncate">Shift Pengganti</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-[11px] w-full text-center">Pilih Karyawan Pemohon & Tanggal...</span>
                )}
              </div>
            )}
          </div>

          {/* Sisi Karyawan Pengganti */}
          <div className="space-y-3 min-w-0">
            <EmployeeCombobox
              label="Karyawan Pengganti"
              value={selectedEmp2}
              onChange={(id) => setSelectedEmp2(id)}
              employees={employeesForEmp2}
              excludeId={selectedEmp1}
              placeholder="Pilih atau cari Karyawan Pengganti..."
            />

            <div className="min-w-0">
              <label className="block text-xs font-normal text-slate-500 mb-1">
                Tanggal Shift <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white box-border"
              />
            </div>

            {/* Card Shift Karyawan Pengganti (3 Kolom Presisi) */}
            {date2 && (
              <div className="p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/80 min-h-[46px] flex items-center justify-between min-w-0">
                {detectedShift2Peer ? (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2 min-w-0">
                    <div className="flex justify-start items-center min-w-0 truncate">
                      {getShiftBadge(detectedShift2Peer.shiftId, detectedShift2Peer.shiftName)}
                    </div>
                    <div className="flex justify-center items-center px-1 shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex justify-end items-center min-w-0 truncate">
                      {detectedShift1 ? (
                        getShiftBadge(detectedShift1.shiftId, detectedShift1.shiftName)
                      ) : (
                        <span className="text-[11px] text-slate-400 italic truncate">Shift Pemohon</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-[11px] w-full text-center">Pilih Karyawan Pengganti & Tanggal...</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning jika shift identik */}
      {isHasIdenticalShiftError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs text-center animate-in fade-in duration-150 leading-relaxed space-y-1">
          <div className="font-bold text-rose-900 tracking-wide uppercase">
            PERTUKARAN SHIFT DITOLAK
          </div>
          <div className="text-rose-800 font-medium">
            Pertukaran tidak dapat dilakukan karena<br />
            Karyawan Pemohon dan Karyawan Pengganti memiliki jadwal shift yang sama<br />
            Silakan pilih tanggal atau karyawan pengganti lain
          </div>
        </div>
      )}
    </div>
  );
}
