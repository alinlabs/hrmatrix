import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { PurchaseRequest } from './types';
import { GAStorage } from './storage-ga';
import { Modal } from '../../components/ui/modal';

interface ModalPRProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ModalPR: React.FC<ModalPRProps> = ({ isOpen, onClose, onSaved }) => {
  const [requesterName, setRequesterName] = useState('');
  const [department, setDepartment] = useState('General Affairs');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<PurchaseRequest['priority']>('SEDANG');
  const [justification, setJustification] = useState('');

  const [items, setItems] = useState<
    { itemName: string; quantity: number; unit: string; estimatedPrice: number; notes?: string }[]
  >([{ itemName: '', quantity: 1, unit: 'Rim', estimatedPrice: 0 }]);

  useEffect(() => {
    if (isOpen) {
      setRequesterName('');
      setDepartment('General Affairs');
      setTitle('');
      setPriority('SEDANG');
      setJustification('');
      setItems([{ itemName: '', quantity: 1, unit: 'Rim', estimatedPrice: 0 }]);
    }
  }, [isOpen]);

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: 1, unit: 'Pcs', estimatedPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const updateItem = (index: number, field: string, val: any) => {
    setItems(items.map((it, idx) => (idx === index ? { ...it, [field]: val } : it)));
  };

  const totalCost = items.reduce(
    (acc, curr) => acc + (Number(curr.quantity) || 0) * (Number(curr.estimatedPrice) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requesterName.trim() || items.length === 0) return;

    const prNumber = `PR-GA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newPR: PurchaseRequest = {
      id: `pr-${Date.now()}`,
      prNumber,
      requestDate: new Date().toISOString().split('T')[0],
      requesterName,
      department,
      title,
      status: 'MENUNGGU_APPROVAL',
      priority,
      estimatedCost: totalCost,
      items: items.filter((it) => it.itemName.trim().length > 0),
      justification,
    };

    GAStorage.addPurchaseRequest(newPR);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-2xl flex flex-col max-h-[90vh]">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
              Buat Purchase Request (PR) Baru
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
              Pengajuan pengadaan barang, ATK, pantry & sarana kantor
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Tutup"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pemohon *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Farhan Rizki / Budi"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Departemen Pemohon *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: General Affairs / Marketing"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Pengadaan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Pengadaan Kertas A4 & Toner Bulan April"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Urgensi
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
              >
                <option value="RENDAH">Rendah (Rutin)</option>
                <option value="SEDANG">Sedang</option>
                <option value="TINGGI">Tinggi</option>
                <option value="URGENT">Mendesak / Urgent</option>
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800">
                Daftar Barang yang Diminta *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Baris
              </button>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="flex-1 min-w-[140px]">
                    <input
                      type="text"
                      required
                      placeholder="Nama barang / spesifikasi"
                      value={item.itemName}
                      onChange={(e) => updateItem(idx, 'itemName', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, 'quantity', Math.max(1, Number(e.target.value)))
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-center font-bold"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="text"
                      placeholder="Satuan"
                      value={item.unit}
                      onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-center"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      placeholder="Estimasi Harga"
                      value={item.estimatedPrice || ''}
                      onChange={(e) => updateItem(idx, 'estimatedPrice', Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-right font-mono"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
              <span className="text-xs font-bold text-slate-700">Total Estimasi Anggaran:</span>
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                Rp {totalCost.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan Pengadaan / Justifikasi Kebutuhan
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Stok di gudang menipis dan dibutuhkan untuk persiapan audit laporan keuangan..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            Ajukan Purchase Request
          </button>
        </div>
      </form>
    </Modal>
  );
};
