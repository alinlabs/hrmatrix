import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  UserCheck, 
  Mail, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Building2, 
  ChevronRight, 
  Package, 
  Send, 
  Inbox, 
  LogOut, 
  X 
} from 'lucide-react';
import { GuestVisitorLog, OfficeMailLog } from './types';
import { GAStorage } from './ga-storage';
import { ModalVisitor } from './modal-visitor';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions 
} from '../../context/MobileNavContext';

export const GuestbookMailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab: 'guests' | 'mails' = (currentTabParam === 'surat' || currentTabParam === 'mails' || currentTabParam === 'mail') ? 'mails' : 'guests';

  const handleTabChange = (tab: 'guests' | 'mails') => {
    setSearchParams({ tab: tab === 'mails' ? 'surat' : 'tamu' });
  };

  const [guests, setGuests] = useState<GuestVisitorLog[]>([]);
  const [mails, setMails] = useState<OfficeMailLog[]>([]);
  const [modalMode, setModalMode] = useState<'visitor' | 'mail'>('visitor');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setGuests(GAStorage.getGuests());
    setMails(GAStorage.getMails());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('hrmatrix_ga_update', handleUpdate);
    return () => window.removeEventListener('hrmatrix_ga_update', handleUpdate);
  }, []);

  const activeGuestsCount = guests.filter(g => g.status === 'CHECKED_IN').length;

  const handleCheckOut = (id: string) => {
    GAStorage.checkOutGuest(id);
    loadData();
  };

  const handleUpdateMailStatus = (id: string, status: OfficeMailLog['receivedStatus']) => {
    GAStorage.updateMailStatus(id, status);
    loadData();
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => {
          setModalMode('mail');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-violet-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Mail className="w-3.5 h-3.5 text-violet-600" />
        <span className="hidden sm:inline">Catat Surat</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setModalMode('visitor');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Check-In Tamu</span>
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* 1. APP HEADER TITLE & ACTIONS */}
      <PageHeaderTitle
        title={activeTab === 'guests' ? 'Daftar Tamu' : 'Log Surat'}
        subtitle={
          activeTab === 'guests' 
            ? 'Buku tamu resepsionis, check-in tamu & badge visitor' 
            : 'Agenda surat dinas masuk / keluar & log paket ekspedisi'
        }
        onBack={() => navigate('/ga')}
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* Main Tabs (Daftar Tamu vs Log Surat) */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => handleTabChange('guests')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'guests' ? 'border-cyan-600 text-cyan-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Daftar Tamu ({guests.length})
          {activeGuestsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-extrabold">
              {activeGuestsCount} Di Kantor
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('mails')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'mails' ? 'border-violet-600 text-violet-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          Log Surat ({mails.length})
        </button>
      </div>

      {activeTab === 'guests' ? (
        <div className="space-y-3">
          {guests.map((g) => (
            <div key={g.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold font-mono text-xs border border-cyan-200">
                    {g.visitorPassNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{g.visitorName}</h4>
                    <p className="text-xs text-slate-500">{g.institution} • {g.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    g.status === 'CHECKED_IN' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 animate-pulse' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {g.status === 'CHECKED_IN' ? 'Sedang Berkunjung' : 'Sudah Check-Out'}
                  </span>

                  {g.status === 'CHECKED_IN' && (
                    <button
                      type="button"
                      onClick={() => handleCheckOut(g.id)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Check-Out Tamu
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Tujuan Kunjungan:</span>
                  <span className="font-semibold text-slate-800">{g.destinationPerson} ({g.destinationDepartment})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Keperluan / Agenda:</span>
                  <span className="text-slate-700">{g.purpose}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Waktu Kunjungan:</span>
                  <span className="font-mono text-slate-800">In: {g.checkInTime} {g.checkOutTime ? `• Out: ${g.checkOutTime}` : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Mails Tab */
        <div className="space-y-3">
          {mails.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    m.type === 'SURAT_MASUK' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    m.type === 'SURAT_KELUAR' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {m.type === 'SURAT_MASUK' ? '📥 Surat Masuk' : m.type === 'SURAT_KELUAR' ? '📤 Surat Keluar' : '📦 Paket Ekspedisi'}
                  </span>
                  <span className="font-mono text-xs text-slate-400 font-bold">{m.referenceNumber}</span>
                  <span className="text-xs text-slate-400">{m.date}</span>
                </div>

                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-lg ${
                  m.receivedStatus === 'DISERAHKAN_KE_PENERIMA' || m.receivedStatus === 'TERKIRIM' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {m.receivedStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900">{m.subject}</h4>
              
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">{m.type === 'SURAT_KELUAR' ? 'Tujuan / Penerima:' : 'Pengirim / Asal:'}</span>
                  <span className="font-semibold text-slate-800">{m.senderOrRecipient}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PIC Internal:</span>
                  <span className="text-slate-800">{m.recipientEmployeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kurir / Ekspedisi:</span>
                  <span className="text-slate-700">{m.courierService || '-'}</span>
                </div>
              </div>

              {m.receivedStatus === 'DITERIMA_RESEPSIONIS' && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleUpdateMailStatus(m.id, 'DISERAHKAN_KE_PENERIMA')}
                    className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tandai Sudah Diserahkan ke Karyawan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Visitor / Mail */}
      <ModalVisitor
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        onSaved={loadData}
      />

    </div>
  );
};
