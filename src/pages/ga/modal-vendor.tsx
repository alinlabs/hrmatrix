import React, { useState } from 'react';
import { X, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GAVendor, OfficePermit, VendorCategory } from './types';
import { GAStorage } from './ga-storage';
import { Modal } from '../../components/ui/Modal';

interface ModalVendorProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'vendor' | 'permit';
  onSaved?: () => void;
}

export const ModalVendor: React.FC<ModalVendorProps> = ({ isOpen, onClose, mode, onSaved }) => {
  // Vendor fields
  const [companyName, setCompanyName] = useState('');
  const [vendorCategory, setVendorCategory] = useState<VendorCategory>('SUPPLIER_ATK');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contractStartDate, setContractStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [contractEndDate, setContractEndDate] = useState(new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0]);
  const [paymentTerms, setPaymentTerms] = useState('TOP 30 Hari');
  const [rating, setRating] = useState(5);
  const [vendorNotes, setVendorNotes] = useState('');

  // Permit fields
  const [permitNumber, setPermitNumber] = useState('');
  const [permitName, setPermitName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [permitCategory, setPermitCategory] = useState<OfficePermit['category']>('GEDUNG_TATA_KOTA');
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 365*3*24*60*60*1000).toISOString().split('T')[0]);
  const [picName, setPicName] = useState('');
  const [annualCost, setAnnualCost] = useState(0);
  const [permitNotes, setPermitNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'vendor') {
      if (!companyName.trim() || !contactPerson.trim()) return;
      const newVendor: GAVendor = {
        id: `vnd-${Date.now()}`,
        companyName,
        category: vendorCategory,
        contactPerson,
        phone,
        email,
        address,
        contractStatus: 'AKTIF',
        contractStartDate,
        contractEndDate,
        paymentTerms,
        rating,
        notes: vendorNotes
      };
      GAStorage.addVendor(newVendor);
    } else {
      if (!permitName.trim() || !permitNumber.trim()) return;
      const newPermit: OfficePermit = {
        id: `pmt-${Date.now()}`,
        permitNumber,
        name: permitName,
        issuer,
        category: permitCategory,
        issuedDate,
        expiryDate,
        status: 'BERLAKU',
        picName: picName || 'General Affairs Lead',
        annualCost: annualCost || undefined,
        notes: permitNotes
      };
      GAStorage.addPermit(newPermit);
    }

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
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              mode === 'vendor' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              {mode === 'vendor' ? <Building2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {mode === 'vendor' ? 'Tambah Rekanan Vendor Baru' : 'Catat Izin Operasional Gedung'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {mode === 'vendor' ? 'Mitra pengadaan ATK, katering, AC & logistik' : 'Masa berlaku SLF, K3 genset & asuransi'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {mode === 'vendor' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Perusahaan / Vendor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Sumber Makmur Abadi"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Bidang Layanan *
                  </label>
                  <select
                    value={vendorCategory}
                    onChange={e => setVendorCategory(e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  >
                    <option value="SUPPLIER_ATK">Supplier ATK & Perlengkapan Kantor</option>
                    <option value="IT_HARDWARE_LEASING">IT Hardware & Mesin Fotocopy</option>
                    <option value="MAINTENANCE_AC_GEDUNG">Maintenance AC, HVAC & Genset</option>
                    <option value="CATERING_PANTRY">Katering Makan & Pantry Kopi/Galon</option>
                    <option value="CLEANING_SECURITY">Cleaning Service & Satpam</option>
                    <option value="LOGISTIK_EKSPEDISI">Logistik & Ekspedisi Kurir</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person (PIC) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Sales / Account Exec"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / Telp
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Syarat Pembayaran (Payment Terms)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: TOP 30 Hari / COD / Net 14"
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rating Evaluasi Layanan (1-5 Bintang)
                  </label>
                  <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-bold text-amber-600"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 - Sangat Memuaskan & Tepat Waktu</option>
                    <option value="4">⭐⭐⭐⭐ 4 - Baik & Sesuai Kontrak</option>
                    <option value="3">⭐⭐⭐ 3 - Cukup Standar</option>
                    <option value="2">⭐⭐ 2 - Kurang Memuaskan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mulai Kontrak / Kerja Sama
                  </label>
                  <input
                    type="date"
                    value={contractStartDate}
                    onChange={e => setContractStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Berakhir Kontrak (Expiry)
                  </label>
                  <input
                    type="date"
                    value={contractEndDate}
                    onChange={e => setContractEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan GA / Perjanjian Khusus
                </label>
                <textarea
                  rows={2}
                  placeholder="Diskon khusus, garansi servis, nomor kontrak PKS..."
                  value={vendorNotes}
                  onChange={e => setVendorNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Dokumen Izin / Polis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sertifikat Laik Fungsi (SLF) / Polis Asuransi PAR"
                  value={permitName}
                  onChange={e => setPermitName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Izin / Nomor Polis *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nomor resmi SK / Polis"
                    value={permitNumber}
                    onChange={e => setPermitNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Perizinan
                  </label>
                  <select
                    value={permitCategory}
                    onChange={e => setPermitCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                  >
                    <option value="GEDUNG_TATA_KOTA">Gedung & Tata Kota (SLF / PBG)</option>
                    <option value="K3_KESELAMATAN">K3 & Keselamatan Kerja (Genset/APAR/Lift)</option>
                    <option value="ASURANSI_ASET">Asuransi Property & Kendaraan</option>
                    <option value="LINGKUNGAN_AMDAL">Lingkungan & AMDAL / SPPL</option>
                    <option value="LEGAL_OPERASIONAL">Legalitas Domisili Kantor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instansi Penerbit / Asuransi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PTSP DKI / Disnaker / Allianz"
                    value={issuer}
                    onChange={e => setIssuer(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PIC Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    placeholder="Nama staf GA pengelola"
                    value={picName}
                    onChange={e => setPicName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    value={issuedDate}
                    onChange={e => setIssuedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Jatuh Tempo (Expiry) *
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biaya Retribusi / Premi Tahunan (Rp)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={annualCost || ''}
                  onChange={e => setAnnualCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Syarat Perpanjangan
                </label>
                <textarea
                  rows={2}
                  placeholder="Dokumen yang diperlukan saat perpanjangan..."
                  value={permitNotes}
                  onChange={e => setPermitNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </>
          )}

          {/* Action Buttons (SPEC_MODAL: Single Full-Width Primary Action) */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
            <button
              type="submit"
              className={`w-full h-10 ${
                mode === 'vendor' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
              } active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer`}
            >
              {mode === 'vendor' ? 'Simpan Rekanan Vendor' : 'Simpan Izin Operasional'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
