import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserCheck, Mail, Plus, Trash2 } from 'lucide-react';
import { GuestVisitorLog, OfficeMailLog } from './types';
import { GAStorage } from './storage-ga';
import { ModalVisitor } from './modal-tamu';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyGaGuestbookAnimation from '../../assets/animations/empty-ga-guestbook.json';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
  PageHeaderSubbar,
} from '../../context/mobile-nav-context';
import { scrollToTop } from '../../components/layout/scroll-to-top';

const MAIL_TYPE_LABELS: Record<OfficeMailLog['type'], string> = {
  SURAT_MASUK: 'Surat Masuk',
  SURAT_KELUAR: 'Surat Keluar',
  PAKET_EKSPEDISI: 'Paket Ekspedisi',
};

const MAIL_STATUS_META: Record<
  OfficeMailLog['receivedStatus'],
  { label: string; colorClass: string }
> = {
  DITERIMA_RESEPSIONIS: { label: 'Diterima Resepsionis', colorClass: 'text-amber-600' },
  DISERAHKAN_KE_PENERIMA: { label: 'Diserahkan ke Penerima', colorClass: 'text-emerald-600' },
  TERKIRIM: { label: 'Terkirim', colorClass: 'text-emerald-600' },
};

export const GuestbookMailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const activeTab: 'guests' | 'mails' =
    currentTabParam === 'surat' || currentTabParam === 'mails' || currentTabParam === 'mail'
      ? 'mails'
      : 'guests';

  const handleTabChange = (tab: 'guests' | 'mails') => {
    setSearchParams({ tab: tab === 'mails' ? 'surat' : 'tamu' }, { replace: true });
    scrollToTop();
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

  const activeGuestsCount = guests.filter((g) => g.status === 'CHECKED_IN').length;

  const handleCheckOut = (id: string) => {
    GAStorage.checkOutGuest(id);
    loadData();
  };

  const handleUpdateMailStatus = (id: string, status: OfficeMailLog['receivedStatus']) => {
    GAStorage.updateMailStatus(id, status);
    loadData();
  };

  const handleDeleteGuest = (id: string, name: string) => {
    if (window.confirm(`Hapus catatan tamu "${name}"?`)) {
      GAStorage.deleteGuest(id);
      loadData();
    }
  };

  const handleDeleteMail = (id: string, subject: string) => {
    if (window.confirm(`Hapus arsip surat "${subject}"?`)) {
      GAStorage.deleteMail(id);
      loadData();
    }
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => {
          setModalMode('mail');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Mail className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Catat Surat</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setModalMode('visitor');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Check-In Tamu</span>
      </button>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-5">
      <PageHeaderTitle
        title={activeTab === 'guests' ? 'Daftar Tamu' : 'Log Surat'}
        subtitle={
          activeTab === 'guests'
            ? 'Registrasi tamu & visitor'
            : 'Agenda surat masuk & keluar'
        }
        onBack={() => navigate('/ga')}
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* Subbar Navigation: Daftar Tamu dan Log Surat */}
      <PageHeaderSubbar>
        <div className="flex items-center justify-between w-full px-3.5 md:px-8 overflow-x-auto no-scrollbar">
          {([
            {
              id: 'guests' as const,
              icon: UserCheck,
              content: (
                <>
                  Daftar Tamu ({guests.length})
                  {activeGuestsCount > 0 && (
                    <span className="text-blue-600 font-semibold ml-1 tabular-nums">
                      · {activeGuestsCount} Di Kantor
                    </span>
                  )}
                </>
              ),
            },
            {
              id: 'mails' as const,
              icon: Mail,
              content: <>Log Surat ({mails.length})</>,
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

      {activeTab === 'guests' ? (
        guests.length === 0 ? (
          <div className="mt-1 w-full flex-1 flex flex-col">
            <InitialEmptyCard
              id="ga-guests-empty-card"
              title="Catat Kunjungan Tamu Resepsionis!"
              description="Kelola registrasi tamu masuk, tujuan kunjungan, dan nomor visitor pass dengan tertib."
              buttonText="Check-In Tamu Pertama"
              ButtonIcon={UserCheck}
              onAction={() => {
                setModalMode('visitor');
                setIsModalOpen(true);
              }}
              animationData={emptyGaGuestbookAnimation}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {guests.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500">
                      <span className="font-mono font-semibold text-blue-600">
                        {g.visitorPassNumber}
                      </span>
                      {' · '}
                      <span
                        className={`font-semibold ${
                          g.status === 'CHECKED_IN' ? 'text-blue-600' : 'text-slate-500'
                        }`}
                      >
                        {g.status === 'CHECKED_IN' ? 'Sedang Berkunjung' : 'Sudah Check-Out'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5">
                      {g.visitorName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {g.institution} · {g.phone || '-'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {g.status === 'CHECKED_IN' && (
                      <button
                        type="button"
                        onClick={() => handleCheckOut(g.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Check-Out Tamu
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteGuest(g.id, g.visitorName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Log Tamu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tujuan Kunjungan</span>
                    <span className="font-semibold text-slate-800">
                      {g.destinationPerson} ({g.destinationDepartment})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Keperluan / Agenda</span>
                    <span className="text-slate-700">{g.purpose}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Waktu Kunjungan</span>
                    <span className="font-mono text-slate-800 tabular-nums">
                      In: {g.checkInTime} {g.checkOutTime ? `· Out: ${g.checkOutTime}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : mails.length === 0 ? (
        <div className="mt-1 w-full flex-1 flex flex-col">
          <InitialEmptyCard
            id="ga-mails-empty-card"
            title="Arsipkan Agenda Surat & Paket!"
            description="Catat surat masuk, surat keluar, dan paket ekspedisi agar tidak ada yang terlewat."
            buttonText="Catat Surat Pertama"
            ButtonIcon={Mail}
            onAction={() => {
              setModalMode('mail');
              setIsModalOpen(true);
            }}
            animationData={emptyGaGuestbookAnimation}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {mails.map((m) => {
            const statusMeta = MAIL_STATUS_META[m.receivedStatus] || {
              label: m.receivedStatus.replace(/_/g, ' '),
              colorClass: 'text-slate-600',
            };
            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                      <span className="font-semibold text-blue-600">
                        {MAIL_TYPE_LABELS[m.type] || m.type}
                      </span>
                      {' · '}
                      <span className="font-mono">{m.referenceNumber}</span>
                      {' · '}
                      {m.date}
                      {' · '}
                      <span className={`font-semibold ${statusMeta.colorClass}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5">
                      {m.subject}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMail(m.id, m.subject)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer self-end sm:self-start shrink-0"
                    title="Hapus Log Surat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      {m.type === 'SURAT_KELUAR' ? 'Tujuan / Penerima' : 'Pengirim / Asal'}
                    </span>
                    <span className="font-semibold text-slate-800">{m.senderOrRecipient}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">PIC Internal</span>
                    <span className="text-slate-800">{m.recipientEmployeeName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kurir / Ekspedisi</span>
                    <span className="text-slate-700">{m.courierService || '-'}</span>
                  </div>
                </div>

                {m.receivedStatus === 'DITERIMA_RESEPSIONIS' && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateMailStatus(m.id, 'DISERAHKAN_KE_PENERIMA')}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      Tandai Sudah Diserahkan
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ModalVisitor
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        onSaved={loadData}
      />
    </div>
  );
};
