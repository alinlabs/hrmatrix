import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Clock,
  Package,
  Coffee,
  DollarSign,
  Check,
  Trash2,
  X,
} from 'lucide-react';
import { OfficeSupplyItem, PurchaseRequest, SupplyCategory } from './types';
import { GAStorage } from './ga-storage';
import { ModalPR } from './modal-pr';
import { ModalSupply } from './modal-supply';
import { Modal } from '../../components/ui/modal';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyGaSuppliesAnimation from '../../assets/animations/empty-ga-supplies.json';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
  PageHeaderSearch,
  PageHeaderSubbar,
} from '../../context/mobile-nav-context';
import { scrollToTop } from '../../components/layout/scroll-to-top';

const SUPPLY_CATEGORY_LABELS: Record<SupplyCategory, string> = {
  ATK_KERTAS: 'Kertas & Alat Tulis',
  TINTA_TONER: 'Tinta & Toner',
  PANTRY_KONSUMSI: 'Pantry & Konsumsi',
  KEBERSIHAN_SANITASI: 'Kebersihan & Sanitasi',
  SAFETY_FIRSTAID: 'Kotak P3K & Safety',
};

const PR_STATUS_META: Record<PurchaseRequest['status'], { label: string; colorClass: string }> = {
  DRAFT: { label: 'Draft', colorClass: 'text-slate-500' },
  MENUNGGU_APPROVAL: { label: 'Menunggu Persetujuan', colorClass: 'text-amber-600' },
  DISETUJUI: { label: 'Disetujui', colorClass: 'text-emerald-600' },
  DIBELI: { label: 'Sudah Dibeli', colorClass: 'text-blue-600' },
  DITOLAK: { label: 'Ditolak', colorClass: 'text-rose-600' },
};

export const OfficeSuppliesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab: 'inventory' | 'pr' =
    currentTabParam === 'pengadaan' || currentTabParam === 'pr' ? 'pr' : 'inventory';

  const handleTabChange = (newTab: 'inventory' | 'pr') => {
    setSearchParams({ tab: newTab === 'pr' ? 'pengadaan' : 'stok' }, { replace: true });
    scrollToTop();
  };

  const [supplies, setSupplies] = useState<OfficeSupplyItem[]>([]);
  const [prs, setPrs] = useState<PurchaseRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SupplyCategory | 'ALL'>('ALL');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const hasActiveFilter = activeTab === 'inventory' && selectedCategory !== 'ALL';

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
    return supplies.filter((s) => {
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

  const filteredPrs = useMemo(() => {
    if (!searchQuery.trim()) return prs;
    const q = searchQuery.toLowerCase();
    return prs.filter(
      (pr) =>
        pr.prNumber.toLowerCase().includes(q) ||
        pr.title.toLowerCase().includes(q) ||
        pr.requesterName.toLowerCase().includes(q) ||
        pr.department.toLowerCase().includes(q)
    );
  }, [prs, searchQuery]);

  const lowStockSupplies = supplies.filter((s) => s.currentStock <= s.minStockLevel);
  const pendingPrCount = prs.filter((p) => p.status === 'MENUNGGU_APPROVAL').length;
  const totalSupplyValue = supplies.reduce((sum, s) => sum + s.currentStock * s.unitPrice, 0);

  const handleAdjustStock = (id: string, delta: number) => {
    GAStorage.updateSupplyStock(id, delta);
    loadData();
  };

  const handleDeleteSupply = (id: string, name: string) => {
    if (window.confirm(`Hapus item stok "${name}" dari katalog?`)) {
      GAStorage.deleteSupply(id);
      loadData();
    }
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

  const handleDeletePR = (id: string, prNumber: string) => {
    if (window.confirm(`Hapus dokumen Purchase Request "${prNumber}"?`)) {
      GAStorage.deletePurchaseRequest(id);
      loadData();
    }
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          searchQuery || hasActiveFilter
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari ATK / Perlengkapan"
      >
        <Search className="w-4 h-4" />
        {(searchQuery || hasActiveFilter) && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setIsSupplyModalOpen(true)}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Package className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Tambah Stok</span>
      </button>

      <button
        type="button"
        onClick={() => setIsPrModalOpen(true)}
        className="h-8 sm:h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Buat PR</span>
      </button>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-5">
      <PageHeaderTitle
        title={activeTab === 'inventory' ? 'Stok & Pantry' : 'Pengajuan PR'}
        subtitle={
          activeTab === 'inventory'
            ? 'Stok ATK & kebutuhan kantor'
            : 'Pengajuan & log pengadaan'
        }
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
          placeholder={
            activeTab === 'inventory'
              ? 'Cari nama item ATK, kode barang, lokasi penyimpanan...'
              : 'Cari nomor PR, judul pengadaan, nama pemohon, atau divisi...'
          }
          onFilterClick={activeTab === 'inventory' ? () => setIsFilterModalOpen(true) : undefined}
          isFilterActive={hasActiveFilter}
        />
      )}

      {/* Subbar Navigation: Stok & Pantry dan Pengajuan Pengadaan */}
      <PageHeaderSubbar>
        <div className="flex items-center justify-between w-full px-3.5 md:px-8 overflow-x-auto no-scrollbar">
          {([
            { id: 'inventory' as const, label: `Stok & Pantry (${supplies.length})`, icon: Package },
            { id: 'pr' as const, label: `Pengajuan Pengadaan (${prs.length})`, icon: ShoppingBag },
          ]).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer px-2 text-center shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                    isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
                  }`}
                />
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
                )}
              </button>
            );
          })}
        </div>
      </PageHeaderSubbar>

      {activeTab === 'inventory' ? (
        supplies.length === 0 ? (
          <div className="mt-1 w-full flex-1 flex flex-col">
            <InitialEmptyCard
              id="ga-supplies-empty-card"
              title="Kelola Stok ATK & Pantry!"
              description="Pantau persediaan kertas, tinta, dan konsumsi kantor agar tidak kehabisan stok."
              buttonText="Tambah Item Stok Pertama"
              ButtonIcon={Plus}
              onAction={() => setIsSupplyModalOpen(true)}
              animationData={emptyGaSuppliesAnimation}
            />
          </div>
        ) : (
          <>
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Nilai Stok Gudang</span>
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-base sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
                  Rp {totalSupplyValue.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-slate-400 tabular-nums">
                  {supplies.length} jenis item perlengkapan
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Stok Kritis</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-base sm:text-xl font-bold text-rose-600 tabular-nums">
                  {lowStockSupplies.length} Item
                </div>
                <div className="text-[11px] text-slate-400">Perlu pengadaan ulang</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>PR Menunggu Approval</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
                  {pendingPrCount} Dokumen
                </div>
                <div className="text-[11px] text-slate-400">Menanti persetujuan</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Pantry & Medis</span>
                  <Coffee className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-base sm:text-xl font-bold text-emerald-600">
                  Tersedia
                </div>
                <div className="text-[11px] text-slate-400">Galon, kopi & P3K terpantau</div>
              </div>
            </div>

            {/* Supplies Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold">
                      <th className="py-3 px-4">Kode & Nama Barang</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4 text-center">Stok Saat Ini</th>
                      <th className="py-3 px-4 text-center">Batas Minimum</th>
                      <th className="py-3 px-4 text-right">Harga Satuan</th>
                      <th className="py-3 px-4 text-center">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSupplies.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500">
                          <p className="font-semibold text-slate-700">
                            Tidak ada item stok yang cocok dengan filter
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCategory('ALL');
                            }}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Reset Filter & Pencarian
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredSupplies.map((item) => {
                        const isLow = item.currentStock <= item.minStockLevel;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-mono text-[11px] font-semibold text-blue-600">
                                {item.code}
                              </div>
                              <div className="font-bold text-slate-900 text-xs mt-0.5">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {item.location} · Supplier: {item.supplierName || '-'}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 font-medium">
                              {SUPPLY_CATEGORY_LABELS[item.category] || item.category}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div
                                className={`font-bold text-sm font-mono tabular-nums ${
                                  isLow ? 'text-rose-600' : 'text-slate-900'
                                }`}
                              >
                                {item.currentStock} {item.unit}
                              </div>
                              {isLow && (
                                <div className="text-[11px] font-semibold text-rose-600">
                                  Perlu restock
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center text-slate-500 font-medium tabular-nums">
                              {item.minStockLevel} {item.unit}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                              Rp {item.unitPrice.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStock(item.id, -1)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 transition-colors cursor-pointer"
                                  title="Ambil / Kurangi 1 unit"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStock(item.id, 5)}
                                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                                  title="Tambah 5 unit"
                                >
                                  +5
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStock(item.id, 1)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors cursor-pointer"
                                  title="Tambah 1 unit"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSupply(item.id, item.name)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-1"
                                  title="Hapus Item Stok"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      ) : prs.length === 0 ? (
        <div className="mt-1 w-full flex-1 flex flex-col">
          <InitialEmptyCard
            id="ga-pr-empty-card"
            title="Ajukan Pengadaan Barang Pertama!"
            description="Buat Purchase Request untuk pengadaan ATK dan kebutuhan operasional dengan cepat."
            buttonText="Buat Purchase Request Pertama"
            ButtonIcon={ShoppingBag}
            onAction={() => setIsPrModalOpen(true)}
            animationData={emptyGaSuppliesAnimation}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-slate-500 shadow-2xs">
              <p className="font-semibold text-slate-700 text-xs sm:text-sm">
                Tidak ada pengajuan pengadaan yang cocok dengan pencarian
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            filteredPrs.map((pr) => {
            const statusMeta = PR_STATUS_META[pr.status] || {
              label: pr.status.replace(/_/g, ' '),
              colorClass: 'text-slate-600',
            };
            return (
              <div
                key={pr.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                      <span className="font-mono font-semibold text-blue-600">{pr.prNumber}</span>
                      {' · '}
                      {pr.requestDate}
                      {' · '}
                      <span className={`font-semibold ${statusMeta.colorClass}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5">
                      {pr.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Pemohon: <strong className="text-slate-700">{pr.requesterName}</strong> ({pr.department})
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-[11px] text-slate-400">Estimasi Anggaran</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900">
                      Rp {pr.estimatedCost.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/70 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Rincian Barang yang Diajukan
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {pr.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-200/80"
                      >
                        <span className="font-medium text-slate-800">{it.itemName}</span>
                        <span className="font-bold text-slate-900 font-mono tabular-nums">
                          {it.quantity} {it.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {pr.justification && (
                  <div className="text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                    &ldquo;{pr.justification}&rdquo;
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {pr.approvedBy ? (
                    <div className="text-xs text-emerald-600 font-semibold">
                      Disetujui oleh {pr.approvedBy} ({pr.approvedDate})
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">Menunggu approval dari Manager Divisi</div>
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
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui PR</span>
                        </button>
                      </>
                    )}

                    {pr.status === 'DISETUJUI' && (
                      <button
                        type="button"
                        onClick={() => handleMarkPurchasedPR(pr.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Tandai Sudah Dibeli & Masuk Stok
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeletePR(pr.id, pr.prNumber)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus PR"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      )}

      <ModalPR
        isOpen={isPrModalOpen}
        onClose={() => setIsPrModalOpen(false)}
        onSaved={loadData}
      />

      <ModalSupply
        isOpen={isSupplyModalOpen}
        onClose={() => setIsSupplyModalOpen(false)}
        onSaved={loadData}
      />

      {/* Filter Kategori Stok Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        contentClassName="sm:max-w-md"
        hideBottomNav={false}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0">
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Filter Stok & Pantry
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Saring item perlengkapan berdasarkan kategori
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Kategori Perlengkapan
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                {[
                  { id: 'ALL', label: 'Semua Kategori' },
                  { id: 'ATK_KERTAS', label: 'Kertas & Alat Tulis' },
                  { id: 'TINTA_TONER', label: 'Tinta & Toner Printer' },
                  { id: 'PANTRY_KONSUMSI', label: 'Pantry & Konsumsi Kantor' },
                  { id: 'KEBERSIHAN_SANITASI', label: 'Kebersihan & Sanitasi' },
                  { id: 'SAFETY_FIRSTAID', label: 'Kotak P3K & Safety K3' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as SupplyCategory | 'ALL')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white space-y-2">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Terapkan Filter
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
