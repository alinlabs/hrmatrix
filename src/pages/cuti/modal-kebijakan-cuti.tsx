import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, RefreshCw, AlertCircle, Coins, Archive } from 'lucide-react';
import { LeaveTypePolicy, LeaveUnusedAction, LeavePeriodType, LeavePeriodUnit } from '../../types';
import { Input, Select } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';

interface ModalKebijakanCutiProps {
  isOpen: boolean;
  onClose: () => void;
  policyToEdit?: LeaveTypePolicy | null;
  onSave: (policy: Omit<LeaveTypePolicy, 'id'> & { id?: string }) => Promise<void>;
}

export function ModalKebijakanCuti({
  isOpen,
  onClose,
  policyToEdit,
  onSave,
}: ModalKebijakanCutiProps) {
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    defaultQuota: number;
    isPaid: boolean;
    periodType: LeavePeriodType;
    periodValue: number;
    periodUnit: LeavePeriodUnit;
    unusedBalanceAction: LeaveUnusedAction;
    genderEligibility: 'All' | 'Male' | 'Female';
    description: string;
  }>({
    code: '',
    name: '',
    defaultQuota: 12,
    isPaid: true,
    periodType: '1_year',
    periodValue: 1,
    periodUnit: 'years',
    unusedBalanceAction: 'carry_forward',
    genderEligibility: 'All',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (policyToEdit) {
      const pType = policyToEdit.periodType || '1_year';
      setFormData({
        code: policyToEdit.code || '',
        name: policyToEdit.name || '',
        defaultQuota: policyToEdit.defaultQuota ?? 12,
        isPaid: policyToEdit.isPaid !== undefined ? policyToEdit.isPaid : true,
        periodType: pType,
        periodValue: policyToEdit.periodValue || 1,
        periodUnit: policyToEdit.periodUnit || 'years',
        unusedBalanceAction: (pType === 'entire_tenure' || pType === 'conditional') ? 'none' : (policyToEdit.unusedBalanceAction || 'carry_forward'),
        genderEligibility: policyToEdit.genderEligibility || 'All',
        description: policyToEdit.description || '',
      });
    } else {
      setFormData({
        code: '',
        name: '',
        defaultQuota: 12,
        isPaid: true,
        periodType: '1_year',
        periodValue: 1,
        periodUnit: 'years',
        unusedBalanceAction: 'carry_forward',
        genderEligibility: 'All',
        description: '',
      });
    }
  }, [policyToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      return;
    }

    const isNoExpirationPeriod = formData.periodType === 'entire_tenure' || formData.periodType === 'conditional';

    try {
      setIsSubmitting(true);
      await onSave({
        ...(policyToEdit?.id ? { id: policyToEdit.id } : {}),
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        defaultQuota: formData.periodType === 'conditional' ? 0 : (Number(formData.defaultQuota) || 0),
        isPaid: formData.isPaid,
        periodType: formData.periodType,
        periodValue: formData.periodType === 'custom' ? formData.periodValue : undefined,
        periodUnit: formData.periodType === 'custom' ? formData.periodUnit : undefined,
        unusedBalanceAction: isNoExpirationPeriod ? 'none' : formData.unusedBalanceAction,
        genderEligibility: formData.genderEligibility,
        description: formData.description.trim(),
      });
      onClose();
    } catch (err) {
      console.error('Failed to save leave policy:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaidToggle = (isPaid: boolean) => {
    setFormData(prev => {
      let action = prev.unusedBalanceAction;
      if (!isPaid && action === 'cashout') {
        action = 'forfeit';
      }
      return {
        ...prev,
        isPaid,
        unusedBalanceAction: action,
      };
    });
  };

  const isNoExpirationPeriod = formData.periodType === 'entire_tenure' || formData.periodType === 'conditional';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-lg"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                {policyToEdit ? 'Edit Kebijakan Cuti' : 'Tambah Jenis & Kebijakan Cuti'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Atur nama jenis cuti, saldo kuota, periode, dan mekanisme sisa saldo
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

        {/* Form Content */}
        <form id="kebijakan-cuti-form" onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Nama Jenis Cuti"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="Kode Singkatan"
                type="text"
                required
                maxLength={6}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="font-bold uppercase"
              />
            </div>
          </div>

          {/* PERIODE KEBIJAKAN CUTI */}
          <div>
            <Select
              label="Periode Masa Berlaku Cuti"
              required
              value={formData.periodType}
              onChange={(e) => {
                const pType = e.target.value as LeavePeriodType;
                setFormData(prev => ({
                  ...prev,
                  periodType: pType,
                  defaultQuota: pType === 'conditional' ? 0 : (prev.defaultQuota === 0 ? 12 : prev.defaultQuota),
                  unusedBalanceAction: (pType === 'entire_tenure' || pType === 'conditional') ? 'none' : (prev.unusedBalanceAction === 'none' ? 'carry_forward' : prev.unusedBalanceAction)
                }));
              }}
              options={[
                { value: '1_year', label: '1 Tahun Kerja' },
                { value: 'custom', label: 'Periode Khusus (Custom Bulan / Tahun)' },
                { value: 'entire_tenure', label: 'Selama Masa Kerja' },
                { value: 'conditional', label: 'Kondisional' },
              ]}
            />

            {formData.periodType === 'custom' && (
              <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <div>
                  <Input
                    label="Durasi Periode"
                    type="number"
                    min={1}
                    value={formData.periodValue}
                    onChange={(e) => setFormData({ ...formData, periodValue: Math.max(1, Number(e.target.value)) })}
                  />
                </div>
                <div>
                  <Select
                    label="Satuan Waktu"
                    value={formData.periodUnit}
                    onChange={(e) => setFormData({ ...formData, periodUnit: e.target.value as LeavePeriodUnit })}
                    options={[
                      { value: 'months', label: 'Bulan' },
                      { value: 'years', label: 'Tahun' },
                    ]}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <label className="text-[11px] font-normal text-slate-600">
                  Default Saldo Kuota (Hari per Periode) <span className="text-rose-500">*</span>
                </label>
                {formData.periodType === 'conditional' && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200/80 rounded-full shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-800">
                      Kondisional
                    </span>
                  </div>
                )}
              </div>

              {formData.periodType === 'conditional' ? (
                <div className="h-9 min-h-[36px] px-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 w-full">
                    <input
                      type="range"
                      disabled
                      min={0}
                      max={100}
                      value={50}
                      className="w-full h-1.5 accent-amber-500 bg-slate-200 rounded-lg appearance-none cursor-not-allowed pointer-events-none"
                    />
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md whitespace-nowrap shadow-2xs">
                      Kondisional
                    </span>
                  </div>
                </div>
              ) : (
                <Input
                  type="number"
                  min={0}
                  max={365}
                  required
                  value={formData.defaultQuota}
                  onChange={(e) => setFormData({ ...formData, defaultQuota: Number(e.target.value) })}
                />
              )}
            </div>

            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Status Upah / Gaji
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePaidToggle(true)}
                  className={`flex-1 h-9 min-h-[36px] px-2 rounded-xl border text-xs transition-all cursor-pointer ${
                    formData.isPaid
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 font-normal hover:bg-slate-50'
                  }`}
                >
                  Gaji Dibayar (Paid)
                </button>
                <button
                  type="button"
                  onClick={() => handlePaidToggle(false)}
                  className={`flex-1 h-9 min-h-[36px] px-2 rounded-xl border text-xs transition-all cursor-pointer ${
                    !formData.isPaid
                      ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 font-normal hover:bg-slate-50'
                  }`}
                >
                  Tanpa Gaji (Unpaid)
                </button>
              </div>
            </div>
          </div>

          {/* OPSI SISA SALDO DI AKHIR PERIODE */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
            <label className="block text-xs font-bold text-slate-800">
              Penanganan Sisa Saldo di Akhir Periode <span className="text-rose-500">*</span>
            </label>

            {isNoExpirationPeriod ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Tidak Berlaku Penanganan Sisa Saldo</span>
                  Karena jenis periode yang dipilih adalah <strong>{formData.periodType === 'entire_tenure' ? 'Selama Masa Kerja' : 'Kondisional'}</strong>, sisa saldo tidak dipicu reset berkala.
                </div>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-slate-500 leading-tight mb-2">
                  Pilih tindakan sistem ketika terdapat sisa saldo cuti di akhir periode:
                </p>

                <div className="space-y-2">
                  {/* Opsi 1: Ditambahkan ke Periode Selanjutnya */}
                  <label 
                    onClick={() => setFormData({ ...formData, unusedBalanceAction: 'carry_forward' })}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.unusedBalanceAction === 'carry_forward'
                        ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="unusedBalanceAction"
                      checked={formData.unusedBalanceAction === 'carry_forward'}
                      onChange={() => setFormData({ ...formData, unusedBalanceAction: 'carry_forward' })}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold text-xs text-slate-900">Ditambahkan ke Periode Selanjutnya (Carry Over)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-normal">
                        Sisa saldo kuota akan diakumulasikan dan dibawa ke jatah periode berikutnya.
                      </p>
                    </div>
                  </label>

                  {/* Opsi 2: Hangus */}
                  <label 
                    onClick={() => setFormData({ ...formData, unusedBalanceAction: 'forfeit' })}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.unusedBalanceAction === 'forfeit'
                        ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="unusedBalanceAction"
                      checked={formData.unusedBalanceAction === 'forfeit'}
                      onChange={() => setFormData({ ...formData, unusedBalanceAction: 'forfeit' })}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <Archive className="w-3.5 h-3.5 text-slate-600" />
                        <span className="font-semibold text-xs text-slate-900">Hangus di Akhir Periode</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-normal">
                        Sisa saldo yang tidak terpakai akan hangus (direset menjadi 0) pada pergantian periode.
                      </p>
                    </div>
                  </label>

                  {/* Opsi 3: Terkonversi ke Pembayaran (Encashment) */}
                  <label 
                    onClick={() => {
                      if (formData.isPaid) {
                        setFormData({ ...formData, unusedBalanceAction: 'cashout' });
                      }
                    }}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${
                      !formData.isPaid
                        ? 'bg-slate-100/60 border-slate-200 opacity-60 cursor-not-allowed'
                        : formData.unusedBalanceAction === 'cashout'
                        ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500 cursor-pointer'
                        : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="unusedBalanceAction"
                      disabled={!formData.isPaid}
                      checked={formData.unusedBalanceAction === 'cashout'}
                      onChange={() => {
                        if (formData.isPaid) setFormData({ ...formData, unusedBalanceAction: 'cashout' });
                      }}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold text-xs text-slate-900">Terkonversi ke Pembayaran (Encashment)</span>
                        {!formData.isPaid && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Hanya Gaji Dibayar
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-normal">
                        Sisa saldo kuota yang belum terpakai dikompensasikan ke uang/pembayaran di akhir periode.
                      </p>
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>

          <div>
            <Select
              label="Berlaku Untuk Peruntukan Gender"
              value={formData.genderEligibility}
              onChange={(e) => setFormData({ ...formData, genderEligibility: e.target.value as any })}
              options={[
                { value: 'All', label: 'Semua Karyawan (Pria & Wanita)' },
                { value: 'Female', label: 'Khusus Karyawan Wanita' },
                { value: 'Male', label: 'Khusus Karyawan Pria' },
              ]}
            />
          </div>

          <div>
            <label className="block text-[11px] font-normal text-slate-600 mb-1">
              Deskripsi & Aturan Kebijakan
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs font-normal rounded-xl border border-slate-200/90 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </form>

        {/* Footer: Single Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            type="submit"
            form="kebijakan-cuti-form"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.99] text-center disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : policyToEdit ? 'Simpan Perubahan' : 'Tambah Kebijakan'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

