import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  ChevronRight, 
  ExternalLink, 
  Shield, 
  Clock 
} from 'lucide-react';
import { GAVendor, OfficePermit } from './types';
import { GAStorage } from './ga-storage';
import { ModalVendor } from './modal-vendor';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions 
} from '../../context/MobileNavContext';

export const VendorPermitsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab: 'vendors' | 'permits' = (currentTabParam === 'izin' || currentTabParam === 'permits' || currentTabParam === 'legalitas') ? 'permits' : 'vendors';

  const handleTabChange = (tab: 'vendors' | 'permits') => {
    setSearchParams({ tab: tab === 'permits' ? 'izin' : 'vendor' });
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

  const expiringPermits = permits.filter(p => p.status === 'PERLU_PERPANJANGAN');

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
        className="h-8 sm:h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah Vendor</span>
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={activeTab === 'vendors' ? 'Daftar Vendor' : 'Legalitas, SLF & Izin'}
        subtitle={
          activeTab === 'vendors' 
            ? 'Database rekanan supplier, mitra logistik & kontrak' 
            : 'Sertifikat Laik Fungsi (SLF), izin genset K3 & audit gedung'
        }
        onBack={() => navigate('/ga')}
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* Main Tabs (Daftar Vendor vs Legalitas, SLF & Izin) */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => handleTabChange('vendors')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'vendors' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Daftar Vendor ({vendors.length})
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('permits')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'permits' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Legalitas, SLF & Izin ({permits.length})
          {expiringPermits.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
              {expiringPermits.length} Perpanjangan!
            </span>
          )}
        </button>
      </div>

      {activeTab === 'vendors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {v.category.replace(/_/g, ' ')}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 mt-1.5">{v.companyName}</h4>
                  <div className="text-xs text-amber-500 font-bold mt-0.5">
                    {'⭐'.repeat(v.rating)} ({v.rating}.0 / 5)
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  v.contractStatus === 'AKTIF' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  v.contractStatus === 'MENDEKATI_BERAKHIR' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  Kontrak {v.contractStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">PIC:</span>
                  <span>{v.contactPerson}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {v.phone}
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {v.email}
                  </span>
                </div>
                <div className="flex items-start gap-1 text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{v.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Terms: <strong>{v.paymentTerms}</strong></span>
                <span>Masa Kontrak: {v.contractStartDate} s/d {v.contractEndDate}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Permits Tab */
        <div className="space-y-4">
          {permits.map((pmt) => {
            const isExpiring = pmt.status === 'PERLU_PERPANJANGAN';
            return (
              <div key={pmt.id} className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3 ${
                isExpiring ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {pmt.permitNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Penerbit: {pmt.issuer}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-slate-900 mt-1">
                      {pmt.name}
                    </h4>
                  </div>

                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    isExpiring ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {pmt.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Kategori Izin:</span>
                    <span className="font-semibold text-slate-800">{pmt.category.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tanggal Terbit:</span>
                    <span className="text-slate-700">{pmt.issuedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Jatuh Tempo (Expiry):</span>
                    <span className={`font-bold ${isExpiring ? 'text-rose-600' : 'text-slate-900'}`}>{pmt.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">PIC Penanggung Jawab:</span>
                    <span className="text-slate-800 font-medium">{pmt.picName}</span>
                  </div>
                </div>

                {pmt.notes && (
                  <div className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {pmt.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Vendor or Permit */}
      <ModalVendor
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        onSaved={loadData}
      />

    </div>
  );
};
