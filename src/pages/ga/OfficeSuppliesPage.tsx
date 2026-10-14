import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Package, 
  Coffee, 
  DollarSign, 
  ChevronRight, 
  ShieldAlert, 
  Check, 
  X 
} from 'lucide-react';
import { OfficeSupplyItem, PurchaseRequest, SupplyCategory } from './types';
import { GAStorage } from './ga-storage';
import { ModalPR } from './modal-pr';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';

export const OfficeSuppliesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab: 'inventory' | 'pr' = (currentTabParam === 'pengadaan' || currentTabParam === 'pr') ? 'pr' : 'inventory';

  const handleTabChange = (newTab: 'inventory' | 'pr') => {
    setSearchParams({ tab: newTab === 'pr' ? 'pengadaan' : 'stok' });
  };

  const [supplies, setSupplies] = useState<OfficeSupplyItem[]>([]);
  const [prs, setPrs] = useState<PurchaseRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SupplyCategory | 'ALL'>('ALL');
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);

  const loadData = () => {
    setSupplies(GAStorage.getSupplies());
    setPrs(GAStorage.getPurchaseRequests());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('hrmatrix_ga_update', handleUpdate);
    return () => window.removeEventListener('hrmatrix_ga_update', handleUpdate);
  }, []);

  const filteredSupplies = useMemo(() => {
    return supplies.filter(s => {
      const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    });
  }, [supplies, selectedCategory, searchQuery]);

  const lowStockSupplies = supplies.filter(s => s.currentStock <= s.minStockLevel);
  const pendingPrCount = prs.filter(p => p.status === 'MENUNGGU_APPROVAL').length;
  const totalSupplyValue = supplies.reduce((sum, s) => sum + (s.currentStock * s.unitPrice), 0);

  const handleAdjustStock = (id: string, delta: number) => {
    GAStorage.updateSupplyStock(id, delta);
    loadData();
  };

  const handleApprovePR = (id: string) => {
    GAStorage.updatePRStatus(id, 'DISETUJUI', 'Manager HR & GA');
    loadData();
  };

  const handleMarkPurchasedPR = (id: string) => {
    GAStorage.updatePRStatus(id, 'DIBELI');
    loadData();
  };

  const handleRejectPR = (id: string) => {
    GAStorage.updatePRStatus(id, 'DITOLAK');
    loadData();
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          searchQuery
            ? 'border-amber-300 text-amber-600 bg-amber-50/50'
            : 'border-slate-200 text-slate-700 hover:text-amber-600'
        }`}
        title="Cari ATK / Perlengkapan"
      >
        <Search className="w-4 h-4" />
        {searchQuery && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setIsPrModalOpen(true)}
        className="h-8 sm:h-9 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Buat PR</span>
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={activeTab === 'inventory' ? 'Katalog Stok & Pantry' : 'Pengajuan Pengadaan'}
        subtitle={activeTab === 'inventory' ? 'Inventaris ATK, perlengkapan kantor & konsumsi pantry' : 'Formulir Purchase Request (PR) & log pengadaan'}
        onBack={() => navigate('/ga')}
      />

      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          placeholder="Cari nama item ATK, kode barang, lokasi penyimpanan..."
        />
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Nilai Stok Gudang</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
            Rp {totalSupplyValue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {supplies.length} Jenis item perlengkapan
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Stok Kritis / Menipis</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-rose-600">
            {lowStockSupplies.length} Item
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Perlu restock segera (Reorder)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">PR Menunggu Approval</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-blue-600">
            {pendingPrCount} Dokumen
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Menanti persetujuan HR/Finance
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kategori Pantry & Medis</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-emerald-600">
            Ready K3
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Galon, kopi & kotak P3K aktif
          </div>
        </div>
      </div>

      {/* Main Tabs (Katalog Stok & Pantry vs Pengajuan Pengadaan) */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => handleTabChange('inventory')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'inventory' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Katalog Stok & Pantry ({supplies.length})
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('pr')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pr' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Pengajuan Pengadaan ({prs.length})
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Filters & Search */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari kode barang, nama ATK, atau lokasi simpan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="ATK_KERTAS">Kertas & Alat Tulis</option>
                <option value="TINTA_TONER">Tinta & Toner Printer</option>
                <option value="PANTRY_KONSUMSI">Pantry & Konsumsi Kantor</option>
                <option value="KEBERSIHAN_SANITASI">Kebersihan & Sanitasi</option>
                <option value="SAFETY_FIRSTAID">Kotak P3K & Safety K3</option>
              </select>
            </div>
          </div>

          {/* Supplies List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold">
                    <th className="py-3 px-4">Kode & Nama Barang</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4 text-center">Stok Saat Ini</th>
                    <th className="py-3 px-4 text-center">Batas Minimum</th>
                    <th className="py-3 px-4 text-right">Harga Satuan</th>
                    <th className="py-3 px-4 text-center">Aksi Cepat (+/-)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSupplies.map((item) => {
                    const isLow = item.currentStock <= item.minStockLevel;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-[10px] font-bold text-slate-400">
                            {item.code}
                          </div>
                          <div className="font-bold text-slate-900 text-xs mt-0.5 flex items-center gap-1.5">
                            {item.name}
                            {isLow && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                                Restock!
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.location} • Supplier: {item.supplierName || '-'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {item.category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`font-extrabold text-sm font-mono px-2.5 py-1 rounded-lg ${
                            isLow ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-50 text-slate-800'
                          }`}>
                            {item.currentStock} {item.unit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                          {item.minStockLevel} {item.unit}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                          Rp {item.unitPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAdjustStock(item.id, -1)}
                              className="p-1 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 transition-colors cursor-pointer"
                              title="Ambil / Kurangi 1 unit"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustStock(item.id, 5)}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Tambah 5 unit"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdjustStock(item.id, 1)}
                              className="p-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer"
                              title="Tambah 1 unit"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* PR Tab */
        <div className="space-y-4">
          {prs.map((pr) => (
            <div key={pr.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {pr.prNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      {pr.requestDate}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      pr.status === 'DISETUJUI' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      pr.status === 'DIBELI' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      pr.status === 'DITOLAK' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {pr.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">
                    {pr.title}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Pemohon: <strong>{pr.requesterName}</strong> ({pr.department})
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <div className="text-[11px] text-slate-400">Total Estimasi Anggaran</div>
                  <div className="text-base font-black font-mono text-slate-900">
                    Rp {pr.estimatedCost.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-600 uppercase">Rincian Barang yang Diajukan:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {pr.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="font-medium text-slate-800">{it.itemName}</span>
                      <span className="font-bold text-amber-700 font-mono">{it.quantity} {it.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pr.justification && (
                <div className="text-xs text-slate-600 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                  &ldquo;{pr.justification}&rdquo;
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                {pr.approvedBy ? (
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Disetujui oleh {pr.approvedBy} ({pr.approvedDate})
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Menunggu approval dari Manager Divisi
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  {pr.status === 'MENUNGGU_APPROVAL' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRejectPR(pr.id)}
                        className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Tolak
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprovePR(pr.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Setujui PR
                      </button>
                    </>
                  )}

                  {pr.status === 'DISETUJUI' && (
                    <button
                      type="button"
                      onClick={() => handleMarkPurchasedPR(pr.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tandai Sudah Dibeli & Masuk Stok
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Buat PR */}
      <ModalPR
        isOpen={isPrModalOpen}
        onClose={() => setIsPrModalOpen(false)}
        onSaved={loadData}
      />

    </div>
  );
};
