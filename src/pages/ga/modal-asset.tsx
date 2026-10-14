import React, { useState } from 'react';
import { X, Laptop, CheckCircle2, FileSignature, Shield, AlertCircle } from 'lucide-react';
import { OfficeAsset, AssetCategory, AssetStatus, AssetCondition } from './types';
import { GAStorage } from './ga-storage';
import { Modal } from '../../components/ui/Modal';

interface ModalAssetProps {
  isOpen: boolean;
  onClose: () => void;
  assetToEdit?: OfficeAsset | null;
  onSaved?: () => void;
}

export const ModalAsset: React.FC<ModalAssetProps> = ({ isOpen, onClose, assetToEdit, onSaved }) => {
  const [formData, setFormData] = useState<Partial<OfficeAsset>>(() => {
    if (assetToEdit) return { ...assetToEdit };
    return {
      assetCode: `AST-IT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: 'ELEKTRONIK_IT',
      brandModel: '',
      serialNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: 0,
      currentValue: 0,
      status: 'TERSEDIA',
      condition: 'SANGAT_BAIK',
      location: 'Lantai 2 - HR & GA Office',
      assignedToEmployeeName: '',
      assignedDepartment: '',
      notes: ''
    };
  });

  const [activeTab, setActiveTab] = useState<'info' | 'handover'>('info');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (assetToEdit) {
      GAStorage.updateAsset(assetToEdit.id, formData);
    } else {
      const newAsset: OfficeAsset = {
        id: `ast-${Date.now()}`,
        assetCode: formData.assetCode || `AST-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        category: formData.category || 'ELEKTRONIK_IT',
        brandModel: formData.brandModel || '-',
        serialNumber: formData.serialNumber || '-',
        purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
        purchaseCost: Number(formData.purchaseCost) || 0,
        currentValue: Number(formData.currentValue) || Number(formData.purchaseCost) || 0,
        status: formData.status || 'TERSEDIA',
        condition: formData.condition || 'SANGAT_BAIK',
        assignedToEmployeeName: formData.assignedToEmployeeName || undefined,
        assignedDepartment: formData.assignedDepartment || undefined,
        handoverDate: formData.status === 'DIPAKAI_KARYAWAN' ? (formData.handoverDate || new Date().toISOString().split('T')[0]) : undefined,
        location: formData.location || 'Kantor Pusat',
        notes: formData.notes || '',
        warrantyExpiry: formData.warrantyExpiry || undefined
      };
      GAStorage.addAsset(newAsset);
    }

    if (onSaved) onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-xl flex flex-col max-h-[90vh]"
    >
      <div className="bg-white rounded-2xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {assetToEdit ? 'Edit Data Aset Kantor' : 'Tambah Aset Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Inventarisasi & pencatatan kepemilikan perangkat kerja
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch info / handover */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-white gap-4 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'info' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            1. Detail & Spesifikasi Aset
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('handover')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'handover' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            2. Penanggung Jawab & Lokasi
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'info' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Aset (Barcode ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assetCode || ''}
                    onChange={e => setFormData({ ...formData, assetCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono font-bold text-blue-700 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Aset *
                  </label>
                  <select
                    value={formData.category || 'ELEKTRONIK_IT'}
                    onChange={e => setFormData({ ...formData, category: e.target.value as AssetCategory })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="ELEKTRONIK_IT">Elektronik & IT (Laptop/PC/Printer)</option>
                    <option value="KENDARAAN_OPERASIONAL">Kendaraan Dinas Operasional</option>
                    <option value="FURNITUR_KANTOR">Furnitur Kantor (Meja/Kursi/Lemari)</option>
                    <option value="MESIN_ALAT_KERJA">Mesin & Alat Kerja (Genset/AC/Fotocopy)</option>
                    <option value="PERLENGKAPAN_GEDUNG">Perlengkapan & Fasilitas Gedung</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Barang / Deskripsi Aset *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MacBook Pro 14 M3 Pro / Kursi Ergonomis"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Merk / Tipe / Model
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Apple / Lenovo T14 / Daikin 2PK"
                    value={formData.brandModel || ''}
                    onChange={e => setFormData({ ...formData, brandModel: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Seri (Serial Number / Plat)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: SN: C02G8492MD6R / B 1829 SZO"
                    value={formData.serialNumber || ''}
                    onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Beli
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate || ''}
                    onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Harga Perolehan (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.purchaseCost || ''}
                    onChange={e => setFormData({ ...formData, purchaseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Garansi Berakhir
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyExpiry || ''}
                    onChange={e => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Penggunaan *
                  </label>
                  <select
                    value={formData.status || 'TERSEDIA'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold text-blue-700"
                  >
                    <option value="TERSEDIA">Tersedia di Gudang/Standby</option>
                    <option value="DIPAKAI_KARYAWAN">Digunakan Karyawan</option>
                    <option value="SEDANG_SERVIS">Sedang Dalam Perbaikan / Servis</option>
                    <option value="RUSAK">Rusak</option>
                    <option value="DIHAPUSKAN">Dihapuskan / Dijual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kondisi Fisik *
                  </label>
                  <select
                    value={formData.condition || 'SANGAT_BAIK'}
                    onChange={e => setFormData({ ...formData, condition: e.target.value as AssetCondition })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="SANGAT_BAIK">Sangat Baik (100% Berfungsi Normal)</option>
                    <option value="BAIK">Baik (Ada Bekas Pemakaian Normal)</option>
                    <option value="PERLU_PERBAIKAN">Perlu Perbaikan / Servis</option>
                    <option value="RUSAK_BERAT">Rusak Berat (Tidak Berfungsi)</option>
                  </select>
                </div>
              </div>

              {formData.status === 'DIPAKAI_KARYAWAN' && (
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-3">
                  <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4" />
                    Data Penanggung Jawab Pemegang Aset (BAST)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nama Karyawan Pemegang
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={formData.assignedToEmployeeName || ''}
                        onChange={e => setFormData({ ...formData, assignedToEmployeeName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Departemen / Divisi
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Engineering / IT"
                        value={formData.assignedDepartment || ''}
                        onChange={e => setFormData({ ...formData, assignedDepartment: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Tanggal Serah Terima Aset
                    </label>
                    <input
                      type="date"
                      value={formData.handoverDate || ''}
                      onChange={e => setFormData({ ...formData, handoverDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lokasi Penempatan / Ruangan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lantai 3 - Workspace Dev / Basement Parkir"
                  value={formData.location || ''}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan GA / Kelengkapan Aksesoris
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Kelengkapan tas ransel, adaptor charger 70W, mouse bluetooth, kabel HDMI..."
                  value={formData.notes || ''}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </>
          )}

          {/* Action Buttons (SPEC_MODAL: Single Full-Width Primary Action) */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
            <button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Simpan Data Aset
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
