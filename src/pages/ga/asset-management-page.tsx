import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Users,
  FileSignature,
  X,
} from 'lucide-react';
import { OfficeAsset, AssetCategory, AssetStatus } from './types';
import { GAStorage } from './ga-storage';
import { ModalAsset } from './modal-asset';
import { Modal } from '../../components/ui/modal';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyGaAssetsAnimation from '../../assets/animations/empty-ga-assets.json';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
  PageHeaderSearch,
} from '../../context/mobile-nav-context';

const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
  ELEKTRONIK_IT: 'Elektronik & IT',
  KENDARAAN_OPERASIONAL: 'Kendaraan Operasional',
  FURNITUR_KANTOR: 'Furnitur Kantor',
  MESIN_ALAT_KERJA: 'Mesin & Alat Kerja',
  PERLENGKAPAN_GEDUNG: 'Perlengkapan Gedung',
};

export const AssetManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<OfficeAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus | 'ALL'>('ALL');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<OfficeAsset | null>(null);
  const [activeQrAsset, setActiveQrAsset] = useState<OfficeAsset | null>(null);
  const [activeBastAsset, setActiveBastAsset] = useState<OfficeAsset | null>(null);
  const hasActiveFilter = selectedCategory !== 'ALL' || selectedStatus !== 'ALL';

  const loadData = () => {
    setAssets(GAStorage.getAssets());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('hrmatrix_ga_update', handleUpdate);
    return () => window.removeEventListener('hrmatrix_ga_update', handleUpdate);
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchCat = selectedCategory === 'ALL' || a.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || a.status === selectedStatus;
      if (!matchCat || !matchStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.assetCode.toLowerCase().includes(q) ||
        (a.brandModel && a.brandModel.toLowerCase().includes(q)) ||
        (a.serialNumber && a.serialNumber.toLowerCase().includes(q)) ||
        (a.assignedToEmployeeName && a.assignedToEmployeeName.toLowerCase().includes(q)) ||
        (a.location && a.location.toLowerCase().includes(q))
      );
    });
  }, [assets, selectedCategory, selectedStatus, searchQuery]);

  const totalAssetsCount = assets.length;
  const totalValue = assets.reduce(
    (sum, a) => sum + (a.currentValue || a.purchaseCost || 0),
    0
  );
  const assignedCount = assets.filter((a) => a.status === 'DIPAKAI_KARYAWAN').length;
  const availableCount = assets.filter((a) => a.status === 'TERSEDIA').length;
  const inRepairCount = assets.filter(
    (a) => a.status === 'SEDANG_SERVIS' || a.status === 'RUSAK'
  ).length;

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus aset "${name}" dari inventaris?`)) {
      GAStorage.deleteAsset(id);
      loadData();
    }
  };

  const getStatusText = (status: AssetStatus) => {
    switch (status) {
      case 'DIPAKAI_KARYAWAN':
        return <span className="text-xs font-semibold text-blue-600">Digunakan Staf</span>;
      case 'TERSEDIA':
        return <span className="text-xs font-semibold text-emerald-600">Standby / Gudang</span>;
      case 'SEDANG_SERVIS':
        return <span className="text-xs font-semibold text-amber-600">Dalam Servis</span>;
      case 'RUSAK':
        return <span className="text-xs font-semibold text-rose-600">Rusak</span>;
      case 'DIHAPUSKAN':
        return <span className="text-xs font-semibold text-slate-500">Dihapuskan</span>;
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
        title="Cari Aset"
      >
        <Search className="w-4 h-4" />
        {(searchQuery || hasActiveFilter) && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          setEditingAsset(null);
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah Aset</span>
      </button>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-5">
      <PageHeaderTitle
        title="Inventaris Aset"
        subtitle="Pencatatan aset & inventaris"
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
          placeholder="Cari kode aset, nama perangkat, penanggung jawab..."
          onFilterClick={() => setIsFilterModalOpen(true)}
          isFilterActive={hasActiveFilter}
        />
      )}

      {assets.length === 0 ? (
        <div className="mt-1 w-full flex-1 flex flex-col">
          <InitialEmptyCard
            id="ga-assets-empty-card"
            title="Catat Aset Pertama Kantor Anda!"
            description="Pantau kepemilikan perangkat, lokasi, stiker QR, dan BAST aset secara rapi."
            buttonText="Tambah Aset Pertama"
            ButtonIcon={Plus}
            onAction={() => {
              setEditingAsset(null);
              setIsModalOpen(true);
            }}
            animationData={emptyGaAssetsAnimation}
          />
        </div>
      ) : (
        <>
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Total Nilai Aset</span>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-base sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
                Rp {totalValue.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                {totalAssetsCount} unit terdaftar
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Sedang Digunakan</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
                {assignedCount} Unit
              </div>
              <div className="text-[11px] text-slate-400">Dipegang karyawan</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Standby / Gudang</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base sm:text-xl font-bold text-emerald-600 tabular-nums">
                {availableCount} Unit
              </div>
              <div className="text-[11px] text-slate-400">Siap dialokasikan</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Perlu Perbaikan</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-base sm:text-xl font-bold text-amber-600 tabular-nums">
                {inRepairCount} Unit
              </div>
              <div className="text-[11px] text-slate-400">Dalam servis / rusak</div>
            </div>
          </div>

          {/* Asset Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold">
                    <th className="py-3 px-4">Kode & Deskripsi Aset</th>
                    <th className="py-3 px-4">Kategori & Brand</th>
                    <th className="py-3 px-4">Status & Pemegang</th>
                    <th className="py-3 px-4">Lokasi</th>
                    <th className="py-3 px-4 text-right">Nilai Buku</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">
                        <p className="font-semibold text-slate-700">
                          Tidak ada aset yang cocok dengan filter
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('ALL');
                            setSelectedStatus('ALL');
                          }}
                          className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Reset Filter & Pencarian
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-semibold text-blue-600 text-[11px]">
                            {asset.assetCode}
                          </div>
                          <div className="font-bold text-slate-900 text-xs mt-0.5">
                            {asset.name}
                          </div>
                          {asset.serialNumber && (
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              SN: {asset.serialNumber}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-700">
                            {ASSET_CATEGORY_LABELS[asset.category] || asset.category}
                          </span>
                          <div className="text-[11px] text-slate-500">
                            {asset.brandModel || '-'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{getStatusText(asset.status)}</div>
                          {asset.assignedToEmployeeName ? (
                            <div className="mt-0.5 text-slate-800 font-semibold text-xs">
                              {asset.assignedToEmployeeName}
                              {asset.assignedDepartment && (
                                <span className="text-[11px] text-slate-400 font-normal">
                                  {' · '}
                                  {asset.assignedDepartment}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="mt-0.5 text-[11px] text-slate-400">
                              Belum dialokasikan
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{asset.location}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          Rp {(asset.currentValue || asset.purchaseCost || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setActiveQrAsset(asset)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Lihat Tag QR & Barcode"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveBastAsset(asset)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Cetak Berita Acara Serah Terima (BAST)"
                            >
                              <FileSignature className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAsset(asset);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Aset"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(asset.id, asset.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Aset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ModalAsset
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assetToEdit={editingAsset}
        onSaved={loadData}
      />

      {/* Modal QR Code Label Preview (SPEC_MODAL.md) */}
      <Modal
        isOpen={Boolean(activeQrAsset)}
        onClose={() => setActiveQrAsset(null)}
        contentClassName="sm:max-w-sm flex flex-col max-h-[90vh]"
      >
        <div className="bg-white rounded-2xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                Stiker Label Barcode Aset
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Cetak identifikasi aset perusahaan
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveQrAsset(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Properti Perusahaan
              </div>
              <div className="font-bold text-sm text-slate-900">{activeQrAsset?.name}</div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                <div className="font-mono text-center">
                  <div className="text-base font-bold tracking-widest text-slate-900">
                    {activeQrAsset?.assetCode}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Tag Inventaris Kantor</div>
                </div>
              </div>
              <div className="text-xs text-slate-600 flex justify-between pt-1 gap-2">
                <span className="truncate">Lokasi: {activeQrAsset?.location}</span>
                <span className="font-semibold text-slate-800 shrink-0">
                  {activeQrAsset?.assignedToEmployeeName || 'Gudang GA'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Cetak Stiker Aset
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal BAST Preview (SPEC_MODAL.md) */}
      <Modal
        isOpen={Boolean(activeBastAsset)}
        onClose={() => setActiveBastAsset(null)}
        contentClassName="sm:max-w-xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-white rounded-2xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                Berita Acara Serah Terima Aset
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Dokumen serah terima barang inventaris kerja
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveBastAsset(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
            <div className="text-xs space-y-3 text-slate-700 leading-relaxed border p-4 rounded-xl border-slate-200 bg-slate-50/50 font-serif">
              <div className="text-center font-bold font-sans text-sm uppercase text-slate-900 border-b pb-2 border-slate-200">
                SURAT TANDA TERIMA INVENTARIS KANTOR
                <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                  Nomor: BAST/GA/{new Date().getFullYear()}/{activeBastAsset?.assetCode}
                </div>
              </div>

              <p>
                Pada hari ini, tanggal{' '}
                <strong>
                  {activeBastAsset?.handoverDate || new Date().toLocaleDateString('id-ID')}
                </strong>
                , telah diserahkan 1 (satu) unit aset inventaris kerja operasional kepada:
              </p>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 font-sans text-xs">
                <div>
                  <strong>Nama Penerima:</strong>{' '}
                  {activeBastAsset?.assignedToEmployeeName || '(Nama Karyawan)'}
                </div>
                <div>
                  <strong>Departemen:</strong>{' '}
                  {activeBastAsset?.assignedDepartment || '(Divisi)'}
                </div>
                <div>
                  <strong>Nama Barang:</strong> {activeBastAsset?.name}
                </div>
                <div>
                  <strong>Kode Aset:</strong> {activeBastAsset?.assetCode}
                </div>
                <div>
                  <strong>Merk & Model:</strong> {activeBastAsset?.brandModel || '-'}
                </div>
                <div>
                  <strong>Serial Number:</strong> {activeBastAsset?.serialNumber || '-'}
                </div>
                <div>
                  <strong>Kondisi Fisik:</strong> {activeBastAsset?.condition}
                </div>
              </div>

              <p className="text-[11px] text-slate-600">
                Penerima berkewajiban merawat dan menjaga keamanan aset tersebut sesuai ketentuan Peraturan Perusahaan. Apabila terjadi kerusakan atau kehilangan karena kelalaian, penerima wajib segera melaporkan ke General Affairs.
              </p>

              <div className="grid grid-cols-2 text-center pt-4 font-sans text-xs">
                <div>
                  <div className="text-slate-500">Yang Menyerahkan (GA)</div>
                  <div className="h-12" />
                  <div className="font-bold underline text-slate-800">General Affairs Dept</div>
                </div>
                <div>
                  <div className="text-slate-500">Yang Menerima (Karyawan)</div>
                  <div className="h-12" />
                  <div className="font-bold underline text-slate-800">
                    {activeBastAsset?.assignedToEmployeeName || 'Karyawan'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Cetak Dokumen BAST
            </button>
          </div>
        </div>
      </Modal>

      {/* Filter Aset Modal */}
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
                Filter Inventaris Aset
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Saring berdasarkan kategori & status aset
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

          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Kategori Aset
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                {[
                  { id: 'ALL', label: 'Semua Kategori' },
                  { id: 'ELEKTRONIK_IT', label: 'Elektronik & IT' },
                  { id: 'KENDARAAN_OPERASIONAL', label: 'Kendaraan Operasional' },
                  { id: 'FURNITUR_KANTOR', label: 'Furnitur Kantor' },
                  { id: 'MESIN_ALAT_KERJA', label: 'Mesin & Alat Kerja' },
                  { id: 'PERLENGKAPAN_GEDUNG', label: 'Perlengkapan Gedung' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as AssetCategory | 'ALL')}
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

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Status Aset
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                {[
                  { id: 'ALL', label: 'Semua Status' },
                  { id: 'DIPAKAI_KARYAWAN', label: 'Digunakan Karyawan' },
                  { id: 'TERSEDIA', label: 'Tersedia di Gudang' },
                  { id: 'SEDANG_SERVIS', label: 'Sedang Servis' },
                  { id: 'RUSAK', label: 'Rusak' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStatus(st.id as AssetStatus | 'ALL')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedStatus === st.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st.label}
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
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedStatus('ALL');
                }}
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
