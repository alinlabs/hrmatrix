import React from 'react';
import { 
  ArrowRightLeft, 
  Pencil, 
  X, 
  User, 
  Building2, 
  Info, 
  Check 
} from 'lucide-react';
import { ModalFormProps } from './types';
import { Button } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { ModalTabel } from './modal-pertukaran-tabel';
import { FormGantiShift } from './form-ganti-shift';
import { FormTukarShift } from './form-tukar-shift';
import { FormTukarOff } from './form-tukar-off';

export function ModalForm({
  isOpen,
  onClose,
  modalMode,
  selectedSwap,
  handleSwitchToEdit,
  handleSaveSwap,
  isSubmitting,
  isEmp1Locked = false,
  
  initiator,
  setInitiator,
  swapType,
  setSwapType,
  showCategoryInfo,
  setShowCategoryInfo,
  swapReason,
  setSwapReason,
  
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
  setGantiShiftTargetDate,
  targetShiftChoice,
  setTargetShiftChoice,
  showTukarOffRules,
  setShowTukarOffRules,
  
  detectedShift1,
  detectedShift2Peer,
  detectedShift2Self,
  filteredGantiShifts,
  tukarOffShiftList,
  isHasIdenticalShiftError,
  
  empMap,
  posMap,
  deptMap,
  getShiftBadge
}: ModalFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-xl"
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {modalMode === 'view' ? 'Rincian Pertukaran Shift' : modalMode === 'edit' ? 'Edit Pertukaran Shift' : 'Buat Pertukaran Shift'}
            </h3>
            <p className="text-xs text-slate-500">
              {modalMode === 'view' ? 'Detail informasi pertukaran jadwal kerja' : 'Sesuaikan jadwal kerja karyawan secara dinamis'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {modalMode === 'view' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSwitchToEdit}
              className="h-8 px-2.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Button>
          )}
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {modalMode === 'view' && selectedSwap ? (
        <ModalTabel 
          selectedSwap={selectedSwap}
          empMap={empMap}
          posMap={posMap}
          deptMap={deptMap}
          getShiftBadge={getShiftBadge}
        />
      ) : (
        <form onSubmit={handleSaveSwap} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            {/* 1. Inisiator */}
            <div>
              <label className="block text-xs font-normal text-slate-500 mb-1">
                Inisiator Penyesuaian <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInitiator('Employee')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    initiator === 'Employee'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400 text-blue-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs mb-0.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Karyawan</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium leading-tight">
                    Pengajuan mandiri oleh karyawan
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setInitiator('Company')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    initiator === 'Company'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400 text-blue-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs mb-0.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Perusahaan</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium leading-tight">
                    Instruksi manajemen / HR
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Jenis Penyesuaian */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-normal text-slate-500">
                  Kategori Pertukaran <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryInfo(prev => !prev)}
                  className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors shrink-0 flex items-center justify-center rounded-md hover:bg-slate-100"
                  title={showCategoryInfo ? "Sembunyikan Panduan Kategori" : "Lihat Panduan Kategori"}
                >
                  <Info className={`w-4 h-4 ${showCategoryInfo ? 'text-blue-600' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Panduan Kategori Collapse / Dropdown Alert */}
              {showCategoryInfo && (
                <div className="mb-2 p-3 bg-slate-100/90 border border-slate-200/80 rounded-xl text-[11px] text-slate-700 space-y-1.5 leading-relaxed animate-in fade-in duration-200">
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                    Panduan Kategori Penyesuaian:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li><strong className="text-slate-900">Ganti Shift:</strong> Mengubah jadwal shift seorang karyawan ke shift lain pada hari kerja yang sama atau berbeda.</li>
                    <li><strong className="text-slate-900">Tukar Shift:</strong> Menukar shift kerja antara dua karyawan yang berbeda (Peer-to-Peer).</li>
                    <li><strong className="text-slate-900">Tukar Off:</strong> Menukar jadwal hari libur (OFF) dengan jadwal hari kerja untuk karyawan yang sama.</li>
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSwapType('ganti_shift')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    swapType === 'ganti_shift' || swapType === 'direct_shift_change'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400 text-blue-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs">Ganti Shift</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSwapType('tukar_shift')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    swapType === 'tukar_shift' || swapType === 'peer_to_peer'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400 text-blue-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs">Tukar Shift</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSwapType('tukar_off')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    swapType === 'tukar_off' || swapType === 'self_date_swap'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400 text-blue-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs">Tukar Off</span>
                </button>
              </div>
            </div>

            {/* FORM ADAPTIF BERDASARKAN KATEGORI */}
            {(swapType === 'ganti_shift' || swapType === 'direct_shift_change') && (
              <FormGantiShift
                employees={employees}
                selectedEmp1={selectedEmp1}
                setSelectedEmp1={setSelectedEmp1}
                date1={date1}
                setDate1={setDate1}
                setGantiShiftTargetDate={setGantiShiftTargetDate}
                detectedShift1={detectedShift1}
                filteredGantiShifts={filteredGantiShifts}
                targetShiftChoice={targetShiftChoice}
                setTargetShiftChoice={setTargetShiftChoice}
                getShiftBadge={getShiftBadge}
                isEmp1Locked={isEmp1Locked}
              />
            )}

            {(swapType === 'tukar_shift' || swapType === 'peer_to_peer') && (
              <FormTukarShift
                employees={employees}
                employeesForEmp2={employeesForEmp2}
                selectedEmp1={selectedEmp1}
                setSelectedEmp1={setSelectedEmp1}
                selectedEmp2={selectedEmp2}
                setSelectedEmp2={setSelectedEmp2}
                date1={date1}
                setDate1={setDate1}
                date2={date2}
                setDate2={setDate2}
                isSameDateTukarShift={isSameDateTukarShift}
                setIsSameDateTukarShift={setIsSameDateTukarShift}
                detectedShift1={detectedShift1}
                detectedShift2Peer={detectedShift2Peer}
                isHasIdenticalShiftError={isHasIdenticalShiftError}
                getShiftBadge={getShiftBadge}
                isEmp1Locked={isEmp1Locked}
              />
            )}

            {(swapType === 'tukar_off' || swapType === 'self_date_swap') && (
              <FormTukarOff
                employees={employees}
                selectedEmp1={selectedEmp1}
                setSelectedEmp1={setSelectedEmp1}
                date1={date1}
                setDate1={setDate1}
                date2={date2}
                setDate2={setDate2}
                detectedShift1={detectedShift1}
                detectedShift2Self={detectedShift2Self}
                showTukarOffRules={showTukarOffRules}
                setShowTukarOffRules={setShowTukarOffRules}
                tukarOffShiftList={tukarOffShiftList}
                targetShiftChoice={targetShiftChoice}
                setTargetShiftChoice={setTargetShiftChoice}
                getShiftBadge={getShiftBadge}
                isEmp1Locked={isEmp1Locked}
              />
            )}

            {/* Alasan / Catatan */}
            <div className="min-w-0">
              <label className="block text-xs font-normal text-slate-500 mb-1">
                Keterangan
              </label>
              <textarea
                value={swapReason}
                onChange={(e) => setSwapReason(e.target.value)}
                rows={2}
                placeholder={
                  initiator === 'Company'
                    ? 'Contoh: Instruksi pemenuhan kuota shift maintenance / operasional darurat'
                    : 'Contoh: Keperluan keluarga mendesak / izin mengurus dokumen'
                }
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white box-border"
              />
            </div>
          </div>

          {/* STICKY FOOTER */}
          <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white w-full">
            {(() => {
              const isSubmitDisabled = 
                isSubmitting || 
                isHasIdenticalShiftError ||
                !selectedEmp1 || 
                !detectedShift1 || 
                ((swapType === 'tukar_shift' || swapType === 'peer_to_peer') && (!selectedEmp2 || !detectedShift2Peer)) ||
                ((swapType === 'tukar_off' || swapType === 'self_date_swap') && (!date2 || !detectedShift2Self || !targetShiftChoice)) ||
                ((swapType === 'ganti_shift' || swapType === 'direct_shift_change') && (!targetShiftChoice || detectedShift1.isOff || detectedShift1.shiftId === 'OFF'));

              return (
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isSubmitDisabled}
                  className={`w-full h-9 font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                    isSubmitDisabled
                      ? 'bg-slate-300 text-slate-500 border border-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  }`}
                >
                  {isSubmitting
                    ? 'Menyimpan...'
                    : modalMode === 'edit'
                    ? 'Simpan Perubahan Jadwal'
                    : 'Simpan Penyesuaian Jadwal'}
                </Button>
              );
            })()}
          </div>
        </form>
      )}
    </Modal>
  );
}
