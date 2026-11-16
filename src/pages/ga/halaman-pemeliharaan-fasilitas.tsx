import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  Check,
  Trash2,
  ClipboardList,
} from 'lucide-react';
import {
  FacilityMaintenanceSchedule,
  RoomBooking,
  MaintenanceTicket,
  FacilityType,
} from './types';
import { GAStorage } from './storage-ga';
import { ModalTicket } from './modal-tiket';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyGaFacilityAnimation from '../../assets/animations/empty-ga-facility.json';
import {
  PageHeaderTitle,
  DesktopHeaderActions,
  MobileHeaderActions,
  PageHeaderSubbar,
} from '../../context/mobile-nav-context';
import { scrollToTop } from '../../components/layout/scroll-to-top';

const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  AC_HVAC: 'AC & HVAC',
  LISTRIK_GENSET: 'Kelistrikan & Genset',
  PLUMBING_TOILET: 'Plumbing & Sanitasi',
  KEAMANAN_CCTV: 'Keamanan & APAR',
  RUANG_MEETING: 'Ruang Meeting',
  KENDARAAN_KANTOR: 'Kendaraan Kantor',
};

const FREQUENCY_LABELS: Record<FacilityMaintenanceSchedule['frequency'], string> = {
  MINGGUAN: 'Mingguan',
  BULANAN: 'Bulanan',
  TRIWULAN: 'Triwulan',
  SEMESTERAN: 'Semesteran',
  TAHUNAN: 'Tahunan',
};

const SCHEDULE_STATUS_META: Record<
  FacilityMaintenanceSchedule['status'],
  { label: string; colorClass: string }
> = {
  TERJADWAL: { label: 'Terjadwal', colorClass: 'text-blue-600' },
  DALAM_PROSES: { label: 'Dalam Proses', colorClass: 'text-amber-600' },
  SELESAI: { label: 'Selesai', colorClass: 'text-emerald-600' },
  TERTUNDA: { label: 'Tertunda', colorClass: 'text-rose-600' },
};

const PRIORITY_META: Record<MaintenanceTicket['priority'], { label: string; colorClass: string }> = {
  LOW: { label: 'Prioritas Rendah', colorClass: 'text-slate-500' },
  MEDIUM: { label: 'Prioritas Sedang', colorClass: 'text-amber-600' },
  HIGH: { label: 'Prioritas Tinggi', colorClass: 'text-rose-600' },
  EMERGENCY: { label: 'Darurat', colorClass: 'text-rose-700' },
};

export const FacilityMaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');

  const activeTab: 'booking' | 'maintenance' | 'ticket' = useMemo(() => {
    if (
      currentTabParam === 'servis' ||
      currentTabParam === 'service' ||
      currentTabParam === 'maintenance'
    )
      return 'maintenance';
    if (
      currentTabParam === 'kerusakan' ||
      currentTabParam === 'ticket' ||
      currentTabParam === 'keluhan'
    )
      return 'ticket';
    return 'booking';
  }, [currentTabParam]);

  const handleTabChange = (tab: 'booking' | 'maintenance' | 'ticket') => {
    const tabMap = {
      booking: 'ruangan',
      maintenance: 'servis',
      ticket: 'kerusakan',
    };
    setSearchParams({ tab: tabMap[tab] }, { replace: true });
    scrollToTop();
  };

  const [schedules, setSchedules] = useState<FacilityMaintenanceSchedule[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);

  const [modalMode, setModalMode] = useState<'ticket' | 'booking' | 'schedule'>('ticket');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setSchedules(GAStorage.getMaintenanceSchedules());
    setBookings(GAStorage.getRoomBookings());
    setTickets(GAStorage.getMaintenanceTickets());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('hrmatrix_ga_update', handleUpdate);
    return () => window.removeEventListener('hrmatrix_ga_update', handleUpdate);
  }, []);

  const openTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS');

  const handleUpdateTicketStatus = (id: string, status: MaintenanceTicket['status']) => {
    GAStorage.updateTicketStatus(id, status);
    loadData();
  };

  const handleMarkScheduleDone = (id: string) => {
    GAStorage.updateMaintenanceScheduleStatus(id, 'SELESAI');
    loadData();
  };

  const handleDeleteBooking = (id: string, roomName: string) => {
    if (window.confirm(`Batalkan & hapus reservasi "${roomName}"?`)) {
      GAStorage.deleteRoomBooking(id);
      loadData();
    }
  };

  const handleDeleteSchedule = (id: string, title: string) => {
    if (window.confirm(`Hapus jadwal servis "${title}"?`)) {
      GAStorage.deleteMaintenanceSchedule(id);
      loadData();
    }
  };

  const handleDeleteTicket = (id: string, ticketNumber: string) => {
    if (window.confirm(`Hapus tiket perbaikan "${ticketNumber}"?`)) {
      GAStorage.deleteMaintenanceTicket(id);
      loadData();
    }
  };

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => {
          setModalMode('booking');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Booking Ruang Meeting"
      >
        <Calendar className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Booking Ruang</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setModalMode('schedule');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-2xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Buat Jadwal Servis"
      >
        <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden md:inline">Jadwal Servis</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setModalMode('ticket');
          setIsModalOpen(true);
        }}
        className="h-8 sm:h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
      >
        <Wrench className="w-3.5 h-3.5" />
        <span>Lapor Kerusakan</span>
      </button>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-5">
      <PageHeaderTitle
        title={
          activeTab === 'booking'
            ? 'Jadwal Ruangan'
            : activeTab === 'maintenance'
            ? 'Jadwal Service'
            : 'Keluhan Kerusakan'
        }
        subtitle={
          activeTab === 'booking'
            ? 'Reservasi ruang & fasilitas'
            : activeTab === 'maintenance'
            ? 'Pemeliharaan berkala sarana'
            : 'Laporan & status perbaikan'
        }
        onBack={() => navigate('/ga')}
      />

      <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
      <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>

      {/* Subbar Navigation: Jadwal Ruangan, Jadwal Service dan Keluhan Kerusakan */}
      <PageHeaderSubbar>
        <div className="flex items-center justify-between w-full px-3.5 md:px-8 overflow-x-auto no-scrollbar">
          {([
            { id: 'booking' as const, label: `Jadwal Ruangan (${bookings.length})`, icon: Calendar },
            { id: 'maintenance' as const, label: `Jadwal Service (${schedules.length})`, icon: ClipboardList },
            { id: 'ticket' as const, label: `Keluhan Kerusakan (${openTickets.length} Terbuka)`, icon: Wrench },
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
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
                )}
              </button>
            );
          })}
        </div>
      </PageHeaderSubbar>

      {activeTab === 'maintenance' &&
        (schedules.length === 0 ? (
          <div className="mt-1 w-full flex-1 flex flex-col">
            <InitialEmptyCard
              id="ga-facility-schedule-empty-card"
              title="Jadwalkan Servis Fasilitas Rutin!"
              description="Catat pemeliharaan berkala AC, genset, dan APAR agar kantor selalu prima."
              buttonText="Buat Jadwal Servis Pertama"
              ButtonIcon={Wrench}
              onAction={() => {
                setModalMode('schedule');
                setIsModalOpen(true);
              }}
              animationData={emptyGaFacilityAnimation}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((sch) => {
              const statusMeta = SCHEDULE_STATUS_META[sch.status] || {
                label: sch.status,
                colorClass: 'text-slate-600',
              };
              return (
                <div
                  key={sch.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-blue-600">
                        {FREQUENCY_LABELS[sch.frequency] || sch.frequency} ·{' '}
                        {FACILITY_TYPE_LABELS[sch.facilityType] || sch.facilityType}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5 leading-snug">
                        {sch.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{sch.location}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(sch.id, sch.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Hapus Jadwal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs grid grid-cols-2 gap-2.5">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Vendor Pelaksana</span>
                      <span className="font-semibold text-slate-800">{sch.technicianVendor}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Estimasi Biaya</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        Rp {sch.estimatedCost.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Jatuh Tempo</span>
                      <span className="font-semibold text-blue-600 tabular-nums">
                        {sch.nextDueDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Terakhir Dikerjakan</span>
                      <span className="text-slate-600 tabular-nums">{sch.lastDoneDate || '-'}</span>
                    </div>
                  </div>

                  {sch.notes && (
                    <div className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/70">
                      {sch.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className={`text-xs font-semibold ${statusMeta.colorClass}`}>
                      {statusMeta.label}
                    </span>
                    {sch.status !== 'SELESAI' && (
                      <button
                        type="button"
                        onClick={() => handleMarkScheduleDone(sch.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Tandai Selesai</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {activeTab === 'booking' &&
        (bookings.length === 0 ? (
          <div className="mt-1 w-full flex-1 flex flex-col">
            <InitialEmptyCard
              id="ga-facility-booking-empty-card"
              title="Atur Reservasi Ruang Rapat!"
              description="Jadwalkan pemakaian ruang meeting dan perlengkapan presentasi tanpa bentrok."
              buttonText="Booking Ruang Pertama"
              ButtonIcon={Calendar}
              onAction={() => {
                setModalMode('booking');
                setIsModalOpen(true);
              }}
              animationData={emptyGaFacilityAnimation}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((bm) => {
              const amenities: string[] = [`${bm.attendeesCount} Orang`];
              if (bm.needsPantry) amenities.push('Pantry Kopi');
              if (bm.needsProjector) amenities.push('Proyektor');

              return (
                <div
                  key={bm.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                      <span className="font-semibold text-blue-600">
                        {bm.date} · {bm.startTime} - {bm.endTime} WIB
                      </span>
                      {' · '}
                      <span className="font-semibold text-emerald-600">
                        {bm.status === 'CONFIRMED' ? 'Terkonfirmasi' : bm.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {bm.roomName}
                    </h4>
                    <div className="text-xs text-slate-600">
                      Agenda: <strong className="text-slate-800">{bm.purpose}</strong> · Pemesan:{' '}
                      {bm.bookedByEmployeeName} ({bm.department})
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-xs font-medium text-slate-600 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-200/70 tabular-nums">
                      {amenities.join(' · ')}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteBooking(bm.id, bm.roomName)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Hapus Reservasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {activeTab === 'ticket' &&
        (tickets.length === 0 ? (
          <div className="mt-1 w-full flex-1 flex flex-col">
            <InitialEmptyCard
              id="ga-facility-ticket-empty-card"
              title="Laporkan Perbaikan Fasilitas Kantor!"
              description="Catat keluhan kerusakan sarana gedung agar tim teknisi segera menindaklanjuti."
              buttonText="Buat Tiket Perbaikan Pertama"
              ButtonIcon={Wrench}
              onAction={() => {
                setModalMode('ticket');
                setIsModalOpen(true);
              }}
              animationData={emptyGaFacilityAnimation}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((tkt) => {
              const priorityMeta = PRIORITY_META[tkt.priority] || {
                label: `Prioritas ${tkt.priority}`,
                colorClass: 'text-slate-500',
              };
              return (
                <div
                  key={tkt.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                      <span className="font-mono font-semibold text-blue-600">
                        {tkt.ticketNumber}
                      </span>
                      {' · '}
                      {tkt.createdAt}
                      {' · '}
                      <span className={`font-semibold ${priorityMeta.colorClass}`}>
                        {priorityMeta.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {tkt.status !== 'RESOLVED' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateTicketStatus(tkt.id, 'RESOLVED')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Tandai Selesai</span>
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600">
                          Selesai Diperbaiki
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteTicket(tkt.id, tkt.ticketNumber)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Tiket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-slate-900">{tkt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{tkt.description}</p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>
                      Lokasi: <strong className="text-slate-800">{tkt.location}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Pelapor: <strong className="text-slate-800">{tkt.reporterName}</strong> (
                      {tkt.department})
                    </span>
                    {tkt.assignedStaff && (
                      <>
                        <span>·</span>
                        <span>
                          Teknisi PIC: <strong className="text-slate-800">{tkt.assignedStaff}</strong>
                        </span>
                      </>
                    )}
                    {tkt.cost && (
                      <>
                        <span>·</span>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          Biaya: Rp {tkt.cost.toLocaleString('id-ID')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      <ModalTicket
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        onSaved={loadData}
      />
    </div>
  );
};
