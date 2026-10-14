import React from 'react';
import { X, Settings2 } from 'lucide-react';
import { EmployeeLeaveSummary } from '../../../services/leaveService';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui';

interface ModalFormKuotaProps {
  isOpen: boolean;
  onClose: () => void;
  editingQuotaEmp: EmployeeLeaveSummary | null;
  quotaFormData: {
    annualQuota: number;
    carryForward: number;
    adjustedQuota: number;
    notes: string;
  };
  setQuotaFormData: (data: any) => void;
  handleSaveQuota: (e: React.FormEvent) => Promise<void>;
}

export function ModalFormKuota({
  isOpen,
  onClose,
  editingQuotaEmp,
  quotaFormData,
  setQuotaFormData,
  handleSaveQuota
}: ModalFormKuotaProps) {
  return (
    <Modal 
      isOpen={isOpen && !!editingQuotaEmp} 
      onClose={onClose} 
      contentClassName="sm:max-w-md"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Settings2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
              Penyesuaian Kuota Cuti
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
              {editingQuotaEmp?.employeeName ? `Karyawan: ${editingQuotaEmp.employeeName}` : 'Atur hak cuti tahunan & carry forward'}
            </p>
          </div>
        </div>
        <button 
          type="button"
          onClick={onClose} 
          title="Tutup"
          aria-label="Tutup"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {editingQuotaEmp && (
        <form onSubmit={handleSaveQuota} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            <div>
              <Input
                label="Hak Cuti Tahunan (Hari)"
                type="number"
                required
                min={0}
                value={quotaFormData.annualQuota}
                onChange={(e) => setQuotaFormData({ ...quotaFormData, annualQuota: parseInt(e.target.value) || 0 })}
              />
              <p className="text-[10px] text-slate-400 font-normal mt-1">Standar umum regulasi: 12 hari</p>
            </div>
            
            <div>
              <Input
                label="Sisa Cuti Bawaan Tahun Lalu (Carry Forward)"
                type="number"
                min={0}
                value={quotaFormData.carryForward}
                onChange={(e) => setQuotaFormData({ ...quotaFormData, carryForward: parseInt(e.target.value) || 0 })}
              />
              <p className="text-[10px] text-slate-400 font-normal mt-1">Akumulasi sisa kuota yang dapat dibawa ke periode berjalan</p>
            </div>
            
            <div>
              <Input
                label="Penyesuaian Kuota Tambahan / Bonus (+ / -)"
                type="number"
                value={quotaFormData.adjustedQuota}
                onChange={(e) => setQuotaFormData({ ...quotaFormData, adjustedQuota: parseInt(e.target.value) || 0 })}
              />
              <p className="text-[10px] text-slate-400 font-normal mt-1">Isi angka positif untuk penambahan atau negatif untuk pengurangan</p>
            </div>
            
            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Catatan / Alasan Penyesuaian
              </label>
              <textarea
                rows={2}
                value={quotaFormData.notes}
                onChange={(e) => setQuotaFormData({ ...quotaFormData, notes: e.target.value })}
                placeholder=""
                className="w-full text-xs font-normal rounded-xl border border-slate-200/90 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none min-h-[64px]"
              />
            </div>
            
            {/* Calculation Preview */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-slate-700">
              <div className="flex justify-between font-semibold text-xs">
                <span>Total Hak Kuota Baru:</span>
                <span className="text-blue-700">
                  {(Number(quotaFormData.annualQuota) || 0) + (Number(quotaFormData.carryForward) || 0) + (Number(quotaFormData.adjustedQuota) || 0)} Hari
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-normal">
                <span>Cuti Tahunan Terpakai:</span>
                <span className="text-rose-600">{editingQuotaEmp.usedAnnual} Hari</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-emerald-700 pt-1.5 border-t border-slate-200">
                <span>Proyeksi Sisa Saldo:</span>
                <span>
                  {Math.max(0, ((Number(quotaFormData.annualQuota) || 0) + (Number(quotaFormData.carryForward) || 0) + (Number(quotaFormData.adjustedQuota) || 0)) - editingQuotaEmp.usedAnnual)} Hari
                </span>
              </div>
            </div>
          </div>
          
          {/* Modal Footer: Single Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.99] text-center"
            >
              Simpan Kuota
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
