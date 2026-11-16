import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { GAVendor, OfficePermit, VendorCategory } from './types';
import { GAStorage } from './storage-ga';
import { ModalVendor } from './modal-vendor';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyGaVendorAnimation from '../../assets/animations/empty-ga-vendor.json';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
  PageHeaderSubbar,
} from '../../context/mobile-nav-context';
import { scrollToTop } from '../../components/layout/scroll-to-top';

const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  SUPPLIER_ATK: 'Supplier ATK & Perlengkapan',
  IT_HARDWARE_LEASING: 'IT Hardware & Mesin',
  MAINTENANCE_AC_GEDUNG: 'Maintenance AC & Gedung',
  CATERING_PANTRY: 'Katering & Pantry',
  CLEANING_SECURITY: 'Kebersihan & Keamanan',
  LOGISTIK_EKSPEDISI: 'Logistik & Ekspedisi',
};

const CONTRACT_STATUS_META: Record<GAVendor['contractStatus'], { label: string; colorClass: string }> = {
  AKTIF: { label: 'Kontrak Aktif', colorClass: 'text-emerald-600' },
  MENDEKATI_BERAKHIR: { label: 'Mendekati Berakhir', colorClass: 'text-amber-600' },
  KADALUWARSA: { label: 'Kedaluwarsa', colorClass: 'text-rose-600' },
  TIDAK_AKTIF: { label: 'Tidak Aktif', colorClass: 'text-slate-500' },
};

const PERMIT_CATEGORY_LABELS: Record<OfficePermit['category'], string> = {
  GEDUNG_TATA_KOTA: 'Gedung & Tata Kota',
  K3_KESELAMATAN: 'K3 & Keselamatan',
  ASURANSI_ASET: 'Asuransi Aset',
  LINGKUNGAN_AMDAL: 'Lingkungan & AMDAL',
  LEGAL_OPERASIONAL: 'Legal Operasional',
};

export const VendorPermitsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab: 'vendors' | 'permits' =
    currentTabParam === 'izin' || currentTabParam === 'permits' || currentTabParam === 'legalitas'
      ? 'permits'
      : 'vendors';

  const handleTabChange = (tab: 'vendors' | 'permits') => {
    setSearchParams({ tab: tab === 'permits' ? 'izin' : 'vendor' }, { replace: true });
    scrollToTop();
  };

  const [vendors, setVendors] = useState<GAVendor[]>([]);
  const [permits, setPermits] = useState<OfficePermit[]>([]);
  const [modalMode, setModalMode] = useState<'vendor' | 'permit'>('vendor');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setVendors(GAStorage.getVendors());
    setPermits(GAStorage.getPermits());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('hrmatrix_ga_update', handleUpdate);
    return () => window.removeEventListener('hrmatrix_ga_update', handleUpdate);
  }, []);

  const expiringPermits = permits.filter((p) => p.status === 'PERLU_PERPANJANGAN');

  const handleDeleteVendor = (id: string, companyName: string) => {
    if (window.confirm(`Hapus vendor "${companyName}" dari daftar rekanan?`)) {
      GAStorage.deleteVendor(id);
      loadData();
    }
  };

  const handleDeletePermit = (id: string, name: string) => {
    if (window.confirm(`Hapus dokumen izin "${name}"?`)) {
      GAStorage.deletePermit(id);
      loadData();
    }
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => {
          setModalMode('permit');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Catat Izin</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setModalMode('vendor');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah Vendor</span>
      </button>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-5">
      <PageHeaderTitle
        title={activeTab === 'vendors' ? 'Daftar Vendor' : 'Legalitas & Izin'}
        subtitle={
          activeTab === 'vendors'
            ? 'Rekanan supplier & kontrak'
            : 'Izin SLF, K3 & operasional'
        }
        onBack={() => navigate('/ga')}
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* Subbar Navigation: Daftar Vendor dan Legalitas, SLF & Izin */}
      <PageHeaderSubbar>
        <div className="flex items-center justify-between w-full px-3.5 md:px-8 overflow-x-auto no-scrollbar">
          {([
            {
              id: 'vendors' as const,
              icon: Building2,
              content: <>Daftar Vendor ({vendors.length})</>,
            },
            {
              id: 'permits' as const,
              icon: ShieldCheck,
              content: (
                <>
                  Legalitas, SLF & Izin ({permits.length})
                  {expiringPermits.length > 0 && (
                    <span className="text-rose-600 font-semibold ml-1 tabular-nums">
                      · {expiringPermits.length} Perlu Perpanjangan
                    </span>
                  )}
                </>
              ),
            },
          ]).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer px-2 sm:px-3 text-center shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
                <span>{tab.content}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
                )}
              </button>
            );
          })}
        </div>
      </PageHeaderSubbar>

      {activeTab === 'vendors' ? (
        vendors.length === 0 ? (
          <div className="mt-1 w-full flex-1 flex flex-col">
            <InitialEmptyCard
              id="ga-vendors-empty-card"
              title="Bangun Daftar Rekanan Vendor!"
              description="Simpan kontak supplier, mitra servis, dan masa berlaku kontrak kerja sama."
              buttonText="Tambah Vendor Pertama"
              ButtonIcon={Building2}
              onAction={() => {
                setModalMode('vendor');
                setIsModalOpen(true);
              }}
              animationData={emptyGaVendorAnimation}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((v) => {
              const contractMeta = CONTRACT_STATUS_META[v.contractStatus] || {
                label: v.contractStatus.replace(/_/g, ' '),
                colorClass: 'text-slate-600',
              };
              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-slate-500">
                        <span className="text-blue-600 font-semibold">
                          {VENDOR_CATEGORY_LABELS[v.category] || v.category}
                        </span>
                        {' · '}
                        <span className={`font-semibold ${contractMeta.colorClass}`}>
                          {contractMeta.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5 leading-snug">
                        {v.companyName}
                      </h4>
                      <div className="text-xs text-slate-500 font-medium mt-0.5 tabular-nums">
                        Skor Evaluasi Layanan: <strong className="text-slate-800">{v.rating}.0 / 5</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteVendor(v.id, v.companyName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Hapus Vendor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Contact Person (PIC)</span>
                      <span className="font-semibold text-slate-800">{v.contactPerson}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Telepon / WhatsApp</span>
                      <span className="font-mono text-slate-700 tabular-nums">{v.phone || '-'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[11px] text-slate-400 block">Email</span>
                      <span className="text-slate-700 break-all">{v.email || '-'}</span>
                    </div>
                    {v.address && (
                      <div className="sm:col-span-2 pt-1.5 border-t border-slate-200/60">
                        <span className="text-[11px] text-slate-400 block">Alamat</span>
                        <span className="text-slate-600">{v.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>
                      Terms: <strong className="text-slate-700">{v.paymentTerms}</strong>
                    </span>
                    <span className="tabular-nums">
                      Masa Kontrak: {v.contractStartDate} s/d {v.contractEndDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : permits.length === 0 ? (
        <div className="mt-1 w-full flex-1 flex flex-col">
          <InitialEmptyCard
            id="ga-permits-empty-card"
            title="Catat Izin Operasional Gedung!"
            description="Pantau masa berlaku SLF, izin K3, dan asuransi aset sebelum jatuh tempo."
            buttonText="Catat Izin Pertama"
            ButtonIcon={ShieldCheck}
            onAction={() => {
              setModalMode('permit');
              setIsModalOpen(true);
            }}
            animationData={emptyGaVendorAnimation}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {permits.map((pmt) => {
            const isExpiring = pmt.status === 'PERLU_PERPANJANGAN';
            return (
              <div
                key={pmt.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500">
                      <span className="font-mono font-semibold text-blue-600">
                        {pmt.permitNumber}
                      </span>
                      {' · '}
                      Penerbit: {pmt.issuer || '-'}
                      {' · '}
                      <span
                        className={`font-semibold ${
                          isExpiring ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {isExpiring ? 'Perlu Perpanjangan' : 'Berlaku'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5">
                      {pmt.name}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePermit(pmt.id, pmt.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer self-end sm:self-start shrink-0"
                    title="Hapus Dokumen Izin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Kategori Izin</span>
                    <span className="font-semibold text-slate-800">
                      {PERMIT_CATEGORY_LABELS[pmt.category] || pmt.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Tanggal Terbit</span>
                    <span className="text-slate-700 tabular-nums">{pmt.issuedDate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Jatuh Tempo</span>
                    <span
                      className={`font-bold tabular-nums ${
                        isExpiring ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {pmt.expiryDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">PIC Penanggung Jawab</span>
                    <span className="text-slate-800 font-medium">{pmt.picName}</span>
                  </div>
                </div>

                {pmt.notes && (
                  <div className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/70">
                    {pmt.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ModalVendor
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        onSaved={loadData}
      />
    </div>
  );
};
