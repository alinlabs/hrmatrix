import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Laptop, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit3, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Users, 
  Building2, 
  FileSignature, 
  ShieldCheck,
  ChevronRight,
  ArrowUpDown,
  Printer,
  X
} from 'lucide-react';
import { OfficeAsset, AssetCategory, AssetStatus } from './types';
import { GAStorage } from './ga-storage';
import { ModalAsset } from './modal-asset';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';

export const AssetManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<OfficeAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<OfficeAsset | null>(null);
  const [activeQrAsset, setActiveQrAsset] = useState<OfficeAsset | null>(null);
  const [activeBastAsset, setActiveBastAsset] = useState<OfficeAsset | null>(null);

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
    return assets.filter(a => {
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

  // Calculations
  const totalAssetsCount = assets.length;
  const totalValue = assets.reduce((sum, a) => sum + (a.currentValue || a.purchaseCost || 0), 0);
  const assignedCount = assets.filter(a => a.status === 'DIPAKAI_KARYAWAN').length;
  const availableCount = assets.filter(a => a.status === 'TERSEDIA').length;
  const inRepairCount = assets.filter(a => a.status === 'SEDANG_SERVIS' || a.status === 'RUSAK').length;

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus aset "${name}" dari inventaris?`)) {
      GAStorage.deleteAsset(id);
      loadData();
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'DIPAKAI_KARYAWAN':
        return <span className="text-xs font-semibold text-blue-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" />Digunakan Staf</span>;
      case 'TERSEDIA':
        return <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />Standby / Gudang</span>;
      case 'SEDANG_SERVIS':
        return <span className="text-xs font-semibold text-amber-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-600" />Dalam Servis</span>;
      case 'RUSAK':
        return <span className="text-xs font-semibold text-rose-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-600" />Rusak</span>;
      case 'DIHAPUSKAN':
        return <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Dihapuskan</span>;
    }
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          searchQuery
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari Aset"
      >
        <Search className="w-4 h-4" />
        {searchQuery && (
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
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* 1. APP HEADER TITLE & ACTIONS */}
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
        />
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Nilai Aset</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
            Rp {totalValue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {totalAssetsCount} Total unit terdaftar
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sedang Digunakan</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-blue-600">
            {assignedCount} Unit
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Dipegang karyawan & staf
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Standby / Gudang</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-emerald-600">
            {availableCount} Unit
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Siap dialokasikan
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Perlu Perbaikan</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-amber-600">
            {inRepairCount} Unit
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Dalam servis / rusak
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari barcode ID, nama aset, merk, serial number, atau nama pemegang..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="ELEKTRONIK_IT">Elektronik & IT</option>
              <option value="KENDARAAN_OPERASIONAL">Kendaraan Operasional</option>
              <option value="FURNITUR_KANTOR">Furnitur Kantor</option>
              <option value="MESIN_ALAT_KERJA">Mesin & Alat Kerja</option>
              <option value="PERLENGKAPAN_GEDUNG">Perlengkapan Gedung</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">Semua Status</option>
              <option value="DIPAKAI_KARYAWAN">Digunakan Karyawan</option>
              <option value="TERSEDIA">Tersedia di Gudang</option>
              <option value="SEDANG_SERVIS">Sedang Servis</option>
              <option value="RUSAK">Rusak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold">
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
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Laptop className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Tidak ada data aset yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-blue-700 text-[11px]">
                        {asset.assetCode}
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">
                        {asset.name}
                      </div>
                      {asset.serialNumber && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          SN: {asset.serialNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">
                        {asset.category.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[11px] text-slate-500">
                        {asset.brandModel || '-'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{getStatusBadge(asset.status)}</div>
                      {asset.assignedToEmployeeName ? (
                        <div className="mt-1 text-slate-800 font-semibold flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {asset.assignedToEmployeeName}
                          {asset.assignedDepartment && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({asset.assignedDepartment})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1 text-[11px] text-slate-400 italic">
                          Belum dialokasikan
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {asset.location}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                      Rp {(asset.currentValue || asset.purchaseCost || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveQrAsset(asset)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Tag QR & Barcode"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveBastAsset(asset)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
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
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Modal Add/Edit */}
      <ModalAsset
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assetToEdit={editingAsset}
        onSaved={loadData}
      />

      {/* Modal QR Code Label Preview */}
      {activeQrAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-600" />
                Stiker Label Barcode Aset
              </h4>
              <button 
                type="button"
                onClick={() => setActiveQrAsset(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">PROPERTI PERUSAHAAN</div>
              <div className="font-bold text-sm text-slate-900">{activeQrAsset.name}</div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                <div className="font-mono text-center">
                  <div className="text-base font-black tracking-widest text-slate-800">{activeQrAsset.assetCode}</div>
                  <div className="text-[9px] text-slate-400 mt-1">HRMatrix GA Tag System</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between pt-1">
                <span>Lokasi: {activeQrAsset.location}</span>
                <span className="font-semibold">{activeQrAsset.assignedToEmployeeName || 'Gudang GA'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Stiker Aset
            </button>
          </div>
        </div>
      )}

      {/* Modal BAST Preview */}
      {activeBastAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-emerald-600" />
                Berita Acara Serah Terima Aset (BAST)
              </h4>
              <button 
                type="button"
                onClick={() => setActiveBastAsset(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-700 leading-relaxed border p-4 rounded-xl border-slate-200 bg-slate-50/50 font-serif">
              <div className="text-center font-bold font-sans text-sm uppercase text-slate-900 border-b pb-2 border-slate-200">
                SURAT TANDA TERIMA INVENTARIS KANTOR
                <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                  Nomor: BAST/GA/{new Date().getFullYear()}/{activeBastAsset.assetCode}
                </div>
              </div>

              <p>
                Pada hari ini, tanggal <strong>{activeBastAsset.handoverDate || new Date().toLocaleDateString('id-ID')}</strong>, telah diserahkan 1 (satu) unit aset inventaris kerja operasional kepada:
              </p>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 font-sans text-xs">
                <div><strong>Nama Penerima:</strong> {activeBastAsset.assignedToEmployeeName || '(Nama Karyawan)'}</div>
                <div><strong>Departemen:</strong> {activeBastAsset.assignedDepartment || '(Divisi)'}</div>
                <div><strong>Nama Barang:</strong> {activeBastAsset.name}</div>
                <div><strong>Kode Aset:</strong> {activeBastAsset.assetCode}</div>
                <div><strong>Merk & Model:</strong> {activeBastAsset.brandModel || '-'}</div>
                <div><strong>Serial Number:</strong> {activeBastAsset.serialNumber || '-'}</div>
                <div><strong>Kondisi Fisik:</strong> {activeBastAsset.condition}</div>
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
                  <div className="font-bold underline text-slate-800">{activeBastAsset.assignedToEmployeeName || 'Karyawan'}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Cetak Dokumen BAST
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
