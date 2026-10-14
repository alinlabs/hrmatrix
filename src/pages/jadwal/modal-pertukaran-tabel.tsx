import React from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { ModalTabelProps } from './types';
import { formatTanggalIndo, formatHariTanggalIndo, getEmployeePosDept } from './utils-pertukaran-helper';

export function ModalTabel({
  selectedSwap,
  empMap,
  posMap,
  deptMap,
  getShiftBadge
}: ModalTabelProps) {
  const emp1 = empMap.get(selectedSwap.requesterEmployeeId);
  const emp2 = selectedSwap.targetEmployeeId ? empMap.get(selectedSwap.targetEmployeeId) : undefined;
  const date1 = selectedSwap.requesterDate || '';
  const date2 = selectedSwap.targetDate || selectedSwap.requesterDate || '';
  const isOffSwap = selectedSwap.swapType === 'tukar_off' || 
                    selectedSwap.swapType === 'self_date_swap' || 
                    selectedSwap.requesterShiftId === 'OFF' || 
                    selectedSwap.targetShiftId === 'OFF';
  const isPeerSwap = (selectedSwap.swapType === 'tukar_shift' || selectedSwap.swapType === 'peer_to_peer') && Boolean(selectedSwap.targetEmployeeId);
  const isSameDaySwap = !isPeerSwap && !isOffSwap && Boolean(date1 && date2 && date1 === date2);

  return (
    <div className="flex flex-col flex-1 overflow-hidden w-full max-w-full min-w-0">
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs w-full max-w-full box-border">
        
        {/* Inisiator (tanpa card/badge/icon) */}
        <div className="flex items-center gap-2 text-xs text-slate-800 py-1">
          <span className="text-slate-600 font-medium">Inisiator :</span>
          <span className="font-semibold text-slate-700">
            {selectedSwap.initiator === 'Company' ? 'Instruksi Perusahaan (HR)' : 'Pengajuan Karyawan'}
          </span>
        </div>

        {/* Kategori Pertukaran (Langsung di tengah, tanpa judul, tanpa badge) */}
        <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-center font-bold text-xs tracking-wider uppercase">
          {selectedSwap.swapType === 'ganti_shift' || selectedSwap.swapType === 'direct_shift_change' ? (
            <span className="text-blue-600">GANTI SHIFT</span>
          ) : selectedSwap.swapType === 'tukar_shift' || selectedSwap.swapType === 'peer_to_peer' ? (
            <span className="text-emerald-600">TUKAR SHIFT</span>
          ) : (
            <span className="text-rose-600">TUKAR OFF</span>
          )}
        </div>

        {/* Adaptif Card View */}
        {isPeerSwap ? (
          /* Tukar Antar Karyawan (Vertical Stack) */
          <div className="space-y-2">
            {/* Card Karyawan 1 (Pemohon) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-center space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Karyawan Pemohon
              </div>
              <div className="text-xs font-normal text-slate-500">
                {getEmployeePosDept(emp1, posMap, deptMap)}
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {emp1?.fullName || selectedSwap.requesterEmployeeId}
              </div>
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs">
                <span className="text-slate-600 font-medium">{formatHariTanggalIndo(date1)}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">Shift:</span>
                  {getShiftBadge(selectedSwap.requesterShiftId)}
                </div>
              </div>
            </div>

            {/* Icon Refresh Circle Vertikal */}
            <div className="flex justify-center my-0.5">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card Karyawan 2 (Ditukar) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-center space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Karyawan Ditukar
              </div>
              <div className="text-xs font-normal text-slate-500">
                {getEmployeePosDept(emp2, posMap, deptMap)}
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {emp2?.fullName || selectedSwap.targetEmployeeId || '-'}
              </div>
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs">
                <span className="text-slate-600 font-medium">{formatHariTanggalIndo(date2)}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">Shift:</span>
                  {getShiftBadge(selectedSwap.targetShiftId || '')}
                </div>
              </div>
            </div>
          </div>
        ) : isSameDaySwap ? (
          /* Pertukaran Shift 1 Karyawan Pada Hari yang Sama (Tanpa teks "Shift Semula" / "Shift Terbaru") */
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-center">
            {/* Posisi & Departemen */}
            <div className="text-xs font-normal text-slate-500">
              {getEmployeePosDept(emp1, posMap, deptMap)}
            </div>

            {/* Nama */}
            <div className="font-bold text-slate-900 text-sm">
              {emp1?.fullName || selectedSwap.requesterEmployeeId}
            </div>

            {/* Tanggal */}
            <div className="text-xs font-semibold text-slate-700 pb-1">
              {formatHariTanggalIndo(date1)}
            </div>

            {/* badge shift semula | icon dua arah | badge shift terbaru */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="flex flex-col items-center">
                {getShiftBadge(selectedSwap.requesterShiftId)}
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col items-center">
                {getShiftBadge(selectedSwap.targetShiftId || '')}
              </div>
            </div>
          </div>
        ) : (
          /* 1 Karyawan Berbeda Tanggal atau OFF (Teks "Semula" dan "Terbaru" tipis kecil, tanggal dibawah badge) */
          <div className="space-y-3">
            {/* Card Posisi, Departemen, Nama di tengah */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-center space-y-1">
              <div className="text-xs font-normal text-slate-500">
                {getEmployeePosDept(emp1, posMap, deptMap)}
              </div>
              <div className="font-bold text-slate-900 text-sm">
                {emp1?.fullName || selectedSwap.requesterEmployeeId}
              </div>
            </div>

            {/* Card Jadwal Sebelumnya | Icon dua arah | Card Jadwal terbaru */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              {/* Card Jadwal Sebelumnya */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5 h-full justify-between min-h-[90px]">
                <div className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                  Semula
                </div>
                <div>
                  {getShiftBadge(selectedSwap.requesterShiftId)}
                </div>
                <div className="text-[11px] font-normal text-slate-600 leading-tight pt-0.5">
                  {formatHariTanggalIndo(date1)}
                </div>
              </div>

              {/* Icon Dua Arah Kanan Kiri */}
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>

              {/* Card Jadwal Terbaru */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center text-center space-y-1.5 h-full justify-between min-h-[90px]">
                <div className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                  Terbaru
                </div>
                <div>
                  {getShiftBadge(selectedSwap.targetShiftId || 'OFF')}
                </div>
                <div className="text-[11px] font-normal text-slate-600 leading-tight pt-0.5">
                  {formatHariTanggalIndo(date2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keterangan */}
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-1 text-center">
          <div className="text-xs font-bold text-slate-700">
            Keterangan
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            {selectedSwap.reason || 'Tidak ada catatan tambahan'}
          </p>
        </div>
      </div>
    </div>
  );
}
