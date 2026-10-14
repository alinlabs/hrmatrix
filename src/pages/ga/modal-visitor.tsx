import React, { useState } from 'react';
import { X, UserCheck, Mail, CheckCircle2 } from 'lucide-react';
import { GuestVisitorLog, OfficeMailLog } from './types';
import { GAStorage } from './ga-storage';

interface ModalVisitorProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'visitor' | 'mail';
  onSaved?: () => void;
}

export const ModalVisitor: React.FC<ModalVisitorProps> = ({ isOpen, onClose, mode, onSaved }) => {
  // Visitor fields
  const [visitorName, setVisitorName] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [destinationPerson, setDestinationPerson] = useState('');
  const [destinationDepartment, setDestinationDepartment] = useState('HR & GA');
  const [purpose, setPurpose] = useState('');
  const [identityType, setIdentityType] = useState<GuestVisitorLog['identityType']>('KTP');
  const [visitorPassNumber, setVisitorPassNumber] = useState(`VIS-${Math.floor(100 + Math.random() * 900)}`);
  const [temperatureOrNotes, setTemperatureOrNotes] = useState('');

  // Mail fields
  const [mailType, setMailType] = useState<OfficeMailLog['type']>('SURAT_MASUK');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [senderOrRecipient, setSenderOrRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [recipientEmployeeName, setRecipientEmployeeName] = useState('');
  const [courierService, setCourierService] = useState('JNE Express');
  const [mailNotes, setMailNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (mode === 'visitor') {
      if (!visitorName.trim() || !destinationPerson.trim()) return;
      const newGuest: GuestVisitorLog = {
        id: `gst-${Date.now()}`,
        visitorName,
        institution: institution || 'Pribadi / Umum',
        phone,
        destinationPerson,
        destinationDepartment,
        purpose,
        visitorPassNumber,
        checkInTime: nowStr,
        status: 'CHECKED_IN',
        identityType,
        temperatureOrNotes
      };
      GAStorage.addGuest(newGuest);
    } else {
      if (!subject.trim() || !senderOrRecipient.trim()) return;
      const newMail: OfficeMailLog = {
        id: `ml-${Date.now()}`,
        type: mailType,
        referenceNumber: referenceNumber || `LOG-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        senderOrRecipient,
        subject,
        recipientEmployeeName,
        courierService,
        receivedStatus: mailType === 'SURAT_KELUAR' ? 'TERKIRIM' : 'DITERIMA_RESEPSIONIS',
        receivedAt: nowStr,
        notes: mailNotes
      };
      GAStorage.addMail(newMail);
    }

    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              mode === 'visitor' ? 'bg-cyan-100 text-cyan-700' : 'bg-violet-100 text-violet-700'
            }`}>
              {mode === 'visitor' ? <UserCheck className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {mode === 'visitor' ? 'Registrasi Buku Tamu & Visitor Pass' : 'Pencatatan Surat Masuk/Keluar & Paket'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'visitor' ? 'Log penerimaan tamu resepsionis kantor' : 'Buku agenda surat resmi kantor dan paket kurir'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {mode === 'visitor' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Tamu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ir. Ahmad Subagyo"
                    value={visitorName}
                    onChange={e => setVisitorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Asal Instansi / Perusahaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Telkom / Disnaker"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Kontak / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ID Badge Pass
                  </label>
                  <input
                    type="text"
                    value={visitorPassNumber}
                    onChange={e => setVisitorPassNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold text-cyan-700 bg-slate-50 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Karyawan yang Dituju *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama karyawan / penerima"
                    value={destinationPerson}
                    onChange={e => setDestinationPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Departemen Tujuan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: HR / IT / Direksi"
                    value={destinationDepartment}
                    onChange={e => setDestinationDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Maksud & Keperluan Kunjungan *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Diskusi penawaran internet dedicated / interview kerja..."
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanda Pengenal Dititipkan
                  </label>
                  <select
                    value={identityType}
                    onChange={e => setIdentityType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  >
                    <option value="KTP">KTP Elektronik</option>
                    <option value="SIM">SIM (A/C)</option>
                    <option value="PASSPORT">Paspor</option>
                    <option value="ID_CARD">ID Card Perusahaan Tamu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Khusus / Suhu
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 36.4 C / Tamu VIP"
                    value={temperatureOrNotes}
                    onChange={e => setTemperatureOrNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jenis Dokumen / Paket *
                  </label>
                  <select
                    value={mailType}
                    onChange={e => setMailType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-bold text-violet-700"
                  >
                    <option value="SURAT_MASUK">Surat Masuk Resmi (Kedinasan/Vendor)</option>
                    <option value="SURAT_KELUAR">Surat Keluar Resmi Perusahaan</option>
                    <option value="PAKET_EKSPEDISI">Paket Barang / Dokumen Ekspedisi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Surat / Nomor Resi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 042/DISNAKER/2026 atau Resi JNE"
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {mailType === 'SURAT_KELUAR' ? 'Tujuan Surat / Penerima Eksternal *' : 'Pengirim / Asal Instansi *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Disnaker Provinsi DKI / PT Allianz"
                  value={senderOrRecipient}
                  onChange={e => setSenderOrRecipient(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Perihal / Isi Ringkas Surat *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Surat Pemberitahuan Audit WLKP / Tagihan Invoice"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Penerima Internal / PIC *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Hendra Wijaya (HR)"
                    value={recipientEmployeeName}
                    onChange={e => setRecipientEmployeeName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kurir / Ekspedisi Pengantar
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pos Kilat / JNE / Kurir Internal"
                    value={courierService}
                    onChange={e => setCourierService(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Resepsionis
                </label>
                <textarea
                  rows={2}
                  placeholder="Lokasi paket disimpan di frontdesk, paraf penerima..."
                  value={mailNotes}
                  onChange={e => setMailNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === 'visitor' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {mode === 'visitor' ? 'Check-In Tamu Baru' : 'Catat Log Surat / Paket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
