import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { OfficeSupplyItem, SupplyCategory } from './types';
import { GAStorage } from './ga-storage';
import { Modal } from '../../components/ui/Modal';

interface ModalSupplyProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ModalSupply: React.FC<ModalSupplyProps> = ({ isOpen, onClose, onSaved }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SupplyCategory>('ATK_KERTAS');
  const [currentStock, setCurrentStock] = useState(10);
  const [minStockLevel, setMinStockLevel] = useState(5);
  const [unit, setUnit] = useState('Rim');
  const [unitPrice, setUnitPrice] = useState(50000);
  const [location, setLocation] = useState('Lemari ATK Lantai 2');
  const [supplierName, setSupplierName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCode(`ATK-${Math.floor(100 + Math.random() * 900)}`);
      setName('');
      setCategory('ATK_KERTAS');
      setCurrentStock(10);
      setMinStockLevel(5);
      setUnit('Rim');
      setUnitPrice(50000);
      setLocation('Lemari ATK Lantai 2');
      setSupplierName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: OfficeSupplyItem = {
      id: `sup-${Date.now()}`,
      code: code.trim() || `ATK-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      category,
      currentStock: Math.max(0, Number(currentStock) || 0),
      minStockLevel: Math.max(0, Number(minStockLevel) || 0),
      unit: unit.trim() || 'Pcs',
      unitPrice: Math.max(0, Number(unitPrice) || 0),
      location: location.trim() || 'Gudang ATK',
      lastRestockedDate: new Date().toISOString().split('T')[0],
      supplierName: supplierName.trim() || undefined,
    };

    GAStorage.addSupply(newItem);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-lg flex flex-col max-h-[90vh]"
    >
      <div className="bg-white rounded-2xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Tambah Item Stok ATK & Pantry
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pencatatan persediaan perlengkapan operasional & konsumsi
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kode Barang *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono font-bold text-amber-700 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupplyCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-medium"
              >
                <option value="ATK_KERTAS">Kertas & Alat Tulis</option>
                <option value="TINTA_TONER">Tinta & Toner Printer</option>
                <option value="PANTRY_KONSUMSI">Pantry & Konsumsi Kantor</option>
                <option value="KEBERSIHAN_SANITASI">Kebersihan & Sanitasi</option>
                <option value="SAFETY_FIRSTAID">Kotak P3K & Safety K3</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Barang / Perlengkapan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kertas HVS PaperOne A4 80gr / Air Galon 19L"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stok Awal *
              </label>
              <input
                type="number"
                min="0"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Batas Minimum *
              </label>
              <input
                type="number"
                min="0"
                required
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Satuan *
              </label>
              <input
                type="text"
                required
                placeholder="Rim / Pcs / Box"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Harga Satuan
              </label>
              <input
                type="number"
                min="0"
                value={unitPrice || ''}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lokasi Penyimpanan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Lemari ATK Lantai 2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Supplier / Vendor
              </label>
              <input
                type="text"
                placeholder="Contoh: CV Sumber Makmur"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
            <button
              type="submit"
              className="w-full h-10 bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Simpan Item Stok
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
